export interface StatsOverview {
  totalSessions: number;
  totalDurationMin: number;
  currentStreakDays: number;
  completionRate: number; // percentage 0 - 100
  totalMissed: number;
}

export interface WeeklyStat {
  weekLabel: string;
  sessionCount: number;
  totalMinutes: number;
}

export interface ExerciseProgressItem {
  date: string;
  weightKg: number;
  reps: string;
}

export interface ExerciseProgression {
  exerciseName: string;
  records: ExerciseProgressItem[];
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  durationMin: number;
  status: 'COMPLETED' | 'MISSED' | 'NONE';
}

export interface DashboardStatsResponse {
  overview: StatsOverview;
  weeklyStats: WeeklyStat[];
  recentSessions: any[];
  heatmap: HeatmapDay[];
  progressions: ExerciseProgression[];
}
