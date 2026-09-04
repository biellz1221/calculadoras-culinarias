'use client';

import { useMemo, useState } from 'react';

import { BalancePanel } from './balance-panel';
import { breadRecipeCard } from './recipe-card';
import { RecipeTable } from './recipe-table';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField } from '@/components/field';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import { BREAD_PRESETS, getPreset } from '@/data/bread/presets';
import { INGREDIENT_KEYS, type IngredientKey } from '@/data/bread/types';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { calculateRecipe } from '@/lib/bread/calculate';
import {
  addIngredient,
  BREAD_MODES,
  BREAD_SNAPSHOT,
  breadTarget,
  changePercent,
  choosePreset,
  CUSTOM_PRESET_ID,
  flourPercentTotal,
  initialBreadState,
  isCustom,
  normalizeFlours,
  removeIngredient,
  type BreadMode,
  type BreadState,
} from '@/lib/bread/state';
import { cn } from '@/lib/cn';

interface BreadCalculatorProps {
  dict: BreadDictionary;
  locale: Locale;
}

export function BreadCalculator({ dict, locale }: BreadCalculatorProps) {
  const fmt = useFormatters(locale);

  const [state, setState] = useState<BreadState>(initialBreadState);
  const preset = getPreset(state.presetId);
  const custom = isCustom(state);

  const recipe = useMemo(
    () => calculateRecipe(state.formula, breadTarget(state)),
    [state],
  );

  const card = useMemo(
    () => breadRecipeCard({ state, recipe, dict, fmt }),
    [state, recipe, dict, fmt],
  );

  function setMode(mode: BreadMode) {
    setState((current) => ({ ...current, mode }));
  }

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.presetLabel}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...BREAD_PRESETS.map((item) => item.id), CUSTOM_PRESET_ID].map((id) => ({ id })).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setState((current) => choosePreset(current, item.id))}
              aria-pressed={item.id === state.presetId}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                item.id === state.presetId
                  ? 'border-ink bg-ink text-paper'
                  : 'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent-deep',
              )}
            >
              {item.id === CUSTOM_PRESET_ID
                ? dict.custom.preset
                : dict.presets[item.id as keyof BreadDictionary['presets']]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="label-caps text-ink-muted">{dict.target.label}</legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {BREAD_MODES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={option === state.mode}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                option === state.mode
                  ? 'border-accent-deep bg-accent-tint text-accent-deep'
                  : 'border-rule bg-surface text-ink-soft hover:border-accent',
              )}
            >
              {dict.target[option]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          {state.mode === 'flour' && (
            <MassField
              label={dict.target.flourHint}
              grams={state.flourGrams}
              onChange={(flourGrams) =>
                setState((current) => ({ ...current, flourGrams }))
              }
            />
          )}
          {state.mode === 'dough' && (
            <MassField
              label={dict.target.doughHint}
              grams={state.doughGrams}
              onChange={(doughGrams) =>
                setState((current) => ({ ...current, doughGrams }))
              }
            />
          )}
          {state.mode === 'units' && (
            <>
              <NumberField
                label={dict.target.unitsCount}
                value={state.unitCount}
                onChange={(unitCount) =>
                  setState((current) => ({ ...current, unitCount }))
                }
                step={1}
              />
              <MassField
                label={dict.target.unitWeight}
                grams={state.unitGrams}
                onChange={(unitGrams) =>
                  setState((current) => ({ ...current, unitGrams }))
                }
              />
            </>
          )}
        </div>
      </fieldset>

      {custom && (
        <CustomControls
          dict={dict}
          state={state}
          onAdd={(key) => setState((current) => addIngredient(current, key))}
          onNormalize={() => setState(normalizeFlours)}
        />
      )}

      <RecipeTable
        recipe={recipe}
        dict={dict}
        locale={locale}
        onPercentChange={(key: IngredientKey, percent: number) =>
          setState((current) => changePercent(current, key, percent))
        }
        onRemove={
          custom
            ? (key) => setState((current) => removeIngredient(current, key))
            : undefined
        }
        removeLabel={dict.custom.remove}
      />

      <BalancePanel recipe={recipe} dict={dict} locale={locale} />

      <RecipeActions
        calculator="bread"
        locale={locale}
        state={state}
        card={card}
        shape={BREAD_SNAPSHOT}
        onRestore={setState}
      />

      {preset && (
        <section className="mt-10 border-t border-rule pt-6">
          <h2 className="label-caps text-accent-deep">{dict.process.title}</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <ProcessItem
              label={dict.process.firstRise}
              value={formatRange(preset.process.firstRiseMinutes, dict.process.minutes, fmt)}
            />
            <ProcessItem
              label={dict.process.secondRise}
              value={formatRange(preset.process.secondRiseMinutes, dict.process.minutes, fmt)}
            />
            <ProcessItem
              label={dict.process.oven}
              value={
                preset.process.ovenCelsius
                  ? fmt.temperature(preset.process.ovenCelsius)
                  : undefined
              }
            />
            <ProcessItem
              label={dict.process.bake}
              value={formatRange(preset.process.bakeMinutes, dict.process.minutes, fmt)}
            />
            <ProcessItem
              label={dict.process.yieldLabel}
              value={
                preset.yield
                  ? `${fmt.number(preset.yield.count)} ${dict.process.yieldValue} ${fmt.mass(preset.yield.unitGrams, 0)}`
                  : undefined
              }
            />
          </dl>

          {preset.process.noteKey && (
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
              {
                dict.process.notes[
                  preset.process.noteKey as keyof BreadDictionary['process']['notes']
                ]
              }
            </p>
          )}

          <CitationRef
            citations={preset.citations}
            labels={dict.sources}
            className="mt-3 block"
          />
        </section>
      )}
    </div>
  );
}

function formatRange(
  range: readonly [number, number] | undefined,
  unit: string,
  fmt: Formatters,
): string | undefined {
  if (!range) return undefined;
  const [min, max] = range;

  return min === max
    ? `${fmt.number(min)} ${unit}`
    : `${fmt.number(min)}–${fmt.number(max)} ${unit}`;
}

function ProcessItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 pb-2">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd data-numeric className="text-sm font-semibold tabular-nums text-ink">
        {value}
      </dd>
    </div>
  );
}

/**
 * Controles que só a receita própria tem: acrescentar ingrediente e acertar a
 * régua das farinhas.
 *
 * A soma das farinhas precisa dar 100 — é o contrato do motor, e todo o resto
 * da receita se mede contra ela. Num preset isso é garantido pelo dado; aqui,
 * quem monta pode somar 120 sem perceber, e aí cada linha sairia 20% mais
 * pesada do que o número na tela promete. Por isso o aviso, com o conserto ao
 * lado.
 */
function CustomControls({
  dict,
  state,
  onAdd,
  onNormalize,
}: {
  dict: BreadDictionary;
  state: BreadState;
  onAdd: (key: IngredientKey) => void;
  onNormalize: () => void;
}) {
  const used = new Set(
    [...state.formula.flours, ...state.formula.lines].map((line) => line.key),
  );
  const available = INGREDIENT_KEYS.filter((key) => !used.has(key));
  const flourTotal = flourPercentTotal(state.formula);
  const offBalance = Math.abs(flourTotal - 100) > 0.05;

  return (
    <div className="mt-6 rounded-card border border-rule bg-surface px-5 py-4">
      <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
        {dict.custom.lead}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">{dict.custom.add}</span>
          <select
            value=""
            onChange={(event) => {
              if (event.target.value) onAdd(event.target.value as IngredientKey);
            }}
            className="rounded-sm border border-rule bg-paper px-3 py-2 text-ink focus:border-accent focus:outline-none"
          >
            <option value="">{dict.custom.choose}</option>
            {available.map((key) => (
              <option key={key} value={key}>
                {dict.ingredients[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {offBalance && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card bg-warn-tint px-4 py-3">
          <p className="max-w-prose text-sm leading-relaxed text-warn">
            {`${dict.custom.flourSum} ${Math.round(flourTotal * 10) / 10}%. ${dict.custom.flourWhy}`}
          </p>
          <button
            type="button"
            onClick={onNormalize}
            className="rounded-full border border-warn px-3 py-1.5 text-sm text-warn transition-colors hover:bg-warn hover:text-paper"
          >
            {dict.custom.normalize}
          </button>
        </div>
      )}
    </div>
  );
}
