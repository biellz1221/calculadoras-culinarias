'use client';

import { useMemo, useState } from 'react';

import { CitationRef } from '@/components/citation';
import { MassField, Segmented } from '@/components/field';
import { SPHERIFICATION_METHODS, getSpherification } from '@/data/gelling/agents';
import type { Dose } from '@/data/gelling/types';
import type { GellingDictionary } from '@/i18n/dictionaries/gelling';
import type { Locale } from '@/i18n/locales';
import { spherificationFor } from '@/lib/gelling/calculate';
import {
  initialSpherificationState,
  type SpherificationState,
} from '@/lib/gelling/state';
import { useFormatters } from '@/lib/use-formatters';

/** Uma coluna de doses: o que vai no líquido, ou o que vai no banho. */
function DoseList({
  title,
  items,
  copy,
  range,
}: {
  title: string;
  items: ReturnType<typeof spherificationFor>['base'];
  copy: GellingDictionary['spherification'];
  range: (dose: Dose, unit: 'mass' | 'percent') => string;
}) {
  return (
    <div>
      <h3 className="label-caps text-accent-deep">{title}</h3>
      <dl className="mt-3 space-y-3">
        {items.map(({ additive, grams }) => (
          <div key={additive.key}>
            <dt className="text-ink">
              {copy.additives[additive.key]}
              {additive.optional && (
                <span className="ml-2 text-sm text-ink-muted">
                  ({copy.optional})
                </span>
              )}
            </dt>
            <dd className="mt-0.5 tabular-nums text-ink-soft">
              <span className="text-lg text-ink">{range(grams, 'mass')}</span>
              <span className="ml-2 text-sm">
                {range(additive.percent, 'percent')}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Esferificação.
 *
 * É a outra pergunta da página, e por isso tem os seus próprios campos em vez
 * de tentar caber no seletor de textura: aqui não se escolhe consistência,
 * escolhe-se técnica, e o resultado são **dois** conjuntos de doses — o que vai
 * no líquido e o que vai no banho.
 *
 * Mantê-los separados na tela não é capricho de layout: são porcentagens de
 * líquidos diferentes, e juntá-las num total daria um número que não existe.
 *
 * Os limites da técnica direta aparecem junto do resultado, não em rodapé. Dose
 * certa numa base com laticínio não faz esfera nenhuma, e quem só lê o número
 * perde a viagem.
 */
export function SpherificationPanel({
  dict,
  locale,
}: {
  dict: GellingDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const copy = dict.spherification;
  const [state, setState] = useState<SpherificationState>(
    initialSpherificationState,
  );

  const method = getSpherification(state.methodId);
  const doses = useMemo(
    () => spherificationFor(method, state.liquidGrams, state.bathGrams),
    [method, state.liquidGrams, state.bathGrams],
  );

  const range = (dose: Dose, unit: 'mass' | 'percent') => {
    const format = (value: number) =>
      unit === 'mass' ? fmt.mass(value, 2) : fmt.percent(value, 2);
    const low = format(dose.min);
    const high = format(dose.max);
    return low === high ? low : `${low} – ${high}`;
  };

  return (
    <div className="mt-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <MassField
          label={copy.liquid}
          grams={state.liquidGrams}
          onChange={(liquidGrams) => setState((s) => ({ ...s, liquidGrams }))}
          step={50}
          hint={copy.liquidHint}
        />
        <MassField
          label={copy.bath}
          grams={state.bathGrams}
          onChange={(bathGrams) => setState((s) => ({ ...s, bathGrams }))}
          step={100}
          hint={copy.bathHint}
        />
      </div>

      <div className="mt-8">
        <Segmented
          legend={copy.method}
          value={state.methodId}
          onChange={(methodId) => setState((s) => ({ ...s, methodId }))}
          emphasis
          options={SPHERIFICATION_METHODS.map((item) => ({
            value: item.id,
            label: copy.methods[item.id],
          }))}
        />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {copy.methodNotes[state.methodId]}
        </p>
      </div>

      <div className="mt-8 grid gap-8 border-t border-rule pt-6 sm:grid-cols-2">
        <DoseList
          title={copy.baseTitle}
          items={doses.base}
          copy={copy}
          range={range}
        />
        <DoseList
          title={copy.bathTitle}
          items={doses.bath}
          copy={copy}
          range={range}
        />
      </div>

      <CitationRef
        citations={method.citations}
        labels={dict.sources}
        className="mt-4 block"
      />

      {method.limitKeys.length > 0 && (
        <section className="mt-8 border-l-2 border-accent pl-4">
          <h3 className="label-caps text-accent-deep">{copy.limitsTitle}</h3>
          <ul className="mt-3 max-w-2xl space-y-2">
            {method.limitKeys.map((key) => (
              <li key={key} className="text-sm leading-relaxed text-ink-soft">
                {copy.limits[key as keyof typeof copy.limits]}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 max-w-2xl border-t border-rule pt-6">
        <h3 className="label-caps text-ink-muted">{copy.truthTitle}</h3>
        <p className="mt-3 leading-relaxed text-ink-soft">{copy.truthBody}</p>
      </div>
    </div>
  );
}
