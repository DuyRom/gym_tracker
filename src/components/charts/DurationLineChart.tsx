'use client';

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
import { WeeklyStat } from '@/types/stats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DurationLineChart({ data }: { data: WeeklyStat[] }) {
  const chartData = {
    labels: data.map((d) => d.weekLabel),
    datasets: [
      {
        label: 'Thời gian tập (Phút)',
        data: data.map((d) => d.totalMinutes),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#34D399',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` ${context.raw} phút`,
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
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: 260, position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
