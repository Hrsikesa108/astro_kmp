import React from 'react';
import { RASHI_META, SI_POS, type PlanetName } from '../utils/constants.ts';
import { type PlanetPosition, type VargaNumber } from '../utils/astrology.ts';

export interface ChartKarakaMarks {
  karakaA?: PlanetName;
  karakaB?: PlanetName;
  refA?: number;
  refB?: number;
  lordSignA?: number;
  lordSignB?: number;
  houseA?: 4 | 10;
}

interface SouthIndianChartProps {
  varga: VargaNumber;
  title: string;
  subtitle?: string;
  planets: PlanetPosition[];
  marks?: ChartKarakaMarks;
  selectedSign?: number | null;
  onSelectSign?: (signIdx: number) => void;
}

const VARGA_LABELS: Record<VargaNumber, { code: string; sanskrit: string; desc: string }> = {
  1: { code: 'D1', sanskrit: 'Rāśi', desc: 'Root Natal Chart' },
  9: { code: 'D9', sanskrit: 'Navāṃśa', desc: 'Dharma & Bhāgya' },
  10: { code: 'D10', sanskrit: 'Daśāṃśa', desc: 'Karma & Career' },
  60: { code: 'D60', sanskrit: 'Ṣaṣṭyāṃśa', desc: 'Fine Karmic Root' },
};

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  varga,
  title,
  subtitle,
  planets,
  marks,
  selectedSign,
  onSelectSign,
}) => {
  const getSignForVarga = (p: PlanetPosition): number => {
    if (varga === 9) return p.d9Sign;
    if (varga === 10) return p.d10Sign;
    if (varga === 60) return p.d60Sign;
    return p.d1Sign;
  };

  const bySign: PlanetPosition[][] = Array.from({ length: 12 }, () => []);
  planets.forEach((p) => {
    bySign[getSignForVarga(p)].push(p);
  });

  const lagnaObj = planets.find((p) => p.name === 'Lagna');
  const lagnaSign = lagnaObj ? getSignForVarga(lagnaObj) : 0;

  const karakaAObj = marks?.karakaA ? planets.find((p) => p.name === marks.karakaA) : undefined;
  const karakaBObj = marks?.karakaB ? planets.find((p) => p.name === marks.karakaB) : undefined;
  const signA = karakaAObj ? getSignForVarga(karakaAObj) : -1;
  const signB = karakaBObj ? getSignForVarga(karakaBObj) : -1;

  const meta = VARGA_LABELS[varga];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-normal text-[var(--ink)] m-0">
          {title} <span className="text-xs text-[var(--muted)] font-sans">· {meta.desc}</span>
        </h3>
        <span className="font-mono-num text-xs text-[var(--muted)]">
          Lagna: {RASHI_META[lagnaSign].en}
        </span>
      </div>

      <div
        className="rchart rounded-md overflow-hidden"
        role="region"
        aria-label={`${meta.code} ${meta.sanskrit} South Indian Chart`}
      >
        {RASHI_META.map((rashi) => {
          const s = rashi.index;
          const [row, col] = SI_POS[s];
          const isLagna = s === lagnaSign;
          const holdsA = s === signA;
          const holdsB = s === signB;
          const isSelected = selectedSign === s;

          let cellCls = 'rc';
          if (isLagna) cellCls += ' lagna';
          if (holdsA) cellCls += ' holds-a';
          if (holdsB) cellCls += ' holds-b';
          if (isSelected) cellCls += ' ring-2 ring-[var(--ink)] z-10';

          const cellTags: React.ReactNode[] = [];
          if (varga === 1 && marks) {
            if (s === marks.refA) {
              cellTags.push(
                <span key="refA" className="cell-tag t-a">
                  A ref
                </span>
              );
            }
            if (s === marks.lordSignA) {
              cellTags.push(
                <span key="lordA" className="cell-tag t-a">
                  A {marks.houseA || 4}th
                </span>
              );
            }
            if (s === marks.refB) {
              cellTags.push(
                <span key="refB" className="cell-tag t-b">
                  B ref
                </span>
              );
            }
            if (s === marks.lordSignB) {
              cellTags.push(
                <span key="lordB" className="cell-tag t-b">
                  B 4th
                </span>
              );
            }
          }

          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSign?.(s)}
              style={{ gridRow: row, gridColumn: col }}
              className={`${cellCls} text-left cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
              aria-label={`${rashi.en} (${rashi.sanskrit})${isLagna ? ', Ascendant Lagna' : ''}: ${
                bySign[s].map((x) => x.name).join(', ') || 'Empty'
              }`}
            >
              {bySign[s].map((x) => {
                const isLa = x.name === 'Lagna';
                const isKA = marks?.karakaA === x.name;
                const isKB = marks?.karakaB === x.name;
                let plCls = 'pl';
                if (isLa) plCls += ' la';
                else if (isKA && isKB) plCls += ' karaka-both';
                else if (isKA) plCls += ' karaka-a';
                else if (isKB) plCls += ' karaka-b';

                const showRetro = x.retro && !['Rahu', 'Ketu', 'Lagna'].includes(x.name);

                return (
                  <span
                    key={x.name}
                    className={plCls}
                    title={`${x.name} ${x.degFormatted} in ${rashi.en}${
                      showRetro ? ' (Retrograde)' : ''
                    }`}
                  >
                    <span>
                      {x.short}
                      {showRetro && <sup>R</sup>}
                    </span>
                    {varga === 1 && <i>{x.degFormatted}</i>}
                  </span>
                );
              })}

              {cellTags.length > 0 && <span className="cell-tags">{cellTags}</span>}
              <span className="rs">{rashi.abbr}</span>
            </button>
          );
        })}

        <div className="rcenter">
          <b>
            {meta.code} · {meta.sanskrit}
          </b>
          {subtitle && <span className="font-mono-num text-[11px]">{subtitle}</span>}
          <span className="text-[11px] opacity-80">
            Lagna: {RASHI_META[lagnaSign].sanskrit} ({RASHI_META[lagnaSign].en})
          </span>
        </div>
      </div>
    </div>
  );
};
