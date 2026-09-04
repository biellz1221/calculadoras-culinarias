'use client';

import { useMemo, useState } from 'react';

import { BrinePanel } from './brine-panel';
import { picklesRecipeCard } from './recipe-card';
import { VinegarPanel } from './vinegar-panel';
import { Segmented } from '@/components/field';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import { getPreset, presetsFor } from '@/data/pickles/presets';
import { isVinegarPreset, type PickleMode } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';
import {
  choosePickleMode,
  choosePicklePreset,
  initialPicklesState,
  PICKLES_SNAPSHOT,
  type BrineState,
  type PicklesState,
  type VinegarState,
} from '@/lib/pickles/state';
import { useFormatters } from '@/lib/use-formatters';

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
  const fmt = useFormatters(locale);

  const [state, setState] = useState<PicklesState>(initialPicklesState);
  const preset = getPreset(state.presetId);

  const card = useMemo(() => picklesRecipeCard({ state, dict, fmt }), [state, dict, fmt]);

  function patchBrine(patch: Partial<BrineState>) {
    setState((current) => ({ ...current, brine: { ...current.brine, ...patch } }));
  }

  function patchVinegar(patch: Partial<VinegarState>) {
    setState((current) => ({ ...current, vinegar: { ...current.vinegar, ...patch } }));
  }

  return (
    <div className="mt-10">
      <Segmented
        legend={dict.modes.label}
        value={state.mode}
        onChange={(mode) => setState((current) => choosePickleMode(current, mode))}
        emphasis
        options={MODES.map((value) => ({ value, label: dict.modes[value] }))}
      />

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {dict.modes[MODE_HINTS[state.mode]]}
      </p>

      <div className="mt-8">
        <Segmented
          legend={dict.presetLabel}
          value={state.presetId}
          onChange={(presetId) =>
            setState((current) => choosePicklePreset(current, presetId))
          }
          options={presetsFor(state.mode).map((item) => ({
            value: item.id,
            label: dict.presets[item.id as keyof PicklesDictionary['presets']],
          }))}
        />
      </div>

      {preset &&
        (isVinegarPreset(preset) ? (
          <VinegarPanel
            preset={preset}
            state={state.vinegar}
            onChange={patchVinegar}
            dict={dict}
            locale={locale}
          />
        ) : (
          <BrinePanel
            preset={preset}
            state={state.brine}
            onChange={patchBrine}
            dict={dict}
            locale={locale}
          />
        ))}

      <RecipeActions
        calculator="pickles"
        locale={locale}
        state={state}
        card={card}
        shape={PICKLES_SNAPSHOT}
        onRestore={setState}
      />
    </div>
  );
}
