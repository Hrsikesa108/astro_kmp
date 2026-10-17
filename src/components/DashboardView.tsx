import React, { useState } from 'react';
import { RASHI_META } from '../utils/constants.ts';
import {
  DIGNITY_LABEL,
  type AstrologicalChartSnapshot,
  type DignityKind,
  type VargaNumber,
} from '../utils/astrology.ts';
import { type KatapayadiAnalysis } from '../utils/katapayadi.ts';
import { type MoneyYogaRead } from '../utils/moneyYoga.ts';
import { SouthIndianChart, type ChartKarakaMarks } from './SouthIndianChart.tsx';

interface DashboardViewProps {
  snapshot: AstrologicalChartSnapshot;
  katapayadi: KatapayadiAnalysis;
  moneyRead: MoneyYogaRead;
  purnimanta: boolean;
  onNavigateTab: (tab: 'dashboard' | 'money' | 'katapayadi' | 'panchanga') => void;
}

function dignityStyle(dig: DignityKind | null): string {
  if (!dig) return 'text-[var(--muted)]';
  if (dig === 'exalted') return 'text-[var(--teal)] font-semibold';
  if (dig === 'debilitated') return 'text-[var(--accent)] font-semibold';
  if (dig === 'own' || dig === 'moolatrikona') return 'text-[var(--gold)] font-medium';
  if (dig === 'enemy') return 'text-[var(--shunya)]';
  return 'text-[var(--ink)]';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  snapshot,
  katapayadi,
  moneyRead,
  purnimanta,
  onNavigateTab,
}) => {
  const [highlightMode, setHighlightMode] = useState<'both' | 'A' | 'B' | 'off'>('both');
  const [selectedSign, setSelectedSign] = useState<number | null>(null);

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

  const inspectedSignIdx = selectedSign ?? lagnaSign;
  const inspectedRashi = RASHI_META[inspectedSignIdx];

  return (
    <div className="flex flex-col gap-5">
      {/* Top 4-Card Summary Strip: Natal Ascendant/Moon, Nitya Panchanga, Katapayadi Rashi, 4th Lord Money Yoga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Lagna & Chandra Rashi */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 flex flex-col justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
              Ascendant &amp; Moon Rāśi
            </span>
            <h2 className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {RASHI_META[lagnaSign].en}{' '}
              <span className="text-base text-[var(--muted)]">({RASHI_META[lagnaSign].sanskrit})</span>
            </h2>
          </div>
          <div className="text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Chandra Rāśi: <strong className="text-[var(--ink)]">{RASHI_META[moonSign].en}</strong> ·{' '}
              {planets.find((p) => p.name === 'Moon')?.nakshatraName} P
              {planets.find((p) => p.name === 'Moon')?.pada}
            </span>
            <span>
              Sūrya Rāśi: <strong className="text-[var(--ink)]">{RASHI_META[sunSign].en}</strong> · Ayanāṃśa{' '}
              {snapshot.ayanamsa.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Card 2: Nitya Panchanga */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                Nitya Pañcāṅgam
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('panchanga')}
                className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Full Timings →
              </button>
            </div>
            <h2 className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {panchanga.tithiAtBirth.name}
            </h2>
          </div>
          <div className="text-xs text-[var(--muted)] flex flex-col gap-0.5">
            <span>
              {masaName} · {panchanga.vara.sanskrit} ({panchanga.vara.en})
            </span>
            <span className="font-mono-num">
              Yoga: {panchanga.yogaSpans[0]?.name} · Karana: {panchanga.karanaSpans[0]?.name}
            </span>
          </div>
        </div>

        {/* Card 3: Katapayadi Name Rashi */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                Kaṭapayādi Name Sign
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('katapayadi')}
                className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Syllable Audit →
              </button>
            </div>
            <h2 className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 m-0">
              {katapayadi.rashi.en}{' '}
              <span className="text-base text-[var(--muted)]">({katapayadi.rashi.deva})</span>
            </h2>
          </div>
          <div className="text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Vāmato Gati Number:{' '}
              <strong className="text-[var(--accent)]">{katapayadi.numberString || '0'}</strong>
            </span>
            <span>
              Sign Lord: <strong className="text-[var(--ink)]">{katapayadi.rashi.lord}</strong> · Track B 4th
              Lord: <strong className="text-[var(--teal)]">{moneyRead.nameTrack.karaka}</strong>
            </span>
          </div>
        </div>

        {/* Card 4: 4th Lord Money Yoga */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
                4th Lord Money Yoga
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('money')}
                className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                Wealth Cycles →
              </button>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="font-display text-2xl font-normal text-[var(--ink)] m-0">
                {moneyRead.band.label}
              </h2>
              <span className="font-mono-num text-sm font-semibold text-[var(--accent)]">
                ({moneyRead.combinedScore > 0 ? '+' : ''}
                {moneyRead.combinedScore.toFixed(2)})
              </span>
            </div>
          </div>
          <div className="text-xs text-[var(--muted)] flex flex-col gap-0.5 font-mono-num">
            <span>
              Track A ({moneyRead.sunTrack.houseTaken}th from Sun):{' '}
              <strong className="text-[var(--accent)]">{moneyRead.sunTrack.karaka}</strong> (
              {moneyRead.sunTrack.score > 0 ? '+' : ''}
              {moneyRead.sunTrack.score.toFixed(1)})
            </span>
            <span>
              Track B (4th from Name):{' '}
              <strong className="text-[var(--teal)]">{moneyRead.nameTrack.karaka}</strong> (
              {moneyRead.nameTrack.score > 0 ? '+' : ''}
              {moneyRead.nameTrack.score.toFixed(1)})
            </span>
          </div>
        </div>
      </div>

      {/* Automated Divisional Charts Section: D1, D9, D10, D60 */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div>
            <h2 className="font-display text-2xl font-normal text-[var(--ink)] m-0">
              Automated Divisional Charts (D1 · D9 · D10 · D60)
            </h2>
            <p className="text-xs text-[var(--muted)] m-0 mt-0.5">
              South Indian fixed-sign layout (Meena top-left, clockwise). Click any sign cell to inspect its
              occupants across all four vargas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)]">4th Lord Karaka Highlight:</span>
            <div
              className="inline-flex border border-[var(--line)] rounded-md overflow-hidden"
              role="group"
              aria-label="Karaka highlight mode"
            >
              {(
                [
                  { id: 'both', label: 'Track A + B' },
                  { id: 'A', label: `Track A (${moneyRead.sunTrack.karaka})` },
                  { id: 'B', label: `Track B (${moneyRead.nameTrack.karaka})` },
                  { id: 'off', label: 'Off' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHighlightMode(opt.id)}
                  className={`px-2.5 py-1 text-xs cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    highlightMode === opt.id
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
                      : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Chart Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <SouthIndianChart
            varga={1}
            title="D1 · Rāśi"
            subtitle={`${snapshot.dateStr} ${snapshot.timeStr}`}
            planets={planets}
            marks={marks}
            selectedSign={selectedSign}
            onSelectSign={setSelectedSign}
          />
          <SouthIndianChart
            varga={9}
            title="D9 · Navāṃśa"
            subtitle="Dharma & Strength"
            planets={planets}
            marks={marks}
            selectedSign={selectedSign}
            onSelectSign={setSelectedSign}
          />
          <SouthIndianChart
            varga={10}
            title="D10 · Daśāṃśa"
            subtitle="Parāśara Career & Karma"
            planets={planets}
            marks={marks}
            selectedSign={selectedSign}
            onSelectSign={setSelectedSign}
          />
          <SouthIndianChart
            varga={60}
            title="D60 · Ṣaṣṭyāṃśa"
            subtitle="Root Karmic Varga"
            planets={planets}
            marks={marks}
            selectedSign={selectedSign}
            onSelectSign={setSelectedSign}
          />
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
              Track A Karaka: <strong className="text-[var(--ink)]">{moneyRead.sunTrack.karaka}</strong> (
              {moneyRead.sunTrack.houseTaken}th from Sun)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--teal)] inline-block" />
              Track B Karaka: <strong className="text-[var(--ink)]">{moneyRead.nameTrack.karaka}</strong> (4th
              from Name Sign)
            </span>
          </div>

          <div className="font-mono-num text-[var(--ink)]">
            Inspected Sign: <strong>{inspectedRashi.en}</strong> ({inspectedRashi.sanskrit}, Lord:{' '}
            {inspectedRashi.lord}) ·{' '}
            {([1, 9, 10, 60] as VargaNumber[])
              .map((v) => {
                const occ = planets
                  .filter((p) =>
                    v === 1
                      ? p.d1Sign === inspectedSignIdx
                      : v === 9
                      ? p.d9Sign === inspectedSignIdx
                      : v === 10
                      ? p.d10Sign === inspectedSignIdx
                      : p.d60Sign === inspectedSignIdx
                  )
                  .map((p) => p.short);
                return `D${v}: ${occ.length ? occ.join(',') : '—'}`;
              })
              .join(' | ')}
          </div>
        </div>
      </section>

      {/* Complete Planetary Positions & Multi-Varga Dignity Table */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl font-normal text-[var(--ink)] m-0">
            Sidereal Planetary Positions &amp; Varga Dignities
          </h2>
          <span className="font-mono-num text-xs text-[var(--muted)]">
            Lahiri Chitrapaksha Ayanāṃśa: {snapshot.ayanamsa.toFixed(4)}° · Arudha Lagna (AL):{' '}
            {RASHI_META[panchanga.arudhas.alSign].en} · A5: {RASHI_META[panchanga.arudhas.a5Sign].en}
          </span>
        </div>

        <div className="overflow-x-auto">
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
                const isKA = p.name === moneyRead.sunTrack.karaka;
                const isKB = p.name === moneyRead.nameTrack.karaka;
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
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span>{RASHI_META[p.d1Sign].en}</span>
                      {p.d1Dignity && (
                        <span className={`ml-1.5 text-xs ${dignityStyle(p.d1Dignity)}`}>
                          · {DIGNITY_LABEL[p.d1Dignity]}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span>{RASHI_META[p.d9Sign].en}</span>
                      {p.d9Dignity && (
                        <span className={`ml-1.5 text-xs ${dignityStyle(p.d9Dignity)}`}>
                          · {DIGNITY_LABEL[p.d9Dignity]}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span>{RASHI_META[p.d10Sign].en}</span>
                      {p.d10Dignity && (
                        <span className={`ml-1.5 text-xs ${dignityStyle(p.d10Dignity)}`}>
                          · {DIGNITY_LABEL[p.d10Dignity]}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span>{RASHI_META[p.d60Sign].en}</span>
                      {p.d60Dignity && (
                        <span className={`ml-1.5 text-xs ${dignityStyle(p.d60Dignity)}`}>
                          · {DIGNITY_LABEL[p.d60Dignity]}
                        </span>
                      )}
                    </td>
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
