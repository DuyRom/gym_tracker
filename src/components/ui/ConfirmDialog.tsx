'use client';

import { useEffect, ReactNode } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, HelpCircle, X, Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  icon?: ReactNode;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'primary',
  icon,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !loading) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'rgba(244, 63, 94, 0.15)',
          iconBorder: 'rgba(244, 63, 94, 0.3)',
          iconColor: '#FB7185',
          confirmBtnClass: 'btn-danger',
          defaultIcon: <AlertTriangle size={24} />,
        };
      case 'warning':
        return {
          iconBg: 'rgba(245, 158, 11, 0.15)',
          iconBorder: 'rgba(245, 158, 11, 0.3)',
          iconColor: '#FBBF24',
          confirmBtnClass: 'btn-warning',
          defaultIcon: <AlertCircle size={24} />,
        };
      case 'success':
        return {
          iconBg: 'rgba(16, 185, 129, 0.15)',
          iconBorder: 'rgba(16, 185, 129, 0.3)',
          iconColor: '#34D399',
          confirmBtnClass: 'btn-primary',
          defaultIcon: <CheckCircle2 size={24} />,
        };
      default:
        return {
          iconBg: 'rgba(2, 132, 199, 0.15)',
          iconBorder: 'rgba(56, 189, 248, 0.3)',
          iconColor: '#38BDF8',
          confirmBtnClass: 'btn-primary',
          defaultIcon: <HelpCircle size={24} />,
        };
    }
  };

  const v = getVariantStyles();

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1000 }}
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="modal-card"
        style={{
          maxWidth: 440,
          background: '#0B101C',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: v.iconBg,
                border: `1px solid ${v.iconBorder}`,
                color: v.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon || v.defaultIcon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3
                  id="confirm-dialog-title"
                  style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', margin: 0 }}
                >
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                  }}
                  title="Đóng"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                  marginTop: 6,
                }}
              >
                {message}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '9px 16px', fontSize: 13 }}
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${v.confirmBtnClass}`}
              style={{
                padding: '9px 18px',
                fontSize: 13,
                ...(variant === 'danger'
                  ? { background: 'linear-gradient(135deg, #E11D48, #BE123C)', borderColor: '#F43F5E', color: '#fff' }
                  : {}),
              }}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
