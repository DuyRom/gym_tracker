'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, ChevronDown, ChevronUp } from 'lucide-react';

export default function WorkoutTimerWidget() {
  const [duration, setDuration] = useState<number>(75);
  const [timeRemaining, setTimeRemaining] = useState<number>(75);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const endTimeRef = useRef<number | null>(null);

  // Restore minimized preference if stored
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gym_timer_minimized');
      if (stored !== null) {
        setIsMinimized(stored === 'true');
      }
    } catch {}
  }, []);

  const handleToggleMinimize = (minimized: boolean) => {
    setIsMinimized(minimized);
    try {
      localStorage.setItem('gym_timer_minimized', String(minimized));
    } catch {}
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 880;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio beep blocked:', e);
    }
  };

  const handleSelectPreset = (sec: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endTimeRef.current = null;
    setIsRunning(false);
    setDuration(sec);
    setTimeRemaining(sec);
  };

  const toggleTimer = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      endTimeRef.current = null;
      setIsRunning(false);
    } else {
      const rem = timeRemaining <= 0 ? duration : timeRemaining;
      setTimeRemaining(rem);
      endTimeRef.current = Date.now() + rem * 1000;
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endTimeRef.current = null;
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  useEffect(() => {
    if (isRunning && endTimeRef.current) {
      const updateRestTimer = () => {
        if (!endTimeRef.current) return;
        const rem = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        if (rem <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          setTimeRemaining(0);
          endTimeRef.current = null;
          playBeep();
        } else {
          setTimeRemaining(rem);
        }
      };

      intervalRef.current = setInterval(updateRestTimer, 1000);

      const handleSync = () => {
        if (document.visibilityState === 'visible') {
          updateRestTimer();
        }
      };

      document.addEventListener('visibilitychange', handleSync);
      window.addEventListener('focus', handleSync);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        document.removeEventListener('visibilitychange', handleSync);
        window.removeEventListener('focus', handleSync);
      };
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  // If minimized, render a sleek, non-intrusive floating capsule trigger
  if (isMinimized) {
    return (
      <button
        onClick={() => handleToggleMinimize(false)}
        className={`timer-capsule-trigger ${isRunning ? 'running' : ''}`}
        aria-label="Mở bộ đếm thời gian nghỉ hiệp"
        title="Bấm để mở bấm giờ nghỉ hiệp"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Timer size={15} color={isRunning ? '#10B981' : '#38BDF8'} />
          {isRunning && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
          )}
        </div>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 13,
            color: isRunning ? '#34D399' : '#38BDF8',
          }}
        >
          {formatTime(timeRemaining)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
          Nghỉ hiệp
        </span>
        <ChevronUp size={14} style={{ color: 'var(--text-dim)', marginLeft: 2 }} />
      </button>
    );
  }

  // Expanded full floating widget
  return (
    <aside className="timer-widget" aria-label="Rest Timer">
      <div>
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5 }}>
          Nghỉ Giữa Hiệp
        </div>
        <div className="timer-display">{formatTime(timeRemaining)}</div>
      </div>

      <div className="timer-controls">
        <button
          className={`btn-timer ${duration === 60 ? 'active' : ''}`}
          onClick={() => handleSelectPreset(60)}
          type="button"
        >
          60s
        </button>
        <button
          className={`btn-timer ${duration === 75 ? 'active' : ''}`}
          onClick={() => handleSelectPreset(75)}
          type="button"
        >
          75s
        </button>
        <button
          className={`btn-timer ${duration === 90 ? 'active' : ''}`}
          onClick={() => handleSelectPreset(90)}
          type="button"
        >
          90s
        </button>

        <button
          className="btn-timer-primary"
          onClick={toggleTimer}
          type="button"
        >
          {isRunning ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          <span>{isRunning ? 'DỪNG' : timeRemaining <= 0 ? 'LẠI' : 'BẮT ĐẦU'}</span>
        </button>

        <button
          className="timer-icon-btn"
          onClick={resetTimer}
          title="Đặt lại thời gian"
          type="button"
        >
          <RotateCcw size={13} />
        </button>

        <button
          className="timer-icon-btn"
          onClick={() => handleToggleMinimize(true)}
          title="Thu nhỏ bộ đếm"
          aria-label="Thu nhỏ bộ đếm"
          type="button"
          style={{ marginLeft: 4 }}
        >
          <ChevronDown size={15} />
        </button>
      </div>
    </aside>
  );
}
