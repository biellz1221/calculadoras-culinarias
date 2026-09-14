import { describe, expect, it } from 'vitest';

import {
  JAM_SNAPSHOT,
  initialJamState,
  levelForFruit,
  parseJamState,
  sugarLevelsFor,
} from './state';
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

describe('níveis de açúcar por fruta', () => {
  it('só oferece "a da receita" para fruta que tem receita', () => {
    expect(sugarLevelsFor('strawberry')).toContain('source');
    expect(sugarLevelsFor('guava')).not.toContain('source');

    // As duas classes da norma valem para qualquer fruta: são definição legal
    // de produto, não receita de fruta.
    for (const id of ['strawberry', 'guava']) {
      expect(sugarLevelsFor(id), id).toEqual(expect.arrayContaining(['extra', 'common']));
    }
  });

  it('trocar para fruta sem receita cai na geleia extra, não no silêncio', () => {
    expect(levelForFruit('guava', 'source')).toBe('extra');
    // O que continua valendo não é mexido.
    expect(levelForFruit('guava', 'ferber')).toBe('ferber');
    expect(levelForFruit('strawberry', 'source')).toBe('source');
  });

  it('recusa link que pede a receita de uma fruta que não tem receita', () => {
    // Entrada não confiável: a combinação é impossível, e meia receita na tela
    // é pior que nenhuma.
    expect(
      parseJamState({
        fruitId: 'guava',
        fruitGrams: 1000,
        sugarLevel: 'source',
        customSugarRatio: 0.6,
        altitudeMeters: 0,
      }),
    ).toBeNull();

    // A mesma fruta com um nível que existe passa.
    expect(
      parseJamState({
        fruitId: 'guava',
        fruitGrams: 1000,
        sugarLevel: 'extra',
        customSugarRatio: 0.6,
        altitudeMeters: 0,
      }),
    ).not.toBeNull();
  });

  it('aceita as classes da norma e recusa qualquer outra palavra', () => {
    for (const sugarLevel of ['extra', 'common', 'ferber', 'custom']) {
      expect(
        parseJamState({
          fruitId: 'guava',
          fruitGrams: 500,
          sugarLevel,
          customSugarRatio: 0.6,
          altitudeMeters: 0,
        }),
        sugarLevel,
      ).not.toBeNull();
    }

    for (const sugarLevel of ['__proto__', 'constructor', 'toString', 'comum']) {
      expect(
        parseJamState({
          fruitId: 'guava',
          fruitGrams: 500,
          sugarLevel,
          customSugarRatio: 0.6,
          altitudeMeters: 0,
        }),
        sugarLevel,
      ).toBeNull();
    }
  });
});
