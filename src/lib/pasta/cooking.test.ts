import { describe, expect, it } from 'vitest';

import {
  cookRuleFor,
  cookingWaterLitres,
  piecesFor,
  servingsFromPieces,
} from './cooking';

describe('água de cozimento', () => {
  it('usa 1 L por 100 g de massa, como o Zielonka', () => {
    // 400 g (4 porções) pedem 4 L.
    expect(cookingWaterLitres(400)).toBeCloseTo(4, 6);
    expect(cookingWaterLitres(1000)).toBeCloseTo(10, 6);
  });

  it('respeita o piso de 3 L da Hazan em porção pequena', () => {
    expect(cookingWaterLitres(100)).toBeCloseTo(3, 6);
    expect(cookingWaterLitres(0)).toBeCloseTo(3, 6);
  });

  it('não quebra com entrada inválida', () => {
    expect(cookingWaterLitres(-500)).toBeCloseTo(3, 6);
    expect(cookingWaterLitres(Number.NaN)).toBeCloseTo(3, 6);
  });
});

describe('tempo de cozimento', () => {
  it('separa massa ao ovo de massa de sêmola', () => {
    expect(cookRuleFor('egg').minutes).toEqual([1.5, 2]);
    expect(cookRuleFor('vegan').minutes).toEqual([5, 6]);
    expect(cookRuleFor('gluten-free').minutes).toEqual([1.5, 2]);
  });

  it('cita a fonte de cada tempo', () => {
    expect(cookRuleFor('vegan').citations.length).toBeGreaterThan(0);
    expect(cookRuleFor('egg').citations.length).toBeGreaterThan(0);
  });
});

describe('massa recheada por pessoa', () => {
  it('reproduz os ~100 tortellini que a Hazan serve a 6 em caldo', () => {
    expect(piecesFor(6, 'brodo')).toBe(102);
    expect(servingsFromPieces(100, 'brodo')).toBeCloseTo(5.9, 1);
  });

  it('usa as duas dúzias por pessoa quando é com molho', () => {
    expect(piecesFor(4, 'sauce')).toBe(96);
    // A receita cheia, de 200 tortellini, serve ~8 com molho.
    expect(servingsFromPieces(200, 'sauce')).toBeCloseTo(8.3, 1);
  });

  it('não devolve número negativo', () => {
    expect(piecesFor(-3, 'sauce')).toBe(0);
    expect(servingsFromPieces(-10, 'brodo')).toBe(0);
  });
});
