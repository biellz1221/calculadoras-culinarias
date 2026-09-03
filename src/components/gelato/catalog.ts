import { INGREDIENTS } from '@/data/gelato/ingredients';
import { CATEGORY_ORDER, type IngredientGroup } from '@/data/gelato/metrics';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';
import type { Ingredient } from '@/lib/gelato/types';

/** Catálogo indexado por id — o motor de cálculo recebe sempre este mapa. */
export const CATALOG: ReadonlyMap<string, Ingredient> = new Map(
  INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

export interface IngredientOption {
  readonly id: string;
  readonly label: string;
  readonly group: IngredientGroup;
}

/**
 * Rótulo traduzido do ingrediente. Os ids da planilha são dados e os rótulos
 * são texto de interface, então a busca acontece pelo dicionário e não pelo
 * `name` em pt-BR que vem junto do ingrediente.
 */
export function ingredientLabel(
  dict: GelatoDictionary,
  ingredientId: string,
): string | undefined {
  const labels: Record<string, string | undefined> = dict.ingredients;
  return labels[ingredientId];
}

/** Rótulo, ou o aviso de ingrediente fora do catálogo — nunca um id cru na tela. */
export function ingredientLabelOrFallback(
  dict: GelatoDictionary,
  ingredientId: string,
): string {
  return ingredientLabel(dict, ingredientId) ?? dict.table.unknown;
}

function groupOf(ingredient: Ingredient): IngredientGroup {
  return ingredient.custom ? 'custom' : ingredient.category;
}

/**
 * Opções do seletor, na ordem em que aparecem: categoria primeiro, depois o
 * rótulo em ordem alfabética do idioma da tela — em inglês "Water" não cai no
 * mesmo lugar que "Água".
 */
export function buildOptions(
  dict: GelatoDictionary,
  locale: Locale,
): readonly IngredientOption[] {
  const collator = new Intl.Collator(locale);

  return INGREDIENTS.map((ingredient) => ({
    id: ingredient.id,
    label: ingredientLabelOrFallback(dict, ingredient.id),
    group: groupOf(ingredient),
  })).sort((a, b) => {
    const order = CATEGORY_ORDER.indexOf(a.group) - CATEGORY_ORDER.indexOf(b.group);
    return order !== 0 ? order : collator.compare(a.label, b.label);
  });
}

/** Rótulo do grupo, resolvido pelo dicionário do idioma. */
export function groupLabel(dict: GelatoDictionary, group: IngredientGroup): string {
  return dict.categories[group];
}
