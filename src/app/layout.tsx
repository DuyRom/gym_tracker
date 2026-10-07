import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WorkoutTimerWidget from '@/components/workout/WorkoutTimerWidget';
import NativeAppInitializer from '@/components/NativeAppInitializer';

export const metadata: Metadata = {
  title: 'Gym Tracker - Giáo Án Thể Hình & Tăng Cơ Cho Lập Trình Viên',
  description: 'Ứng dụng theo dõi tập luyện thể hình, bấm giờ buổi tập, quản lý bài tập và thống kê tiến độ tăng cơ cho lập trình viên.',
  manifest: '/manifest.webmanifest?v=1.0.8',
  icons: {
    icon: '/images/favicon.svg',
    apple: '/images/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gym Tracker',
  },
};

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NativeAppInitializer />
        <Header />
        {children}
        <WorkoutTimerWidget />
        <BottomNav />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => {
                      console.log('PWA ServiceWorker registered:', reg.scope);
                      reg.update();
                    })
                    .catch(err => console.log('PWA SW error:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
