import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

export const isNativePlatform = () => {
  if (typeof window === 'undefined') return false;
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  if (typeof window === 'undefined') return 'web';
  return Capacitor.getPlatform();
};

// ==================== HAPTICS ====================

export async function hapticSuccess() {
  if (!isNativePlatform()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch (e) {
    console.debug('Haptics not supported:', e);
  }
}

export async function hapticWarning() {
  if (!isNativePlatform()) return;
  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch (e) {
    console.debug('Haptics not supported:', e);
  }
}

export async function hapticImpact(style: ImpactStyle = ImpactStyle.Light) {
  if (!isNativePlatform()) return;
  try {
    await Haptics.impact({ style });
  } catch (e) {
    console.debug('Haptics not supported:', e);
  }
}

export async function hapticSelection() {
  if (!isNativePlatform()) return;
  try {
    await Haptics.selectionChanged();
  } catch (e) {
    console.debug('Haptics not supported:', e);
  }
}

// ==================== STATUS BAR ====================

export async function initStatusBar() {
  if (!isNativePlatform()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#090D16' });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch (e) {
    console.debug('StatusBar configuration error:', e);
  }
}

// ==================== HARDWARE BACK BUTTON ====================

let backButtonInitialized = false;

export function initBackButton(onExitPrompt?: () => void) {
  if (!isNativePlatform() || backButtonInitialized) return;
  backButtonInitialized = true;

  try {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        if (onExitPrompt) {
          onExitPrompt();
        } else {
          App.exitApp();
        }
      }
    });
  } catch (e) {
    console.debug('App backButton listener error:', e);
  }
}

// ==================== MOBILE AUTH TOKEN BRIDGE ====================

const MOBILE_TOKEN_KEY = 'gym_mobile_bearer_token';

export function getMobileToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(MOBILE_TOKEN_KEY);
}

export function setMobileToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(MOBILE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(MOBILE_TOKEN_KEY);
  }
}

export function getNativeAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (isNativePlatform()) {
    headers['X-Client-Type'] = 'mobile';
  }
  const token = getMobileToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
