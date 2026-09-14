'use client';

import { useMemo, useState } from 'react';

import { curingRecipeCard } from './recipe-card';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField, Segmented } from '@/components/field';
import { RangeBadge } from '@/components/range-badge';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  CONVERSION_CITATIONS,
  CURE_SALTS,
  METHOD_CEILING_PPM,
  METHOD_CITATIONS,
  MIN_INGOING_CITATIONS,
  MIN_INGOING_PPM,
  NITRATE_TO_NITRITE,
  getCure,
} from '@/data/curing/cures';
import type { CuringMethod } from '@/data/curing/types';
import type { CuringDictionary } from '@/i18n/dictionaries/curing';
import type { Locale } from '@/i18n/locales';
import { calculateCure } from '@/lib/curing/calculate';
import {
  CURING_SNAPSHOT,
  initialCuringState,
  type CuringState,
} from '@/lib/curing/state';
import { useFormatters } from '@/lib/use-formatters';

const METHODS: readonly CuringMethod[] = ['comminuted', 'dry'];

/**
 * A calculadora de cura.
 *
 * Duas diferenças de tom em relação às outras quatro, e as duas são
 * deliberadas. O aviso de perigo vem **antes** dos campos, não depois do
 * resultado: quem chega aqui sem saber o que é nitrito precisa ler isso antes
 * de digitar. E o resultado mostra o ppm obtido ao lado do que foi pedido, para
 * a pessoa conferir a conta em vez de confiar nela.
 */
export function CuringCalculator({
  dict,
  locale,
}: {
  dict: CuringDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const [state, setState] = useState<CuringState>(initialCuringState);

  const cure = getCure(state.cureId);
  const result = useMemo(
    () =>
      calculateCure(
        { meatGrams: state.meatGrams, cureId: state.cureId, targetPpm: state.targetPpm },
        state.method,
      ),
    [state],
  );

  const card = useMemo(
    () => curingRecipeCard({ state, result, dict, fmt }),
    [state, result, dict, fmt],
  );

  const ceiling = METHOD_CEILING_PPM[state.method];
  const unsafe = result.status !== 'ok';

  return (
    <div className="mt-10">
      {/* Antes de tudo, e sem depender de rolagem: cura mal feita mata. */}
      <section className="rounded-card border-2 border-danger bg-danger-tint px-5 py-4">
        <h2 className="font-display text-base font-semibold text-danger">
          {dict.danger.title}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
          {dict.danger.body}
        </p>
      </section>

      <fieldset className="mt-8">
        <legend className="label-caps text-ink-muted">{dict.input.label}</legend>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <MassField
            label={dict.input.meat}
            grams={state.meatGrams}
            onChange={(meatGrams) => setState((s) => ({ ...s, meatGrams }))}
            step={100}
            hint={dict.input.meatHint}
          />
          <NumberField
            label={dict.input.target}
            value={state.targetPpm}
            onChange={(targetPpm) => setState((s) => ({ ...s, targetPpm }))}
            suffix="ppm"
            step={5}
            max={1000}
            hint={dict.input.targetHint}
          />
        </div>
      </fieldset>

      <div className="mt-8">
        <Segmented
          legend={dict.input.cure}
          value={state.cureId}
          onChange={(cureId) => setState((s) => ({ ...s, cureId }))}
          emphasis
          options={CURE_SALTS.map((item) => ({
            value: item.id,
            label: dict.cures[item.id as keyof CuringDictionary['cures']],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.cureNotes[state.cureId as keyof CuringDictionary['cureNotes']]}
        </p>
      </div>

      <div className="mt-8">
        <Segmented
          legend={dict.input.method}
          value={state.method}
          onChange={(method) => setState((s) => ({ ...s, method }))}
          options={METHODS.map((value) => ({ value, label: dict.methods[value] }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.methods[`${state.method}Hint` as keyof CuringDictionary['methods']]}
        </p>
      </div>

      <section aria-live="polite" className="mt-10">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        <div className="mt-4 rounded-card border border-rule bg-surface px-5 py-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-ink">{dict.result.cure}</span>
            <span
              data-numeric
              className="font-display text-3xl font-semibold text-ink"
            >
              {fmt.mass(result.cureGrams, 1)}
            </span>
          </p>

          <dl className="mt-4 border-t border-rule pt-3">
            <Row
              label={dict.result.salt}
              value={fmt.mass(result.saltFromCureGrams, 1)}
              hint={dict.result.saltHint}
            />
            <Row
              label={dict.result.nitrite}
              value={`${fmt.number(Math.round(result.nitritePpm))} ppm`}
            />
            {cure && cure.nitrate > 0 && (
              <>
                <Row
                  label={dict.result.nitrate}
                  value={`${fmt.number(Math.round(result.nitratePpm))} ppm`}
                />
                {/* A soma na moeda da norma brasileira. Só aparece com sal que
                    leva nitrato, porque só aí ela diz algo que o número de
                    cima já não dizia. Sem selo de aprovação ao lado, e de
                    propósito: isto é entrada, e o teto de 150 é de resíduo. */}
                <Row
                  label={dict.result.combined}
                  value={`${fmt.number(Math.round(result.combinedAsNitritePpm))} ppm`}
                  hint={`${dict.result.combinedHint} ${fmt.number(
                    Math.round(result.nitritePpm),
                  )} + ${fmt.number(Math.round(result.nitratePpm))} ÷ ${fmt.number(
                    NITRATE_TO_NITRITE.sodium,
                    { minimumFractionDigits: 3, maximumFractionDigits: 3 },
                  )}`}
                />
              </>
            )}
          </dl>

          {cure && cure.nitrate > 0 && (
            <CitationRef
              citations={CONVERSION_CITATIONS}
              labels={dict.sources}
              className="mt-3 block"
            />
          )}
        </div>

        <div className="mt-6 border-t border-rule pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.result.nitrite}
            </h3>
            <RangeBadge
              status={
                result.status === 'ok'
                  ? 'in'
                  : result.status === 'above-limit'
                    ? 'above'
                    : 'below'
              }
              beyondHardLimit={unsafe}
              label={
                result.status === 'ok'
                  ? dict.status.ok
                  : result.status === 'below-minimum'
                    ? dict.status.belowMinimum
                    : dict.status.aboveLimit
              }
            />
          </div>

          <p className="mt-1 text-xs text-ink-muted">
            {`${dict.status.minimum}: ${fmt.number(MIN_INGOING_PPM)} ppm · ${dict.status.ceiling}: ${fmt.number(ceiling)} ppm`}
          </p>

          {unsafe && (
            <p className="mt-3 max-w-prose rounded-card bg-danger-tint px-4 py-3 text-sm leading-relaxed text-ink">
              {result.status === 'below-minimum'
                ? dict.status.belowBody
                : dict.status.aboveBody}
            </p>
          )}

          <CitationRef
            citations={[...MIN_INGOING_CITATIONS, ...METHOD_CITATIONS]}
            labels={dict.sources}
            className="mt-3 block"
          />
        </div>
      </section>

      <RecipeActions
        calculator="curing"
        locale={locale}
        state={state}
        card={card}
        shape={CURING_SNAPSHOT}
        onRestore={setState}
      />
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border-b border-rule/70 py-2.5 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-sm text-ink-muted">{label}</dt>
        <dd data-numeric className="text-sm font-semibold tabular-nums text-ink">
          {value}
        </dd>
      </div>
      {hint && (
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-muted">{hint}</p>
      )}
    </div>
  );
}
