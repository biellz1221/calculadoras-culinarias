import { describe, expect, it } from 'vitest';

import { autoBalance } from './balance';
import { calculateRecipe } from './calc';
import type { Ingredient, RecipeItem, RecipeType } from './types';
import { INGREDIENTS } from '@/data/gelato/ingredients';
import { RECIPE_TYPES } from '@/data/gelato/recipe-types';

const CATALOG = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));

function typeById(id: string): RecipeType {
  const found = RECIPE_TYPES.find((t) => t.id === id);
  if (!found) throw new Error(`tipo ${id} não existe`);
  return found;
}

/** Fior di latte equilibrado, com o morango adicionado pelo usuário desequilibrando tudo. */
const COM_FRUTA: RecipeItem[] = [
  { id: 'leite', ingredientId: 'leite-integral', grams: 600 },
  { id: 'creme', ingredientId: 'creme-de-leite-fresco-35', grams: 100 },
  { id: 'po', ingredientId: 'leite-em-po-desnatado', grams: 35 },
  { id: 'sacarose', ingredientId: 'acucar-sacarose', grams: 120 },
  { id: 'dextrose', ingredientId: 'acucar-dextrose', grams: 40 },
  { id: 'neutro', ingredientId: 'neutro', grams: 5 },
  { id: 'morango', ingredientId: 'morango', grams: 400 },
];

describe('autoBalance', () => {
  it('equilibra a receita mexendo só nas linhas livres', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    expect(outcome.solved).toBe(true);
    expect(outcome.remaining).toEqual([]);
  });

  it('não toca na linha que o usuário acabou de editar', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    const morango = outcome.items.find((i) => i.id === 'morango');
    expect(morango?.grams).toBe(400);
  });

  it('leva a massa total para perto da meta do lote', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    const total = outcome.items.reduce((sum, i) => sum + i.grams, 0);
    expect(total).toBeGreaterThan(1100 * 0.94);
    expect(total).toBeLessThan(1100 * 1.06);
  });

  it('confirma o equilíbrio pelo motor de cálculo', () => {
    const recipeType = typeById('gelato-leite-fruta');
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType,
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    const result = calculateRecipe(outcome.items, CATALOG, recipeType);
    expect(result.isBalanced).toBe(true);
  });

  it('nunca produz quantidade negativa', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('sorbet'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    for (const item of outcome.items) {
      expect(item.grams, item.ingredientId).toBeGreaterThanOrEqual(0);
    }
  });

  it('é determinístico: mesma entrada, mesma saída', () => {
    const input = {
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    };
    expect(autoBalance(input).items).toEqual(autoBalance(input).items);
  });

  it('não mexe em nada quando a receita já está equilibrada', () => {
    const equilibrada: RecipeItem[] = [
      { id: 'a', ingredientId: 'leite-integral', grams: 600 },
      { id: 'b', ingredientId: 'creme-de-leite-fresco-35', grams: 100 },
      { id: 'c', ingredientId: 'leite-em-po-desnatado', grams: 35 },
      { id: 'd', ingredientId: 'acucar-sacarose', grams: 120 },
      { id: 'e', ingredientId: 'acucar-dextrose', grams: 40 },
      { id: 'f', ingredientId: 'neutro', grams: 5 },
    ];
    const outcome = autoBalance({
      items: equilibrada,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite'),
      fixedItemIds: new Set(),
      targetGrams: 900,
    });
    expect(outcome.changed).toBe(false);
    expect(outcome.solved).toBe(true);
  });

  it('relata honestamente quando não consegue resolver', () => {
    // Só água e morango: sem açúcar nenhum, não há como atingir a faixa de sorbet.
    const impossivel: RecipeItem[] = [
      { id: 'agua', ingredientId: 'agua', grams: 500 },
      { id: 'morango', ingredientId: 'morango', grams: 500 },
    ];
    const outcome = autoBalance({
      items: impossivel,
      catalog: CATALOG,
      recipeType: typeById('sorbet'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });
    expect(outcome.solved).toBe(false);
    expect(outcome.remaining.length).toBeGreaterThan(0);
  });

  it('não quebra quando todas as linhas estão travadas', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(COM_FRUTA.map((i) => i.id)),
      targetGrams: 1100,
    });
    expect(outcome.changed).toBe(false);
    expect(outcome.items).toHaveLength(COM_FRUTA.length);
  });

  it('ignora linhas que apontam para fora do catálogo', () => {
    const comFantasma: RecipeItem[] = [
      ...COM_FRUTA,
      { id: 'fantasma', ingredientId: 'nao-existe', grams: 50 },
    ];
    const outcome = autoBalance({
      items: comFantasma,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });
    // Mexer numa linha sem composição não muda métrica nenhuma: o otimizador não
    // deve tentar usá-la como alavanca.
    expect(outcome.items.find((i) => i.id === 'fantasma')?.grams).toBe(50);
  });
});

describe('margem de segurança', () => {
  it('para com folga dentro da faixa, não em cima da borda', () => {
    const recipeType = typeById('gelato-leite-fruta');
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType,
      fixedItemIds: new Set(['morango']),
      targetGrams: 1100,
    });

    const result = calculateRecipe(outcome.items, CATALOG, recipeType);
    for (const metric of Object.values(result.metrics)) {
      const width = metric.range.max - metric.range.min;
      if (width === 0) continue;
      const folga = Math.min(metric.value - metric.range.min, metric.range.max - metric.value);
      // Pelo menos 1% da largura da faixa de distância de qualquer borda.
      expect(folga / width, metric.key).toBeGreaterThan(0.01);
    }
  });
});

describe('limites por linha', () => {
  it('não zera ingredientes funcionais como o neutro', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 4400,
    });

    const neutro = outcome.items.find((i) => i.id === 'neutro');
    expect(neutro?.grams).toBeGreaterThan(0);
  });

  it('mantém cada linha dentro de 0,25x e 4x do valor original', () => {
    const outcome = autoBalance({
      items: COM_FRUTA,
      catalog: CATALOG,
      recipeType: typeById('gelato-leite-fruta'),
      fixedItemIds: new Set(['morango']),
      targetGrams: 4400,
    });

    for (const item of outcome.items) {
      const original = COM_FRUTA.find((i) => i.id === item.id);
      if (!original || original.grams === 0) continue;
      expect(item.grams / original.grams, item.ingredientId).toBeGreaterThanOrEqual(0.24);
      expect(item.grams / original.grams, item.ingredientId).toBeLessThanOrEqual(4.01);
    }
  });
});
