import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.odinbi.fit',
  appName: 'Gym Tracker',
  webDir: 'out',
  server: {
    // Point to deployed URL — full SSR + API support
    url: 'https://fit.odinbi.app',
    cleartext: false,
    allowNavigation: ['fit.odinbi.app'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0f',
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      releaseType: 'APK',
    },
  },
};

export default config;
