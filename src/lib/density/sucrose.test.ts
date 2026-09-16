import { describe, expect, it } from 'vitest';

import { ethanolWaterDensity } from './ethanol';
import { MILLILITERS_PER_US_GALLON, sucroseSolutionDensity } from './sucrose';
import { NBS_AIR_DENSITY, SUCROSE_CELSIUS, SUCROSE_WEIGHTS } from '@/data/density/sucrose';

/**
 * O motor da calda: interpolação sobre a Tabela 2 do NBS 457, com a correção de
 * ar que a própria circular declara.
 * Extração e conferência em docs/research/densidade.md.
 */

function densityAt(brix: number, celsius: number): number {
  const result = sucroseSolutionDensity(brix, celsius);
  if (!result) throw new Error(`fora da tabela: ${brix}, ${celsius}`);
  return result.density;
}

describe('nos pontos da tabela', () => {
  it('devolve o peso impresso por mililitro, somado ao ar da p. 28', () => {
    // 50 °Brix a 20 °C: 4,650 g por galão no ar.
    expect(densityAt(50, 20)).toBeCloseTo(4650 / MILLILITERS_PER_US_GALLON + NBS_AIR_DENSITY, 12);
  });

  it('o galão é 3.785,411784 mL, que é a definição legal', () => {
    expect(MILLILITERS_PER_US_GALLON).toBeCloseTo(3785.411784, 9);
  });

  it('usa a grama na célula em que a libra impressa está errada', () => {
    // 95 °Brix a 15 °C: a circular imprime 12.644 lb e 5,744 g, e só a grama
    // fecha com a curva. Pela libra, a calda daria 5.735 g por galão.
    expect(densityAt(95, 15)).toBeCloseTo(5744 / MILLILITERS_PER_US_GALLON + NBS_AIR_DENSITY, 12);
  });
});

describe('duas fontes independentes para a mesma água', () => {
  it('a água do NBS, corrigida pelo ar, bate com a da OIML', () => {
    // Plato (1900), tabelado pelo NBS em 1946, contra Wagenbreth & Blanke,
    // adotados pela OIML em 1973. Sem a correção de ar a diferença é de 0,1%;
    // com ela, fica em até 0,025%. A tolerância de 0,03% soma o arredondamento
    // do grama impresso (±0,013%) e o empuxo sobre os pesos da balança, que a
    // circular não declara (~0,014%).
    for (const celsius of SUCROSE_CELSIUS) {
      const nbs = densityAt(0, celsius);
      const oiml = ethanolWaterDensity(0, celsius)!;
      expect(Math.abs(nbs - oiml) / oiml).toBeLessThanOrEqual(0.0003);
    }
  });

  it('sem a correção de ar, as duas não concordariam', () => {
    // Prova de que a correção é necessária, e não enfeite.
    const withoutAir = densityAt(0, 20) - NBS_AIR_DENSITY;
    const oiml = ethanolWaterDensity(0, 20)!;
    expect(Math.abs(withoutAir - oiml) / oiml).toBeGreaterThan(0.0009);
  });
});

describe('entre os pontos da tabela', () => {
  it('erra menos que o arredondamento da fonte ao interpolar', () => {
    // O erro da interpolação linear no meio de um intervalo é a segunda
    // diferença dividida por 8. Tirada da própria tabela, e não da documentação.
    let worstSecond = 0;
    SUCROSE_CELSIUS.forEach((_celsius, ti) => {
      const column = SUCROSE_WEIGHTS.map((row) => row[ti]![1]);
      for (let i = 1; i < column.length - 1; i++) {
        worstSecond = Math.max(worstSecond, Math.abs(column[i + 1]! - 2 * column[i]! + column[i - 1]!));
      }
    });

    const worstMidpointGrams = worstSecond / 8;
    // Menor que o ±0,5 g do grama impresso.
    expect(worstMidpointGrams).toBeLessThan(0.7);
  });

  it('fica entre os vizinhos no meio de um intervalo', () => {
    const middle = densityAt(52.5, 20);
    expect(middle).toBeGreaterThan(densityAt(50, 20));
    expect(middle).toBeLessThan(densityAt(55, 20));
  });

  it('fica mais leve com o calor', () => {
    for (const brix of [0, 30, 65, 90]) {
      expect(densityAt(brix, 27.5)).toBeLessThan(densityAt(brix, 22.5));
    }
  });
});

describe('extrapolação declarada', () => {
  it('não marca o que Plato mediu', () => {
    expect(sucroseSolutionDensity(80, 20)!.extrapolated).toBe(false);
    expect(sucroseSolutionDensity(95, 15)!.extrapolated).toBe(false);
    expect(sucroseSolutionDensity(72.5, 20)!.extrapolated).toBe(false);
  });

  it('marca quando uma célula em itálico pesa na resposta', () => {
    expect(sucroseSolutionDensity(80, 25)!.extrapolated).toBe(true);
    // Entre 70 e 75 °Brix, entre 20 e 25 °C: o canto (75, 25) é itálico.
    expect(sucroseSolutionDensity(72.5, 22.5)!.extrapolated).toBe(true);
  });

  it('não marca quando a célula em itálico tem peso zero', () => {
    // 70 °Brix a 25 °C cai exatamente na linha de 70, que não é itálica.
    expect(sucroseSolutionDensity(70, 25)!.extrapolated).toBe(false);
  });
});

describe('fora da tabela', () => {
  it.each([
    ['Brix negativo', -1, 20],
    ['acima de 95 °Brix', 96, 20],
    ['Brix que não é número', Number.NaN, 20],
    ['abaixo de 10 °C', 50, 9.9],
    ['calda quente, acima de 30 °C', 50, 30.1],
    ['temperatura que não é número', 50, Number.NaN],
  ])('%s devolve nulo', (_label, brix, celsius) => {
    expect(sucroseSolutionDensity(brix, celsius)).toBeNull();
  });

  it('responde nas quatro bordas', () => {
    expect(sucroseSolutionDensity(0, 10)).not.toBeNull();
    expect(sucroseSolutionDensity(95, 30)).not.toBeNull();
    expect(sucroseSolutionDensity(0, 30)).not.toBeNull();
    expect(sucroseSolutionDensity(95, 10)).not.toBeNull();
  });
});
