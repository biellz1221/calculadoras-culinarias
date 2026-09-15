import type { Bounds, MetricUnit } from './types';

/**
 * A conta da correção simples, escrita uma vez para as nove calculadoras.
 *
 * Toda métrica do site tem a mesma forma: `valor = escala × dominante ÷ base`.
 * Hidratação é água sobre farinha vezes 100; a razão do Wybauw é chocolate
 * sobre creme vezes 1; o ppm da cura é nitrito sobre carne vezes um milhão.
 * Inverter isso para achar o dominante é uma linha — o que vale é inverter num
 * lugar só, com as guardas no mesmo lugar.
 */

/** Quanto a unidade multiplica a razão crua. */
const SCALE: Record<MetricUnit, number> = {
  percent: 100,
  ratio: 1,
  ppm: 1_000_000,
};

export function scaleOf(unit: MetricUnit): number {
  return SCALE[unit];
}

function isUsableBase(grams: number): boolean {
  return Number.isFinite(grams) && grams > 0;
}

/**
 * Resolve a faixa para o ingrediente dominante, em gramas.
 *
 * Devolve `null` quando não há régua possível: sem base não existe proporção, e
 * inventar uma sugestão a partir de divisão por zero seria pior que ficar
 * calado. É o mesmo critério do pão, onde a análise inteira some quando não há
 * farinha identificável, em vez de exibir zeros.
 */
export function solveDominant(
  reference: Bounds,
  baseGrams: number,
  unit: MetricUnit,
): Bounds | null {
  if (!isUsableBase(baseGrams)) return null;
  if (!Number.isFinite(reference.min) || !Number.isFinite(reference.max)) {
    return null;
  }

  const scale = scaleOf(unit);
  const min = (reference.min * baseGrams) / scale;
  const max = (reference.max * baseGrams) / scale;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  return { min, max };
}

/**
 * O mesmo, para fonte que publica **ponto** em vez de faixa.
 *
 * A geleia do Blue Chair e a salmoura do Modernist não têm faixa: têm uma
 * receita. O alvo é um número só, e `min === max` é como isso viaja sem um tipo
 * paralelo — a tela lê os dois iguais e escolhe a frase "para igualar a fonte".
 */
export function solvePoint(
  referenceRatio: number,
  baseGrams: number,
  unit: MetricUnit = 'ratio',
): Bounds | null {
  return solveDominant({ min: referenceRatio, max: referenceRatio }, baseGrams, unit);
}
