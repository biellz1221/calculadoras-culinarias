'use client';

import { useMemo, useState } from 'react';

import { BalancePanel } from './balance-panel';
import { pastaRecipeCard } from './recipe-card';
import { ResultPanel } from './result-panel';
import { MassField, NumberField, Segmented } from '@/components/field';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  DEFAULT_PASTA_PRESET_ID,
  PASTA_PRESETS,
  getPastaPreset,
} from '@/data/pasta/presets';
import { SERVING_STYLES, type PastaPreset } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import type { Locale } from '@/i18n/locales';
import { calculatePasta, presetEggUnits } from '@/lib/pasta/calculate';
import {
  chooseStyle,
  initialPastaState,
  parsePastaState,
  pastaTarget,
  type PastaState,
} from '@/lib/pasta/state';
import { useFormatters } from '@/lib/use-formatters';

interface PastaCalculatorProps {
  dict: PastaDictionary;
  locale: Locale;
}

function presetById(id: string): PastaPreset {
  const preset = getPastaPreset(id);
  if (!preset) throw new Error(`preset de massa desconhecido: ${id}`);
  return preset;
}

export function PastaCalculator({ dict, locale }: PastaCalculatorProps) {
  const fmt = useFormatters(locale);

  const [state, setState] = useState<PastaState>(() =>
    initialPastaState(DEFAULT_PASTA_PRESET_ID),
  );

  const preset = presetById(state.presetId);
  const usesYolks = presetEggUnits(preset).yolks > 0;
  const usesEggs = presetEggUnits(preset).eggs > 0;

  const recipe = useMemo(
    () => calculatePasta(preset, pastaTarget(state)),
    [preset, state],
  );

  const card = useMemo(
    () => pastaRecipeCard({ state, preset, recipe, dict, fmt }),
    [state, preset, recipe, dict, fmt],
  );

  return (
    <div className="mt-10">
      <Segmented
        legend={dict.presetLabel}
        value={state.presetId}
        onChange={(presetId) => setState((current) => ({ ...current, presetId }))}
        emphasis
        options={PASTA_PRESETS.map((item) => ({
          value: item.id,
          label: dict.presets[item.id as keyof PastaDictionary['presets']],
        }))}
      />

      <div className="mt-8">
        <Segmented
          legend={dict.target.styleLabel}
          value={state.style}
          onChange={(style) => setState((current) => chooseStyle(current, style))}
          options={SERVING_STYLES.map((value) => ({
            value,
            label: dict.target.styles[value],
          }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-5">
        <NumberField
          label={dict.target.servings}
          value={state.servings}
          onChange={(servings) => setState((current) => ({ ...current, servings }))}
          step={1}
          min={1}
        />
        <MassField
          label={dict.target.gramsPerServing}
          grams={state.gramsPerServing}
          onChange={(gramsPerServing) =>
            setState((current) => ({ ...current, gramsPerServing }))
          }
          step={5}
        />
        {usesEggs && (
          <MassField
            label={dict.target.eggWeight}
            grams={state.eggGrams}
            onChange={(eggGrams) => setState((current) => ({ ...current, eggGrams }))}
            step={1}
            hint={dict.target.eggHint}
          />
        )}
        {usesYolks && (
          <MassField
            label={dict.target.yolkWeight}
            grams={state.yolkGrams}
            onChange={(yolkGrams) => setState((current) => ({ ...current, yolkGrams }))}
            step={1}
          />
        )}
      </div>

      <ResultPanel preset={preset} recipe={recipe} dict={dict} locale={locale} />

      <BalancePanel
        preset={preset}
        recipe={recipe}
        gramsPerServing={state.gramsPerServing}
        dict={dict}
        locale={locale}
      />

      <RecipeActions
        calculator="pasta"
        locale={locale}
        state={state}
        card={card}
        parse={parsePastaState}
        onRestore={setState}
      />

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="label-caps text-accent-deep">{dict.process.title}</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
          {dict.process.notes[preset.noteKey as keyof PastaDictionary['process']['notes']]}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {`${dict.process.ribbons} · ${dict.process.filled}`}
        </p>
        {preset.unsuitable?.includes('filled') && (
          <p className="mt-3 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
            {dict.process.unsuitableFilled}
          </p>
        )}
      </section>
    </div>
  );
}
