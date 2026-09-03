/**
 * Auditoria de coerência interna dos ingredientes da planilha de origem.
 *
 * A planilha do curso declara, para cada ingrediente, duas coisas que deveriam
 * fechar entre si:
 *
 * 1. `totalSolids + water = 1`, ou seja, tudo é sólido ou água;
 * 2. `sugars + fats + msnf + otherSolids = totalSolids`, ou seja, as parcelas
 *    de sólido somam o total de sólidos.
 *
 * Em 14 dos 164 ingredientes isso não fecha. **O dado não é corrigido aqui**: a
 * procedência é a planilha e mudar número de fonte sem aviso é exatamente o que
 * este site não faz. O que este módulo faz é detectar e classificar, para a
 * interface poder avisar quem está usando o ingrediente de que o resultado sai
 * menos confiável.
 */

import type { Ingredient, RecipeItem } from './types';

/**
 * Quanto de desvio ainda passa por arredondamento da planilha.
 * 2 pontos percentuais de 1 g de ingrediente: acima disso o erro já move as
 * métricas de forma visível numa receita real.
 */
export const COMPOSITION_TOLERANCE = 0.02;

/**
 * - `no-composition`: sólidos e água somam zero. O ingrediente entra como massa
 *   pura e dilui todas as métricas em silêncio.
 * - `solids-contradicted`: `totalSolids` é zero, mas as parcelas declaram
 *   sólidos. Um sólido cadastrado como 100% água.
 * - `closure`: sólidos mais água longe de 1.
 * - `parts`: as parcelas de sólido não somam o total declarado.
 */
export type CompositionIssue =
  | 'no-composition'
  | 'solids-contradicted'
  | 'closure'
  | 'parts';

/** `severe` é o que muda o resultado na prática; `mild` é desvio de planilha. */
export type CompositionSeverity = 'severe' | 'mild';

export interface CompositionFlaw {
  readonly ingredientId: string;
  readonly issues: readonly CompositionIssue[];
  readonly severity: CompositionSeverity;
  /** `totalSolids + water - 1`. Zero é o esperado. */
  readonly closureDrift: number;
  /** Soma das parcelas menos `totalSolids`. Zero é o esperado. */
  readonly partsDrift: number;
}

const SEVERE_ISSUES: ReadonlySet<CompositionIssue> = new Set<CompositionIssue>([
  'no-composition',
  'solids-contradicted',
]);

function declaredSolids(ingredient: Ingredient): number {
  return (
    ingredient.sugars + ingredient.fats + ingredient.msnf + ingredient.otherSolids
  );
}

function closureIssue(ingredient: Ingredient, drift: number): CompositionIssue | null {
  if (ingredient.totalSolids === 0 && ingredient.water === 0) return 'no-composition';
  if (Math.abs(drift) > COMPOSITION_TOLERANCE) return 'closure';
  return null;
}

function partsIssue(ingredient: Ingredient, drift: number): CompositionIssue | null {
  // Sólido declarado nas parcelas mas zerado no total: o motor lê `totalSolids`,
  // então a composição real do ingrediente simplesmente não entra na conta.
  if (ingredient.totalSolids === 0 && declaredSolids(ingredient) > COMPOSITION_TOLERANCE) {
    return 'solids-contradicted';
  }
  if (Math.abs(drift) > COMPOSITION_TOLERANCE) return 'parts';
  return null;
}

/** Devolve o defeito do ingrediente, ou `null` quando a composição fecha. */
export function inspectIngredient(ingredient: Ingredient): CompositionFlaw | null {
  const closureDrift = ingredient.totalSolids + ingredient.water - 1;
  const partsDrift = declaredSolids(ingredient) - ingredient.totalSolids;

  const issues = [
    closureIssue(ingredient, closureDrift),
    partsIssue(ingredient, partsDrift),
  ].filter((issue): issue is CompositionIssue => issue !== null);

  if (issues.length === 0) return null;

  return {
    ingredientId: ingredient.id,
    issues,
    severity: issues.some((issue) => SEVERE_ISSUES.has(issue)) ? 'severe' : 'mild',
    closureDrift,
    partsDrift,
  };
}

/** Varre um catálogo inteiro, usado pelo teste que fixa o retrato da planilha. */
export function auditCatalog(
  ingredients: Iterable<Ingredient>,
): readonly CompositionFlaw[] {
  const flaws: CompositionFlaw[] = [];
  for (const ingredient of ingredients) {
    const flaw = inspectIngredient(ingredient);
    if (flaw) flaws.push(flaw);
  }
  return flaws;
}

/**
 * Defeitos que afetam esta receita: só as linhas que pesam alguma coisa e cujo
 * ingrediente existe no catálogo. Linha zerada não muda métrica nenhuma, então
 * avisar sobre ela seria ruído.
 */
export function flawsInRecipe(
  items: readonly RecipeItem[],
  catalog: ReadonlyMap<string, Ingredient>,
): readonly CompositionFlaw[] {
  const seen = new Set<string>();
  const flaws: CompositionFlaw[] = [];

  for (const item of items) {
    if (!(item.grams > 0) || seen.has(item.ingredientId)) continue;
    const ingredient = catalog.get(item.ingredientId);
    if (!ingredient) continue;

    seen.add(item.ingredientId);
    const flaw = inspectIngredient(ingredient);
    if (flaw) flaws.push(flaw);
  }

  return flaws;
}
