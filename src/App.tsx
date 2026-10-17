/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  Coins,
  Download,
  Languages,
  LayoutGrid,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
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
import { isNative, syncSystemBars } from './utils/native.ts';
import { BirthAndNameBar } from './components/BirthAndNameBar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { MoneyYogaView } from './components/MoneyYogaView.tsx';
import { KatapayadiView } from './components/KatapayadiView.tsx';
import { PanchangaView } from './components/PanchangaView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

type ActiveTab = 'dashboard' | 'money' | 'katapayadi' | 'panchanga';

const MOBILE_TABS = [
  { id: 'dashboard', short: 'Charts', Icon: LayoutGrid },
  { id: 'money', short: '4th Lord', Icon: Coins },
  { id: 'katapayadi', short: 'Kaṭapayādi', Icon: Languages },
  { id: 'panchanga', short: 'Pañcāṅga', Icon: CalendarDays },
] as const;

const NON_TYPING_INPUTS = new Set(['button', 'checkbox', 'radio', 'range', 'date', 'time', 'submit']);

function isTextEntry(el: Element | null): boolean {
  if (el instanceof HTMLTextAreaElement) return true;
  return el instanceof HTMLInputElement && !NON_TYPING_INPUTS.has(el.type);
}

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
  // While a text field has focus the soft keyboard is up; the tab bar would only eat space.
  const [typing, setTyping] = useState(false);

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const showInstall = !isNative && !isInstalled && isInstallable;

  const selectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

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

  // Android status/navigation bar icons follow the palette (and the system setting on Auto)
  useEffect(() => {
    syncSystemBars(themeId);
    if (themeId !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => syncSystemBars('auto');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [themeId]);

  useEffect(() => {
    // focusout fires before the next focusin, so read activeElement once focus has settled
    const onFocusChange = () => setTimeout(() => setTyping(isTextEntry(document.activeElement)), 0);
    document.addEventListener('focusin', onFocusChange);
    document.addEventListener('focusout', onFocusChange);
    return () => {
      document.removeEventListener('focusin', onFocusChange);
      document.removeEventListener('focusout', onFocusChange);
    };
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] overflow-x-clip pl-[var(--safe-left)] pr-[var(--safe-right)] pb-[calc(var(--tabbar-h)+var(--safe-bottom)+1rem)] md:pb-12">
      {/* Strict 3-Zone Top Bar (extends under the Android status bar) */}
      <header className="sticky top-0 z-30 bg-[var(--surface)] pt-[var(--safe-top)]">
        <div className="px-3 sm:px-6 h-14 border-b border-[var(--line)] flex items-center justify-between gap-3 sm:gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              selectTab('dashboard');
            }}
            className="font-display text-lg sm:text-xl text-[var(--ink)] no-underline whitespace-nowrap min-w-0 truncate md:shrink-0 max-md:py-2"
          >
            Jyotiṣa &amp; Kaṭapayādi<span className="max-sm:hidden"> Ephemeris</span>
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
                onClick={() => selectTab(item.id)}
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

          {/* Zone 3: Primary Action (Settings / Install) — icon buttons on phones */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {showInstall && (
              <button
                type="button"
                onClick={install}
                aria-label="Install App"
                className="inline-flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="size-5 md:hidden" aria-hidden="true" />
                <span className="max-md:hidden">Install App</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open Settings and Theme Switcher"
              className="inline-flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:px-3.5 md:py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              <SettingsIcon className="size-5 md:hidden" aria-hidden="true" />
              <span className="max-md:hidden">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 md:pt-5 flex flex-col gap-3 md:gap-5 flex-1">
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
            onNavigateTab={selectTab}
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
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8 pb-4 text-xs text-[var(--muted)] hidden md:flex flex-wrap items-center justify-between gap-2">
        <span>
          Sidereal positions computed with true Lahiri (Chitrapaksha) ayanāṃśa via Astronomy Engine ·
          Parāśara D1, D9, D10 &amp; D60 vargas · Kaṭapayādi Saṅkhyā (Sadratnamālā)
        </span>
        <span>
          Active City: {place.name} ({place.zone})
        </span>
      </footer>

      {/* Mobile Bottom Navigation Bar (Android / Touch Ergonomics), padded above the system nav bar */}
      <nav
        aria-label="Mobile navigation"
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--surface)] border-t border-[var(--line)] shadow-[0_-4px_16px_rgb(0_0_0/0.08)] pb-[var(--safe-bottom)] pl-[var(--safe-left)] pr-[var(--safe-right)] ${
          typing ? 'hidden' : ''
        }`}
      >
        <div className="grid grid-cols-4 h-[var(--tabbar-h)]">
          {MOBILE_TABS.map(({ id, short, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center gap-1 min-w-0 cursor-pointer"
              >
                <span
                  className={`flex items-center justify-center h-8 w-14 rounded-full transition-colors ${
                    active
                      ? 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                </span>
                <span
                  className={`max-w-full truncate px-1 text-[11px] leading-none ${
                    active ? 'text-[var(--ink)] font-semibold' : 'text-[var(--muted)]'
                  }`}
                >
                  {short}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+0.5rem)] md:bottom-4 left-4 z-50 rounded-lg bg-[var(--gold-bg)] text-[var(--gold)] border border-[var(--gold)] px-3 py-1.5 text-xs font-medium shadow-md"
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
