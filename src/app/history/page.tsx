'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  History as HistoryIcon,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Dumbbell,
  Trash2,
  Edit3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EditSessionModal from '@/components/workout/EditSessionModal';
import { formatDateVi, formatTimeVi } from '@/lib/utils';
import { DashboardStatsResponse } from '@/types/stats';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'MISSED'>('ALL');

  // Modal states
  const [sessionToEdit, setSessionToEdit] = useState<any | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>('');

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/sessions').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ])
      .then(([sessionsData, statsData]) => {
        if (sessionsData.sessions) setSessions(sessionsData.sessions);
        if (statsData.stats) setStats(statsData.stats);
      })
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'COMPLETED') return s.status === 'COMPLETED';
    if (filter === 'MISSED') return s.status === 'MISSED';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/sessions/${sessionToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Xóa thất bại');
      }

      setNotice('Đã xóa buổi tập thành công!');
      setTimeout(() => setNotice(''), 3000);
      setSessionToDelete(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa buổi tập');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetAllSessions = async () => {
    setResetting(true);

    try {
      const res = await fetch('/api/sessions/reset', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Reset thất bại');
      }

      setNotice('Đã xóa toàn bộ lịch sử tập luyện và đặt lại chỉ số về 0!');
      setTimeout(() => setNotice(''), 4000);
      setShowResetConfirm(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi reset dữ liệu');
    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 8 }}>
              <span className="badge badge-cyan">NHẬT KÝ TẬP LUYỆN</span>
              <span className="badge badge-emerald">LƯU TRỮ VĨNH VIỄN</span>
            </div>
            <h1>Lịch Sử Buổi Tập & Tiến Trình Hoàn Thành</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Xem lại từng buổi tập đã thực hiện, điều chỉnh mức tạ, ghi chú hoặc xóa dữ liệu test nếu cần.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="btn btn-secondary"
                style={{
                  color: '#FB7185',
                  borderColor: 'rgba(244, 63, 94, 0.35)',
                  background: 'rgba(244, 63, 94, 0.08)',
                  fontSize: 13,
                  padding: '9px 14px',
                }}
                title="Xóa toàn bộ các buổi tập test để bắt đầu tập thật từ số 0"
              >
                <RotateCcw size={15} />
                <span>Reset Dữ Liệu Tập</span>
              </button>
            )}

            <Link href="/workout" className="btn btn-primary" style={{ padding: '9px 16px', fontSize: 13 }}>
              <Play size={15} fill="currentColor" />
              <span>Tập Buổi Mới</span>
            </Link>
          </div>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 10,
              color: '#6EE7B7',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {/* Heatmap (only show if there is activity) */}
        {stats?.heatmap && sessions.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
              Hoạt Động 45 Ngày Gần Đây:
            </div>
            <CalendarHeatmap data={stats.heatmap} />
          </div>
        )}
      </section>

      {/* Filter Tabs */}
      <div className="tab-group" style={{ marginBottom: 20, maxWidth: 'fit-content' }}>
        <button
          className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
          type="button"
        >
          Tất cả ({sessions.length})
        </button>
        <button
          className={`tab-btn ${filter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setFilter('COMPLETED')}
          type="button"
        >
          Đã hoàn thành ({sessions.filter((s) => s.status === 'COMPLETED').length})
        </button>
        <button
          className={`tab-btn ${filter === 'MISSED' ? 'active' : ''}`}
          onClick={() => setFilter('MISSED')}
          type="button"
        >
          Bỏ lỡ ({sessions.filter((s) => s.status === 'MISSED').length})
        </button>
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && !loading && (
        <div
          className="day-card"
          style={{
            textAlign: 'center',
            padding: '52px 24px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <HistoryIcon size={28} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>
            Chưa Có Lịch Sử Buổi Tập Nào
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 14,
              maxWidth: 460,
              margin: '0 auto 20px',
              lineHeight: 1.6,
            }}
          >
            Dữ liệu tập luyện của bạn hiện hoàn toàn sạch (0 buổi tập). Bắt đầu buổi tập hôm nay để lưu mức tạ, bấm giờ nghỉ hiệp và theo dõi biểu đồ tiến độ!
          </p>
          <Link href="/workout" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <Play size={16} fill="currentColor" />
            <span>Bắt Đầu Tập Ngay</span>
          </Link>
        </div>
      )}

      {/* Sessions Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredSessions.map((session) => {
          const isDone = session.status === 'COMPLETED';
          const isExpanded = expandedId === session.id;
          const completedExercises = session.exercises?.filter((e: any) => e.completed).length || 0;
          const totalExercises = session.exercises?.length || 0;

          return (
            <div
              key={session.id}
              className="day-card"
              style={{
                marginBottom: 0,
                borderLeft: isDone ? '4px solid #10B981' : '4px solid #F43F5E',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => toggleExpand(session.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDone ? '#10B981' : '#F43F5E',
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                        {session.workoutDay?.name}
                      </span>
                      <span className="badge" style={{ fontSize: 11, padding: '2px 8px' }}>
                        {formatDateVi(session.date)}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                      {session.workoutDay?.focus}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono', color: isDone ? '#10B981' : '#F43F5E' }}>
                      {session.durationMin ? `${session.durationMin} phút` : isDone ? '45 phút' : '0 phút'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {completedExercises}/{totalExercises} bài tập xong
                    </div>
                  </div>

                  {/* Actions: Edit & Delete buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: 12, height: 32 }}
                      onClick={() => setSessionToEdit(session)}
                      title="Chỉnh sửa buổi tập"
                    >
                      <Edit3 size={14} color="#38BDF8" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger-soft"
                      style={{ padding: '6px 10px', fontSize: 12, height: 32 }}
                      onClick={() => setSessionToDelete(session)}
                      title="Xóa buổi tập này"
                    >
                      <Trash2 size={14} />
                      <span>Xóa</span>
                    </button>

                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => toggleExpand(session.id)}
                      title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {session.notes && (
                    <div
                      style={{
                        marginBottom: 14,
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 8,
                        fontSize: 13,
                        color: '#CBD5E1',
                      }}
                    >
                      <strong style={{ color: '#38BDF8' }}>Ghi chú:</strong> {session.notes}
                    </div>
                  )}

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Bài tập</th>
                          <th style={{ textAlign: 'center' }}>Đã tập</th>
                          <th style={{ textAlign: 'center' }}>Mức tạ</th>
                          <th style={{ textAlign: 'center' }}>Hiệp x Reps</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.exercises?.map((se: any) => (
                          <tr key={se.id}>
                            <td>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{se.exercise?.nameVi}</span>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{se.exercise?.equipment}</div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {se.completed ? (
                                <span style={{ color: '#10B981', fontWeight: 700 }}>✅ Xong</span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)' }}>--</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono', color: se.actualWeightKg ? '#38BDF8' : 'inherit' }}>
                              {se.actualWeightKg ? `${se.actualWeightKg} kg` : '--'}
                            </td>
                            <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono' }}>
                              {se.actualSets ? `${se.actualSets} hiệp` : `${se.exercise?.sets} hiệp`}
                              {se.actualReps ? ` (${se.actualReps})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Session Modal */}
      <EditSessionModal
        isOpen={Boolean(sessionToEdit)}
        session={sessionToEdit}
        onClose={() => setSessionToEdit(null)}
        onSaved={() => {
          setNotice('Đã cập nhật buổi tập thành công!');
          setTimeout(() => setNotice(''), 3000);
          loadData();
        }}
      />

      {/* Delete Single Session Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteSession}
        loading={deleting}
        title="Xác Nhận Xóa Buổi Tập"
        message={
          sessionToDelete ? (
            <div>
              Bạn có chắc chắn muốn xóa buổi tập <strong>{sessionToDelete.workoutDay?.name}</strong> ngày{' '}
              <strong>{formatDateVi(sessionToDelete.date)}</strong> không?
              <div style={{ marginTop: 6, color: '#FDA4AF', fontSize: 12 }}>
                ⚠️ Toàn bộ mức tạ và lịch sử của buổi tập này sẽ bị xóa khỏi hệ thống.
              </div>
            </div>
          ) : ''
        }
        confirmText="Xóa buổi tập"
        cancelText="Hủy bỏ"
        variant="danger"
        icon={<Trash2 size={22} />}
      />

      {/* Reset All Sessions Confirm Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetAllSessions}
        loading={resetting}
        title="Reset Toàn Bộ Dữ Liệu Tập Luyện"
        message={
          <div>
            Bạn có chắc chắn muốn <strong>xóa toàn bộ lịch sử các buổi tập</strong> và đưa tất cả chỉ số (tổng buổi tập, thời lượng, chuỗi streak) về <strong>0</strong> không?
            <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: 8, color: '#FDA4AF', fontSize: 12 }}>
              💡 Thao tác này sẽ dọn sạch toàn bộ dữ liệu test ban đầu, giúp bạn bắt đầu tập luyện thực tế với số liệu chính xác 100%.
            </div>
          </div>
        }
        confirmText="Xác nhận Reset Về 0"
        cancelText="Hủy bỏ"
        variant="danger"
        icon={<RotateCcw size={22} />}
      />
    </main>
  );
}
