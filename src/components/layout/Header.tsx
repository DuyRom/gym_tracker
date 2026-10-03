'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  ChevronDown,
} from 'lucide-react';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import MobileDrawer from '@/components/layout/MobileDrawer';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Tổng Quan', icon: LayoutDashboard },
    { href: '/workout', label: 'Tập Luyện', icon: PlayCircle },
    { href: '/schedule', label: 'Lịch Tập', icon: Calendar },
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
          <Link href="/" className="brand-logo" aria-label="Gym Tracker Trang Chủ">
            <div className="brand-icon-box">
              <Dumbbell size={20} color="#fff" />
            </div>
            <span>Gym Tracker</span>
          </Link>

          <nav className="header-nav" aria-label="Menu chính">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <div className="header-user">
              {currentUser ? (
                <div className="profile-dropdown-container" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="profile-trigger-btn"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    title="Menu tài khoản"
                  >
                    <div
                      className="user-avatar"
                      style={{
                        background:
                          currentUser.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                            : 'linear-gradient(135deg, #0284C7, #3B82F6)',
                      }}
                    >
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#F1F5F9' }}>
                      {currentUser.name || 'User'}
                    </span>
                    {currentUser.role === 'ADMIN' && (
                      <span className="badge-admin">ADMIN</span>
                    )}
                    <ChevronDown size={14} className="profile-trigger-chevron" />
                  </button>

                  {/* Glassmorphism Profile Dropdown */}
                  {isDropdownOpen && (
                    <div className="profile-dropdown-menu" role="menu">
                      <div className="dropdown-user-header">
                        <div className="dropdown-user-name">
                          <span>{currentUser.name || 'Người dùng'}</span>
                          {currentUser.role === 'ADMIN' && (
                            <span className="badge-admin">ADMIN</span>
                          )}
                        </div>
                        {currentUser.email && (
                          <div className="dropdown-user-email">{currentUser.email}</div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsPasswordModalOpen(true);
                        }}
                        className="dropdown-item"
                        role="menuitem"
                      >
                        <Key size={15} color="#38BDF8" />
                        <span>Đổi Mật Khẩu</span>
                      </button>

                      {currentUser.role === 'ADMIN' && (
                        <Link
                          href="/users"
                          onClick={() => setIsDropdownOpen(false)}
                          className="dropdown-item"
                          role="menuitem"
                        >
                          <Users size={15} color="#C4B5FD" />
                          <span>Quản Lý Thành Viên</span>
                        </Link>
                      )}

                      <div className="dropdown-divider" />

                      <button
                        onClick={handleLogout}
                        className="dropdown-item danger"
                        role="menuitem"
                      >
                        <LogOut size={15} />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
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
