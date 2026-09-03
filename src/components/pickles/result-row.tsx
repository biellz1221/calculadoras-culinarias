'use client';

import { CitationRef } from '@/components/citation';
import { MetricRow } from '@/components/range-badge';
import {
  MIN_SAFE_SALINITY,
  isBeyondHardLimit,
  statusFor,
  type RangeRule,
} from '@/data/pickles/ranges';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';

/** Uma linha do quadro "o que pesar". */
export function ResultRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-3 last:border-b-0">
      <dt className={cn('text-sm', strong ? 'font-semibold text-ink' : 'text-ink-muted')}>
        {label}
      </dt>
      <dd
        data-numeric
        className={cn(
          'tabular-nums text-ink',
          strong ? 'font-display text-2xl font-semibold' : 'text-sm font-semibold',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

interface SalinityMetricProps {
  label: string;
  percent: number;
  rule: RangeRule;
  note: string;
  dict: PicklesDictionary;
  locale: Locale;
}

/**
 * Salinidade com faixa e estado.
 *
 * Abaixo do mínimo seguro o aviso deixa de ser sinalização de faixa e vira
 * alerta de segurança, com cor, símbolo e texto diferentes, porque aqui não é
 * questão de sabor (FR-020).
 */
export function SalinityMetric({
  label,
  percent,
  rule,
  note,
  dict,
  locale,
}: SalinityMetricProps) {
  const status = statusFor(percent, rule);
  const unsafe = percent > 0 && percent < MIN_SAFE_SALINITY;
  const beyond = unsafe || isBeyondHardLimit(percent, rule);

  return (
    <MetricRow
      label={label}
      value={formatPercent(percent, locale, 2)}
      status={status}
      statusLabel={
        unsafe
          ? dict.status.unsafe
          : beyond
            ? dict.status.unsafe
            : dict.status[status === 'in' ? 'in' : status]
      }
      beyondHardLimit={beyond}
      range={`${dict.status.recommended}: ${formatPercent(rule.min, locale)} – ${formatPercent(rule.max, locale)}`}
      note={status === 'in' && !beyond ? undefined : note}
    >
      <CitationRef citations={rule.citations} labels={dict.sources} className="mt-2 block" />
    </MetricRow>
  );
}
