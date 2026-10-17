import React from 'react';
import { RASHI_META } from '../utils/constants.ts';
import { type AstrologicalChartSnapshot, type PanchangaSpan } from '../utils/astrology.ts';

interface PanchangaViewProps {
  snapshot: AstrologicalChartSnapshot;
  purnimanta: boolean;
}

function renderMoonSVG(phaseDeg: number) {
  const r = 22;
  const c = Math.cos((phaseDeg * Math.PI) / 180);
  const wax = phaseDeg < 180;
  const lit = `M26 4 A${r} ${r} 0 0 ${wax ? 1 : 0} 26 48 A${(r * Math.abs(c)).toFixed(2)} ${r} 0 0 ${
    c > 0 === wax ? 0 : 1
  } 26 4Z`;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true" className="shrink-0 max-md:size-11">
      <circle cx="26" cy="26" r="22" fill="var(--moon-dark)" />
      <path d={lit} fill="var(--moon-lit)" />
    </svg>
  );
}

/** One Pañcāṅga limb: the span in force at birth, then the ones that follow. */
const LimbCard: React.FC<{ label: string; shortLabel: string; spans: PanchangaSpan[] }> = ({
  label,
  shortLabel,
  spans,
}) => (
  <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-4 flex flex-col gap-2">
    <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
      <span className="md:hidden">{shortLabel}</span>
      <span className="max-md:hidden">{label}</span>
    </span>
    <div className="flex flex-col gap-2">
      {spans.map((sp, idx) => (
        <div key={idx} className="flex flex-col">
          <strong
            className={
              idx === 0
                ? 'font-display text-lg md:text-xl font-normal text-[var(--ink)]'
                : 'text-sm font-medium text-[var(--ink)]'
            }
          >
            {sp.name}
          </strong>
          <span className="font-mono-num text-xs text-[var(--muted)]">until {sp.endFormatted}</span>
          {sp.subLabel && <span className="text-[11px] text-[var(--muted)]">{sp.subLabel}</span>}
        </div>
      ))}
    </div>
  </section>
);

export const PanchangaView: React.FC<PanchangaViewProps> = ({ snapshot, purnimanta }) => {
  const { panchanga } = snapshot;
  const masaName = purnimanta ? panchanga.masa.purnimantaName : panchanga.masa.amantaName;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Header Banner */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 md:p-5 flex items-center justify-between gap-3 md:gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            Nitya Pañcāṅgam · {snapshot.place.name} ({snapshot.place.zone})
          </span>
          <h2 className="font-display text-xl md:text-3xl font-normal text-[var(--ink)] mt-0.5 m-0">
            {panchanga.vara.en}, {snapshot.dateStr} · {snapshot.timeStr}
          </h2>
          <p className="text-xs md:text-sm text-[var(--muted)] m-0 mt-1">
            {panchanga.vara.sanskrit} (Lord: {panchanga.vara.lord}) · {masaName} (
            {purnimanta ? 'Purnimanta' : 'Amanta'}) · {panchanga.pakshaLabel} · {panchanga.masa.ritu}
          </p>
        </div>
        {renderMoonSVG(panchanga.tithiAtBirth.phaseDeg)}
      </div>

      {/* 4 Panchanga Limbs Grid: Tithi, Nakshatra, Yoga, Karana (2×2 on phones) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3.5">
        <LimbCard label="Tithi (Lunar Day)" shortLabel="Tithi" spans={panchanga.tithiSpans} />
        <LimbCard label="Nakṣatra (Lunar Mansion)" shortLabel="Nakṣatra" spans={panchanga.nakshatraSpans} />
        <LimbCard label="Nitya Yoga" shortLabel="Nitya Yoga" spans={panchanga.yogaSpans} />
        <LimbCard label="Karaṇa (Half-Tithi)" shortLabel="Karaṇa" spans={panchanga.karanaSpans} />
      </div>

      {/* Sun & Moon + Daily Time Periods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            Sun &amp; Moon Horizon &amp; Rāśi
          </span>
          <dl className="grid grid-cols-2 gap-3 m-0">
            <div>
              <dt className="text-xs text-[var(--muted)]">Sunrise</dt>
              <dd className="font-mono-num text-base font-medium m-0">
                {panchanga.sunriseFormatted}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Sunset</dt>
              <dd className="font-mono-num text-base font-medium m-0">
                {panchanga.sunsetFormatted}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Moonrise</dt>
              <dd className="font-mono-num text-base font-medium m-0">
                {panchanga.moonriseFormatted}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Moonset</dt>
              <dd className="font-mono-num text-base font-medium m-0">
                {panchanga.moonsetFormatted}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Sun in (Sūrya Rāśi)</dt>
              <dd className="text-base font-medium m-0">
                {RASHI_META[panchanga.sunSignIdx].sanskrit} ({RASHI_META[panchanga.sunSignIdx].en})
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)]">Moon in (Chandra Rāśi)</dt>
              <dd className="text-base font-medium m-0">
                {RASHI_META[panchanga.moonSignIdx].sanskrit} ({RASHI_META[panchanga.moonSignIdx].en})
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--muted)]">
            Daily Muhūrta &amp; Rāhu / Yama / Gulika Windows
          </span>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 m-0">
            {panchanga.periods.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col max-md:border-l-[3px] max-md:pl-2.5 ${
                  p.good ? 'max-md:border-[var(--teal)]' : 'max-md:border-[var(--shunya)]'
                }`}
              >
                <dt className="text-xs text-[var(--muted)] flex items-center justify-between pr-2">
                  <span>{p.name}</span>
                  <span
                    className={`text-[10px] font-mono-num uppercase ${
                      p.good ? 'text-[var(--teal)]' : 'text-[var(--shunya)]'
                    }`}
                  >
                    {p.good ? 'Auspicious' : 'Avoid'}
                  </span>
                </dt>
                <dd className="font-mono-num text-base font-medium m-0">{p.formatted}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
};
