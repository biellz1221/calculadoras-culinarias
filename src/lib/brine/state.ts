import { DEFAULT_METHOD_ID, getMethod } from '@/data/brine/methods';

/** Estado da calculadora de salmoura, num objeto só, como as outras seis. */

export interface BrineState {
  readonly methodId: string;
  readonly proteinGrams: number;
}

export function initialBrineState(): BrineState {
  return { methodId: DEFAULT_METHOD_ID, proteinGrams: 1000 };
}

/**
 * Valida estado vindo de link ou de receita guardada.
 *
 * O método é conferido contra o catálogo: chave de fora num objeto comum
 * devolve o `Object.prototype`, não `undefined`, e um método desconhecido
 * traria proporção desconhecida. Estado ruim é recusado inteiro.
 */
export function parseBrineState(value: unknown): BrineState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (typeof record.methodId !== 'string' || !getMethod(record.methodId)) return null;

  const grams = record.proteinGrams;
  if (typeof grams !== 'number' || !Number.isFinite(grams)) return null;
  if (grams < 0 || grams > 1e7) return null;

  return { methodId: record.methodId, proteinGrams: grams };
}

export const BRINE_SNAPSHOT = {
  baselineFor: (methodId: string): BrineState | null =>
    getMethod(methodId) ? { ...initialBrineState(), methodId } : null,
  presetOf: (state: BrineState): string => state.methodId,
  parse: parseBrineState,
};
