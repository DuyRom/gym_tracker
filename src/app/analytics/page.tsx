'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';
import { DashboardStatsResponse, ExerciseProgression } from '@/types/stats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExName, setSelectedExName] = useState<string>('');

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
          if (data.stats.progressions?.length > 0) {
            setSelectedExName(data.stats.progressions[0].exerciseName);
          }
        }
      })
      .catch((err) => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const progressions = stats?.progressions || [];
  const currentProgression = progressions.find((p) => p.exerciseName === selectedExName) || progressions[0];

  const chartData = {
    labels: currentProgression?.records?.map((r) => r.date) || [],
    datasets: [
      {
        label: 'Mức tạ (kg)',
        data: currentProgression?.records?.map((r) => r.weightKg) || [],
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#67E8F9',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` Mức tạ: ${context.raw} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <main className="container">
      {/* Header Banner */}
      <section className="hero-card">
        <div className="hero-top">
          <div className="title-area">
            <div className="badge-group" style={{ marginBottom: 8 }}>
              <span className="badge badge-cyan">PROGRESSIVE OVERLOAD</span>
              <span className="badge badge-emerald">QUÁ TẢI TĂNG DẦN</span>
            </div>
            <h1>Biểu Đồ Sức Mạnh & Progressive Overload</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
              Nguyên lý cốt lõi của tăng cơ nạc: Tăng dần mức tạ hoặc số reps qua từng tuần mà vẫn giữ form chuẩn và quản lý RIR 1-2.
            </p>
          </div>
        </div>

        {/* Exercise Selector Pills */}
        <div className="tab-group" style={{ marginTop: 14 }}>
          {progressions.map((p) => (
            <button
              key={p.exerciseName}
              onClick={() => setSelectedExName(p.exerciseName)}
              className={`tab-btn ${selectedExName === p.exerciseName ? 'active' : ''}`}
              type="button"
            >
              {p.exerciseName}
            </button>
          ))}
        </div>
      </section>

      {/* Main Progression Chart Card */}
      <section className="day-card">
        <div className="day-header">
          <div className="day-title">
            <span className="day-tag">BIỂU ĐỒ</span>
            <div>
              <div className="day-name">{currentProgression?.exerciseName || 'Tiến Trình Mức Tạ'}</div>
              <div className="day-focus">Đường cong tăng tiến trọng lượng tạ theo các buổi tập gần nhất</div>
            </div>
          </div>
          <span className="badge badge-cyan">
            <TrendingUp size={14} />
            Đơn vị: Kilogram (kg)
          </span>
        </div>

        {currentProgression && currentProgression.records.length > 0 ? (
          <div style={{ height: 320, position: 'relative' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Chưa có đủ dữ liệu tạ cho bài tập này. Hãy nhập mức tạ khi tập luyện để theo dõi biểu đồ!
          </div>
        )}
      </section>

      {/* Progressive Overload Guidelines */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div className="stat-box" style={{ borderLeft: '4px solid #06B6D4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <TrendingUp size={18} color="#06B6D4" />
            <strong style={{ color: '#67E8F9', fontSize: 15 }}>1. Tăng Tạ Chuẩn RIR</strong>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Chỉ tăng thêm 1–2kg khi ở hiệp cuối cùng bạn đạt đủ số reps tối đa (VD: 10 reps) mà vẫn còn dự trữ được 1–2 reps trong túi (RIR 1-2).
          </p>
        </div>

        <div className="stat-box" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <ShieldCheck size={18} color="#10B981" />
            <strong style={{ color: '#6EE7B7', fontSize: 15 }}>2. Kiểm Soát Pha Âm (Eccentric)</strong>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Khi hạ tạ, hãm chậm rãi trong 2–3 giây để sợi cơ xé rách li ti có kiểm soát. Tuyệt đối không thả rơi tự do để tránh chấn thương khớp vai/gối.
          </p>
        </div>

        <div className="stat-box" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Zap size={18} color="#F59E0B" />
            <strong style={{ color: '#FCD34D', fontSize: 15 }}>3. Tuần Deload</strong>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Cứ sau mỗi 5–6 tuần tập nặng, dành 1 tuần giảm 40% khối lượng để hệ thần kinh trung ương (CNS) và gân khớp phục hồi hoàn toàn.
          </p>
        </div>
      </section>
    </main>
  );
}
