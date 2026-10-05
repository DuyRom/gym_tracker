'use client';

import { X, Activity, ArrowRightLeft, PlusCircle, Trash2, Edit3, RotateCcw, Clock } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  createdAt: string | Date;
}

interface ActivityTimelineModalProps {
  logs: ActivityLogItem[];
  onClose: () => void;
}

export default function ActivityTimelineModal({
  logs,
  onClose,
}: ActivityTimelineModalProps) {
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'MOVE':
        return {
          icon: ArrowRightLeft,
          color: '#FBBF24',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.3)',
          label: 'DI CHUYỂN',
        };
      case 'ADD':
        return {
          icon: PlusCircle,
          color: '#34D399',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)',
          label: 'THÊM MỚI',
        };
      case 'DELETE':
        return {
          icon: Trash2,
          color: '#F87171',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)',
          label: 'ĐÃ XÓA',
        };
      case 'EDIT':
        return {
          icon: Edit3,
          color: '#C084FC',
          bg: 'rgba(192, 132, 252, 0.15)',
          border: 'rgba(192, 132, 252, 0.3)',
          label: 'CHỈNH SỬA',
        };
      case 'REORDER':
        return {
          icon: ArrowRightLeft,
          color: '#38BDF8',
          bg: 'rgba(14, 165, 233, 0.15)',
          border: 'rgba(14, 165, 233, 0.3)',
          label: 'SẮP XẾP',
        };
      case 'RESET':
        return {
          icon: RotateCcw,
          color: '#67E8F9',
          bg: 'rgba(6, 182, 212, 0.15)',
          border: 'rgba(6, 182, 212, 0.3)',
          label: 'KHÔI PHỤC',
        };
      default:
        return {
          icon: Activity,
          color: '#94A3B8',
          bg: 'rgba(148, 163, 184, 0.15)',
          border: 'rgba(148, 163, 184, 0.3)',
          label: action,
        };
    }
  };

  const formatLogDate = (d: string | Date) => {
    const date = new Date(d);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>
                Nhật Ký Tùy Biến Lịch Tập
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                Toàn bộ lịch sử thêm, xóa, đổi thứ tự và chuyển đổi ngày tập của bạn
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>Chưa có thay đổi nào được ghi lại.</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                Khi bạn di chuyển, thêm hoặc sắp xếp lại bài tập, hệ thống sẽ tự động lưu vết tại đây.
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              {/* Vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: 6,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  return (
                    <div key={log.id} style={{ position: 'relative' }}>
                      {/* Dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -20,
                          top: 4,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: badge.color,
                          border: '3px solid #090D16',
                          boxShadow: `0 0 8px ${badge.color}`,
                        }}
                      />

                      <div
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--card-border)',
                          borderRadius: 10,
                          padding: '12px 16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            <Icon size={12} />
                            {badge.label}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {formatLogDate(log.createdAt)}
                          </span>
                        </div>

                        <p style={{ margin: 0, fontSize: 13, color: '#E2E8F0', lineHeight: 1.5 }}>
                          {log.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
