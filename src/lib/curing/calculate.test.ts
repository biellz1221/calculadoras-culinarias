import { describe, expect, it } from 'vitest';

import { calculateCure, cureGramsFor, ingoingPpm, statusFor } from './calculate';
import { METHOD_CEILING_PPM, MIN_INGOING_PPM } from '@/data/curing/cures';

/**
 * Os casos-verdade vêm das próprias fontes, e não de conta nossa.
 *
 * Marianski publica uma tabela de dose por quilo para o Cure #1 e outra para o
 * Peklosol; Ruhlman publica uma proporção de trabalho; o 9 CFR publica os tetos
 * em onça por libra. Se o motor reproduz os quatro, ele está certo pelas
 * fontes, não pela minha álgebra.
 */

const OZ = 28.349523125;
const LB = 453.59237;

describe('conversão de entrada', () => {
  it.each([
    [75, 1.2],
    [100, 1.6],
    [120, 1.9],
    [156, 2.5],
  ])('reproduz a tabela do Marianski: %i ppm → %s g de #1 por kg', (ppm, grams) => {
    expect(cureGramsFor(ppm, 1000, 0.0625)).toBeCloseTo(grams, 1);
  });

  it.each([
    [75, 12.5],
    [100, 16.6],
    [120, 20],
    [150, 25],
  ])('reproduz a tabela do Peklosol: %i ppm → %s g por kg', (ppm, grams) => {
    expect(cureGramsFor(ppm, 1000, 0.006)).toBeCloseTo(grams, 0);
  });

  it('reproduz os tetos do 9 CFR 424.21(c)', () => {
    // ¼ oz por 100 lb de carne moída dá 156,25 ppm exatos. O teto que o
    // código usa é 156, arredondado para baixo: em calculadora de segurança,
    // o arredondamento vai para o lado restritivo.
    expect(ingoingPpm(0.25 * OZ, 100 * LB, 1)).toBeCloseTo(156.25, 6);
    expect(METHOD_CEILING_PPM.comminuted).toBeLessThanOrEqual(156.25);
    // 1 oz por 100 lb na cura seca.
    expect(ingoingPpm(1 * OZ, 100 * LB, 1)).toBeCloseTo(625, 0);
  });

  it('reproduz a proporção de trabalho do Ruhlman', () => {
    // "1 ounce/25 grams of pink salt is enough for 25 pounds/11.25 kilograms".
    expect(ingoingPpm(25, 11_250, 0.0625)).toBeCloseTo(138.9, 1);
  });

  it('vai e volta sem perder nada', () => {
    const grams = cureGramsFor(150, 2500, 0.0625);
    expect(ingoingPpm(grams, 2500, 0.0625)).toBeCloseTo(150, 10);
  });
});

describe('faixa segura', () => {
  it('marca abaixo do piso como perigoso, não como fora de faixa', () => {
    // Nitrito de menos não segura o botulismo. Não é questão de gosto.
    expect(statusFor(MIN_INGOING_PPM - 1, 'comminuted')).toBe('below-minimum');
    expect(statusFor(MIN_INGOING_PPM, 'comminuted')).toBe('ok');
  });

  it('usa o teto do método, que muda entre moído e cura seca', () => {
    expect(statusFor(200, 'comminuted')).toBe('above-limit');
    expect(statusFor(200, 'dry')).toBe('ok');
    expect(statusFor(METHOD_CEILING_PPM.dry + 1, 'dry')).toBe('above-limit');
  });
});

describe('receita completa', () => {
  it('calcula 1 kg de carne moída a 150 ppm com Cure #1', () => {
    const result = calculateCure(
      { meatGrams: 1000, cureId: 'cure-1', targetPpm: 150 },
      'comminuted',
    );

    expect(result.cureGrams).toBeCloseTo(2.4, 3);
    expect(result.nitritePpm).toBeCloseTo(150, 6);
    expect(result.nitratePpm).toBe(0);
    expect(result.status).toBe('ok');
  });

  it('conta o nitrato do Cure #2, que a norma brasileira soma', () => {
    const result = calculateCure(
      { meatGrams: 1000, cureId: 'cure-2', targetPpm: 150 },
      'dry',
    );

    // 4% de nitrato contra 6,25% de nitrito: o nitrato entra em 96 ppm.
    expect(result.nitratePpm).toBeCloseTo(96, 6);
  });

  it('devolve o sal comum que vem junto', () => {
    // Esquecer isso é o erro que deixa o produto salgado demais.
    const { cureGrams, saltFromCureGrams } = calculateCure(
      { meatGrams: 1000, cureId: 'cure-1', targetPpm: 156 },
      'comminuted',
    );

    expect(saltFromCureGrams).toBeCloseTo(cureGrams * 0.9375, 6);
  });

  it('não divide por zero nem inventa número', () => {
    const vazio = calculateCure(
      { meatGrams: 0, cureId: 'cure-1', targetPpm: 150 },
      'comminuted',
    );
    expect(vazio.cureGrams).toBe(0);
    expect(vazio.nitritePpm).toBe(0);

    const inexistente = calculateCure(
      { meatGrams: 1000, cureId: 'não-existe', targetPpm: 150 },
      'comminuted',
    );
    expect(inexistente.cureGrams).toBe(0);
  });
});
