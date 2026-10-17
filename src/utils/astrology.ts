import * as Astronomy from 'astronomy-engine';
import {
  ALL9,
  MASA_NAMES,
  NAKSHATRA_LORDS,
  NAKSHATRA_NAMES,
  PLANET_SHORT,
  RASHI_META,
  RITU_NAMES,
  SIGN_LORDS,
  TITHI_META,
  VARA_META,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_YEARS,
  YOGA27_NAMES,
  type CityLocation,
  type PlanetName,
} from './constants.ts';

const DAY_MS = 86400000;
const MIN_MS = 60000;

export const norm360 = (x: number): number => ((x % 360) + 360) % 360;

export function rashiOf(lon: number): number {
  return Math.floor(norm360(lon) / 30);
}

export function degInSign(lon: number): number {
  return norm360(lon) % 30;
}

export function formatDegMin(lon: number): string {
  const d = degInSign(lon);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, '0')}′`;
}

/**
 * Navamsa (D9), Parashara reckoning:
 * Movable signs (0,3,6,9) start from same sign;
 * Fixed signs (1,4,7,10) start from 9th from sign;
 * Dual signs (2,5,8,11) start from 5th from sign.
 */
export function navamsaRashi(lon: number): number {
  const r = rashiOf(lon);
  const dInR = degInSign(lon);
  const part = Math.floor(dInR / (30 / 9));
  const navStart = r % 3 === 0 ? r : r % 3 === 1 ? (r + 8) % 12 : (r + 4) % 12;
  return (navStart + part) % 12;
}

/**
 * Dasamsa (D10), Parashara standard:
 * Each 30° sign is divided into 10 parts of 3° each.
 * Odd signs (Aries=0, Gemini=2, Leo=4, Libra=6, Sagittarius=8, Aquarius=10 -> r % 2 === 0 in 0-indexed)
 * start from the sign itself.
 * Even signs (Taurus=1, Cancer=3, Virgo=5, Scorpio=7, Capricorn=9, Pisces=11 -> r % 2 === 1 in 0-indexed)
 * start from the 9th sign from it ((r + 8) % 12).
 */
export function dasamsaRashi(lon: number): number {
  const r = rashiOf(lon);
  const dInR = degInSign(lon);
  const part = Math.min(9, Math.floor(dInR / 3));
  const startSign = r % 2 === 0 ? r : (r + 8) % 12;
  return (startSign + part) % 12;
}

/**
 * Shashtiamsa (D60), Parashara reckoning:
 * Each sign splits into 60 half-degree (0.5°) parts, counting forward from the sign itself.
 */
export function shashtiamsaRashi(lon: number): number {
  const r = rashiOf(lon);
  const dInR = degInSign(lon);
  return (r + Math.min(59, Math.floor(dInR / 0.5))) % 12;
}

export type VargaNumber = 1 | 9 | 10 | 60;

export function vargaSign(lon: number, varga: VargaNumber): number {
  if (varga === 9) return navamsaRashi(lon);
  if (varga === 10) return dasamsaRashi(lon);
  if (varga === 60) return shashtiamsaRashi(lon);
  return rashiOf(lon);
}

/**
 * True Lahiri (Chitrapaksha) Ayanamsa with nutation in longitude.
 */
export function getLahiriAyanamsa(date: Date): number {
  const time = new Astronomy.AstroTime(date);
  const T = time.ut / 36525.0;
  let ayan = 23.85944 + (5029.0966 * T + 1.111135 * T * T + 0.0000006 * T * T * T) / 3600.0;
  const tilt = Astronomy.e_tilt(time);
  const dpsi = tilt.dpsi;
  const eps = tilt.tobl;
  ayan += (dpsi * Math.cos((eps * Math.PI) / 180)) / 3600.0;
  return ayan;
}

export function getRahuLongitude(date: Date, ayanamsa: number): number {
  const time = new Astronomy.AstroTime(date);
  const T = time.ut / 36525.0;
  const omegaTrop = norm360(
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 450000.0
  );
  return norm360(omegaTrop - ayanamsa);
}

export function getAscendant(date: Date, lat: number, lon: number, ayanamsa: number): number {
  const clampedLat = Math.abs(lat) >= 90 ? (lat > 0 ? 89.99 : -89.99) : lat;
  const time = new Astronomy.AstroTime(date);
  const gmst = Astronomy.SiderealTime(time);
  let lst = (gmst * 15 + lon) % 360;
  if (lst < 0) lst += 360;
  const tilt = Astronomy.e_tilt(time);
  const eps = tilt.tobl;
  const rad = Math.PI / 180;
  const lstRad = lst * rad;
  const epsRad = eps * rad;
  const latRad = clampedLat * rad;
  const y = Math.cos(lstRad);
  const x = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascTropDeg = norm360(Math.atan2(y, x) / rad);
  return norm360(ascTropDeg - ayanamsa);
}

// ---------- Dignity & Relationships ----------
export type DignityKind =
  | 'exalted'
  | 'moolatrikona'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

export const EXALTATION: Record<PlanetName, { sign: number; deg: number }> = {
  Sun: { sign: 0, deg: 10 },
  Moon: { sign: 1, deg: 3 },
  Mars: { sign: 9, deg: 28 },
  Mercury: { sign: 5, deg: 15 },
  Jupiter: { sign: 3, deg: 5 },
  Venus: { sign: 11, deg: 27 },
  Saturn: { sign: 6, deg: 20 },
  Rahu: { sign: 1, deg: 20 },
  Ketu: { sign: 7, deg: 20 },
};

export const DEBILITATION_SIGN: Record<PlanetName, number> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
  Rahu: 7,
  Ketu: 1,
};

export const EXALTED_IN_SIGN: Partial<Record<number, PlanetName>> = {
  0: 'Sun',
  1: 'Moon', // Moon primary exaltation in Taurus
  3: 'Jupiter',
  5: 'Mercury',
  6: 'Saturn',
  7: 'Ketu',
  9: 'Mars',
  11: 'Venus',
};

export const OWN_SIGNS: Record<PlanetName, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
  Rahu: [10],
  Ketu: [7],
};

export const MOOLATRIKONA: Partial<Record<PlanetName, { sign: number; from: number; to: number }>> = {
  Sun: { sign: 4, from: 0, to: 20 },
  Moon: { sign: 1, from: 4, to: 30 },
  Mars: { sign: 0, from: 0, to: 12 },
  Mercury: { sign: 5, from: 16, to: 20 },
  Jupiter: { sign: 8, from: 0, to: 10 },
  Venus: { sign: 6, from: 0, to: 15 },
  Saturn: { sign: 10, from: 0, to: 20 },
};

export const NATURAL_FRIENDS: Record<PlanetName, PlanetName[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
  Rahu: ['Venus', 'Saturn', 'Mercury'],
  Ketu: ['Mars', 'Venus', 'Saturn'],
};

export const NATURAL_ENEMIES: Record<PlanetName, PlanetName[]> = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
  Rahu: ['Sun', 'Moon', 'Mars'],
  Ketu: ['Sun', 'Moon'],
};

export const DIGNITY_LABEL: Record<DignityKind, string> = {
  exalted: 'Exalted',
  moolatrikona: 'Moolatrikona',
  own: 'Own sign',
  friend: 'Friend',
  neutral: 'Neutral',
  enemy: 'Enemy',
  debilitated: 'Debilitated',
};

export function dignityInSign(planet: PlanetName, sign: number): DignityKind {
  if (sign === EXALTATION[planet].sign) return 'exalted';
  if (sign === DEBILITATION_SIGN[planet]) return 'debilitated';
  if (OWN_SIGNS[planet].includes(sign)) return 'own';
  const lord = SIGN_LORDS[sign];
  if (lord === planet) return 'own';
  if (NATURAL_FRIENDS[planet].includes(lord)) return 'friend';
  if (NATURAL_ENEMIES[planet].includes(lord)) return 'enemy';
  return 'neutral';
}

export function dignityOf(planet: PlanetName, lon: number): DignityKind {
  const sign = rashiOf(lon);
  const deg = degInSign(lon);
  const mt = MOOLATRIKONA[planet];
  if (mt && sign === mt.sign && deg >= mt.from && deg < mt.to) {
    return 'moolatrikona';
  }
  return dignityInSign(planet, sign);
}

export function getRelativeHouse(targetSign: number, sourceSign: number): number {
  return ((targetSign - sourceSign + 12) % 12) + 1;
}

export function arudhaOfHouse(planets: Record<PlanetName, number>, houseSign: number): number {
  const lord = SIGN_LORDS[houseSign];
  const lp = rashiOf(planets[lord]);
  const diff = ((lp - houseSign) % 12 + 12) % 12;
  let arudha = (lp + diff) % 12;
  if (arudha === houseSign || arudha === (houseSign + 6) % 12) {
    arudha = (arudha + 9) % 12;
  }
  return arudha;
}

// ---------- Timezone & Date Conversion Helpers ----------
const fmtCache: Record<string, Intl.DateTimeFormat> = {};

export function tzOffsetMinutes(zone: string, date: Date): number {
  try {
    const f =
      fmtCache[zone] ||
      (fmtCache[zone] = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }));
    const p: Record<string, string> = {};
    f.formatToParts(date).forEach((x) => {
      p[x.type] = x.value;
    });
    const asUTC = Date.UTC(
      +p.year,
      +p.month - 1,
      +p.day,
      +p.hour % 24,
      +p.minute,
      +p.second
    );
    return Math.round((asUTC - date.getTime()) / MIN_MS);
  } catch {
    return 330; // fallback IST +5:30
  }
}

export function localDateTimeToUtc(dateStr: string, timeStr: string, zone: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = (timeStr || '09:00').split(':').map(Number);
  const utcWall = Date.UTC(y || 2000, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
  let guess = new Date(utcWall);
  for (let i = 0; i < 2; i++) {
    const off = tzOffsetMinutes(zone, guess);
    guess = new Date(utcWall - off * MIN_MS);
  }
  return guess;
}

export function formatLocalTime(date: Date | null, zone: string, baseDateKey?: string): string {
  if (!date) return '—';
  const off = tzOffsetMinutes(zone, date);
  const local = new Date(date.getTime() + off * MIN_MS + 30000); // round to nearest minute
  const hh = String(local.getUTCHours()).padStart(2, '0');
  const mm = String(local.getUTCMinutes()).padStart(2, '0');
  const key = local.toISOString().slice(0, 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!baseDateKey || key === baseDateKey) {
    return `${hh}:${mm}`;
  }
  return `${hh}:${mm} (${local.getUTCDate()} ${months[local.getUTCMonth()]})`;
}

// ---------- Detailed Planet & Chart Data ----------
export interface PlanetPosition {
  name: PlanetName | 'Lagna';
  short: string;
  lon: number;
  degFormatted: string;
  retro: boolean;
  nakshatraIdx: number;
  nakshatraName: string;
  nakshatraLord: PlanetName;
  pada: number;
  d1Sign: number;
  d9Sign: number;
  d10Sign: number;
  d60Sign: number;
  d1Dignity: DignityKind | null;
  d9Dignity: DignityKind | null;
  d10Dignity: DignityKind | null;
  d60Dignity: DignityKind | null;
}

export interface PanchangaSpan {
  index: number;
  name: string;
  subLabel?: string;
  end: Date;
  endFormatted: string;
}

export interface DailyPeriodWindow {
  name: string;
  good: boolean;
  start: Date;
  end: Date;
  formatted: string;
}

export interface PanchangaDetails {
  dateKey: string;
  vara: { dow: number; en: string; sanskrit: string; lord: string };
  masa: { index: number; amantaName: string; purnimantaName: string; adhika: boolean; ritu: string };
  paksha: 'S' | 'K';
  pakshaLabel: string;
  tithiAtBirth: {
    n: number; // 1..30
    pn: number; // 1..15 or 30
    name: string;
    devata: string;
    cls: string;
    lord: string;
    phaseDeg: number;
  };
  tithiSpans: PanchangaSpan[];
  nakshatraSpans: PanchangaSpan[];
  yogaSpans: PanchangaSpan[];
  karanaSpans: PanchangaSpan[];
  sunrise: Date;
  sunset: Date;
  moonrise: Date | null;
  moonset: Date | null;
  sunriseFormatted: string;
  sunsetFormatted: string;
  moonriseFormatted: string;
  moonsetFormatted: string;
  sunSignIdx: number;
  moonSignIdx: number;
  periods: DailyPeriodWindow[];
  arudhas: {
    alSign: number;
    a5Sign: number;
    a10Sign: number;
  };
}

export interface AstrologicalChartSnapshot {
  utcDate: Date;
  dateStr: string;
  timeStr: string;
  place: CityLocation;
  ayanamsa: number;
  rawLongitudes: Record<PlanetName | 'Lagna', number>;
  planets: PlanetPosition[];
  panchanga: PanchangaDetails;
}

const KARANA7 = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti (Bhadra)'];
export function getKaranaName(k: number): string {
  if (k === 0) return 'Kimstughna';
  if (k <= 56) return KARANA7[(k - 1) % 7];
  return ['Shakuni', 'Chatushpada', 'Naga'][k - 57] || 'Kimstughna';
}

const RAHU_SEG = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SEG = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEG = [7, 6, 5, 4, 3, 2, 1];

function spanEnd(
  f: (d: Date) => number,
  unit: number,
  ratePerDay: number,
  t0: Date
): { idx: number; end: Date } {
  const idx = Math.floor(f(t0) / unit);
  const target = ((idx + 1) * unit) % 360;
  let t = t0;
  for (let i = 0; i < 5; i++) {
    let d = norm360(target - f(t));
    if (d > 180) d -= 360;
    if (i === 0 && d <= 0) d += unit;
    t = new Date(t.getTime() + (d / ratePerDay) * DAY_MS);
  }
  return { idx, end: t };
}

function computeSpans(
  f: (d: Date) => number,
  unit: number,
  ratePerDay: number,
  a: Date,
  b: Date,
  maxCount = 4
): { idx: number; start: Date; end: Date }[] {
  const out: { idx: number; start: Date; end: Date }[] = [];
  let t = a;
  for (let i = 0; i < maxCount && t < b; i++) {
    const s = spanEnd(f, unit, ratePerDay, t);
    out.push({ idx: s.idx, start: t, end: s.end });
    t = new Date(s.end.getTime() + 1000);
  }
  return out;
}

export function computePlanetsAtDate(
  utcDate: Date,
  lat: number,
  lon: number
): {
  ayanamsa: number;
  longitudes: Record<PlanetName | 'Lagna', number>;
  retrogrades: Record<PlanetName | 'Lagna', boolean>;
} {
  const ayanamsa = getLahiriAyanamsa(utcDate);
  const time = new Astronomy.AstroTime(utcDate);
  const timeNext = new Astronomy.AstroTime(new Date(utcDate.getTime() + 3600000));

  const getBodyLon = (b: PlanetName, t: Astronomy.AstroTime): number => {
    if (b === 'Moon') {
      return norm360(Astronomy.EclipticGeoMoon(t).lon - ayanamsa);
    }
    const body = Astronomy.Body[b as keyof typeof Astronomy.Body];
    const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(body, t, true));
    return norm360(ecl.elon - ayanamsa);
  };

  const rahuLon = getRahuLongitude(utcDate, ayanamsa);
  const ketuLon = norm360(rahuLon + 180);
  const lagnaLon = getAscendant(utcDate, lat, lon, ayanamsa);

  const longitudes: Record<PlanetName | 'Lagna', number> = {
    Lagna: lagnaLon,
    Sun: getBodyLon('Sun', time),
    Moon: getBodyLon('Moon', time),
    Mars: getBodyLon('Mars', time),
    Mercury: getBodyLon('Mercury', time),
    Jupiter: getBodyLon('Jupiter', time),
    Venus: getBodyLon('Venus', time),
    Saturn: getBodyLon('Saturn', time),
    Rahu: rahuLon,
    Ketu: ketuLon,
  };

  const retrogrades: Record<PlanetName | 'Lagna', boolean> = {
    Lagna: false,
    Sun: false,
    Moon: false,
    Mars: false,
    Mercury: false,
    Jupiter: false,
    Venus: false,
    Saturn: false,
    Rahu: true,
    Ketu: true,
  };

  (['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as PlanetName[]).forEach((b) => {
    let diff = getBodyLon(b, timeNext) - longitudes[b];
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    retrogrades[b] = diff < 0;
  });

  return { ayanamsa, longitudes, retrogrades };
}

export function computeChartSnapshot(
  dateStr: string,
  timeStr: string,
  place: CityLocation
): AstrologicalChartSnapshot {
  const utcDate = localDateTimeToUtc(dateStr, timeStr, place.zone);
  const { ayanamsa, longitudes, retrogrades } = computePlanetsAtDate(
    utcDate,
    place.lat,
    place.lon
  );

  const buildPlanetPos = (name: PlanetName | 'Lagna'): PlanetPosition => {
    const lon = longitudes[name];
    const nakSpan = 360 / 27;
    const nakIdx = Math.floor(lon / nakSpan);
    const pada = Math.min(4, Math.floor((lon % nakSpan) / (nakSpan / 4)) + 1);
    const d1Sign = rashiOf(lon);
    const d9Sign = navamsaRashi(lon);
    const d10Sign = dasamsaRashi(lon);
    const d60Sign = shashtiamsaRashi(lon);
    const isPlanet = name !== 'Lagna';

    return {
      name,
      short: PLANET_SHORT[name],
      lon,
      degFormatted: formatDegMin(lon),
      retro: retrogrades[name],
      nakshatraIdx: nakIdx,
      nakshatraName: NAKSHATRA_NAMES[nakIdx],
      nakshatraLord: NAKSHATRA_LORDS[nakIdx],
      pada,
      d1Sign,
      d9Sign,
      d10Sign,
      d60Sign,
      d1Dignity: isPlanet ? dignityOf(name, lon) : null,
      d9Dignity: isPlanet ? dignityInSign(name, d9Sign) : null,
      d10Dignity: isPlanet ? dignityInSign(name, d10Sign) : null,
      d60Dignity: isPlanet ? dignityInSign(name, d60Sign) : null,
    };
  };

  const planets: PlanetPosition[] = [
    buildPlanetPos('Lagna'),
    ...ALL9.map((p) => buildPlanetPos(p)),
  ];

  // ---------- Panchanga Calculation ----------
  const localMidnight = localDateTimeToUtc(dateStr, '00:00', place.zone);
  const obs = new Astronomy.Observer(place.lat, place.lon, 0);
  const riseRes = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, +1, localMidnight, 1);
  const sunrise = riseRes ? riseRes.date : new Date(localMidnight.getTime() + 6 * 3600000);
  const setRes = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, sunrise, 1);
  const sunset = setRes ? setRes.date : new Date(sunrise.getTime() + 12 * 3600000);
  const nextSunrise = new Date(sunrise.getTime() + DAY_MS);

  const mrRes = Astronomy.SearchRiseSet(Astronomy.Body.Moon, obs, +1, localMidnight, 1);
  const msRes = Astronomy.SearchRiseSet(Astronomy.Body.Moon, obs, -1, localMidnight, 1);

  const sunSidAt = (d: Date) => norm360(Astronomy.SunPosition(d).elon - getLahiriAyanamsa(d));
  const moonSidAt = (d: Date) => norm360(Astronomy.EclipticGeoMoon(d).lon - getLahiriAyanamsa(d));
  const elongAt = (d: Date) => norm360(Astronomy.EclipticGeoMoon(d).lon - Astronomy.SunPosition(d).elon);

  // Tithi at birth instant
  const birthElong = elongAt(utcDate);
  const tithiNum = Math.floor(birthElong / 12) + 1; // 1..30
  const paksha: 'S' | 'K' = tithiNum <= 15 ? 'S' : 'K';
  const pn = tithiNum <= 15 ? tithiNum : tithiNum === 30 ? 30 : tithiNum - 15;
  const tMeta = TITHI_META[pn];

  // Determine Amanta Lunar Masa from previous and next New Moons
  const prevNm = Astronomy.SearchMoonPhase(0, utcDate, -35);
  const nextNm = Astronomy.SearchMoonPhase(0, utcDate, 35);
  const startSunSign = prevNm ? Math.floor(sunSidAt(prevNm.date) / 30) : Math.floor(longitudes.Sun / 30);
  const endSunSign = nextNm ? Math.floor(sunSidAt(nextNm.date) / 30) : (startSunSign + 1) % 12;
  const adhika = prevNm && nextNm ? startSunSign === endSunSign : false;
  const amantaIdx = (startSunSign + 1) % 12;
  const purnimantaIdx = paksha === 'K' ? (amantaIdx + 1) % 12 : amantaIdx;

  // Spans across the civil day (sunrise to nextSunrise)
  const rawTithis = computeSpans(elongAt, 12, 12.19, sunrise, nextSunrise);
  const tithiSpans: PanchangaSpan[] = rawTithis.map((s) => {
    const k = (s.idx % 30) + 1;
    const pk = k <= 15 ? 'Shukla' : 'Krishna';
    const pNum = k <= 15 ? k : k === 30 ? 30 : k - 15;
    return {
      index: k,
      name: `${pk} ${TITHI_META[pNum].name}`,
      subLabel: `${TITHI_META[pNum].devata} · ${TITHI_META[pNum].cls}`,
      end: s.end,
      endFormatted: formatLocalTime(s.end, place.zone, dateStr),
    };
  });

  const rawNaks = computeSpans(moonSidAt, 360 / 27, 13.2, sunrise, nextSunrise);
  const nakshatraSpans: PanchangaSpan[] = rawNaks.map((s) => {
    const idx = s.idx % 27;
    return {
      index: idx,
      name: NAKSHATRA_NAMES[idx],
      subLabel: `Lord: ${NAKSHATRA_LORDS[idx]}`,
      end: s.end,
      endFormatted: formatLocalTime(s.end, place.zone, dateStr),
    };
  });

  const rawYogas = computeSpans(
    (d) => norm360(sunSidAt(d) + moonSidAt(d)),
    360 / 27,
    14.2,
    sunrise,
    nextSunrise
  );
  const yogaSpans: PanchangaSpan[] = rawYogas.map((s) => {
    const idx = s.idx % 27;
    return {
      index: idx,
      name: YOGA27_NAMES[idx],
      subLabel: idx === 16 || idx === 26 ? 'Avoid for new beginnings' : 'Nitya Yoga',
      end: s.end,
      endFormatted: formatLocalTime(s.end, place.zone, dateStr),
    };
  });

  const rawKaranas = computeSpans(elongAt, 6, 12.19, sunrise, nextSunrise);
  const karanaSpans: PanchangaSpan[] = rawKaranas.map((s) => {
    const idx = s.idx % 60;
    const kName = getKaranaName(idx);
    return {
      index: idx,
      name: kName,
      subLabel: kName.includes('Vishti') ? 'Bhadra — avoid for beginnings' : 'Half-tithi karana',
      end: s.end,
      endFormatted: formatLocalTime(s.end, place.zone, dateStr),
    };
  });

  // Weekday (Vara)
  const [yy, mm, dd] = dateStr.split('-').map(Number);
  const dow = new Date(Date.UTC(yy || 2000, (mm || 1) - 1, dd || 1)).getUTCDay();
  const vara = VARA_META[dow];

  // Daily Muhurta & Rahu/Yama/Gulika windows
  const dayLen = sunset.getTime() - sunrise.getTime();
  const seg = (n: number): [Date, Date] => [
    new Date(sunrise.getTime() + ((n - 1) * dayLen) / 8),
    new Date(sunrise.getTime() + (n * dayLen) / 8),
  ];

  const makePeriod = (name: string, good: boolean, [a, b]: [Date, Date]): DailyPeriodWindow => ({
    name,
    good,
    start: a,
    end: b,
    formatted: `${formatLocalTime(a, place.zone, dateStr)} – ${formatLocalTime(b, place.zone, dateStr)}`,
  });

  const periods: DailyPeriodWindow[] = [
    makePeriod('Brahma Muhurta', true, [
      new Date(sunrise.getTime() - 96 * MIN_MS),
      new Date(sunrise.getTime() - 48 * MIN_MS),
    ]),
    makePeriod('Abhijit Muhurta', true, [
      new Date(sunrise.getTime() + (7 * dayLen) / 15),
      new Date(sunrise.getTime() + (8 * dayLen) / 15),
    ]),
    makePeriod('Rahu Kalam', false, seg(RAHU_SEG[dow])),
    makePeriod('Yamagandam', false, seg(YAMA_SEG[dow])),
    makePeriod('Gulika Kalam', false, seg(GULIKA_SEG[dow])),
  ];

  const lagnaSign = rashiOf(longitudes.Lagna);
  const planetRecord = longitudes as Record<PlanetName, number>;
  const alSign = arudhaOfHouse(planetRecord, lagnaSign);
  const a5Sign = arudhaOfHouse(planetRecord, (lagnaSign + 4) % 12);
  const a10Sign = arudhaOfHouse(planetRecord, (lagnaSign + 9) % 12);

  return {
    utcDate,
    dateStr,
    timeStr,
    place,
    ayanamsa,
    rawLongitudes: longitudes,
    planets,
    panchanga: {
      dateKey: dateStr,
      vara,
      masa: {
        index: amantaIdx,
        amantaName: (adhika ? 'Adhika ' : '') + MASA_NAMES[amantaIdx],
        purnimantaName: (adhika ? 'Adhika ' : '') + MASA_NAMES[purnimantaIdx],
        adhika,
        ritu: RITU_NAMES[amantaIdx],
      },
      paksha,
      pakshaLabel: paksha === 'S' ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)',
      tithiAtBirth: {
        n: tithiNum,
        pn,
        name: `${paksha === 'S' ? 'Shukla' : 'Krishna'} ${tMeta.name}`,
        devata: tMeta.devata,
        cls: tMeta.cls,
        lord: tMeta.lord,
        phaseDeg: birthElong,
      },
      tithiSpans,
      nakshatraSpans,
      yogaSpans,
      karanaSpans,
      sunrise,
      sunset,
      moonrise: mrRes ? mrRes.date : null,
      moonset: msRes ? msRes.date : null,
      sunriseFormatted: formatLocalTime(sunrise, place.zone, dateStr),
      sunsetFormatted: formatLocalTime(sunset, place.zone, dateStr),
      moonriseFormatted: formatLocalTime(mrRes ? mrRes.date : null, place.zone, dateStr),
      moonsetFormatted: formatLocalTime(msRes ? msRes.date : null, place.zone, dateStr),
      sunSignIdx: rashiOf(longitudes.Sun),
      moonSignIdx: rashiOf(longitudes.Moon),
      periods,
      arudhas: {
        alSign,
        a5Sign,
        a10Sign,
      },
    },
  };
}

// ---------- Vimshottari Dasha Calculation ----------
export interface AntardashaPeriod {
  lord: PlanetName;
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  isCurrent: boolean;
}

export interface MahadashaPeriod {
  lord: PlanetName;
  years: number;
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  isCurrent: boolean;
  antardashas: AntardashaPeriod[];
}

export function computeVimshottariDashas(
  moonLon: number,
  birthUtcDate: Date,
  referenceNow = new Date()
): MahadashaPeriod[] {
  const nakSpan = 360 / 27; // 13.333333°
  const nakIdx = Math.floor(norm360(moonLon) / nakSpan);
  const fractionElapsed = (norm360(moonLon) % nakSpan) / nakSpan;
  const fractionRemaining = 1 - fractionElapsed;

  const startLord = NAKSHATRA_LORDS[nakIdx];
  const startOrderIdx = VIMSHOTTARI_ORDER.indexOf(startLord);

  const SOLAR_YEAR_MS = 365.2425 * DAY_MS;
  const firstTotalYears = VIMSHOTTARI_YEARS[startLord];
  // Backdate the theoretical start of the first Mahadasha so its Antardashas align accurately
  let cursorMs =
    birthUtcDate.getTime() - fractionElapsed * firstTotalYears * SOLAR_YEAR_MS;

  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
  const nowMs = referenceNow.getTime();

  const dashas: MahadashaPeriod[] = [];
  for (let i = 0; i < 9; i++) {
    const lord = VIMSHOTTARI_ORDER[(startOrderIdx + i) % 9];
    const years = VIMSHOTTARI_YEARS[lord];
    const mStart = new Date(cursorMs);
    const mEnd = new Date(cursorMs + years * SOLAR_YEAR_MS);

    const antardashas: AntardashaPeriod[] = [];
    let adCursorMs = cursorMs;
    const lordIdx = VIMSHOTTARI_ORDER.indexOf(lord);
    for (let j = 0; j < 9; j++) {
      const adLord = VIMSHOTTARI_ORDER[(lordIdx + j) % 9];
      const adYears = (years * VIMSHOTTARI_YEARS[adLord]) / 120;
      const adStart = new Date(adCursorMs);
      const adEnd = new Date(adCursorMs + adYears * SOLAR_YEAR_MS);
      if (adEnd.getTime() > birthUtcDate.getTime()) {
        const clampedStart =
          adStart.getTime() < birthUtcDate.getTime() ? birthUtcDate : adStart;
        antardashas.push({
          lord: adLord,
          start: clampedStart,
          end: adEnd,
          startStr: fmtDate(clampedStart),
          endStr: fmtDate(adEnd),
          isCurrent: nowMs >= clampedStart.getTime() && nowMs < adEnd.getTime(),
        });
      }
      adCursorMs = adEnd.getTime();
    }

    const effectiveStart =
      mStart.getTime() < birthUtcDate.getTime() ? birthUtcDate : mStart;
    dashas.push({
      lord,
      years: i === 0 ? +(years * fractionRemaining).toFixed(1) : years,
      start: effectiveStart,
      end: mEnd,
      startStr: fmtDate(effectiveStart),
      endStr: fmtDate(mEnd),
      isCurrent: nowMs >= effectiveStart.getTime() && nowMs < mEnd.getTime(),
      antardashas,
    });

    cursorMs = mEnd.getTime();
  }

  return dashas;
}
