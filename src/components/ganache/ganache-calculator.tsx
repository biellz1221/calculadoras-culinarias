'use client';

import { useId, useMemo, useState } from 'react';

import { ganacheRecipeCard } from './recipe-card';
import { CitationRef } from '@/components/citation';
import { MassField, Segmented } from '@/components/field';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  CHOCOLATE_KINDS,
  FREEZING_CITATIONS,
  GANACHE_TEXTURES,
  SHELF_LIFE_CITATIONS,
  SHELF_LIFE_WEEKS,
  WATER_CITATIONS,
  WHITE_CITATIONS,
  getTexture,
} from '@/data/ganache/textures';
import type { Range } from '@/data/ganache/types';
import type { GanacheDictionary } from '@/i18n/dictionaries/ganache';
import type { Locale } from '@/i18n/locales';
import { calculateGanache } from '@/lib/ganache/calculate';
import {
  GANACHE_SNAPSHOT,
  initialGanacheState,
  type GanacheState,
} from '@/lib/ganache/state';
import { useFormatters } from '@/lib/use-formatters';

/**
 * A calculadora de ganache.
 *
 * O prazo de validade divide espaço com o resultado em vez de virar rodapé.
 * Proporção de ganache qualquer receita dá; três semanas e "congelar não
 * estende" é o que só está no Wybauw, e é o que decide se uma fornada de bombom
 * pode ir para a vitrine na semana que vem.
 */
export function GanacheCalculator({
  dict,
  locale,
}: {
  dict: GanacheDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const resultId = useId();
  const [state, setState] = useState<GanacheState>(initialGanacheState);

  const texture = getTexture(state.textureId);
  const result = useMemo(
    () =>
      calculateGanache({
        textureId: state.textureId,
        softGrams: state.softGrams,
        chocolate: state.chocolate,
      }),
    [state],
  );

  const card = useMemo(
    () => ganacheRecipeCard({ state, result, dict, fmt }),
    [state, result, dict, fmt],
  );

  const mass = (range: Range, digits = 0) => {
    const low = fmt.mass(range.min, digits);
    const high = fmt.mass(range.max, digits);
    return low === high ? low : `${low} – ${high}`;
  };

  const ratio = (range: Range) => {
    const low = fmt.percent(range.min * 100, 0);
    const high = fmt.percent(range.max * 100, 0);
    return low === high ? low : `${low} – ${high}`;
  };

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.input.label}</legend>
        <div className="mt-4">
          <MassField
            label={dict.input.soft}
            grams={state.softGrams}
            onChange={(softGrams) => setState((s) => ({ ...s, softGrams }))}
            step={50}
            hint={dict.input.softHint}
          />
        </div>
      </fieldset>

      <div className="mt-8">
        <Segmented
          legend={dict.input.texture}
          value={state.textureId}
          onChange={(textureId) => setState((s) => ({ ...s, textureId }))}
          emphasis
          options={GANACHE_TEXTURES.map((item) => ({
            value: item.id,
            label: dict.textures[item.id as keyof GanacheDictionary['textures']],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.textureNotes[state.textureId as keyof GanacheDictionary['textureNotes']]}
        </p>
      </div>

      <div className="mt-8">
        <Segmented
          legend={dict.input.chocolate}
          value={state.chocolate}
          onChange={(chocolate) => setState((s) => ({ ...s, chocolate }))}
          options={CHOCOLATE_KINDS.map((value) => ({
            value,
            label: dict.chocolates[value],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.chocolates[`${state.chocolate}Note` as keyof GanacheDictionary['chocolates']]}
        </p>
      </div>

      {/* A região do resultado tem nome próprio: sem `aria-labelledby` um
          `<section>` não vira landmark, e quem navega por regiões não acha o
          resultado que a página acabou de recalcular. */}
      <section aria-live="polite" aria-labelledby={resultId} className="mt-10">
        <h2 id={resultId} className="label-caps text-accent-deep">
          {dict.result.title}
        </h2>

        <div className="mt-4 rounded-card border border-rule bg-surface px-5 py-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-ink">
              {dict.result.chocolate}
            </span>
            <span data-numeric className="font-display text-3xl font-semibold text-ink">
              {mass(result.chocolateGrams)}
            </span>
          </p>

          <dl className="mt-4 border-t border-rule pt-3">
            <Row
              label={dict.result.butter}
              value={
                result.butterGrams.max > 0
                  ? mass(result.butterGrams)
                  : dict.result.none
              }
            />
            {result.extraCocoaButterGrams > 0 && (
              <Row
                label={dict.result.extra}
                value={fmt.mass(result.extraCocoaButterGrams, 1)}
                hint={dict.result.extraHint}
              />
            )}
            <Row
              label={dict.result.ratio}
              value={
                texture ? ratio(texture.chocolate) : fmt.percent(0, 0)
              }
            />
            <Row label={dict.result.total} value={mass(result.totalGrams)} />
            <Row
              label={dict.result.water}
              value={`${mass(result.waterGrams)} · ${fmt.percent(result.waterShare * 100, 0)}`}
              hint={dict.result.waterHint}
            />
          </dl>

          {texture && (
            <CitationRef
              citations={
                state.chocolate === 'white'
                  ? [...texture.citations, ...WHITE_CITATIONS]
                  : [...texture.citations, ...WATER_CITATIONS]
              }
              labels={dict.sources}
              className="mt-3 block"
            />
          )}
        </div>

        {/* O prazo divide espaço com o resultado: é o dado que nenhuma receita
            de ganache publica, e o motivo de esta página existir. */}
        <div className="mt-6 rounded-card border-2 border-warn/50 bg-warn-tint px-5 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.shelf.readout}
            </h3>
            <span data-numeric className="font-display text-2xl font-semibold text-ink">
              {`${fmt.number(SHELF_LIFE_WEEKS)} ${dict.shelf.weeks}`}
            </span>
          </div>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            {dict.shelf.body}
          </p>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            {dict.shelf.freezing}
          </p>
          <CitationRef
            citations={[...SHELF_LIFE_CITATIONS, ...FREEZING_CITATIONS]}
            labels={dict.sources}
            className="mt-3 block"
          />
        </div>
      </section>

      <RecipeActions
        calculator="ganache"
        locale={locale}
        state={state}
        card={card}
        shape={GANACHE_SNAPSHOT}
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
