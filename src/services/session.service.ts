import prisma from '@/lib/prisma';

export class SessionService {
  /**
   * Get active session currently in progress for user
   */
  static async getActiveSession(userId: string) {
    try {
      return await prisma.workoutSession.findFirst({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
        include: {
          workoutDay: {
            include: {
              exercises: {
                where: { isArchived: false },
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
          exercises: {
            include: {
              exercise: true,
              aiCoachSessions: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      });
    } catch (err) {
      console.warn('getActiveSession with aiCoachSessions failed, falling back to basic query:', err);
      return prisma.workoutSession.findFirst({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
        include: {
          workoutDay: {
            include: {
              exercises: {
                where: { isArchived: false },
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });
    }
  }

  /**
   * Start a new workout session (supports customDate for log bù / backfilling past workouts)
   */
  static async startSession(userId: string, workoutDayId: string, customDate?: string | Date) {
    // 1. If user already has an active session, return it
    const active = await this.getActiveSession(userId);
    if (active) {
      if (customDate) {
        const parsed = new Date(customDate);
        if (!isNaN(parsed.getTime())) {
          await prisma.workoutSession.update({
            where: { id: active.id },
            data: { date: parsed, startedAt: parsed },
          });
          return this.getActiveSession(userId);
        }
      }
      return active;
    }

    // 2. Fetch workout day with exercises
    const workoutDay = await prisma.workoutDay.findUnique({
      where: { id: workoutDayId },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!workoutDay) {
      throw new Error('Workout Day not found');
    }

    const now = new Date();
    let sessionDate = now;
    if (customDate) {
      const parsed = new Date(customDate);
      if (!isNaN(parsed.getTime())) {
        sessionDate = parsed;
      }
    }

    // 3. Create session
    const session = await prisma.workoutSession.create({
      data: {
        userId,
        workoutDayId,
        date: sessionDate,
        startedAt: sessionDate,
        status: 'IN_PROGRESS',
      },
      include: {
        workoutDay: {
          include: {
            exercises: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    // 4. Pre-populate session_exercises
    for (const ex of workoutDay.exercises) {
      await prisma.sessionExercise.create({
        data: {
          sessionId: session.id,
          exerciseId: ex.id,
          completed: false,
          actualSets: ex.sets,
          actualReps: `${ex.repsMin}-${ex.repsMax}`,
          actualWeightKg: null,
        },
      });
    }

    return this.getActiveSession(userId);
  }

  /**
   * Complete a session and calculate duration (supports customDurationMin and customDate)
   */
  static async finishSession(
    sessionId: string,
    notes?: string,
    customDurationMin?: number,
    customDate?: string | Date
  ) {
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const endedAt = new Date();
    let durationMin =
      customDurationMin !== undefined && customDurationMin !== null
        ? Number(customDurationMin)
        : undefined;

    if (!durationMin || durationMin <= 0) {
      const startedAt = session.startedAt || session.date || endedAt;
      const diffMs = Math.abs(endedAt.getTime() - new Date(startedAt).getTime());
      // If difference is greater than 8 hours (e.g. backfill or leftover session), default to 45 min
      if (diffMs > 8 * 60 * 60 * 1000) {
        durationMin = 45;
      } else {
        durationMin = Math.max(1, Math.round(diffMs / (1000 * 60)));
      }
    }

    const updateData: any = {
      endedAt,
      durationMin,
      status: 'COMPLETED',
      notes: notes ?? session.notes,
    };

    if (customDate) {
      const parsed = new Date(customDate);
      if (!isNaN(parsed.getTime())) {
        updateData.date = parsed;
      }
    }

    return prisma.workoutSession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        workoutDay: true,
        exercises: {
          include: { exercise: true },
        },
      },
    });
  }

  /**
   * Log or update progress for a specific exercise inside a session
   */
  static async logExercise(
    sessionId: string,
    exerciseId: string,
    data: {
      completed?: boolean;
      actualSets?: number;
      actualReps?: string;
      actualWeightKg?: number;
      notes?: string;
    }
  ) {
    return prisma.sessionExercise.upsert({
      where: {
        sessionId_exerciseId: {
          sessionId,
          exerciseId,
        },
      },
      update: {
        ...data,
      },
      create: {
        sessionId,
        exerciseId,
        completed: data.completed ?? false,
        actualSets: data.actualSets,
        actualReps: data.actualReps,
        actualWeightKg: data.actualWeightKg,
        notes: data.notes,
      },
    });
  }

  /**
   * Get all past sessions
   */
  static async getHistory(userId: string, limit = 50) {
    return prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        workoutDay: true,
        exercises: {
          include: { exercise: true },
        },
      },
    });
  }

  /**
   * Delete a session by ID
   */
  static async deleteSession(sessionId: string, userId: string) {
    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new Error('Không tìm thấy buổi tập hoặc bạn không có quyền xóa');
    }

    await prisma.sessionExercise.deleteMany({
      where: { sessionId },
    });

    return prisma.workoutSession.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Update a session (date, duration, status, notes, exercise logs)
   */
  static async updateSession(
    sessionId: string,
    userId: string,
    data: {
      notes?: string;
      durationMin?: number;
      status?: string;
      date?: string | Date;
      exercises?: Array<{
        id: string;
        actualWeightKg?: number | null;
        actualSets?: number | null;
        actualReps?: string | null;
        completed?: boolean;
      }>;
    }
  ) {
    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new Error('Không tìm thấy buổi tập hoặc bạn không có quyền sửa');
    }

    const updateData: any = {};
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.durationMin !== undefined) updateData.durationMin = Number(data.durationMin);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.date !== undefined) updateData.date = new Date(data.date);

    const updated = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    if (data.exercises && Array.isArray(data.exercises)) {
      for (const ex of data.exercises) {
        if (!ex.id) continue;
        await prisma.sessionExercise.update({
          where: { id: ex.id },
          data: {
            actualWeightKg: ex.actualWeightKg !== undefined ? (ex.actualWeightKg === null ? null : Number(ex.actualWeightKg)) : undefined,
            actualSets: ex.actualSets !== undefined ? (ex.actualSets === null ? null : Number(ex.actualSets)) : undefined,
            actualReps: ex.actualReps !== undefined ? ex.actualReps : undefined,
            completed: ex.completed !== undefined ? Boolean(ex.completed) : undefined,
          },
        });
      }
    }

    return updated;
  }

  /**
   * Reset / clear all sessions for user back to clean state
   */
  static async resetAllSessions(userId: string) {
    await prisma.sessionExercise.deleteMany({
      where: {
        session: {
          userId,
        },
      },
    });

    return prisma.workoutSession.deleteMany({
      where: { userId },
    });
  }
}
