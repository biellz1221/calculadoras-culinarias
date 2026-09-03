import { describe, expect, it } from 'vitest';

import {
  formatLiters,
  formatMass,
  formatTemperature,
  fromInputMass,
  massUnitForBatch,
  toInputMass,
} from '@/lib/gelato/mass';

describe('apresentação de massa do gelato', () => {
  it('troca para quilos só acima de 2 L', () => {
    expect(massUnitForBatch(0.5)).toBe('g');
    expect(massUnitForBatch(2)).toBe('g');
    expect(massUnitForBatch(2.25)).toBe('kg');
  });

  it('formata com a vírgula do idioma', () => {
    expect(formatMass(1234.5, 'g', 'pt-BR')).toBe('1.234,5 g');
    expect(formatMass(1234.5, 'g', 'en')).toBe('1,234.5 g');
    expect(formatMass(1980, 'kg', 'pt-BR')).toBe('1,980 kg');
  });

  it('mostra o volume sem casas quando é redondo', () => {
    expect(formatLiters(1, 'pt-BR')).toBe('1 L');
    expect(formatLiters(1.25, 'pt-BR')).toBe('1,25 L');
    expect(formatLiters(1.25, 'en')).toBe('1.25 L');
  });

  it('formata a temperatura de serviço', () => {
    expect(formatTemperature(-10.72, 'pt-BR')).toBe('-10,7 °C');
  });

  it('vai e volta do campo de entrada sem perder o grama', () => {
    expect(toInputMass(1423, 'kg')).toBe(1.423);
    expect(fromInputMass(1.423, 'kg')).toBe(1423);
    expect(toInputMass(120.44, 'g')).toBe(120.4);
    expect(fromInputMass(120.4, 'g')).toBe(120.4);
    expect(fromInputMass(Number.NaN, 'g')).toBe(0);
  });
});
