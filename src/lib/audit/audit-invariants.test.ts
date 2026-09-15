import { describe, expect, it } from 'vitest';

import { scaleOf } from './solve';
import type { AuditMetric, AuditResult } from './types';
import { JAM_FRUITS } from '@/data/jam/fruits';
import { auditBrine } from '@/lib/brine/audit';
import { auditBread } from '@/lib/bread/audit';
import { auditCure } from '@/lib/curing/audit';
import { auditGanache } from '@/lib/ganache/audit';
import { auditGellingDose } from '@/lib/gelling/audit';
import { auditJam } from '@/lib/jam/audit';
import { auditPasta } from '@/lib/pasta/audit';
import { auditPickles } from '@/lib/pickles/audit';
import type { LineRole, ScaleLine } from '@/lib/bread/scale';
import { calculateRecipe } from '@/lib/gelato/calc';
import { correctionForMetric } from '@/lib/gelato/audit';
import { INGREDIENTS } from '@/data/gelato/ingredients';
import { RECIPE_TYPES } from '@/data/gelato/recipe-types';
import type { Ingredient } from '@/lib/gelato/types';

/**
 * Os invariantes que valem nas nove calculadoras, conferidos nas nove de uma
 * vez.
 *
 * Existe porque a validação do `__proto__` existia em três das quatro
 * calculadoras de então, e a que faltava era justamente a que quebrava. Um
 * teste por calculadora não pega isso — pega o teste que roda sobre a tabela
 * inteira e falha quando alguém acrescenta a décima sem o resto.
 */

const STRAWBERRY = JAM_FRUITS.find((fruit) => fruit.id === 'strawberry')!;

function breadLine(name: string, grams: number, role: LineRole): ScaleLine {
  return { id: name, name, grams, role, fromMilliliters: false };
}

/** Cada calculadora, com uma receita **fora** da faixa: é onde há correção. */
const AUDITS: readonly {
  calculator: string;
  run: () => AuditResult;
}[] = [
  {
    calculator: 'bread',
    run: () =>
      auditBread([
        breadLine('Farinha', 1000, 'flour'),
        breadLine('Água', 500, 'water'),
        breadLine('Sal', 5, 'salt'),
      ]),
  },
  {
    calculator: 'pasta',
    run: () =>
      auditPasta({ base: 'egg', flourGrams: 400, eggGrams: 150, waterGrams: 0 }),
  },
  {
    calculator: 'pickles',
    run: () =>
      auditPickles({
        mode: 'brine',
        vegetableGrams: 1000,
        waterGrams: 1000,
        saltGrams: 20,
      }),
  },
  {
    calculator: 'jam',
    run: () =>
      auditJam(STRAWBERRY, { fruitGrams: 1000, sugarGrams: 300, pectinGrams: 30 }),
  },
  {
    calculator: 'curing',
    run: () =>
      auditCure({
        meatGrams: 1000,
        cureId: 'cure-1',
        cureGrams: 1,
        method: 'comminuted',
      }),
  },
  {
    calculator: 'brine',
    run: () =>
      auditBrine({
        methodId: 'equilibrium-poultry',
        proteinGrams: 2000,
        saltGrams: 40,
        liquidGrams: 500,
        sugarGrams: 0,
      }),
  },
  {
    calculator: 'ganache',
    run: () =>
      auditGanache({
        textureId: 'cut',
        softGrams: 100,
        chocolateGrams: 250,
        butterGrams: 50,
      }),
  },
  {
    calculator: 'gelling',
    run: () =>
      auditGellingDose({
        liquidGrams: 500,
        agentId: 'agar',
        agentGrams: 1,
        textureId: 'puree',
      }),
  },
];

/** A mesma entrada, com todo número trocado por lixo. */
const BROKEN_NUMBERS = [Number.NaN, Number.POSITIVE_INFINITY, -1000];

const BROKEN_AUDITS: readonly {
  calculator: string;
  run: (value: number) => AuditResult;
}[] = [
  {
    calculator: 'bread',
    run: (value) =>
      auditBread([
        breadLine('Farinha', value, 'flour'),
        breadLine('Água', value, 'water'),
      ]),
  },
  {
    calculator: 'pasta',
    run: (value) =>
      auditPasta({
        base: 'egg',
        flourGrams: value,
        eggGrams: value,
        waterGrams: value,
      }),
  },
  {
    calculator: 'pickles',
    run: (value) =>
      auditPickles({
        mode: 'brine',
        vegetableGrams: value,
        waterGrams: value,
        saltGrams: value,
      }),
  },
  {
    calculator: 'jam',
    run: (value) =>
      auditJam(STRAWBERRY, {
        fruitGrams: value,
        sugarGrams: value,
        pectinGrams: value,
      }),
  },
  {
    calculator: 'curing',
    run: (value) =>
      auditCure({
        meatGrams: value,
        cureId: 'cure-1',
        cureGrams: value,
        method: 'comminuted',
      }),
  },
  {
    calculator: 'brine',
    run: (value) =>
      auditBrine({
        methodId: 'equilibrium-poultry',
        proteinGrams: value,
        saltGrams: value,
        liquidGrams: value,
        sugarGrams: value,
      }),
  },
  {
    calculator: 'ganache',
    run: (value) =>
      auditGanache({
        textureId: 'cut',
        softGrams: value,
        chocolateGrams: value,
        butterGrams: value,
      }),
  },
  {
    calculator: 'gelling',
    run: (value) =>
      auditGellingDose({
        liquidGrams: value,
        agentId: 'agar',
        agentGrams: value,
        textureId: 'puree',
      }),
  },
];

describe.each(AUDITS)('invariantes de $calculator', ({ run }) => {
  it('não emite métrica sem citação', () => {
    // Número sem fonte é a única coisa que este site não publica.
    for (const metric of run().metrics) {
      expect(metric.citations.length).toBeGreaterThan(0);
    }
  });

  it('emite pelo menos uma métrica para a receita de exemplo', () => {
    // Senão os outros invariantes passariam sobre lista vazia.
    expect(run().metrics.length).toBeGreaterThan(0);
  });

  it('só sugere correção onde há o que corrigir', () => {
    for (const metric of run().metrics) {
      if (metric.status === 'in') expect(metric.correction).toBeUndefined();
    }
  });

  it('a correção sugerida resolve a métrica que ela corrige', () => {
    // O invariante que dá sentido à sugestão: pôr o ingrediente em qualquer
    // ponto do alvo faz o valor cair dentro da referência.
    for (const metric of run().metrics) {
      if (!metric.correction) continue;

      const base = baseImpliedBy(metric);
      for (const grams of [
        metric.correction.targetGrams.min,
        metric.correction.targetGrams.max,
      ]) {
        const value = (grams * scaleOf(metric.unit)) / base;
        expect(value).toBeGreaterThanOrEqual(metric.reference.min - 1e-6);
        expect(value).toBeLessThanOrEqual(metric.reference.max + 1e-6);
      }
    }
  });

  it('nunca aponta um alvo negativo', () => {
    for (const metric of run().metrics) {
      if (!metric.correction) continue;
      expect(metric.correction.targetGrams.min).toBeGreaterThanOrEqual(0);
    }
  });

  it('não marca limite duro onde a fonte não declarou um', () => {
    for (const metric of run().metrics) {
      if (!metric.beyondHardLimit) continue;
      const declared =
        metric.reference.hardMin !== undefined ||
        metric.reference.hardMax !== undefined;
      expect(declared).toBe(true);
    }
  });
});

describe.each(BROKEN_AUDITS)('entrada estragada em $calculator', ({ run }) => {
  it.each(BROKEN_NUMBERS)('não deixa %s virar número na tela', (value) => {
    // Tudo que vem de URL, de localStorage ou de um campo vazio é entrada não
    // confiável. Meia leitura na tela é pior que nenhuma.
    for (const metric of run(value).metrics) {
      expect(Number.isFinite(metric.value)).toBe(true);
      expect(Number.isFinite(metric.reference.min)).toBe(true);
      expect(Number.isFinite(metric.reference.max)).toBe(true);

      if (metric.correction) {
        expect(Number.isFinite(metric.correction.targetGrams.min)).toBe(true);
        expect(Number.isFinite(metric.correction.targetGrams.max)).toBe(true);
      }
    }
  });
});

/**
 * De volta à base que a métrica usou, a partir do valor e do peso atual.
 *
 * O contrato não carrega a base — de propósito, porque ela é diferente em cada
 * calculadora. Aqui ela é redescoberta para conferir a sugestão sem que o teste
 * precise saber o que é farinha, fruta ou substância mole.
 */
function baseImpliedBy(metric: AuditMetric): number {
  const current = metric.correction!.currentGrams;
  if (current > 0 && metric.value > 0) {
    return (current * scaleOf(metric.unit)) / metric.value;
  }
  throw new Error('métrica sem peso atual não permite conferir a sugestão');
}

describe('invariantes de gelato', () => {
  const catalog = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));
  const type = RECIPE_TYPES.find((item) => item.id === 'gelato-leite-fruta')!;
  const result = calculateRecipe(
    [
      { id: 'leite', ingredientId: 'leite-integral', grams: 600 },
      { id: 'sacarose', ingredientId: 'acucar-sacarose', grams: 120 },
      { id: 'morango', ingredientId: 'morango', grams: 400 },
    ],
    catalog,
    type,
  );

  it('só sugere correção onde há o que corrigir', () => {
    for (const metric of Object.values(result.metrics)) {
      if (metric.status === 'ok') {
        expect(correctionForMetric(metric, result.totalGrams)).toBeNull();
      }
    }
  });

  it('nunca aponta um alvo negativo nem não numérico', () => {
    for (const metric of Object.values(result.metrics)) {
      const target = correctionForMetric(metric, result.totalGrams);
      if (!target) continue;

      expect(Number.isFinite(target.min)).toBe(true);
      expect(target.min).toBeGreaterThanOrEqual(0);
    }
  });
});
