import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jyotisa.katapayadi.ephemeris',
  appName: 'Jyotiṣa & Kaṭapayādi Ephemeris',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#F4F5F8',
  },
  plugins: {
    SystemBars: {
      // The app draws edge-to-edge and pads its header/tab bar with the injected
      // --safe-area-inset-* variables (see --safe-top / --safe-bottom in src/index.css).
      insetsHandling: 'css',
      // index.html declares viewport-fit=cover; hinting it avoids a layout jump on launch.
      initialViewportFitValueHint: 'cover',
    },
  },
};

export default config;
