import {
  COOK_MINUTES,
  MIN_WATER_LITRES,
  WATER_LITRES_PER_100G,
  type CookingRule,
} from '@/data/pasta/presets';
import {
  TORTELLINI_PIECES_PER_SERVING,
  type TortelliniService,
} from '@/data/pasta/dishes';
import type { PastaFamily } from '@/data/pasta/types';

/**
 * O que fazer com a massa depois de pronta: quanta água, quanto tempo e, na
 * massa recheada, quantas peças por pessoa (docs/research/massas.md, §4.2 e 4.3).
 *
 * As duas fontes quase coincidem na água: 1 L por 100 g (Zielonka) contra 4
 * quarts por libra (~0,84 L/100 g) da Hazan. Vale então a regra mais simples,
 * com o piso de 3 quarts que ela impõe para não abaixar demais em panela
 * pequena.
 */
export function cookingWaterLitres(pastaGrams: number): number {
  const grams = Number.isFinite(pastaGrams) ? Math.max(0, pastaGrams) : 0;
  const litres = (grams / 100) * WATER_LITRES_PER_100G;

  return Math.max(MIN_WATER_LITRES, litres);
}

export function cookRuleFor(family: PastaFamily): CookingRule {
  return COOK_MINUTES[family];
}

/** Peças de massa recheada para um número de pessoas. */
export function piecesFor(servings: number, service: TortelliniService): number {
  const people = Number.isFinite(servings) ? Math.max(0, servings) : 0;
  return people * TORTELLINI_PIECES_PER_SERVING[service];
}

/** O contrário: quantas pessoas um número de peças serve. */
export function servingsFromPieces(
  pieces: number,
  service: TortelliniService,
): number {
  const count = Number.isFinite(pieces) ? Math.max(0, pieces) : 0;
  return count / TORTELLINI_PIECES_PER_SERVING[service];
}
