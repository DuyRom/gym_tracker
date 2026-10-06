'use client';

import { useEffect } from 'react';
import { initStatusBar, initBackButton, isNativePlatform } from '@/lib/native-bridge';

export default function NativeAppInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isNativePlatform()) {
      document.documentElement.classList.add('is-native-app');
      initStatusBar();
      initBackButton();
    }
  }, []);

  return null;
}
