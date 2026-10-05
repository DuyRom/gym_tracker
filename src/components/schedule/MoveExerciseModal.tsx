'use client';

import { useState } from 'react';
import { X, ArrowRightLeft, Calendar } from 'lucide-react';

interface MoveExerciseModalProps {
  exercise: any;
  currentDayId: string;
  allDays: any[];
  onClose: () => void;
  onSuccess: (updatedDays: any[]) => void;
}

export default function MoveExerciseModal({
  exercise,
  currentDayId,
  allDays,
  onClose,
  onSuccess,
}: MoveExerciseModalProps) {
  const [targetDayId, setTargetDayId] = useState<string>(
    allDays.find((d) => d.id !== currentDayId)?.id || ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDay = allDays.find((d) => d.id === currentDayId);

  const handleMove = async () => {
    if (!targetDayId || targetDayId === currentDayId) {
      setError('Vui lòng chọn một ngày khác với ngày hiện tại');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/schedule/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          targetDayId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi di chuyển bài tập');
      }

      onSuccess(data.days);
    } catch (err: any) {
      setError(err.message || 'Lỗi mạng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>
              Chuyển Ngày Cho Bài Tập
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Di chuyển bài tập sang buổi tập khác trong tuần.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, color: '#FCA5A5', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Exercise summary card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Bài tập đang chọn:</div>
            <strong style={{ color: '#38BDF8', fontSize: 15 }}>{exercise.nameVi}</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Hiện tại ở: <strong style={{ color: '#F8FAFC' }}>{currentDay?.name}</strong>
            </div>
          </div>

          <label className="field-label" style={{ fontSize: 13, marginBottom: 8 }}>
            Chọn Ngày Đích Muốn Chuyển Tới:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {allDays.map((day) => {
              const isCurrent = day.id === currentDayId;
              const isSelected = day.id === targetDayId;
              return (
                <div
                  key={day.id}
                  onClick={() => !isCurrent && setTargetDayId(day.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: isSelected ? '#0EA5E9' : isCurrent ? 'rgba(255,255,255,0.05)' : 'var(--card-border)',
                    background: isSelected ? 'rgba(14, 165, 233, 0.15)' : isCurrent ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                    opacity: isCurrent ? 0.45 : 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Calendar size={16} color={isSelected ? '#38BDF8' : '#94A3B8'} />
                    <div>
                      <strong style={{ color: isSelected ? '#38BDF8' : '#F8FAFC', fontSize: 14 }}>
                        {day.name}
                      </strong>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {day.focus} • {day.exercises?.length || 0} bài tập
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      (Ngày hiện tại)
                    </span>
                  )}
                  {isSelected && (
                    <span className="badge badge-cyan" style={{ fontSize: 11 }}>
                      Đích đến
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleMove}
              disabled={submitting || !targetDayId || targetDayId === currentDayId}
            >
              <ArrowRightLeft size={14} />
              <span>{submitting ? 'Đang chuyển...' : 'Xác Nhận Chuyển'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
