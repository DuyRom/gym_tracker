'use client';

import { useState } from 'react';
import { X, Search, Plus, Dumbbell, Sparkles } from 'lucide-react';
import { EXERCISE_LIBRARY, LibraryExercise } from '@/data/exercise-library';

interface AddExerciseModalProps {
  dayId: string;
  dayName: string;
  onClose: () => void;
  onSuccess: (updatedDays: any[]) => void;
}

export default function AddExerciseModal({
  dayId,
  dayName,
  onClose,
  onSuccess,
}: AddExerciseModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [equipment, setEquipment] = useState('Cặp tạ đơn');
  const [sets, setSets] = useState(3);
  const [repsMin, setRepsMin] = useState(8);
  const [repsMax, setRepsMax] = useState(12);
  const [rir, setRir] = useState('RIR 1-2');
  const [techniqueNote, setTechniqueNote] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'chest', label: 'Ngực' },
    { id: 'back', label: 'Lưng Xô' },
    { id: 'legs', label: 'Chân' },
    { id: 'shoulders', label: 'Vai' },
    { id: 'arms', label: 'Tay' },
    { id: 'core', label: 'Bụng/Core' },
  ];

  const filteredLibrary = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      ex.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFromLibrary = (libEx: LibraryExercise) => {
    setNameVi(libEx.nameVi);
    setNameEn(libEx.nameEn);
    setEquipment(libEx.equipment);
    setSets(libEx.sets);
    setRepsMin(libEx.repsMin);
    setRepsMax(libEx.repsMax);
    setRir(libEx.rir);
    setTechniqueNote(libEx.techniqueNote);
    setVideoUrl(libEx.videoUrl || '');
    setActiveTab('custom');
  };

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId,
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
        throw new Error(data.error || 'Lỗi thêm bài tập');
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
        style={{ maxWidth: 660, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
              Thêm Bài Tập Vào {dayName}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Chọn bài từ thư viện bài chuẩn hoặc tự tạo theo nhu cầu cá nhân.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', padding: '0 20px' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
            style={{ borderRadius: 0, borderBottom: activeTab === 'library' ? '2px solid #0EA5E9' : 'none' }}
            onClick={() => setActiveTab('library')}
          >
            <Sparkles size={15} />
            <span>Thư Viện Bài Mẫu ({EXERCISE_LIBRARY.length})</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            style={{ borderRadius: 0, borderBottom: activeTab === 'custom' ? '2px solid #0EA5E9' : 'none' }}
            onClick={() => setActiveTab('custom')}
          >
            <Plus size={15} />
            <span>{nameVi ? `Tùy Chỉnh: ${nameVi}` : 'Tự Nhập Bài Tập Mới'}</span>
          </button>
        </div>

        {error && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, color: '#FCA5A5', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Tab 1: Library Selector */}
        {activeTab === 'library' && (
          <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            {/* Search & Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm theo tên bài tập..."
                  className="input-field"
                  style={{ paddingLeft: 36, width: '100%', marginBottom: 0 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 12 }}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: selectedCategory === c.id ? '#0EA5E9' : 'rgba(255,255,255,0.1)',
                    background: selectedCategory === c.id ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: selectedCategory === c.id ? '#38BDF8' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromLibrary(item)}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 165, 233, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ color: '#F8FAFC', fontSize: 14 }}>{item.nameVi}</strong>
                      <span className="badge badge-purple" style={{ fontSize: 10, padding: '2px 6px' }}>
                        {item.categoryLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {item.nameEn} • {item.equipment} • {item.sets} hiệp x {item.repsMin}-{item.repsMax} reps
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12, pointerEvents: 'none' }}
                  >
                    <Plus size={13} />
                    <span>Chọn</span>
                  </button>
                </div>
              ))}

              {filteredLibrary.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
                  Không tìm thấy bài tập phù hợp. Bạn có thể chuyển sang tab &quot;Tự Nhập Bài Mới&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleSubmit} style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="field-label" style={{ fontSize: 12 }}>Tên Bài Tập (Tiếng Việt) *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Ví dụ: Đẩy Ngực Dốc Lên"
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label" style={{ fontSize: 12 }}>Tên Tiếng Anh</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ví dụ: Incline DB Press"
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
                placeholder="Ví dụ: Ghế dốc + Tạ đơn / Giàn cáp"
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
                  placeholder="RIR 1-2"
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
                placeholder="Ghi chú về góc cùi chỏ, hạ bả vai, gồng lõi bụng..."
                value={techniqueNote}
                onChange={(e) => setTechniqueNote(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="field-label" style={{ fontSize: 12 }}>Link Video Hướng Dẫn (Tùy chọn)</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://www.youtube.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Đang thêm...' : 'Lưu Bài Tập Vào Lịch'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
