import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { PLANET_SHORT, RASHI_META } from '../utils/constants.ts';
import {
  DIGNITY_LABEL,
  type AstrologicalChartSnapshot,
  type DignityKind,
  type PlanetPosition,
  type VargaNumber,
} from '../utils/astrology.ts';
import { type KatapayadiAnalysis } from '../utils/katapayadi.ts';
import { type MoneyYogaRead } from '../utils/moneyYoga.ts';
import { SouthIndianChart, type ChartKarakaMarks } from './SouthIndianChart.tsx';
import { Segmented } from './ui/Segmented.tsx';

interface DashboardViewProps {
  snapshot: AstrologicalChartSnapshot;
  katapayadi: KatapayadiAnalysis;
  moneyRead: MoneyYogaRead;
  purnimanta: boolean;
  onNavigateTab: (tab: 'dashboard' | 'money' | 'katapayadi' | 'panchanga') => void;
}

type HighlightMode = 'both' | 'A' | 'B' | 'off';

const VARGA_ORDER: VargaNumber[] = [1, 9, 10, 60];

function dignityStyle(dig: DignityKind | null): string {
  if (!dig) return 'text-[var(--muted)]';
  if (dig === 'exalted') return 'text-[var(--teal)] font-semibold';
  if (dig === 'debilitated') return 'text-[var(--accent)] font-semibold';
  if (dig === 'own' || dig === 'moolatrikona') return 'text-[var(--gold)] font-medium';
  if (dig === 'enemy') return 'text-[var(--shunya)]';
  return 'text-[var(--ink)]';
}

function signIn(p: PlanetPosition, v: VargaNumber): number {
  return v === 1 ? p.d1Sign : v === 9 ? p.d9Sign : v === 10 ? p.d10Sign : p.d60Sign;
}

function dignityIn(p: PlanetPosition, v: VargaNumber): DignityKind | null {
  return v === 1 ? p.d1Dignity : v === 9 ? p.d9Dignity : v === 10 ? p.d10Dignity : p.d60Dignity;
}

/** Full-tile tap target that phones use instead of the small "→" links. */
const TileLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="md:hidden absolute inset-0 rounded-xl cursor-pointer"
  />
);

export const DashboardView: React.FC<DashboardViewProps> = ({
  snapshot,
  katapayadi,
  moneyRead,
  purnimanta,
  onNavigateTab,
}) => {
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('both');
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  // Phones show one chart at a time; desktop shows all four
  const [mobileVarga, setMobileVarga] = useState<VargaNumber>(1);

  const { panchanga, planets } = snapshot;

  const marks: ChartKarakaMarks | undefined =
    highlightMode === 'off'
      ? undefined
      : {
          karakaA: highlightMode === 'B' ? undefined : moneyRead.sunTrack.karaka,
          karakaB: highlightMode === 'A' ? undefined : moneyRead.nameTrack.karaka,
          refA: highlightMode === 'B' ? undefined : moneyRead.sunTrack.refSign,
          refB: highlightMode === 'A' ? undefined : moneyRead.nameTrack.refSign,
          lordSignA: highlightMode === 'B' ? undefined : moneyRead.sunTrack.lordSign,
          lordSignB: highlightMode === 'A' ? undefined : moneyRead.nameTrack.lordSign,
          houseA: moneyRead.sunTrack.houseTaken,
        };

  const lagnaSign = planets.find((p) => p.name === 'Lagna')?.d1Sign ?? 0;
  const moonSign = panchanga.moonSignIdx;
  const sunSign = panchanga.sunSignIdx;
  const masaName = purnimanta ? panchanga.masa.purnimantaName : panchanga.masa.amantaName;
  const moon = planets.find((p) => p.name === 'Moon');

  const inspectedSignIdx = selectedSign ?? lagnaSign;
  const inspectedRashi = RASHI_META[inspectedSignIdx];

  const karakaA = moneyRead.sunTrack.karaka;
  const karakaB = moneyRead.nameTrack.karaka;

  const charts: { v: VargaNumber; title: string; subtitle: string }[] = [
    { v: 1, title: 'D1 · Rāśi', subtitle: `${snapshot.dateStr} ${snapshot.timeStr}` },
    { v: 9, title: 'D9 · Navāṃśa', subtitle: 'Dharma & Strength' },
    { v: 10, title: 'D10 · Daśāṃśa', subtitle: 'Parāśara Career & Karma' },
    { v: 60, title: 'D60 · Ṣaṣṭyāṃśa', subtitle: 'Root Karmic Varga' },
  ];
  const mobileChartTitle = charts.find((c) => c.v === mobileVarga)?.title;

  const stepVarga = (dir: 1 | -1) => {
    const i = VARGA_ORDER.indexOf(mobileVarga);
    setMobileVarga(VARGA_ORDER[(i + dir + VARGA_ORDER.length) % VARGA_ORDER.length]);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      {/* Top 4-Card Summary Strip: Natal Ascendant/Moon, Nitya Panchanga, Katapayadi Rashi, 4th Lord Money Yoga (2×2 tiles on phones) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3.5">
        {/* Card 1: Lagna & Chandra Rashi */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
              <span className="md:hidden">Lagna · Moon</span>
              <span className="max-md:hidden">Ascendant &amp; Moon Rāśi</span>
            </span>
            <h2 className="font-display text-lg md:text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {RASHI_META[lagnaSign].en}{' '}
              <span className="text-base text-[var(--muted)] max-md:hidden">({RASHI_META[lagnaSign].sanskrit})</span>
            </h2>
          </div>
          <div className="md:hidden text-[11px] leading-snug text-[var(--muted)] flex flex-col">
            <span>
              Moon <strong className="text-[var(--ink)]">{RASHI_META[moonSign].en}</strong>, {moon?.nakshatraName} P
              {moon?.pada}
            </span>
            <span>
              Sun <strong className="text-[var(--ink)]">{RASHI_META[sunSign].en}</strong>
            </span>
          </div>
          <div className="max-md:hidden text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Chandra Rāśi: <strong className="text-[var(--ink)]">{RASHI_META[moonSign].en}</strong> ·{' '}
              {moon?.nakshatraName} P
              {moon?.pada}
            </span>
            <span>
              Sūrya Rāśi: <strong className="text-[var(--ink)]">{RASHI_META[sunSign].en}</strong> · Ayanāṃśa{' '}
              {snapshot.ayanamsa.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Card 2: Nitya Panchanga */}
        <div className="relative bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                <span className="md:hidden">Pañcāṅgam</span>
                <span className="max-md:hidden">Nitya Pañcāṅgam</span>
              </span>
              <ChevronRight className="md:hidden size-4 text-[var(--accent)]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => onNavigateTab('panchanga')}
                className="max-md:hidden text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Full Timings →
              </button>
            </div>
            <h2 className="font-display text-lg md:text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {panchanga.tithiAtBirth.name}
            </h2>
          </div>
          <div className="md:hidden text-[11px] leading-snug text-[var(--muted)] flex flex-col">
            <span>
              {panchanga.vara.en} · Yoga {panchanga.yogaSpans[0]?.name}
            </span>
            <span>{masaName}</span>
          </div>
          <div className="max-md:hidden text-xs text-[var(--muted)] flex flex-col gap-0.5">
            <span>
              {masaName} · {panchanga.vara.sanskrit} ({panchanga.vara.en})
            </span>
            <span className="font-mono-num">
              Yoga: {panchanga.yogaSpans[0]?.name} · Karana: {panchanga.karanaSpans[0]?.name}
            </span>
          </div>
          <TileLink label="Open Pañcāṅga timings" onClick={() => onNavigateTab('panchanga')} />
        </div>

        {/* Card 3: Katapayadi Name Rashi */}
        <div className="relative bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                <span className="md:hidden">Name Sign</span>
                <span className="max-md:hidden">Kaṭapayādi Name Sign</span>
              </span>
              <ChevronRight className="md:hidden size-4 text-[var(--accent)]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => onNavigateTab('katapayadi')}
                className="max-md:hidden text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Syllable Audit →
              </button>
            </div>
            <h2 className="font-display text-lg md:text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {katapayadi.rashi.en}{' '}
              <span className="text-base text-[var(--muted)] max-md:hidden">({katapayadi.rashi.deva})</span>
            </h2>
          </div>
          <div className="md:hidden text-[11px] leading-snug text-[var(--muted)] flex flex-col">
            <span>
              Number <strong className="font-mono-num text-[var(--accent)]">{katapayadi.numberString || '0'}</strong>
            </span>
            <span>
              Track B lord <strong className="text-[var(--teal)]">{karakaB}</strong>
            </span>
          </div>
          <div className="max-md:hidden text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Vāmato Gati Number:{' '}
              <strong className="text-[var(--accent)]">{katapayadi.numberString || '0'}</strong>
            </span>
            <span>
              Sign Lord: <strong className="text-[var(--ink)]">{katapayadi.rashi.lord}</strong> · Track B 4th
              Lord: <strong className="text-[var(--teal)]">{karakaB}</strong>
            </span>
          </div>
          <TileLink label="Open Kaṭapayādi syllable audit" onClick={() => onNavigateTab('katapayadi')} />
        </div>

        {/* Card 4: 4th Lord Money Yoga */}
        <div className="relative bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                <span className="md:hidden">Money Yoga</span>
                <span className="max-md:hidden">4th Lord Money Yoga</span>
              </span>
              <ChevronRight className="md:hidden size-4 text-[var(--accent)]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => onNavigateTab('money')}
                className="max-md:hidden text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Wealth Cycles →
              </button>
            </div>
            <div className="flex max-md:flex-wrap items-baseline gap-x-2 mt-0.5">
              <h2 className="font-display text-lg md:text-2xl font-normal text-[var(--ink)] m-0">
                {moneyRead.band.label}
              </h2>
              <span className="font-mono-num text-xs md:text-sm font-semibold text-[var(--accent)]">
                ({moneyRead.combinedScore > 0 ? '+' : ''}
                {moneyRead.combinedScore.toFixed(2)})
              </span>
            </div>
          </div>
          <div className="md:hidden text-[11px] leading-snug text-[var(--muted)] flex flex-col">
            <span>
              A <strong className="text-[var(--accent)]">{karakaA}</strong> {moneyRead.sunTrack.score > 0 ? '+' : ''}
              {moneyRead.sunTrack.score.toFixed(1)}
            </span>
            <span>
              B <strong className="text-[var(--teal)]">{karakaB}</strong> {moneyRead.nameTrack.score > 0 ? '+' : ''}
              {moneyRead.nameTrack.score.toFixed(1)}
            </span>
          </div>
          <div className="max-md:hidden text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Track A ({moneyRead.sunTrack.houseTaken}th from Sun):{' '}
              <strong className="text-[var(--accent)]">{karakaA}</strong> (
              {moneyRead.sunTrack.score > 0 ? '+' : ''}
              {moneyRead.sunTrack.score.toFixed(1)})
            </span>
            <span>
              Track B (4th from Name):{' '}
              <strong className="text-[var(--teal)]">{karakaB}</strong> (
              {moneyRead.nameTrack.score > 0 ? '+' : ''}
              {moneyRead.nameTrack.score.toFixed(1)})
            </span>
          </div>
          <TileLink label="Open 4th Lord wealth cycles" onClick={() => onNavigateTab('money')} />
        </div>
      </div>

      {/* Automated Divisional Charts Section: D1, D9, D10, D60 */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div>
            <h2 className="m-title font-display text-xl md:text-2xl font-normal text-[var(--ink)] m-0">
              <span className="md:hidden">Divisional Charts</span>
              <span className="max-md:hidden">Automated Divisional Charts (D1 · D9 · D10 · D60)</span>
            </h2>
            <p className="max-md:hidden text-xs text-[var(--muted)] m-0 mt-0.5">
              South Indian fixed-sign layout (Meena top-left, clockwise). Click any sign cell to inspect its
              occupants across all four vargas.
            </p>
          </div>

          <div className="flex max-md:w-full max-md:flex-col max-md:items-stretch items-center gap-2">
            <span className="text-xs text-[var(--muted)]">4th Lord Karaka Highlight:</span>
            <Segmented
              ariaLabel="Karaka highlight mode"
              value={highlightMode}
              onChange={setHighlightMode}
              className="grid grid-cols-4 md:inline-flex"
              buttonClassName="px-2.5 py-1 text-xs shrink-0 max-md:min-h-10 max-md:px-1"
              options={[
                {
                  id: 'both',
                  label: (
                    <>
                      <span className="md:hidden">A + B</span>
                      <span className="max-md:hidden">Track A + B</span>
                    </>
                  ),
                },
                {
                  id: 'A',
                  label: (
                    <>
                      <span className="md:hidden">A · {PLANET_SHORT[karakaA]}</span>
                      <span className="max-md:hidden">Track A ({karakaA})</span>
                    </>
                  ),
                },
                {
                  id: 'B',
                  label: (
                    <>
                      <span className="md:hidden">B · {PLANET_SHORT[karakaB]}</span>
                      <span className="max-md:hidden">Track B ({karakaB})</span>
                    </>
                  ),
                },
                { id: 'off', label: 'Off' },
              ]}
            />
          </div>
        </div>

        {/* Phone chart picker: dropdown scales to more vargas, arrows step through them in one tap */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepVarga(-1)}
            aria-label="Previous chart"
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] cursor-pointer"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="relative min-w-0 flex-1">
            <select
              aria-label="Divisional chart"
              value={mobileVarga}
              onChange={(e) => setMobileVarga(Number(e.target.value) as VargaNumber)}
              className="w-full h-11 appearance-none rounded-lg border border-[var(--accent)] bg-[var(--bg)] pl-3 pr-9 font-display text-base text-[var(--ink)] cursor-pointer"
            >
              {charts.map((c) => (
                <option key={c.v} value={c.v}>
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--accent)]"
              aria-hidden="true"
            />
          </div>
          <button
            type="button"
            onClick={() => stepVarga(1)}
            aria-label="Next chart"
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] cursor-pointer"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* 4-Chart Responsive Grid (only the picked chart on phones) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {charts.map((c) => (
            <SouthIndianChart
              key={c.v}
              varga={c.v}
              title={c.title}
              subtitle={c.subtitle}
              planets={planets}
              marks={marks}
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
              className={c.v === mobileVarga ? '' : 'max-md:hidden'}
            />
          ))}
        </div>

        {/* Legend & Inspected Sign Bar */}
        <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--gold-bg)] border border-[var(--gold)] inline-block" />
              Lagna Sign
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--accent)] inline-block" />
              Track A Karaka: <strong className="text-[var(--ink)]">{karakaA}</strong>{' '}
              <span className="max-md:hidden">({moneyRead.sunTrack.houseTaken}th from Sun)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--teal)] inline-block" />
              Track B Karaka: <strong className="text-[var(--ink)]">{karakaB}</strong>{' '}
              <span className="max-md:hidden">(4th from Name Sign)</span>
            </span>
          </div>

          <div className="font-mono-num text-[var(--ink)]">
            <span className="md:hidden block font-sans text-[var(--muted)] mb-0.5">Tap a sign to inspect it.</span>
            Inspected Sign: <strong>{inspectedRashi.en}</strong> ({inspectedRashi.sanskrit}, Lord:{' '}
            {inspectedRashi.lord}) ·{' '}
            {VARGA_ORDER.map((v) => {
              const occ = planets.filter((p) => signIn(p, v) === inspectedSignIdx).map((p) => p.short);
              return `D${v}: ${occ.length ? occ.join(',') : '—'}`;
            }).join(' | ')}
          </div>
        </div>
      </section>

      {/* Complete Planetary Positions & Multi-Varga Dignity Table */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-title font-display text-xl md:text-2xl font-normal text-[var(--ink)] m-0">
            <span className="md:hidden">Planetary Positions</span>
            <span className="max-md:hidden">Sidereal Planetary Positions &amp; Varga Dignities</span>
          </h2>
          <span className="font-mono-num text-xs text-[var(--muted)]">
            Lahiri Chitrapaksha Ayanāṃśa: {snapshot.ayanamsa.toFixed(4)}° · Arudha Lagna (AL):{' '}
            {RASHI_META[panchanga.arudhas.alSign].en} · A5: {RASHI_META[panchanga.arudhas.a5Sign].en}
          </span>
        </div>

        {/* Phones: one varga at a time (follows the chart picker) instead of a 7-column table */}
        <div className="md:hidden">
          <p className="m-0 mb-1 text-xs text-[var(--muted)]">
            Showing <strong className="text-[var(--ink)]">{mobileChartTitle}</strong> — switch with the chart picker
            above.
          </p>
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2 pr-2 font-medium">Graha</th>
                <th className="py-2 px-2 font-medium">D{mobileVarga} Sign</th>
                <th className="py-2 pl-2 font-medium">Nakshatra</th>
              </tr>
            </thead>
            <tbody>
              {planets.map((p) => {
                const dig = dignityIn(p, mobileVarga);
                const showRetro = p.retro && !['Rahu', 'Ketu', 'Lagna'].includes(p.name);
                return (
                  <tr key={p.name} className="border-b border-[var(--line)] align-top">
                    <td className="py-2 pr-2 whitespace-nowrap font-medium text-[var(--ink)]">
                      {p.name}
                      {showRetro && <span className="ml-0.5 text-[11px] text-[var(--accent)]">R</span>}
                      {p.name === karakaA && (
                        <span className="ml-1 rounded px-1 text-[10px] font-semibold bg-[var(--accent)] text-[var(--accent-ink)]">
                          A
                        </span>
                      )}
                      {p.name === karakaB && (
                        <span className="ml-1 rounded px-1 text-[10px] font-semibold bg-[var(--teal)] text-white">
                          B
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-[var(--ink)]">{RASHI_META[signIn(p, mobileVarga)].en}</div>
                      <div className="text-[11px] leading-snug">
                        {mobileVarga === 1 && (
                          <span className="font-mono-num text-[var(--muted)]">{p.degFormatted}</span>
                        )}
                        {mobileVarga === 1 && dig && <span className="text-[var(--muted)]"> · </span>}
                        {dig && <span className={dignityStyle(dig)}>{DIGNITY_LABEL[dig]}</span>}
                      </div>
                    </td>
                    <td className="py-2 pl-2">
                      <div className="text-[var(--ink)]">
                        {p.nakshatraName} <span className="font-mono-num text-[var(--muted)]">P{p.pada}</span>
                      </div>
                      <div className="text-[11px] text-[var(--muted)]">{p.nakshatraLord}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto max-md:hidden">
          <table className="w-full border-collapse text-left text-xs sm:text-sm font-mono-num">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2.5 px-3">Graha</th>
                <th className="py-2.5 px-3">Longitude</th>
                <th className="py-2.5 px-3">Nakshatra · Pada</th>
                <th className="py-2.5 px-3">D1 (Rāśi)</th>
                <th className="py-2.5 px-3">D9 (Navāṃśa)</th>
                <th className="py-2.5 px-3">D10 (Daśāṃśa)</th>
                <th className="py-2.5 px-3">D60 (Ṣaṣṭyāṃśa)</th>
              </tr>
            </thead>
            <tbody>
              {planets.map((p) => {
                const isKA = p.name === karakaA;
                const isKB = p.name === karakaB;
                return (
                  <tr
                    key={p.name}
                    className="border-b border-[var(--line)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-[var(--ink)] whitespace-nowrap">
                      <span>{p.name}</span>
                      {p.retro && !['Rahu', 'Ketu', 'Lagna'].includes(p.name) && (
                        <span className="text-[11px] text-[var(--accent)] ml-1">(R)</span>
                      )}
                      {isKA && (
                        <span className="ml-1.5 text-[10px] font-mono-num uppercase text-[var(--accent)]">
                          · Karaka A
                        </span>
                      )}
                      {isKB && (
                        <span className="ml-1.5 text-[10px] font-mono-num uppercase text-[var(--teal)]">
                          · Karaka B
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {RASHI_META[p.d1Sign].en} {p.degFormatted}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                      {p.nakshatraName} <span className="font-mono-num text-[var(--muted)]">P{p.pada}</span>{' '}
                      <span className="text-[11px] text-[var(--muted)]">({p.nakshatraLord})</span>
                    </td>
                    {VARGA_ORDER.map((v) => {
                      const dig = dignityIn(p, v);
                      return (
                        <td key={v} className="py-2.5 px-3 whitespace-nowrap">
                          <span>{RASHI_META[signIn(p, v)].en}</span>
                          {dig && (
                            <span className={`ml-1.5 text-xs ${dignityStyle(dig)}`}>
                              · {DIGNITY_LABEL[dig]}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
