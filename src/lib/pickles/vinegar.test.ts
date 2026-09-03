import { describe, expect, it } from 'vitest';

import {
  calculateVinegarPickle,
  minimumVinegarShare,
  vinegarShareOf,
} from './vinegar';
import { MIN_BRINE_ACIDITY, REFERENCE_ACIDITY } from '@/data/pickles/ranges';

const BASE = {
  liquidGrams: 500,
  vinegarParts: 1,
  waterParts: 1,
  saltPercent: 2,
  sugarPercent: 4,
};

describe('proporção de referência do Noma', () => {
  const result = calculateVinegarPickle({
    ...BASE,
    vinegarAcidity: REFERENCE_ACIDITY,
  });

  it('divide o líquido meio a meio', () => {
    expect(result.vinegarGrams).toBeCloseTo(250, 6);
    expect(result.waterGrams).toBeCloseTo(250, 6);
  });

  it('entrega exatamente o piso de acidez', () => {
    // 1:1 com vinagre de 5% dá 2,5% de ácido acético no líquido pronto.
    expect(result.brineAcidity).toBeCloseTo(MIN_BRINE_ACIDITY, 6);
    expect(result.status).toBe('ok');
  });

  it('calcula sal e açúcar sobre o líquido de cobertura', () => {
    expect(result.saltGrams).toBeCloseTo(10, 6);
    expect(result.sugarGrams).toBeCloseTo(20, 6);
  });
});

describe('vinagre mais fraco que o de referência', () => {
  it('avisa quando a diluição derruba a acidez abaixo do piso', () => {
    const result = calculateVinegarPickle({ ...BASE, vinegarAcidity: 4 });

    expect(result.brineAcidity).toBeCloseTo(2, 6);
    expect(result.status).toBe('below-minimum');
  });

  it('diz qual proporção mínima resolve', () => {
    // Com vinagre de 4%, é preciso que 62,5% do líquido seja vinagre —
    // ou seja, 0,6 parte de água para cada parte de vinagre.
    const result = calculateVinegarPickle({ ...BASE, vinegarAcidity: 4 });

    expect(result.minimumVinegarShare).toBeCloseTo(0.625, 6);
    expect(result.minimumWaterPerVinegar).toBeCloseTo(0.6, 6);
  });

  it('aprova quando a pessoa segue a proporção mínima', () => {
    const result = calculateVinegarPickle({
      ...BASE,
      vinegarAcidity: 4,
      vinegarParts: 0.625,
      waterParts: 0.375,
    });

    expect(result.brineAcidity).toBeCloseTo(MIN_BRINE_ACIDITY, 6);
    expect(result.status).toBe('ok');
  });
});

describe('vinagre que não serve de jeito nenhum', () => {
  it('recusa em vez de sugerir uma proporção impossível', () => {
    // Abaixo de 2,5% de acidez, nem sem água nenhuma o líquido alcança o piso.
    const result = calculateVinegarPickle({
      ...BASE,
      vinegarAcidity: 2,
      waterParts: 0,
    });

    expect(result.status).toBe('unusable-vinegar');
    expect(result.minimumVinegarShare).toBeGreaterThan(1);
    // Melhor não exibir número nenhum do que exibir um que não existe.
    expect(result.minimumWaterPerVinegar).toBeUndefined();
  });

  it('trata acidez zero sem estourar', () => {
    const result = calculateVinegarPickle({ ...BASE, vinegarAcidity: 0 });

    expect(result.status).toBe('unusable-vinegar');
    expect(Number.isFinite(result.brineAcidity)).toBe(true);
  });
});

describe('fração de vinagre', () => {
  it('converte partes em fração', () => {
    expect(vinegarShareOf(1, 1)).toBeCloseTo(0.5, 6);
    expect(vinegarShareOf(2, 1)).toBeCloseTo(2 / 3, 6);
    expect(vinegarShareOf(1, 0)).toBeCloseTo(1, 6);
  });

  it('devolve zero quando não há partes', () => {
    expect(vinegarShareOf(0, 0)).toBe(0);
  });

  it('calcula a fração mínima a partir da acidez do rótulo', () => {
    expect(minimumVinegarShare(5)).toBeCloseTo(0.5, 6);
    expect(minimumVinegarShare(10)).toBeCloseTo(0.25, 6);
    expect(minimumVinegarShare(0)).toBe(Number.POSITIVE_INFINITY);
  });
});
