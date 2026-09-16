import { describe, expect, it } from 'vitest';

import {
  compositionDensity,
  constituentDensity,
  mixtureDensity,
  type Composition,
} from './composition';
import { ethanolWaterDensity } from './ethanol';
import { sucroseSolutionDensity } from './sucrose';
import { SUCROSE_BRIX, SUCROSE_CELSIUS, isExtrapolatedCell } from '@/data/density/sucrose';

/**
 * O modelo de Choi & Okos contra o que dá para conferir.
 *
 * O caso-verdade da conta é o exemplo resolvido do próprio ASHRAE. O da física
 * são as outras duas réguas do motor: água da OIML e calda do NBS 457 — fontes
 * independentes do modelo, que medem o que ele só estima.
 * Extração e comparação em docs/research/densidade.md.
 */

function kgPerCubicMeter(value: number | null): number {
  if (value === null) throw new Error('fora da faixa');
  return value * 1000;
}

describe('o exemplo resolvido do ASHRAE (cap. 19, Example 4)', () => {
  it('dá a cada constituinte a densidade que o exemplo imprime a −40 °C', () => {
    // Longe de 20 °C, o que exercita o termo de temperatura. A tolerância é o
    // arredondamento de cada valor impresso. Carboidrato e fibra não entram:
    // carne de porco não tem.
    expect(Math.abs(kgPerCubicMeter(constituentDensity('water', -40)) - 991.04)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('protein', -40)) - 1350.6)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('fat', -40)) - 942.29)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('ash', -40)) - 2435.0)).toBeLessThanOrEqual(0.05);
  });

  it('soma como a equação (6) e chega aos 996 kg/m³ do exemplo', () => {
    // Frações e densidades exatamente como o exemplo imprime, gelo incluído.
    // As frações somam 1,0034 e a fonte não normaliza; o motor também não.
    const printed = [
      { fraction: 0.6125, density: 922.12 },
      { fraction: 0.1138, density: 991.04 },
      { fraction: 0.1955, density: 1350.6 },
      { fraction: 0.0714, density: 942.29 },
      { fraction: 0.0102, density: 2435.0 },
    ];
    const rho = mixtureDensity(printed)!;

    expect(Math.abs(1 / rho - 1.0038e-3)).toBeLessThanOrEqual(0.00005e-3);
    expect(Math.abs(rho - 996)).toBeLessThanOrEqual(0.5);
  });
});

describe('contra as réguas medidas do motor', () => {
  it('a água do modelo fica sempre abaixo da OIML, e no máximo 0,29%', () => {
    // O viés é da equação da água de Choi & Okos. Não se corrige aqui: trocar a
    // água pela da OIML seria um modelo que nenhuma fonte publica. Declara-se.
    for (let celsius = 0; celsius <= 40; celsius++) {
      const model = compositionDensity({ water: 1 }, celsius)!;
      const oiml = ethanolWaterDensity(0, celsius)!;
      const relative = (model - oiml) / oiml;
      expect(relative).toBeLessThanOrEqual(-0.0009);
      expect(relative).toBeGreaterThanOrEqual(-0.0029);
    }
  });

  /** Calda de sacarose é água e carboidrato — e o NBS mediu. */
  function syrupErrors(fromBrix: number, toBrix: number): number[] {
    const errors: number[] = [];
    for (const brix of SUCROSE_BRIX) {
      if (brix < fromBrix || brix > toBrix) continue;
      for (const celsius of SUCROSE_CELSIUS) {
        if (isExtrapolatedCell(brix, celsius)) continue;
        const model = compositionDensity({ water: 1 - brix / 100, carbohydrate: brix / 100 }, celsius)!;
        const measured = sucroseSolutionDensity(brix, celsius)!.density;
        errors.push((model - measured) / measured);
      }
    }
    return errors;
  }

  it('erra no máximo 0,62% em calda de até 70 °Brix', () => {
    // Pior ponto: 40 °Brix a 10 °C, −0,620%.
    for (const error of syrupErrors(0, 70)) {
      expect(Math.abs(error)).toBeLessThanOrEqual(0.0063);
    }
  });

  it('superestima calda concentrada, até 2,05% a 95 °Brix', () => {
    // O modelo soma volumes, e açúcar dissolvido contrai. Acima de 70% o erro é
    // sempre para cima: de +0,35% (75 °Brix) a +2,05% (95 °Brix, 20 °C). É a
    // faixa do mel, e a página precisa dizer isso.
    const errors = syrupErrors(75, 95);
    expect(errors.length).toBeGreaterThan(0);
    for (const error of errors) {
      expect(error).toBeGreaterThan(0.003);
      expect(error).toBeLessThanOrEqual(0.0205);
    }
  });
});

describe('o que o modelo recusa', () => {
  it('recusa álcool, em vez de tratá-lo como água', () => {
    // Destilado do USDA: 63,9% de água e 36% de álcool em massa.
    expect(compositionDensity({ water: 0.639, alcohol: 0.36, carbohydrate: 0.001 }, 20)).toBeNull();
  });

  it('recusa álcool mesmo quando é tão pouco que a soma ainda fecha', () => {
    // O caso acima é recusado também pela soma (sem o álcool, sobra 0,64), e
    // por isso passava com a trava do álcool removida. Onde só a trava segura é
    // bebida fermentada com meio por cento: tirado o álcool, a soma dá 0,995,
    // dentro da tolerância, e o modelo responderia calado.
    expect(compositionDensity({ water: 0.99, carbohydrate: 0.005, alcohol: 0.005 }, 20)).toBeNull();
  });

  it('recusa fibra contada duas vezes', () => {
    // Suco de ameixa, ASHRAE cap. 19, Tabela 3: 81,24 água, 0,61 proteína, 0,03
    // gordura, 17,45 carboidrato total, 1,00 fibra, 0,68 cinza. O total já
    // inclui a fibra: somar as duas colunas dá 101,01.
    const doubled: Composition = {
      water: 0.8124,
      protein: 0.0061,
      fat: 0.0003,
      carbohydrate: 0.1745,
      fiber: 0.01,
      ash: 0.0068,
    };
    expect(compositionDensity(doubled, 20)).toBeNull();

    // Com a fibra tirada do carboidrato, a composição fecha e o modelo responde.
    expect(compositionDensity({ ...doubled, carbohydrate: 0.1645 }, 20)).not.toBeNull();
  });

  it.each([
    ['abaixo de zero, onde começa o gelo', { water: 1 }, -1],
    ['acima de 100 °C, onde a água ferve', { water: 1 }, 101],
    ['temperatura que não é número', { water: 1 }, Number.NaN],
    ['fração negativa', { water: 1.05, fat: -0.05 }, 20],
    ['fração que não é número', { water: Number.NaN }, 20],
    ['composição que não chega a 99%', { water: 0.5, fat: 0.4 }, 20],
    ['composição vazia', {}, 20],
  ] as const)('%s devolve nulo', (_label, composition, celsius) => {
    expect(compositionDensity(composition, celsius)).toBeNull();
  });

  it('recusa constituinte fora do catálogo, inclusive o que vem do protótipo', () => {
    expect(constituentDensity('__proto__' as never, 20)).toBeNull();
    expect(constituentDensity('water', -41)).toBeNull();
    expect(constituentDensity('water', 151)).toBeNull();
  });

  it('recusa mistura sem nada para somar ou com densidade inválida', () => {
    expect(mixtureDensity([])).toBeNull();
    expect(mixtureDensity([{ fraction: 1, density: 0 }])).toBeNull();
    expect(mixtureDensity([{ fraction: 1.2, density: 1 }])).toBeNull();
  });
});

describe('coerência interna', () => {
  it('água pura pela composição é a água do constituinte', () => {
    expect(compositionDensity({ water: 1 }, 25)).toBeCloseTo(constituentDensity('water', 25)!, 12);
  });

  it('fica mais leve com o calor', () => {
    const milkLike: Composition = { water: 0.88, protein: 0.03, fat: 0.035, carbohydrate: 0.048, ash: 0.007 };
    expect(compositionDensity(milkLike, 30)!).toBeLessThan(compositionDensity(milkLike, 10)!);
  });
});
