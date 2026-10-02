'use client';

import { useState } from 'react';
import { HeatmapDay } from '@/types/stats';

export default function CalendarHeatmap({ data }: { data: HeatmapDay[] }) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const getDayColor = (day: HeatmapDay) => {
    if (day.status === 'COMPLETED') {
      if (day.durationMin >= 45) return '#10B981'; // vibrant green
      return '#34D399'; // lighter green
    }
    if (day.status === 'MISSED') {
      return '#F43F5E'; // red
    }
    return 'rgba(255, 255, 255, 0.06)';
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="heatmap-grid">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="heatmap-cell"
            style={{ backgroundColor: getDayColor(item) }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const dateStr = new Date(item.date).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              });
              const statusText =
                item.status === 'COMPLETED'
                  ? `✅ Đã tập (${item.durationMin} phút)`
                  : item.status === 'MISSED'
                  ? '❌ Bỏ lỡ'
                  : 'Nghỉ ngơi';
              setTooltip({
                text: `${dateStr}: ${statusText}`,
                x: rect.left + rect.width / 2,
                y: rect.top - 36,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
        <span>Ít</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(255, 255, 255, 0.06)' }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#34D399' }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#10B981' }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#F43F5E' }} />
        </div>
        <span>Nhiều / Bỏ lỡ</span>
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%)',
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: 11,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
