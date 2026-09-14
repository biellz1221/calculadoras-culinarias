import {
  CHOCOLATE_KINDS,
  DEFAULT_TEXTURE_ID,
  getTexture,
} from '@/data/ganache/textures';
import type { ChocolateKind } from '@/data/ganache/types';

/** Estado da calculadora de ganache, num objeto só, como as outras sete. */

export interface GanacheState {
  readonly textureId: string;
  readonly chocolate: ChocolateKind;
  readonly softGrams: number;
}

export function initialGanacheState(): GanacheState {
  return { textureId: DEFAULT_TEXTURE_ID, chocolate: 'dark', softGrams: 250 };
}

/**
 * Valida estado vindo de link ou de receita guardada.
 *
 * Textura conferida contra o catálogo e tipo de chocolate contra a lista;
 * chave de fora num objeto comum devolve o `Object.prototype`, não `undefined`.
 * Estado ruim é recusado inteiro.
 */
export function parseGanacheState(value: unknown): GanacheState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (typeof record.textureId !== 'string' || !getTexture(record.textureId)) return null;
  if (
    typeof record.chocolate !== 'string' ||
    !CHOCOLATE_KINDS.includes(record.chocolate as ChocolateKind)
  ) {
    return null;
  }

  const softGrams = record.softGrams;
  if (typeof softGrams !== 'number' || !Number.isFinite(softGrams)) return null;
  if (softGrams < 0 || softGrams > 1e7) return null;

  return {
    textureId: record.textureId,
    chocolate: record.chocolate as ChocolateKind,
    softGrams,
  };
}

export const GANACHE_SNAPSHOT = {
  baselineFor: (textureId: string): GanacheState | null =>
    getTexture(textureId) ? { ...initialGanacheState(), textureId } : null,
  presetOf: (state: GanacheState): string => state.textureId,
  parse: parseGanacheState,
};
