import {
  ALL9,
  RASHI_META,
  SIGN_LORDS,
  type CityLocation,
  type PlanetName,
} from './constants.ts';
import {
  computePlanetsAtDate,
  computeVimshottariDashas,
  DIGNITY_LABEL,
  dignityInSign,
  dignityOf,
  EXALTATION,
  EXALTED_IN_SIGN,
  getRelativeHouse,
  localDateTimeToUtc,
  navamsaRashi,
  norm360,
  rashiOf,
  shashtiamsaRashi,
  vargaSign,
  type DignityKind,
  type MahadashaPeriod,
  type VargaNumber,
} from './astrology.ts';
import { type KatapayadiAnalysis } from './katapayadi.ts';

export const MONEY_WEIGHTS = {
  // Non-monotonic on purpose per the 4th-Lord Money Yoga rule set:
  // Debilitation scores like exaltation in D1/D9/D10 ("extremes produce money"),
  // flips negative once cancelled (Neecha Bhanga), and is a hard negative in D60.
  dignity: {
    1: {
      exalted: 3,
      moolatrikona: 2,
      own: 1.5,
      friend: 0.5,
      neutral: 0,
      enemy: -1,
      debilitated: 3,
      debilitatedCancelled: -2,
    },
    9: {
      exalted: 2,
      moolatrikona: 1.5,
      own: 1,
      friend: 0.5,
      neutral: 0,
      enemy: -0.5,
      debilitated: 2,
      debilitatedCancelled: -1.5,
    },
    10: {
      exalted: 1.5,
      moolatrikona: 1,
      own: 1,
      friend: 0.5,
      neutral: 0,
      enemy: -0.5,
      debilitated: 1.5,
      debilitatedCancelled: -1,
    },
    60: {
      exalted: 2,
      moolatrikona: 1.5,
      own: 1,
      friend: 0.5,
      neutral: 0,
      enemy: -0.5,
      debilitated: -4,
      debilitatedCancelled: -4,
    },
  },
  exaltedCoTenant: { 1: 2, 9: 1.5, 10: 1, 60: 1.5 },
  kendraBeneficFirst: 2,
  kendraBeneficEach: 0.5,
  kendraBeneficCap: 3,
  aspectBeneficEach: 1,
  aspectBeneficCap: 2,
  papaKartari: -3,
  shubhaKartari: 2,
  nodeConjunct: 0, // Pan-India / broad reach indicator, not a direct money score
  trackSun: 0.6,
  trackName: 0.4,
};

export interface WealthBand {
  min: number;
  label: string;
  tier: string;
  score: number;
}

export const MONEY_BANDS: WealthBand[] = [
  { min: 4.3, label: 'Blockbuster', tier: 'Exceptional Wealth Yoga', score: 3 },
  { min: 3.3, label: 'Super Hit', tier: 'High Wealth Accumulation', score: 2 },
  { min: 2.2, label: 'Hit', tier: 'Strong Financial Gains', score: 1 },
  { min: 1.7, label: 'Semi Hit', tier: 'Moderate Steady Gains', score: 0.5 },
  { min: 1.0, label: 'Average', tier: 'Balanced / Neutral Cycle', score: 0 },
  { min: -0.8, label: 'Flop', tier: 'Constrained / Volatile', score: -1 },
  { min: -Infinity, label: 'Disaster', tier: 'High Caution / Drain', score: -2 },
];

export function bandForScore(s: number): WealthBand {
  return MONEY_BANDS.find((b) => s >= b.min) || MONEY_BANDS[MONEY_BANDS.length - 1];
}

export function isBenefic(
  planet: PlanetName,
  planets: Record<PlanetName | 'Lagna', number>
): boolean {
  if (planet === 'Jupiter' || planet === 'Venus' || planet === 'Mercury') return true;
  if (planet === 'Moon') return norm360(planets.Moon - planets.Sun) < 180;
  return false;
}

const SPECIAL_DRISHTI: Partial<Record<PlanetName, number[]>> = {
  Mars: [4, 8],
  Jupiter: [5, 9],
  Saturn: [3, 10],
};

export function aspectedSigns(planet: PlanetName, fromSign: number): number[] {
  const houses = [7, ...(SPECIAL_DRISHTI[planet] || [])];
  return houses.map((h) => (fromSign + h - 1) % 12);
}

export function aspectsSign(
  planet: PlanetName,
  fromSign: number,
  targetSign: number
): boolean {
  return aspectedSigns(planet, fromSign).includes(targetSign);
}

export function occupantsOfSign(
  planets: Record<PlanetName | 'Lagna', number>,
  sign: number,
  varga: VargaNumber
): PlanetName[] {
  return ALL9.filter((p) => vargaSign(planets[p], varga) === sign);
}

export function kartariOf(
  sign: number,
  planets: Record<PlanetName | 'Lagna', number>
): 'papa' | 'shubha' | null {
  const before = occupantsOfSign(planets, (sign + 11) % 12, 1);
  const after = occupantsOfSign(planets, (sign + 1) % 12, 1);
  if (!before.length || !after.length) return null;
  const allMalefic = (arr: PlanetName[]) => arr.every((p) => !isBenefic(p, planets));
  const allBenefic = (arr: PlanetName[]) => arr.every((p) => isBenefic(p, planets));
  if (allMalefic(before) && allMalefic(after)) return 'papa';
  if (allBenefic(before) && allBenefic(after)) return 'shubha';
  return null;
}

/**
 * Classical Neecha Bhanga (cancellation of debilitation) conditions.
 * No Lagna is used in the 4th-Lord engine; `refSign` (Sun's sign or Katapayadi sign)
 * stands in alongside the Moon sign.
 */
export function neechaBhanga(
  planet: PlanetName,
  debSign: number,
  lon: number,
  planets: Record<PlanetName | 'Lagna', number>,
  refSign: number
): string[] {
  const reasons: string[] = [];
  const moonSign = rashiOf(planets.Moon);
  const inKendraFrom = (sign: number, from: number) =>
    [1, 4, 7, 10].includes(getRelativeHouse(sign, from));
  const kendraSomewhere = (p: PlanetName) => {
    const s = rashiOf(planets[p]);
    return inKendraFrom(s, refSign) || inKendraFrom(s, moonSign);
  };
  const dispositor = SIGN_LORDS[debSign];
  const exaltedHere = EXALTED_IN_SIGN[debSign];

  if (kendraSomewhere(dispositor)) {
    reasons.push(`${dispositor} (lord of ${RASHI_META[debSign].en}) in a kendra`);
  }
  if (exaltedHere && kendraSomewhere(exaltedHere)) {
    reasons.push(`${exaltedHere} (exalted in ${RASHI_META[debSign].en}) in a kendra`);
  }
  const dispSign = rashiOf(planets[dispositor]);
  if (dispSign === debSign) {
    reasons.push(`conjunct its dispositor ${dispositor}`);
  } else if (aspectsSign(dispositor, dispSign, debSign)) {
    reasons.push(`aspected by its dispositor ${dispositor}`);
  }
  if (exaltedHere) {
    const exSign = rashiOf(planets[exaltedHere]);
    if (exSign === debSign) {
      reasons.push(`conjunct ${exaltedHere}`);
    } else if (aspectsSign(exaltedHere, exSign, debSign)) {
      reasons.push(`aspected by ${exaltedHere}`);
    }
  }
  if (navamsaRashi(lon) === EXALTATION[planet].sign) {
    reasons.push('exalted in Navāṃśa (D9)');
  }

  return reasons;
}

export interface VargaEvaluation {
  varga: VargaNumber;
  sign: number;
  signName: string;
  dignity: DignityKind;
  coTenants: PlanetName[];
  exaltedWith: PlanetName[];
  cancelled: string[];
  isCancelled: boolean;
}

export interface ScorePart {
  label: string;
  value: number;
}

export interface MoneyTrackResult {
  trackId: 'A' | 'B';
  title: string;
  refSign: number;
  refSignName: string;
  houseTaken: 4 | 10;
  useTenth: boolean;
  nodeOnRef: boolean;
  lordSign: number;
  lordSignName: string;
  karaka: PlanetName;
  d1Sign: number;
  vargas: Record<VargaNumber, VargaEvaluation>;
  morningD60Sign: number;
  morningD60Dignity: DignityKind;
  morningFlop: boolean;
  kendraBenefics: PlanetName[];
  aspectingBenefics: PlanetName[];
  kartari: 'papa' | 'shubha' | null;
  withNodes: PlanetName[];
  parts: ScorePart[];
  score: number;
}

export function computeMoneyTrack(
  trackId: 'A' | 'B',
  title: string,
  refSign: number,
  allowKetuRule: boolean,
  planets: Record<PlanetName | 'Lagna', number>,
  morningPlanets: Record<PlanetName | 'Lagna', number>
): MoneyTrackResult {
  const nodeOnRef = rashiOf(planets.Ketu) === refSign;
  const useTenth = allowKetuRule && nodeOnRef;
  const houseTaken: 4 | 10 = useTenth ? 10 : 4;
  const lordSign = (refSign + houseTaken - 1) % 12;
  const karaka = SIGN_LORDS[lordSign];
  const lon = planets[karaka];
  const d1Sign = rashiOf(lon);

  const vargas = {} as Record<VargaNumber, VargaEvaluation>;
  ([1, 9, 10, 60] as VargaNumber[]).forEach((v) => {
    const sign = vargaSign(lon, v);
    const dignity = v === 1 ? dignityOf(karaka, lon) : dignityInSign(karaka, sign);
    const coTenants = occupantsOfSign(planets, sign, v).filter((p) => p !== karaka);
    const exaltedWith = coTenants.filter((p) => EXALTATION[p].sign === sign);
    let cancelled: string[] = [];
    if (dignity === 'debilitated') {
      cancelled = neechaBhanga(karaka, sign, lon, planets, refSign);
    }
    vargas[v] = {
      varga: v,
      sign,
      signName: RASHI_META[sign].en,
      dignity,
      coTenants,
      exaltedWith,
      cancelled,
      isCancelled: cancelled.length > 0,
    };
  });

  // Fixed 09:15 morning-show D60 check + Natal D60 check
  const morningLon = morningPlanets[karaka];
  const morningD60Sign = shashtiamsaRashi(morningLon);
  const morningD60Dignity = dignityInSign(karaka, morningD60Sign);
  const morningFlop =
    vargas[60].dignity === 'debilitated' || morningD60Dignity === 'debilitated';

  const kendraBenefics = ALL9.filter(
    (p) =>
      p !== karaka &&
      isBenefic(p, planets) &&
      [1, 4, 7, 10].includes(getRelativeHouse(rashiOf(planets[p]), d1Sign))
  );

  const aspectingBenefics = kendraBenefics.length
    ? []
    : ALL9.filter(
        (p) =>
          p !== karaka &&
          isBenefic(p, planets) &&
          aspectsSign(p, rashiOf(planets[p]), d1Sign)
      );

  const kartari = kartariOf(d1Sign, planets);
  const withNodes = (['Rahu', 'Ketu'] as PlanetName[]).filter(
    (n) => rashiOf(planets[n]) === d1Sign
  );

  const parts: ScorePart[] = [];
  const add = (label: string, value: number) => {
    if (value !== 0) parts.push({ label, value });
  };

  ([1, 9, 10, 60] as VargaNumber[]).forEach((v) => {
    const vd = vargas[v];
    const key =
      vd.dignity === 'debilitated' && vd.isCancelled
        ? 'debilitatedCancelled'
        : vd.dignity;
    const w = MONEY_WEIGHTS.dignity[v][key as keyof (typeof MONEY_WEIGHTS.dignity)[1]] || 0;
    const note =
      vd.dignity === 'debilitated'
        ? v === 60
          ? 'debilitated (D60 fails)'
          : vd.isCancelled
          ? 'debilitated but cancelled (Neecha Bhanga)'
          : 'debilitated → money yoga'
        : DIGNITY_LABEL[vd.dignity].toLowerCase();
    add(`D${v} ${note}`, w);
    if (vd.exaltedWith.length) {
      add(
        `D${v} with exalted ${vd.exaltedWith.join(', ')}`,
        MONEY_WEIGHTS.exaltedCoTenant[v]
      );
    }
  });

  if (kendraBenefics.length) {
    const raw =
      MONEY_WEIGHTS.kendraBeneficFirst +
      (kendraBenefics.length - 1) * MONEY_WEIGHTS.kendraBeneficEach;
    add(
      `${kendraBenefics.join(', ')} in kendra from ${karaka}`,
      Math.min(raw, MONEY_WEIGHTS.kendraBeneficCap)
    );
  } else if (aspectingBenefics.length) {
    add(
      `no benefic kendra; aspected by ${aspectingBenefics.join(', ')}`,
      Math.min(
        aspectingBenefics.length * MONEY_WEIGHTS.aspectBeneficEach,
        MONEY_WEIGHTS.aspectBeneficCap
      )
    );
  } else {
    parts.push({ label: 'no benefic kendra and no benefic aspect', value: 0 });
  }

  if (kartari === 'papa') {
    add('Papa Kartari — hemmed by malefics', MONEY_WEIGHTS.papaKartari);
  }
  if (kartari === 'shubha') {
    add('Shubha Kartari — hemmed by benefics', MONEY_WEIGHTS.shubhaKartari);
  }
  if (withNodes.length) {
    parts.push({
      label: `with ${withNodes.join('/')} — Pan-India / broad reach`,
      value: MONEY_WEIGHTS.nodeConjunct,
    });
  }

  const score = parts.reduce((s, p) => s + p.value, 0);

  return {
    trackId,
    title,
    refSign,
    refSignName: RASHI_META[refSign].en,
    houseTaken,
    useTenth,
    nodeOnRef,
    lordSign,
    lordSignName: RASHI_META[lordSign].en,
    karaka,
    d1Sign,
    vargas,
    morningD60Sign,
    morningD60Dignity,
    morningFlop,
    kendraBenefics,
    aspectingBenefics,
    kartari,
    withNodes,
    parts,
    score,
  };
}

// ---------- Predictive Wealth Accumulation Cycles ----------
export interface DashaWealthWindow {
  mahadasha: PlanetName;
  antardasha: PlanetName;
  startStr: string;
  endStr: string;
  isCurrent: boolean;
  wealthScore: number;
  rating: 'Peak Accumulation' | 'Strong Growth' | 'Steady / Neutral' | 'Caution / Consolidation';
  reasons: string[];
}

export interface TransitWealthForecast {
  year: number;
  half: 'H1 (Jan–Jun)' | 'H2 (Jul–Dec)';
  dateLabel: string;
  jupSign: number;
  jupSignName: string;
  satSign: number;
  satSignName: string;
  rahuSign: number;
  ketuSign: number;
  jupFromKarakaA: number;
  satFromKarakaA: number;
  jupFromNameSign: number;
  satFromNameSign: number;
  score: number;
  outlook: 'High-Yield Window' | 'Supportive Expansion' | 'Balanced' | 'Kantaka / Caution';
  signals: { text: string; tone: 'good' | 'bad' | 'neutral' }[];
}

export interface MoneyYogaRead {
  sunTrack: MoneyTrackResult;
  nameTrack: MoneyTrackResult;
  combinedScore: number;
  morningFlop: boolean;
  band: WealthBand;
  panIndiaReach: boolean;
  dashas: MahadashaPeriod[];
  wealthDashaWindows: DashaWealthWindow[];
  transitForecasts: TransitWealthForecast[];
}

function scorePlanetForWealth(
  p: PlanetName,
  sunTrack: MoneyTrackResult,
  nameTrack: MoneyTrackResult,
  planets: Record<PlanetName | 'Lagna', number>
): { pts: number; reasons: string[] } {
  let pts = 0;
  const reasons: string[] = [];

  if (p === sunTrack.karaka) {
    pts += 3;
    reasons.push(`Track A ${sunTrack.houseTaken}th Lord (${p})`);
  }
  if (p === nameTrack.karaka) {
    pts += 2.5;
    reasons.push(`Track B Name 4th Lord (${p})`);
  }
  if (sunTrack.kendraBenefics.includes(p)) {
    pts += 1.5;
    reasons.push(`Benefic in Kendra from ${sunTrack.karaka}`);
  }
  if (sunTrack.aspectingBenefics.includes(p)) {
    pts += 1;
    reasons.push(`Benefic aspecting ${sunTrack.karaka}`);
  }
  const dispA = SIGN_LORDS[sunTrack.d1Sign];
  if (p === dispA && p !== sunTrack.karaka) {
    pts += 1.5;
    reasons.push(`Dispositor of ${sunTrack.karaka}`);
  }
  const dig = dignityOf(p, planets[p]);
  if (dig === 'exalted') {
    pts += 1.5;
    reasons.push(`Natally Exalted in D1`);
  } else if (dig === 'debilitated') {
    const nb = neechaBhanga(p, rashiOf(planets[p]), planets[p], planets, sunTrack.refSign);
    if (nb.length === 0) {
      pts += 1;
      reasons.push(`Un-cancelled D1 debilitation (Money Yoga extreme)`);
    } else {
      pts -= 1;
      reasons.push(`Cancelled debilitation (Neecha Bhanga)`);
    }
  } else if (dig === 'own' || dig === 'moolatrikona') {
    pts += 1;
    reasons.push(`Own/Moolatrikona dignity`);
  }

  return { pts, reasons };
}

export function computeMoneyYogaRead(
  dateStr: string,
  place: CityLocation,
  birthUtcDate: Date,
  planets: Record<PlanetName | 'Lagna', number>,
  kp: KatapayadiAnalysis
): MoneyYogaRead {
  // Morning show reference 09:15 at birth date & location
  const morningUtc = localDateTimeToUtc(dateStr, '09:15', place.zone);
  const morningPlanets = computePlanetsAtDate(morningUtc, place.lat, place.lon).longitudes;

  const sunSign = rashiOf(planets.Sun);
  const sunTrack = computeMoneyTrack(
    'A',
    'Track A — From Natal Sun',
    sunSign,
    true,
    planets,
    morningPlanets
  );
  const nameTrack = computeMoneyTrack(
    'B',
    'Track B — From Kaṭapayādi Name Sign',
    kp.signIdx,
    false,
    planets,
    morningPlanets
  );

  const combinedScore =
    MONEY_WEIGHTS.trackSun * sunTrack.score +
    MONEY_WEIGHTS.trackName * nameTrack.score;

  const morningFlop = sunTrack.morningFlop || nameTrack.morningFlop;
  const band = morningFlop
    ? MONEY_BANDS.find((b) => b.label === 'Flop')!
    : bandForScore(combinedScore);

  // Vimshottari Dashas & Wealth Windows
  const dashas = computeVimshottariDashas(planets.Moon, birthUtcDate);
  const wealthDashaWindows: DashaWealthWindow[] = [];

  dashas.forEach((md) => {
    const mEval = scorePlanetForWealth(md.lord, sunTrack, nameTrack, planets);
    md.antardashas.forEach((ad) => {
      const aEval = scorePlanetForWealth(ad.lord, sunTrack, nameTrack, planets);
      const totalPts = +(mEval.pts * 0.65 + aEval.pts * 0.55).toFixed(2);
      const combinedReasons = Array.from(new Set([...mEval.reasons, ...aEval.reasons]));
      let rating: DashaWealthWindow['rating'] = 'Steady / Neutral';
      if (totalPts >= 2.8) rating = 'Peak Accumulation';
      else if (totalPts >= 1.4) rating = 'Strong Growth';
      else if (totalPts < 0) rating = 'Caution / Consolidation';

      wealthDashaWindows.push({
        mahadasha: md.lord,
        antardasha: ad.lord,
        startStr: ad.startStr,
        endStr: ad.endStr,
        isCurrent: ad.isCurrent,
        wealthScore: totalPts,
        rating,
        reasons: combinedReasons.length
          ? combinedReasons
          : [`General period of ${md.lord}–${ad.lord}`],
      });
    });
  });

  // 12-Year Semi-Annual Jupiter & Saturn Transit Forecast (2025–2036)
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(2024, currentYear - 1);
  const transitForecasts: TransitWealthForecast[] = [];

  for (let y = startYear; y < startYear + 8; y++) {
    for (const half of ['H1', 'H2'] as const) {
      const sampleUtc = new Date(Date.UTC(y, half === 'H1' ? 2 : 8, 15, 6, 0, 0));
      const tPos = computePlanetsAtDate(sampleUtc, place.lat, place.lon).longitudes;
      const jupSign = rashiOf(tPos.Jupiter);
      const satSign = rashiOf(tPos.Saturn);
      const rahuSign = rashiOf(tPos.Rahu);
      const ketuSign = rashiOf(tPos.Ketu);

      const jupFromKarakaA = getRelativeHouse(jupSign, sunTrack.d1Sign);
      const satFromKarakaA = getRelativeHouse(satSign, sunTrack.d1Sign);
      const jupFromNameSign = getRelativeHouse(jupSign, kp.signIdx);
      const satFromNameSign = getRelativeHouse(satSign, kp.signIdx);
      const rahuFromNameSign = getRelativeHouse(rahuSign, kp.signIdx);
      const ketuFromNameSign = getRelativeHouse(ketuSign, kp.signIdx);

      let score = 0;
      const signals: { text: string; tone: 'good' | 'bad' | 'neutral' }[] = [];

      // Jupiter from Track A 4th Lord
      if ([1, 4, 7, 10].includes(jupFromKarakaA)) {
        score += 3;
        signals.push({
          text: `Jupiter in Kendra (H${jupFromKarakaA}) from ${sunTrack.karaka} — wealth stability`,
          tone: 'good',
        });
      } else if ([5, 9, 2, 11].includes(jupFromKarakaA)) {
        score += 2;
        signals.push({
          text: `Jupiter in H${jupFromKarakaA} from ${sunTrack.karaka} — financial gains`,
          tone: 'good',
        });
      } else if ([3, 6, 12].includes(jupFromKarakaA)) {
        score -= 1;
        signals.push({
          text: `Jupiter in H${jupFromKarakaA} from ${sunTrack.karaka} — low support`,
          tone: 'bad',
        });
      }

      // Saturn from Track A 4th Lord
      if ([3, 6].includes(satFromKarakaA)) {
        score += 2;
        signals.push({
          text: `Saturn in Upachaya (H${satFromKarakaA}) from ${sunTrack.karaka} — competitors suppressed`,
          tone: 'good',
        });
      } else if ([1, 4, 8, 10].includes(satFromKarakaA)) {
        score -= 2.5;
        signals.push({
          text: `Kantaka Śani (H${satFromKarakaA}) from ${sunTrack.karaka} — career/liquidity pressure`,
          tone: 'bad',
        });
      }

      // Jupiter & Saturn from Name Sign (Katapayadi Gochara)
      if ([1, 4, 7, 10].includes(jupFromNameSign)) {
        score += 1.5;
        signals.push({
          text: `Jupiter in Kendra (H${jupFromNameSign}) from Name Rāśi ${kp.rashi.en}`,
          tone: 'good',
        });
      }
      if ([1, 4, 8, 10].includes(satFromNameSign)) {
        score -= 1.5;
        signals.push({
          text: `Kantaka Śani (H${satFromNameSign}) from Name Rāśi ${kp.rashi.en}`,
          tone: 'bad',
        });
      }
      if ([1, 5, 9].includes(rahuFromNameSign)) {
        score += 1.5;
        signals.push({
          text: `Rāhu in Trine (H${rahuFromNameSign}) from Name Rāśi — wealth surge`,
          tone: 'good',
        });
      }
      if ([1, 5, 9].includes(ketuFromNameSign)) {
        score -= 1;
        signals.push({
          text: `Ketu in Trine (H${ketuFromNameSign}) from Name Rāśi — detachment/outflow`,
          tone: 'neutral',
        });
      }

      let outlook: TransitWealthForecast['outlook'] = 'Balanced';
      if (score >= 3.5) outlook = 'High-Yield Window';
      else if (score >= 1.5) outlook = 'Supportive Expansion';
      else if (score <= -1.5) outlook = 'Kantaka / Caution';

      transitForecasts.push({
        year: y,
        half: half === 'H1' ? 'H1 (Jan–Jun)' : 'H2 (Jul–Dec)',
        dateLabel: `${y} ${half === 'H1' ? 'Jan–Jun' : 'Jul–Dec'}`,
        jupSign,
        jupSignName: RASHI_META[jupSign].en,
        satSign,
        satSignName: RASHI_META[satSign].en,
        rahuSign,
        ketuSign,
        jupFromKarakaA,
        satFromKarakaA,
        jupFromNameSign,
        satFromNameSign,
        score: +score.toFixed(1),
        outlook,
        signals: signals.length
          ? signals
          : [{ text: 'Neutral transit posture across karaka & name sign', tone: 'neutral' }],
      });
    }
  }

  return {
    sunTrack,
    nameTrack,
    combinedScore: +combinedScore.toFixed(2),
    morningFlop,
    band,
    panIndiaReach: sunTrack.withNodes.length > 0 || nameTrack.withNodes.length > 0,
    dashas,
    wealthDashaWindows,
    transitForecasts,
  };
}
