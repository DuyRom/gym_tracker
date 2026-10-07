import prisma from '@/lib/prisma';
import { DashboardStatsResponse, HeatmapDay, WeeklyStat, ExerciseProgression } from '@/types/stats';

export class StatsService {
  static async getDashboardStats(userId: string): Promise<DashboardStatsResponse> {
    // 1. Fetch all user sessions
    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: {
        workoutDay: true,
        exercises: {
          include: { exercise: true },
        },
      },
    });

    const nowMs = Date.now();
    const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');
    const missedSessions = sessions.filter((s) => {
      if (s.status === 'MISSED') return true;
      // If a session was started > 24 hours ago and never finished, consider it uncompleted
      if (s.status === 'IN_PROGRESS') {
        const sessionTime = new Date(s.date).getTime();
        return (nowMs - sessionTime) > 24 * 60 * 60 * 1000;
      }
      return false;
    });

    const totalSessions = completedSessions.length;
    const totalDurationMin = completedSessions.reduce((acc, s) => acc + (s.durationMin || 0), 0);
    const totalMissed = missedSessions.length;
    const totalPlannedOrDone = totalSessions + totalMissed;
    const completionRate = totalPlannedOrDone > 0 ? Math.round((totalSessions / totalPlannedOrDone) * 100) : 100;

    // 2. Streak calculation (consecutive workout days)
    let currentStreakDays = 0;
    if (completedSessions.length > 0) {
      const datesSet = new Set(
        completedSessions.map((s) => new Date(s.date).toISOString().slice(0, 10))
      );

      const checkDate = new Date();
      // If today is completed or not yet, check backwards
      const todayStr = checkDate.toISOString().slice(0, 10);
      if (!datesSet.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (datesSet.has(checkDate.toISOString().slice(0, 10))) {
        currentStreakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // 3. Weekly breakdown (last 6 weeks)
    const weeklyMap = new Map<string, { sessionCount: number; totalMinutes: number }>();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7);
      const label = `Tuần -${i === 0 ? 'Nay' : i}`;
      weeklyMap.set(label, { sessionCount: 0, totalMinutes: 0 });
    }

    const sixWeeksAgo = new Date(now);
    sixWeeksAgo.setDate(now.getDate() - 42);

    completedSessions.forEach((s) => {
      const sDate = new Date(s.date);
      if (sDate >= sixWeeksAgo) {
        const diffDays = Math.floor((now.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(5, Math.floor(diffDays / 7));
        const label = `Tuần -${weekIndex === 0 ? 'Nay' : weekIndex}`;
        const item = weeklyMap.get(label);
        if (item) {
          item.sessionCount += 1;
          item.totalMinutes += s.durationMin || 0;
        }
      }
    });

    const weeklyStats: WeeklyStat[] = Array.from(weeklyMap.entries()).map(([weekLabel, val]) => ({
      weekLabel,
      sessionCount: val.sessionCount,
      totalMinutes: val.totalMinutes,
    }));

    // 4. Heatmap data (last 45 days)
    const heatmap: HeatmapDay[] = [];
    const sessionsByDate = new Map<string, { status: string; duration: number }>();

    sessions.forEach((s) => {
      const key = new Date(s.date).toISOString().slice(0, 10);
      sessionsByDate.set(key, {
        status: s.status,
        duration: s.durationMin || 0,
      });
    });

    for (let d = 44; d >= 0; d--) {
      const day = new Date();
      day.setDate(now.getDate() - d);
      const dateKey = day.toISOString().slice(0, 10);
      const found = sessionsByDate.get(dateKey);

      heatmap.push({
        date: dateKey,
        count: found?.status === 'COMPLETED' ? 1 : 0,
        durationMin: found?.duration || 0,
        status: found?.status === 'COMPLETED' ? 'COMPLETED' : found?.status === 'MISSED' ? 'MISSED' : 'NONE',
      });
    }

    // 5. Progressive Overload (tracking weight over time for key exercises)
    const exerciseProgressionMap = new Map<string, { date: string; weightKg: number; reps: string }[]>();

    completedSessions.forEach((s) => {
      const dateStr = new Date(s.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      s.exercises.forEach((se) => {
        if (se.completed && se.actualWeightKg && se.actualWeightKg > 0) {
          const exName = se.exercise.nameVi;
          if (!exerciseProgressionMap.has(exName)) {
            exerciseProgressionMap.set(exName, []);
          }
          exerciseProgressionMap.get(exName)!.push({
            date: dateStr,
            weightKg: se.actualWeightKg,
            reps: se.actualReps || '10',
          });
        }
      });
    });

    const progressions: ExerciseProgression[] = Array.from(exerciseProgressionMap.entries()).map(
      ([exerciseName, records]) => ({
        exerciseName,
        records: records.slice(-8), // Keep recent 8 data points
      })
    );

    // 6. Recent sessions
    const recentSessions = [...sessions].reverse().slice(0, 10);

    return {
      overview: {
        totalSessions,
        totalDurationMin,
        currentStreakDays,
        completionRate,
        totalMissed,
      },
      weeklyStats,
      recentSessions,
      heatmap,
      progressions,
    };
  }
}
