import { describe, expect, it } from 'vitest';

import {
  ethanolWaterDensity,
  massFractionFromVolume,
  volumeFractionFromMass,
} from './ethanol';

/**
 * A fórmula da OIML R 22 contra o que ela deveria reproduzir.
 *
 * Os 44 coeficientes foram transcritos à mão de uma imagem. A conferência
 * precisa variar teor e temperatura ao mesmo tempo — só água, ou só 20 °C,
 * deixa 32 coeficientes sem teste (ver a grade da Tabela I). Os casos do etanol
 * puro e do máximo da água não saem de tabela nenhuma.
 * Extração e conferência em docs/research/densidade.md, Parte IV-A.
 */

/** Densidade da fórmula em kg/m³, a unidade das tabelas. */
function kgPerCubicMeter(massFraction: number, celsius: number): number {
  const density = ethanolWaterDensity(massFraction, celsius);
  if (density === null) throw new Error(`fora da faixa: ${massFraction}, ${celsius}`);
  return density * 1000;
}

describe('a fórmula reproduz as tabelas', () => {
  it('reproduz a água da Tabela I do próprio documento, de 0 a 10 °C', () => {
    // OIML R 22, p. 20, linha p = 0, lida na imagem. A tabela imprime duas
    // casas; a tolerância é o arredondamento dela.
    const printed = [
      999.84, 999.9, 999.94, 999.96, 999.97, 999.96, 999.94, 999.9, 999.84, 999.78, 999.7,
    ];

    printed.forEach((value, celsius) => {
      expect(Math.abs(kgPerCubicMeter(0, celsius) - value)).toBeLessThanOrEqual(0.005);
    });
  });

  /**
   * Teor e temperatura variando juntos.
   *
   * Os casos de água (teor zero) e os de 20 °C deixam de fora 32 dos 44
   * coeficientes: os `Cᵢ,ₖ` multiplicam `p^k·(t−20)^i`, que se anula nos dois.
   * Corromper `C₂,₄` passava por todos os outros testes deste arquivo; nesta
   * grade, derruba 29 das 38 células. Lidas na imagem girada da Tabela I.
   */
  it.each([
    [20, 5, 0, 991.27], [20, 5, 5, 991.31], [20, 5, 10, 990.98],
    [20, 10, 0, 984.75], [20, 10, 5, 984.51], [20, 10, 10, 983.93],
    [20, 12, 0, 982.62], [20, 12, 10, 981.46],
    [21, 80, 0, 860.3], [21, 80, 5, 856.14], [21, 80, 10, 851.93],
    [21, 90, 0, 834.95], [21, 90, 5, 830.74], [21, 90, 10, 826.49],
    [21, 100, 0, 806.22], [21, 100, 5, 801.99], [21, 100, 10, 797.76],
    [24, 30, 20, 953.78], [24, 30, 25, 950.63], [24, 30, 30, 947.37],
    [24, 40, 20, 935.15], [24, 40, 25, 931.42], [24, 40, 30, 927.64],
    [24, 50, 20, 913.77], [24, 50, 25, 909.77], [24, 50, 30, 905.71],
    [27, 70, 30, 859.02], [27, 70, 35, 854.65], [27, 70, 40, 850.22],
    [27, 80, 30, 834.65], [27, 80, 35, 830.2], [27, 80, 40, 825.68],
    [27, 90, 30, 809.13], [27, 90, 35, 804.7], [27, 90, 40, 800.21],
    [27, 100, 30, 780.65], [27, 100, 35, 776.31], [27, 100, 40, 771.93],
  ])('reproduz a Tabela I, p. %i: %i%% em massa a %i °C → %f', (_page, percent, celsius, printed) => {
    // Duas casas impressas: a tolerância é o arredondamento, e a pior célula
    // (40% a 20 °C) fica em 0,00497.
    expect(Math.abs(kgPerCubicMeter(percent / 100, celsius) - printed)).toBeLessThanOrEqual(0.005);
  });

  it('reproduz a tabela da OIV, que é outro documento e mede em volume', () => {
    // OIV-MA-AS312-02 (R2009), Tabela I, linha de 20 °C, de 0 a 11% vol. A OIV
    // diz que suas tabelas vêm da OIML, mas imprime por teor em VOLUME: passar
    // por aqui exercita também a ponte massa ↔ volume.
    const printed = [
      998.2, 996.7, 995.2, 993.81, 992.42, 991.06, 989.73, 988.44, 987.17, 985.93, 984.71,
      983.52,
    ];

    printed.forEach((value, percent) => {
      const massFraction = massFractionFromVolume(percent / 100)!;
      // A 2% a OIV imprime uma casa só ("995.2"), e a fórmula dá 995,23.
      const tolerance = percent === 2 ? 0.05 : 0.01;
      expect(Math.abs(kgPerCubicMeter(massFraction, 20) - value)).toBeLessThanOrEqual(
        tolerance,
      );
    });
  });
});

describe('a fórmula acerta o que não sai de tabela', () => {
  it('dá ao etanol puro a densidade da errata da capa', () => {
    // OIML R 22, p. 1: "page 5, last line, read: (≈ 789,24 kg/m³)".
    expect(Math.abs(kgPerCubicMeter(1, 20) - 789.24)).toBeLessThanOrEqual(0.005);
  });

  it('põe o máximo de densidade da água perto de 4 °C', () => {
    // Fato físico (3,98 °C), não número de tabela. Varre de décimo em décimo.
    let densestCelsius = 0;
    let best = 0;
    for (let tenth = 0; tenth <= 100; tenth++) {
      const value = kgPerCubicMeter(0, tenth / 10);
      if (value > best) {
        best = value;
        densestCelsius = tenth / 10;
      }
    }
    expect(densestCelsius).toBeGreaterThanOrEqual(3.8);
    expect(densestCelsius).toBeLessThanOrEqual(4.2);
  });
});

describe('teor em massa não é teor em volume', () => {
  it('40% em volume são um terço em massa, e não 36%', () => {
    // A pesquisa chegou a afirmar "36% em massa → 0,948 g/mL", escrito antes de
    // haver fórmula. 0,948 é a densidade de 40% em VOLUME. O teste nasce da
    // correção, para que a troca não volte calada.
    const massFraction = massFractionFromVolume(0.4)!;
    expect(massFraction).toBeCloseTo(0.333, 3);
    expect(ethanolWaterDensity(massFraction, 20)).toBeCloseTo(0.948, 3);

    expect(volumeFractionFromMass(0.36)).toBeCloseTo(0.43, 2);
    expect(ethanolWaterDensity(0.36, 20)).toBeCloseTo(0.943, 3);
  });

  it('ida e volta entre massa e volume devolve o mesmo teor', () => {
    for (let percent = 0; percent <= 100; percent += 5) {
      const volume = volumeFractionFromMass(percent / 100)!;
      expect(massFractionFromVolume(volume)).toBeCloseTo(percent / 100, 9);
    }
  });

  it('volume fica sempre acima da massa entre água e álcool puros', () => {
    // O etanol é mais leve que a água: a mesma massa ocupa mais volume.
    for (let percent = 5; percent <= 95; percent += 5) {
      expect(volumeFractionFromMass(percent / 100)!).toBeGreaterThan(percent / 100);
    }
  });
});

describe('entrada que não descreve uma mistura líquida', () => {
  it.each([
    ['teor negativo', -0.01, 20],
    ['teor acima de 100%', 1.01, 20],
    ['teor que não é número', Number.NaN, 20],
    ['abaixo de zero, onde pode haver gelo', 0.4, -1],
    ['acima dos 40 °C da fonte', 0.4, 41],
    ['temperatura infinita', 0.4, Number.POSITIVE_INFINITY],
  ])('%s devolve nulo', (_label, massFraction, celsius) => {
    expect(ethanolWaterDensity(massFraction, celsius)).toBeNull();
  });

  it('responde nas bordas da faixa', () => {
    expect(ethanolWaterDensity(0, 0)).not.toBeNull();
    expect(ethanolWaterDensity(1, 40)).not.toBeNull();
  });

  it('recusa teor inválido também na ponte massa ↔ volume', () => {
    expect(volumeFractionFromMass(Number.NaN)).toBeNull();
    expect(massFractionFromVolume(1.5)).toBeNull();
  });
});
