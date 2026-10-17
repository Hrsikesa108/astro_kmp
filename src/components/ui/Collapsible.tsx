import React from 'react';
import { ChevronDown, Info } from 'lucide-react';

/**
 * Hides secondary content (explanations, guides) on phones until the user asks for it.
 * Desktop always shows the content, so the markup there is unchanged.
 */
export const collapsedOnMobile = (open: boolean) => (open ? '' : 'max-md:hidden');

interface CollapsibleToggleProps {
  open: boolean;
  onToggle: () => void;
  label: string;
  /** Space-separated ids of the elements this toggle shows and hides. */
  controls?: string;
  className?: string;
}

/** Phone-only disclosure row; pair it with `collapsedOnMobile(open)` on the controlled content. */
export const CollapsibleToggle: React.FC<CollapsibleToggleProps> = ({
  open,
  onToggle,
  label,
  controls,
  className = '',
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    aria-controls={controls}
    className={`md:hidden flex w-full items-center justify-between gap-2 min-h-10 text-sm font-medium text-[var(--accent)] cursor-pointer ${className}`}
  >
    <span className="inline-flex items-center gap-1.5">
      <Info className="size-4" aria-hidden="true" />
      {label}
    </span>
    <ChevronDown
      className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    />
  </button>
);
