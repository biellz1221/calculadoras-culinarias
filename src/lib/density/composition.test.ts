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
 * Extração e comparação em docs/research/densidade.md, Parte IV-B.
 */

function kgPerCubicMeter(value: number | null): number {
  if (value === null) throw new Error('fora da faixa');
  return value * 1000;
}

describe('o exemplo resolvido do ASHRAE (cap. 19, p. 19.11, Example 4)', () => {
  it('dá a cada constituinte que o motor calcula a densidade impressa a −40 °C', () => {
    // Longe de 20 °C, o que exercita o termo de temperatura. A tolerância é o
    // arredondamento de cada valor impresso. Carboidrato e fibra não entram:
    // carne de porco não tem. O gelo o motor não calcula.
    expect(Math.abs(kgPerCubicMeter(constituentDensity('water', -40)) - 991.04)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('protein', -40)) - 1350.6)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('fat', -40)) - 942.29)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(kgPerCubicMeter(constituentDensity('ash', -40)) - 2435.0)).toBeLessThanOrEqual(0.05);
  });

  it('soma como a equação (6) e chega aos 996 kg/m³ do exemplo', () => {
    // Frações e densidades exatamente como o exemplo imprime; o gelo (922,12)
    // entra como dado impresso. As frações somam 1,0034 e a fonte não
    // normaliza; o motor também não.
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

  it('aceita a composição do exemplo, que é o motivo de a tolerância existir', () => {
    // Mesma carne, acima de zero e sem gelo: água total 0,7263, proteína
    // 0,1955, gordura 0,0714, cinza 0,0102 — soma 1,0034.
    const pork: Composition = { water: 0.7263, protein: 0.1955, fat: 0.0714, ash: 0.0102 };
    expect(compositionDensity(pork, 20)).not.toBeNull();
  });
});

describe('contra as réguas medidas do motor', () => {
  it('a água do modelo fica sempre abaixo da OIML, de 0,09% a 0,29%', () => {
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

  /** Calda de sacarose é água e carboidrato — e o NBS mediu, de 10 a 30 °C. */
  function syrupErrors(fromBrix: number, toBrix: number): number[] {
    const errors: number[] = [];
    for (const brix of SUCROSE_BRIX) {
      if (brix < fromBrix || brix > toBrix) continue;
      for (const celsius of SUCROSE_CELSIUS) {
        if (isExtrapolatedCell(brix, celsius)) continue;
        const syrup = { water: 1 - brix / 100, totalCarbohydrate: brix / 100 };
        const model = compositionDensity(syrup, celsius)!;
        const measured = sucroseSolutionDensity(brix, celsius)!.density;
        errors.push((model - measured) / measured);
      }
    }
    return errors;
  }

  it('erra de −0,62% a +0,43% em calda de até 70 °Brix', () => {
    // Pontas: −0,620% (40 °Brix, 10 °C) e +0,428% (70 °Brix, 30 °C).
    const errors = syrupErrors(0, 70);
    expect(errors.length).toBeGreaterThan(0);
    for (const error of errors) {
      expect(error).toBeGreaterThanOrEqual(-0.0063);
      expect(error).toBeLessThanOrEqual(0.0043);
    }
  });

  it('superestima calda concentrada, de +0,35% a +2,05%', () => {
    // O modelo soma volumes, e açúcar dissolvido contrai. De 75 a 95 °Brix
    // (medidos a 15 e 20 °C) o erro é sempre para cima: +0,350% a 75 °Brix e
    // +2,048% a 95 °Brix e 20 °C. É a faixa do mel, e a página precisa dizer.
    const errors = syrupErrors(75, 95);
    expect(errors.length).toBeGreaterThan(0);
    for (const error of errors) {
      expect(error).toBeGreaterThanOrEqual(0.0035);
      expect(error).toBeLessThanOrEqual(0.0205);
    }
  });
});

describe('fibra, como a tabela publica', () => {
  // Suco de ameixa, ASHRAE cap. 19, Tabela 3: 81,24 água, 0,61 proteína, 0,03
  // gordura, 17,45 carboidrato total, 1,00 fibra, 0,68 cinza. O total já inclui
  // a fibra: a linha fecha em 100,01 sem somar a coluna de fibra.
  const prune: Composition = {
    water: 0.8124,
    protein: 0.0061,
    fat: 0.0003,
    totalCarbohydrate: 0.1745,
    fiber: 0.01,
    ash: 0.0068,
  };

  it('recebe as duas colunas e tira a fibra do carboidrato por dentro', () => {
    const expected = mixtureDensity(
      [
        ['water', 0.8124],
        ['protein', 0.0061],
        ['fat', 0.0003],
        ['carbohydrate', 0.1645],
        ['fiber', 0.01],
        ['ash', 0.0068],
      ].map(([constituent, fraction]) => ({
        fraction: fraction as number,
        density: constituentDensity(constituent as 'water', 20)!,
      })),
    )!;

    expect(compositionDensity(prune, 20)).toBeCloseTo(expected, 12);
  });

  it('recusa fibra maior que o carboidrato total de que ela é parte', () => {
    expect(compositionDensity({ ...prune, fiber: 0.18 }, 20)).toBeNull();
  });
});

describe('a tolerância da soma', () => {
  it('aceita exatamente 0,99 e 1,01, apesar do ponto flutuante', () => {
    // Math.abs(0.99 − 1) vale 0,010000000000000009.
    expect(compositionDensity({ water: 0.99 }, 20)).not.toBeNull();
    expect(compositionDensity({ water: 0.9, totalCarbohydrate: 0.09 }, 20)).not.toBeNull();
    expect(compositionDensity({ water: 0.95, totalCarbohydrate: 0.06 }, 20)).not.toBeNull();
  });

  it('recusa logo além da borda', () => {
    expect(compositionDensity({ water: 0.9899 }, 20)).toBeNull();
    expect(compositionDensity({ water: 0.95, totalCarbohydrate: 0.0601 }, 20)).toBeNull();
  });
});

describe('o que o modelo recusa', () => {
  it('recusa álcool, em vez de tratá-lo como água', () => {
    // Destilado do USDA: 63,9% de água e 36% de álcool em massa.
    expect(compositionDensity({ water: 0.639, alcohol: 0.36, totalCarbohydrate: 0.001 }, 20)).toBeNull();
  });

  it('recusa álcool mesmo quando, sem ele, a soma fecha em exatamente 1', () => {
    // A versão anterior deste teste passava com a trava removida, porque a
    // soma recusava no lugar. Aqui as frações sem o álcool somam 1 — nenhuma
    // tolerância, grande ou pequena, pega; só a trava.
    expect(compositionDensity({ water: 0.995, totalCarbohydrate: 0.005, alcohol: 0.005 }, 20)).toBeNull();
  });

  it('recusa chave desconhecida, como álcool com o nome errado', () => {
    // `ethanol` não é chave: sem esta trava, o álcool passaria como ausente.
    expect(compositionDensity({ water: 0.995, ethanol: 0.005 } as Composition, 20)).toBeNull();
  });

  it('não lê fração herdada do protótipo', () => {
    const inherited = Object.create({ water: 1 }) as Composition;
    expect(compositionDensity(inherited, 20)).toBeNull();
  });

  it.each([
    ['abaixo de zero, onde começa o gelo', { water: 1 }, -1],
    ['acima de 100 °C, onde a água ferve', { water: 1 }, 101],
    ['temperatura que não é número', { water: 1 }, Number.NaN],
    ['fração negativa', { water: 1.05, fat: -0.05 }, 20],
    ['fração que não é número', { water: Number.NaN }, 20],
    ['álcool negativo', { water: 1, alcohol: -0.01 }, 20],
    ['álcool que não é número', { water: 1, alcohol: Number.NaN }, 20],
    ['composição que não chega a 99%', { water: 0.5, fat: 0.4 }, 20],
    ['composição vazia', {}, 20],
  ] as const)('%s devolve nulo', (_label, composition, celsius) => {
    expect(compositionDensity(composition, celsius)).toBeNull();
  });

  it('responde nas bordas da faixa de líquido', () => {
    expect(compositionDensity({ water: 1 }, 0)).not.toBeNull();
    expect(compositionDensity({ water: 1 }, 100)).not.toBeNull();
  });

  it('dá densidade de constituinte nas bordas das tabelas, e recusa além delas', () => {
    expect(constituentDensity('water', -40)).not.toBeNull();
    expect(constituentDensity('water', 150)).not.toBeNull();
    expect(constituentDensity('water', -41)).toBeNull();
    expect(constituentDensity('water', 151)).toBeNull();
  });

  it('recusa constituinte fora do catálogo, inclusive o que vem do protótipo', () => {
    expect(constituentDensity('__proto__' as never, 20)).toBeNull();
    expect(constituentDensity('constructor' as never, 20)).toBeNull();
  });

  it('recusa mistura sem nada para somar, com densidade inválida ou que estoura', () => {
    expect(mixtureDensity([])).toBeNull();
    expect(mixtureDensity([{ fraction: 1, density: 0 }])).toBeNull();
    expect(mixtureDensity([{ fraction: 1.2, density: 1 }])).toBeNull();
    // Densidade minúscula: x/ρ vira infinito, e 1/∞ seria 0 — um líquido sem massa.
    expect(mixtureDensity([{ fraction: 1, density: Number.MIN_VALUE }])).toBeNull();
  });
});

describe('coerência interna', () => {
  it('água pura pela composição é a água do constituinte', () => {
    expect(compositionDensity({ water: 1 }, 25)).toBeCloseTo(constituentDensity('water', 25)!, 12);
  });

  it('fica mais leve com o calor', () => {
    const milkLike: Composition = {
      water: 0.88,
      protein: 0.03,
      fat: 0.035,
      totalCarbohydrate: 0.048,
      ash: 0.007,
    };
    expect(compositionDensity(milkLike, 30)!).toBeLessThan(compositionDensity(milkLike, 10)!);
  });
});
