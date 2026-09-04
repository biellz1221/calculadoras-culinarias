import type { Citation } from '../citations';

/**
 * Modelo da calculadora de pães.
 *
 * Tudo aqui é **porcentagem de padeiro**: a farinha total é 100% e todo o resto
 * é expresso como porcentagem do peso dessa farinha. É o que torna qualquer
 * receita escalável para a quantidade que a pessoa tem em casa.
 * (Kayser, p. 307; ver docs/research/paes.md.)
 */

export type FlourKey =
  | 'flour-white'
  | 'flour-wholewheat'
  | 'flour-rye'
  | 'flour-semolina'
  | 'flour-corn'
  | 'flour-bran'
  | 'flour-rice';

export type YeastKey = 'yeast-fresh' | 'yeast-active-dry' | 'yeast-instant';

export type PreFermentKey = 'levain-liquid' | 'poolish' | 'fermented-dough';

export type IngredientKey =
  | FlourKey
  | YeastKey
  | PreFermentKey
  | 'water'
  | 'milk'
  | 'salt'
  | 'sugar'
  | 'butter'
  | 'olive-oil'
  | 'lard'
  | 'egg'
  | 'milk-powder'
  | 'creme-fraiche'
  | 'xanthan';

export const FLOUR_KEYS: readonly FlourKey[] = [
  'flour-white',
  'flour-wholewheat',
  'flour-rye',
  'flour-semolina',
  'flour-corn',
  'flour-bran',
  'flour-rice',
];

export const YEAST_KEYS: readonly YeastKey[] = [
  'yeast-fresh',
  'yeast-active-dry',
  'yeast-instant',
];

/**
 * Hidratação de cada pré-fermento, em % (água sobre a farinha dele). É o que
 * permite separar quanto de um levain é farinha e quanto é água ao calcular a
 * hidratação real da massa.
 *
 * Levain líquido e poolish: partes iguais de farinha e água (Kayser, p. 24 e
 * p. 26). Massa fermentada: massa de pão pronta, na hidratação típica de uma
 * massa magra (Kayser, p. 26).
 */
export const PRE_FERMENT_HYDRATION: Record<PreFermentKey, number> = {
  'levain-liquid': 100,
  poolish: 100,
  'fermented-dough': 65,
};

/**
 * Todas as chaves de ingrediente, como registro em vez de lista.
 *
 * O tipo `Record<IngredientKey, true>` é conferido na compilação: acrescentar
 * um ingrediente à união sem acrescentá-lo aqui não compila. Uma lista comum
 * aceitaria a omissão em silêncio, e o efeito só apareceria como um
 * ingrediente que some ao abrir um link compartilhado.
 */
const INGREDIENT_KEY_SET: Record<IngredientKey, true> = {
  'flour-white': true,
  'flour-wholewheat': true,
  'flour-rye': true,
  'flour-semolina': true,
  'flour-corn': true,
  'flour-bran': true,
  'flour-rice': true,
  'yeast-fresh': true,
  'yeast-active-dry': true,
  'yeast-instant': true,
  'levain-liquid': true,
  poolish: true,
  'fermented-dough': true,
  water: true,
  milk: true,
  salt: true,
  sugar: true,
  butter: true,
  'olive-oil': true,
  lard: true,
  egg: true,
  'milk-powder': true,
  'creme-fraiche': true,
  xanthan: true,
};

/** A lista, na ordem do registro: é o que alimenta o seletor de ingredientes. */
export const INGREDIENT_KEYS = Object.keys(INGREDIENT_KEY_SET) as readonly IngredientKey[];

/** Guarda para valor vindo de fora: link compartilhado ou receita salva. */
export function isIngredientKey(value: unknown): value is IngredientKey {
  return typeof value === 'string' && Object.hasOwn(INGREDIENT_KEY_SET, value);
}

export function isFlour(key: IngredientKey): key is FlourKey {
  return (FLOUR_KEYS as readonly string[]).includes(key);
}

export function isYeast(key: IngredientKey): key is YeastKey {
  return (YEAST_KEYS as readonly string[]).includes(key);
}

export function isPreFerment(key: IngredientKey): key is PreFermentKey {
  return key in PRE_FERMENT_HYDRATION;
}

/** Ingredientes que contam como líquido de hidratação da massa. */
export function isHydrationLiquid(key: IngredientKey): boolean {
  return key === 'water' || key === 'milk';
}

export interface FormulaLine {
  key: IngredientKey;
  /** Porcentagem sobre a farinha total (farinha = 100%). */
  percent: number;
}

export interface BreadFormula {
  /** Composição da farinha; as porcentagens somam 100. */
  flours: readonly FormulaLine[];
  /** Todo o resto, também em porcentagem da farinha. */
  lines: readonly FormulaLine[];
}

/** Como o usuário informa o tamanho da fornada. */
export type BreadTarget =
  | { kind: 'flour'; grams: number }
  | { kind: 'dough'; grams: number }
  | { kind: 'units'; count: number; unitGrams: number };

export interface RecipeLine {
  key: IngredientKey;
  grams: number;
  percent: number;
}

export interface BreadRecipe {
  flourGrams: number;
  doughGrams: number;
  flours: readonly RecipeLine[];
  lines: readonly RecipeLine[];
  /** Hidratação declarada: água e leite sobre a farinha declarada. */
  hydration: number;
  /**
   * Hidratação real, contando a farinha e a água que entram dentro do
   * pré-fermento (Kayser, p. 24). Sem pré-fermento é igual à declarada.
   */
  effectiveHydration: number;
  /** Sal em % da farinha declarada: é assim que se escala a receita. */
  salt: number;
  /**
   * Sal sobre a farinha total, incluindo a que vem dentro do pré-fermento. É o
   * número que importa para a fermentação; sem pré-fermento é igual ao anterior.
   */
  effectiveSalt: number;
}

export interface BreadProcess {
  firstRiseMinutes?: [number, number];
  secondRiseMinutes?: [number, number];
  ovenCelsius?: number;
  bakeMinutes?: [number, number];
  /** Chave no dicionário para observações do preparo (autólise, vapor, etc.). */
  noteKey?: string;
}

export interface BreadPreset {
  id: string;
  formula: BreadFormula;
  process: BreadProcess;
  /** Rendimento publicado na fonte, quando existe. */
  yield?: { count: number; unitGrams: number };
  citations: readonly Citation[];
}
