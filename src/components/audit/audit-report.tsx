'use client';

import { CitationRef, type CitationLabels } from '@/components/citation';
import { MetricRow } from '@/components/range-badge';
import { fillTemplate } from '@/i18n/format';
import type { Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import type { AuditMetric, MetricUnit } from '@/lib/audit/types';
import { labelFor } from '@/lib/recipes/card';
import { useFormatters, type Formatters } from '@/lib/use-formatters';

/**
 * O resultado de "confira a sua receita", igual nas nove calculadoras.
 *
 * Cada métrica sai como uma linha do painel de balanço — o mesmo componente que
 * a calculadora usa no sentido direto, de propósito: quem já leu uma faixa ali
 * não precisa aprender outra leitura aqui.
 *
 * Rótulo e sujeito chegam como **chave**, não como texto, e são lidos por
 * `labelFor()`. A chave vem de dado, e dado acaba em lugares onde ninguém
 * previu: ler `dicionario[chave]` direto devolve o `Object.prototype` para
 * `'__proto__'`, e o React derruba a página ao receber um objeto como filho.
 */
export function AuditReport({
  metrics,
  labels,
  copy,
  citationLabels,
  locale,
}: {
  metrics: readonly AuditMetric[];
  /** Rótulos de métrica e nomes de ingrediente da calculadora que chamou. */
  labels: Record<string, string>;
  copy: Dictionary['audit'];
  citationLabels: CitationLabels;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);

  if (metrics.length === 0) {
    return (
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
        {copy.empty}
      </p>
    );
  }

  return (
    <div className="mt-4">
      {metrics.map((metric) => (
        <MetricRow
          key={metric.labelKey}
          label={labelFor(labels, metric.labelKey)}
          value={formatMetricValue(metric.value, metric.unit, fmt)}
          status={metric.status}
          statusLabel={statusLabelFor(metric, copy)}
          beyondHardLimit={metric.beyondHardLimit}
          range={referenceTextFor(metric, copy, fmt)}
        >
          {metric.correction && (
            <p className="mt-2 max-w-prose rounded-card bg-accent-tint px-4 py-3 text-sm leading-relaxed text-accent-deep">
              {correctionTextFor(metric, labels, copy, fmt)}
            </p>
          )}

          <CitationRef
            citations={metric.citations}
            labels={citationLabels}
            className="mt-2 block"
          />
        </MetricRow>
      ))}
    </div>
  );
}

export function formatMetricValue(
  value: number,
  unit: MetricUnit,
  fmt: Formatters,
): string {
  if (unit === 'percent') return fmt.percent(value);
  if (unit === 'ppm') {
    return `${fmt.number(value, { maximumFractionDigits: 0 })} ppm`;
  }
  // Proporção entre massas não tem unidade, e escrever uma convidaria alguém a
  // converter o que não se converte.
  return fmt.number(value, { maximumFractionDigits: 2 });
}

function statusLabelFor(metric: AuditMetric, copy: Dictionary['audit']): string {
  if (metric.beyondHardLimit) return copy.hardLimit;

  const table = metric.referenceKind === 'point' ? copy.pointStatus : copy.status;
  return table[metric.status];
}

function referenceTextFor(
  metric: AuditMetric,
  copy: Dictionary['audit'],
  fmt: Formatters,
): string {
  const value = (amount: number) => formatMetricValue(amount, metric.unit, fmt);

  if (metric.referenceKind === 'point') {
    return fillTemplate(copy.referencePoint, { value: value(metric.reference.min) });
  }

  return fillTemplate(copy.referenceRange, {
    min: value(metric.reference.min),
    max: value(metric.reference.max),
  });
}

function correctionTextFor(
  metric: AuditMetric,
  labels: Record<string, string>,
  copy: Dictionary['audit'],
  fmt: Formatters,
): string {
  const correction = metric.correction;
  if (!correction) return '';

  const subject = labelFor(labels, correction.subjectKey);
  const { min, max } = correction.targetGrams;

  // As duas pontas exibindo a mesma coisa é o que decide a frase, e não o
  // número por trás: faixa que colapsa no arredondamento vira ponto na tela, e
  // "entre 40 g e 40 g" não é frase que alguém escreveria.
  const low = fmt.mass(min);
  const high = fmt.mass(max);

  if (low === high) {
    return fillTemplate(copy.correctionPoint, { subject, value: low });
  }

  return fillTemplate(copy.correctionRange, { subject, min: low, max: high });
}
