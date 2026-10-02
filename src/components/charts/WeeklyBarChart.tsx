'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { WeeklyStat } from '@/types/stats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WeeklyBarChart({ data }: { data: WeeklyStat[] }) {
  const chartData = {
    labels: data.map((d) => d.weekLabel),
    datasets: [
      {
        label: 'Số buổi tập',
        data: data.map((d) => d.sessionCount),
        backgroundColor: 'rgba(6, 182, 212, 0.75)',
        hoverBackgroundColor: '#06B6D4',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#67E8F9',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => ` ${context.raw} buổi tập`,
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
          stepSize: 1,
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: 260, position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
