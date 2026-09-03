import { MIN_BRINE_ACIDITY } from '@/data/pickles/ranges';
import type { VinegarParams, VinegarResult } from '@/data/pickles/types';

/**
 * Motor do picles de vinagre (quick pickle).
 *
 * Aqui não há fermentação: a conserva vem da acidez que a pessoa adiciona, e
 * diluir vinagre é diluir a proteção. A proporção de referência é 1 parte de
 * água para 1 parte de vinagre de ~5% de acidez (Noma, cap. "Vinegar"), o que
 * dá 2,5% de ácido acético no líquido de cobertura, o piso que a calculadora
 * usa (`MIN_BRINE_ACIDITY`).
 *
 * Se o vinagre da pessoa for mais fraco, a conta não é "avisar e seguir": é
 * recalcular quanto vinagre o líquido precisa ter. Abaixo de 2,5% de acidez no
 * próprio vinagre, nem sem água nenhuma o líquido alcança o piso. Aí a resposta
 * honesta é dizer que aquela combinação não serve.
 */

const EPSILON = 1e-9;

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Fração do líquido de cobertura que é vinagre, de 0 a 1. */
export function vinegarShareOf(vinegarParts: number, waterParts: number): number {
  const vinegar = positive(vinegarParts);
  const total = vinegar + positive(waterParts);

  return total > 0 ? vinegar / total : 0;
}

/**
 * Fração mínima de vinagre no líquido para alcançar o piso de acidez. Maior que
 * 1 significa que nem o vinagre puro chega lá.
 */
export function minimumVinegarShare(acidity: number): number {
  const value = positive(acidity);
  return value > 0 ? MIN_BRINE_ACIDITY / value : Number.POSITIVE_INFINITY;
}

export function calculateVinegarPickle(params: VinegarParams): VinegarResult {
  const liquidGrams = positive(params.liquidGrams);
  const acidity = positive(params.vinegarAcidity);
  const share = vinegarShareOf(params.vinegarParts, params.waterParts);

  const vinegarGrams = liquidGrams * share;
  const brineAcidity = share * acidity;
  const minimumShare = minimumVinegarShare(acidity);

  return {
    vinegarGrams,
    waterGrams: liquidGrams - vinegarGrams,
    saltGrams: (liquidGrams * positive(params.saltPercent)) / 100,
    sugarGrams: (liquidGrams * positive(params.sugarPercent)) / 100,
    vinegarShare: share,
    brineAcidity,
    minimumVinegarShare: minimumShare,
    minimumWaterPerVinegar: waterPerVinegarFor(minimumShare),
    status: statusFor(brineAcidity, minimumShare),
  };
}

/**
 * Quantas partes de água por parte de vinagre a proporção mínima admite.
 * `undefined` quando a resposta é "vinagre puro" ou "não tem proporção que
 * resolva": casos em que exibir um número seria pior que não exibir nada.
 */
function waterPerVinegarFor(minimumShare: number): number | undefined {
  if (!Number.isFinite(minimumShare)) return undefined;
  if (minimumShare <= 0 || minimumShare >= 1) return undefined;

  return (1 - minimumShare) / minimumShare;
}

function statusFor(
  brineAcidity: number,
  minimumShare: number,
): VinegarResult['status'] {
  if (minimumShare > 1) return 'unusable-vinegar';
  if (brineAcidity + EPSILON < MIN_BRINE_ACIDITY) return 'below-minimum';
  return 'ok';
}
