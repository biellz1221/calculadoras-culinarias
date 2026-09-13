'use client';

import { useMemo, useState } from 'react';

import { jamRecipeCard } from './recipe-card';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField, Segmented } from '@/components/field';
import { RangeBadge } from '@/components/range-badge';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  FERBER_APPLE_JELLY_CITATIONS,
  FERBER_SUGAR_CITATIONS,
  JAM_FRUITS,
  PECTIN_GROUP_CITATIONS,
  getFruit,
} from '@/data/jam/fruits';
import {
  MAX_ALTITUDE_METERS,
  PROCESSING_CITATIONS,
  SETTING_POINT_CITATIONS,
  settingCelsius,
} from '@/data/jam/setting-point';
import type { SugarLevel } from '@/data/jam/types';
import type { JamDictionary } from '@/i18n/dictionaries/jam';
import type { Locale } from '@/i18n/locales';
import { calculateJam } from '@/lib/jam/calculate';
import { JAM_SNAPSHOT, MAX_SUGAR_RATIO, initialJamState, type JamState } from '@/lib/jam/state';
import { useFormatters } from '@/lib/use-formatters';

const SUGAR_LEVELS: readonly SugarLevel[] = ['source', 'ferber', 'custom'];

/**
 * A calculadora de geleias.
 *
 * A altitude é campo de primeira linha, ao lado do peso da fruta, e não uma
 * opção escondida. É o que separa esta calculadora das outras: o açúcar
 * qualquer livro dá, mas a temperatura em que a geleia dá o ponto na cozinha de
 * quem está lendo nenhum deles dá — os dois publicam o número do nível do mar.
 */
export function JamCalculator({
  dict,
  locale,
}: {
  dict: JamDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const [state, setState] = useState<JamState>(initialJamState);

  const fruit = getFruit(state.fruitId);
  const result = useMemo(
    () =>
      calculateJam({
        fruitId: state.fruitId,
        fruitGrams: state.fruitGrams,
        sugarLevel: state.sugarLevel,
        customSugarRatio: state.customSugarRatio,
        altitudeMeters: state.altitudeMeters,
      }),
    [state],
  );

  const card = useMemo(
    () => jamRecipeCard({ state, result, dict, fmt }),
    [state, result, dict, fmt],
  );

  const lemonRange = formatRange(result.lemonGrams, (value) => fmt.mass(value, 0));
  const evaporation = formatRange(result.evaporationGrams, (value) => fmt.mass(value, 0));
  const jars = formatRange(result.jars, (value) => fmt.number(Math.round(value)));

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.input.label}</legend>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <MassField
            label={dict.input.fruitGrams}
            grams={state.fruitGrams}
            onChange={(fruitGrams) => setState((s) => ({ ...s, fruitGrams }))}
            step={100}
            hint={dict.input.fruitHint}
          />
          <NumberField
            label={dict.input.altitude}
            value={state.altitudeMeters}
            onChange={(altitudeMeters) => setState((s) => ({ ...s, altitudeMeters }))}
            suffix="m"
            step={50}
            max={MAX_ALTITUDE_METERS}
            hint={dict.input.altitudeHint}
          />
        </div>
      </fieldset>

      <div className="mt-8">
        <Segmented
          legend={dict.input.fruit}
          value={state.fruitId}
          onChange={(fruitId) => setState((s) => ({ ...s, fruitId }))}
          emphasis
          options={JAM_FRUITS.map((item) => ({
            value: item.id,
            label: dict.fruits[item.id as keyof JamDictionary['fruits']],
          }))}
        />
        {fruit && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {dict.groups[`${fruit.group}Hint` as keyof JamDictionary['groups']]}{' '}
            <CitationRef citations={PECTIN_GROUP_CITATIONS} labels={dict.sources} />
          </p>
        )}
      </div>

      <div className="mt-8">
        <Segmented
          legend={dict.input.sugar}
          value={state.sugarLevel}
          onChange={(sugarLevel) => setState((s) => ({ ...s, sugarLevel }))}
          options={SUGAR_LEVELS.map((value) => ({
            value,
            label: dict.sugarLevels[value],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.sugarLevels[`${state.sugarLevel}Note` as keyof JamDictionary['sugarLevels']]}
        </p>

        {state.sugarLevel === 'custom' && (
          <div className="mt-4">
            <NumberField
              label={dict.input.custom}
              value={Math.round(state.customSugarRatio * 1000) / 10}
              onChange={(percent) =>
                setState((s) => ({ ...s, customSugarRatio: percent / 100 }))
              }
              suffix="%"
              step={5}
              max={MAX_SUGAR_RATIO * 100}
              hint={dict.input.customHint}
            />
          </div>
        )}

        {state.sugarLevel === 'ferber' && (
          <CitationRef
            citations={FERBER_SUGAR_CITATIONS}
            labels={dict.sources}
            className="mt-2 block"
          />
        )}
      </div>

      <section aria-live="polite" className="mt-10">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        <div className="mt-4 rounded-card border border-rule bg-surface px-5 py-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-ink">{dict.result.sugar}</span>
            <span data-numeric className="font-display text-3xl font-semibold text-ink">
              {fmt.mass(result.sugarGrams, 0)}
            </span>
          </p>

          <dl className="mt-4 border-t border-rule pt-3">
            <Row
              label={dict.result.lemon}
              value={result.lemonGrams.max > 0 ? lemonRange : dict.result.lemonNone}
            />
            {result.appleJellyGrams > 0 && (
              <Row
                label={dict.result.appleJelly}
                value={fmt.mass(result.appleJellyGrams, 0)}
                hint={dict.result.appleJellyHint}
              />
            )}
            <Row
              label={dict.result.ratio}
              value={fmt.percent(result.sugarRatio * 100, 1)}
            />
            <Row
              label={dict.result.jars}
              value={`${jars} ${dict.result.jarsUnit}`}
              hint={dict.result.jarsHint}
            />
            <Row
              label={dict.result.evaporation}
              value={evaporation}
              hint={dict.result.evaporationHint}
            />
          </dl>

          {fruit && (
            <CitationRef
              citations={fruit.citations}
              labels={dict.sources}
              className="mt-3 block"
            />
          )}
        </div>

        <div className="mt-6 border-t border-rule pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.result.ratio}
            </h3>
            <RangeBadge
              status={
                result.status === 'source'
                  ? 'in'
                  : result.status === 'above-source'
                    ? 'above'
                    : 'below'
              }
              beyondHardLimit={result.status === 'below-source'}
              label={
                result.status === 'source'
                  ? dict.status.source
                  : result.status === 'above-source'
                    ? dict.status.aboveSource
                    : dict.status.belowSource
              }
            />
          </div>

          {fruit && (
            <p className="mt-1 text-xs text-ink-muted">
              {`${dict.status.sourceLabel}: ${fmt.percent(
                (fruit.recipe.sugarOz / fruit.recipe.fruitOz) * 100,
                1,
              )} · ${dict.result.shelf}: ${shelfLabel(fruit.recipe.shelfMonths, dict)}`}
            </p>
          )}

          {result.status !== 'source' && (
            <p
              className={`mt-3 max-w-prose rounded-card px-4 py-3 text-sm leading-relaxed text-ink ${
                result.status === 'below-source' ? 'bg-danger-tint' : 'bg-warn-tint'
              }`}
            >
              {result.status === 'below-source'
                ? dict.status.belowBody
                : dict.status.aboveBody}
            </p>
          )}
        </div>

        {/* O ponto por altitude. Não é detalhe de rodapé: é o motivo de a
            página existir em português, e por isso divide espaço com o
            resultado em vez de virar seção explicativa lá embaixo. */}
        <div className="mt-8 rounded-card border-2 border-accent-deep/25 bg-accent-tint/50 px-5 py-4">
          <h3 className="font-display text-base font-semibold text-ink">
            {dict.point.resultTitle}
          </h3>

          <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-3">
            <Metric
              label={dict.point.setting}
              value={fmt.temperature(result.settingCelsius, 1)}
              emphasis
            />
            <Metric
              label={dict.point.boiling}
              value={fmt.temperature(result.boilingCelsius, 1)}
            />
            <Metric
              label={dict.point.processing}
              value={`${fmt.number(result.processingMinutes)} ${dict.point.minutes}`}
            />
          </dl>

          <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
            {dict.point.settingHint}
            {state.altitudeMeters > 0 && (
              <>
                {' '}
                {dict.point.seaLevel} {fmt.temperature(settingCelsius(0), 1)}.
              </>
            )}
          </p>
          <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
            {dict.point.processingHint}
          </p>

          <CitationRef
            citations={[...SETTING_POINT_CITATIONS, ...PROCESSING_CITATIONS]}
            labels={dict.sources}
            className="mt-3 block"
          />
        </div>

        {result.appleJellyGrams > 0 && (
          <CitationRef
            citations={FERBER_APPLE_JELLY_CITATIONS}
            labels={dict.sources}
            className="mt-4 block"
          />
        )}
      </section>

      <RecipeActions
        calculator="jam"
        locale={locale}
        state={state}
        card={card}
        shape={JAM_SNAPSHOT}
        onRestore={setState}
      />
    </div>
  );
}

function formatRange(
  range: { min: number; max: number },
  format: (value: number) => string,
): string {
  // A comparação é entre os textos, não entre os números. Duas pontas que
  // arredondam para o mesmo valor exibiriam "5 – 5"; e um limiar numérico em
  // gramas colapsaria a faixa de potes (5,2 a 5,6), que arredonda para 5 e 6 e
  // é justamente o que o livro declara.
  const low = format(range.min);
  const high = format(range.max);
  return low === high ? low : `${low} – ${high}`;
}

function shelfLabel(
  months: readonly [number, number],
  dict: JamDictionary,
): string {
  const [low, high] = months;
  if (low === 12 && high === 12) return dict.result.year;
  return low === high
    ? `${low} ${dict.result.months}`
    : `${low}–${high} ${dict.result.months}`;
}

function Metric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd
        data-numeric
        className={
          emphasis
            ? 'font-display text-2xl font-semibold text-ink'
            : 'font-display text-lg font-semibold text-ink-soft'
        }
      >
        {value}
      </dd>
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
