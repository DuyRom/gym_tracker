'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Đăng nhập không thành công');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Đã có lỗi kết nối, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('duyrnt09@gmail.com');
    setPassword('Odinbi@123#');
  };

  return (
    <main className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="day-card" style={{ maxWidth: 440, width: '100%', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Dumbbell size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Đăng Nhập Gym Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Lưu trữ lịch sử buổi tập và phân tích chỉ số thể hình
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 10, color: '#FDA4AF', fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '12px' }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Demo Quick Login Button */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: 12, padding: '10px 12px', justifyContent: 'center', borderColor: 'rgba(6, 182, 212, 0.35)' }}
          >
            <Sparkles size={14} color="#67E8F9" />
            <span>Điền tài khoản Admin mặc định</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Tài khoản do Quản Trị Viên (Admin) khởi tạo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
