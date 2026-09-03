'use client';

import { useMemo, useState } from 'react';

import { BalancePanel } from './balance-panel';
import { RecipeTable } from './recipe-table';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField } from '@/components/field';
import { BREAD_PRESETS, DEFAULT_PRESET_ID, getPreset } from '@/data/bread/presets';
import type { BreadFormula, BreadTarget, IngredientKey } from '@/data/bread/types';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { calculateRecipe, withPercent } from '@/lib/bread/calculate';
import { cn } from '@/lib/cn';

type TargetMode = BreadTarget['kind'];

const MODES: readonly TargetMode[] = ['flour', 'dough', 'units'];

interface BreadCalculatorProps {
  dict: BreadDictionary;
  locale: Locale;
}

export function BreadCalculator({ dict, locale }: BreadCalculatorProps) {
  const fmt = useFormatters(locale);

  const [presetId, setPresetId] = useState(DEFAULT_PRESET_ID);
  const [formula, setFormula] = useState<BreadFormula>(
    () => presetFormula(DEFAULT_PRESET_ID),
  );
  const [mode, setMode] = useState<TargetMode>('flour');
  const [flourGrams, setFlourGrams] = useState(500);
  const [doughGrams, setDoughGrams] = useState(1000);
  const [unitCount, setUnitCount] = useState(8);
  const [unitGrams, setUnitGrams] = useState(90);

  const preset = getPreset(presetId);

  const target = useMemo<BreadTarget>(() => {
    if (mode === 'dough') return { kind: 'dough', grams: doughGrams };
    if (mode === 'units') {
      return { kind: 'units', count: unitCount, unitGrams };
    }
    return { kind: 'flour', grams: flourGrams };
  }, [mode, flourGrams, doughGrams, unitCount, unitGrams]);

  const recipe = useMemo(
    () => calculateRecipe(formula, target),
    [formula, target],
  );

  function choosePreset(id: string) {
    setPresetId(id);
    setFormula(presetFormula(id));

    // O rendimento publicado é o melhor palpite para o modo por unidades.
    const chosen = getPreset(id);
    if (chosen?.yield) {
      setUnitCount(chosen.yield.count);
      setUnitGrams(chosen.yield.unitGrams);
    }
  }

  function changePercent(key: IngredientKey, percent: number) {
    setFormula((current) => withPercent(current, key, percent));
  }

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.presetLabel}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {BREAD_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => choosePreset(item.id)}
              aria-pressed={item.id === presetId}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                item.id === presetId
                  ? 'border-ink bg-ink text-paper'
                  : 'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent-deep',
              )}
            >
              {dict.presets[item.id as keyof BreadDictionary['presets']]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="label-caps text-ink-muted">{dict.target.label}</legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {MODES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={option === mode}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                option === mode
                  ? 'border-accent-deep bg-accent-tint text-accent-deep'
                  : 'border-rule bg-surface text-ink-soft hover:border-accent',
              )}
            >
              {dict.target[option]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          {mode === 'flour' && (
            <MassField
              label={dict.target.flourHint}
              grams={flourGrams}
              onChange={setFlourGrams}
            />
          )}
          {mode === 'dough' && (
            <MassField
              label={dict.target.doughHint}
              grams={doughGrams}
              onChange={setDoughGrams}
            />
          )}
          {mode === 'units' && (
            <>
              <NumberField
                label={dict.target.unitsCount}
                value={unitCount}
                onChange={setUnitCount}
                step={1}
              />
              <MassField
                label={dict.target.unitWeight}
                grams={unitGrams}
                onChange={setUnitGrams}
              />
            </>
          )}
        </div>
      </fieldset>

      <RecipeTable
        recipe={recipe}
        dict={dict}
        locale={locale}
        onPercentChange={changePercent}
      />

      <BalancePanel recipe={recipe} dict={dict} locale={locale} />

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

function presetFormula(id: string): BreadFormula {
  const preset = getPreset(id);
  if (!preset) throw new Error(`preset desconhecido: ${id}`);

  // Cópia rasa das linhas para o estado poder ser editado sem tocar no dado.
  return {
    flours: preset.formula.flours.map((line) => ({ ...line })),
    lines: preset.formula.lines.map((line) => ({ ...line })),
  };
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

