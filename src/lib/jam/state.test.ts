import { describe, expect, it } from 'vitest';

import { JAM_SNAPSHOT, initialJamState, parseJamState } from './state';
import { MAX_ALTITUDE_METERS } from '@/data/jam/setting-point';
import { decodeSnapshot, encodeSnapshot } from '@/lib/recipes/snapshot';

/**
 * Estado de geleia vindo de link ou de receita guardada é entrada não
 * confiável como qualquer outra. Aqui o pior caso não é dose tóxica, é conta
 * errada com cara de conta certa: uma altitude absurda muda o ponto de
 * gelificação e faz alguém tirar a panela do fogo na hora errada.
 */

const base = initialJamState();

describe('estado de geleia vindo de fora', () => {
  it('sobrevive à ida e volta pelo link', () => {
    const result = decodeSnapshot(
      encodeSnapshot('jam', base, JAM_SNAPSHOT),
      'jam',
      JAM_SNAPSHOT,
    );

    expect(result).toEqual({ status: 'ok', state: base });
  });

  it('recusa fruta que não está no catálogo', () => {
    // Sem receita citada não há proporção: melhor abrir no padrão.
    expect(parseJamState({ ...base, fruitId: 'jabuticaba' })).toBeNull();
    // `__proto__` num objeto comum devolve o Object.prototype, não undefined.
    expect(parseJamState({ ...base, fruitId: '__proto__' })).toBeNull();
    expect(parseJamState({ ...base, fruitId: 'constructor' })).toBeNull();
  });

  it('recusa nível de açúcar inventado', () => {
    expect(parseJamState({ ...base, sugarLevel: 'pouco' })).toBeNull();
    expect(parseJamState({ ...base, sugarLevel: '__proto__' })).toBeNull();
  });

  it('recusa altitude fora do planeta', () => {
    expect(parseJamState({ ...base, altitudeMeters: 90_000 })).toBeNull();
    expect(parseJamState({ ...base, altitudeMeters: -500 })).toBeNull();
    expect(
      parseJamState({ ...base, altitudeMeters: Number.POSITIVE_INFINITY }),
    ).toBeNull();
    expect(parseJamState({ ...base, altitudeMeters: Number.NaN })).toBeNull();
    // O limite é o aceito na entrada, e o topo do Brasil cabe nele.
    expect(parseJamState({ ...base, altitudeMeters: MAX_ALTITUDE_METERS })).not.toBeNull();
    expect(parseJamState({ ...base, altitudeMeters: 2995 })).not.toBeNull();
  });

  it('recusa proporção de açúcar absurda', () => {
    expect(parseJamState({ ...base, customSugarRatio: 50 })).toBeNull();
    expect(parseJamState({ ...base, customSugarRatio: -1 })).toBeNull();
  });

  it('recusa estado incompleto', () => {
    for (const key of Object.keys(base)) {
      const partial: Record<string, unknown> = { ...base };
      delete partial[key];
      expect(parseJamState(partial), `sem ${key}`).toBeNull();
    }
  });

  it('aceita o que é legítimo', () => {
    expect(
      parseJamState({
        ...base,
        fruitId: 'fig',
        sugarLevel: 'ferber',
        altitudeMeters: 760,
      }),
    ).toMatchObject({ fruitId: 'fig', sugarLevel: 'ferber', altitudeMeters: 760 });
  });

  it('a linha de base do snapshot só existe para fruta do catálogo', () => {
    expect(JAM_SNAPSHOT.baselineFor('fig')).toMatchObject({ fruitId: 'fig' });
    expect(JAM_SNAPSHOT.baselineFor('jabuticaba')).toBeNull();
  });
});
