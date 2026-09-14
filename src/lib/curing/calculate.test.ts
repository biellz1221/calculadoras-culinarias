import { describe, expect, it } from 'vitest';

import { calculateCure, cureGramsFor, ingoingPpm, statusFor } from './calculate';
import {
  METHOD_CEILING_PPM,
  MIN_INGOING_PPM,
  MOLAR_MASSES,
  NITRATE_ONLY_RESIDUAL_PPM,
  NITRATE_TO_NITRITE,
  RESIDUAL_LIMITS,
  combinedAsSodiumNitrite,
} from '@/data/curing/cures';

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

describe('a soma de nitrato com nitrito, na moeda da norma', () => {
  it('reproduz a conversão que o ofício publica', () => {
    // Ofício DIPOA 15/2009, p. 5: "o valor de nitrato deve ser dividido por
    // 1,231 [...] e somado ao resultado de nitrito".
    expect(combinedAsSodiumNitrite(100, 0)).toBe(100);
    expect(combinedAsSodiumNitrite(0, 1.231)).toBeCloseTo(1, 10);
    expect(combinedAsSodiumNitrite(150, 123.1)).toBeCloseTo(250, 10);
  });

  it('o ofício confere pelas próprias massas molares que ele imprime', () => {
    // Ele publica "PM NaNO2 = 69,00 g · PM NaNO3 = 84,99 g" logo abaixo dos
    // fatores. O do sódio é essa razão truncada na terceira casa.
    const sodium = MOLAR_MASSES.sodiumNitrate / MOLAR_MASSES.sodiumNitrite;
    expect(sodium).toBeCloseTo(1.2317, 4);

    // E o publicado é essa razão **truncada**, não arredondada: 1,23174
    // arredondaria para 1,232, e o ofício imprime 1,231. A distinção importa
    // porque truncar puxa o fator para baixo, e fator menor dá equivalente em
    // nitrito maior — de novo para o lado restritivo.
    expect(NITRATE_TO_NITRITE.sodium).toBe(Math.floor(sodium * 1000) / 1000);
    expect(NITRATE_TO_NITRITE.sodium).toBeLessThan(sodium);
  });

  it('o fator do potássio não fecha com as massas do próprio ofício', () => {
    // 101,10 ÷ 69,00 dá 1,46522, e o ofício imprime 1,4637. É um milésimo, e
    // cai para o lado restritivo: divisor menor dá equivalente maior, e o teto
    // de 150 chega antes.
    //
    // O site usa o publicado, e não o recalculado. Citar norma é reproduzir o
    // que ela manda fazer; corrigir a aritmética dela seria assinar uma régua
    // que não é a dela. Este teste existe para que a diferença fique registrada
    // em vez de virar descuido.
    const potassium = MOLAR_MASSES.potassiumNitrate / MOLAR_MASSES.sodiumNitrite;
    expect(potassium).toBeCloseTo(1.4652, 4);
    expect(NITRATE_TO_NITRITE.potassium).toBeLessThan(potassium);
    expect(potassium - NITRATE_TO_NITRITE.potassium).toBeLessThan(0.002);
  });

  it('com o sal nº 1 a soma é o próprio nitrito', () => {
    // O #1 não leva nitrato: a linha extra não teria o que dizer, e a tela não
    // a mostra.
    const result = calculateCure(
      { meatGrams: 1000, cureId: 'cure-1', targetPpm: 156 },
      'comminuted',
    );

    expect(result.nitratePpm).toBe(0);
    expect(result.combinedAsNitritePpm).toBeCloseTo(result.nitritePpm, 10);
  });

  it('com o sal nº 2 a soma passa de 230 ppm num alvo de 156', () => {
    // O #2 é 6,25% de nitrito e 4% de nitrato, então o nitrato entra na razão
    // 4,00 ÷ 6,25 = 0,64 do nitrito. É a conta que a página mostra, e o
    // resultado não é adivinhável de cabeça.
    const result = calculateCure(
      { meatGrams: 1000, cureId: 'cure-2', targetPpm: 156 },
      'comminuted',
    );

    expect(result.nitritePpm).toBeCloseTo(156, 6);
    expect(result.nitratePpm).toBeCloseTo(156 * 0.64, 6);
    expect(result.combinedAsNitritePpm).toBeCloseTo(156 + (156 * 0.64) / 1.231, 6);
    expect(result.combinedAsNitritePpm).toBeGreaterThan(230);
  });

  it('a soma não vira aviso de conformidade', () => {
    // A trava que importa nesta página: o status continua vindo do alvo de
    // **entrada** contra o teto americano, e não da soma contra os 150 ppm
    // brasileiros, que são de resíduo. Um produto pode ter soma de entrada bem
    // acima de 150 e status `ok`, e é isso que este teste fixa.
    const result = calculateCure(
      { meatGrams: 1000, cureId: 'cure-2', targetPpm: 156 },
      'comminuted',
    );

    expect(result.combinedAsNitritePpm).toBeGreaterThan(RESIDUAL_LIMITS.br.ppm);
    expect(result.status).toBe('ok');
  });

  it('o teto de nitrato sozinho é o dobro, e é de resíduo', () => {
    // Ofício, p. 2: 150 para nitrito, 150 para a combinação, 300 para nitrato.
    expect(NITRATE_ONLY_RESIDUAL_PPM).toBe(2 * RESIDUAL_LIMITS.br.ppm);
  });
});
