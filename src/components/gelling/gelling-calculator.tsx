'use client';

import { useMemo, useState } from 'react';

import { CitationRef } from '@/components/citation';
import { MassField, Segmented } from '@/components/field';
import {
  BLOOM_CITATIONS,
  GELATIN_GRADES,
  REFERENCE_BLOOM,
  TEXTURE_IDS,
  getAgent,
} from '@/data/gelling/agents';
import type { Dose } from '@/data/gelling/types';
import type { GellingDictionary } from '@/i18n/dictionaries/gelling';
import type { Locale } from '@/i18n/locales';
import { dosesFor, gelatinFor, nominalBloom } from '@/lib/gelling/calculate';
import { initialGellingState, type GellingState } from '@/lib/gelling/state';
import { useFormatters } from '@/lib/use-formatters';

/**
 * A calculadora de gelificantes.
 *
 * Uma pergunta só — quanto líquido, que textura — porque é assim que a dúvida
 * chega: a pessoa sabe o que quer comer, não quantos por cento de ágar isso é.
 *
 * O conversor de Bloom fica logo abaixo e só aparece quando a gelatina está na
 * resposta. É a conta que ninguém faz certo em casa, e mostrá-la numa textura
 * que não leva gelatina seria ruído.
 */
export function GellingCalculator({
  dict,
  locale,
}: {
  dict: GellingDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const [state, setState] = useState<GellingState>(initialGellingState);

  const doses = useMemo(
    () => dosesFor({ liquidGrams: state.liquidGrams, textureId: state.textureId }),
    [state.liquidGrams, state.textureId],
  );

  const hasGelatin = doses.some((item) => item.agent.id === 'gelatin');
  const hasPair = doses.some((item) => item.agent.pairedWith);

  const range = (dose: Dose, digits: number, unit: 'mass' | 'percent') => {
    const format = (value: number) =>
      unit === 'mass' ? fmt.mass(value, digits) : fmt.percent(value, digits);
    const low = format(dose.min);
    const high = format(dose.max);
    return low === high ? low : `${low} – ${high}`;
  };

  const gelatinDose = getAgent('gelatin').doses.set!;
  const gelatin = gelatinFor(state.liquidGrams, gelatinDose.min, state.gradeId);

  return (
    <div className="mt-10">
      <fieldset>
        <legend className="label-caps text-ink-muted">{dict.input.label}</legend>
        <div className="mt-4">
          <MassField
            label={dict.input.liquid}
            grams={state.liquidGrams}
            onChange={(liquidGrams) => setState((s) => ({ ...s, liquidGrams }))}
            step={50}
            hint={dict.input.liquidHint}
          />
        </div>
      </fieldset>

      <div className="mt-8">
        <Segmented
          legend={dict.input.texture}
          value={state.textureId}
          onChange={(textureId) => setState((s) => ({ ...s, textureId }))}
          emphasis
          options={TEXTURE_IDS.map((id) => ({
            value: id,
            label: dict.textures[id],
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.textureNotes[state.textureId]}
        </p>
      </div>

      <section className="mt-10">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        {doses.length === 0 ? (
          <p className="mt-4 text-ink-soft">{dict.result.empty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">{dict.result.title}</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="label-caps py-2 text-ink-muted">
                    {dict.result.agent}
                  </th>
                  <th scope="col" className="label-caps w-32 py-2 pr-6 text-ink-muted">
                    {dict.result.amount}
                  </th>
                  <th scope="col" className="label-caps py-2 text-ink-muted">
                    {dict.result.percent}
                  </th>
                </tr>
              </thead>
              <tbody>
                {doses.map(({ agent, grams, percent }) => (
                  <tr key={agent.id} className="border-b border-rule/60 align-top">
                    <th scope="row" className="py-3 pr-4 font-normal text-ink">
                      {dict.agents[agent.id]}
                      <span className="mt-1 block text-sm text-ink-muted">
                        {agent.gels ? dict.result.gels : dict.result.thickens}
                        {' · '}
                        {agent.needsBoil ? dict.result.boil : dict.result.noBoil}
                        {agent.holdsToCelsius !== undefined && (
                          <>
                            {' · '}
                            {dict.result.holds} {fmt.temperature(agent.holdsToCelsius)}
                          </>
                        )}
                      </span>
                    </th>
                    <td className="py-3 pr-6 tabular-nums text-ink">
                      {range(grams, 2, 'mass')}
                    </td>
                    <td className="py-3 tabular-nums text-ink-soft">
                      {range(percent, 2, 'percent')}
                      <CitationRef
                        citations={percent.citations}
                        labels={dict.sources}
                        className="mt-1 block text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasPair && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
            {dict.result.pairNote}
          </p>
        )}

        <ul className="mt-6 max-w-2xl space-y-2">
          {doses.map(({ agent }) => (
            <li key={agent.id} className="text-sm leading-relaxed text-ink-soft">
              <span className="text-ink">{dict.agents[agent.id]}</span>{' '}
              — {dict.agentNotes[agent.id]}
            </li>
          ))}
        </ul>
      </section>

      {hasGelatin && (
        <section className="mt-12 border-t border-rule pt-8">
          <h2 className="label-caps text-accent-deep">{dict.bloom.title}</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            {dict.bloom.lead}
          </p>

          <div className="mt-6">
            <Segmented
              legend={dict.bloom.grade}
              value={state.gradeId}
              onChange={(gradeId) => setState((s) => ({ ...s, gradeId }))}
              options={GELATIN_GRADES.map((grade) => ({
                value: grade.id,
                label: dict.bloom.grades[grade.id],
              }))}
            />
          </div>

          <dl className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
            <div>
              <dt className="label-caps text-ink-muted">{dict.bloom.use}</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">
                {fmt.mass(gelatin.grams, 2)}
                {gelatin.sheets !== undefined && (
                  <span className="ml-2 text-base text-ink-soft">
                    ≈ {fmt.number(gelatin.sheets, { maximumFractionDigits: 1 })}{' '}
                    {dict.bloom.sheets}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">{dict.bloom.reference}</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink-soft">
                {fmt.mass(gelatin.referenceGrams, 2)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
            {dict.bloom.formula} · {dict.bloom.bloomLabel} {REFERENCE_BLOOM} →{' '}
            {fmt.number(nominalBloom(GELATIN_GRADES.find((g) => g.id === state.gradeId)!))}
          </p>
          {gelatin.sheets !== undefined && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              {dict.bloom.sheetsNote}
            </p>
          )}

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-left">
              <caption className="label-caps pb-2 text-left text-ink-muted">
                {dict.bloom.tableCaption}
              </caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="label-caps py-2 text-ink-muted">
                    {dict.bloom.grade}
                  </th>
                  <th scope="col" className="label-caps py-2 text-ink-muted">
                    {dict.bloom.bloomLabel}
                  </th>
                  <th scope="col" className="label-caps py-2 text-ink-muted">
                    {dict.bloom.perSheet}
                  </th>
                </tr>
              </thead>
              <tbody>
                {GELATIN_GRADES.map((grade) => (
                  <tr key={grade.id} className="border-b border-rule/60">
                    <th scope="row" className="py-2 pr-4 font-normal text-ink">
                      {dict.bloom.grades[grade.id]}
                    </th>
                    <td className="py-2 pr-4 tabular-nums text-ink-soft">
                      {grade.bloom[0] === grade.bloom[1]
                        ? fmt.number(grade.bloom[0])
                        : `${fmt.number(grade.bloom[0])}–${fmt.number(grade.bloom[1])}`}
                    </td>
                    <td className="py-2 tabular-nums text-ink-soft">
                      {grade.gramsPerSheet
                        ? fmt.number(grade.gramsPerSheet, { maximumFractionDigits: 1 })
                        : dict.bloom.powder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CitationRef
            citations={BLOOM_CITATIONS}
            labels={dict.sources}
            className="mt-3 block"
          />

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {dict.bloom.sheetInsight}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {dict.bloom.directNote}
          </p>
        </section>
      )}
    </div>
  );
}
