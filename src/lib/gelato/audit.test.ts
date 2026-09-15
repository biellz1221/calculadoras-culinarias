import { describe, expect, it } from 'vitest';

import { correctionForMetric } from './audit';
import { calculateRecipe } from './calc';
import type { Ingredient, MetricKey, RecipeItem, RecipeType } from './types';
import { INGREDIENTS } from '@/data/gelato/ingredients';
import { RECIPE_TYPES } from '@/data/gelato/recipe-types';

const CATALOG = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));

function typeById(id: string): RecipeType {
  const found = RECIPE_TYPES.find((t) => t.id === id);
  if (!found) throw new Error(`tipo ${id} não existe`);
  return found;
}

/** Fior di latte com 400 g de morango por cima: nada mais fecha. */
const COM_FRUTA: RecipeItem[] = [
  { id: 'leite', ingredientId: 'leite-integral', grams: 600 },
  { id: 'creme', ingredientId: 'creme-de-leite-fresco-35', grams: 100 },
  { id: 'po', ingredientId: 'leite-em-po-desnatado', grams: 35 },
  { id: 'sacarose', ingredientId: 'acucar-sacarose', grams: 120 },
  { id: 'dextrose', ingredientId: 'acucar-dextrose', grams: 40 },
  { id: 'neutro', ingredientId: 'neutro', grams: 5 },
  { id: 'morango', ingredientId: 'morango', grams: 400 },
];

function resultOf(items: RecipeItem[], typeId = 'gelato-leite-fruta') {
  return calculateRecipe(items, CATALOG, typeById(typeId));
}

describe('correctionForMetric', () => {
  it('não sugere nada para a métrica que já está na faixa', () => {
    const result = resultOf(COM_FRUTA);
    const inRange = Object.values(result.metrics).find(
      (metric) => metric.status === 'ok',
    );

    expect(inRange).toBeDefined();
    expect(correctionForMetric(inRange!, result.totalGrams)).toBeNull();
  });

  it('traduz a faixa de uma fração para gramas do lote', () => {
    const result = resultOf(COM_FRUTA);
    const outOfRange = Object.values(result.metrics).find(
      (metric) => metric.status !== 'ok' && metric.key !== 'pod' && metric.key !== 'pac',
    );

    expect(outOfRange).toBeDefined();
    const target = correctionForMetric(outOfRange!, result.totalGrams)!;

    expect(target.min).toBeCloseTo(outOfRange!.range.min * result.totalGrams, 6);
    expect(target.max).toBeCloseTo(outOfRange!.range.max * result.totalGrams, 6);
  });

  it('trata POD e PAC como valor por quilo, não como fração', () => {
    const result = resultOf(COM_FRUTA);

    for (const key of ['pod', 'pac'] as MetricKey[]) {
      const metric = result.metrics[key];
      if (metric.status === 'ok') continue;

      const target = correctionForMetric(metric, result.totalGrams)!;
      expect(target.min).toBeCloseTo(
        (metric.range.min * result.totalGrams) / 1000,
        6,
      );
    }
  });

  it('o alvo sugerido é exatamente a faixa, relida no mesmo lote', () => {
    // O invariante que dá sentido à sugestão: pôr a grandeza em qualquer ponto
    // do alvo, com o lote do tamanho que está, devolve a métrica na faixa.
    const result = resultOf(COM_FRUTA);

    for (const metric of Object.values(result.metrics)) {
      const target = correctionForMetric(metric, result.totalGrams);
      if (!target) continue;

      const perGram =
        metric.key === 'pod' || metric.key === 'pac'
          ? result.totalGrams / 1000
          : result.totalGrams;

      expect(target.min / perGram).toBeGreaterThanOrEqual(metric.range.min - 1e-9);
      expect(target.max / perGram).toBeLessThanOrEqual(metric.range.max + 1e-9);
    }
  });

  it('cala a boca quando não há lote', () => {
    const result = resultOf(COM_FRUTA);
    const outOfRange = Object.values(result.metrics).find(
      (metric) => metric.status !== 'ok',
    )!;

    expect(correctionForMetric(outOfRange, 0)).toBeNull();
    expect(correctionForMetric(outOfRange, Number.NaN)).toBeNull();
  });
});
