'use client';

import { useMemo, useState } from 'react';

import { brineRecipeCard, formatHours } from './recipe-card';
import { CitationRef } from '@/components/citation';
import { MassField, Segmented } from '@/components/field';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  BRINE_METHODS,
  PUNCTURE_CITATIONS,
  getMethod,
} from '@/data/brine/methods';
import { SALT_WEIGHT_CITATIONS } from '@/data/brine/salt';
import type { BrineDictionary } from '@/i18n/dictionaries/brine';
import type { Locale } from '@/i18n/locales';
import { calculateBrine } from '@/lib/brine/calculate';
import { BRINE_SNAPSHOT, initialBrineState, type BrineState } from '@/lib/brine/state';
import { useFormatters } from '@/lib/use-formatters';

/**
 * A calculadora de salmoura.
 *
 * A equivalência em colher fica embaixo do resultado e escrita como
 * conferência, nunca como resposta: a razão de a página existir é que a mesma
 * colher pesa quase o dobro conforme a marca do sal, e mostrar a colher em
 * destaque seria devolver o problema que ela veio resolver.
 */
export function BrineCalculator({
  dict,
  locale,
}: {
  dict: BrineDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const [state, setState] = useState<BrineState>(initialBrineState);

  const method = getMethod(state.methodId);
  const result = useMemo(
    () =>
      calculateBrine({
        methodId: state.methodId,
        proteinGrams: state.proteinGrams,
      }),
    [state],
  );

  const card = useMemo(
    () => brineRecipeCard({ state, result, dict, fmt }),
    [state, result, dict, fmt],
  );

  const saltRatio =
    state.proteinGrams > 0 ? (result.saltGrams / state.proteinGrams) * 100 : 0;

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.input.label}</legend>
        <div className="mt-4">
          <MassField
            label={dict.input.protein}
            grams={state.proteinGrams}
            onChange={(proteinGrams) => setState((s) => ({ ...s, proteinGrams }))}
            step={100}
            hint={dict.input.proteinHint}
          />
        </div>
      </fieldset>

      <div className="mt-8">
        <Segmented
          legend={dict.input.method}
          value={state.methodId}
          onChange={(methodId) => setState((s) => ({ ...s, methodId }))}
          emphasis
          options={BRINE_METHODS.map((item) => ({
            value: item.id,
            label: dict.methods[item.id as keyof BrineDictionary['methods']],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.methodNotes[state.methodId as keyof BrineDictionary['methodNotes']]}
        </p>
      </div>

      <section aria-live="polite" className="mt-10">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        <div className="mt-4 rounded-card border border-rule bg-surface px-5 py-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-ink">{dict.result.salt}</span>
            <span data-numeric className="font-display text-3xl font-semibold text-ink">
              {fmt.mass(result.saltGrams, 1)}
            </span>
          </p>

          <dl className="mt-4 border-t border-rule pt-3">
            {result.liquidGrams > 0 && (
              <Row label={dict.result.liquid} value={fmt.mass(result.liquidGrams, 0)} />
            )}
            {result.sugarGrams > 0 && (
              <Row label={dict.result.sugar} value={fmt.mass(result.sugarGrams, 1)} />
            )}
            <Row label={dict.result.ratio} value={fmt.percent(saltRatio, 3)} />
            {result.brineGrams > 0 && (
              <>
                <Row label={dict.result.brine} value={fmt.mass(result.brineGrams, 0)} />
                <Row
                  label={dict.result.strength}
                  value={fmt.percent(result.saltInLiquid * 100, 1)}
                />
              </>
            )}
            {method && (
              <Row
                label={dict.result.time}
                value={formatHours(method.hours, dict, fmt)}
              />
            )}
          </dl>

          {method && (
            <CitationRef
              citations={method.citations}
              labels={dict.sources}
              className="mt-3 block"
            />
          )}
        </div>

        {/* Equilíbrio ou relógio: a única coisa desta página que estraga uma
            peça inteira se for lida errada. */}
        {method && (
          <div
            className={`mt-6 rounded-card border-2 px-5 py-4 ${
              method.equilibrium
                ? 'border-ok/40 bg-ok-tint'
                : 'border-warn/50 bg-warn-tint'
            }`}
          >
            <h3 className="font-display text-base font-semibold text-ink">
              {method.equilibrium ? dict.equilibrium.yes : dict.equilibrium.no}
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
              {method.equilibrium ? dict.equilibrium.yesBody : dict.equilibrium.noBody}
            </p>
          </div>
        )}

        {method?.injected && (
          <p className="mt-4 max-w-prose rounded-card bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">{dict.result.injected}.</strong>{' '}
            {dict.result.injectedHint}{' '}
            <CitationRef citations={PUNCTURE_CITATIONS} labels={dict.sources} />
          </p>
        )}

        {method?.rinsed && (
          <p className="mt-4 max-w-prose rounded-card bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">{dict.result.rinsed}.</strong>{' '}
            {dict.result.rinsedHint}
          </p>
        )}

        <div className="mt-6 border-t border-rule pt-4">
          <h3 className="label-caps text-ink-muted">{dict.result.teaspoons}</h3>
          <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
            <Metric
              label={dict.result.diamondCrystal}
              value={fmt.number(round(result.teaspoons.diamondCrystal))}
            />
            <Metric
              label={dict.result.mortonKosher}
              value={fmt.number(round(result.teaspoons.mortonKosher))}
            />
          </dl>
          <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
            {dict.result.teaspoonsHint}
          </p>
          <CitationRef
            citations={SALT_WEIGHT_CITATIONS}
            labels={dict.sources}
            className="mt-2 block"
          />
        </div>
      </section>

      <RecipeActions
        calculator="brine"
        locale={locale}
        state={state}
        card={card}
        shape={BRINE_SNAPSHOT}
        onRestore={setState}
      />
    </div>
  );
}

/** Colher se mede em quarto de colher; mais casas seriam falsa precisão. */
function round(teaspoons: number): number {
  return Math.round(teaspoons * 4) / 4;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd data-numeric className="font-display text-xl font-semibold text-ink-soft">
        {value}
      </dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-2.5 last:border-b-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd data-numeric className="text-sm font-semibold tabular-nums text-ink">
        {value}
      </dd>
    </div>
  );
}
