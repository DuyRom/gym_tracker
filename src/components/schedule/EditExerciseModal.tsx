'use client';

import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface EditExerciseModalProps {
  exercise: any;
  dayName: string;
  onClose: () => void;
  onSuccess: (updatedDays: any[]) => void;
  onDeleteRequest: (exercise: any) => void;
}

export default function EditExerciseModal({
  exercise,
  dayName,
  onClose,
  onSuccess,
  onDeleteRequest,
}: EditExerciseModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states initialized with current exercise values
  const [nameVi, setNameVi] = useState(exercise.nameVi || '');
  const [nameEn, setNameEn] = useState(exercise.nameEn || '');
  const [equipment, setEquipment] = useState(exercise.equipment || '');
  const [sets, setSets] = useState(exercise.sets || 3);
  const [repsMin, setRepsMin] = useState(exercise.repsMin || 8);
  const [repsMax, setRepsMax] = useState(exercise.repsMax || 12);
  const [rir, setRir] = useState(exercise.rir || 'RIR 1-2');
  const [techniqueNote, setTechniqueNote] = useState(exercise.techniqueNote || '');
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi.trim()) {
      setError('Vui lòng nhập tên bài tập tiếng Việt');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/schedule/exercises', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          nameVi: nameVi.trim(),
          nameEn: nameEn.trim() || nameVi.trim(),
          equipment: equipment.trim(),
          sets: Number(sets),
          repsMin: Number(repsMin),
          repsMax: Number(repsMax),
          rir: rir.trim(),
          techniqueNote: techniqueNote.trim(),
          videoUrl: videoUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi cập nhật bài tập');
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
        style={{ maxWidth: 620, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
              Chỉnh Sửa Bài Tập ({dayName})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Cập nhật số hiệp, khoảng reps, thiết bị hoặc kỹ thuật.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, color: '#FCA5A5', fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Tên Bài Tập (Tiếng Việt) *</label>
              <input
                type="text"
                required
                className="input-field"
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Tên Tiếng Anh</label>
              <input
                type="text"
                className="input-field"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="field-label" style={{ fontSize: 12 }}>Thiết Bị Sử Dụng</label>
            <input
              type="text"
              className="input-field"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Số Hiệp</label>
              <input
                type="number"
                min="1"
                max="10"
                className="input-field"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Reps Tối Thiểu</label>
              <input
                type="number"
                min="1"
                max="100"
                className="input-field"
                value={repsMin}
                onChange={(e) => setRepsMin(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Reps Tối Đa</label>
              <input
                type="number"
                min="1"
                max="100"
                className="input-field"
                value={repsMax}
                onChange={(e) => setRepsMax(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label" style={{ fontSize: 12 }}>Ngưỡng RIR</label>
              <input
                type="text"
                className="input-field"
                value={rir}
                onChange={(e) => setRir(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="field-label" style={{ fontSize: 12 }}>Lưu Ý Kỹ Thuật Sinh Học</label>
            <textarea
              className="input-field"
              rows={3}
              value={techniqueNote}
              onChange={(e) => setTechniqueNote(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label" style={{ fontSize: 12 }}>Link Video Hướng Dẫn</label>
            <input
              type="url"
              className="input-field"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={() => {
                onClose();
                onDeleteRequest(exercise);
              }}
            >
              <Trash2 size={14} />
              <span>Xóa bài này</span>
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Save size={14} />
                <span>{submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
