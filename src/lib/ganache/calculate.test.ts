import { describe, expect, it } from 'vitest';

import { calculateGanache, shareOfTotal } from './calculate';
import {
  GANACHE_TEXTURES,
  WATER_CONTENT,
  WHITE_EXTRA_COCOA_BUTTER,
  getTexture,
} from '@/data/ganache/textures';
import type { ChocolateKind } from '@/data/ganache/types';

/**
 * O caso-verdade aqui é raro e vale explicar: o Wybauw publica a **mesma
 * tabela duas vezes**, em razão e em porcentagem. A transcrição que guardamos é
 * a das razões, e o teste confere cada linha contra a segunda forma.
 *
 * Isso importa porque a fonte é um PDF com ruído de extração. Se eu tivesse lido
 * "120" onde está "130", a porcentagem não fecharia — e é o teste que diz isso,
 * não a minha atenção.
 */

function run(textureId: string, softGrams: number, chocolate: ChocolateKind = 'dark') {
  return calculateGanache({ textureId, softGrams, chocolate });
}

describe('a tabela do Wybauw, reproduzida', () => {
  it.each([
    // id, chocolate por 100 de mole, manteiga por 100
    ['truffle', 110, 0],
    ['moulded', 120, 14],
    ['piped', 120, 25],
    ['cut', 130, 24],
  ])('%s: 100 g de creme pedem %i g de chocolate', (id, chocolate, butter) => {
    const result = run(id, 100);

    expect(result.chocolateGrams.min).toBeCloseTo(chocolate, 6);
    expect(result.butterGrams.min).toBeCloseTo(butter, 6);
  });

  it('guarda a faixa do praliné cortado, que é da fonte', () => {
    // "Cut pralines: 100 / 130 to 180 / 24 to 30".
    const result = run('cut', 100);

    expect(result.chocolateGrams.min).toBeCloseTo(130, 6);
    expect(result.chocolateGrams.max).toBeCloseTo(180, 6);
    expect(result.butterGrams.min).toBeCloseTo(24, 6);
    expect(result.butterGrams.max).toBeCloseTo(30, 6);
  });

  it('e é a única com faixa: as outras três são valor único', () => {
    const ranged = GANACHE_TEXTURES.filter(
      (texture) => texture.chocolate.min !== texture.chocolate.max,
    ).map((texture) => texture.id);

    expect(ranged).toEqual(['cut']);
  });

  it.each([
    // As porcentagens que o livro imprime logo abaixo da tabela de razões.
    ['truffle', 47, 53, 0],
    ['moulded', 42, 52, 6],
    ['piped', 40, 50, 10],
  ])('%s bate com a porcentagem publicada: %i / %i / %i', (id, soft, choc, butter) => {
    const share = shareOfTotal(id);
    if (!share) throw new Error(`textura ausente: ${id}`);

    // Tolerância de 1,5 ponto, e não de meio, porque **as porcentagens do livro
    // não são o arredondamento das razões**: elas foram ajustadas para somar
    // 100. Na linha "pipe", 100:120:25 dá 40,8 / 49,0 / 10,2 e o livro imprime
    // 40 / 50 / 10 — um trunca para baixo e o outro sobe. O próprio texto diz
    // "in percentages this is on average". É por isso que a calculadora guarda
    // a razão: ela é o dado, a porcentagem é o resumo.
    expect(Math.abs(share.soft * 100 - soft), 'moles').toBeLessThan(1.5);
    expect(Math.abs(share.chocolate * 100 - choc), 'chocolate').toBeLessThan(1.5);
    expect(Math.abs(share.butter * 100 - butter), 'manteiga').toBeLessThan(1.5);
  });

  it('as razões transcritas somam 100% em toda linha', () => {
    // É a redundância que valida a transcrição de um PDF com ruído: se eu
    // tivesse lido 120 onde está 130, isto continuaria fechando — mas a
    // asserção anterior, contra a porcentagem publicada, não.
    for (const texture of GANACHE_TEXTURES) {
      const share = shareOfTotal(texture.id);
      if (!share) throw new Error(texture.id);
      const total = share.soft + share.chocolate + share.butter;
      expect(total, texture.id).toBeCloseTo(1, 10);
    }
  });
});

describe('a manteiga de cacau do chocolate branco', () => {
  it('só entra no branco', () => {
    expect(run('moulded', 100, 'dark').extraCocoaButterGrams).toBe(0);
    expect(run('moulded', 100, 'milk').extraCocoaButterGrams).toBe(0);
    expect(run('moulded', 100, 'white').extraCocoaButterGrams).toBeGreaterThan(0);
  });

  it('são 2% da receita', () => {
    // 100 de creme, 120 de chocolate, 14 de manteiga = 234 antes do extra.
    const result = run('moulded', 100, 'white');
    expect(result.extraCocoaButterGrams).toBeCloseTo(234 * WHITE_EXTRA_COCOA_BUTTER, 6);
  });

  it('não muda a proporção, só acrescenta', () => {
    // O livro é explícito: o branco precisa de manteiga de cacau extra para dar
    // a mesma textura, e não de outra proporção.
    const dark = run('piped', 200, 'dark');
    const white = run('piped', 200, 'white');

    expect(white.chocolateGrams).toEqual(dark.chocolateGrams);
    expect(white.butterGrams).toEqual(dark.butterGrams);
  });
});

describe('a água da receita', () => {
  it('soma os teores publicados do creme e da manteiga', () => {
    // 100 g de creme a 60 % e 14 g de manteiga a 17 %.
    const result = run('moulded', 100);
    expect(result.waterGrams.min).toBeCloseTo(
      100 * WATER_CONTENT.cream + 14 * WATER_CONTENT.butter,
      6,
    );
  });

  it('o chocolate não traz água', () => {
    // A trufa não leva manteiga: a água é só a do creme.
    const result = run('truffle', 100);
    expect(result.waterGrams.min).toBeCloseTo(60, 6);
    expect(result.waterGrams.max).toBeCloseTo(60, 6);
  });

  it('mais chocolate dilui a água — que é a alavanca do livro', () => {
    // "Decreasing the water content" é o primeiro passo que ele indica para
    // melhorar a validade, e mais chocolate é o caminho mais simples.
    const truffle = run('truffle', 100);
    const cut = run('cut', 100);

    expect(cut.waterShare).toBeLessThan(truffle.waterShare);
  });

  it('não inventa fração com receita vazia', () => {
    expect(run('moulded', 0).waterShare).toBe(0);
  });
});

describe('entradas de canto', () => {
  it('textura desconhecida devolve zeros, e não uma proporção inventada', () => {
    const result = run('mousse', 200);
    expect(result.chocolateGrams.max).toBe(0);
    expect(result.totalGrams.max).toBe(0);
  });

  it('peso negativo é tratado como zero', () => {
    expect(run('moulded', -100).chocolateGrams.max).toBe(0);
  });

  it('escala linear: o dobro de creme, o dobro de tudo', () => {
    const one = run('cut', 250);
    const two = run('cut', 500);

    expect(two.chocolateGrams.min).toBeCloseTo(one.chocolateGrams.min * 2, 10);
    expect(two.waterShare).toBeCloseTo(one.waterShare, 10);
  });

  it('a textura sem manteiga não devolve manteiga', () => {
    const truffle = getTexture('truffle');
    expect(truffle?.butter).toEqual({ min: 0, max: 0 });
    expect(run('truffle', 500).butterGrams).toEqual({ min: 0, max: 0 });
  });
});
