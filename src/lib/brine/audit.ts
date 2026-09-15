import { getMethod } from '@/data/brine/methods';
import type { BrineMethod } from '@/data/brine/types';
import { metricFromPoint } from '@/lib/audit/metric';
import type { AuditMetric, AuditResult } from '@/lib/audit/types';

/**
 * A salmoura que a pessoa já preparou, comparada com a receita do método.
 *
 * Tudo aqui é proporção sobre o peso da proteína, que é a coluna "SCALING" das
 * receitas do Modernist. Como lá, a referência é uma receita publicada e não
 * uma faixa: a tela diz "acima da fonte", não "fora da faixa".
 *
 * Método seco não tem líquido nem açúcar, e essas leituras somem em vez de
 * comparar contra zero — uma salmoura com água não está "errada", está em
 * outro método.
 */
export interface BrineAuditInput {
  methodId: string;
  proteinGrams: number;
  saltGrams: number;
  liquidGrams: number;
  sugarGrams: number;
}

/**
 * Cinco centésimos de ponto percentual: meio grama de sal por quilo de carne.
 *
 * As receitas do Modernist publicam pesos inteiros em grama — 12 g de sal para
 * 2 kg de frango —, então meio grama é mais fino que qualquer diferença que a
 * fonte saiba expressar. Abaixo disso, duas receitas são a mesma receita.
 */
const TOLERANCE_PERCENT = 0.05;

export function auditBrine(input: BrineAuditInput): AuditResult {
  const method = getMethod(input.methodId);
  if (!method) return { metrics: [] };

  const protein = positive(input.proteinGrams);
  if (protein <= 0) return { metrics: [] };

  return {
    metrics: keep([
      share('saltRatio', 'salt', method.salt, input.saltGrams, protein, method),
      // Zero na fonte não é alvo: é a declaração de que este método não usa o
      // ingrediente. Comparar com ele diria "acima da fonte" para qualquer
      // pitada de açúcar numa salga seca, o que não é informação.
      method.liquid > 0
        ? share('liquidRatio', 'liquid', method.liquid, input.liquidGrams, protein, method)
        : null,
      method.sugar > 0
        ? share('sugarRatio', 'sugar', method.sugar, input.sugarGrams, protein, method)
        : null,
    ]),
  };
}

function share(
  labelKey: string,
  subjectKey: string,
  reference: number,
  grams: number,
  proteinGrams: number,
  method: BrineMethod,
): AuditMetric | null {
  const currentGrams = positive(grams);

  return metricFromPoint({
    labelKey,
    value: (currentGrams / proteinGrams) * 100,
    unit: 'percent',
    point: reference * 100,
    tolerance: TOLERANCE_PERCENT,
    citations: method.citations,
    correction: {
      kind: 'dominant',
      subjectKey,
      baseGrams: proteinGrams,
      currentGrams,
    },
  });
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function keep(metrics: readonly (AuditMetric | null)[]): AuditMetric[] {
  return metrics.filter((metric) => metric !== null);
}
