'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  Sparkles,
  Dumbbell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Flame,
} from 'lucide-react';
import { DashboardStatsResponse } from '@/types/stats';
import { useDataSync } from '@/lib/data-sync';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AiSessionRecord {
  id: string;
  exerciseType: string;
  exerciseName: string;
  totalReps: number;
  goodReps: number;
  avgFormScore: number;
  durationSec: number;
  feedbackSummary: string | null;
  createdAt: string;
}

interface AiAggregatedStats {
  totalSessions: number;
  totalReps: number;
  totalGoodReps: number;
  goodRepsRate: number;
  overallAvgFormScore: number;
  totalDurationSec: number;
  exerciseBreakdown: Array<{
    exerciseType: string;
    sessionCount: number;
    totalReps: number;
    goodReps: number;
    avgScore: number;
    bestScore: number;
  }>;
}

const AI_EXERCISES = [
  { key: 'all', name: 'Tất Cả Bài Tập', icon: '✨' },
  { key: 'squat', name: 'Squat', icon: '🏋️‍♂️' },
  { key: 'bicep_curl', name: 'Bicep Curl', icon: '💪' },
  { key: 'shoulder_press', name: 'Shoulder Press', icon: '🚀' },
  { key: 'lat_pulldown', name: 'Lat Pulldown', icon: '🦅' },
  { key: 'cable_row', name: 'Cable Row', icon: '🚣‍♂️' },
  { key: 'lateral_raise', name: 'Lateral Raise', icon: '🕊️' },
  { key: 'pushup', name: 'Push-up', icon: '⚡' },
  { key: 'deadlift', name: 'Deadlift', icon: '🔥' },
  { key: 'lunge', name: 'Lunge', icon: '🦵' },
];

export default function AnalyticsPage() {
  const [activeMainTab, setActiveMainTab] = useState<'progressive_overload' | 'ai_coach'>(
    'progressive_overload'
  );

  // Progressive Overload states
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [selectedExName, setSelectedExName] = useState<string>('');
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // AI Coach states
  const [aiSessions, setAiSessions] = useState<AiSessionRecord[]>([]);
  const [aiStats, setAiStats] = useState<AiAggregatedStats | null>(null);
  const [selectedAiExercise, setSelectedAiExercise] = useState<string>('all');
  const [loadingAi, setLoadingAi] = useState<boolean>(true);

  // Fetch Progressive Overload Stats
  const loadStats = useCallback(() => {
    fetch(`/api/stats?_t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
          if (data.stats.progressions?.length > 0) {
            setSelectedExName((prev) => prev || data.stats.progressions[0].exerciseName);
          }
        }
      })
      .catch((err) => console.error('Failed to load progressive stats:', err))
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Fetch AI Coach Sessions & Stats
  const loadAiSessions = useCallback(() => {
    fetch(`/api/v1/ai-coach/sessions?limit=50&_t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setAiSessions(res.data.sessions || []);
          setAiStats(res.data.stats || null);
        }
      })
      .catch((err) => console.error('Failed to load AI sessions:', err))
      .finally(() => setLoadingAi(false));
  }, []);

  useEffect(() => {
    loadAiSessions();
  }, [loadAiSessions]);

  // Reactive data sync
  useDataSync(['SESSION', 'STATS'], loadStats);
  useDataSync(['SESSION'], loadAiSessions);

  // --- Progressive Overload Chart ---
  const progressions = stats?.progressions || [];
  const currentProgression =
    progressions.find((p) => p.exerciseName === selectedExName) || progressions[0];

  const progressionChartData = {
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

  const progressionChartOptions: any = {
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

  // --- AI Coach Filtered Sessions & Charts ---
  const filteredAiSessions =
    selectedAiExercise === 'all'
      ? aiSessions
      : aiSessions.filter((s) => s.exerciseType === selectedAiExercise);

  // Chronological order for trend line chart
  const chronoAiSessions = [...filteredAiSessions].reverse();

  const aiScoreChartData = {
    labels: chronoAiSessions.map((s) => {
      const d = new Date(s.createdAt);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Điểm Form Trung Bình (0–100)',
        data: chronoAiSessions.map((s) => s.avgFormScore),
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: chronoAiSessions.map((s) =>
          s.avgFormScore >= 80 ? '#10B981' : s.avgFormScore >= 60 ? '#F59E0B' : '#EF4444'
        ),
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const aiScoreChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` Điểm Form: ${context.raw}/100`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          stepSize: 20,
        },
      },
    },
  };

  // Reps Breakdown Bar Chart per Exercise
  const breakdownLabels = (aiStats?.exerciseBreakdown || []).map((b) => {
    const found = AI_EXERCISES.find((e) => e.key === b.exerciseType);
    return found ? `${found.icon} ${found.name}` : b.exerciseType;
  });

  const aiRepsBarData = {
    labels: breakdownLabels,
    datasets: [
      {
        label: 'Reps Đạt Chuẩn Form',
        data: (aiStats?.exerciseBreakdown || []).map((b) => b.goodReps),
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
      {
        label: 'Reps Cần Cải Thiện',
        data: (aiStats?.exerciseBreakdown || []).map((b) => Math.max(0, b.totalReps - b.goodReps)),
        backgroundColor: 'rgba(239, 68, 68, 0.65)',
        borderRadius: 6,
      },
    ],
  };

  const aiRepsBarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#CBD5E1', font: { family: 'Plus Jakarta Sans', size: 12 } },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <main className="container" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Top Main Mode Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
          background: 'rgba(15, 23, 42, 0.6)',
          padding: 6,
          borderRadius: 14,
          border: '1px solid var(--card-border)',
        }}
      >
        <button
          onClick={() => setActiveMainTab('progressive_overload')}
          className={`tab-btn ${activeMainTab === 'progressive_overload' ? 'active' : ''}`}
          style={{ flex: '1 1 180px', minWidth: 0, justifyContent: 'center', padding: '10px 12px', fontSize: 13 }}
          type="button"
        >
          <TrendingUp size={16} />
          <span className="tab-label-desktop">🏋️ Khối Lượng Tạ (Progressive Overload)</span>
          <span className="tab-label-mobile">🏋️ Khối Lượng Tạ</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ai_coach')}
          className={`tab-btn ${activeMainTab === 'ai_coach' ? 'active' : ''}`}
          style={{ flex: '1 1 180px', minWidth: 0, justifyContent: 'center', padding: '10px 12px', fontSize: 13 }}
          type="button"
        >
          <Sparkles size={16} color="#38BDF8" />
          <span className="tab-label-desktop">🤖 AI Vision Coach (Form & Reps)</span>
          <span className="tab-label-mobile">🤖 AI Coach Form</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROGRESSIVE OVERLOAD */}
      {/* ========================================================================= */}
      {activeMainTab === 'progressive_overload' && (
        <>
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
                  Nguyên lý cốt lõi của tăng cơ nạc: Tăng dần mức tạ hoặc số reps qua từng tuần mà
                  vẫn giữ form chuẩn và quản lý RIR 1-2.
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
                  <div className="day-name">
                    {currentProgression?.exerciseName || 'Tiến Trình Mức Tạ'}
                  </div>
                  <div className="day-focus">
                    Đường cong tăng tiến trọng lượng tạ theo các buổi tập gần nhất
                  </div>
                </div>
              </div>
              <span className="badge badge-cyan">
                <TrendingUp size={14} />
                Đơn vị: Kilogram (kg)
              </span>
            </div>

            {currentProgression && currentProgression.records.length > 0 ? (
              <div style={{ height: 320, position: 'relative' }}>
                <Line data={progressionChartData} options={progressionChartOptions} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Chưa có đủ dữ liệu tạ cho bài tập này. Hãy nhập mức tạ khi tập luyện để theo dõi biểu
                đồ!
              </div>
            )}
          </section>

          {/* Progressive Overload Guidelines */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            <div className="stat-box" style={{ borderLeft: '4px solid #06B6D4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <TrendingUp size={18} color="#06B6D4" />
                <strong style={{ color: '#67E8F9', fontSize: 15 }}>1. Tăng Tạ Chuẩn RIR</strong>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Chỉ tăng thêm 1–2kg khi ở hiệp cuối cùng bạn đạt đủ số reps tối đa mà vẫn còn dự trữ
                được 1–2 reps trong túi (RIR 1-2).
              </p>
            </div>

            <div className="stat-box" style={{ borderLeft: '4px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <ShieldCheck size={18} color="#10B981" />
                <strong style={{ color: '#6EE7B7', fontSize: 15 }}>
                  2. Kiểm Soát Pha Âm (Eccentric)
                </strong>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Khi hạ tạ, hãm chậm rãi trong 2–3 giây để sợi cơ xé rách li ti có kiểm soát. Tuyệt
                đối không thả rơi tự do để tránh chấn thương khớp.
              </p>
            </div>

            <div className="stat-box" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Zap size={18} color="#F59E0B" />
                <strong style={{ color: '#FCD34D', fontSize: 15 }}>3. Tuần Deload</strong>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Cứ sau mỗi 5–6 tuần tập nặng, dành 1 tuần giảm 40% khối lượng để hệ thần kinh trung
                ương (CNS) và gân khớp phục hồi hoàn toàn.
              </p>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI VISION COACH ANALYTICS */}
      {/* ========================================================================= */}
      {activeMainTab === 'ai_coach' && (
        <>
          {/* AI Hero Banner */}
          <section className="hero-card">
            <div className="hero-top">
              <div className="title-area">
                <div className="badge-group" style={{ marginBottom: 8 }}>
                  <span className="badge badge-cyan" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                    <Sparkles size={13} />
                    AI VISION ANALYTICS
                  </span>
                  <span className="badge badge-emerald">MOVENET LIGHTNING ON-DEVICE</span>
                </div>
                <h1>Thống Kê Kỹ Thuật & Lịch Sử AI Coach</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 680 }}>
                  Theo dõi độ chuẩn xác của tư thế (Form Score), số reps đạt chuẩn và tiến bộ kỹ
                  thuật qua các buổi tập được phân tích bởi AI Vision Coach.
                </p>
              </div>
            </div>

            {/* Exercise Filter Pills */}
            <div className="tab-group" style={{ marginTop: 14 }}>
              {AI_EXERCISES.map((ex) => (
                <button
                  key={ex.key}
                  onClick={() => setSelectedAiExercise(ex.key)}
                  className={`tab-btn ${selectedAiExercise === ex.key ? 'active' : ''}`}
                  type="button"
                >
                  <span>{ex.icon}</span>
                  <span>{ex.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 4 Core AI Metrics Cards */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div className="stat-box" style={{ borderLeft: '4px solid #38BDF8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  TỔNG BUỔI TẬP AI
                </span>
                <Sparkles size={16} color="#38BDF8" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC', marginTop: 4 }}>
                {aiStats?.totalSessions || 0}
              </div>
              <span style={{ fontSize: 11, color: '#38BDF8' }}>Buổi tập có camera phân tích</span>
            </div>

            <div className="stat-box" style={{ borderLeft: '4px solid #818CF8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  TỔNG REPS ĐÃ ĐẾM
                </span>
                <Flame size={16} color="#818CF8" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC', marginTop: 4 }}>
                {aiStats?.totalReps || 0}
              </div>
              <span style={{ fontSize: 11, color: '#A5B4FC' }}>
                {aiStats?.totalGoodReps || 0} reps chuẩn kỹ thuật
              </span>
            </div>

            <div className="stat-box" style={{ borderLeft: '4px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  TỶ LỆ FORM CHUẨN
                </span>
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 4 }}>
                {aiStats?.goodRepsRate || 0}%
              </div>
              <span style={{ fontSize: 11, color: '#6EE7B7' }}>Điểm form đánh giá ≥ 75/100</span>
            </div>

            <div className="stat-box" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  ĐIỂM FORM TRUNG BÌNH
                </span>
                <Award size={16} color="#F59E0B" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>
                {aiStats?.overallAvgFormScore || 0}
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <span style={{ fontSize: 11, color: '#FCD34D' }}>Trung bình mọi buổi tập</span>
            </div>
          </section>

          {/* AI Charts Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 16,
              marginBottom: 16,
            }}
          >
            {/* Chart 1: Form Score Timeline */}
            <section className="day-card" style={{ margin: 0 }}>
              <div className="day-header" style={{ paddingBottom: 10 }}>
                <div className="day-title">
                  <span className="day-tag" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>
                    XU HƯỚNG
                  </span>
                  <div>
                    <div className="day-name">Tiến Trình Điểm Form</div>
                    <div className="day-focus">Điểm kỹ thuật qua từng buổi tập gần đây</div>
                  </div>
                </div>
              </div>

              {chronoAiSessions.length > 0 ? (
                <div style={{ height: 260, position: 'relative' }}>
                  <Line data={aiScoreChartData} options={aiScoreChartOptions} />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  Chưa có dữ liệu bài tập AI. Hãy vào mục <strong>AI Coach</strong> để bắt đầu buổi
                  tập đầu tiên!
                </div>
              )}
            </section>

            {/* Chart 2: Reps Breakdown Bar Chart */}
            <section className="day-card" style={{ margin: 0 }}>
              <div className="day-header" style={{ paddingBottom: 10 }}>
                <div className="day-title">
                  <span className="day-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                    CHẤT LƯỢNG
                  </span>
                  <div>
                    <div className="day-name">Phân Bổ Reps Chuẩn Theo Bài</div>
                    <div className="day-focus">Tỷ lệ reps đạt chuẩn form so với reps lỗi</div>
                  </div>
                </div>
              </div>

              {(aiStats?.exerciseBreakdown || []).length > 0 ? (
                <div style={{ height: 260, position: 'relative' }}>
                  <Bar data={aiRepsBarData} options={aiRepsBarOptions} />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                  Chưa có thống kê bài tập. Dữ liệu sẽ xuất hiện sau khi bạn hoàn thành buổi tập AI!
                </div>
              )}
            </section>
          </div>

          {/* AI Session History List */}
          <section className="day-card">
            <div className="day-header">
              <div className="day-title">
                <span className="day-tag" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }}>
                  NHẬT KÝ
                </span>
                <div>
                  <div className="day-name">Lịch Sử Buổi Tập AI Gần Nhất</div>
                  <div className="day-focus">
                    {filteredAiSessions.length} buổi tập được ghi nhận bởi hệ thống thị giác AI
                  </div>
                </div>
              </div>
            </div>

            {filteredAiSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                {filteredAiSessions.slice(0, 10).map((s) => {
                  const dateStr = new Date(s.createdAt).toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const isGreat = s.avgFormScore >= 80;
                  const isModerate = s.avgFormScore >= 60 && s.avgFormScore < 80;

                  return (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--card-border)',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                          }}
                        >
                          {AI_EXERCISES.find((e) => e.key === s.exerciseType)?.icon || '🏋️'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#F8FAFC' }}>
                            {s.exerciseName}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span>⏱️ {s.durationSec}s</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, color: '#CBD5E1' }}>
                            <strong style={{ color: '#10B981', fontSize: 15 }}>{s.goodReps}</strong> / {s.totalReps} reps chuẩn
                          </div>
                          {s.feedbackSummary && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.feedbackSummary}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontWeight: 800,
                            fontSize: 14,
                            background: isGreat
                              ? 'rgba(16, 185, 129, 0.15)'
                              : isModerate
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                            color: isGreat ? '#10B981' : isModerate ? '#F59E0B' : '#EF4444',
                            border: `1px solid ${
                              isGreat
                                ? 'rgba(16, 185, 129, 0.3)'
                                : isModerate
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'rgba(239, 68, 68, 0.3)'
                            }`,
                          }}
                        >
                          {s.avgFormScore} đ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                Không có lịch sử bài tập phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
