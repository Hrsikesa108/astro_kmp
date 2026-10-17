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
};

export default config;
