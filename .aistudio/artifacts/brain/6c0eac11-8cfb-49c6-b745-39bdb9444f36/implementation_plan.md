# Jyotiṣa & Kaṭapayādi Wealth Ephemeris

An installable cross-platform Web and Android (PWA) Vedic astrology workbench that generates precision sidereal charts (`D1`, `D9`, `D10`, `D60`), daily Nitya Panchanga, multi-script Kaṭapayādi name numerology, and predictive wealth accumulation cycles powered by the 4th Lord Money Yoga and Vimshottari Dasha + Jupiter/Saturn transits.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and product choices reflect your confirmed preferences and domain rules extracted from the three reference systems:

- **Confirmed Decision 1 — Cross-Platform Delivery**: Responsive Web Application with full Progressive Web App (PWA) compliance (`manifest.webmanifest`, offline Service Worker caching, and an in-app Android/Desktop/iOS install prompt).
- **Confirmed Decision 2 — D10 (Daśāṃśa) Calculation**: Standard Parāśara method — for odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius), the 10 parts of $3^\circ$ count forward from the sign itself; for even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces), counting starts from the 9th sign from it.
- **Confirmed Decision 3 — Predictive Wealth Accumulation Cycles**: Combines the natal/varga 4th Lord Money Yoga score with a timeline of **Vimshottari Mahadasha / Antardasha periods** and **Jupiter & Saturn Gochara (transits)** over the natal 4th Lord and Kaṭapayādi Rāśi to pinpoint high-yield wealth windows.
- **Confirmed Decision 4 — Visual Theme & Settings Placement**: Uses the *Nitya Panchangam* South Indian chart styling and CSS custom-property palette system (`Auto`, `Kumkum`, `Talapatra / Palm Leaf`, `Tulasi`, `Kesari`, `Purnima`, `Gopuram`, `Amavasya`), with the **Theme Switcher housed exclusively inside the Settings view** to keep the main header and workspace clean.

---

## 1. Overview & Core Concept

- **What It Does**: Takes a user's **Name**, **Birth Date**, **Birth Time**, and **Birth Location** (with a 150+ global city database and custom coordinate/timezone support) to compute:
  1. **Nitya Panchanga** at the birth moment (Tithi, Paksha, Nakshatra & Pada, Nitya Yoga, Karana, Vara, Sunrise/Sunset, Rahu Kalam, Abhijit & Brahma Muhurta).
  2. **Kaṭapayādi Name Audit** in English (Roman transliteration), Devanagari, or Telugu — displaying syllable-by-syllable consonant/vowel breakdown, conjunct survivor rules, vocalic-ṛ (`ृ`/`ృ`) override, *aṅkānāṃ vāmato gatiḥ* digit reversal, and the resulting **Name Rāśi (`mod 12`)**.
  3. **Automated Varga Charts (`D1`, `D9`, `D10`, `D60`)** rendered in authentic **South Indian Rāśi Chart** layout with Lagna highlight, retrograde markers, exact degrees, and interactive Track A / Track B karaka highlighting.
  4. **4th Lord Money Yoga & Wealth Accumulation Cycles**: Evaluates Track A (4th lord from natal Sun, or 10th lord if Ketu is conjunct Sun) and Track B (4th lord from the Kaṭapayādi Name Sign) across `D1`, `D9`, `D10`, and `D60`, including non-classical exaltation/debilitation wealth rules, Neecha Bhanga cancellation checks, Kartari Yoga, Kendra benefic support, and predictive **Vimshottari Dasha + Jupiter/Saturn transit wealth windows**.
- **Target Audience / Persona**: Vedic astrology practitioners, researchers, and individuals seeking an accurate, transparent computational dashboard for natal charts, name numerology, and financial timing cycles on desktop or Android.
- **Key Value**: Unifies astronomical precision (Lahiri Chitrapaksha ayanamsa via `astronomy-engine`), classical Sanskrit/Telugu Kaṭapayādi linguistics, and multi-varga wealth yoga rules into a single offline-capable app without clutter.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Unified Birth & Name Input Bar (Dashboard Top)**:
   - User enters or edits **Full Name** (with script selector: Roman/English auto-transliteration, Devanagari, or Telugu + virtual keyboard toggle), **Birth Date**, **Birth Time** (with seconds/minute precision), and **Birth Place** (searchable combobox of global cities or custom Latitude/Longitude/Timezone).
   - Quick-load preset profiles (e.g., *Current Moment ("Now")*, *Sample Natal Profiles*) allow immediate exploration.
2. **Primary Workspace Tabs**:
   - **Dashboard (Overview & Charts)**: Displays the 5-limb *Panchanga* summary tiles, the side-by-side **South Indian Divisional Charts (`D1`, `D9`, `D10`, `D60`)**, and the **Planetary Positions & Dignity Table** (Longitude, Nakshatra/Pada, Rāśi, Navāṃśa, Daśāṃśa, Ṣaṣṭyāṃśa, and Dignity).
   - **4th Lord Money Yoga & Wealth Cycles**: Shows the dual-track derivation (`Track A: Sun → 4th/10th Lord` in crimson and `Track B: Kaṭapayādi Name Sign → 4th Lord` in teal), varga dignity matrix across `D1/D9/D10/D60`, Neecha Bhanga audit, Kartari & Kendra benefic checks, composite wealth score, and the **Predictive Wealth Accumulation Timeline** (Vimshottari Dasha periods + 12-year Jupiter/Saturn transit forecast over the 4th Lord).
   - **Kaṭapayādi Studio**: Interactive syllable breakdown table for the entered name, live Roman-to-Devanagari/Telugu preview, Varga consonant reference grid (1–9, 0), and an interactive name-tuning sandbox to test how spelling adjustments shift the Name Rāśi and Track B 4th Lord.
   - **Panchanga Details**: Deep-dive into the birth day's solar/lunar timings (Sunrise, Sunset, Moonrise, Moonset, Brahma Muhurta, Abhijit Muhurta, Rahu Kalam, Yamagandam, Gulika Kalam) and lunar month (*Amanta* / *Purnimanta* toggle).
   - **Settings (Modal / Drawer)**: Houses the **Nitya Panchangam Theme Switcher** (`Auto`, `Kumkum`, `Talapatra`, `Tulasi`, `Kesari`, `Purnima`, `Gopuram`, `Amavasya`), Month Naming preference (`Amanta` vs `Purnimanta`), and PWA installation status/controls.

### Visual Identity & Theme
- **Aesthetic Direction**: Clean, scholarly South Indian ephemeris aesthetic modeled directly on *Nitya Panchangam* — crisp 1px structural borders, high-contrast tabular numerals, and zero decorative clutter.
- **Color Palette & Mood**: Driven by CSS custom properties (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--krishna`, `--shukla`, `--gold-bg`, `--gold`, `--shunya-bg`, `--shunya`, `--adhika-bg`, `--adhika`). Default `Kumkum` / `Auto` theme provides a calm `#F4F5F8` canvas with `#FFFFFF` surfaces, `#1D1B2B` ink, and `#A6281F` kumkum crimson accents (automatically adapting to dark mode or user-selected temple palettes in Settings).
- **Typography & Hierarchy**:
  - *Display & Sanskrit/Telugu*: `Tiro Devanagari Sanskrit` and `Cormorant Garamond` for classical headings, Rāśi titles, and Devanagari/Telugu syllables.
  - *Body*: `IBM Plex Sans` for crisp UI labels, explanations, and rules.
  - *Monospace / Tabular Data*: `IBM Plex Mono` (`tabular-nums`) for all planetary degrees, timestamps, dasha dates, and Kaṭapayādi numeric strings.
- **South Indian Chart Styling**:
  - 4×4 fixed-sign grid (Meena top-left, clockwise: `MEE`, `MES`, `VRS`, `MIT`, `KAR`, `SIM`, `KAN`, `TUL`, `VRK`, `DHA`, `MAK`, `KUM`) with a 2×2 center summary box.
  - Lagna cell highlighted in `--gold-bg`, retrograde planets marked with superscript `R`, degrees formatted as `DD°MM′`, and optional Track A / Track B karaka badges when inspecting Money Yoga.
- **Mobile & Touch Ergonomics**:
  - Responsive layout expanding to a multi-column `max-w-7xl` workspace on desktop and collapsing cleanly on Android/mobile viewports with a bottom navigation bar (`<= 15%` sticky height cap) and minimum `44×44px` touch targets.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Client-Side Astronomical & Astrological Engine (`astronomy-engine`)**:
  - *Chosen Approach*: Perform all planetary, ayanamsa (true Lahiri with nutation in longitude), house/lagna, panchanga, and divisional chart calculations deterministically in TypeScript using `astronomy-engine`.
  - *Why*: Guarantees sub-arcsecond accuracy, zero API latency, and 100% offline functionality when installed as an Android PWA.
- **Decision 2 — Integrating D10 (Daśāṃśa) into the 4th Lord Money Yoga**:
  - *Chosen Approach*: Extend the original `D1 / D9 / D60` varga engine to include `D10` (the classical varga of career, karma, and status) both in the 4-chart visual grid and in the 4th Lord dignity & exalted co-tenant audit.
  - *Why*: `D10` bridges natal wealth potential (`D1/D9`) and karmic root (`D60`) with concrete professional realization, making the wealth accumulation analysis complete.
- **Decision 3 — Dual-Layer Wealth Accumulation Forecasting (Vimshottari + Transits)**:
  - *Chosen Approach*: Calculate the user's full 120-year Vimshottari Mahadasha and Antardasha sequence from the Moon's exact sidereal longitude at birth, and cross-reference active periods of the **Track A / Track B 4th Lord**, its dispositor, and benefic kendra planets with **Jupiter and Saturn transits** over the next 12 years.
  - *Why*: Natal yoga shows *potential*, while Dasha + Gochara answers *when* wealth accumulation peaks or requires caution.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                   App Shell (Theme Provider + PWA Manager)                │
├───────────────────────────────────────────────────────────────────────────┤
│  Top Bar: Brand Title │ Navigation Tabs │ Install App CTA & Settings Gear │
├───────────────────────────────────────────────────────────────────────────┤
│  Birth & Name Input Panel:                                                │
│  [Name + Script Toggle] [Date] [Time] [City Search / Lat-Lon-TZ] [Presets]│
└───────┬─────────────────────────┬────────────────────────┬────────────────┘
        │                         │                        │
        ▼                         ▼                        ▼
┌───────────────────┐   ┌───────────────────────┐  ┌────────────────────────┐
│  Core Astrology   │   │  Kaṭapayādi Engine    │  │  Wealth Yoga & Cycles  │
│  Engine (Lahiri)  │   │  (Deva / Tel / Roman) │  │  Engine                │
├───────────────────┤   ├───────────────────────┤  ├────────────────────────┤
│ • Sidereal Grahas │   │ • Token Transliterate │  │ • Track A (Sun 4th/10) │
│ • Lagna & Bhavas  │   │ • Conjunct Survivor   │  │ • Track B (Name 4th)   │
│ • Varga: D1, D9,  │   │ • Vocalic-ṛ/ḷ Rule    │  │ • D1/D9/D10/D60 Dignity│
│   D10, D60        │   │ • Vamato Gati Reverse │  │ • Neecha Bhanga Audit  │
│ • Nitya Panchanga │   │ • Mod-12 Name Rāśi    │  │ • Kartari & Kendra     │
│   & Muhurtas      │   │ • Varga Matrix UI     │  │ • Vimshottari Dasha +  │
│                   │   │                       │  │   Jup/Sat Transit Peaks│
└─────────┬─────────┘   └───────────┬───────────┘  └───────────┬────────────┘
          │                         │                          │
          └─────────────────────────┼──────────────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         Interactive Views & Grids                         │
├─────────────────┬─────────────────┬──────────────────┬────────────────────┤
│ 1. Dashboard &  │ 2. 4th Lord     │ 3. Kaṭapayādi    │ 4. Settings Modal  │
│    Varga Charts │    Wealth Yoga  │    Name Studio   │    (Nitya Themes,  │
│    (South Indian│    & Dasha/     │    & Syllable    │    Amanta/Purnim., │
│    D1/D9/D10/60)│    Transit Cycle│    Sandbox       │    PWA Install)    │
└─────────────────┴─────────────────┴──────────────────┴────────────────────┘
```

### Data Model & State
- **`BirthInput` State**: `{ name, scriptMode ('roman' | 'deva' | 'tel'), date ('YYYY-MM-DD'), time ('HH:MM'), place: { name, lat, lon, zone }, amanta: boolean }`, persisted in `localStorage`.
- **`ChartSnapshot` Computed Model**:
  - `ayanamsa`: True Lahiri ayanamsa in degrees.
  - `planets`: Array of 9 Grahas (`Sun`, `Moon`, `Mars`, `Mercury`, `Jupiter`, `Venus`, `Saturn`, `Rahu`, `Ketu`) + `Lagna`, each containing sidereal longitude, retrograde flag, speed, Nakshatra (0–26), Pada (1–4), and sign indices (`0–11`) for `D1`, `D9`, `D10`, and `D60`.
  - `panchanga`: `{ tithi, paksha, nakshatra, yoga, karana, vara, masa, ritu, sunrise, sunset, moonrise, moonset, periods: [Brahma, Abhijit, Rahu, Yamagandam, Gulika] }`.
- **`KatapayadiResult` Model**:
  - `originalInput`, `convertedScript`, `units` (syllable, type, chain, survivor, digit value), `readingOrderDigits`, `reversedNumberString`, `rashiIndex` (1–12), `signIdx` (0–11).
- **`MoneyYogaResult` Model**:
  - `trackA` (Sun-based) & `trackB` (Name-based): `{ refSign, houseTaken (4 or 10), lordSign, karaka, vargas: { 1, 9, 10, 60 } (sign, dignity, coTenants, exaltedWith, neechaBhangaReasons), kendraBenefics, aspectingBenefics, kartari ('papa' | 'shubha' | null), withNodes, parts, score }`.
  - `combinedScore`, `wealthTier`, `dashaCycles` (Mahadasha/Antardasha list with wealth activation ratings), and `transitWindows` (upcoming Jupiter & Saturn transit periods activating the 4th Lord or its trines/kendras).

### Interactive Component & State Mapping
- **Birth & Name Bar**: Updating any field (Name, Date, Time, City, or Custom Coordinates) immediately recomputes the astronomical snapshot, divisional charts, Kaṭapayādi breakdown, and wealth cycles.
- **South Indian Varga Grid (`D1`, `D9`, `D10`, `D60`)**: Supports toggling Karaka Highlighting (`Off`, `Track A + Track B`, `Track A Only`, `Track B Only`) and clicking any sign cell or planet to inspect its exact degree, nakshatra, house lordship, and dignity across all four divisional charts.
- **Predictive Wealth Timeline**: Users can filter Vimshottari Mahadashas (expanding any Mahadasha to view all 9 Antardashas) and step through a 12-year annual/quarterly transit forecast showing when transiting Jupiter (Kendra/Trikona support) and Saturn (Upachaya vs. Kantaka caution) aspect or conjoin the natal 4th Lord.
- **Settings Modal**: Clicking the Settings button in the top bar opens the configuration sheet where users can switch between the 8 *Nitya Panchangam* color themes, toggle *Amanta* vs *Purnimanta* month naming, and trigger PWA installation.
