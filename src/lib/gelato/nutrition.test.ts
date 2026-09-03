import { describe, expect, it } from 'vitest';

import { calculateNutrition } from './nutrition';
import type { Ingredient, RecipeItem } from './types';
import { INGREDIENTS } from '@/data/gelato/ingredients';

const CATALOG = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));

function item(ingredientId: string, grams: number): RecipeItem {
  return { id: `${ingredientId}-${grams}`, ingredientId, grams };
}

describe('calculateNutrition', () => {
  it('calcula energia por Atwater a partir da composição', () => {
    // 100 g de sacarose: 100 g de carboidrato, nada mais.
    const r = calculateNutrition([item('acucar-sacarose', 100)], CATALOG);
    expect(r.batch.carbs).toBeCloseTo(100, 4);
    expect(r.batch.kcal).toBeCloseTo(400, 4);
    expect(r.batch.fats).toBe(0);
  });

  it('separa gordura, proteína e carboidrato do leite integral', () => {
    // 1 kg de leite integral: 3,5% gordura, 3,5% proteína, 12,5% sólidos.
    const r = calculateNutrition([item('leite-integral', 1000)], CATALOG);
    expect(r.batch.fats).toBeCloseTo(35, 4);
    expect(r.batch.protein).toBeCloseTo(35, 4);
    expect(r.batch.carbs).toBeCloseTo(55, 4);
    expect(r.batch.kcal).toBeCloseTo(55 * 4 + 35 * 9 + 35 * 4, 4);
  });

  it('usa fator específico para polióis em vez de Atwater', () => {
    const r = calculateNutrition([item('eritritol', 100)], CATALOG);
    // Atwater daria 400 kcal; o fator do eritritol é 0,2 kcal/g.
    expect(r.batch.kcal).toBeCloseTo(20, 4);
    expect(r.batch.carbs).toBeCloseTo(100, 4);
    expect(r.adjustedIngredients).toEqual(['Eritritol']);
  });

  it('usa fator específico para fibras, ajustado pelo teor de sólidos', () => {
    // Polidextrose: 1 kcal/g de substância × 95% de sólidos = 0,95 kcal/g.
    const r = calculateNutrition([item('polidextrose-fibra', 100)], CATALOG);
    expect(r.batch.kcal).toBeCloseTo(95, 4);
    const inulina = calculateNutrition([item('inulina-fibra-vegetal', 100)], CATALOG);
    expect(inulina.batch.kcal).toBeCloseTo(190, 4);
  });

  it('zera a energia dos edulcorantes de alta intensidade', () => {
    const r = calculateNutrition([item('sucralose', 10)], CATALOG);
    expect(r.batch.kcal).toBe(0);
  });

  it('conta a energia do álcool, que não aparece nos sólidos', () => {
    const r = calculateNutrition([item('rum', 100)], CATALOG);
    expect(r.batch.kcal).toBeCloseTo(230, 4);
  });

  it('não lista nada quando nenhum ingrediente tem fator próprio', () => {
    const r = calculateNutrition([item('leite-integral', 500)], CATALOG);
    expect(r.adjustedIngredients).toEqual([]);
  });

  it('nomeia todos os ingredientes com fator próprio', () => {
    const r = calculateNutrition(
      [item('leite-integral', 500), item('eritritol', 80), item('neutro', 5)],
      CATALOG,
    );
    expect(r.adjustedIngredients).toEqual(['Eritritol', 'Neutro']);
  });

  it('escalona corretamente para 100 g e para a porção', () => {
    const r = calculateNutrition([item('acucar-sacarose', 500), item('agua', 500)], CATALOG);
    expect(r.batch.kcal).toBeCloseTo(2000, 4);
    expect(r.per100g.kcal).toBeCloseTo(200, 4);
    expect(r.perPortion.kcal).toBeCloseTo(100, 4);
    expect(r.portionGrams).toBe(50);
  });

  it('aceita porção customizada', () => {
    const r = calculateNutrition([item('acucar-sacarose', 1000)], CATALOG, 100);
    expect(r.perPortion.kcal).toBeCloseTo(400, 4);
    expect(r.portionGrams).toBe(100);
  });

  it('reporta zero em receita vazia sem dividir por zero', () => {
    const r = calculateNutrition([], CATALOG);
    expect(r.batch.kcal).toBe(0);
    expect(Number.isFinite(r.per100g.kcal)).toBe(true);
    expect(r.per100g.kcal).toBe(0);
  });

  it('ignora ingredientes fora do catálogo', () => {
    const r = calculateNutrition([item('nao-existe', 500)], CATALOG);
    expect(r.batch.kcal).toBe(0);
    // A massa continua contando: quem recebe a receita ainda tem 500 g na tigela.
    expect(r.batchGrams).toBe(500);
  });

  it('mantém açúcares como subconjunto dos carboidratos', () => {
    const r = calculateNutrition(
      [item('leite-integral', 600), item('acucar-sacarose', 120), item('eritritol', 80)],
      CATALOG,
    );
    expect(r.batch.sugars).toBeLessThanOrEqual(r.batch.carbs + 1e-6);
  });

  it('nunca produz macronutriente negativo', () => {
    for (const ingredient of INGREDIENTS) {
      const r = calculateNutrition([item(ingredient.id, 100)], CATALOG);
      expect(r.batch.carbs, ingredient.name).toBeGreaterThanOrEqual(0);
      expect(r.batch.kcal, ingredient.name).toBeGreaterThanOrEqual(0);
    }
  });

  it('mantém a energia de qualquer ingrediente num intervalo plausível', () => {
    // Nada na tabela deve passar de 9 kcal/g (gordura pura é o teto).
    for (const ingredient of INGREDIENTS) {
      const r = calculateNutrition([item(ingredient.id, 100)], CATALOG);
      expect(r.batch.kcal / 100, ingredient.name).toBeLessThanOrEqual(9.01);
    }
  });
});
