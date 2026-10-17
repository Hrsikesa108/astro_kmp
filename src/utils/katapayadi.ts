import { RASHI_META, type RashiMeta } from './constants.ts';

export type ScriptTarget = 'deva' | 'tel';
export type InputMode = 'roman' | 'deva' | 'tel';

export interface KatapayadiUnit {
  syllable: string;
  value: number | null;
  type: 'vowel' | 'consonant' | 'half-dropped';
  chain?: string[];
  survivor?: string;
  overrideNote?: string;
}

export interface KatapayadiAnalysis {
  rawInput: string;
  scriptText: string;
  units: KatapayadiUnit[];
  valueUnits: KatapayadiUnit[];
  readingValues: number[];
  reversedValues: number[];
  numberString: string;
  rashiIndex: number; // 1..12
  signIdx: number; // 0..11 (defaults to 0 / Aries if empty)
  rashi: RashiMeta;
}

export const DEVA_CONS: Record<string, number> = {
  'क': 1, 'ख': 2, 'ग': 3, 'घ': 4, 'ङ': 5, 'च': 6, 'छ': 7, 'ज': 8, 'झ': 9, 'ञ': 0,
  'ट': 1, 'ठ': 2, 'ड': 3, 'ढ': 4, 'ण': 5, 'त': 6, 'थ': 7, 'द': 8, 'ध': 9, 'न': 0,
  'प': 1, 'फ': 2, 'ब': 3, 'भ': 4, 'म': 5, 'य': 1, 'र': 2, 'ल': 3, 'व': 4,
  'श': 5, 'ष': 6, 'स': 7, 'ह': 8, 'ळ': 3,
};

export const TEL_CONS: Record<string, number> = {
  'క': 1, 'ఖ': 2, 'గ': 3, 'ఘ': 4, 'ఙ': 5, 'చ': 6, 'ఛ': 7, 'జ': 8, 'ఝ': 9, 'ఞ': 0,
  'ట': 1, 'ఠ': 2, 'డ': 3, 'ఢ': 4, 'ణ': 5, 'త': 6, 'థ': 7, 'ద': 8, 'ధ': 9, 'న': 0,
  'ప': 1, 'ఫ': 2, 'బ': 3, 'భ': 4, 'మ': 5, 'య': 1, 'ర': 2, 'ల': 3, 'వ': 4,
  'శ': 5, 'ష': 6, 'స': 7, 'హ': 8, 'ళ': 3,
};

export const CONSONANT_VALUES: Record<string, number> = {
  ...DEVA_CONS,
  ...TEL_CONS,
};

const INDEPENDENT_VOWELS = new Set([
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ', 'ऍ', 'ऑ',
  'అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ౠ', 'ఌ', 'ౡ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ',
]);

const MATRAS = new Set([
  'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'ॄ', 'ॢ', 'ॣ', 'े', 'ै', 'ो', 'ौ', 'ॅ', 'ॉ',
  'ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ౄ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ౌ', 'ౢ', 'ౣ',
]);

const VIRAMAS = new Set(['्', '్']);
const MODIFIERS = new Set(['ं', 'ः', 'ँ', 'ऽ', 'ం', 'ః', 'ఁ']);
const RA_MATRAS = new Set(['ृ', 'ॄ', 'ృ', 'ౄ']);
const LA_MATRAS = new Set(['ॢ', 'ॣ', 'ౢ', 'ౣ']);
const NUKTA = '\u093C';

const ROMAN_CONSONANTS: [string, string, string][] = [
  ['chh', 'छ', 'ఛ'], ['kh', 'ख', 'ఖ'], ['gh', 'घ', 'ఘ'], ['ch', 'च', 'చ'], ['jh', 'झ', 'ఝ'], ['ny', 'ञ', 'ఞ'],
  ['Th', 'ठ', 'ఠ'], ['Dh', 'ढ', 'ఢ'], ['th', 'थ', 'థ'], ['dh', 'ध', 'ధ'], ['ph', 'फ', 'ఫ'], ['bh', 'भ', 'భ'],
  ['sh', 'श', 'శ'], ['Sh', 'ष', 'ష'], ['ng', 'ङ', 'ఙ'],
  ['k', 'क', 'క'], ['g', 'ग', 'గ'], ['j', 'ज', 'జ'], ['T', 'ट', 'ట'], ['D', 'ड', 'డ'], ['N', 'ण', 'ణ'],
  ['t', 'त', 'త'], ['d', 'द', 'ద'], ['n', 'न', 'న'], ['p', 'प', 'ప'], ['b', 'ब', 'బ'], ['m', 'म', 'మ'],
  ['y', 'य', 'య'], ['r', 'र', 'ర'], ['l', 'ल', 'ల'], ['v', 'व', 'వ'], ['w', 'व', 'వ'],
  ['s', 'स', 'స'], ['h', 'ह', 'హ'], ['L', 'ळ', 'ళ'],
];

const ROMAN_VOWELS: [string, string, string, string | null, string | null][] = [
  ['aa', 'आ', 'ఆ', 'ा', 'ా'], ['A', 'आ', 'ఆ', 'ा', 'ా'],
  ['ii', 'ई', 'ఈ', 'ी', 'ీ'], ['I', 'ई', 'ఈ', 'ी', 'ీ'],
  ['uu', 'ऊ', 'ఊ', 'ू', 'ూ'], ['U', 'ऊ', 'ఊ', 'ू', 'ూ'],
  ['ai', 'ऐ', 'ఐ', 'ै', 'ై'], ['au', 'औ', 'ఔ', 'ौ', 'ౌ'],
  ['R', 'ऋ', 'ఋ', 'ृ', 'ృ'],
  ['a', 'अ', 'అ', null, null],
  ['i', 'इ', 'ఇ', 'ि', 'ి'], ['u', 'उ', 'ఉ', 'ु', 'ు'],
  ['e', 'ए', 'ఏ', 'े', 'ే'], ['o', 'ओ', 'ఓ', 'ो', 'ో'],
];

const ROMAN_MODS: [string, string, string][] = [
  ['M', 'ं', 'ం'],
  ['H', 'ः', 'ః'],
];

interface TokenEntry {
  roman: string;
  kind: 'C' | 'V' | 'X';
  ch: string;
  matra?: string | null;
}

function buildTokenTable(target: ScriptTarget): TokenEntry[] {
  const idx = target === 'deva' ? 1 : 2;
  const midx = target === 'deva' ? 3 : 4;
  const list: TokenEntry[] = [];
  ROMAN_CONSONANTS.forEach((e) => list.push({ roman: e[0], kind: 'C', ch: e[idx] }));
  ROMAN_VOWELS.forEach((e) => list.push({ roman: e[0], kind: 'V', ch: e[idx], matra: e[midx] }));
  ROMAN_MODS.forEach((e) => list.push({ roman: e[0], kind: 'X', ch: e[idx] }));
  list.sort((a, b) => b.roman.length - a.roman.length);
  return list;
}

const TOKEN_TABLES: Record<ScriptTarget, TokenEntry[]> = {
  deva: buildTokenTable('deva'),
  tel: buildTokenTable('tel'),
};

const DICTIONARY: Record<string, string> = {
  'palletoori monagadu': 'पल्लेटूरि मोनगाडु',
};

function isConsonant(ch: string): boolean {
  return Object.prototype.hasOwnProperty.call(CONSONANT_VALUES, ch);
}
function isVowel(ch: string): boolean {
  return INDEPENDENT_VOWELS.has(ch);
}
function isMatra(ch: string): boolean {
  return MATRAS.has(ch);
}
function isModifier(ch: string): boolean {
  return MODIFIERS.has(ch);
}

/**
 * Converts English/Roman text into Devanagari or Telugu script using the
 * classical Katapayadi token table. Supports both exact case-sensitive retroflex
 * tokens (T, Th, D, Dh, N, Sh, R, L, A, I, U, M, H) and Title-Case fallback.
 */
export function romanToScript(input: string, target: ScriptTarget = 'deva'): string {
  const lower = input.trim().toLowerCase();
  if (target === 'deva' && DICTIONARY[lower]) {
    return DICTIONARY[lower];
  }

  const table = TOKEN_TABLES[target];
  const virama = target === 'deva' ? '्' : '్';
  let out = '';
  let pending: string | null = null;
  let i = 0;

  while (i < input.length) {
    if (input[i] === '_') {
      if (pending) {
        out += pending + virama;
        pending = null;
      }
      i++;
      continue;
    }

    let matched: TokenEntry | null = null;
    const searchSlice = input.substring(i);
    for (const tok of table) {
      if (searchSlice.startsWith(tok.roman)) {
        matched = tok;
        break;
      } else if (
        searchSlice.toLowerCase().startsWith(tok.roman.toLowerCase()) &&
        tok.roman === tok.roman.toLowerCase()
      ) {
        matched = tok;
        break;
      }
    }

    if (matched) {
      if (matched.kind === 'C') {
        if (pending) {
          out += pending + virama;
        }
        pending = matched.ch;
      } else if (matched.kind === 'V') {
        if (pending) {
          out += matched.matra ? pending + matched.matra : pending;
          pending = null;
        } else {
          out += matched.ch;
        }
      } else if (matched.kind === 'X') {
        if (pending) {
          out += pending;
          pending = null;
        }
        out += matched.ch;
      }
      i += matched.roman.length;
    } else {
      if (pending) {
        out += pending;
        pending = null;
      }
      out += input[i];
      i++;
    }
  }

  if (pending) {
    out += pending;
  }
  return out;
}

/**
 * Analyzes Devanagari or Telugu text (or mixed) and computes the Katapayadi
 * breakdown, reversed number ("Ankanaam Vamato Gati"), and mod-12 Rashi.
 */
export function analyzeKatapayadiScript(scriptText: string, rawInput = scriptText): KatapayadiAnalysis {
  const text = (scriptText || '')
    .normalize('NFD')
    .replace(new RegExp(NUKTA, 'g'), '')
    .replace(/[\u200C\u200D]/g, '');
  const chars = Array.from(text);
  const units: KatapayadiUnit[] = [];
  let i = 0;

  while (i < chars.length) {
    const c = chars[i];

    if (isVowel(c)) {
      let syll = c;
      i++;
      while (i < chars.length && isModifier(chars[i])) {
        syll += chars[i];
        i++;
      }
      units.push({ syllable: syll, value: 0, type: 'vowel' });
      continue;
    }

    if (isConsonant(c)) {
      let syll = c;
      let current = c;
      let j = i + 1;
      let dropped = false;
      const chain = [c];

      while (j < chars.length && VIRAMAS.has(chars[j])) {
        if (j + 1 < chars.length && isConsonant(chars[j + 1])) {
          syll += chars[j];
          j++;
          current = chars[j];
          syll += current;
          j++;
          chain.push(current);
        } else {
          syll += chars[j];
          j++;
          dropped = true;
          break;
        }
      }

      if (dropped) {
        units.push({ syllable: syll, value: null, type: 'half-dropped', chain });
        i = j;
        continue;
      }

      let value = CONSONANT_VALUES[current];
      let matra: string | null = null;
      if (j < chars.length && isMatra(chars[j])) {
        matra = chars[j];
        syll += chars[j];
        j++;
      }
      while (j < chars.length && isModifier(chars[j])) {
        syll += chars[j];
        j++;
      }

      let overrideNote: string | undefined;
      if (matra && RA_MATRAS.has(matra)) {
        value = CONSONANT_VALUES['र'];
        overrideNote = 'Vocalic ṛ (ृ) overrides to र = 2';
      } else if (matra && LA_MATRAS.has(matra)) {
        value = CONSONANT_VALUES['ल'];
        overrideNote = 'Vocalic ḷ (ॢ) overrides to ल = 3';
      }

      units.push({
        syllable: syll,
        value,
        type: 'consonant',
        chain,
        survivor: current,
        overrideNote,
      });
      i = j;
      continue;
    }

    i++;
  }

  const valueUnits = units.filter((u) => u.value !== null && u.value !== undefined);
  const readingValues = valueUnits.map((u) => u.value as number);
  const reversedValues = readingValues.slice().reverse();
  const numberString = reversedValues.length ? reversedValues.join('') : '';

  let rashiIndex = 1; // Default to Aries if empty
  if (numberString) {
    // Use BigInt modulo for arbitrarily long names so we never lose precision!
    // Wait: let's check how the original HTML did it: `parseInt(numberString, 10) % 12`
    // For up to 15 digits, Number is exact; for longer strings, BigInt is exact and matches parseInt for <=15 digits.
    const num = Number(numberString);
    const r = Number.isSafeInteger(num) ? num % 12 : Number(BigInt(numberString) % 12n);
    rashiIndex = r === 0 ? 12 : r;
  }

  const signIdx = rashiIndex - 1;
  return {
    rawInput,
    scriptText,
    units,
    valueUnits,
    readingValues,
    reversedValues,
    numberString,
    rashiIndex,
    signIdx,
    rashi: RASHI_META[signIdx],
  };
}

/**
 * Convenience dispatcher that accepts any name and mode ('roman' | 'deva' | 'tel').
 * If 'roman' is passed, it also checks if the input already contains Devanagari or Telugu characters.
 */
export function computeKatapayadi(
  name: string,
  mode: InputMode = 'roman',
  romanScriptTarget: ScriptTarget = 'deva'
): KatapayadiAnalysis {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return analyzeKatapayadiScript('', '');
  }
  const hasNativeScript = /[\u0900-\u097F\u0C00-\u0C7F]/.test(trimmed);
  if (mode === 'roman' && !hasNativeScript) {
    const converted = romanToScript(trimmed, romanScriptTarget);
    return analyzeKatapayadiScript(converted, trimmed);
  }
  return analyzeKatapayadiScript(trimmed, trimmed);
}

export const VARGA_TABLE_ROWS = {
  deva: [
    { label: 'क-वर्ग · Ka-varga', letters: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'] },
    { label: 'ट-वर्ग · Ṭa-varga', letters: ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'] },
    { label: 'प-वर्ग · Pa-varga', letters: ['प', 'फ', 'ब', 'भ', 'म', null, null, null, null, null] },
    { label: 'य-वर्ग · Ya-varga', letters: ['य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', null, null] },
  ],
  tel: [
    { label: 'క-వర్గ · Ka-varga', letters: ['క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ'] },
    { label: 'ట-వర్గ · Ṭa-varga', letters: ['ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న'] },
    { label: 'ప-వర్గ · Pa-varga', letters: ['ప', 'ఫ', 'బ', 'భ', 'మ', null, null, null, null, null] },
    { label: 'య-వర్గ · Ya-varga', letters: ['య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', null, null] },
  ],
};

export const KEYBOARD_SETS = {
  deva: {
    consonants: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'ळ'],
    matras: ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः'],
    vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'],
    virama: '्',
  },
  tel: {
    consonants: ['క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', 'ళ'],
    matras: ['ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ె', 'ే', 'ై', 'ొ', 'ో', 'ం', 'ః'],
    vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ'],
    virama: '్',
  },
};
