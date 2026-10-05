import prisma from '@/lib/prisma';

export class ScheduleService {
  /**
   * Log an action on user's schedule
   */
  static async logActivity(userId: string, action: string, details: string) {
    try {
      return await prisma.scheduleActivityLog.create({
        data: {
          userId,
          action,
          details,
        },
      });
    } catch (err) {
      console.error('Failed to log schedule activity:', err);
      return null;
    }
  }

  /**
   * Get recent schedule activity logs for user
   */
  static async getActivityLogs(userId: string, limit = 50) {
    return prisma.scheduleActivityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Ensure user has their personal customizable WorkoutDays.
   * If not, clone from system template (userId: null).
   */
  static async getUserSchedule(userId: string) {
    let userDays = await prisma.workoutDay.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    // If user has personal schedule, return it
    if (userDays.length > 0) {
      return userDays;
    }

    // Otherwise, clone from template days (where userId is null)
    const templateDays = await prisma.workoutDay.findMany({
      where: { userId: null },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (templateDays.length === 0) {
      return [];
    }

    // Clone each template day and its exercises for this user
    for (const tDay of templateDays) {
      await prisma.workoutDay.create({
        data: {
          userId,
          dayOfWeek: tDay.dayOfWeek,
          name: tDay.name,
          focus: tDay.focus,
          dayType: tDay.dayType,
          durationMin: tDay.durationMin,
          exercises: {
            create: tDay.exercises.map((ex) => ({
              orderIndex: ex.orderIndex,
              nameVi: ex.nameVi,
              nameEn: ex.nameEn,
              equipment: ex.equipment,
              sets: ex.sets,
              repsMin: ex.repsMin,
              repsMax: ex.repsMax,
              rir: ex.rir,
              techniqueNote: ex.techniqueNote,
              videoUrl: ex.videoUrl,
              isArchived: false,
            })),
          },
        },
      });
    }

    await this.logActivity(
      userId,
      'RESET',
      'Khởi tạo lịch tập cá nhân từ giáo án chuẩn khoa học (5 buổi / tuần)'
    );

    // Return freshly cloned user days
    return prisma.workoutDay.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  /**
   * Reorder exercises within a specific day
   */
  static async reorderExercises(userId: string, dayId: string, orderedExerciseIds: string[]) {
    const day = await prisma.workoutDay.findFirst({
      where: { id: dayId, userId },
    });

    if (!day) {
      throw new Error('Không tìm thấy ngày tập hoặc bạn không có quyền');
    }

    // Update orderIndex sequentially
    for (let i = 0; i < orderedExerciseIds.length; i++) {
      const exerciseId = orderedExerciseIds[i];
      await prisma.exercise.updateMany({
        where: { id: exerciseId, workoutDayId: dayId },
        data: { orderIndex: i + 1 },
      });
    }

    await this.logActivity(
      userId,
      'REORDER',
      `Đã sắp xếp lại thứ tự ${orderedExerciseIds.length} bài tập của ${day.name}`
    );

    return this.getUserSchedule(userId);
  }

  /**
   * Move an exercise from one day to another (e.g. Thứ 2 -> Thứ 3)
   */
  static async moveExercise(
    userId: string,
    exerciseId: string,
    targetDayId: string,
    targetOrderIndex?: number
  ) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { workoutDay: true },
    });

    if (!exercise || exercise.workoutDay.userId !== userId) {
      throw new Error('Không tìm thấy bài tập hoặc bạn không có quyền');
    }

    const targetDay = await prisma.workoutDay.findFirst({
      where: { id: targetDayId, userId },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!targetDay) {
      throw new Error('Không tìm thấy ngày tập đích');
    }

    const sourceDay = exercise.workoutDay;

    // Determine new orderIndex in target day
    let newIndex = targetOrderIndex ?? (targetDay.exercises.length + 1);

    // Update exercise
    await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        workoutDayId: targetDayId,
        orderIndex: newIndex,
      },
    });

    // Re-index target day exercises
    const updatedTargetExercises = await prisma.exercise.findMany({
      where: { workoutDayId: targetDayId, isArchived: false },
      orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
    });
    for (let i = 0; i < updatedTargetExercises.length; i++) {
      await prisma.exercise.update({
        where: { id: updatedTargetExercises[i].id },
        data: { orderIndex: i + 1 },
      });
    }

    // Re-index source day exercises
    const updatedSourceExercises = await prisma.exercise.findMany({
      where: { workoutDayId: sourceDay.id, isArchived: false },
      orderBy: { orderIndex: 'asc' },
    });
    for (let i = 0; i < updatedSourceExercises.length; i++) {
      await prisma.exercise.update({
        where: { id: updatedSourceExercises[i].id },
        data: { orderIndex: i + 1 },
      });
    }

    await this.logActivity(
      userId,
      'MOVE',
      `Đã chuyển bài "${exercise.nameVi}" từ ${sourceDay.name} sang ${targetDay.name}`
    );

    return this.getUserSchedule(userId);
  }

  /**
   * Add a new exercise to a day
   */
  static async addExercise(
    userId: string,
    dayId: string,
    data: {
      nameVi: string;
      nameEn?: string;
      equipment?: string;
      sets?: number;
      repsMin?: number;
      repsMax?: number;
      rir?: string;
      techniqueNote?: string;
      videoUrl?: string;
    }
  ) {
    const day = await prisma.workoutDay.findFirst({
      where: { id: dayId, userId },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!day) {
      throw new Error('Không tìm thấy ngày tập hoặc bạn không có quyền');
    }

    const nextOrderIndex = day.exercises.length + 1;

    const newEx = await prisma.exercise.create({
      data: {
        workoutDayId: dayId,
        orderIndex: nextOrderIndex,
        nameVi: data.nameVi.trim(),
        nameEn: (data.nameEn || data.nameVi).trim(),
        equipment: (data.equipment || 'Tạ đơn / Máy').trim(),
        sets: Number(data.sets) || 3,
        repsMin: Number(data.repsMin) || 8,
        repsMax: Number(data.repsMax) || 12,
        rir: data.rir || 'RIR 1-2',
        techniqueNote: data.techniqueNote || 'Thực hiện động tác có kiểm soát, gồng lõi bụng vững chắc.',
        videoUrl: data.videoUrl || null,
        isArchived: false,
      },
    });

    await this.logActivity(
      userId,
      'ADD',
      `Đã thêm bài tập mới "${newEx.nameVi}" (${newEx.sets} hiệp x ${newEx.repsMin}-${newEx.repsMax} reps) vào ${day.name}`
    );

    return this.getUserSchedule(userId);
  }

  /**
   * Edit an existing exercise
   */
  static async updateExercise(
    userId: string,
    exerciseId: string,
    data: {
      nameVi?: string;
      nameEn?: string;
      equipment?: string;
      sets?: number;
      repsMin?: number;
      repsMax?: number;
      rir?: string;
      techniqueNote?: string;
      videoUrl?: string;
    }
  ) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { workoutDay: true },
    });

    if (!exercise || exercise.workoutDay.userId !== userId) {
      throw new Error('Không tìm thấy bài tập hoặc bạn không có quyền');
    }

    const updateData: any = {};
    if (data.nameVi !== undefined) updateData.nameVi = data.nameVi.trim();
    if (data.nameEn !== undefined) updateData.nameEn = data.nameEn.trim();
    if (data.equipment !== undefined) updateData.equipment = data.equipment.trim();
    if (data.sets !== undefined) updateData.sets = Number(data.sets);
    if (data.repsMin !== undefined) updateData.repsMin = Number(data.repsMin);
    if (data.repsMax !== undefined) updateData.repsMax = Number(data.repsMax);
    if (data.rir !== undefined) updateData.rir = data.rir.trim();
    if (data.techniqueNote !== undefined) updateData.techniqueNote = data.techniqueNote;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl ? data.videoUrl.trim() : null;

    const updated = await prisma.exercise.update({
      where: { id: exerciseId },
      data: updateData,
    });

    await this.logActivity(
      userId,
      'EDIT',
      `Đã cập nhật thông số bài "${updated.nameVi}" (${exercise.workoutDay.name})`
    );

    return this.getUserSchedule(userId);
  }

  /**
   * Delete an exercise from schedule.
   * If exercise has session exercises in history, archive it to keep history intact.
   * If no session exercises exist, permanently delete it.
   */
  static async deleteExercise(userId: string, exerciseId: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        workoutDay: true,
        sessionExercises: { select: { id: true }, take: 1 },
      },
    });

    if (!exercise || exercise.workoutDay.userId !== userId) {
      throw new Error('Không tìm thấy bài tập hoặc bạn không có quyền');
    }

    const day = exercise.workoutDay;

    if (exercise.sessionExercises.length > 0) {
      // Archive to preserve past workout logs
      await prisma.exercise.update({
        where: { id: exerciseId },
        data: { isArchived: true },
      });
    } else {
      // Permanently remove
      await prisma.exercise.delete({
        where: { id: exerciseId },
      });
    }

    // Re-index remaining exercises in this day
    const remaining = await prisma.exercise.findMany({
      where: { workoutDayId: day.id, isArchived: false },
      orderBy: { orderIndex: 'asc' },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.exercise.update({
        where: { id: remaining[i].id },
        data: { orderIndex: i + 1 },
      });
    }

    await this.logActivity(
      userId,
      'DELETE',
      `Đã xóa bài "${exercise.nameVi}" khỏi ${day.name}`
    );

    return this.getUserSchedule(userId);
  }

  /**
   * Reset user schedule back to default template
   */
  static async resetScheduleToDefault(userId: string) {
    const templateDays = await prisma.workoutDay.findMany({
      where: { userId: null },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          where: { isArchived: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (templateDays.length === 0) {
      throw new Error('Không tìm thấy giáo án mẫu hệ thống để khôi phục');
    }

    // Get user's existing days
    const userDays = await prisma.workoutDay.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' },
      include: {
        exercises: {
          include: {
            sessionExercises: { select: { id: true }, take: 1 },
          },
        },
      },
    });

    // Clean up or archive user's current exercises
    for (const uDay of userDays) {
      for (const ex of uDay.exercises) {
        if (ex.sessionExercises.length > 0) {
          await prisma.exercise.update({
            where: { id: ex.id },
            data: { isArchived: true },
          });
        } else {
          await prisma.exercise.delete({
            where: { id: ex.id },
          });
        }
      }
    }

    // Re-populate exercises into user's matching days
    for (const tDay of templateDays) {
      const existingUserDay = userDays.find((d) => d.dayOfWeek === tDay.dayOfWeek);
      let targetDayId: string;

      if (!existingUserDay) {
        // Create if missing
        const createdDay = await prisma.workoutDay.create({
          data: {
            userId,
            dayOfWeek: tDay.dayOfWeek,
            name: tDay.name,
            focus: tDay.focus,
            dayType: tDay.dayType,
            durationMin: tDay.durationMin,
          },
        });
        targetDayId = createdDay.id;
      } else {
        targetDayId = existingUserDay.id;
        // Update day metadata if needed
        await prisma.workoutDay.update({
          where: { id: existingUserDay.id },
          data: {
            name: tDay.name,
            focus: tDay.focus,
            dayType: tDay.dayType,
            durationMin: tDay.durationMin,
          },
        });
      }

      // Re-create default exercises
      for (const ex of tDay.exercises) {
        await prisma.exercise.create({
          data: {
            workoutDayId: targetDayId,
            orderIndex: ex.orderIndex,
            nameVi: ex.nameVi,
            nameEn: ex.nameEn,
            equipment: ex.equipment,
            sets: ex.sets,
            repsMin: ex.repsMin,
            repsMax: ex.repsMax,
            rir: ex.rir,
            techniqueNote: ex.techniqueNote,
            videoUrl: ex.videoUrl,
            isArchived: false,
          },
        });
      }
    }

    await this.logActivity(
      userId,
      'RESET',
      'Đã khôi phục toàn bộ lịch tập về giáo án khoa học chuẩn mặc định'
    );

    return this.getUserSchedule(userId);
  }
}
