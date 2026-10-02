'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CompletionDonutChart({
  completed,
  missed,
}: {
  completed: number;
  missed: number;
}) {
  const chartData = {
    labels: ['Hoàn thành', 'Bỏ lỡ / Nghỉ'],
    datasets: [
      {
        data: [completed, Math.max(0, missed)],
        backgroundColor: ['#10B981', 'rgba(244, 63, 94, 0.7)'],
        borderColor: ['#090D16', '#090D16'],
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#CBD5E1',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#34D399',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  const total = completed + missed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <div style={{ height: 260, position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#10B981',
            fontFamily: 'JetBrains Mono',
          }}
        >
          {percentage}%
        </span>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Tỷ lệ đạt
        </div>
      </div>
    </div>
  );
}
