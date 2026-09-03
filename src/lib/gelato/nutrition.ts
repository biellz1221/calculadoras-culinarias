import { ATWATER, ENERGY_OVERRIDES, PORTION_GRAMS } from '@/data/gelato/energy';
import type { Ingredient, RecipeItem } from './types';

export interface NutritionFacts {
  readonly kcal: number;
  readonly carbs: number;
  readonly sugars: number;
  readonly fats: number;
  readonly protein: number;
}

export interface NutritionResult {
  readonly batch: NutritionFacts;
  readonly per100g: NutritionFacts;
  readonly perPortion: NutritionFacts;
  readonly portionGrams: number;
  /** Massa total considerada, em gramas. */
  readonly batchGrams: number;
  /** Ingredientes desta receita que usaram fator próprio em vez de Atwater. */
  readonly adjustedIngredients: readonly string[];
  /**
   * Os mesmos ingredientes, por `id`. `adjustedIngredients` traz o nome como
   * está na planilha, que é pt-BR; a interface é bilíngue e precisa da chave
   * para buscar o rótulo no dicionário do idioma.
   */
  readonly adjustedIngredientIds: readonly string[];
}

const EMPTY: NutritionFacts = { kcal: 0, carbs: 0, sugars: 0, fats: 0, protein: 0 };

/**
 * Carboidratos por diferença, como se faz em rotulagem: o que sobra dos sólidos
 * totais depois de tirar gordura e proteína. Inclui açúcares, lactose, fibras e
 * polióis, que aparecem como carboidrato mesmo quando rendem pouca energia.
 */
function carbsPerGram(ingredient: Ingredient): number {
  return Math.max(0, ingredient.totalSolids - ingredient.fats - ingredient.protein);
}

/**
 * Energia de 1 g do ingrediente. Atwater é o padrão, mas quem tem fator próprio
 * em ENERGY_OVERRIDES usa o fator: para poliol, fibra e álcool Atwater erra por
 * um fator de vinte (ver o comentário em data/gelato/energy.ts).
 */
function kcalPerGram(ingredient: Ingredient): number {
  const override = ENERGY_OVERRIDES[ingredient.id];
  if (override !== undefined) return override;
  return (
    carbsPerGram(ingredient) * ATWATER.carbs +
    ingredient.fats * ATWATER.fats +
    ingredient.protein * ATWATER.protein
  );
}

function scale(facts: NutritionFacts, factor: number): NutritionFacts {
  return {
    kcal: facts.kcal * factor,
    carbs: facts.carbs * factor,
    sugars: facts.sugars * factor,
    fats: facts.fats * factor,
    protein: facts.protein * factor,
  };
}

interface Accumulated {
  readonly facts: NutritionFacts;
  readonly totalGrams: number;
  readonly adjustedIngredients: readonly string[];
  readonly adjustedIngredientIds: readonly string[];
}

function accumulateFacts(
  items: readonly RecipeItem[],
  catalog: ReadonlyMap<string, Ingredient>,
): Accumulated {
  let kcal = 0;
  let carbs = 0;
  let sugars = 0;
  let fats = 0;
  let protein = 0;
  let totalGrams = 0;
  const adjustedIngredients: string[] = [];
  const adjustedIngredientIds: string[] = [];

  for (const item of items) {
    const grams = Number.isFinite(item.grams) ? item.grams : 0;
    // A massa conta mesmo sem ingrediente no catálogo: a diluição é real.
    totalGrams += grams;
    const ingredient = catalog.get(item.ingredientId);
    if (!ingredient || grams <= 0) continue;

    if (ENERGY_OVERRIDES[ingredient.id] !== undefined) {
      adjustedIngredients.push(ingredient.name);
      adjustedIngredientIds.push(ingredient.id);
    }

    kcal += grams * kcalPerGram(ingredient);
    carbs += grams * carbsPerGram(ingredient);
    sugars += grams * ingredient.sugars;
    fats += grams * ingredient.fats;
    protein += grams * ingredient.protein;
  }

  return {
    facts: { kcal, carbs, sugars, fats, protein },
    totalGrams,
    adjustedIngredients,
    adjustedIngredientIds,
  };
}

/**
 * Estimativa nutricional da receita. É aproximada: sai da composição declarada
 * na planilha, não de análise laboratorial. Serve como orientação, nunca como
 * rotulagem legal.
 */
export function calculateNutrition(
  items: readonly RecipeItem[],
  catalog: ReadonlyMap<string, Ingredient>,
  portionGrams: number = PORTION_GRAMS,
): NutritionResult {
  const { facts, totalGrams, adjustedIngredients, adjustedIngredientIds } =
    accumulateFacts(items, catalog);

  if (totalGrams <= 0) {
    return {
      batch: EMPTY,
      per100g: EMPTY,
      perPortion: EMPTY,
      portionGrams,
      batchGrams: 0,
      adjustedIngredients: [],
      adjustedIngredientIds: [],
    };
  }

  return {
    batch: facts,
    per100g: scale(facts, 100 / totalGrams),
    perPortion: scale(facts, portionGrams / totalGrams),
    portionGrams,
    batchGrams: totalGrams,
    adjustedIngredients,
    adjustedIngredientIds,
  };
}
