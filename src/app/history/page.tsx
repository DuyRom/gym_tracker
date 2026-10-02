'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History as HistoryIcon, Calendar, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Play, Dumbbell } from 'lucide-react';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap';
import { formatDateVi, formatTimeVi } from '@/lib/utils';
import { DashboardStatsResponse } from '@/types/stats';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'MISSED'>('ALL');

  useEffect(() => {
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

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'COMPLETED') return s.status === 'COMPLETED';
    if (filter === 'MISSED') return s.status === 'MISSED';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
              Xem lại từng buổi tập đã thực hiện, mức tạ nâng được, tổng thời gian và tính kỷ luật.
            </p>
          </div>

          <Link href="/workout" className="btn btn-primary">
            <Play size={16} fill="currentColor" />
            <span>Tập Buổi Mới</span>
          </Link>
        </div>

        {/* Heatmap */}
        {stats?.heatmap && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
              Hoạt Động 45 Ngày Gần Đây:
            </div>
            <CalendarHeatmap data={stats.heatmap} />
          </div>
        )}
      </section>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('ALL')}
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          Tất cả ({sessions.length})
        </button>
        <button
          className={`btn ${filter === 'COMPLETED' ? 'btn-success' : 'btn-secondary'}`}
          onClick={() => setFilter('COMPLETED')}
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          Đã hoàn thành ({sessions.filter((s) => s.status === 'COMPLETED').length})
        </button>
        <button
          className={`btn ${filter === 'MISSED' ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => setFilter('MISSED')}
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          Bỏ lỡ ({sessions.filter((s) => s.status === 'MISSED').length})
        </button>
      </div>

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
                    }}
                  >
                    {isDone ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                        {session.workoutDay?.name}
                      </span>
                      <span className="badge" style={{ fontSize: 11, padding: '2px 8px' }}>
                        {formatDateVi(session.date)}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {session.workoutDay?.focus}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono', color: isDone ? '#10B981' : '#F43F5E' }}>
                      {session.durationMin ? `${session.durationMin} phút` : isDone ? '45 phút' : '0 phút'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {completedExercises}/{totalExercises} bài tập xong
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
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
                    <div style={{ marginBottom: 14, padding: 10, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 8, fontSize: 13, color: '#CBD5E1' }}>
                      <strong>Ghi chú:</strong> {session.notes}
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
                            <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono' }}>
                              {se.actualWeightKg ? `${se.actualWeightKg} kg` : '--'}
                            </td>
                            <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono' }}>
                              {se.actualSets ? `${se.actualSets} hiệp` : `${se.exercise?.sets} hiệp`}
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
    </main>
  );
}
