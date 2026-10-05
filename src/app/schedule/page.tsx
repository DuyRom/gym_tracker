'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Video,
  Play,
  Plus,
  RotateCcw,
  History,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowRightLeft,
  Edit2,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AddExerciseModal from '@/components/schedule/AddExerciseModal';
import EditExerciseModal from '@/components/schedule/EditExerciseModal';
import MoveExerciseModal from '@/components/schedule/MoveExerciseModal';
import ActivityTimelineModal from '@/components/schedule/ActivityTimelineModal';

export default function SchedulePage() {
  const [days, setDays] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1); // 1 = T2, 2 = T3...
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<any | null>(null);
  const [movingExercise, setMovingExercise] = useState<any | null>(null);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [deletingExercise, setDeletingExercise] = useState<any | null>(null);

  // Drag and Drop state
  const [draggedExerciseId, setDraggedExerciseId] = useState<string | null>(null);
  const [dragOverExerciseId, setDragOverExerciseId] = useState<string | null>(null);
  const [dragOverDayTab, setDragOverDayTab] = useState<number | null>(null);

  // Load schedule data
  const loadSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (data.days) setDays(data.days);
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const flashMessage = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const currentDay = days.find((d) => d.dayOfWeek === activeTab) || days[0];

  // Reorder exercises locally and commit to API
  const handleReorder = async (orderedIds: string[]) => {
    if (!currentDay) return;

    // Optimistic local update
    const updatedExercises = orderedIds
      .map((id, index) => {
        const ex = currentDay.exercises.find((e: any) => e.id === id);
        return ex ? { ...ex, orderIndex: index + 1 } : null;
      })
      .filter(Boolean);

    setDays((prev) =>
      prev.map((d) => (d.id === currentDay.id ? { ...d, exercises: updatedExercises } : d))
    );

    try {
      const res = await fetch('/api/schedule/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId: currentDay.id,
          orderedExerciseIds: orderedIds,
        }),
      });
      const data = await res.json();
      if (data.days) {
        setDays(data.days);
        // Refresh logs in background
        fetch('/api/schedule/logs')
          .then((r) => r.json())
          .then((l) => l.logs && setLogs(l.logs));
      }
      flashMessage('Đã cập nhật thứ tự bài tập');
    } catch (err) {
      console.error('Reorder error:', err);
      loadSchedule(); // Revert on failure
    }
  };

  // Move exercise up in the list
  const handleMoveUp = (index: number) => {
    if (!currentDay || index <= 0) return;
    const currentExercises = [...currentDay.exercises];
    const temp = currentExercises[index];
    currentExercises[index] = currentExercises[index - 1];
    currentExercises[index - 1] = temp;
    handleReorder(currentExercises.map((e: any) => e.id));
  };

  // Move exercise down in the list
  const handleMoveDown = (index: number) => {
    if (!currentDay || index >= currentDay.exercises.length - 1) return;
    const currentExercises = [...currentDay.exercises];
    const temp = currentExercises[index];
    currentExercises[index] = currentExercises[index + 1];
    currentExercises[index + 1] = temp;
    handleReorder(currentExercises.map((e: any) => e.id));
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, exerciseId: string) => {
    e.dataTransfer.setData('text/plain', exerciseId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedExerciseId(exerciseId);
  };

  const handleDragOverCard = (e: React.DragEvent, exerciseId: string) => {
    e.preventDefault();
    if (draggedExerciseId !== exerciseId) {
      setDragOverExerciseId(exerciseId);
    }
  };

  const handleDropOnCard = (e: React.DragEvent, targetExerciseId: string) => {
    e.preventDefault();
    setDragOverExerciseId(null);
    if (!draggedExerciseId || draggedExerciseId === targetExerciseId || !currentDay) return;

    const ids = currentDay.exercises.map((e: any) => e.id);
    const fromIndex = ids.indexOf(draggedExerciseId);
    const toIndex = ids.indexOf(targetExerciseId);

    if (fromIndex !== -1 && toIndex !== -1) {
      ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, draggedExerciseId);
      handleReorder(ids);
    }
    setDraggedExerciseId(null);
  };

  // Drop onto another Day Tab (Move exercise across days)
  const handleDropOnTab = async (e: React.DragEvent, targetDayOfWeek: number) => {
    e.preventDefault();
    setDragOverDayTab(null);
    if (!draggedExerciseId || targetDayOfWeek === activeTab) return;

    const targetDay = days.find((d) => d.dayOfWeek === targetDayOfWeek);
    if (!targetDay) return;

    try {
      const res = await fetch('/api/schedule/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: draggedExerciseId,
          targetDayId: targetDay.id,
        }),
      });
      const data = await res.json();
      if (data.days) {
        setDays(data.days);
        fetch('/api/schedule/logs')
          .then((r) => r.json())
          .then((l) => l.logs && setLogs(l.logs));
      }
      flashMessage(`Đã chuyển bài sang ${targetDay.name}`);
    } catch (err) {
      console.error('Drag move error:', err);
    } finally {
      setDraggedExerciseId(null);
    }
  };

  // Confirm delete exercise
  const handleDeleteConfirm = async () => {
    if (!deletingExercise) return;
    try {
      const res = await fetch(`/api/schedule/exercises?exerciseId=${deletingExercise.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.days) {
        setDays(data.days);
        fetch('/api/schedule/logs')
          .then((r) => r.json())
          .then((l) => l.logs && setLogs(l.logs));
      }
      flashMessage(`Đã xóa bài "${deletingExercise.nameVi}" khỏi lịch`);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingExercise(null);
    }
  };

  // Confirm reset schedule to default
  const handleResetConfirm = async () => {
    try {
      const res = await fetch('/api/schedule/reset', { method: 'POST' });
      const data = await res.json();
      if (data.days) {
        setDays(data.days);
        fetch('/api/schedule/logs')
          .then((r) => r.json())
          .then((l) => l.logs && setLogs(l.logs));
      }
      flashMessage('Đã khôi phục giáo án khoa học chuẩn mặc định');
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setShowResetConfirm(false);
    }
  };

  return (
    <main className="container" style={{ paddingBottom: 80 }}>
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.4)',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Sparkles size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 8 }}>
              <span className="badge badge-cyan">TÙY BIẾN LINH HOẠT</span>
              <span className="badge badge-emerald">KÉO THẢ BÀI TẬP</span>
              <span className="badge badge-purple">NHẬT KÝ THAY ĐỔI</span>
            </div>
            <h1>Lịch Tập Chi Tiết & Tùy Biến Luyện Tập</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
              Kéo thả sắp xếp bài tập, di chuyển giữa các thứ trong tuần, thêm/xóa bài tập theo nhu cầu thể trạng của riêng bạn.
            </p>
          </div>

          <div className="hero-actions-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowLogsModal(true)}
              style={{ fontSize: 13 }}
            >
              <History size={15} />
              <span>Nhật Ký Tùy Biến ({logs.length})</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowResetConfirm(true)}
              style={{ fontSize: 13, color: '#94A3B8' }}
              title="Khôi phục lại toàn bộ bài tập chuẩn mặc định ban đầu"
            >
              <RotateCcw size={15} />
              <span>Khôi Phục Mặc Định</span>
            </button>

            <Link href="/workout" className="btn btn-primary btn-cta-full" style={{ padding: '10px 18px' }}>
              <Play size={15} fill="currentColor" />
              <span>Vào Phòng Tập Ngay</span>
            </Link>
          </div>
        </div>

        {/* Tab Selector (Supports Drag and Drop target tabs!) */}
        <div className="tab-group" style={{ marginBottom: 0 }}>
          {days.map((d) => {
            const dayMeta: Record<number, { full: string; mobile: string }> = {
              1: { full: 'Thứ 2 (Upper A)', mobile: 'T2 • Upper A' },
              2: { full: 'Thứ 3 (Lower A)', mobile: 'T3 • Lower A' },
              3: { full: 'Thứ 4 (Phục Hồi)', mobile: 'T4 • Nghỉ' },
              4: { full: 'Thứ 5 (Upper B)', mobile: 'T5 • Upper B' },
              5: { full: 'Thứ 6 (Lower B)', mobile: 'T6 • Lower B' },
              6: { full: 'Thứ 7 (Nghỉ)', mobile: 'T7 • Nghỉ' },
              7: { full: 'Chủ Nhật (Nghỉ)', mobile: 'CN • Nghỉ' },
            };
            const meta = dayMeta[d.dayOfWeek] || { full: `Thứ ${d.dayOfWeek + 1}`, mobile: `T${d.dayOfWeek + 1}` };
            const isTabDragOver = dragOverDayTab === d.dayOfWeek;

            return (
              <button
                key={d.id}
                className={`tab-btn ${activeTab === d.dayOfWeek ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  border: isTabDragOver ? '2px dashed #0EA5E9' : undefined,
                  background: isTabDragOver ? 'rgba(14, 165, 233, 0.25)' : undefined,
                  transform: isTabDragOver ? 'scale(1.05)' : undefined,
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onClick={() => setActiveTab(d.dayOfWeek)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedExerciseId && d.dayOfWeek !== activeTab) {
                    setDragOverDayTab(d.dayOfWeek);
                  }
                }}
                onDragLeave={() => setDragOverDayTab(null)}
                onDrop={(e) => handleDropOnTab(e, d.dayOfWeek)}
                type="button"
              >
                <span className="tab-label-desktop">{meta.full}</span>
                <span className="tab-label-mobile">{meta.mobile}</span>
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.1)',
                  }}
                >
                  {d.exercises?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Day Content */}
      {currentDay && (
        <section className="day-card" style={{ marginTop: 24 }}>
          {/* Day Header & Actions */}
          <div className="day-header">
            <div className="day-title">
              <span
                className="day-tag"
                style={{
                  background:
                    currentDay.dayType === 'RECOVERY'
                      ? 'rgba(139, 92, 246, 0.14)'
                      : 'rgba(14, 165, 233, 0.12)',
                  color: currentDay.dayType === 'RECOVERY' ? '#C4B5FD' : '#38BDF8',
                  borderColor:
                    currentDay.dayType === 'RECOVERY'
                      ? 'rgba(139, 92, 246, 0.3)'
                      : 'rgba(14, 165, 233, 0.28)',
                }}
              >
                THỨ {currentDay.dayOfWeek + 1 === 7 ? '7' : currentDay.dayOfWeek + 1}
              </span>
              <div>
                <div className="day-name">{currentDay.name}</div>
                <div className="day-focus">{currentDay.focus}</div>
              </div>
            </div>

            <div className="day-header-actions">
              <span className="badge badge-emerald">
                <Clock size={13} />
                ⏱️ {currentDay.durationMin} phút
              </span>

              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: 13 }}
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={14} />
                <span>Thêm Bài Tập</span>
              </button>
            </div>
          </div>

          {/* Helper hint for drag and drop */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(14, 165, 233, 0.06)',
              border: '1px solid rgba(14, 165, 233, 0.15)',
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#94A3B8',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Info size={14} color="#38BDF8" />
              <span>
                💡 <strong>Mẹo:</strong> Kéo thả ⋮⋮ để đổi thứ tự bài tập, hoặc kéo thả vào Tab Thứ khác để đổi lịch!
              </span>
            </div>
            <span style={{ color: '#38BDF8', fontWeight: 600 }}>
              Tổng: {currentDay.exercises?.length || 0} bài tập
            </span>
          </div>

          {/* Exercises List (Draggable Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentDay.exercises.map((ex: any, idx: number) => {
              const isDraggingThis = draggedExerciseId === ex.id;
              const isDragOverThis = dragOverExerciseId === ex.id;

              return (
                <div
                  key={ex.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ex.id)}
                  onDragOver={(e) => handleDragOverCard(e, ex.id)}
                  onDragLeave={() => setDragOverExerciseId(null)}
                  onDrop={(e) => handleDropOnCard(e, ex.id)}
                  className="schedule-exercise-card"
                  style={{
                    background: isDraggingThis
                      ? 'rgba(14, 165, 233, 0.12)'
                      : isDragOverThis
                      ? 'rgba(14, 165, 233, 0.2)'
                      : 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid',
                    borderColor: isDragOverThis
                      ? '#0EA5E9'
                      : isDraggingThis
                      ? 'rgba(14, 165, 233, 0.5)'
                      : 'var(--card-border)',
                    boxShadow: isDragOverThis ? '0 0 16px rgba(14, 165, 233, 0.3)' : 'none',
                    opacity: isDraggingThis ? 0.6 : 1,
                  }}
                >
                  {/* Left: Drag handle + STT + Info */}
                  <div className="schedule-exercise-left">
                    {/* Drag Handle */}
                    <div
                      style={{
                        cursor: 'grab',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 2px',
                        flexShrink: 0,
                      }}
                      title="Kéo thả bài tập"
                    >
                      <GripVertical size={18} />
                    </div>

                    {/* Order Index */}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#64748B',
                        width: 22,
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Name & Sub-details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
                          {ex.nameVi}
                        </span>
                        {ex.nameEn && ex.nameEn !== ex.nameVi && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            ({ex.nameEn})
                          </span>
                        )}
                        <span className="badge badge-purple" style={{ fontSize: 11, padding: '1px 6px' }}>
                          {ex.rir}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)', marginTop: 4, flexWrap: 'wrap' }}>
                        <span>
                          ⚙️ <strong style={{ color: '#E2E8F0' }}>{ex.equipment}</strong>
                        </span>
                        <span>
                          🎯 <strong style={{ color: '#38BDF8' }}>{ex.sets} hiệp x {ex.repsMin}–{ex.repsMax} reps</strong>
                        </span>
                        {ex.techniqueNote && (
                          <span style={{ color: 'var(--text-dim)', fontSize: 11 }} title={ex.techniqueNote}>
                            📝 {ex.techniqueNote}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions Toolbar */}
                  <div className="schedule-exercise-actions">
                    {/* Up / Down buttons */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="btn-icon-subtle"
                        title="Di chuyển lên"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === currentDay.exercises.length - 1}
                        className="btn-icon-subtle"
                        title="Di chuyển xuống"
                      >
                        <ChevronDown size={13} />
                      </button>
                    </div>

                    {/* Video link */}
                    {ex.videoUrl && (
                      <a
                        href={ex.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-link-action"
                        style={{ padding: '6px 9px', fontSize: 11 }}
                        title="Xem video minh họa"
                      >
                        <Video size={13} />
                        <span>Video</span>
                      </a>
                    )}

                    {/* Move to another day */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: 12 }}
                      onClick={() => setMovingExercise(ex)}
                      title="Chuyển sang thứ khác"
                    >
                      <ArrowRightLeft size={13} />
                      <span>Chuyển ngày</span>
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: 12 }}
                      onClick={() => setEditingExercise(ex)}
                      title="Chỉnh sửa bài tập"
                    >
                      <Edit2 size={13} />
                      <span>Sửa</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 8px', fontSize: 12, color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                      onClick={() => setDeletingExercise(ex)}
                      title="Xóa bài tập"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {currentDay.exercises.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 12,
                  border: '1px dashed var(--card-border)',
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>
                  Ngày này hiện chưa có bài tập nào.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={14} />
                  <span>Thêm Bài Tập Đầu Tiên</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* IT Posture Section */}
      <section className="day-card" style={{ marginTop: 28 }}>
        <div className="day-header">
          <div className="day-title">
            <span
              className="day-tag"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}
            >
              LƯU Ý DÂN IT
            </span>
            <div className="day-name">4 Vấn Đề Cơ Học Dân Code Cần Lưu Ý Khi Tập</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div className="stat-box" style={{ borderTop: '4px solid #EF4444' }}>
            <h3 style={{ fontSize: 15, color: '#F87171', marginBottom: 6 }}>1. Hội Chứng Gù Cổ Rùa</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              Ngồi code nhìn màn hình lâu kéo vai cuộn về trước, co ngắn cơ ngực bé.
            </p>
            <div style={{ fontSize: 12, color: '#E2E8F0' }}>
              <strong>Khắc phục:</strong> Tập trung vào bài kéo ngang Seated Cable Row và Face Pull. Luôn hạ bả vai trước khi đẩy tạ.
            </div>
          </div>

          <div className="stat-box" style={{ borderTop: '4px solid #F59E0B' }}>
            <h3 style={{ fontSize: 15, color: '#FBBF24', marginBottom: 6 }}>2. Kích Hoạt Cơ Mông</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              Ngồi ghế cả ngày làm tê liệt dẫn truyền thần kinh cơ mông (Glute Amnesia).
            </p>
            <div style={{ fontSize: 12, color: '#E2E8F0' }}>
              <strong>Khắc phục:</strong> Khởi động bằng Glute Bridge hoặc đi bộ dốc máy chạy bộ trước khi vào bài Squat/RDL.
            </div>
          </div>

          <div className="stat-box" style={{ borderTop: '4px solid #3B82F6' }}>
            <h3 style={{ fontSize: 15, color: '#60A5FA', marginBottom: 6 }}>3. Cổ Tay Trung Tính</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              Gõ bàn phím liên tục gây căng gân cổ tay, bẻ gập cổ tay khi tập sẽ gây chấn thương.
            </p>
            <div style={{ fontSize: 12, color: '#E2E8F0' }}>
              <strong>Khắc phục:</strong> Giữ cổ tay thẳng hàng với cẳng tay khi đẩy ngực hoặc cuốn tạ.
            </div>
          </div>

          <div className="stat-box" style={{ borderTop: '4px solid #10B981' }}>
            <h3 style={{ fontSize: 15, color: '#34D399', marginBottom: 6 }}>4. Gồng Lõi Ổ Bụng (Bracing)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              Tạo áp lực ổ bụng vững chắc để bảo vệ đốt sống thắt lưng dưới tải trọng.
            </p>
            <div style={{ fontSize: 12, color: '#E2E8F0' }}>
              <strong>Khắc phục:</strong> Hít sâu bằng cơ hoành, nén chặt bụng quanh eo trước khi hạ tạ.
            </div>
          </div>
        </div>
      </section>

      {/* Add Exercise Modal */}
      {showAddModal && currentDay && (
        <AddExerciseModal
          dayId={currentDay.id}
          dayName={currentDay.name}
          onClose={() => setShowAddModal(false)}
          onSuccess={(updatedDays) => {
            setDays(updatedDays);
            setShowAddModal(false);
            flashMessage('Đã thêm bài tập mới vào lịch');
            fetch('/api/schedule/logs')
              .then((r) => r.json())
              .then((l) => l.logs && setLogs(l.logs));
          }}
        />
      )}

      {/* Edit Exercise Modal */}
      {editingExercise && currentDay && (
        <EditExerciseModal
          exercise={editingExercise}
          dayName={currentDay.name}
          onClose={() => setEditingExercise(null)}
          onSuccess={(updatedDays) => {
            setDays(updatedDays);
            setEditingExercise(null);
            flashMessage('Đã cập nhật bài tập');
            fetch('/api/schedule/logs')
              .then((r) => r.json())
              .then((l) => l.logs && setLogs(l.logs));
          }}
          onDeleteRequest={(ex) => setDeletingExercise(ex)}
        />
      )}

      {/* Move Exercise Modal */}
      {movingExercise && currentDay && (
        <MoveExerciseModal
          exercise={movingExercise}
          currentDayId={currentDay.id}
          allDays={days}
          onClose={() => setMovingExercise(null)}
          onSuccess={(updatedDays) => {
            setDays(updatedDays);
            setMovingExercise(null);
            flashMessage('Đã chuyển bài tập sang ngày mới');
            fetch('/api/schedule/logs')
              .then((r) => r.json())
              .then((l) => l.logs && setLogs(l.logs));
          }}
        />
      )}

      {/* Activity Timeline Modal */}
      {showLogsModal && (
        <ActivityTimelineModal
          logs={logs}
          onClose={() => setShowLogsModal(false)}
        />
      )}

      {/* Confirm Delete Exercise Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingExercise)}
        title="Xóa Bài Tập Khỏi Lịch"
        message={`Bạn có chắc chắn muốn xóa bài "${deletingExercise?.nameVi}" khỏi lịch tập? Lịch sử các buổi tập đã hoàn thành trong quá khứ vẫn sẽ được lưu trữ an toàn.`}
        confirmText="Xác Nhận Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingExercise(null)}
      />

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Khôi Phục Giáo Án Mặc Định"
        message="Hành động này sẽ thiết lập lại toàn bộ bài tập của 5 buổi tập về giáo án khoa học chuẩn ban đầu. Lịch sử các buổi tập bạn đã tập trong quá khứ vẫn được giữ nguyên. Bạn có muốn tiếp tục?"
        confirmText="Khôi Phục Ngay"
        cancelText="Hủy Bỏ"
        variant="warning"
        onConfirm={handleResetConfirm}
        onClose={() => setShowResetConfirm(false)}
      />
    </main>
  );
}
