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

        {/* Cross-Platform PWA Install Section */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--line)]">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Android &amp; Desktop App Installation (PWA)
          </span>
          {isInstalled ? (
            <p className="text-xs text-[var(--teal)] m-0 font-medium">
              ✓ Installed and running in standalone mode with full offline ephemeris support.
            </p>
          ) : isInstallable ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--muted)] m-0">
                Install this application on your Android home screen or desktop for offline chart
                generation.
              </p>
              <button
                type="button"
                onClick={install}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-medium cursor-pointer shrink-0"
              >
                Install App
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
            <p className="text-xs text-[var(--muted)] m-0">
              Offline Service Worker is active. In Chrome on Android or Desktop, use the browser
              menu&apos;s <strong>Add to Home screen / Install app</strong> option to install.
            </p>
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
