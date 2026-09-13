import { describe, expect, it } from 'vitest';

import { calculateCure } from './calculate';
import { CURING_SNAPSHOT, initialCuringState, parseCuringState } from './state';
import { decodeSnapshot, encodeSnapshot } from '@/lib/recipes/snapshot';

/**
 * Aqui a validação não é higiene de código.
 *
 * Um link compartilhado vira a dose que alguém vai pesar e comer. O `parse` é a
 * última coisa entre um endereço qualquer e uma balança, e por isso ele recusa
 * o estado inteiro ao primeiro campo estranho, em vez de consertar o que dá.
 */

const base = initialCuringState();

describe('estado de cura vindo de fora', () => {
  it('sobrevive à ida e volta pelo link', () => {
    const result = decodeSnapshot(
      encodeSnapshot('curing', base, CURING_SNAPSHOT),
      'curing',
      CURING_SNAPSHOT,
    );

    expect(result).toEqual({ status: 'ok', state: base });
  });

  it('recusa dose absurda antes que ela chegue à balança', () => {
    // O teto de 1000 ppm é a última barreira entre um link e uma dose tóxica.
    expect(parseCuringState({ ...base, targetPpm: 5000 })).toBeNull();
    expect(parseCuringState({ ...base, targetPpm: -10 })).toBeNull();
    expect(parseCuringState({ ...base, targetPpm: Number.POSITIVE_INFINITY })).toBeNull();
    expect(parseCuringState({ ...base, targetPpm: Number.NaN })).toBeNull();
  });

  it('recusa sal de cura que não está no catálogo', () => {
    // Fração de nitrito desconhecida é dose desconhecida.
    expect(parseCuringState({ ...base, cureId: 'sal-de-mentira' })).toBeNull();
    expect(parseCuringState({ ...base, cureId: '__proto__' })).toBeNull();
  });

  it('recusa método inventado, que traria o teto errado', () => {
    expect(parseCuringState({ ...base, method: 'defumado' })).toBeNull();
  });

  it('recusa estado incompleto', () => {
    for (const key of Object.keys(base)) {
      const partial: Record<string, unknown> = { ...base };
      delete partial[key];
      expect(parseCuringState(partial), `sem ${key}`).toBeNull();
    }
  });

  it('aceita o que é legítimo', () => {
    expect(
      parseCuringState({ ...base, cureId: 'cure-2', method: 'dry', targetPpm: 200 }),
    ).toMatchObject({ cureId: 'cure-2', method: 'dry', targetPpm: 200 });
  });
});

describe('o selo de faixa', () => {
  it('não anuncia alerta quando está tudo certo', () => {
    // O selo dizia "dentro da faixa" com a seta e a cor de aviso: texto e
    // sinal visual discordando é pior que não ter sinal.
    const dentro = calculateCure(
      { meatGrams: 1000, cureId: 'cure-1', targetPpm: 150 },
      'comminuted',
    );
    expect(dentro.status).toBe('ok');
  });
});
