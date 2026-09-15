import { PASTA_RANGES } from '@/data/pasta/ranges';
import { metricFromRule } from '@/lib/audit/metric';
import type { AuditMetric, AuditResult } from '@/lib/audit/types';

/**
 * A massa que a pessoa já sova, medida contra as proporções das fontes.
 *
 * As duas bases são coisas diferentes e não se misturam. Massa de ovo se lê em
 * gramas de farinha por grama de ovo — é a razão do Zielonka, da Hazan e do
 * Ratio. Massa de água se lê em hidratação, como pão. Quem escolhe a base é
 * quem está fazendo a massa: as duas leituras sobre a mesma receita dariam um
 * número certo e um sem sentido.
 */
export type PastaBase = 'egg' | 'water';

export interface PastaAuditInput {
  base: PastaBase;
  flourGrams: number;
  eggGrams: number;
  waterGrams: number;
}

export function auditPasta(input: PastaAuditInput): AuditResult {
  const flour = positive(input.flourGrams);
  const egg = positive(input.eggGrams);
  const water = positive(input.waterGrams);

  if (input.base === 'egg') {
    // Sem ovo não há razão farinha:ovo. É massa de água, e a pessoa escolheu
    // a régua errada — dizer isso é o silêncio, não um zero.
    if (egg <= 0) return { metrics: [] };

    return {
      metrics: keep([
        metricFromRule({
          labelKey: 'flourPerEgg',
          value: flour / egg,
          unit: 'ratio',
          rule: PASTA_RANGES['flour-per-egg-mass'],
          correction: {
            kind: 'dominant',
            subjectKey: 'flour',
            baseGrams: egg,
            currentGrams: flour,
          },
        }),
      ]),
    };
  }

  if (flour <= 0) return { metrics: [] };

  return {
    metrics: keep([
      metricFromRule({
        labelKey: 'waterHydration',
        value: (water / flour) * 100,
        unit: 'percent',
        rule: PASTA_RANGES['water-hydration'],
        correction: {
          kind: 'dominant',
          subjectKey: 'water',
          baseGrams: flour,
          currentGrams: water,
        },
      }),
    ]),
  };
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function keep(metrics: readonly (AuditMetric | null)[]): AuditMetric[] {
  return metrics.filter((metric) => metric !== null);
}
