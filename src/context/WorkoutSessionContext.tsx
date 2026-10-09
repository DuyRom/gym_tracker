'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { WorkoutSessionItem } from '@/types/workout';
import { emitDataChange, useDataSync } from '@/lib/data-sync';
import { hapticImpact, hapticSuccess, hapticWarning } from '@/lib/native-bridge';

interface WorkoutSessionContextType {
  activeSession: WorkoutSessionItem | null;
  elapsedSeconds: number;
  loading: boolean;
  isSessionActive: boolean;
  startSession: (workoutDayId: string, customDate?: string) => Promise<WorkoutSessionItem | null>;
  finishSession: (notes?: string, durationMin?: number) => Promise<any>;
  toggleExerciseCompleted: (exerciseId: string, currentCompleted: boolean) => Promise<void>;
  updateExerciseWeight: (exerciseId: string, weightKg: number) => Promise<void>;
  saveAiCoachResult: (exerciseId: string, reps: number, score: number) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextType | null>(null);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<WorkoutSessionItem | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch active session on mount
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/active?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.session) {
        setActiveSession(data.session);
        const isPastDate = new Date(data.session.date).toDateString() !== new Date().toDateString();
        if (isPastDate) {
          setElapsedSeconds(0);
        } else {
          const startMs = new Date(data.session.startedAt || Date.now()).getTime();
          setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
        }
      } else {
        setActiveSession(null);
      }
    } catch (err) {
      console.error('Failed to load active session in WorkoutSessionContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Revalidate session when session-related data changes
  useDataSync(['SESSION'], refreshSession);

  // 2. Active timer synchronization
  const sessionStartedAt = activeSession?.startedAt;
  const isPastDateSession = activeSession
    ? new Date(activeSession.date).toDateString() !== new Date().toDateString()
    : false;

  useEffect(() => {
    if (!activeSession || isPastDateSession) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (!activeSession) setElapsedSeconds(0);
      return;
    }

    const startMs = new Date(sessionStartedAt || Date.now()).getTime();

    const updateTimer = () => {
      const diffSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setElapsedSeconds(diffSec);
    };

    updateTimer();
    timerIntervalRef.current = setInterval(updateTimer, 1000);

    const handleSync = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };

    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [activeSession, sessionStartedAt, isPastDateSession]);

  // 3. Start a new workout session
  const startSession = async (workoutDayId: string, customDate?: string): Promise<WorkoutSessionItem | null> => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutDayId, date: customDate }),
      });
      const data = await res.json();
      if (res.ok && data.session) {
        hapticImpact();
        setActiveSession(data.session);

        const isPastDate = new Date(data.session.date).toDateString() !== new Date().toDateString();
        if (isPastDate) {
          setElapsedSeconds(0);
        } else {
          const startMs = new Date(data.session.startedAt || Date.now()).getTime();
          setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
        }

        emitDataChange('SESSION');
        return data.session;
      } else {
        hapticWarning();
        throw new Error(data.error || 'Không thể bắt đầu buổi tập');
      }
    } catch (err: any) {
      console.error('Failed to start session in context:', err);
      hapticWarning();
      throw err;
    }
  };

  // 4. Finish current workout session
  const finishSession = async (notes?: string, durationMin?: number): Promise<any> => {
    if (!activeSession) return null;

    try {
      const res = await fetch(`/api/sessions/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          durationMin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.session) {
        hapticSuccess();
        const finishedSummary = {
          session: data.session,
          durationMin: data.session.durationMin || durationMin,
          completedCount: activeSession.exercises.filter((e) => e.completed).length,
          totalCount: activeSession.exercises.length,
          dayName: activeSession.workoutDay.name,
        };

        setActiveSession(null);
        setElapsedSeconds(0);
        emitDataChange('SESSION');
        emitDataChange('STATS');
        return finishedSummary;
      } else {
        throw new Error(data.error || 'Không thể kết thúc buổi tập');
      }
    } catch (err) {
      console.error('Failed to finish session in context:', err);
      throw err;
    }
  };

  // 5. Toggle exercise completion status
  const toggleExerciseCompleted = async (exerciseId: string, currentCompleted: boolean) => {
    if (!activeSession) return;
    const nextCompleted = !currentCompleted;

    // Optimistic update
    setActiveSession((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((se: any) =>
          se.exerciseId === exerciseId ? { ...se, completed: nextCompleted } : se
        ),
      };
    });

    try {
      await fetch(`/api/sessions/${activeSession.id}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          completed: nextCompleted,
        }),
      });
      emitDataChange('SESSION');
    } catch (err) {
      console.error('Failed to update exercise status:', err);
    }
  };

  // 6. Update weight for an exercise
  const updateExerciseWeight = async (exerciseId: string, weightKg: number) => {
    if (!activeSession) return;

    // Optimistic update
    setActiveSession((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((se: any) =>
          se.exerciseId === exerciseId ? { ...se, actualWeightKg: weightKg } : se
        ),
      };
    });

    try {
      await fetch(`/api/sessions/${activeSession.id}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          actualWeightKg: weightKg,
        }),
      });
      emitDataChange('SESSION');
    } catch (err) {
      console.error('Failed to update weight:', err);
    }
  };

  // 7. Save AI Coach result
  const saveAiCoachResult = async (exerciseId: string, reps: number, score: number) => {
    if (!activeSession) return;

    setActiveSession((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((se: any) =>
          se.exerciseId === exerciseId
            ? { ...se, completed: true, actualReps: `${reps} reps (AI Score ${score}%)` }
            : se
        ),
      };
    });

    try {
      await fetch(`/api/sessions/${activeSession.id}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          completed: true,
          actualReps: `${reps} reps (AI Score ${score}%)`,
        }),
      });
      emitDataChange('SESSION');
    } catch (err) {
      console.error('Failed to log AI Coach exercise in context:', err);
    }
  };

  return (
    <WorkoutSessionContext.Provider
      value={{
        activeSession,
        elapsedSeconds,
        loading,
        isSessionActive: Boolean(activeSession),
        startSession,
        finishSession,
        toggleExerciseCompleted,
        updateExerciseWeight,
        saveAiCoachResult,
        refreshSession,
      }}
    >
      {children}
    </WorkoutSessionContext.Provider>
  );
}

export function useWorkoutSession() {
  const context = useContext(WorkoutSessionContext);
  if (!context) {
    throw new Error('useWorkoutSession must be used within a WorkoutSessionProvider');
  }
  return context;
}
