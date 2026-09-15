import { RANGES } from '@/data/pickles/ranges';
import { metricFromRule } from '@/lib/audit/metric';
import type { AuditMetric, AuditResult } from '@/lib/audit/types';

/**
 * O sal que a pessoa já pesou, conferido contra as faixas das fontes.
 *
 * A calculadora principal anda no sentido "quanto sal eu ponho". Esta seção é
 * a pergunta que vem depois, com o pote já montado: **isto está certo?** E é a
 * pergunta que mais importa nesta calculadora, porque a resposta não é óbvia —
 * a mesma quantidade de sal é 2% ou 1% conforme o que se conte no denominador,
 * e é exatamente esse engano que o BWF demonstra na p. 199.
 *
 * Por isso o modo de salmoura devolve as **duas** leituras, sobre o total e
 * sobre a água, como o motor já faz. Escolher uma seria escolher o lado do
 * engano.
 */
export interface PicklesAuditInput {
  mode: 'brine' | 'dry-salt';
  vegetableGrams: number;
  waterGrams: number;
  saltGrams: number;
}

export function auditPickles(input: PicklesAuditInput): AuditResult {
  const vegetable = positive(input.vegetableGrams);
  const water = positive(input.waterGrams);
  const salt = positive(input.saltGrams);

  if (input.mode === 'dry-salt') {
    return { metrics: keep([saltMetric('drySalt', salt, vegetable, 'dry-salt')]) };
  }

  const total = vegetable + water;

  return {
    metrics: keep([
      saltMetric('saltOfTotal', salt, total, 'brine-total'),
      saltMetric('saltOfWater', salt, water, 'brine-water'),
    ]),
  };
}

function saltMetric(
  labelKey: string,
  saltGrams: number,
  baseGrams: number,
  ruleKey: 'brine-total' | 'brine-water' | 'dry-salt',
): AuditMetric | null {
  // Sem base não há porcentagem: salga seca sem vegetal, ou salmoura sem água,
  // não são receitas com sal de menos — são receitas que ainda não existem.
  if (baseGrams <= 0) return null;

  return metricFromRule({
    labelKey,
    // O sal fica fora do denominador, como nas três obras: a porcentagem é
    // sobre a base, nunca sobre base + sal.
    value: (saltGrams / baseGrams) * 100,
    unit: 'percent',
    rule: RANGES[ruleKey],
    correction: {
      kind: 'dominant',
      subjectKey: 'salt',
      baseGrams,
      currentGrams: saltGrams,
    },
  });
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function keep(metrics: readonly (AuditMetric | null)[]): AuditMetric[] {
  return metrics.filter((metric) => metric !== null);
}
