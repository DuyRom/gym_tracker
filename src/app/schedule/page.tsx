'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Video, Dumbbell, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { WorkoutDayItem } from '@/types/workout';

export default function SchedulePage() {
  const [days, setDays] = useState<WorkoutDayItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1); // 1 = T2, 2 = T3...
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/exercises')
      .then((res) => res.json())
      .then((data) => {
        if (data.days) setDays(data.days);
      })
      .catch((err) => console.error('Failed to load schedule:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentDay = days.find((d) => d.dayOfWeek === activeTab) || days[0];

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 8 }}>
              <span className="badge badge-cyan">GIÁO ÁN CHUẨN KHOA HỌC</span>
              <span className="badge badge-emerald">5 BUỔI / TUẦN</span>
              <span className="badge badge-purple">45 PHÚT / BUỔI</span>
            </div>
            <h1>Lịch Tập Chi Tiết & Kỹ Thuật Cơ Học</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
              Thiết kế theo phân nhánh Upper / Lower / Recovery, tối ưu thời gian 45 phút sau giờ làm việc cho dân IT.
            </p>
          </div>

          <Link href="/workout" className="btn btn-primary" style={{ padding: '12px 22px' }}>
            <Play size={16} fill="currentColor" />
            <span>Vào Phòng Tập Ngay</span>
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="tab-nav" style={{ marginBottom: 0 }}>
          {days.map((d) => {
            const dayLabels = ['Thứ 2 (Upper A)', 'Thứ 3 (Lower A)', 'Thứ 4 (Active Recovery)', 'Thứ 5 (Upper B)', 'Thứ 6 (Lower B)'];
            const label = dayLabels[d.dayOfWeek - 1] || `Thứ ${d.dayOfWeek + 1}`;
            return (
              <button
                key={d.id}
                className={`tab-btn ${activeTab === d.dayOfWeek ? 'active' : ''}`}
                onClick={() => setActiveTab(d.dayOfWeek)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Day Content */}
      {currentDay && (
        <section className="day-card">
          <div className="day-header">
            <div className="day-title">
              <span className="day-tag" style={{
                background: currentDay.dayType === 'RECOVERY' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.15)',
                color: currentDay.dayType === 'RECOVERY' ? '#C4B5FD' : '#67E8F9',
                borderColor: currentDay.dayType === 'RECOVERY' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.3)',
              }}>
                THỨ {currentDay.dayOfWeek + 1 === 7 ? '7' : currentDay.dayOfWeek + 1}
              </span>
              <div>
                <div className="day-name">{currentDay.name}</div>
                <div className="day-focus">{currentDay.focus}</div>
              </div>
            </div>
            <span className="badge badge-emerald">
              <Clock size={13} />
              ⏱️ 17:00 – 17:45 ({currentDay.durationMin} phút)
            </span>
          </div>

          {/* If Wednesday (Active Recovery), special card styling */}
          {currentDay.dayOfWeek === 3 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {currentDay.exercises.map((ex, idx) => (
                <div key={ex.id} className="stat-box" style={{ background: 'rgba(15, 23, 42, 0.8)', borderLeft: '3px solid #8B5CF6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <strong style={{ color: '#A78BFA', fontSize: 15 }}>
                      {idx + 1}. {ex.nameVi}
                    </strong>
                    {ex.videoUrl && (
                      <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="btn-link-action" style={{ padding: '4px 8px', fontSize: 11 }}>
                        <Video size={12} />
                        <span>Video</span>
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {ex.techniqueNote}
                  </p>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#C4B5FD', fontWeight: 600 }}>
                    Thiết bị: {ex.equipment} • {ex.sets} hiệp ({ex.rir})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Training Days Table */
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>STT</th>
                    <th>Tên Bài Tập</th>
                    <th style={{ width: 130, textAlign: 'center' }}>Video Minh Họa</th>
                    <th>Thiết Bị</th>
                    <th>Hiệp x Reps</th>
                    <th>Ngưỡng RIR</th>
                    <th>Lưu Ý Kỹ Thuật Sinh Học</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDay.exercises.map((ex) => (
                    <tr key={ex.id}>
                      <td>
                        <strong>{String(ex.orderIndex).padStart(2, '0')}</strong>
                      </td>
                      <td>
                        <span className="exercise-name">{ex.nameVi}</span>
                        <span className="exercise-en">{ex.nameEn}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {ex.videoUrl && (
                          <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="btn-link-action">
                            <Video size={13} />
                            <span>🎬 Xem video</span>
                          </a>
                        )}
                      </td>
                      <td>{ex.equipment}</td>
                      <td>
                        <strong>{ex.sets} hiệp x {ex.repsMin}–{ex.repsMax} reps</strong>
                      </td>
                      <td>
                        <span className="rir-tag">{ex.rir}</span>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 320 }}>
                        {ex.techniqueNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* IT Posture Section */}
      <section className="day-card" style={{ marginTop: 28 }}>
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
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
    </main>
  );
}
