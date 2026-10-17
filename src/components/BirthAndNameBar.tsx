import React, { useState, useRef, useEffect } from 'react';
import { Check, Clock, Pencil } from 'lucide-react';
import {
  CITIES,
  SAMPLE_PROFILES,
  type CityLocation,
  type SampleProfile,
} from '../utils/constants.ts';
import { type InputMode, type KatapayadiAnalysis, type ScriptTarget } from '../utils/katapayadi.ts';
import { ScriptModeToggle } from './ScriptModeToggle.tsx';

/** "1955-08-22" → "22 Aug 1955", independent of the device time zone. */
function formatBirthDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface BirthAndNameBarProps {
  name: string;
  onNameChange: (val: string) => void;
  scriptMode: InputMode;
  onScriptModeChange: (mode: InputMode) => void;
  romanTarget: ScriptTarget;
  onRomanTargetChange: (target: ScriptTarget) => void;
  dateStr: string;
  onDateChange: (val: string) => void;
  timeStr: string;
  onTimeChange: (val: string) => void;
  place: CityLocation;
  onPlaceChange: (place: CityLocation) => void;
  katapayadi: KatapayadiAnalysis;
  onLoadSample: (sample: SampleProfile) => void;
  onSetNow: () => void;
}

export const BirthAndNameBar: React.FC<BirthAndNameBarProps> = ({
  name,
  onNameChange,
  scriptMode,
  onScriptModeChange,
  romanTarget,
  onRomanTargetChange,
  dateStr,
  onDateChange,
  timeStr,
  onTimeChange,
  place,
  onPlaceChange,
  katapayadi,
  onLoadSample,
  onSetNow,
}) => {
  const [cityQuery, setCityQuery] = useState(place.name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCustomCoords, setShowCustomCoords] = useState(false);
  const [customLat, setCustomLat] = useState(String(place.lat));
  const [customLon, setCustomLon] = useState(String(place.lon));
  const [customZone, setCustomZone] = useState(place.zone);
  const [coordError, setCoordError] = useState('');
  // Phones show a one-glance summary; the full editor opens on demand (desktop always shows it).
  const [expanded, setExpanded] = useState(false);

  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCityQuery(place.name);
    setCustomLat(String(place.lat));
    setCustomLon(String(place.lon));
    setCustomZone(place.zone);
  }, [place]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())
  ).slice(0, 8);

  const handleApplyCustomCoords = () => {
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (isNaN(lat) || lat < -66 || lat > 66 || isNaN(lon) || lon < -180 || lon > 180) {
      setCoordError('Latitude must be between −66° and +66°, and Longitude between −180° and +180°.');
      return;
    }
    setCoordError('');
    onPlaceChange({
      name: `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
      lat,
      lon,
      zone: customZone || 'Asia/Kolkata',
    });
    setShowCustomCoords(false);
  };

  return (
    <section
      aria-label="Birth and Name Input Controls"
      className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 sm:p-5 flex flex-col gap-4"
    >
      {/* Phone summary: who / when / where at a glance, plus one-tap profile switching */}
      <div className="md:hidden flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display text-lg leading-tight text-[var(--ink)] truncate">
                {name.trim() || 'Unnamed'}
              </span>
              <span className="shrink-0 rounded-md bg-[var(--teal-bg)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--teal)]">
                <span className="devanagari">{katapayadi.rashi.deva}</span> {katapayadi.rashi.en}
              </span>
            </div>
            <p className="m-0 mt-0.5 truncate font-mono-num text-xs text-[var(--muted)]">
              {formatBirthDate(dateStr)} · {timeStr} · {place.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="birth-fields"
            className={`shrink-0 inline-flex items-center gap-1.5 h-11 px-3.5 rounded-lg border text-sm font-medium cursor-pointer ${
              expanded
                ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
            }`}
          >
            {expanded ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Pencil className="size-4" aria-hidden="true" />
            )}
            {expanded ? 'Done' : 'Edit'}
          </button>
        </div>
        <div className="-mx-3 px-3 flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="Profiles">
          {SAMPLE_PROFILES.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => onLoadSample(sp)}
              className={`h-10 px-3.5 rounded-full border text-sm whitespace-nowrap shrink-0 cursor-pointer ${
                name === sp.name && dateStr === sp.date
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] font-medium'
                  : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              {sp.name}
            </button>
          ))}
          <button
            type="button"
            onClick={onSetNow}
            className="h-10 px-3.5 rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--ink)] whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Clock className="size-4" aria-hidden="true" />
            Now
          </button>
        </div>
      </div>

      {/* Full editor: always visible on desktop, opened with Edit on phones */}
      <div id="birth-fields" className={`${expanded ? 'flex' : 'hidden'} md:flex flex-col gap-4`}>
        {/* Top row: Quick presets + Now button (phones use the summary chips instead) */}
        <div className="max-md:hidden flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mr-1">
              Profiles:
            </span>
            {SAMPLE_PROFILES.map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => onLoadSample(sp)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  name === sp.name && dateStr === sp.date
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] font-medium'
                    : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--accent)]'
                }`}
              >
                {sp.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onSetNow}
            className="px-3 py-1 text-xs font-medium rounded-md border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] cursor-pointer whitespace-nowrap shrink-0"
          >
            Cast for Right Now
          </button>
        </div>

        {/* Primary Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Name Input & Script Selector (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="natal-name-input"
                className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
              >
                Name (Kaṭapayādi)
              </label>
              <ScriptModeToggle value={scriptMode} onChange={onScriptModeChange} />
            </div>
            <input
              id="natal-name-input"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={
                scriptMode === 'roman'
                  ? 'Enter name (e.g. Chiranjeevi)'
                  : scriptMode === 'deva'
                  ? 'नाम लिखें (उदा. गणेश)'
                  : 'పేరు రాయండి (ఉదా. భారత)'
              }
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 text-base text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)]"
            />
          </div>

          {/* Birth Date (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="natal-date-input"
              className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
            >
              Birth Date
            </label>
            <input
              id="natal-date-input"
              type="date"
              min="1900-01-01"
              max="2100-12-31"
              value={dateStr}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 max-md:py-2.5 text-sm font-mono-num text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)]"
            />
          </div>

          {/* Birth Time (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="natal-time-input"
              className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
            >
              Birth Time (24h)
            </label>
            <input
              id="natal-time-input"
              type="time"
              value={timeStr}
              onChange={(e) => e.target.value && onTimeChange(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 max-md:py-2.5 text-sm font-mono-num text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)]"
            />
          </div>

          {/* Birth Location Search (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5 relative" ref={comboRef}>
            <div className="flex items-center justify-between">
              <label
                htmlFor="natal-place-input"
                className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
              >
                Birth Location
              </label>
              <button
                type="button"
                onClick={() => setShowCustomCoords(!showCustomCoords)}
                className="text-[11px] max-md:text-xs max-md:py-2 max-md:-my-2 text-[var(--accent)] underline cursor-pointer"
              >
                {showCustomCoords ? 'Hide Coords' : 'Lat/Lon'}
              </button>
            </div>
            <input
              id="natal-place-input"
              type="search"
              value={cityQuery}
              onFocus={() => setDropdownOpen(true)}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setDropdownOpen(true);
              }}
              placeholder="Search city..."
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3 py-2 max-md:py-2.5 text-sm text-[var(--ink)] focus:outline-2 focus:outline-[var(--accent)]"
            />

            {dropdownOpen && (
              <ul
                role="listbox"
                aria-label="City suggestions"
                className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 bg-[var(--surface)] border border-[var(--line)] rounded-lg shadow-lg max-h-60 overflow-y-auto p-1 m-0 list-none"
              >
                {filteredCities.map((c) => (
                  <li
                    key={c.name}
                    role="option"
                    aria-selected={c.name === place.name}
                    onClick={() => {
                      onPlaceChange(c);
                      setCityQuery(c.name);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--bg)] flex flex-col"
                  >
                    <span className="text-sm font-medium text-[var(--ink)]">{c.name}</span>
                    <span className="text-[11px] font-mono-num text-[var(--muted)]">
                      {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}° · {c.zone}
                    </span>
                  </li>
                ))}
                <li
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowCustomCoords(true);
                  }}
                  className="px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--bg)] text-xs font-medium text-[var(--accent)] border-t border-[var(--line)] mt-1"
                >
                  + Enter custom latitude, longitude & timezone
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Custom Coordinates Drawer */}
        {showCustomCoords && (
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="custom-lat" className="text-[11px] uppercase text-[var(--muted)]">
                Latitude (−66 to 66)
              </label>
              <input
                id="custom-lat"
                type="number"
                step="any"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--line)] rounded px-2.5 py-1.5 max-md:py-2.5 text-sm font-mono-num"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="custom-lon" className="text-[11px] uppercase text-[var(--muted)]">
                Longitude (−180 to 180)
              </label>
              <input
                id="custom-lon"
                type="number"
                step="any"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--line)] rounded px-2.5 py-1.5 max-md:py-2.5 text-sm font-mono-num"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="custom-tz" className="text-[11px] uppercase text-[var(--muted)]">
                IANA Time Zone
              </label>
              <input
                id="custom-tz"
                type="text"
                value={customZone}
                onChange={(e) => setCustomZone(e.target.value)}
                placeholder="Asia/Kolkata"
                className="bg-[var(--surface)] border border-[var(--line)] rounded px-2.5 py-1.5 max-md:py-2.5 text-sm font-mono-num"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCustomCoords}
              className="px-4 py-2 max-md:h-11 rounded-md bg-[var(--accent)] text-[var(--accent-ink)] text-xs font-medium cursor-pointer"
            >
              Apply Coordinates
            </button>
            {coordError && (
              <p className="sm:col-span-4 text-xs text-[var(--shunya)] m-0">{coordError}</p>
            )}
          </div>
        )}

        {/* Live Katapayadi Summary Strip */}
        <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              Kaṭapayādi Live Conversion:
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--muted)] text-xs">Script:</span>
              <strong
                className={`text-base ${
                  romanTarget === 'tel' || scriptMode === 'tel' ? 'telugu' : 'devanagari'
                }`}
              >
                {katapayadi.scriptText || '—'}
              </strong>
              {scriptMode === 'roman' && (
                <button
                  type="button"
                  onClick={() => onRomanTargetChange(romanTarget === 'deva' ? 'tel' : 'deva')}
                  className="text-[11px] max-md:text-xs max-md:py-2 max-md:-my-2 text-[var(--accent)] underline ml-1 cursor-pointer"
                >
                  ({romanTarget === 'deva' ? 'Switch to Telugu' : 'Switch to Devanagari'})
                </button>
              )}
            </span>
            <span aria-hidden="true" className="text-[var(--muted)] max-md:hidden">
              ·
            </span>
            <span>
              <span className="text-[var(--muted)] text-xs">Reading Digits: </span>
              <span className="font-mono-num font-medium">
                {katapayadi.readingValues.length ? katapayadi.readingValues.join(', ') : '—'}
              </span>
            </span>
            <span aria-hidden="true" className="text-[var(--muted)] max-md:hidden">
              ·
            </span>
            <span>
              <span className="text-[var(--muted)] text-xs">Reversed Number (Vāmato Gati): </span>
              <strong className="font-mono-num text-[var(--accent)]">
                {katapayadi.numberString || '0'}
              </strong>
            </span>
          </div>

          <div className="flex max-md:flex-wrap items-center gap-3 text-sm">
            <span>
              <span className="text-[var(--muted)] text-xs">Name Rāśi (mod 12): </span>
              <strong className="font-display text-base text-[var(--ink)]">
                {katapayadi.rashi.deva} · {katapayadi.rashi.en} ({katapayadi.rashi.sanskrit})
              </strong>
            </span>
            <span aria-hidden="true" className="text-[var(--muted)] max-md:hidden">
              ·
            </span>
            <span className="text-xs font-mono-num text-[var(--muted)]">
              Lord: <strong className="text-[var(--ink)]">{katapayadi.rashi.lord}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="md:hidden h-11 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] text-sm font-medium cursor-pointer"
        >
          Done
        </button>
      </div>
    </section>
  );
};
