'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Clock, Flame, Award, ArrowRight, Play, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import WeeklyBarChart from '@/components/charts/WeeklyBarChart';
import DurationLineChart from '@/components/charts/DurationLineChart';
import CompletionDonutChart from '@/components/charts/CompletionDonutChart';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap';
import { DashboardStatsResponse } from '@/types/stats';
import { formatDateVi } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const overview = stats?.overview || {
    totalSessions: 0,
    totalDurationMin: 0,
    currentStreakDays: 0,
    completionRate: 100,
    totalMissed: 0,
  };

  return (
    <main className="container">
      {/* Hero Welcome & Quick Action */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 12 }}>
              <span className="badge badge-cyan">🔥 TẬP LUYỆN THÔNG MINH</span>
              <span className="badge badge-emerald">HYPERTROPHY & PHỤC HỒI</span>
              <span className="badge badge-purple">DÀNH RIÊNG DÂN IT</span>
            </div>
            <h1>Bảng Điều Khiển & Phân Tích Thể Hình</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 680 }}>
              Theo dõi chi tiết số buổi tập, tổng thời lượng, quản lý mức tạ tăng dần (Progressive Overload) và giữ vững streak rèn luyện thể lực mỗi ngày.
            </p>
          </div>

          <div className="top-actions">
            <Link href="/workout" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 15 }}>
              <Play size={18} fill="currentColor" />
              <span>Bắt Đầu Tập Hôm Nay</span>
            </Link>
            <Link href="/schedule" className="btn btn-secondary">
              <Calendar size={16} />
              <span>Xem Giáo Án</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="stat-grid">
          <div className="stat-box" style={{ borderLeft: '3px solid #38BDF8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">Tổng Buổi Tập</span>
              <Dumbbell size={16} color="#38BDF8" />
            </div>
            <div className="stat-val" style={{ color: '#38BDF8' }}>
              {overview.totalSessions} <small>buổi</small>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Đã ghi nhận trong hệ thống</span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #34D399' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">Tổng Thời Gian</span>
              <Clock size={16} color="#34D399" />
            </div>
            <div className="stat-val" style={{ color: '#34D399' }}>
              {overview.totalDurationMin} <small>phút</small>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              ~{(overview.totalDurationMin / 60).toFixed(1)} giờ tập luyện
            </span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #F59E0B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">Chuỗi Tập (Streak)</span>
              <Flame size={16} color="#F59E0B" />
            </div>
            <div className="stat-val" style={{ color: '#FCD34D' }}>
              {overview.currentStreakDays} <small>ngày 🔥</small>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Duy trì không bỏ lỡ</span>
          </div>

          <div className="stat-box" style={{ borderLeft: '3px solid #A855F7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">Tỷ Lệ Hoàn Thành</span>
              <Award size={16} color="#A855F7" />
            </div>
            <div className="stat-val" style={{ color: '#C4B5FD' }}>
              {overview.completionRate} <small>%</small>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              {overview.totalMissed > 0 ? `${overview.totalMissed} buổi miss` : 'Kỷ luật tuyệt đối'}
            </span>
          </div>
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Weekly Bar Chart */}
        <div className="day-card" style={{ marginBottom: 0 }}>
          <div className="day-header" style={{ marginBottom: 12, paddingBottom: 10 }}>
            <div className="day-title">
              <span className="day-tag">TẦN SUẤT</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Số Buổi Tập / Tuần</span>
            </div>
          </div>
          {stats?.weeklyStats && <WeeklyBarChart data={stats.weeklyStats} />}
        </div>

        {/* Weekly Duration Line Chart */}
        <div className="day-card" style={{ marginBottom: 0 }}>
          <div className="day-header" style={{ marginBottom: 12, paddingBottom: 10 }}>
            <div className="day-title">
              <span className="day-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                THỜI LƯỢNG
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Tổng Phút Tập / Tuần</span>
            </div>
          </div>
          {stats?.weeklyStats && <DurationLineChart data={stats.weeklyStats} />}
        </div>

        {/* Completion Donut Chart */}
        <div className="day-card" style={{ marginBottom: 0 }}>
          <div className="day-header" style={{ marginBottom: 12, paddingBottom: 10 }}>
            <div className="day-title">
              <span className="day-tag" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                TỶ LỆ
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Hoàn Thành vs Bỏ Lỡ</span>
            </div>
          </div>
          <CompletionDonutChart
            completed={overview.totalSessions}
            missed={overview.totalMissed}
          />
        </div>
      </section>

      {/* Activity Heatmap Grid */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">HEATMAP</span>
            <div>
              <div className="day-name">Nhật Ký Chuyên Cần 45 Ngày Gần Nhất</div>
              <div className="day-focus">Tương tự GitHub contribution graph để theo dõi tính kỷ luật hàng ngày</div>
            </div>
          </div>
        </div>
        {stats?.heatmap && <CalendarHeatmap data={stats.heatmap} />}
      </section>

      {/* Recent Sessions History */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">LỊCH SỬ</span>
            <div>
              <div className="day-name">Các Buổi Tập Gần Đây</div>
              <div className="day-focus">Xem chi tiết thời gian và trạng thái buổi tập</div>
            </div>
          </div>
          <Link href="/history" className="btn btn-secondary" style={{ fontSize: 13, padding: '6px 12px' }}>
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giáo Án</th>
                <th>Trạng Thái</th>
                <th>Thời Gian</th>
                <th>Bài Đã Tập</th>
                <th>Ghi Chú</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentSessions && stats.recentSessions.length > 0 ? (
                stats.recentSessions.slice(0, 5).map((session: any) => {
                  const completedEx = session.exercises?.filter((e: any) => e.completed).length || 0;
                  const totalEx = session.exercises?.length || 0;
                  const isDone = session.status === 'COMPLETED';

                  return (
                    <tr key={session.id}>
                      <td>
                        <strong>{formatDateVi(session.date)}</strong>
                      </td>
                      <td>
                        <span className="exercise-name">{session.workoutDay?.name}</span>
                        <span className="exercise-en">{session.workoutDay?.focus}</span>
                      </td>
                      <td>
                        {isDone ? (
                          <span className="badge badge-emerald" style={{ gap: 4 }}>
                            <CheckCircle size={12} />
                            Đã tập
                          </span>
                        ) : (
                          <span className="badge badge-rose" style={{ gap: 4 }}>
                            <AlertCircle size={12} />
                            Bỏ lỡ
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                          {session.durationMin ? `${session.durationMin} phút` : '--'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono' }}>
                          {completedEx}/{totalEx} bài
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 260 }}>
                        {session.notes || 'Không có ghi chú'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Chưa có buổi tập nào. Hãy bấm Bắt Đầu Tập để ghi nhận buổi đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
