import { getCure, METHOD_CEILING_PPM, MIN_INGOING_PPM } from '@/data/curing/cures';
import type {
  CuringInput,
  CuringMethod,
  CuringResult,
  CuringStatus,
} from '@/data/curing/types';

/**
 * Motor da calculadora de cura.
 *
 * A conta é curta e a responsabilidade é longa. Uma linha:
 *
 *     gramas de sal de cura = ppm × kg de carne ÷ (fração de nitrito × 1000)
 *
 * O que justifica a calculadora não é a álgebra — é que a fração muda com o
 * produto (6,25% no #1, 0,6% no Peklosol), o teto muda com o método, existe um
 * piso abaixo do qual a cura não protege, e o limite brasileiro é de outra
 * grandeza. Errar aqui não estraga o jantar: dá botulismo.
 *
 * Tudo em número puro, sem arredondar. Arredondamento é apresentação.
 */

/** Miligramas de nitrito por quilo de carne, a partir do que se pesou. */
export function ingoingPpm(
  cureGrams: number,
  meatGrams: number,
  fraction: number,
): number {
  if (meatGrams <= 0) return 0;
  return (cureGrams * fraction * 1_000_000) / meatGrams;
}

/** O caminho inverso: quanto pesar para chegar ao alvo. */
export function cureGramsFor(
  targetPpm: number,
  meatGrams: number,
  fraction: number,
): number {
  if (fraction <= 0 || meatGrams <= 0) return 0;
  return (targetPpm * meatGrams) / (fraction * 1_000_000);
}

export function statusFor(ppm: number, method: CuringMethod): CuringStatus {
  if (ppm < MIN_INGOING_PPM) return 'below-minimum';
  if (ppm > METHOD_CEILING_PPM[method]) return 'above-limit';
  return 'ok';
}

export function calculateCure(
  input: CuringInput,
  method: CuringMethod,
): CuringResult {
  const cure = getCure(input.cureId);
  const meatGrams = Math.max(0, input.meatGrams);
  const targetPpm = Math.max(0, input.targetPpm);

  if (!cure) {
    return {
      cureGrams: 0,
      nitritePpm: 0,
      nitratePpm: 0,
      saltFromCureGrams: 0,
      status: 'below-minimum',
    };
  }

  const cureGrams = cureGramsFor(targetPpm, meatGrams, cure.nitrite);

  return {
    cureGrams,
    nitritePpm: ingoingPpm(cureGrams, meatGrams, cure.nitrite),
    nitratePpm: ingoingPpm(cureGrams, meatGrams, cure.nitrate),
    // O que sobra do sal de cura é sal comum, e conta no sal total da receita:
    // esquecer isso é o erro que deixa o produto salgado demais.
    saltFromCureGrams: cureGrams * (1 - cure.nitrite - cure.nitrate),
    status: statusFor(targetPpm, method),
  };
}
