/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  CITIES,
  SAMPLE_PROFILES,
  type CityLocation,
  type SampleProfile,
} from './utils/constants.ts';
import {
  computeKatapayadi,
  type InputMode,
  type ScriptTarget,
} from './utils/katapayadi.ts';
import { computeChartSnapshot } from './utils/astrology.ts';
import { computeMoneyYogaRead } from './utils/moneyYoga.ts';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall.ts';
import { BirthAndNameBar } from './components/BirthAndNameBar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { MoneyYogaView } from './components/MoneyYogaView.tsx';
import { KatapayadiView } from './components/KatapayadiView.tsx';
import { PanchangaView } from './components/PanchangaView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

type ActiveTab = 'dashboard' | 'money' | 'katapayadi' | 'panchanga';

export default function App() {
  const [name, setName] = useState<string>(() => {
    try {
      return localStorage.getItem('jyotisa.name') || SAMPLE_PROFILES[0].name;
    } catch {
      return SAMPLE_PROFILES[0].name;
    }
  });
  const [scriptMode, setScriptMode] = useState<InputMode>('roman');
  const [romanTarget, setRomanTarget] = useState<ScriptTarget>('deva');
  const [dateStr, setDateStr] = useState<string>(() => {
    try {
      return localStorage.getItem('jyotisa.date') || SAMPLE_PROFILES[0].date;
    } catch {
      return SAMPLE_PROFILES[0].date;
    }
  });
  const [timeStr, setTimeStr] = useState<string>(() => {
    try {
      return localStorage.getItem('jyotisa.time') || SAMPLE_PROFILES[0].time;
    } catch {
      return SAMPLE_PROFILES[0].time;
    }
  });
  const [place, setPlace] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem('jyotisa.place');
      return saved ? JSON.parse(saved) : SAMPLE_PROFILES[0].place;
    } catch {
      return SAMPLE_PROFILES[0].place;
    }
  });

  const [themeId, setThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('jyotisa.theme') || 'auto';
    } catch {
      return 'auto';
    }
  });
  const [purnimanta, setPurnimanta] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jyotisa.purnimanta') === '1';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Sync theme to document root
  useEffect(() => {
    if (themeId === 'auto') {
      document.documentElement.removeAttribute('data-palette');
    } else {
      document.documentElement.setAttribute('data-palette', themeId);
    }
    try {
      localStorage.setItem('jyotisa.theme', themeId);
    } catch {}
  }, [themeId]);

  useEffect(() => {
    try {
      localStorage.setItem('jyotisa.name', name);
      localStorage.setItem('jyotisa.date', dateStr);
      localStorage.setItem('jyotisa.time', timeStr);
      localStorage.setItem('jyotisa.place', JSON.stringify(place));
      localStorage.setItem('jyotisa.purnimanta', purnimanta ? '1' : '0');
    } catch {}
  }, [name, dateStr, timeStr, place, purnimanta]);

  const katapayadi = useMemo(
    () => computeKatapayadi(name, scriptMode, romanTarget),
    [name, scriptMode, romanTarget]
  );

  const snapshot = useMemo(
    () => computeChartSnapshot(dateStr, timeStr, place),
    [dateStr, timeStr, place]
  );

  const moneyRead = useMemo(
    () =>
      computeMoneyYogaRead(
        dateStr,
        place,
        snapshot.utcDate,
        snapshot.rawLongitudes,
        katapayadi
      ),
    [dateStr, place, snapshot, katapayadi]
  );

  const handleLoadSample = (sample: SampleProfile) => {
    setName(sample.name);
    setScriptMode('roman');
    setDateStr(sample.date);
    setTimeStr(sample.time);
    setPlace(sample.place);
  };

  const handleSetNow = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    setDateStr(`${yyyy}-${mm}-${dd}`);
    setTimeStr(`${hh}:${min}`);
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard & Vargas' },
    { id: 'money', label: '4th Lord & Wealth Cycles' },
    { id: 'katapayadi', label: 'Kaṭapayādi Studio' },
    { id: 'panchanga', label: 'Nitya Pañcāṅgam' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] pb-20 md:pb-12">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[var(--surface)] border-b border-[var(--line)] px-4 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="font-display text-base sm:text-xl text-[var(--ink)] no-underline whitespace-nowrap shrink-0 truncate max-w-[65vw] sm:max-w-none"
        >
          Jyotiṣa &amp; Kaṭapayādi Ephemeris
        </a>

        {/* Zone 2: 4 Single-line Navigation Links (Desktop) */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`py-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === item.id
                  ? 'border-[var(--accent)] text-[var(--ink)] font-semibold'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action (Settings / Install) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!isInstalled && isInstallable && (
            <button
              type="button"
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              Install App
            </button>
          )}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open Settings and Theme Switcher"
            className="px-3.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
          >
            Settings
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex flex-col gap-5 flex-1">
        {/* Always-Accessible Birth & Name Input Bar */}
        <BirthAndNameBar
          name={name}
          onNameChange={setName}
          scriptMode={scriptMode}
          onScriptModeChange={setScriptMode}
          romanTarget={romanTarget}
          onRomanTargetChange={setRomanTarget}
          dateStr={dateStr}
          onDateChange={setDateStr}
          timeStr={timeStr}
          onTimeChange={setTimeStr}
          place={place}
          onPlaceChange={setPlace}
          katapayadi={katapayadi}
          onLoadSample={handleLoadSample}
          onSetNow={handleSetNow}
        />

        {/* Active Workspace View */}
        {activeTab === 'dashboard' && (
          <DashboardView
            snapshot={snapshot}
            katapayadi={katapayadi}
            moneyRead={moneyRead}
            purnimanta={purnimanta}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'money' && (
          <MoneyYogaView
            snapshot={snapshot}
            katapayadi={katapayadi}
            moneyRead={moneyRead}
          />
        )}

        {activeTab === 'katapayadi' && (
          <KatapayadiView
            name={name}
            onNameChange={setName}
            scriptMode={scriptMode}
            onScriptModeChange={setScriptMode}
            romanTarget={romanTarget}
            onRomanTargetChange={setRomanTarget}
            katapayadi={katapayadi}
          />
        )}

        {activeTab === 'panchanga' && (
          <PanchangaView snapshot={snapshot} purnimanta={purnimanta} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8 pb-4 text-xs text-[var(--muted)] flex flex-wrap items-center justify-between gap-2">
        <span>
          Sidereal positions computed with true Lahiri (Chitrapaksha) ayanāṃśa via Astronomy Engine ·
          Parāśara D1, D9, D10 &amp; D60 vargas · Kaṭapayādi Saṅkhyā (Sadratnamālā)
        </span>
        <span>
          Active City: {place.name} ({place.zone})
        </span>
      </footer>

      {/* Mobile Bottom Navigation Bar (Android / Touch Ergonomics, <= 15% viewport height) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--line)] grid grid-cols-4 h-14"
      >
        {(
          [
            { id: 'dashboard', short: 'Charts' },
            { id: 'money', short: '4th Lord' },
            { id: 'katapayadi', short: 'Kaṭapayādi' },
            { id: 'panchanga', short: 'Pañcāṅga' },
          ] as const
        ).map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center text-xs cursor-pointer transition-colors ${
                active
                  ? 'text-[var(--accent)] font-semibold bg-[var(--bg)]'
                  : 'text-[var(--muted)]'
              }`}
            >
              <span className="truncate">{item.short}</span>
            </button>
          );
        })}
      </nav>

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-16 md:bottom-4 left-4 z-50 rounded-lg bg-[var(--gold-bg)] text-[var(--gold)] border border-[var(--gold)] px-3 py-1.5 text-xs font-medium shadow-md"
        >
          Offline Mode — Ephemeris &amp; Kaṭapayādi engines running locally.
        </div>
      )}

      {/* Settings & Nitya Panchangam Theme Switcher Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeId={themeId}
        onSelectTheme={setThemeId}
        purnimanta={purnimanta}
        onTogglePurnimanta={setPurnimanta}
      />
    </div>
  );
}
