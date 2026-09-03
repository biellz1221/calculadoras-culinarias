import { describe, expect, it } from 'vitest';

import {
  GRAMS_PER_OUNCE,
  GRAMS_PER_POUND,
  celsiusToFahrenheit,
  formatMass,
  formatTemperature,
  formatTemperatureRange,
  formatVolume,
  gramsToOunces,
} from './units';

describe('massa no sistema métrico', () => {
  it('mostra gramas abaixo de um quilo', () => {
    expect(formatMass(325, 'pt-BR', 'metric')).toBe('325,0 g');
    expect(formatMass(325, 'en', 'metric')).toBe('325.0 g');
  });

  it('passa para quilos a partir de 1000 g, mantendo precisão de 1 g', () => {
    expect(formatMass(1500, 'pt-BR', 'metric')).toBe('1,500 kg');
    expect(formatMass(1500, 'en', 'metric')).toBe('1.500 kg');
  });
});

describe('massa no sistema imperial', () => {
  it('converte gramas em onças', () => {
    expect(gramsToOunces(GRAMS_PER_OUNCE)).toBeCloseTo(1, 9);
    expect(formatMass(GRAMS_PER_OUNCE, 'en', 'imperial')).toBe('1.00 oz');
  });

  it('passa para libras a partir de 1 lb', () => {
    expect(formatMass(GRAMS_PER_POUND, 'en', 'imperial')).toBe('1.00 lb');
    expect(formatMass(1000, 'en', 'imperial')).toBe('2.20 lb');
  });

  it('mantém precisão útil para pesar sal', () => {
    // 10 g de sal viram 0,35 oz: duas casas ficam abaixo de 0,3 g de erro.
    expect(formatMass(10, 'en', 'imperial')).toBe('0.35 oz');
  });

  it('respeita o separador decimal do idioma', () => {
    expect(formatMass(10, 'pt-BR', 'imperial')).toBe('0,35 oz');
  });
});

describe('temperatura', () => {
  it('converte Celsius em Fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-10)).toBe(14);
  });

  it('formata forno em cada escala', () => {
    expect(formatTemperature(230, 'pt-BR', 'celsius')).toBe('230 °C');
    expect(formatTemperature(230, 'en', 'fahrenheit')).toBe('446 °F');
  });

  it('aceita casas decimais quando a fonte tem', () => {
    expect(formatTemperature(-10.5, 'pt-BR', 'celsius', 1)).toBe('-10,5 °C');
  });

  it('converte faixas inteiras', () => {
    // A faixa de fermentação lenta, 10–21 °C, vira 50–70 °F.
    expect(formatTemperatureRange([10, 21], 'pt-BR', 'celsius')).toBe('10–21 °C');
    expect(formatTemperatureRange([10, 21], 'en', 'fahrenheit')).toBe('50–70 °F');
  });
});

describe('volume', () => {
  it('usa mililitros no métrico e onças líquidas no imperial', () => {
    expect(formatVolume(500, 'pt-BR', 'metric')).toBe('500 ml');
    expect(formatVolume(500, 'en', 'imperial')).toBe('16.9 fl oz');
  });
});

describe('o sistema imperial aqui é por peso', () => {
  it('não oferece xícara nem colher em unidade alguma', () => {
    // É a promessa do site: o que torna a receita repetível é a balança.
    const samples = [1, 10, 100, 500, 1000, 5000];
    const rendered = samples.flatMap((grams) => [
      formatMass(grams, 'en', 'imperial'),
      formatMass(grams, 'pt-BR', 'metric'),
    ]);

    for (const text of rendered) {
      expect(text).toMatch(/\s(g|kg|oz|lb)$/);
    }
  });
});
