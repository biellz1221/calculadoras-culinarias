import { describe, expect, it } from 'vitest';

import { BRINE_SNAPSHOT, initialBrineState, parseBrineState } from './state';
import { decodeSnapshot, encodeSnapshot } from '@/lib/recipes/snapshot';

/**
 * Método vindo de fora é dose vinda de fora: a salmoura de peixe tem treze
 * vezes o sal da de ave, e trocar um id pelo outro num link salgaria a peça de
 * quem abriu. Por isso o `parse` recusa o estado inteiro ao primeiro campo
 * estranho.
 */

const base = initialBrineState();

describe('estado de salmoura vindo de fora', () => {
  it('sobrevive à ida e volta pelo link', () => {
    const result = decodeSnapshot(
      encodeSnapshot('brine', base, BRINE_SNAPSHOT),
      'brine',
      BRINE_SNAPSHOT,
    );

    expect(result).toEqual({ status: 'ok', state: base });
  });

  it('recusa método que não está no catálogo', () => {
    expect(parseBrineState({ ...base, methodId: 'salmoura-da-vovo' })).toBeNull();
    // Chave de fora num objeto comum devolve o Object.prototype.
    expect(parseBrineState({ ...base, methodId: '__proto__' })).toBeNull();
    expect(parseBrineState({ ...base, methodId: 'constructor' })).toBeNull();
  });

  it('recusa peso que não é número finito ou está fora de faixa', () => {
    expect(parseBrineState({ ...base, proteinGrams: -1 })).toBeNull();
    expect(parseBrineState({ ...base, proteinGrams: 1e9 })).toBeNull();
    expect(parseBrineState({ ...base, proteinGrams: Number.NaN })).toBeNull();
    expect(
      parseBrineState({ ...base, proteinGrams: Number.POSITIVE_INFINITY }),
    ).toBeNull();
    expect(parseBrineState({ ...base, proteinGrams: '1000' })).toBeNull();
  });

  it('recusa estado incompleto', () => {
    for (const key of Object.keys(base)) {
      const partial: Record<string, unknown> = { ...base };
      delete partial[key];
      expect(parseBrineState(partial), `sem ${key}`).toBeNull();
    }
  });

  it('aceita o que é legítimo', () => {
    expect(
      parseBrineState({ methodId: 'immersion-fish', proteinGrams: 600 }),
    ).toEqual({ methodId: 'immersion-fish', proteinGrams: 600 });
  });

  it('a linha de base do snapshot só existe para método do catálogo', () => {
    expect(BRINE_SNAPSHOT.baselineFor('cure-fish')).toMatchObject({
      methodId: 'cure-fish',
    });
    expect(BRINE_SNAPSHOT.baselineFor('salmoura-da-vovo')).toBeNull();
  });
});
