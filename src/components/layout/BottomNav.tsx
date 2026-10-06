'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlayCircle, Calendar, History, LineChart } from 'lucide-react';
import { hapticSelection } from '@/lib/native-bridge';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Tổng Quan', icon: LayoutDashboard },
    { href: '/workout', label: 'Tập Luyện', icon: PlayCircle },
    { href: '/schedule', label: 'Giáo Án', icon: Calendar },
    { href: '/history', label: 'Lịch Sử', icon: History },
    { href: '/analytics', label: 'Thống Kê', icon: LineChart },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => hapticSelection()}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
