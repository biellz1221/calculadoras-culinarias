import { describe, expect, it } from 'vitest';

import { gramsFromMilliliters, millilitersFromGrams } from './volume';

describe('mililitro e grama', () => {
  it('converte pelos dois lados com a mesma densidade', () => {
    expect(gramsFromMilliliters(250, 1.2)).toBeCloseTo(300, 12);
    expect(millilitersFromGrams(300, 1.2)).toBeCloseTo(250, 12);
  });

  it('ida e volta devolve o volume de partida', () => {
    const density = 0.9480;
    expect(millilitersFromGrams(gramsFromMilliliters(750, density), density)).toBeCloseTo(750, 9);
  });

  it.each([
    ['volume negativo', -10, 1],
    ['volume que não é número', Number.NaN, 1],
    ['densidade zero', 100, 0],
    ['densidade negativa', 100, -1],
    ['densidade infinita', 100, Number.POSITIVE_INFINITY],
  ])('%s devolve zero', (_label, amount, density) => {
    expect(gramsFromMilliliters(amount, density)).toBe(0);
    expect(millilitersFromGrams(amount, density)).toBe(0);
  });
});
