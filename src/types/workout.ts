export interface ExerciseItem {
  id: string;
  workoutDayId: string;
  orderIndex: number;
  nameVi: string;
  nameEn: string;
  equipment: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  rir: string;
  techniqueNote: string;
  videoUrl: string | null;
}

export interface WorkoutDayItem {
  id: string;
  dayOfWeek: number;
  name: string;
  focus: string;
  dayType: 'TRAINING' | 'RECOVERY' | string;
  durationMin: number;
  exercises: ExerciseItem[];
}

export interface SessionExerciseItem {
  id: string;
  sessionId: string;
  exerciseId: string;
  completed: boolean;
  actualSets: number | null;
  actualReps: string | null;
  actualWeightKg: number | null;
  notes: string | null;
  exercise: ExerciseItem;
}

export interface WorkoutSessionItem {
  id: string;
  userId: string;
  workoutDayId: string;
  date: string | Date;
  startedAt: string | Date | null;
  endedAt: string | Date | null;
  durationMin: number | null;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  notes: string | null;
  workoutDay: WorkoutDayItem;
  exercises: SessionExerciseItem[];
}
