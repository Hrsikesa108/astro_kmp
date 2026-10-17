import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeKatapayadiScript,
  computeKatapayadi,
  romanToScript,
} from './katapayadi.ts';
import {
  computeChartSnapshot,
  dasamsaRashi,
  navamsaRashi,
  rashiOf,
  shashtiamsaRashi,
} from './astrology.ts';
import { computeMoneyYogaRead } from './moneyYoga.ts';

test('Katapayadi classic rules: vowels, conjuncts, vocalic-r override, and Vamato Gati reversal', () => {
  // गणेश -> ग (3), ण (5), श (5) -> reading order [3, 5, 5] -> reversed 553
  const ganesha = analyzeKatapayadiScript('गणेश');
  assert.deepEqual(ganesha.readingValues, [3, 5, 5]);
  assert.equal(ganesha.numberString, '553');
  assert.equal(ganesha.rashiIndex, 553 % 12); // 1 -> Aries

  // बृहत् -> ब+ृ overrides to र (2), ह (8), त् is half-dropped -> reading [2, 8] -> reversed 82
  const brihat = analyzeKatapayadiScript('बृहत्');
  assert.deepEqual(brihat.readingValues, [2, 8]);
  assert.equal(brihat.numberString, '82');
  assert.equal(brihat.rashiIndex, 82 % 12); // 10 -> Capricorn

  // स्य -> स् (dropped) + य (1) -> 1
  const sya = analyzeKatapayadiScript('स्य');
  assert.deepEqual(sya.readingValues, [1]);
  assert.equal(sya.numberString, '1');

  // Telugu script check: భారత -> భ (4), ర (2), త (6) -> reading [4, 2, 6] -> reversed 624 -> 624 % 12 = 0 -> 12 (Pisces)
  const bharataTel = analyzeKatapayadiScript('భారత');
  assert.deepEqual(bharataTel.readingValues, [4, 2, 6]);
  assert.equal(bharataTel.numberString, '624');
  assert.equal(bharataTel.rashiIndex, 12);
});

test('Roman to Devanagari/Telugu transliteration and computeKatapayadi', () => {
  const deva = romanToScript('bhaarat', 'deva');
  assert.equal(deva, 'भारत');
  const kp = computeKatapayadi('Chiranjeevi', 'roman', 'deva');
  assert.ok(kp.numberString.length > 0);
  assert.ok(kp.rashiIndex >= 1 && kp.rashiIndex <= 12);
});

test('Divisional chart math: D1, D9, D10 (Parashara), and D60', () => {
  // 0° Aries -> D1=0, D9=0, D10=0, D60=0
  assert.equal(rashiOf(0.2), 0);
  assert.equal(navamsaRashi(0.2), 0);
  assert.equal(dasamsaRashi(0.2), 0);
  assert.equal(shashtiamsaRashi(0.2), 0);

  // D10 Parashara test:
  // Odd sign (Aries = 0): 4° is in the 2nd 3° part (index 1) -> starts from Aries (0) + 1 = Taurus (1)
  assert.equal(dasamsaRashi(4.0), 1);

  // Even sign (Taurus = 1, 30°..60°): 31° (1° in Taurus, part 0) -> starts from 9th from Taurus = Capricorn (9)
  assert.equal(dasamsaRashi(31.0), 9);
  // 34° (4° in Taurus, part 1) -> Capricorn (9) + 1 = Aquarius (10)
  assert.equal(dasamsaRashi(34.0), 10);
});

test('Full Chart Snapshot & 4th Lord Money Yoga on reference natal chart', () => {
  // Chiranjeevi natal reference from ephemeris: 1955-08-22, 10:15 IST, Mogalturu (16.42, 81.61)
  // Verified in ephemeris: Lagna = Libra (~8°), Saturn = Libra (~22°)
  const place = {
    name: 'Mogalturu / Narasapur, India',
    lat: 16.42,
    lon: 81.61,
    zone: 'Asia/Kolkata',
  };
  const snap = computeChartSnapshot('1955-08-22', '10:15', place);
  const lagna = snap.planets.find((p) => p.name === 'Lagna')!;
  const saturn = snap.planets.find((p) => p.name === 'Saturn')!;

  assert.equal(lagna.d1Sign, 6); // Libra
  assert.equal(saturn.d1Sign, 6); // Libra
  assert.equal(saturn.d1Dignity, 'exalted');

  const kp = computeKatapayadi('Chiranjeevi', 'roman', 'deva');
  const money = computeMoneyYogaRead(
    '1955-08-22',
    place,
    snap.utcDate,
    snap.rawLongitudes,
    kp
  );

  assert.ok(typeof money.combinedScore === 'number');
  assert.equal(money.dashas.length, 9);
  assert.ok(money.wealthDashaWindows.length > 0);
  assert.ok(money.transitForecasts.length > 0);
});
