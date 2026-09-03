'use client';

import { CitationRef } from '@/components/citation';
import { MetricRow } from '@/components/range-badge';
import {
  RANGES,
  isBeyondHardLimit,
  ruleFor,
  statusFor,
  type RangeRule,
} from '@/data/bread/ranges';
import type { BreadRecipe } from '@/data/bread/types';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

interface BalancePanelProps {
  recipe: BreadRecipe;
  dict: BreadDictionary;
  locale: Locale;
}

interface Metric {
  key: string;
  label: string;
  value: number;
  rule: RangeRule;
  noteKey: keyof BreadDictionary['notes'];
  extra?: string;
}

/**
 * Painel de balanço: cada métrica com o valor, a faixa das fontes, o estado e a
 * consequência de estar fora dela, que é o que importa de verdade.
 */
export function BalancePanel({ recipe, dict, locale }: BalancePanelProps) {
  const metrics = collectMetrics(recipe, dict, locale);
  const hasPreFerment =
    Math.abs(recipe.effectiveHydration - recipe.hydration) > 0.05;

  return (
    <section aria-live="polite" className="mt-10">
      <h2 className="label-caps text-accent-deep">{dict.balance.title}</h2>

      <div className="mt-4">
        {metrics.map((metric) => {
          const status = statusFor(metric.value, metric.rule);
          const beyond = isBeyondHardLimit(metric.value, metric.rule);

          return (
            <MetricRow
              key={metric.key}
              label={metric.label}
              value={formatPercent(metric.value, locale)}
              status={status}
              statusLabel={
                beyond ? dict.balance.hardLimit : dict.balance.status[status]
              }
              beyondHardLimit={beyond}
              range={`${dict.balance.recommended}: ${formatPercent(
                metric.rule.min,
                locale,
              )} – ${formatPercent(metric.rule.max, locale)}`}
              note={status === 'in' ? undefined : dict.notes[metric.noteKey]}
            >
              {metric.extra && (
                <p className="mt-1 text-xs text-ink-muted">{metric.extra}</p>
              )}
              <CitationRef
                citations={metric.rule.citations}
                labels={dict.sources}
                className="mt-2 block"
              />
            </MetricRow>
          );
        })}
      </div>

      {hasPreFerment && (
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
          {dict.balance.withPreFerment}
        </p>
      )}
    </section>
  );
}

function collectMetrics(
  recipe: BreadRecipe,
  dict: BreadDictionary,
  locale: Locale,
): Metric[] {
  const metrics: Metric[] = [];
  const hasPreFerment =
    Math.abs(recipe.effectiveHydration - recipe.hydration) > 0.05;

  metrics.push({
    key: 'hydration',
    label: dict.balance.hydration,
    value: recipe.hydration,
    rule: RANGES.hydration,
    noteKey: 'hydration',
    extra: hasPreFerment
      ? `${dict.balance.effectiveHydration}: ${formatPercent(recipe.effectiveHydration, locale)}`
      : undefined,
  });

  metrics.push({
    key: 'salt',
    label: dict.balance.salt,
    value: recipe.salt,
    rule: RANGES.salt,
    noteKey: 'salt',
    extra: hasPreFerment
      ? `${dict.balance.effectiveSalt}: ${formatPercent(recipe.effectiveSalt, locale, 2)}`
      : undefined,
  });

  for (const line of recipe.lines) {
    if (line.key === 'salt') continue;

    const rule = ruleFor(line.key);
    if (!rule) continue;

    metrics.push({
      key: line.key,
      label: dict.ingredients[line.key],
      value: line.percent,
      rule,
      noteKey: rule.noteKey as keyof BreadDictionary['notes'],
    });
  }

  return metrics;
}
