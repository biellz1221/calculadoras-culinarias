'use client';

import { CitationRef } from '@/components/citation';
import { MetricRow, type RangeStatus } from '@/components/range-badge';
import { GELATO_CITATIONS } from '@/data/gelato/source';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import { formatNumber, formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';
import { METRIC_KEYS, isPerKgMetric } from '@/lib/gelato/calc';
import { formatMass, formatTemperature, type MassUnit } from '@/lib/gelato/mass';
import type { MetricKey, MetricResult, MetricStatus, RecipeResult } from '@/lib/gelato/types';

/** `MetricStatus` do motor para o vocabulário visual do site. */
const STATUS: Record<MetricStatus, RangeStatus> = {
  low: 'below',
  ok: 'in',
  high: 'above',
};

/** POD e PAC são valores por kg; o resto é fração da massa e se lê em porcentagem. */
function formatMetric(key: MetricKey, value: number, locale: Locale): string {
  return isPerKgMetric(key)
    ? formatNumber(value, locale, { maximumFractionDigits: 0 })
    : formatPercent(value * 100, locale);
}

interface BalancePanelProps {
  result: RecipeResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
  /** Resultado da última tentativa de equilibrar. */
  message: string | null;
  onAutoBalance: () => void;
}

/**
 * As oito métricas contra a faixa do tipo de base, mais a temperatura de
 * serviço. O painel inteiro é `aria-live`: o resultado muda a cada tecla e
 * quem usa leitor de tela precisa ouvir a consequência da edição.
 */
export function BalancePanel({
  result,
  dict,
  locale,
  unit,
  message,
  onAutoBalance,
}: BalancePanelProps) {
  const outOfRange = METRIC_KEYS.filter((key) => result.metrics[key].status !== 'ok');

  return (
    <section aria-live="polite" className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="label-caps text-accent-deep">{dict.balance.title}</h2>
        <Verdict result={result} dict={dict} count={outOfRange.length} />
      </div>

      <Readouts result={result} dict={dict} locale={locale} unit={unit} />

      <div className="mt-6">
        {METRIC_KEYS.map((key) => (
          <Metric key={key} metric={result.metrics[key]} dict={dict} locale={locale} />
        ))}
      </div>

      <CitationRef
        citations={[GELATO_CITATIONS.ranges]}
        labels={dict.sources}
        className="mt-4 block"
      />

      <AutoBalance
        dict={dict}
        message={message}
        disabled={result.isBalanced || result.totalGrams <= 0}
        onAutoBalance={onAutoBalance}
      />
    </section>
  );
}

function Verdict({
  result,
  dict,
  count,
}: {
  result: RecipeResult;
  dict: GelatoDictionary;
  count: number;
}) {
  if (result.totalGrams <= 0) {
    return <span className="text-sm text-ink-muted">{dict.balance.empty}</span>;
  }

  const label = result.isBalanced
    ? dict.balance.balanced
    : `${count} ${count === 1 ? dict.balance.outOfRangeOne : dict.balance.outOfRangeMany}`;

  return (
    <span
      className={`label-caps rounded-full px-2.5 py-1 ${
        result.isBalanced ? 'bg-ok-tint text-ok' : 'bg-warn-tint text-warn'
      }`}
    >
      <span aria-hidden="true">{result.isBalanced ? '✓ ' : '! '}</span>
      {label}
    </span>
  );
}

function Readouts({
  result,
  dict,
  locale,
  unit,
}: {
  result: RecipeResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
}) {
  const empty = result.totalGrams <= 0;

  return (
    <dl className="mt-4 grid gap-4 rounded-card border border-rule bg-surface px-5 py-4 sm:grid-cols-3">
      <Readout
        label={dict.balance.servingTemp}
        value={empty ? '—' : formatTemperature(result.servingTemp, locale)}
        hint={dict.balance.servingTempHint}
      />
      <Readout
        label={dict.balance.totalMass}
        value={formatMass(result.totalGrams, unit, locale)}
      />
      <Readout
        label={dict.balance.protein}
        value={empty ? '—' : formatPercent(result.proteinPercent * 100, locale)}
      />
    </dl>
  );
}

function Readout({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd data-numeric className="mt-1 text-lg leading-none font-semibold text-ink">
        {value}
      </dd>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{hint}</p>}
    </div>
  );
}

function Metric({
  metric,
  dict,
  locale,
}: {
  metric: MetricResult;
  dict: GelatoDictionary;
  locale: Locale;
}) {
  const status = STATUS[metric.status];
  const meta = dict.metrics[metric.key];
  const hint = dict.hints[metric.key];
  const scale = isPerKgMetric(metric.key) ? dict.balance.perKg : dict.balance.ofMass;

  return (
    <MetricRow
      label={meta.label}
      value={formatMetric(metric.key, metric.value, locale)}
      status={status}
      statusLabel={dict.balance.status[status]}
      range={`${dict.balance.recommended}: ${formatMetric(
        metric.key,
        metric.range.min,
        locale,
      )} – ${formatMetric(metric.key, metric.range.max, locale)} · ${scale}`}
      note={status === 'in' ? undefined : hint[status]}
    >
      <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">{meta.help}</p>
    </MetricRow>
  );
}

function AutoBalance({
  dict,
  message,
  disabled,
  onAutoBalance,
}: {
  dict: GelatoDictionary;
  message: string | null;
  disabled: boolean;
  onAutoBalance: () => void;
}) {
  return (
    <div className="mt-6 border-t border-rule pt-6">
      <button
        type="button"
        onClick={onAutoBalance}
        disabled={disabled}
        className="rounded-full border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-85 disabled:border-rule disabled:bg-paper-shade disabled:text-ink-muted"
      >
        {dict.balance.autoBalance}
      </button>

      {message && (
        <p className="mt-3 max-w-prose leading-relaxed font-semibold text-ink">{message}</p>
      )}

      <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
        {dict.balance.autoBalanceHint}
      </p>
    </div>
  );
}
