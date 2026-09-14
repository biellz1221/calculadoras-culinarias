import { describe, expect, it } from 'vitest';

import { GANACHE_SNAPSHOT, initialGanacheState, parseGanacheState } from './state';
import { decodeSnapshot, encodeSnapshot } from '@/lib/recipes/snapshot';

/**
 * Textura vinda de fora é proporção vinda de fora: a trufa leva 110 de
 * chocolate e o praliné cortado até 180, e trocar um id pelo outro num link
 * muda a receita de quem abriu em dois terços.
 */

const base = initialGanacheState();

describe('estado de ganache vindo de fora', () => {
  it('sobrevive à ida e volta pelo link', () => {
    const result = decodeSnapshot(
      encodeSnapshot('ganache', base, GANACHE_SNAPSHOT),
      'ganache',
      GANACHE_SNAPSHOT,
    );

    expect(result).toEqual({ status: 'ok', state: base });
  });

  it('recusa textura que não está no catálogo', () => {
    expect(parseGanacheState({ ...base, textureId: 'mousse' })).toBeNull();
    // Chave de fora num objeto comum devolve o Object.prototype.
    expect(parseGanacheState({ ...base, textureId: '__proto__' })).toBeNull();
    expect(parseGanacheState({ ...base, textureId: 'constructor' })).toBeNull();
  });

  it('recusa chocolate inventado', () => {
    expect(parseGanacheState({ ...base, chocolate: 'ruby' })).toBeNull();
    expect(parseGanacheState({ ...base, chocolate: '__proto__' })).toBeNull();
  });

  it('recusa peso que não é número finito ou está fora de faixa', () => {
    expect(parseGanacheState({ ...base, softGrams: -1 })).toBeNull();
    expect(parseGanacheState({ ...base, softGrams: 1e9 })).toBeNull();
    expect(parseGanacheState({ ...base, softGrams: Number.NaN })).toBeNull();
    expect(parseGanacheState({ ...base, softGrams: '250' })).toBeNull();
  });

  it('recusa estado incompleto', () => {
    for (const key of Object.keys(base)) {
      const partial: Record<string, unknown> = { ...base };
      delete partial[key];
      expect(parseGanacheState(partial), `sem ${key}`).toBeNull();
    }
  });

  it('aceita o que é legítimo', () => {
    expect(
      parseGanacheState({ textureId: 'cut', chocolate: 'white', softGrams: 400 }),
    ).toEqual({ textureId: 'cut', chocolate: 'white', softGrams: 400 });
  });

  it('a linha de base do snapshot só existe para textura do catálogo', () => {
    expect(GANACHE_SNAPSHOT.baselineFor('truffle')).toMatchObject({
      textureId: 'truffle',
    });
    expect(GANACHE_SNAPSHOT.baselineFor('mousse')).toBeNull();
  });
});
