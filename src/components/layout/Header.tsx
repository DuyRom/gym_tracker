'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Dumbbell,
  LayoutDashboard,
  Calendar,
  PlayCircle,
  History,
  LineChart,
  Image as ImageIcon,
  Utensils,
  LogOut,
  User,
  Users,
  Key,
  Shield,
  Menu,
} from 'lucide-react';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import MobileDrawer from '@/components/layout/MobileDrawer';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Tổng Quan', icon: LayoutDashboard },
    { href: '/workout', label: 'Tập Luyện', icon: PlayCircle },
    { href: '/schedule', label: 'Lịch Tập 5 Ngày', icon: Calendar },
    { href: '/history', label: 'Lịch Sử', icon: History },
    { href: '/analytics', label: 'Phân Tích', icon: LineChart },
    { href: '/gallery', label: 'Thư Viện 3D', icon: ImageIcon },
    { href: '/nutrition', label: 'Dinh Dưỡng', icon: Utensils },
  ];

  // Add User Management menu if user is Admin
  if (currentUser?.role === 'ADMIN') {
    navLinks.push({ href: '/users', label: 'Quản Lý User', icon: Users });
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="brand-logo">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              }}
            >
              <Dumbbell size={20} color="#fff" />
            </div>
            <span>Gym Tracker</span>
            <span className="brand-badge">PRO</span>
          </Link>

          <nav className="header-nav">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <div className="header-user">
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="user-badge">
                    <div
                      className="user-avatar"
                      style={{
                        background:
                          currentUser.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                            : 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                      }}
                    >
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-badge-name" style={{ fontWeight: 600 }}>{currentUser.name || 'User'}</span>
                    {currentUser.role === 'ADMIN' && (
                      <span style={{ fontSize: 10, color: '#C4B5FD', background: 'rgba(139, 92, 246, 0.25)', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                        ADMIN
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="btn btn-secondary header-user-action-btn"
                    style={{ padding: '6px 10px', fontSize: 12 }}
                    title="Đổi mật khẩu tài khoản của bạn"
                  >
                    <Key size={14} />
                    <span style={{ display: 'none' }}>Đổi MK</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary header-user-action-btn"
                    style={{ padding: '6px 10px', fontSize: 12 }}
                    title="Đăng xuất"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                  <User size={14} />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="mobile-hamburger-btn"
              aria-label="Mở menu điều hướng"
              title="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={currentUser}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
