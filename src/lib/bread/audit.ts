import { flourGramsOf, type LineRole, type ScaleLine } from './scale';
import { RANGES } from '@/data/bread/ranges';
import { metricFromRule } from '@/lib/audit/metric';
import type { AuditResult } from '@/lib/audit/types';

/**
 * A leitura em porcentagem de padeiro de uma receita trazida de fora, com o
 * peso que traria cada número de volta para a faixa.
 *
 * As duas métricas são as duas que o classificador de linhas sabe identificar.
 * Açúcar e gordura têm faixa publicada em `RANGES` e ficam de fora mesmo assim:
 * `LineRole` não os separa de "outro", e adivinhar o papel para preencher a
 * tabela daria porcentagem de algo que ninguém declarou. Ampliar o
 * classificador é trabalho de outra tarefa — e daquelas que pedem cuidado,
 * porque foi assim que "leite integral" virou farinha uma vez.
 */
export function auditBread(lines: readonly ScaleLine[]): AuditResult {
  const flourGrams = flourGramsOf(lines);
  // Sem farinha não há régua de 100%, e o resto da conta seria porcentagem de
  // nada. É o mesmo silêncio que `scaleRecipe` já faz com a análise inteira.
  if (flourGrams <= 0) return { metrics: [] };

  const waterGrams = sumRole(lines, 'water');
  const saltGrams = sumRole(lines, 'salt');

  const metrics = [
    metricFromRule({
      labelKey: 'hydration',
      value: (waterGrams / flourGrams) * 100,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: {
        kind: 'dominant',
        subjectKey: 'water',
        baseGrams: flourGrams,
        currentGrams: waterGrams,
      },
    }),
    metricFromRule({
      labelKey: 'saltPercent',
      value: (saltGrams / flourGrams) * 100,
      unit: 'percent',
      rule: RANGES.salt,
      correction: {
        kind: 'dominant',
        subjectKey: 'salt',
        baseGrams: flourGrams,
        currentGrams: saltGrams,
      },
    }),
  ];

  return { metrics: metrics.filter((metric) => metric !== null) };
}

function sumRole(lines: readonly ScaleLine[], role: LineRole): number {
  return lines.reduce(
    (total, line) =>
      line.role === role && Number.isFinite(line.grams) ? total + line.grams : total,
    0,
  );
}
