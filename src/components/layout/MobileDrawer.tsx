'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
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
  X,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name?: string; email?: string; role?: string } | null;
  onOpenPasswordModal: () => void;
  onLogout: () => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  currentUser,
  onOpenPasswordModal,
  onLogout,
}: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer on Escape key and prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const navLinks = [
    {
      href: '/',
      label: 'Tổng Quan',
      desc: 'Bảng điều khiển & chỉ số nhanh',
      icon: LayoutDashboard,
      color: '#06B6D4',
    },
    {
      href: '/workout',
      label: 'Tập Luyện',
      desc: 'Bấm giờ & ghi log hiệp tập hôm nay',
      icon: PlayCircle,
      color: '#10B981',
    },
    {
      href: '/schedule',
      label: 'Lịch Tập 5 Ngày',
      desc: 'Giáo án Thân Trên - Thân Dưới',
      icon: Calendar,
      color: '#3B82F6',
    },
    {
      href: '/history',
      label: 'Lịch Sử Buổi Tập',
      desc: 'Nhật ký các buổi tập đã hoàn thành',
      icon: History,
      color: '#8B5CF6',
    },
    {
      href: '/analytics',
      label: 'Phân Tích & Tiến Độ',
      desc: 'Biểu đồ khối lượng & tăng cơ RIR',
      icon: LineChart,
      color: '#EC4899',
    },
    {
      href: '/gallery',
      label: 'Thư Viện Kỹ Thuật 3D',
      desc: 'Form chuẩn Bench, RDL & Lat Pulldown',
      icon: ImageIcon,
      color: '#F59E0B',
    },
    {
      href: '/nutrition',
      label: 'Dinh Dưỡng & Macro',
      desc: 'Tính TDEE, Calo & Thực đơn gợi ý',
      icon: Utensils,
      color: '#14B8A6',
    },
  ];

  if (currentUser?.role === 'ADMIN') {
    navLinks.push({
      href: '/users',
      label: 'Quản Lý Người Dùng',
      desc: 'Phân quyền & cấp tài khoản',
      icon: Users,
      color: '#A855F7',
    });
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`mobile-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <aside
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <Link href="/" className="brand-logo" onClick={onClose}>
            <div className="brand-icon-box" style={{ width: 34, height: 34 }}>
              <Dumbbell size={18} color="#fff" />
            </div>
            <span>Gym Tracker</span>
          </Link>

          <button
            onClick={onClose}
            className="mobile-drawer-close"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="mobile-drawer-user-card">
          {currentUser ? (
            <div>
              <div className="drawer-user-info">
                <div
                  className="drawer-avatar"
                  style={{
                    background:
                      currentUser.role === 'ADMIN'
                        ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                        : 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                  }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="drawer-user-text">
                  <div className="drawer-user-name">
                    <span>{currentUser.name || 'Người dùng'}</span>
                    {currentUser.role === 'ADMIN' && (
                      <span className="badge-admin">ADMIN</span>
                    )}
                  </div>
                  <div className="drawer-user-email">
                    {currentUser.email || 'Thành viên'}
                  </div>
                </div>
              </div>

              <div className="drawer-user-actions">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPasswordModal();
                  }}
                  className="btn btn-secondary drawer-action-btn"
                >
                  <Key size={14} />
                  <span>Đổi MK</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="btn btn-danger-soft drawer-action-btn"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="drawer-guest-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Sparkles size={20} color="#06B6D4" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>
                  Lưu & Đồng Bộ Tiến Độ
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                Đăng nhập để lưu mức tạ, lịch sử hiệp tập và theo dõi biểu đồ tiến độ.
              </p>
              <Link
                href="/login"
                onClick={onClose}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}
              >
                <User size={15} />
                <span>Đăng nhập tài khoản</span>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="mobile-drawer-body">
          <div className="drawer-section-title">ĐIỀU HƯỚNG HỆ THỐNG</div>
          <nav className="mobile-drawer-nav">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`drawer-link ${isActive ? 'active' : ''}`}
                >
                  <div
                    className="drawer-link-icon"
                    style={{
                      background: isActive
                        ? `${item.color}25`
                        : 'rgba(255, 255, 255, 0.05)',
                      color: item.color,
                      border: isActive
                        ? `1px solid ${item.color}50`
                        : '1px solid var(--card-border)',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="drawer-link-content">
                    <span className="drawer-link-label">{item.label}</span>
                    <span className="drawer-link-desc">{item.desc}</span>
                  </div>
                  <ChevronRight size={16} className="drawer-link-arrow" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <div className="drawer-footer-badge">
            <span className="dot-online" />
            <span>Giáo Án Tăng Cơ 5 Ngày / Tuần</span>
          </div>
          <div className="drawer-footer-info">
            Gym Tracker v1.0 • fit.odinbi.app
          </div>
        </div>
      </aside>
    </>
  );
}
