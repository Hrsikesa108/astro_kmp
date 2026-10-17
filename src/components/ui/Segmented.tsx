import React from 'react';

export interface SegmentedOption<T extends string | number> {
  id: T;
  label: React.ReactNode;
  /** Extra classes for this option's button, e.g. a script font. */
  className?: string;
  /** Replaces the default accent fill when this option is selected. */
  activeClassName?: string;
}

interface SegmentedProps<T extends string | number> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  /** Layout of the group, e.g. 'inline-flex' or 'grid grid-cols-4 w-full md:inline-flex md:w-auto'. */
  className?: string;
  /** Size of each button. */
  buttonClassName?: string;
  inactiveClassName?: string;
}

const ACTIVE = 'bg-[var(--accent)] text-[var(--accent-ink)] font-medium';
const INACTIVE = 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]';

/** Bordered single-choice button group used for all mode toggles. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className = 'inline-flex',
  buttonClassName = 'px-3 py-1.5 text-xs',
  inactiveClassName = INACTIVE,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`border border-[var(--line)] rounded-md overflow-hidden ${className}`}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={String(o.id)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={`cursor-pointer transition-colors whitespace-nowrap ${buttonClassName} ${
              o.className ?? ''
            } ${active ? o.activeClassName ?? ACTIVE : inactiveClassName}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
