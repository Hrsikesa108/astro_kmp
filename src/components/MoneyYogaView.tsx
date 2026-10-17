import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PLANET_SHORT, RASHI_META } from '../utils/constants.ts';
import {
  DIGNITY_LABEL,
  type AstrologicalChartSnapshot,
  type DignityKind,
  type VargaNumber,
} from '../utils/astrology.ts';
import { type KatapayadiAnalysis } from '../utils/katapayadi.ts';
import {
  type DashaWealthWindow,
  type MoneyTrackResult,
  type MoneyYogaRead,
  type TransitWealthForecast,
} from '../utils/moneyYoga.ts';
import { Segmented } from './ui/Segmented.tsx';
import { CollapsibleToggle, collapsedOnMobile } from './ui/Collapsible.tsx';

interface MoneyYogaViewProps {
  snapshot: AstrologicalChartSnapshot;
  katapayadi: KatapayadiAnalysis;
  moneyRead: MoneyYogaRead;
}

function digClass(dig: DignityKind): string {
  if (dig === 'exalted') return 'text-[var(--teal)] font-semibold';
  if (dig === 'debilitated') return 'text-[var(--accent)] font-semibold';
  if (dig === 'own' || dig === 'moolatrikona') return 'text-[var(--gold)] font-medium';
  if (dig === 'enemy') return 'text-[var(--shunya)]';
  return 'text-[var(--ink)]';
}

function ratingClass(rating: DashaWealthWindow['rating']): string {
  if (rating === 'Peak Accumulation') return 'text-[var(--teal)] font-semibold';
  if (rating === 'Strong Growth') return 'text-[var(--ink)] font-medium';
  return 'text-[var(--muted)]';
}

function wealthScoreClass(score: number): string {
  if (score >= 2.5) return 'text-[var(--teal)] font-semibold';
  if (score >= 1.2) return 'text-[var(--ink)]';
  return 'text-[var(--muted)]';
}

function outlookClass(outlook: TransitWealthForecast['outlook']): string {
  if (outlook === 'High-Yield Window') return 'text-[var(--teal)] font-semibold';
  if (outlook === 'Supportive Expansion') return 'text-[var(--ink)] font-medium';
  if (outlook === 'Kantaka / Caution') return 'text-[var(--accent)] font-semibold';
  return 'text-[var(--muted)]';
}

const OUTLOOK_BADGE: Record<TransitWealthForecast['outlook'], string> = {
  'High-Yield Window': 'bg-[var(--teal-bg)] text-[var(--teal)]',
  'Supportive Expansion': 'bg-[var(--adhika-bg)] text-[var(--adhika)]',
  Balanced: 'bg-[var(--krishna)] text-[var(--muted)]',
  'Kantaka / Caution': 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]',
};

function signalClass(tone: 'good' | 'bad' | 'neutral'): string {
  if (tone === 'good') return 'text-[var(--teal)]';
  if (tone === 'bad') return 'text-[var(--accent)]';
  return 'text-[var(--muted)]';
}

/** Phones list the next two years of half-year windows until the user asks for all of them. */
const MOBILE_TRANSIT_PREVIEW = 4;

function signedScoreClass(score: number): string {
  if (score > 0) return 'text-[var(--teal)]';
  if (score < 0) return 'text-[var(--accent)]';
  return 'text-[var(--muted)]';
}

const TrackCard: React.FC<{
  track: MoneyTrackResult;
  refLabel: string;
  accentColor: string;
  className?: string;
}> = ({ track, refLabel, accentColor, className = '' }) => {
  const houseWord = track.useTenth ? '10th' : '4th';

  return (
    <div
      className={`bg-[var(--bg)] max-md:bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col gap-3 ${className}`}
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono-num text-xs uppercase tracking-wider font-semibold"
          style={{ color: accentColor }}
        >
          {track.title}
        </span>
        <span className="font-mono-num text-xs text-[var(--muted)]">
          Track Score:{' '}
          <strong className="text-[var(--ink)]">
            {track.score > 0 ? '+' : ''}
            {track.score.toFixed(2)}
          </strong>
        </span>
      </div>

      <div className="font-serif-title text-lg md:text-xl text-[var(--ink)] leading-snug">
        {refLabel} <span className="text-sm text-[var(--muted)] px-1">→</span> {houseWord} ={' '}
        {track.lordSignName} <span className="text-sm text-[var(--muted)] px-1">→</span>{' '}
        <strong
          className="px-1.5 py-0.5 rounded"
          style={{
            color: accentColor,
            backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
          }}
        >
          {track.karaka}
        </strong>
      </div>

      {track.useTenth && (
        <p className="text-xs text-[var(--accent)] m-0">
          Ketu shares the Sun&apos;s sign ({track.refSignName}) — classical exception applies, so the
          10th lord ({track.karaka}) is taken instead of the 4th.
        </p>
      )}

      {/* Varga Dignity Table: D1, D9, D10, D60 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono-num text-xs">
          <thead>
            <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-wider text-[var(--muted)] text-left">
              <th className="py-1.5 px-2">Varga</th>
              <th className="py-1.5 px-2">Sign</th>
              <th className="py-1.5 px-2">Dignity</th>
              <th className="py-1.5 px-2">
                <span className="md:hidden">Company</span>
                <span className="max-md:hidden">Company (Co-tenants)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {([1, 9, 10, 60] as VargaNumber[]).map((v) => {
              const vd = track.vargas[v];
              return (
                <tr key={v} className="border-b border-dashed border-[var(--line)]">
                  <td className="py-1.5 px-2 font-semibold">D{v}</td>
                  <td className="py-1.5 px-2">{vd.signName}</td>
                  <td className={`py-1.5 px-2 ${digClass(vd.dignity)}`}>
                    {DIGNITY_LABEL[vd.dignity]}
                  </td>
                  <td className="py-1.5 px-2">
                    {vd.coTenants.length ? (
                      vd.coTenants.map((p, idx) => (
                        <span key={p}>
                          {idx > 0 ? ', ' : ''}
                          {vd.exaltedWith.includes(p) ? (
                            <strong className="text-[var(--teal)]">{PLANET_SHORT[p]}↑</strong>
                          ) : (
                            PLANET_SHORT[p]
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-[var(--muted)]">alone</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Neecha Bhanga Cancellation Notes */}
      {([1, 9, 10] as VargaNumber[]).map((v) => {
        const vd = track.vargas[v];
        if (vd.dignity !== 'debilitated' || !vd.isCancelled) return null;
        return (
          <div key={v} className="text-xs text-[var(--accent)] leading-relaxed">
            <strong>D{v} Neecha Bhanga:</strong> {vd.cancelled.join('; ')} — debilitation is
            cancelled, so the extreme stops producing wealth and flips negative.
          </div>
        );
      })}

      <div className="text-xs text-[var(--muted)] font-mono-num">
        Morning reference (09:15) D60:{' '}
        <strong className={track.morningFlop ? 'text-[var(--accent)]' : 'text-[var(--ink)]'}>
          {RASHI_META[track.morningD60Sign].en} — {DIGNITY_LABEL[track.morningD60Dignity]}
        </strong>
      </div>

      {/* Rule Breakdown Ledger */}
      <table className="w-full border-collapse font-mono-num text-xs mt-1">
        <tbody>
          {track.parts.map((pt, i) => (
            <tr key={i} className="border-b border-dashed border-[var(--line)]">
              <td className="py-1.5 px-2 text-[var(--ink)]">{pt.label}</td>
              <td className={`py-1.5 px-2 text-right font-semibold ${signedScoreClass(pt.value)}`}>
                {pt.value > 0 ? '+' : ''}
                {pt.value}
              </td>
            </tr>
          ))}
          <tr className="border-t border-[var(--line)] font-bold">
            <td className="pt-2 px-2">Track Total</td>
            <td className="pt-2 px-2 text-right">
              {track.score > 0 ? '+' : ''}
              {track.score.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const MoneyYogaView: React.FC<MoneyYogaViewProps> = ({
  snapshot,
  katapayadi,
  moneyRead,
}) => {
  const [dashaFilter, setDashaFilter] = useState<'all' | 'peak' | 'current'>('all');
  const [expandedMaha, setExpandedMaha] = useState<string | null>(() => {
    const cur = moneyRead.dashas.find((d) => d.isCurrent);
    return cur ? cur.lord : moneyRead.dashas[0]?.lord || null;
  });
  // Phone-only: one track card at a time, explanations folded away
  const [mobileTrack, setMobileTrack] = useState<'A' | 'B'>('A');
  const [showIntro, setShowIntro] = useState(false);
  const [showDashaInfo, setShowDashaInfo] = useState(false);
  const [showTransitInfo, setShowTransitInfo] = useState(false);
  const [showAllTransits, setShowAllTransits] = useState(false);

  const karakaA = moneyRead.sunTrack.karaka;
  const mobileTransits = showAllTransits
    ? moneyRead.transitForecasts
    : moneyRead.transitForecasts.slice(0, MOBILE_TRANSIT_PREVIEW);

  const filteredDashaWindows = moneyRead.wealthDashaWindows.filter((w) => {
    if (dashaFilter === 'peak') {
      return w.rating === 'Peak Accumulation' || w.rating === 'Strong Growth';
    }
    if (dashaFilter === 'current') {
      return w.isCurrent;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      {/* Rule Explanation Panel (folded on phones) */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3">
        <div>
          <h2 className="m-title font-display text-xl md:text-2xl font-normal text-[var(--ink)] m-0">
            <span className="md:hidden">4th Lord Money Yoga</span>
            <span className="max-md:hidden">The 4th Lord Money Yoga &amp; Wealth Accumulation Engine</span>
          </h2>
          <p
            id="money-intro"
            className={`text-sm text-[var(--muted)] mt-1 m-0 max-w-4xl ${collapsedOnMobile(showIntro)}`}
          >
            Extracted from the Megastar Ephemeris 4th-Lord engine and extended with Parāśara Daśāṃśa
            (D10) and Vimshottari + Gochara timing cycles. Instead of reading houses from the Lagna,
            this system isolates a single <em>karaka</em> — the lord of the 4th sign from the Sun (Track
            A) and the 4th from the Kaṭapayādi Name Sign (Track B) — and grades its dignity and company
            across D1, D9, D10, and D60.
          </p>
        </div>

        <CollapsibleToggle
          open={showIntro}
          onToggle={() => setShowIntro(!showIntro)}
          label="How this engine works"
          controls="money-intro money-rules"
          className="-my-1"
        />

        <div
          id="money-rules"
          className={`bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-[var(--muted)] ${collapsedOnMobile(showIntro)}`}
        >
          <div>
            <strong className="text-[var(--ink)]">Karaka Derivation:</strong> Lord of the 4th from the
            Sun&apos;s sign. <em>Exception:</em> if Ketu occupies the Sun&apos;s sign, the 10th lord is
            taken instead. Track B always takes the 4th from the Name Sign.
          </div>
          <div>
            <strong className="text-[var(--ink)]">Extremes Produce Wealth:</strong> Exalted → money.
            Un-cancelled Debilitated → money too. Both extremes generate high financial output.
          </div>
          <div>
            <strong className="text-[var(--ink)]">The Neecha Bhanga Twist:</strong> A debilitation that
            gets <em>cancelled</em> (Neecha Bhanga) loses its extreme potency and turns negative.
          </div>
          <div>
            <strong className="text-[var(--ink)]">The D60 Override &amp; Support:</strong> Debilitated
            in D60 forces a Flop/Caution override. Benefics in Kendra (1/4/7/10) from the karaka or
            Shubha Kartari add support; Papa Kartari subtracts.
          </div>
        </div>
      </section>

      {/* Morning-Show / D60 Override Alert if triggered */}
      {moneyRead.morningFlop && (
        <div
          role="alert"
          className="bg-[var(--accent)] text-[var(--accent-ink)] rounded-xl p-3 md:p-4 flex flex-col gap-1"
        >
          <span className="font-mono-num text-xs uppercase tracking-wider font-semibold opacity-90">
            D60 Debilitation Override Active
          </span>
          <p className="text-sm m-0">
            The karaka is debilitated in Ṣaṣṭyāṃśa (D60), triggering the hard D60 override rule (
            <strong>{moneyRead.band.label}</strong> / Constrained cycle) regardless of the additive
            score of {moneyRead.combinedScore.toFixed(2)}.
          </p>
        </div>
      )}

      {/* Summary Score Strip (2×2 tiles on phones) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3.5">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            <span className="md:hidden">Combined Score</span>
            <span className="max-md:hidden">Combined Money Yoga Score</span>
          </span>
          <div className="font-display text-2xl md:text-3xl text-[var(--ink)] mt-1">
            {moneyRead.combinedScore > 0 ? '+' : ''}
            {moneyRead.combinedScore.toFixed(2)}
          </div>
          <span className="font-mono-num text-[11px] md:text-xs text-[var(--muted)]">
            0.6 × Track A ({moneyRead.sunTrack.score.toFixed(1)}) + 0.4 × Track B (
            {moneyRead.nameTrack.score.toFixed(1)})
          </span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            <span className="md:hidden">Wealth Band</span>
            <span className="max-md:hidden">Wealth Accumulation Band</span>
          </span>
          <div className="font-display text-xl md:text-2xl text-[var(--accent)] mt-1">
            {moneyRead.band.label}
          </div>
          <span className="text-[11px] md:text-xs text-[var(--muted)]">{moneyRead.band.tier}</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            <span className="md:hidden">Kendra Support</span>
            <span className="max-md:hidden">Kendra &amp; Kartari Support</span>
          </span>
          <div className="font-display text-base md:text-xl text-[var(--ink)] mt-1">
            {moneyRead.sunTrack.kendraBenefics.length
              ? `${moneyRead.sunTrack.kendraBenefics.join(', ')} in Kendra`
              : moneyRead.sunTrack.aspectingBenefics.length
              ? `Aspected by ${moneyRead.sunTrack.aspectingBenefics.join(', ')}`
              : 'Self-Reliant Karaka'}
          </div>
          <span className="text-[11px] md:text-xs text-[var(--muted)]">
            Kartari:{' '}
            {moneyRead.sunTrack.kartari === 'papa'
              ? 'Papa Kartari (Hemmed by Malefics)'
              : moneyRead.sunTrack.kartari === 'shubha'
              ? 'Shubha Kartari (Hemmed by Benefics)'
              : 'Unhemmed / Neutral'}
          </span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            <span className="md:hidden">Scale &amp; Reach</span>
            <span className="max-md:hidden">Scale &amp; Reach (Rāhu/Ketu)</span>
          </span>
          <div className="font-display text-base md:text-2xl text-[var(--gold)] mt-1">
            {moneyRead.panIndiaReach ? 'Pan-India / Global Reach' : 'Focused Domain Reach'}
          </div>
          <span className="text-[11px] md:text-xs text-[var(--muted)]">
            {moneyRead.panIndiaReach
              ? 'Karaka conjunct Rāhu/Ketu expands scale across borders'
              : 'Karaka free from nodal conjunction in D1'}
          </span>
        </div>
      </div>

      {/* Track A & Track B Side-by-Side Breakdown (one at a time on phones) */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 sm:p-5 max-md:p-0 max-md:border-0 max-md:bg-transparent flex flex-col gap-3">
        <Segmented
          ariaLabel="Wealth track"
          value={mobileTrack}
          onChange={setMobileTrack}
          className="md:hidden grid grid-cols-2"
          buttonClassName="min-h-11 px-2 text-sm"
          options={[
            { id: 'A', label: `Track A · ${karakaA}` },
            {
              id: 'B',
              label: `Track B · ${moneyRead.nameTrack.karaka}`,
              activeClassName: 'bg-[var(--teal)] text-white font-medium',
            },
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TrackCard
            track={moneyRead.sunTrack}
            refLabel={`Sun in ${RASHI_META[snapshot.panchanga.sunSignIdx].en}`}
            accentColor="var(--accent)"
            className={mobileTrack === 'A' ? '' : 'max-md:hidden'}
          />
          <TrackCard
            track={moneyRead.nameTrack}
            refLabel={`${katapayadi.rashi.en} (Sum ${katapayadi.numberString || '0'})`}
            accentColor="var(--teal)"
            className={mobileTrack === 'B' ? '' : 'max-md:hidden'}
          />
        </div>
      </section>

      {/* Predictive Wealth Accumulation Cycles: Part 1 — Vimshottari Dasha Timeline */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div className="max-md:w-full">
            <h2 className="m-title font-display text-xl md:text-2xl font-normal text-[var(--ink)] m-0">
              <span className="md:hidden">Vimshottari Daśā Cycles</span>
              <span className="max-md:hidden">Predictive Wealth Accumulation Cycles — Vimshottari Daśā</span>
            </h2>
            <p id="dasha-info" className={`text-xs text-[var(--muted)] m-0 mt-0.5 ${collapsedOnMobile(showDashaInfo)}`}>
              Evaluates every Mahādaśā and Antardaśā from the birth Moon ({snapshot.planets.find((p) => p.name === 'Moon')?.nakshatraName}{' '}
              nakshatra) by how strongly the period lords activate Track A ({karakaA})
              and Track B ({moneyRead.nameTrack.karaka}).
            </p>
            <CollapsibleToggle
              open={showDashaInfo}
              onToggle={() => setShowDashaInfo(!showDashaInfo)}
              label="About this timeline"
              controls="dasha-info"
              className="mt-1"
            />
          </div>

          <Segmented
            ariaLabel="Filter Dasha periods"
            value={dashaFilter}
            onChange={setDashaFilter}
            className="grid grid-cols-3 max-md:w-full md:inline-flex"
            buttonClassName="px-3 py-1.5 text-xs shrink-0 max-md:min-h-10 max-md:px-1"
            options={[
              {
                id: 'all',
                label: (
                  <>
                    <span className="md:hidden">All daśās</span>
                    <span className="max-md:hidden">All Mahādaśās</span>
                  </>
                ),
              },
              {
                id: 'peak',
                label: (
                  <>
                    <span className="md:hidden">Peak wealth</span>
                    <span className="max-md:hidden">Peak Wealth Sub-Periods</span>
                  </>
                ),
              },
              {
                id: 'current',
                label: (
                  <>
                    <span className="md:hidden">Active now</span>
                    <span className="max-md:hidden">Active Period Now</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        {dashaFilter === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            {moneyRead.dashas.map((md) => {
              const isOpen = expandedMaha === md.lord;
              return (
                <div
                  key={md.lord}
                  className={`border rounded-lg p-3 transition-colors ${
                    md.isCurrent
                      ? 'border-[var(--accent)] bg-[var(--bg)]'
                      : 'border-[var(--line)] bg-[var(--bg)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMaha(isOpen ? null : md.lord)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="font-display text-lg text-[var(--ink)]">
                        {md.lord} Mahādaśā
                      </span>
                      {md.isCurrent && (
                        <span className="ml-2 text-[11px] font-mono-num uppercase text-[var(--accent)] font-semibold">
                          · Active
                        </span>
                      )}
                      <div className="font-mono-num text-xs text-[var(--muted)]">
                        {md.startStr} → {md.endStr} ({md.years} yrs)
                      </div>
                    </div>
                    <span className="max-md:hidden text-xs text-[var(--accent)]">
                      {isOpen ? 'Hide Bhuktis ▲' : '9 Bhuktis ▼'}
                    </span>
                    <ChevronDown
                      className={`md:hidden shrink-0 size-5 text-[var(--accent)] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-2 border-t border-[var(--line)] flex flex-col gap-1.5">
                      {md.antardashas.map((ad) => {
                        const win = moneyRead.wealthDashaWindows.find(
                          (w) => w.mahadasha === md.lord && w.antardasha === ad.lord
                        );
                        return (
                          <div
                            key={ad.lord}
                            className={`text-xs font-mono-num p-1.5 rounded flex items-center justify-between gap-2 ${
                              ad.isCurrent ? 'bg-[var(--gold-bg)] text-[var(--gold)] font-semibold' : ''
                            }`}
                          >
                            <span>
                              {md.lord}–{ad.lord}
                            </span>
                            <span className="text-[11px] text-[var(--muted)]">
                              {ad.startStr.slice(0, 7)}..{ad.endStr.slice(0, 7)}
                            </span>
                            {win && (
                              <span className={`text-[11px] ${wealthScoreClass(win.wealthScore)}`}>
                                {win.wealthScore > 0 ? '+' : ''}
                                {win.wealthScore}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* Phones: one card per sub-period instead of a 5-column table */}
            <div className="md:hidden flex flex-col gap-2">
              {filteredDashaWindows.length ? (
                filteredDashaWindows.map((w, idx) => (
                  <div
                    key={`${w.mahadasha}-${w.antardasha}-${idx}`}
                    className={`rounded-lg border p-3 flex flex-col gap-1 ${
                      w.isCurrent
                        ? 'border-[var(--gold)] bg-[var(--gold-bg)]'
                        : 'border-[var(--line)] bg-[var(--bg)]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-sm text-[var(--ink)]">
                        {w.mahadasha} – {w.antardasha}
                        {w.isCurrent && (
                          <span className="ml-1.5 text-[11px] text-[var(--accent)]">· Current</span>
                        )}
                      </span>
                      <span className={`font-mono-num text-sm ${wealthScoreClass(w.wealthScore)}`}>
                        {w.wealthScore > 0 ? '+' : ''}
                        {w.wealthScore}
                      </span>
                    </div>
                    <span className="font-mono-num text-xs text-[var(--muted)]">
                      {w.startStr} → {w.endStr}
                    </span>
                    <span className={`text-xs ${ratingClass(w.rating)}`}>{w.rating}</span>
                    {w.reasons.length > 0 && (
                      <span className="text-[11px] leading-snug text-[var(--muted)]">
                        {w.reasons.join(' · ')}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="m-0 py-6 text-center text-sm text-[var(--muted)]">
                  No matching Dasha windows found for the current filter.
                </p>
              )}
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto max-md:hidden">
              <table className="w-full border-collapse text-left text-xs font-mono-num">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    <th className="py-2 px-3">Mahādaśā – Antardaśā</th>
                    <th className="py-2 px-3">Period Window</th>
                    <th className="py-2 px-3">Activation Rating</th>
                    <th className="py-2 px-3">4th Lord Wealth Drivers</th>
                    <th className="py-2 px-3 text-right">Index</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDashaWindows.length ? (
                    filteredDashaWindows.map((w, idx) => (
                      <tr
                        key={`${w.mahadasha}-${w.antardasha}-${idx}`}
                        className={`border-b border-[var(--line)] ${
                          w.isCurrent ? 'bg-[var(--gold-bg)]' : 'hover:bg-[var(--bg)]'
                        }`}
                      >
                        <td className="py-2 px-3 font-sans font-semibold text-[var(--ink)] whitespace-nowrap">
                          {w.mahadasha} – {w.antardasha}
                          {w.isCurrent && (
                            <span className="ml-1.5 text-[11px] text-[var(--accent)]">· Current</span>
                          )}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {w.startStr} → {w.endStr}
                        </td>
                        <td className="py-2 px-3 font-sans whitespace-nowrap">
                          <span className={ratingClass(w.rating)}>{w.rating}</span>
                        </td>
                        <td className="py-2 px-3 font-sans text-[var(--muted)]">
                          {w.reasons.join(' · ')}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold">
                          {w.wealthScore > 0 ? '+' : ''}
                          {w.wealthScore}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[var(--muted)] font-sans">
                        No matching Dasha windows found for the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Predictive Wealth Accumulation Cycles: Part 2 — Jupiter & Saturn Gochara Transits */}
      <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3 md:gap-4">
        <div>
          <h2 className="m-title font-display text-xl md:text-2xl font-normal text-[var(--ink)] m-0">
            <span className="md:hidden">Gochara Transit Windows</span>
            <span className="max-md:hidden">Jupiter &amp; Saturn Gochara (Transit) Wealth Windows</span>
          </h2>
          <p id="transit-info" className={`text-xs text-[var(--muted)] m-0 mt-0.5 ${collapsedOnMobile(showTransitInfo)}`}>
            Tracks semi-annual transits of Jupiter (Kendra/Trikona expansion), Saturn (Upachaya
            suppression of competitors vs. Kantaka Śani obstacles in 1st/4th/8th/10th), and Rāhu/Ketu
            relative to the Track A 4th Lord ({karakaA} in{' '}
            {RASHI_META[moneyRead.sunTrack.d1Sign].en}) and Name Rāśi ({katapayadi.rashi.en}).
          </p>
          <CollapsibleToggle
            open={showTransitInfo}
            onToggle={() => setShowTransitInfo(!showTransitInfo)}
            label="About these windows"
            controls="transit-info"
            className="mt-1"
          />
        </div>

        {/* Phones: one card per half-year window */}
        <div className="md:hidden flex flex-col gap-2">
          {mobileTransits.map((tf) => (
            <div
              key={tf.dateLabel}
              className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 flex flex-col gap-1.5"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="mr-auto font-mono-num text-sm font-semibold text-[var(--ink)]">{tf.dateLabel}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${OUTLOOK_BADGE[tf.outlook]}`}>
                  {tf.outlook}
                </span>
                <span className={`font-mono-num text-sm font-semibold ${signedScoreClass(tf.score)}`}>
                  {tf.score > 0 ? '+' : ''}
                  {tf.score.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-[var(--ink)] flex flex-col gap-0.5">
                <span>
                  <span className="text-[var(--muted)]">Jupiter</span> {tf.jupSignName}{' '}
                  <span className="font-mono-num text-[11px] text-[var(--muted)]">
                    · H{tf.jupFromKarakaA} from {PLANET_SHORT[karakaA]}
                  </span>
                </span>
                <span>
                  <span className="text-[var(--muted)]">Saturn</span> {tf.satSignName}{' '}
                  <span className="font-mono-num text-[11px] text-[var(--muted)]">
                    · H{tf.satFromKarakaA} from {PLANET_SHORT[karakaA]}
                  </span>
                </span>
              </div>
              {tf.signals.length > 0 && (
                <ul className="m-0 p-0 list-none flex flex-col gap-0.5 text-[11px] leading-snug">
                  {tf.signals.map((sig, idx) => (
                    <li key={idx} className={signalClass(sig.tone)}>
                      • {sig.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {moneyRead.transitForecasts.length > MOBILE_TRANSIT_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllTransits(!showAllTransits)}
              aria-expanded={showAllTransits}
              className="h-11 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-sm font-medium text-[var(--accent)] cursor-pointer"
            >
              {showAllTransits
                ? 'Show fewer windows'
                : `Show all ${moneyRead.transitForecasts.length} windows`}
            </button>
          )}
        </div>

        <div className="overflow-x-auto max-md:hidden">
          <table className="w-full border-collapse text-left text-xs font-mono-num">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2.5 px-3">Half-Year Window</th>
                <th className="py-2.5 px-3">Transit Jupiter</th>
                <th className="py-2.5 px-3">Transit Saturn</th>
                <th className="py-2.5 px-3">Cycle Outlook</th>
                <th className="py-2.5 px-3">Active Gochara Signals</th>
                <th className="py-2.5 px-3 text-right">Signal</th>
              </tr>
            </thead>
            <tbody>
              {moneyRead.transitForecasts.map((tf) => (
                <tr
                  key={tf.dateLabel}
                  className="border-b border-[var(--line)] hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-[var(--ink)] whitespace-nowrap">
                    {tf.dateLabel}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {tf.jupSignName}{' '}
                    <span className="text-[var(--muted)]">
                      (H{tf.jupFromKarakaA} from {PLANET_SHORT[karakaA]})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {tf.satSignName}{' '}
                    <span className="text-[var(--muted)]">
                      (H{tf.satFromKarakaA} from {PLANET_SHORT[karakaA]})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                    <span className={outlookClass(tf.outlook)}>{tf.outlook}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="flex flex-col gap-0.5">
                      {tf.signals.map((sig, idx) => (
                        <span key={idx} className={signalClass(sig.tone)}>
                          {sig.text}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${signedScoreClass(tf.score)}`}>
                    {tf.score > 0 ? '+' : ''}
                    {tf.score.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
