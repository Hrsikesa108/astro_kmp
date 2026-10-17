import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';

/** True inside the Capacitor Android app, false in a browser or installed PWA. */
export const isNative = Capacitor.isNativePlatform();

const DARK_PALETTES = new Set(['gopuram', 'amavasya']);

function isDarkTheme(themeId: string): boolean {
  if (themeId === 'auto') return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return DARK_PALETTES.has(themeId);
}

/**
 * Keeps the Android status/navigation bar icons readable against the active palette
 * (light icons on dark palettes, dark icons on light ones). No-op on the web.
 */
export function syncSystemBars(themeId: string): void {
  if (!isNative) return;
  SystemBars.setStyle({
    style: isDarkTheme(themeId) ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
  }).catch(() => {});
}
