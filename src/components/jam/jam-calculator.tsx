'use client';

import { useId, useMemo, useState } from 'react';

import { jamRecipeCard } from './recipe-card';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField, Segmented } from '@/components/field';
import { RangeBadge } from '@/components/range-badge';
import { RecipeActions } from '@/components/recipes/recipe-actions';
import {
  PECTIN_DOSE_CITATIONS,
  PH_CITATIONS,
  PH_FIELD_RULE_CITATIONS,
  PH_WINDOW,
  getEmbrapaRow,
} from '@/data/jam/brazil';
import {
  CLASSIFIED_FRUIT_IDS,
  NATIVE_FRUIT_IDS,
  FERBER_APPLE_JELLY_CITATIONS,
  FERBER_SUGAR_CITATIONS,
  PECTIN_GROUP_CITATIONS,
  WEIGHED_FRUIT_IDS,
  getFruit,
} from '@/data/jam/fruits';
import {
  MAX_ALTITUDE_METERS,
  PROCESSING_CITATIONS,
  SETTING_POINT_CITATIONS,
  settingCelsius,
} from '@/data/jam/setting-point';
import type { EmbrapaFruitRow, Range, ReferenceBasis } from '@/data/jam/types';
import type { JamDictionary } from '@/i18n/dictionaries/jam';
import type { Locale } from '@/i18n/locales';
import { calculateJam } from '@/lib/jam/calculate';
import {
  JAM_SNAPSHOT,
  MAX_SUGAR_RATIO,
  initialJamState,
  levelForFruit,
  sugarLevelsFor,
  type JamState,
} from '@/lib/jam/state';
import { labelFor } from '@/lib/recipes/card';
import { useFormatters } from '@/lib/use-formatters';

/** O pH sai com uma casa: 3,0 e 3,2 são os números que a fonte escreve. */
const DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

/**
 * A calculadora de geleias.
 *
 * A altitude é campo de primeira linha, ao lado do peso da fruta, e não uma
 * opção escondida. É o que separa esta calculadora das outras: o açúcar
 * qualquer livro dá, mas a temperatura em que a geleia dá o ponto na cozinha de
 * quem está lendo nenhum deles dá — os dois publicam o número do nível do mar.
 *
 * Desde 2026-09-14 a fruta vem de duas famílias. Nove têm receita pesada do
 * Blue Chair; trinta e cinco entram pela Tabela 1 da Embrapa, sem receita, com
 * a proporção vindo da norma. O seletor agrupa as duas e diz qual é qual, e o
 * resultado muda de forma — some o que a fonte não publica em vez de inventar.
 */
export function JamCalculator({
  dict,
  locale,
}: {
  dict: JamDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const resultId = useId();
  const fruitId = useId();
  const [state, setState] = useState<JamState>(initialJamState);

  const fruit = getFruit(state.fruitId);
  const embrapa = getEmbrapaRow(fruit?.embrapaId);
  const levels = sugarLevelsFor(state.fruitId);

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

  // Trocar de fruta pode invalidar o nível de açúcar: "a da receita" não existe
  // para goiaba. A troca cai na geleia extra da norma em vez de num silêncio.
  const chooseFruit = (next: string) =>
    setState((s) => ({
      ...s,
      fruitId: next,
      sugarLevel: levelForFruit(next, s.sugarLevel),
    }));

  const lemonRange = formatRange(result.lemonGrams, (value) => fmt.mass(value, 0));
  const pectinRange = formatRange(result.pectinGrams, (value) => fmt.mass(value, 1));
  const evaporation = formatRange(result.evaporationGrams, (value) => fmt.mass(value, 0));
  const jars = result.jars
    ? formatRange(result.jars, (value) => fmt.number(Math.round(value)))
    : null;

  const byNorm = result.referenceBasis === 'norm';
  // A receita fresca tem régua própria: comparar com ela é comparar com uma
  // proporção publicada, como a de Saunders — o que muda é o aviso, que é de
  // produto e não de prateleira.
  const byFresh = result.referenceBasis === 'fresh';

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

      {/* Quarenta e quatro frutas não cabem em botões. O `<select>` agrupa por
          origem, que é a informação que decide o que a pessoa vai receber: com
          receita pesada ou com a régua da norma. */}
      <div className="mt-8">
        <label htmlFor={fruitId} className="label-caps text-ink-muted">
          {dict.input.fruit}
        </label>
        <select
          id={fruitId}
          value={state.fruitId}
          onChange={(event) => chooseFruit(event.target.value)}
          className="mt-3 block w-full max-w-sm rounded-sm border border-rule bg-paper px-3 py-2 text-ink focus:border-accent focus:outline-none"
        >
          <optgroup label={dict.input.weighedGroup}>
            {WEIGHED_FRUIT_IDS.map((id) => (
              <option key={id} value={id}>
                {labelFor(dict.fruits, id)}
              </option>
            ))}
          </optgroup>
          <optgroup label={dict.input.classifiedGroup}>
            {CLASSIFIED_FRUIT_IDS.map((id) => (
              <option key={id} value={id}>
                {labelFor(dict.fruits, id)}
              </option>
            ))}
          </optgroup>
          <optgroup label={dict.input.nativeGroup}>
            {NATIVE_FRUIT_IDS.map((id) => (
              <option key={id} value={id}>
                {labelFor(dict.fruits, id)}
              </option>
            ))}
          </optgroup>
        </select>

        {fruit?.group && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {dict.groups[`${fruit.group}Hint` as keyof JamDictionary['groups']]}{' '}
            <CitationRef citations={PECTIN_GROUP_CITATIONS} labels={dict.sources} />
          </p>
        )}

        {embrapa && <EmbrapaLine row={embrapa} dict={dict} both={Boolean(fruit?.group)} />}

        {fruit && !fruit.recipe && !fruit.fresh && (
          <p className="mt-3 max-w-xl rounded-card bg-accent-tint/60 px-4 py-3 text-sm leading-relaxed text-ink">
            {dict.embrapa.noRecipe}
          </p>
        )}

        {/* O aviso que acompanha toda fruta com receita fresca. Não é sobre
            quanto tempo dura: é sobre o produto não ser de prateleira em
            proporção nenhuma. Por isso fica aqui em cima, na escolha da fruta,
            e não só no resultado. */}
        {fruit?.fresh && !fruit.recipe && (
          <p className="mt-3 max-w-xl rounded-card border-2 border-warn/50 bg-warn-tint px-4 py-3 text-sm leading-relaxed text-ink">
            {dict.fresh.notice}
            <CitationRef
              citations={fruit.fresh.citations}
              labels={dict.sources}
              className="mt-2 block"
            />
          </p>
        )}
      </div>

      <div className="mt-8">
        <Segmented
          legend={dict.input.sugar}
          value={state.sugarLevel}
          onChange={(sugarLevel) => setState((s) => ({ ...s, sugarLevel }))}
          options={levels.map((value) => ({
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

      {/* A região do resultado tem nome próprio: sem `aria-labelledby` um
          `<section>` não vira landmark, e quem navega por regiões não acha o
          resultado que a página acabou de recalcular. */}
      <section aria-live="polite" aria-labelledby={resultId} className="mt-10">
        <h2 id={resultId} className="label-caps text-accent-deep">
          {dict.result.title}
        </h2>

        <div className="mt-4 rounded-card border border-rule bg-surface px-5 py-4">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-ink">{dict.result.sugar}</span>
            <span data-numeric className="font-display text-3xl font-semibold text-ink">
              {fmt.mass(result.sugarGrams, 0)}
            </span>
          </p>

          <dl className="mt-4 border-t border-rule pt-3">
            {result.lemonGrams.max > 0 ? (
              <Row label={dict.result.lemon} value={lemonRange} />
            ) : fruit?.recipe ? (
              <Row label={dict.result.lemon} value={dict.result.lemonNone} />
            ) : (
              <Row
                label={dict.result.lemon}
                value={dict.result.lemonUnknown}
                hint={dict.result.lemonUnknownHint}
              />
            )}
            {result.appleJellyGrams > 0 && (
              <Row
                label={dict.result.appleJelly}
                value={fmt.mass(result.appleJellyGrams, 0)}
                hint={dict.result.appleJellyHint}
              />
            )}
            <Row
              label={dict.result.pectin}
              value={pectinRange}
              hint={dict.result.pectinHint}
            />
            <Row
              label={dict.result.ratio}
              value={fmt.percent(result.sugarRatio * 100, 1)}
            />
            {jars && (
              <Row
                label={dict.result.jars}
                value={`${jars} ${dict.result.jarsUnit}`}
                hint={dict.result.jarsHint}
              />
            )}
            <Row
              label={dict.result.evaporation}
              value={evaporation}
              hint={dict.result.evaporationHint}
            />
            <Row
              label={dict.result.ph}
              value={`${fmt.number(PH_WINDOW.targetMin, DECIMAL)} – ${fmt.number(PH_WINDOW.targetMax, DECIMAL)}`}
              hint={dict.result.phHint}
            />
          </dl>

          {fruit && (
            <CitationRef
              citations={[
                ...fruit.citations,
                ...PECTIN_DOSE_CITATIONS,
                ...PH_CITATIONS,
                ...PH_FIELD_RULE_CITATIONS,
              ]}
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
              beyondHardLimit={result.status === 'below-source' && !byNorm && !byFresh}
              label={statusLabel(result.status, result.referenceBasis, dict)}
            />
          </div>

          {fruit && (
            <p className="mt-1 text-xs text-ink-muted">
              {`${byNorm ? dict.status.normLabel : byFresh ? dict.status.freshLabel : dict.status.sourceLabel}: ${fmt.percent(
                result.referenceRatio * 100,
                1,
              )}`}
              {fruit.recipe &&
                ` · ${dict.result.shelf}: ${shelfLabel(fruit.recipe.shelfMonths, dict)}`}
            </p>
          )}

          {result.status !== 'source' && (
            <p
              className={`mt-3 max-w-prose rounded-card px-4 py-3 text-sm leading-relaxed text-ink ${
                result.status === 'below-source' && !byNorm && !byFresh
                  ? 'bg-danger-tint'
                  : 'bg-warn-tint'
              }`}
            >
              {statusBody(result.status, result.referenceBasis, dict)}
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

/** A linha da Tabela 1, com a procedência da linha declarada ao lado. */
function EmbrapaLine({
  row,
  dict,
  both,
}: {
  row: EmbrapaFruitRow;
  dict: JamDictionary;
  both: boolean;
}) {
  const pectin = dict.embrapa.pectinLevels[row.pectin];
  const acidity = dict.embrapa.acidityLevels[row.acidity];

  return (
    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
      <span className="font-semibold text-ink">{dict.embrapa.label}</span>
      {` — ${dict.embrapa.pectin.toLowerCase()} ${pectin}, ${dict.embrapa.acidity.toLowerCase()} ${acidity}. `}
      {both ? dict.embrapa.bothSources : dict.embrapa.hint}{' '}
      <span className="text-xs">
        {row.viaJackix ? dict.embrapa.viaJackix : dict.embrapa.ownRow}
      </span>
    </p>
  );
}

function statusLabel(
  status: string,
  basis: ReferenceBasis,
  dict: JamDictionary,
): string {
  if (basis === 'norm') {
    if (status === 'source') return dict.status.normSource;
    return status === 'above-source' ? dict.status.normAbove : dict.status.normBelow;
  }
  // Receita fresca e receita de conserva usam os mesmos rótulos: as duas são
  // "a proporção da fonte". O que difere entre elas é o corpo do aviso.
  if (status === 'source') return dict.status.source;
  return status === 'above-source' ? dict.status.aboveSource : dict.status.belowSource;
}

function statusBody(
  status: string,
  basis: ReferenceBasis,
  dict: JamDictionary,
): string {
  const above = status === 'above-source';
  if (basis === 'norm') return above ? dict.status.normAboveBody : dict.status.normBelowBody;
  if (basis === 'fresh') return above ? dict.status.freshAboveBody : dict.status.freshBelowBody;
  return above ? dict.status.aboveBody : dict.status.belowBody;
}

function formatRange(range: Range, format: (value: number) => string): string {
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
