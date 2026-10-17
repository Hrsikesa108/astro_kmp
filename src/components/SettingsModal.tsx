import React, { useState } from 'react';
import { NITYA_THEMES } from '../utils/constants.ts';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: string;
  onSelectTheme: (id: string) => void;
  purnimanta: boolean;
  onTogglePurnimanta: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeId,
  onSelectTheme,
  purnimanta,
  onTogglePurnimanta,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  if (!isOpen) return null;

  const currentTheme = NITYA_THEMES.find((t) => t.id === themeId) || NITYA_THEMES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h2
              id="settings-modal-title"
              className="font-display text-2xl font-normal text-[var(--ink)] m-0"
            >
              Settings &amp; Appearance
            </h2>
            <p className="text-xs text-[var(--muted)] m-0">
              Configure Nitya Panchangam color palettes, calendar reckoning, and Android/Web app
              installation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="px-3 h-9 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] flex items-center justify-center text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Nitya Panchangam Theme Switcher */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              Nitya Panchangam Theme
            </span>
            <span className="text-xs font-medium text-[var(--ink)]">
              {currentTheme.name} — <span className="text-[var(--muted)]">{currentTheme.desc}</span>
            </span>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            role="group"
            aria-label="Color theme swatches"
          >
            {NITYA_THEMES.map((t) => {
              const active = t.id === themeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTheme(t.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--bg)] ring-1 ring-[var(--accent)]'
                      : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-[var(--line)] shrink-0 overflow-hidden relative inline-block"
                    style={{
                      background:
                        t.id === 'auto'
                          ? 'linear-gradient(135deg, #F4F5F8 50%, #15141D 50%)'
                          : `linear-gradient(180deg, ${t.c1} 50%, ${t.c2} 50%)`,
                    }}
                  />
                  <span className="text-xs font-medium text-[var(--ink)] truncate">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lunar Month Naming System */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--line)]">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Lunar Month (Māsa) Reckoning
          </span>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--muted)] m-0">
              Amānta months end on Amāvāsyā (South &amp; West India); Pūrṇimānta months end on Pūrṇimā
              (North India).
            </p>
            <div
              className="inline-flex border border-[var(--line)] rounded-md overflow-hidden shrink-0"
              role="group"
              aria-label="Lunar month reckoning"
            >
              <button
                type="button"
                onClick={() => onTogglePurnimanta(false)}
                aria-pressed={!purnimanta}
                className={`px-3 py-1.5 text-xs cursor-pointer ${
                  !purnimanta
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
                    : 'bg-[var(--bg)] text-[var(--muted)]'
                }`}
              >
                Amanta
              </button>
              <button
                type="button"
                onClick={() => onTogglePurnimanta(true)}
                aria-pressed={purnimanta}
                className={`px-3 py-1.5 text-xs cursor-pointer ${
                  purnimanta
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
                    : 'bg-[var(--bg)] text-[var(--muted)]'
                }`}
              >
                Purnimanta
              </button>
            </div>
          </div>
        </div>

        {/* Cross-Platform PWA & Native Android APK Section */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[var(--line)]">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Android App &amp; Native APK Options
          </span>
          {isInstalled ? (
            <p className="text-xs text-[var(--teal)] m-0 font-medium">
              Installed and running in standalone Android/App mode with 100% offline ephemeris
              support.
            </p>
          ) : isInstallable ? (
            <div className="flex items-center justify-between gap-3 bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3">
              <p className="text-xs text-[var(--ink)] m-0">
                <strong>Direct Android Install (WebAPK):</strong> Install directly onto your Android
                home screen for full-screen offline chart generation.
              </p>
              <button
                type="button"
                onClick={install}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-medium cursor-pointer shrink-0"
              >
                Install Android App
              </button>
            </div>
          ) : isIOS ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowIOSInstructions(!showIOSInstructions)}
                className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs font-medium text-[var(--ink)] w-fit cursor-pointer"
              >
                How to Install on iOS Safari
              </button>
              {showIOSInstructions && (
                <p className="text-xs text-[var(--muted)] m-0">
                  1. Tap the <strong>Share</strong> button in Safari&apos;s toolbar. 2. Scroll down
                  and tap <strong>Add to Home Screen</strong>.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3 flex flex-col gap-2 text-xs">
              <div>
                <strong className="text-[var(--ink)]">1. Instant Android WebAPK (No Studio needed):</strong>{' '}
                <span className="text-[var(--muted)]">
                  Open this URL in Chrome on Android and tap <strong>Menu → Add to Home screen / Install app</strong>. Android compiles a standalone offline app icon (<code className="font-mono-num">JyotiṣaPWA</code>).
                </span>
              </div>
              <div className="pt-2 border-t border-dashed border-[var(--line)]">
                <strong className="text-[var(--ink)]">2. Build Native Android <code className="font-mono-num">.apk</code> (Capacitor Configured):</strong>{' '}
                <span className="text-[var(--muted)]">
                  This project includes <code className="font-mono-num">capacitor.config.ts</code> (<code className="font-mono-num">com.jyotisa.katapayadi.ephemeris</code>). Run:
                </span>
                <pre className="mt-1.5 p-2 rounded bg-[var(--surface)] border border-[var(--line)] font-mono-num text-[11px] text-[var(--ink)] overflow-x-auto m-0">
                  npm i @capacitor/android &amp;&amp; npm run build &amp;&amp; npx cap add android &amp;&amp; npx cap open android
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
