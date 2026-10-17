import React, { useState } from 'react';
import {
  CONSONANT_VALUES,
  KEYBOARD_SETS,
  VARGA_TABLE_ROWS,
  type InputMode,
  type KatapayadiAnalysis,
  type ScriptTarget,
} from '../utils/katapayadi.ts';
import { SIGN_LORDS } from '../utils/constants.ts';

interface KatapayadiViewProps {
  name: string;
  onNameChange: (val: string) => void;
  scriptMode: InputMode;
  onScriptModeChange: (mode: InputMode) => void;
  romanTarget: ScriptTarget;
  onRomanTargetChange: (target: ScriptTarget) => void;
  katapayadi: KatapayadiAnalysis;
}

const SAMPLE_WORDS = [
  { label: 'गणेश (Gaṇeśa)', val: 'गणेश', mode: 'deva' as InputMode },
  { label: 'बृहत् (Bṛhat)', val: 'बृहत्', mode: 'deva' as InputMode },
  { label: 'भारत (Bhārata)', val: 'भारत', mode: 'deva' as InputMode },
  { label: 'భారత (Telugu)', val: 'భారత', mode: 'tel' as InputMode },
  { label: 'Chiranjeevi', val: 'Chiranjeevi', mode: 'roman' as InputMode },
  { label: 'Indra', val: 'Indra', mode: 'roman' as InputMode },
];

export const KatapayadiView: React.FC<KatapayadiViewProps> = ({
  name,
  onNameChange,
  scriptMode,
  onScriptModeChange,
  romanTarget,
  onRomanTargetChange,
  katapayadi,
}) => {
  const [gridScript, setGridScript] = useState<ScriptTarget>('deva');
  const [selectedLetterToast, setSelectedLetterToast] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const kbScript: ScriptTarget = scriptMode === 'tel' ? 'tel' : romanTarget;
  const kbSet = KEYBOARD_SETS[kbScript];

  const handleInsertChar = (ch: string) => {
    if (scriptMode === 'roman') {
      onScriptModeChange(kbScript);
      onNameChange(katapayadi.scriptText + ch);
    } else {
      onNameChange(name + ch);
    }
  };

  const trackBLordSign = (katapayadi.signIdx + 3) % 12;
  const trackBKaraka = SIGN_LORDS[trackBLordSign];

  return (
    <div className="flex flex-col gap-5">
      {/* Live Breakdown & Syllable Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Syllable Breakdown & Result Strip */}
        <section className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
            <div>
              <h2 className="font-display text-2xl font-normal text-[var(--ink)] m-0">
                Kaṭapayādi Saṅkhyā — Syllable Breakdown
              </h2>
              <p className="text-xs text-[var(--muted)] m-0 mt-0.5">
                Follows Śaṅkaravarman&apos;s <em>Sadratnamālā</em>: vowels &amp; न/ञ = 0, conjuncts keep
                only the final consonant, vocalic ṛ (ृ/ృ) overrides to र = 2, and digits reverse (
                <em>aṅkānāṃ vāmato gatiḥ</em>).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] cursor-pointer"
            >
              {showKeyboard ? 'Hide On-Screen Keyboard' : 'Show Devanagari/Telugu Keyboard'}
            </button>
          </div>

          {/* Quick sample buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[var(--muted)] mr-1">Test classic examples:</span>
            {SAMPLE_WORDS.map((sw) => (
              <button
                key={sw.label}
                type="button"
                onClick={() => {
                  onScriptModeChange(sw.mode);
                  onNameChange(sw.val);
                }}
                className={`px-2.5 py-1 text-xs rounded-md border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent)] cursor-pointer ${
                  sw.mode === 'tel' ? 'telugu' : 'devanagari'
                }`}
              >
                {sw.label}
              </button>
            ))}
          </div>

          {/* Optional Virtual Keyboard */}
          {showKeyboard && (
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  Virtual Script Keyboard ({kbScript === 'deva' ? 'Devanagari' : 'Telugu'})
                </span>
                <div className="inline-flex border border-[var(--line)] rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      onRomanTargetChange('deva');
                      if (scriptMode !== 'roman') onScriptModeChange('deva');
                    }}
                    className={`px-2 py-0.5 text-xs cursor-pointer ${
                      kbScript === 'deva'
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                        : 'bg-[var(--surface)]'
                    }`}
                  >
                    Devanagari
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRomanTargetChange('tel');
                      if (scriptMode !== 'roman') onScriptModeChange('tel');
                    }}
                    className={`px-2 py-0.5 text-xs cursor-pointer ${
                      kbScript === 'tel'
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                        : 'bg-[var(--surface)]'
                    }`}
                  >
                    Telugu
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {kbSet.consonants.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleInsertChar(k)}
                    className={`min-w-[34px] h-8 px-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] text-sm cursor-pointer ${
                      kbScript === 'tel' ? 'telugu' : 'devanagari'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[11px] text-[var(--muted)] mr-1">Matras &amp; Virama:</span>
                {[kbSet.virama, ...kbSet.matras, ...kbSet.vowels].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleInsertChar(k)}
                    className={`min-w-[32px] h-8 px-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] text-sm cursor-pointer ${
                      kbScript === 'tel' ? 'telugu' : 'devanagari'
                    }`}
                  >
                    {k}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onNameChange('')}
                  className="ml-auto px-2.5 h-8 rounded border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--accent)] cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Syllable Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)] font-mono-num">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Akṣara (Syllable)</th>
                  <th className="py-2 px-3">Rule Classification</th>
                  <th className="py-2 px-3 text-right">Varṇāṅka (Digit)</th>
                </tr>
              </thead>
              <tbody>
                {katapayadi.units.length ? (
                  katapayadi.units.map((u, idx) => {
                    const isDropped = u.value === null || u.value === undefined;
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-dashed border-[var(--line)] ${
                          isDropped ? 'opacity-50 line-through' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-mono-num text-xs text-[var(--muted)]">
                          {idx + 1}
                        </td>
                        <td
                          className={`py-2 px-3 text-lg ${
                            romanTarget === 'tel' || scriptMode === 'tel' ? 'telugu' : 'devanagari'
                          }`}
                        >
                          {u.syllable}
                        </td>
                        <td className="py-2 px-3 text-xs text-[var(--muted)]">
                          {u.type === 'vowel'
                            ? 'Independent vowel (śūnya = 0)'
                            : isDropped
                            ? 'Half-formed consonant without vowel · ignored'
                            : u.overrideNote
                            ? u.overrideNote
                            : u.chain && u.chain.length > 1
                            ? `Conjunct (${u.chain.join(' + ')}) → final consonant ${u.survivor} speaks`
                            : 'Consonant with vowel'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono-num font-bold text-[var(--accent)]">
                          {isDropped ? '—' : u.value}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[var(--muted)]">
                      Enter a name above to see the syllable-by-syllable Kaṭapayādi breakdown.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Result Summary Strip */}
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                Reading Order
              </span>
              <span className="font-mono-num text-lg font-semibold text-[var(--ink)]">
                {katapayadi.readingValues.join(', ') || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                Reversed (Vāmato Gati)
              </span>
              <span className="font-mono-num text-xl font-bold text-[var(--accent)]">
                {katapayadi.numberString || '0'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                Name Rāśi (mod 12)
              </span>
              <span className="font-display text-xl text-[var(--ink)]">
                {katapayadi.rashi.deva} · {katapayadi.rashi.en}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] block">
                Track B 4th Lord
              </span>
              <span className="font-display text-xl text-[var(--teal)]">
                {trackBKaraka}
              </span>
            </div>
          </div>
        </section>

        {/* Right 5 Cols: Varga Cipher Matrix & Roman Guide */}
        <section className="lg:col-span-5 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-normal text-[var(--ink)] m-0">
                The Kaṭapayādi Varga Cipher Grid
              </h2>
              <p className="text-xs text-[var(--muted)] m-0">
                Click any consonant to inspect its digit value (1–9, 0).
              </p>
            </div>
            <div className="inline-flex border border-[var(--line)] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setGridScript('deva')}
                className={`px-2.5 py-1 text-xs cursor-pointer ${
                  gridScript === 'deva'
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
                    : 'bg-[var(--surface)] text-[var(--muted)]'
                }`}
              >
                Devanagari
              </button>
              <button
                type="button"
                onClick={() => setGridScript('tel')}
                className={`px-2.5 py-1 text-xs cursor-pointer ${
                  gridScript === 'tel'
                    ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
                    : 'bg-[var(--surface)] text-[var(--muted)]'
                }`}
              >
                Telugu
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--line)] font-mono-num">
                  <th className="py-1.5 px-2 text-left">Varga</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                    <th key={d} className="py-1.5 px-1.5 font-bold text-[var(--accent)]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VARGA_TABLE_ROWS[gridScript].map((row) => (
                  <tr key={row.label} className="border-b border-[var(--line)]">
                    <th className="py-2 px-2 text-left font-serif-title text-xs text-[var(--muted)] whitespace-nowrap">
                      {row.label.split(' · ')[1]}
                    </th>
                    {row.letters.map((letter, idx) => (
                      <td key={idx} className="p-1">
                        {letter ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLetterToast(
                                `${letter} = ${CONSONANT_VALUES[letter]} (inserted into name)`
                              );
                              handleInsertChar(letter);
                            }}
                            className={`w-full py-1.5 rounded border border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)] cursor-pointer flex flex-col items-center ${
                              gridScript === 'tel' ? 'telugu' : 'devanagari'
                            }`}
                          >
                            <span className="text-sm leading-none">{letter}</span>
                            <span className="font-mono-num text-[9px] text-[var(--muted)] mt-0.5">
                              {CONSONANT_VALUES[letter]}
                            </span>
                          </button>
                        ) : (
                          <span className="text-[var(--muted)] opacity-40">–</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedLetterToast && (
            <div className="text-xs font-mono-num text-[var(--accent)] bg-[var(--bg)] border border-[var(--line)] rounded-md px-3 py-1.5">
              {selectedLetterToast}
            </div>
          )}

          {/* Roman Transliteration Reference */}
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-lg p-3 text-xs flex flex-col gap-1.5">
            <strong className="text-[var(--ink)] uppercase tracking-wider text-[11px]">
              English / Roman Transliteration Guide
            </strong>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[var(--muted)] font-mono-num">
              <span>Retroflex: T, Th, D, Dh, N</span>
              <span>Dental: t, th, d, dh, n</span>
              <span>Palatal/Retro Sibilant: sh / Sh</span>
              <span>Vocalic ṛ (ृ/ృ): capital R</span>
              <span>Aspirates: kh, gh, ch, jh, ph, bh</span>
              <span>Silent ending (virama): _</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
