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
      include: { exercises: { orderBy: { orderIndex: 'asc' } } },
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
}
