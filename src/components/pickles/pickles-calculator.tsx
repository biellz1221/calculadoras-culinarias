'use client';

import { useState } from 'react';

import { BrinePanel } from './brine-panel';
import { VinegarPanel } from './vinegar-panel';
import { Segmented } from '@/components/field';
import { DEFAULT_PRESETS, getPreset, presetsFor } from '@/data/pickles/presets';
import { isVinegarPreset, type PickleMode } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';

const MODES: readonly PickleMode[] = ['brine', 'dry-salt', 'vinegar'];

const MODE_HINTS: Record<PickleMode, keyof PicklesDictionary['modes']> = {
  brine: 'brineHint',
  'dry-salt': 'drySaltHint',
  vinegar: 'vinegarHint',
};

interface PicklesCalculatorProps {
  dict: PicklesDictionary;
  locale: Locale;
}

export function PicklesCalculator({ dict, locale }: PicklesCalculatorProps) {
  const [mode, setMode] = useState<PickleMode>('brine');
  const [presetId, setPresetId] = useState(DEFAULT_PRESETS.brine);

  const preset = getPreset(presetId);

  function chooseMode(next: PickleMode) {
    setMode(next);
    setPresetId(DEFAULT_PRESETS[next]);
  }

  return (
    <div className="mt-10">
      <Segmented
        legend={dict.modes.label}
        value={mode}
        onChange={chooseMode}
        emphasis
        options={MODES.map((value) => ({ value, label: dict.modes[value] }))}
      />

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {dict.modes[MODE_HINTS[mode]]}
      </p>

      <div className="mt-8">
        <Segmented
          legend={dict.presetLabel}
          value={presetId}
          onChange={setPresetId}
          options={presetsFor(mode).map((item) => ({
            value: item.id,
            label: dict.presets[item.id as keyof PicklesDictionary['presets']],
          }))}
        />
      </div>

      {preset &&
        (isVinegarPreset(preset) ? (
          <VinegarPanel key={preset.id} preset={preset} dict={dict} locale={locale} />
        ) : (
          <BrinePanel key={preset.id} preset={preset} dict={dict} locale={locale} />
        ))}
    </div>
  );
}
