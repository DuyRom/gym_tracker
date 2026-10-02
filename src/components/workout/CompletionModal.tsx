'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    durationMin: number;
    completedCount: number;
    totalCount: number;
    dayName: string;
  };
}

export default function CompletionModal({ isOpen, onClose, sessionData }: CompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 110 };

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460, textAlign: 'center', padding: '32px 24px' }} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
          }}
        >
          <Trophy size={36} color="#fff" />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          CHÚC MỪNG BẠN! 🎉
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Bạn đã hoàn thành xuất sắc buổi tập <strong>{sessionData.dayName}</strong> hôm nay.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="stat-box" style={{ background: 'rgba(255, 255, 255, 0.04)', alignItems: 'center' }}>
            <Clock size={20} color="#06B6D4" style={{ marginBottom: 4 }} />
            <span className="stat-label">Thời Gian</span>
            <span className="stat-val" style={{ color: '#06B6D4' }}>{sessionData.durationMin} <small>phút</small></span>
          </div>

          <div className="stat-box" style={{ background: 'rgba(255, 255, 255, 0.04)', alignItems: 'center' }}>
            <CheckCircle2 size={20} color="#10B981" style={{ marginBottom: 4 }} />
            <span className="stat-label">Bài Tập Đã Xong</span>
            <span className="stat-val" style={{ color: '#10B981' }}>
              {sessionData.completedCount}/{sessionData.totalCount}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Đóng
          </button>
          <Link href="/" className="btn btn-primary" style={{ flex: 1.4 }} onClick={onClose}>
            <span>Xem Báo Cáo</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
