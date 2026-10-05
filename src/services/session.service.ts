import prisma from '@/lib/prisma';

export class SessionService {
  /**
   * Get active session currently in progress for user
   */
  static async getActiveSession(userId: string) {
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

  /**
   * Start a new workout session
   */
  static async startSession(userId: string, workoutDayId: string) {
    // 1. If user already has an active session, return it
    const active = await this.getActiveSession(userId);
    if (active) {
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

    // 3. Create session
    const session = await prisma.workoutSession.create({
      data: {
        userId,
        workoutDayId,
        date: now,
        startedAt: now,
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
   * Complete a session and calculate duration
   */
  static async finishSession(sessionId: string, notes?: string) {
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const endedAt = new Date();
    const startedAt = session.startedAt || session.date || endedAt;
    const diffMs = endedAt.getTime() - new Date(startedAt).getTime();
    const durationMin = Math.max(1, Math.round(diffMs / (1000 * 60)));

    return prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        endedAt,
        durationMin,
        status: 'COMPLETED',
        notes: notes ?? session.notes,
      },
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
