'use client';

import { useState, useEffect } from 'react';
import { X, Edit3, Clock, Calendar, CheckCircle2, Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import { emitDataChange } from '@/lib/data-sync';

interface EditSessionModalProps {
  isOpen: boolean;
  session: any | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditSessionModal({
  isOpen,
  session,
  onClose,
  onSaved,
}: EditSessionModalProps) {
  const [durationMin, setDurationMin] = useState<number>(45);
  const [status, setStatus] = useState<string>('COMPLETED');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session) {
      setDurationMin(session.durationMin || 45);
      setStatus(session.status || 'COMPLETED');
      setNotes(session.notes || '');
      if (session.date) {
        const d = new Date(session.date);
        setDate(d.toISOString().slice(0, 10));
      }
      if (session.exercises && Array.isArray(session.exercises)) {
        setExercises(
          session.exercises.map((se: any) => ({
            id: se.id,
            nameVi: se.exercise?.nameVi || 'Bài tập',
            equipment: se.exercise?.equipment || '',
            actualWeightKg: se.actualWeightKg ?? '',
            actualSets: se.actualSets ?? se.exercise?.sets ?? 3,
            actualReps: se.actualReps || '',
            completed: se.completed ?? false,
          }))
        );
      }
      setError('');
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const handleExerciseChange = (idx: number, field: string, value: any) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        durationMin: Number(durationMin),
        status,
        notes,
        date: date ? new Date(date).toISOString() : undefined,
        exercises: exercises.map((ex) => ({
          id: ex.id,
          actualWeightKg: ex.actualWeightKg === '' ? null : Number(ex.actualWeightKg),
          actualSets: ex.actualSets === '' ? null : Number(ex.actualSets),
          actualReps: ex.actualReps || null,
          completed: Boolean(ex.completed),
        })),
      };

      const res = await fetch(`/api/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Cập nhật thất bại');
      }

      emitDataChange('SESSION');
      emitDataChange('STATS');
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật buổi tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: 600,
          background: '#0B101C',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                Chỉnh Sửa Buổi Tập: {session.workoutDay?.name}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                Cập nhật thời lượng, ghi chú hoặc mức tạ của từng bài tập
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px 24px', flex: 1 }}>
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 10,
                color: '#FDA4AF',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Ngày tập
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Thời lượng (phút)
              </label>
              <input
                type="number"
                min="0"
                max="360"
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
                style={{ width: '100%' }}
              >
                <option value="COMPLETED">Đã hoàn thành</option>
                <option value="MISSED">Bỏ lỡ</option>
                <option value="IN_PROGRESS">Đang tập</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Ghi chú buổi tập
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Cảm giác cơ ngực rất tốt, hoàn thành đúng form..."
              className="input-field"
              rows={2}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Exercise items list */}
          {exercises.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Dumbbell size={15} color="#38BDF8" />
                <span>Chi tiết bài tập ({exercises.length} bài)</span>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#38BDF8',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                💡 <strong>Quy ước ghi mức tạ:</strong> Tạ đơn ghi 1 quả (Top set) • Tạ đòn tính cả đòn + 2 bên bánh (VD: đòn 20kg + 2 bên 5kg = 30kg).
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {exercises.map((ex, idx) => (
                  <div
                    key={ex.id || idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: '1 1 200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={ex.completed}
                          onChange={(e) => handleExerciseChange(idx, 'completed', e.target.checked)}
                          id={`ex-check-${idx}`}
                          style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#10B981' }}
                        />
                        <label
                          htmlFor={`ex-check-${idx}`}
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: ex.completed ? '#F8FAFC' : 'var(--text-muted)',
                            cursor: 'pointer',
                          }}
                        >
                          {ex.nameVi}
                        </label>
                      </div>
                      {ex.equipment && (
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 24 }}>
                          {ex.equipment}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Mức tạ:</span>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="kg"
                          value={ex.actualWeightKg}
                          onChange={(e) => handleExerciseChange(idx, 'actualWeightKg', e.target.value)}
                          className="input-number"
                          style={{ width: 64, padding: '4px 6px', fontSize: 12 }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>kg</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Hiệp:</span>
                        <input
                          type="number"
                          value={ex.actualSets}
                          onChange={(e) => handleExerciseChange(idx, 'actualSets', e.target.value)}
                          className="input-number"
                          style={{ width: 48, padding: '4px 6px', fontSize: 12 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading && <Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />}
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
