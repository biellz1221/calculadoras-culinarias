import { describe, expect, it } from 'vitest';

import {
  SUCROSE_BRIX,
  SUCROSE_CELSIUS,
  SUCROSE_WEIGHTS,
  isExtrapolatedCell,
} from './sucrose';
import { GRAMS_PER_POUND } from '@/lib/units';

/**
 * A transcrição da Tabela 2 do NBS 457 conferida pela própria tabela.
 *
 * O PDF é OCR sobre digitalização, e os números saíram da imagem. O que
 * autoriza confiar neles é a circular publicar cada célula duas vezes, em libra
 * e em grama: um dígito lido errado numa das colunas não fecha com a outra.
 * Extração em docs/research/densidade.md.
 */

/**
 * Grama impresso arredonda a 1 g (±0,5) e libra a 0,001 lb (±0,227 g). É a
 * maior discordância que duas colunas certas podem ter.
 */
const ROUNDING_GRAMS = 0.73;

/** A única célula em que a circular imprime libra e grama que não fecham. */
const MISPRINT = { brix: 95, celsius: 15, printedPounds: 12.644, coherentPounds: 12.664 };

function cells() {
  return SUCROSE_BRIX.flatMap((brix, bi) =>
    SUCROSE_CELSIUS.map((celsius, ti) => {
      const [pounds, grams] = SUCROSE_WEIGHTS[bi]![ti]!;
      return { brix, celsius, pounds, grams };
    }),
  );
}

describe('a Tabela 2 do NBS 457', () => {
  it('tem 20 teores por 5 temperaturas', () => {
    expect(SUCROSE_WEIGHTS).toHaveLength(SUCROSE_BRIX.length);
    for (const row of SUCROSE_WEIGHTS) expect(row).toHaveLength(SUCROSE_CELSIUS.length);
  });

  it('fecha libra com grama em todas as células menos uma', () => {
    const disagreeing = cells().filter(
      ({ pounds, grams }) => Math.abs(pounds * GRAMS_PER_POUND - grams) > ROUNDING_GRAMS,
    );

    expect(disagreeing.map(({ brix, celsius }) => ({ brix, celsius }))).toEqual([
      { brix: MISPRINT.brix, celsius: MISPRINT.celsius },
    ]);
  });

  it('a célula que não fecha é erro da libra impressa, e não da grama', () => {
    const cell = cells().find(
      ({ brix, celsius }) => brix === MISPRINT.brix && celsius === MISPRINT.celsius,
    )!;

    // Guarda a libra como a fonte imprimiu — corrigir aqui apagaria o registro.
    expect(cell.pounds).toBe(MISPRINT.printedPounds);
    // E a libra que a grama e a curva pedem fecha dentro do arredondamento.
    expect(Math.abs(MISPRINT.coherentPounds * GRAMS_PER_POUND - cell.grams)).toBeLessThanOrEqual(
      ROUNDING_GRAMS,
    );
  });

  it('é lisa em Brix: nenhum dígito da coluna de gramas destoa da curva', () => {
    // A segunda diferença fica entre 1 e 5 g em todas as colunas. É a menor
    // faixa que a tabela cumpre; um dígito lido errado nas dezenas sai dela.
    SUCROSE_CELSIUS.forEach((_celsius, ti) => {
      const column = SUCROSE_WEIGHTS.map((row) => row[ti]![1]);
      for (let i = 1; i < column.length - 1; i++) {
        const second = column[i + 1]! - 2 * column[i]! + column[i - 1]!;
        expect(second).toBeGreaterThanOrEqual(1);
        expect(second).toBeLessThanOrEqual(5);
      }
    });
  });

  it('fica mais leve com o calor, em todo teor', () => {
    for (const row of SUCROSE_WEIGHTS) {
      for (let ti = 1; ti < row.length; ti++) {
        expect(row[ti]![1]).toBeLessThan(row[ti - 1]![1]);
      }
    }
  });
});

describe('as células que a circular declara extrapoladas', () => {
  it('são as de 75 a 95 °Brix a 10, 25 e 30 °C', () => {
    // p. 27: Plato só mediu os teores altos a 15 e 20 °C.
    expect(isExtrapolatedCell(75, 10)).toBe(true);
    expect(isExtrapolatedCell(95, 30)).toBe(true);
    expect(isExtrapolatedCell(75, 15)).toBe(false);
    expect(isExtrapolatedCell(95, 20)).toBe(false);
    expect(isExtrapolatedCell(70, 10)).toBe(false);
  });
});
