'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Dumbbell, ChevronUp, ChevronDown, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useWorkoutSession } from '@/context/WorkoutSessionContext';
import { formatDuration } from '@/lib/utils';
import { hapticSelection } from '@/lib/native-bridge';

export default function ActiveWorkoutFloatingWidget() {
  const { activeSession, elapsedSeconds, isSessionActive } = useWorkoutSession();
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  // Restore minimize preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gym_active_widget_minimized');
      if (stored !== null) {
        setIsMinimized(stored === 'true');
      }
    } catch {}
  }, []);

  const handleToggleMinimize = (minimized: boolean) => {
    hapticSelection();
    setIsMinimized(minimized);
    try {
      localStorage.setItem('gym_active_widget_minimized', String(minimized));
    } catch {}
  };

  // 1. If no active workout session, do not render anything
  if (!isSessionActive || !activeSession) {
    return null;
  }

  // 2. If user is currently on the workout page, hide floating widget to prevent double timers
  if (pathname === '/workout') {
    return null;
  }

  const completedCount = activeSession.exercises?.filter((e: any) => e.completed).length || 0;
  const totalCount = activeSession.exercises?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const dayNameShort = activeSession.workoutDay?.name?.split('(')[0]?.trim() || 'Buổi Tập';

  // 3. Render Minimized Capsule
  if (isMinimized) {
    return (
      <div
        className="active-workout-capsule"
        onClick={() => handleToggleMinimize(false)}
        role="button"
        tabIndex={0}
        aria-label="Mở chi tiết buổi tập đang diễn ra"
        title="Bấm để xem chi tiết hoặc tiếp tục tập"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="pulse-dot" style={{ background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <Dumbbell size={14} color="#34D399" />
          <span style={{ fontWeight: 700, fontSize: 13, color: '#F8FAFC' }}>
            {dayNameShort}
          </span>
        </div>

        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 800,
            fontSize: 13,
            color: '#34D399',
            padding: '2px 6px',
            background: 'rgba(16, 185, 129, 0.12)',
            borderRadius: 6,
          }}
        >
          {formatDuration(elapsedSeconds)}
        </span>

        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
          {completedCount}/{totalCount} bài
        </span>

        <ChevronUp size={15} style={{ color: 'var(--text-dim)', marginLeft: 2 }} />
      </div>
    );
  }

  // 4. Render Expanded Card
  return (
    <div className="active-workout-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pulse-dot" style={{ background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#34D399',
              letterSpacing: '0.5px',
            }}
          >
            Đang Trong Buổi Tập
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleToggleMinimize(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
          title="Thu gọn"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.3 }}>
          {activeSession.workoutDay?.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {activeSession.workoutDay?.focus}
        </div>
      </div>

      <div style={{ margin: '14px 0 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
            Thời gian đã tập
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#34D399',
              lineHeight: 1.1,
              marginTop: 2,
            }}
          >
            {formatDuration(elapsedSeconds)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
            Tiến độ bài tập
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginTop: 2 }}>
            {completedCount}/{totalCount} bài <span style={{ color: '#38BDF8', fontSize: 12 }}>({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 9999, overflow: 'hidden', marginBottom: 14 }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #0284C7, #10B981)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/workout"
          onClick={() => hapticSelection()}
          className="btn btn-primary"
          style={{
            flex: 1,
            padding: '9px 14px',
            fontSize: 13,
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <span>Tiếp tục tập luyện</span>
          <ArrowRight size={14} />
        </Link>

        <button
          type="button"
          onClick={() => handleToggleMinimize(true)}
          className="btn btn-secondary"
          style={{ padding: '9px 12px', fontSize: 12 }}
          title="Thu gọn widget"
        >
          <span>Thu gọn</span>
        </button>
      </div>
    </div>
  );
}
