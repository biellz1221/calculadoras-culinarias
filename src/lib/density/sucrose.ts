import {
  NBS_AIR_DENSITY,
  SUCROSE_BRIX,
  SUCROSE_CELSIUS,
  SUCROSE_WEIGHTS,
  isExtrapolatedCell,
} from '@/data/density/sucrose';
import { MILLILITERS_PER_FLUID_OUNCE } from '@/lib/units';

/**
 * Densidade de calda de sacarose, da tabela do NBS 457.
 *
 * A tabela dá peso por galão no ar, de 5 em 5 °Brix e de 5 em 5 °C. Entre os
 * pontos, interpolação linear nas duas direções. A curva é lisa o bastante para
 * isso: a segunda diferença da própria tabela fica entre 1 e 5 g por galão a
 * cada passo, o que limita o erro no meio do intervalo a uns 0,6 g em ~4.000 —
 * menos que o arredondamento do grama impresso. O teste confere essa conta a
 * partir dos dados, não desta frase.
 */

/** Galão americano: 128 onças fluidas, pela definição legal (231 pol³). */
export const MILLILITERS_PER_US_GALLON = 128 * MILLILITERS_PER_FLUID_OUNCE;

export interface SucroseDensity {
  /** Densidade verdadeira, em g/mL. */
  density: number;
  /**
   * Verdadeiro quando alguma célula que pesa na resposta é das que a circular
   * imprime em itálico, como extrapolação. A página tem de dizer isso.
   */
  extrapolated: boolean;
}

interface Bracket {
  low: number;
  high: number;
  /** Peso do ponto `high`, de 0 a 1. */
  weight: number;
}

/** Os dois índices da grade em volta de `value`, ou nulo fora dela. */
function bracketIn(grid: readonly number[], value: number): Bracket | null {
  const first = grid[0]!;
  const last = grid[grid.length - 1]!;
  if (!Number.isFinite(value) || value < first || value > last) return null;

  let low = 0;
  while (low < grid.length - 2 && value >= grid[low + 1]!) low++;

  const from = grid[low]!;
  const to = grid[low + 1]!;
  return { low, high: low + 1, weight: (value - from) / (to - from) };
}

/** Peso no ar por mililitro, somado ao ar declarado na p. 28. */
function trueDensityAt(brixIndex: number, celsiusIndex: number): number {
  const grams = SUCROSE_WEIGHTS[brixIndex]![celsiusIndex]![1];
  return grams / MILLILITERS_PER_US_GALLON + NBS_AIR_DENSITY;
}

/**
 * Densidade de calda de sacarose com `brix` °Brix a `celsius` °C.
 *
 * Nulo fora da tabela — de 0 a 95 °Brix e de 10 a 30 °C. Calda quente fica de
 * fora, e é de propósito: a fonte não mede acima de 30 °C.
 */
export function sucroseSolutionDensity(brix: number, celsius: number): SucroseDensity | null {
  const b = bracketIn(SUCROSE_BRIX, brix);
  const t = bracketIn(SUCROSE_CELSIUS, celsius);
  if (!b || !t) return null;

  const corners = [
    { bi: b.low, ti: t.low, weight: (1 - b.weight) * (1 - t.weight) },
    { bi: b.high, ti: t.low, weight: b.weight * (1 - t.weight) },
    { bi: b.low, ti: t.high, weight: (1 - b.weight) * t.weight },
    { bi: b.high, ti: t.high, weight: b.weight * t.weight },
  ];

  let density = 0;
  let extrapolated = false;
  for (const { bi, ti, weight } of corners) {
    if (weight === 0) continue;
    density += weight * trueDensityAt(bi, ti);
    if (isExtrapolatedCell(SUCROSE_BRIX[bi]!, SUCROSE_CELSIUS[ti]!)) extrapolated = true;
  }

  return { density, extrapolated };
}
