'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export default function WorkoutTimerWidget() {
  const [duration, setDuration] = useState<number>(75);
  const [timeRemaining, setTimeRemaining] = useState<number>(75);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setIsRunning(false);
    setDuration(sec);
    setTimeRemaining(sec);
  };

  const toggleTimer = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      if (timeRemaining <= 0) setTimeRemaining(duration);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

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
        >
          60s
        </button>
        <button
          className={`btn-timer ${duration === 75 ? 'active' : ''}`}
          onClick={() => handleSelectPreset(75)}
        >
          75s
        </button>
        <button
          className={`btn-timer ${duration === 90 ? 'active' : ''}`}
          onClick={() => handleSelectPreset(90)}
        >
          90s
        </button>

        <button
          className="btn-timer"
          style={{ background: '#06B6D4', color: '#000', fontWeight: 800, padding: '6px 12px' }}
          onClick={toggleTimer}
        >
          {isRunning ? <Pause size={13} /> : <Play size={13} />}
          <span>{isRunning ? 'DỪNG' : timeRemaining <= 0 ? 'LẠI' : 'BẮT ĐẦU'}</span>
        </button>

        <button
          className="btn-timer"
          style={{ padding: '6px 8px' }}
          onClick={resetTimer}
          title="Đặt lại"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </aside>
  );
}
