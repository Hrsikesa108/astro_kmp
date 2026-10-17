import React from 'react';
import { type InputMode } from '../utils/katapayadi.ts';
import { Segmented, type SegmentedOption } from './ui/Segmented.tsx';

const SCRIPT_MODE_OPTIONS: readonly SegmentedOption<InputMode>[] = [
  { id: 'roman', label: 'English', className: 'font-mono-num' },
  { id: 'deva', label: 'देवनागरी', className: 'devanagari' },
  { id: 'tel', label: 'తెలుగు', className: 'telugu' },
];

interface ScriptModeToggleProps {
  value: InputMode;
  onChange: (mode: InputMode) => void;
  buttonClassName?: string;
}

/** English / Devanagari / Telugu input-script switch for the name field. */
export const ScriptModeToggle: React.FC<ScriptModeToggleProps> = ({
  value,
  onChange,
  buttonClassName = 'px-2 py-0.5 text-[11px] max-md:min-h-10 max-md:px-2.5 max-md:text-xs',
}) => (
  <Segmented
    ariaLabel="Name input script"
    value={value}
    onChange={onChange}
    options={SCRIPT_MODE_OPTIONS}
    buttonClassName={buttonClassName}
  />
);
