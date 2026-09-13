import { getCure, DEFAULT_CURE_ID } from '@/data/curing/cures';
import type { CuringMethod } from '@/data/curing/types';

/** Estado da calculadora de cura, num objeto só, como as outras quatro. */

export interface CuringState {
  readonly meatGrams: number;
  readonly cureId: string;
  readonly method: CuringMethod;
  readonly targetPpm: number;
}

const METHODS: readonly CuringMethod[] = ['comminuted', 'dry'];

/**
 * O padrão é 150 ppm, e não o teto americano de 156.
 *
 * Fica entre a dose de trabalho do Ruhlman (139) e o teto do Marianski (156),
 * cabe nas duas normas e é o mesmo número do limite de resíduo brasileiro — o
 * que, mesmo sendo outra grandeza, evita entregar de saída uma dose que já
 * nasce raspando o teto de lá.
 */
export const DEFAULT_TARGET_PPM = 150;

export function initialCuringState(): CuringState {
  return {
    meatGrams: 1000,
    cureId: DEFAULT_CURE_ID,
    method: 'comminuted',
    targetPpm: DEFAULT_TARGET_PPM,
  };
}

function finiteNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

/**
 * Valida estado vindo de link ou de receita guardada.
 *
 * O teto de 1000 ppm no alvo não é conforto de tipo: é a última barreira antes
 * de um link compartilhado mandar alguém pesar dose tóxica. Acima disso o
 * estado é recusado inteiro, e a calculadora abre no padrão.
 */
export function parseCuringState(value: unknown): CuringState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (typeof record.cureId !== 'string' || !getCure(record.cureId)) return null;
  if (!METHODS.includes(record.method as CuringMethod)) return null;

  const meatGrams = finiteNumber(record.meatGrams, 0, 1e7);
  const targetPpm = finiteNumber(record.targetPpm, 0, 1000);
  if (meatGrams === null || targetPpm === null) return null;

  return {
    meatGrams,
    cureId: record.cureId,
    method: record.method as CuringMethod,
    targetPpm,
  };
}

export const CURING_SNAPSHOT = {
  baselineFor: (cureId: string): CuringState | null =>
    getCure(cureId) ? { ...initialCuringState(), cureId } : null,
  presetOf: (state: CuringState): string => state.cureId,
  parse: parseCuringState,
};
