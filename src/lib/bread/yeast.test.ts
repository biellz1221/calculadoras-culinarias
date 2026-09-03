import { describe, expect, it } from 'vitest';

import {
  BASE_TEMPERATURE,
  convertYeast,
  driedLevainFor,
  levainSubstitution,
  riseTimeFactor,
  waterTemperature,
} from './yeast';

describe('conversão entre fermentos', () => {
  it('usa o fator do Camargo para o instantâneo (um terço do fresco)', () => {
    // "um tablete de 15 g corresponde a 5 g do seco", cap. 1.
    expect(convertYeast(15, 'yeast-fresh', 'yeast-instant')).toBeCloseTo(5, 6);
  });

  it('usa o fator do Kayser para o seco ativo (metade do fresco)', () => {
    expect(convertYeast(15, 'yeast-fresh', 'yeast-active-dry')).toBeCloseTo(7.5, 6);
  });

  it('converte nos dois sentidos', () => {
    expect(convertYeast(5, 'yeast-instant', 'yeast-fresh')).toBeCloseTo(15, 6);
    expect(convertYeast(7.5, 'yeast-active-dry', 'yeast-fresh')).toBeCloseTo(15, 6);
  });

  it('converte entre os dois secos passando pelo fresco', () => {
    // 6 g de seco ativo equivalem a 12 g de fresco, que dão 4 g de instantâneo.
    expect(convertYeast(6, 'yeast-active-dry', 'yeast-instant')).toBeCloseTo(4, 6);
  });

  it('é identidade para o mesmo tipo', () => {
    expect(convertYeast(9, 'yeast-instant', 'yeast-instant')).toBeCloseTo(9, 6);
  });

  it('devolve zero para entrada não positiva', () => {
    expect(convertYeast(0, 'yeast-fresh', 'yeast-instant')).toBe(0);
    expect(convertYeast(-3, 'yeast-fresh', 'yeast-instant')).toBe(0);
  });
});

describe('levain', () => {
  it('usa a dose padrão de 20% da farinha', () => {
    const substitution = levainSubstitution(500);
    expect(substitution.levainGrams).toBeCloseTo(100, 6);
  });

  it('desconta metade em farinha e metade em água', () => {
    // O levain líquido é 100% hidratado: entrar com 100 g sem descontar
    // 50 g de farinha e 50 g de água muda a hidratação da massa.
    const { flourAdjustment, waterAdjustment } = levainSubstitution(500);

    expect(flourAdjustment).toBeCloseTo(50, 6);
    expect(waterAdjustment).toBeCloseTo(50, 6);
  });

  it('aceita outras doses dentro da faixa do Kayser', () => {
    expect(levainSubstitution(500, 50).levainGrams).toBeCloseTo(250, 6);
  });

  it('converte líquido para desidratado na razão 4:1', () => {
    expect(driedLevainFor(100)).toBeCloseTo(25, 6);
    expect(driedLevainFor(75)).toBeCloseTo(18.75, 6);
  });
});

describe('fermento e tempo', () => {
  it('dobra o tempo quando o fermento cai pela metade', () => {
    expect(riseTimeFactor(1, 0.5)).toBeCloseTo(2, 6);
  });

  it('reduz o tempo quando o fermento sobe', () => {
    expect(riseTimeFactor(0.5, 1)).toBeCloseTo(0.5, 6);
  });

  it('explica a fermentação longa da napoletana', () => {
    // De 1% para 0,04% o tempo se multiplica por 25, e é por isso que a
    // napoletana do Camargo dorme de 5 a 8 h na segunda fermentação.
    expect(riseTimeFactor(1, 0.04)).toBeCloseTo(25, 6);
  });

  it('não divide por zero', () => {
    expect(riseTimeFactor(1, 0)).toBe(1);
  });
});

describe('temperatura da água', () => {
  it('resolve a temperatura de base do Kayser', () => {
    // Base 55 °C, cozinha a 22 °C e farinha a 20 °C → água a 13 °C.
    const [min, max] = BASE_TEMPERATURE.white;
    expect(min).toBe(54);
    expect(max).toBe(56);
    expect(waterTemperature(55, 22, 20)).toBe(13);
  });

  it('pede água mais fria quando a cozinha está quente', () => {
    const quente = waterTemperature(55, 30, 24);
    const ameno = waterTemperature(55, 22, 20);
    expect(quente).toBeLessThan(ameno);
  });
});
