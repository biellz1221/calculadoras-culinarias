import { describe, expect, it } from 'vitest';

import { ethanolWaterDensity } from './ethanol';
import { sucroseSolutionDensity } from './sucrose';
import {
  NBS_AIR_DENSITY,
  NBS_BRASS_WEIGHT_DENSITY,
  SUCROSE_CELSIUS,
  SUCROSE_WEIGHTS,
} from '@/data/density/sucrose';
import { MILLILITERS_PER_US_GALLON } from '@/lib/units';

/**
 * O motor da calda: interpolação sobre a Tabela 2 do NBS 457, com a correção de
 * ar e de pesos de latão que a própria circular declara (p. 2).
 * Extração e conferência em docs/research/densidade.md.
 */

/** A conversão da p. 2 desfeita à mão, sem passar pelo motor. */
function fromPrinted(gramsPerGallon: number): number {
  const buoyancy = 1 - NBS_AIR_DENSITY / NBS_BRASS_WEIGHT_DENSITY;
  return (gramsPerGallon / MILLILITERS_PER_US_GALLON) * buoyancy + NBS_AIR_DENSITY;
}

function densityAt(brix: number, celsius: number): number {
  const result = sucroseSolutionDensity(brix, celsius);
  if (!result) throw new Error(`fora da tabela: ${brix}, ${celsius}`);
  return result.density;
}

describe('nos pontos da tabela', () => {
  it('devolve o peso impresso convertido pelo ar e pelo latão da p. 2', () => {
    // 50 °Brix a 20 °C: 4,650 g por galão no ar.
    expect(densityAt(50, 20)).toBeCloseTo(fromPrinted(4650), 12);
  });

  it('usa a grama na célula em que a libra impressa está errada', () => {
    // 95 °Brix a 15 °C: a circular imprime 12.644 lb e 5,744 g, e só a grama
    // fecha com a curva. Pela libra, a calda daria 5.735 g por galão.
    expect(densityAt(95, 15)).toBeCloseTo(fromPrinted(5744), 12);
  });
});

describe('duas fontes independentes para a mesma água', () => {
  it('a água do NBS, convertida como a circular manda, bate com a da OIML', () => {
    // Plato (1900), tabelado pelo NBS em 1946, contra Wagenbreth & Blanke,
    // adotados pela OIML em 1973. Com ar e latão da p. 2 a diferença fica em até
    // 0,0106%, com sinal alternando entre as temperaturas. A tolerância é o
    // arredondamento do grama impresso: ±0,5 g sobre 3.765 g, 0,0133%.
    for (const celsius of SUCROSE_CELSIUS) {
      const nbs = densityAt(0, celsius);
      const oiml = ethanolWaterDensity(0, celsius)!;
      expect(Math.abs(nbs - oiml) / oiml).toBeLessThanOrEqual(0.000133);
    }
  });

  it('sem a conversão, as duas não concordariam', () => {
    // O peso no ar cru, por mililitro, fica 0,095% abaixo da OIML — sete vezes o
    // arredondamento. A conversão da p. 2 é necessária, e não enfeite.
    const [, grams] = SUCROSE_WEIGHTS[0]![SUCROSE_CELSIUS.indexOf(20)]!;
    const raw = grams / MILLILITERS_PER_US_GALLON;
    const oiml = ethanolWaterDensity(0, 20)!;
    expect(Math.abs(raw - oiml) / oiml).toBeGreaterThan(0.0009);
  });
});

describe('entre os pontos da tabela', () => {
  it('pondera os quatro cantos pela distância, fora do ponto médio', () => {
    // 51 °Brix a 12 °C: um quinto do caminho de 50 a 55 e dois quintos de 10 a
    // 15, com os pesos escritos aqui à mão. Os outros testes desta seção só
    // conferem ordem — "fica entre os vizinhos" — e ordem sobrevive a ponderação
    // errada: elevar o peso ao quadrado passava por todos, errando 0,5%.
    const corners =
      0.8 * 0.6 * densityAt(50, 10) +
      0.2 * 0.6 * densityAt(55, 10) +
      0.8 * 0.4 * densityAt(50, 15) +
      0.2 * 0.4 * densityAt(55, 15);

    expect(densityAt(51, 12)).toBeCloseTo(corners, 12);
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
