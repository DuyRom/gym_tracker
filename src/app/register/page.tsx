'use client';

import Link from 'next/link';
import { Dumbbell, ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="day-card" style={{ maxWidth: 460, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: '#FB7185',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
          Đăng Ký Đã Được Giới Hạn
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Hệ thống <strong>Gym Tracker PRO</strong> áp dụng chính sách cấp tài khoản nội bộ. 
          Người dùng không thể tự động đăng ký mà phải do <strong>Quản Trị Viên (Admin)</strong> tạo trong menu quản lý thành viên.
        </p>

        <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left', fontSize: 13, color: '#CBD5E1' }}>
          <div>📧 <strong>Liên hệ Admin:</strong> duyrnt09@gmail.com</div>
          <div style={{ marginTop: 6, color: 'var(--text-dim)', fontSize: 12 }}>
            Nếu bạn là Admin, vui lòng đăng nhập để tạo tài khoản cho thành viên mới.
          </div>
        </div>

        <Link href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          <LogIn size={16} />
          <span>Quay lại trang Đăng Nhập</span>
        </Link>
      </div>
    </main>
  );
}
