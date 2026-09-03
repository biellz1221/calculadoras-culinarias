'use client';

import { CitationRef } from '@/components/citation';
import { MetricRow } from '@/components/range-badge';
import {
  PASTA_RANGES,
  isBeyondHardLimit,
  statusFor,
  type RangeRule,
} from '@/data/pasta/ranges';
import type { PastaPreset, PastaRecipe } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { usesEggRatio } from '@/lib/pasta/calculate';

interface BalancePanelProps {
  preset: PastaPreset;
  recipe: PastaRecipe;
  gramsPerServing: number;
  dict: PastaDictionary;
  locale: Locale;
}

/**
 * Balanço da massa: cada métrica com valor, faixa das fontes, estado e a
 * consequência de estar fora dela.
 *
 * Quais métricas aparecem depende da massa, e isso é de propósito: farinha por
 * grama de ovo não descreve massa colorida (o purê entra no lugar do ovo) nem
 * massa de água, e hidratação só tem faixa publicada nas massas de água.
 */
export function BalancePanel({
  preset,
  recipe,
  gramsPerServing,
  dict,
  locale,
}: BalancePanelProps) {
  const fmt = useFormatters(locale);

  const eggRatio = usesEggRatio(preset);
  const isWater = preset.family === 'vegan';
  const hasAbsorb = recipe.flourMaxGrams - recipe.flourGrams > 0.5;

  return (
    <section className="mt-10">
      <h2 className="label-caps text-brand-deep">{dict.balance.title}</h2>

      <div className="mt-4">
        <Metric
          label={dict.balance.servingSize}
          value={gramsPerServing}
          display={fmt.mass(gramsPerServing, 0)}
          rule={PASTA_RANGES['serving-grams']}
          rangeText={`${dict.balance.recommended}: ${fmt.mass(85, 0)} – ${fmt.mass(115, 0)}`}
          note={dict.notes.servingGrams}
          dict={dict}
        />

        {eggRatio && (
          <Metric
            label={dict.balance.flourPerEggMass}
            value={recipe.flourPerEggMass}
            display={ratioText(recipe.flourPerEggMass, fmt)}
            rule={PASTA_RANGES['flour-per-egg-mass']}
            rangeText={`${dict.balance.recommended}: ${ratioText(1.5, fmt)} – ${ratioText(2, fmt)}`}
            note={dict.notes.flourPerEggMass}
            dict={dict}
            extra={
              hasAbsorb
                ? `${dict.balance.withAbsorb}: ${ratioText(recipe.flourMaxPerEggMass, fmt)}`
                : undefined
            }
          />
        )}

        {isWater && (
          <Metric
            label={dict.balance.hydration}
            value={recipe.hydrationPercent}
            display={fmt.percent(recipe.hydrationPercent)}
            rule={PASTA_RANGES['water-hydration']}
            rangeText={`${dict.balance.recommended}: ${fmt.percent(46)} – ${fmt.percent(50)}`}
            note={dict.notes.waterHydration}
            dict={dict}
          />
        )}
      </div>

      {!eggRatio && !isWater && (
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
          {dict.balance.colourNote}
        </p>
      )}
    </section>
  );
}

/** "2" e "1,5" — a razão nunca precisa de mais de duas casas. */
function ratioText(value: number, fmt: Formatters): string {
  return fmt.number(value, { maximumFractionDigits: 2 });
}

function Metric({
  label,
  value,
  display,
  rule,
  rangeText,
  note,
  extra,
  dict,
}: {
  label: string;
  /** Número puro, para comparar com a faixa. */
  value: number;
  /** O mesmo número já formatado no idioma da página. */
  display: string;
  rule: RangeRule;
  rangeText: string;
  note: string;
  extra?: string;
  dict: PastaDictionary;
}) {
  const status = statusFor(value, rule);
  const beyond = isBeyondHardLimit(value, rule);

  return (
    <MetricRow
      label={label}
      value={display}
      status={status}
      statusLabel={beyond ? dict.balance.hardLimit : dict.balance.status[status]}
      beyondHardLimit={beyond}
      range={rangeText}
      note={status === 'in' ? undefined : note}
    >
      {extra && <p className="mt-1 text-xs text-ink-muted">{extra}</p>}
      <CitationRef
        citations={rule.citations}
        labels={dict.sources}
        className="mt-2 block"
      />
    </MetricRow>
  );
}
