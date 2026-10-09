'use client';

import { useEffect, useRef } from 'react';

export type SyncScope = 'SESSION' | 'SCHEDULE' | 'STATS' | 'ALL';

const SYNC_EVENT_NAME = 'gym-tracker-data-sync';

/**
 * Emit a data change event across the app so all mounted pages/components
 * immediately re-fetch and update their data without requiring page reload.
 */
export function emitDataChange(scope: SyncScope = 'ALL') {
  if (typeof window === 'undefined') return;

  const detail = { scope, timestamp: Date.now() };

  // 1. Dispatch custom event on current window
  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail }));

  // 2. Write to localStorage to trigger storage events across tabs/iframes
  try {
    localStorage.setItem('gym_tracker_sync_ping', JSON.stringify(detail));
  } catch {}
}

/**
 * Hook to automatically listen for data changes and revalidate.
 * Also revalidates when window gains focus or app becomes visible (e.g. Android app resume).
 */
export function useDataSync(
  scopes: SyncScope[],
  onRefresh: () => void | Promise<void>,
  options: { revalidateOnFocus?: boolean } = { revalidateOnFocus: true }
) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ scope: SyncScope; timestamp: number }>;
      const eventScope = customEvent.detail?.scope || 'ALL';

      if (eventScope === 'ALL' || scopes.includes('ALL') || scopes.includes(eventScope)) {
        onRefreshRef.current();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gym_tracker_sync_ping' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const eventScope = parsed.scope || 'ALL';
          if (eventScope === 'ALL' || scopes.includes('ALL') || scopes.includes(eventScope)) {
            onRefreshRef.current();
          }
        } catch {}
      }
    };

    const handleVisibility = () => {
      if (options.revalidateOnFocus && document.visibilityState === 'visible') {
        onRefreshRef.current();
      }
    };

    const handleFocus = () => {
      if (options.revalidateOnFocus) {
        onRefreshRef.current();
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [scopes, options.revalidateOnFocus]);
}
