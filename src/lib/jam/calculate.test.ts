import { describe, expect, it } from 'vitest';

import {
  calculateJam,
  evaporationRange,
  gramsFromOunces,
  statusFor,
  sugarRatioFor,
} from './calculate';
import {
  FERBER_SUGAR_RATIO,
  JAM_FRUITS,
  getFruit,
  sourceLemonRatio,
  sourceSugarRatio,
} from '@/data/jam/fruits';
import {
  NCHFP_SETTING_TABLE,
  boilingCelsius,
  feetFromMeters,
  processingMinutes,
  settingCelsius,
} from '@/data/jam/setting-point';
import type { JamFruit } from '@/data/jam/types';

/**
 * Os casos-verdade são as receitas dos livros e as tabelas da norma.
 *
 * Se o motor, alimentado com o peso de fruta que o livro pede, devolve o
 * açúcar e o limão que o livro pede, ele está certo pelas fontes e não pela
 * minha álgebra. O mesmo vale para o ponto de gelificação: a tabela do NCHFP
 * é conferida linha a linha.
 */

const LB = 16;

function ofFruit(id: string): JamFruit {
  const fruit = getFruit(id);
  if (!fruit) throw new Error(`fruta ausente do catálogo: ${id}`);
  return fruit;
}

describe('as receitas do Blue Chair, reproduzidas', () => {
  it.each([
    // id, fruta (oz), açúcar (oz), limão mínimo (oz), página
    ['strawberry', 3 * LB + 14, 2.5 * LB, 6, 178],
    ['raspberry', 3 * LB, 3 * LB, 0, 234],
    ['blackberry', LB + 6 + (2 * LB + 2), 1.75 * LB, 2.5, 268],
    ['apricot', 6 * LB, 2.5 * LB, 2.5, 168],
    ['peach', 5.5 * LB, 3 * LB, 3.5, 246],
    ['plum', 2 * LB + 3 + (2 * LB + 5), 2 * LB, 2, 197],
    ['fig', 2.5 * LB + 3 * LB, 3 * LB, 6, 224],
    ['blueberry', 2.5 * LB, LB + 14, 6, 183],
    ['grape', 4 * LB, 2.5 * LB, 3, 265],
  ])(
    '%s: com a fruta da receita, devolve o açúcar e o limão da receita',
    (id, fruitOz, sugarOz, lemonOz) => {
      const fruitGrams = gramsFromOunces(fruitOz);

      const result = calculateJam({
        fruitId: id,
        fruitGrams,
        sugarLevel: 'source',
        customSugarRatio: 0,
        altitudeMeters: 0,
      });

      expect(result.sugarGrams).toBeCloseTo(gramsFromOunces(sugarOz), 6);
      expect(result.lemonGrams.min).toBeCloseTo(gramsFromOunces(lemonOz), 6);
    },
  );

  it('guarda a faixa de limão onde a fonte dá faixa, e só onde dá', () => {
    // Ameixa, p. 197: "2 to 6 ounces". Amora, p. 268: "2 ½ to 3 ounces".
    const plum = sourceLemonRatio(ofFruit('plum'));
    expect(plum.max / plum.min).toBeCloseTo(3, 10);

    // Framboesa, p. 234, não leva limão nenhum: é a única do conjunto.
    const raspberry = sourceLemonRatio(ofFruit('raspberry'));
    expect(raspberry.min).toBe(0);
    expect(raspberry.max).toBe(0);

    // Morango, p. 178: valor único, mesmo tendo duas adições (4 oz + 2 oz).
    const strawberry = sourceLemonRatio(ofFruit('strawberry'));
    expect(strawberry.max).toBe(strawberry.min);
  });

  it('escala o rendimento que o livro declara', () => {
    // Figo, p. 224: 5,5 lb de fruta rendem onze potes de 8 oz. Metade da
    // receita tem de render cinco e meio.
    const fruit = ofFruit('fig');
    const half = gramsFromOunces(fruit.recipe.fruitOz) / 2;

    const result = calculateJam({
      fruitId: 'fig',
      fruitGrams: half,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });

    expect(result.jars.min).toBeCloseTo(5.5, 6);
    expect(result.jars.max).toBeCloseTo(5.5, 6);
  });

  it('a proporção é adimensional: onça e grama dão o mesmo número', () => {
    // É o que dispensa converter as libras de Saunders. Se este teste falha,
    // algum fator de conversão entrou onde não devia.
    for (const fruit of JAM_FRUITS) {
      const inOunces = fruit.recipe.sugarOz / fruit.recipe.fruitOz;
      const inGrams =
        gramsFromOunces(fruit.recipe.sugarOz) / gramsFromOunces(fruit.recipe.fruitOz);
      expect(inGrams).toBeCloseTo(inOunces, 12);
    }
  });

  it('cada fruta tem uma proporção diferente, que é o ponto', () => {
    // Damasco a 0,42 e framboesa a 1,00 no mesmo livro. Uma média deste
    // conjunto não seria fonte de ninguém.
    expect(sourceSugarRatio(ofFruit('apricot'))).toBeCloseTo(0.4167, 4);
    expect(sourceSugarRatio(ofFruit('raspberry'))).toBe(1);
    expect(sourceSugarRatio(ofFruit('blueberry'))).toBe(0.75);
  });
});

describe('ponto de gelificação por altitude', () => {
  it('reproduz a tabela do NCHFP linha a linha', () => {
    for (const row of NCHFP_SETTING_TABLE) {
      const meters = row.feet * 0.3048;
      const fahrenheit = (settingCelsius(meters) * 9) / 5 + 32;
      expect(fahrenheit, `${row.feet} pés`).toBeCloseTo(row.fahrenheit, 6);
    }
  });

  it('segue a tabela, não a regra de bolso da mesma página', () => {
    // O texto do NCHFP diz "subtract 2 degrees F" por mil pés, mas a tabela
    // dele cai só 1 °F entre 4.000 e 5.000 e fica um grau acima da regra daí
    // para cima. A tabela é que está certa: a fervura não cai em linha reta.
    const ruleOfThumb = (feet: number) => 220 - 2 * (feet / 1000);

    for (const feet of [0, 1000, 2000, 3000, 4000]) {
      const fahrenheit = (settingCelsius(feet * 0.3048) * 9) / 5 + 32;
      expect(fahrenheit, `${feet} pés`).toBeCloseTo(ruleOfThumb(feet), 6);
    }

    for (const feet of [5000, 6000, 7000, 8000]) {
      const fahrenheit = (settingCelsius(feet * 0.3048) * 9) / 5 + 32;
      expect(fahrenheit - ruleOfThumb(feet), `${feet} pés`).toBeCloseTo(1, 6);
    }
  });

  it('interpola entre as linhas da tabela', () => {
    // 500 pés fica na metade do primeiro trecho: 219 °F.
    const fahrenheit = (settingCelsius(500 * 0.3048) * 9) / 5 + 32;
    expect(fahrenheit).toBeCloseTo(219, 6);
  });

  it('no nível do mar entrega os números que os dois livros publicam', () => {
    // Saunders, p. 26: 220 °F. Ferber: 105 °C ("au nappé").
    expect(settingCelsius(0)).toBeCloseTo(104.44, 2);
    expect(boilingCelsius(0)).toBeCloseTo(100, 10);
    // A regra do NCHFP é uma diferença, não uma temperatura: 8 °F acima.
    expect(((settingCelsius(0) - boilingCelsius(0)) * 9) / 5).toBeCloseTo(8, 10);
  });

  it('mantém os 8 °F de diferença em qualquer altitude', () => {
    for (const meters of [0, 300, 760, 1172, 2000, 4000]) {
      const delta = ((settingCelsius(meters) - boilingCelsius(meters)) * 9) / 5;
      expect(delta).toBeCloseTo(8, 10);
    }
  });

  it('em Brasília a geleia dá o ponto perto de 100 °C, não de 105', () => {
    // 1.172 m. É a razão de esta calculadora existir em português: seguir os
    // 105 °C de Ferber aqui seria passar cinco graus do ponto, e Saunders
    // avisa o que acontece — "irrevocably tough, leathery preserve".
    const setting = settingCelsius(1172);
    expect(setting).toBeGreaterThan(99.5);
    expect(setting).toBeLessThan(100.5);
    expect(104.44 - setting).toBeGreaterThan(4);
  });

  it('converte metros em pés pela definição, sem arredondar', () => {
    expect(feetFromMeters(304.8)).toBeCloseTo(1000, 10);
  });
});

describe('banho-maria por altitude (tabela 2 do NCHFP)', () => {
  it.each([
    [0, 5],
    [304.8, 5],
    [305, 10],
    [1000, 10],
    [1828.8, 10],
    [1830, 15],
    [3000, 15],
  ])('a %s m, %i minutos', (meters, minutes) => {
    expect(processingMinutes(meters)).toBe(minutes);
  });
});

describe('água a evaporar', () => {
  it('sai como faixa, porque o açúcar próprio da fruta é faixa', () => {
    // 1 kg de fruta a 0,80 (a proporção da casa de Ferber). Açúcar total entre
    // 900 e 950 g; a 65 %, massa final entre 1.385 e 1.462 g; entrou 1.800 g.
    const range = evaporationRange(1000, 800);

    expect(range.min).toBeCloseTo(1800 - 950 / 0.65, 6);
    expect(range.max).toBeCloseTo(1800 - 900 / 0.65, 6);
    expect(range.min).toBeLessThan(range.max);
  });

  it('menos açúcar significa mais água a tirar — o aviso de Saunders', () => {
    // "the less sugar added, the slower, longer, and more careful the cooking
    // must be" (p. 23). A conta mostra por quê.
    const generous = evaporationRange(1000, 800);
    const lean = evaporationRange(1000, 300);

    expect(lean.min).toBeGreaterThan(generous.max);
  });

  it('nunca pede evaporação negativa', () => {
    // Açúcar demais já passa dos 65 % sem tirar água nenhuma.
    const range = evaporationRange(1000, 5000);
    expect(range.min).toBe(0);
    expect(range.max).toBe(0);
  });
});

describe('aviso de açúcar', () => {
  it('compara com a receita da fonte, não com um limiar nosso', () => {
    const apricot = sourceSugarRatio(ofFruit('apricot'));
    const blueberry = sourceSugarRatio(ofFruit('blueberry'));

    // 0,50 está acima do que a fonte publica para damasco e abaixo do que
    // publica para mirtilo. O mesmo número, dois vereditos.
    expect(statusFor(0.5, apricot)).toBe('above-source');
    expect(statusFor(0.5, blueberry)).toBe('below-source');
  });

  it('escolher a proporção da fonte nunca dispara aviso', () => {
    for (const fruit of JAM_FRUITS) {
      const ratio = sugarRatioFor(fruit, 'source', 0);
      expect(statusFor(ratio, sourceSugarRatio(fruit)), fruit.id).toBe('source');
    }
  });

  it('a proporção de Ferber fica acima da fonte em quase toda fruta', () => {
    // 0,80 é generoso perto do Blue Chair, que trabalha com pouco açúcar. A
    // exceção é a framboesa, que Saunders faz um a um.
    const above = JAM_FRUITS.filter(
      (fruit) => statusFor(FERBER_SUGAR_RATIO, sourceSugarRatio(fruit)) === 'above-source',
    );

    expect(above).toHaveLength(JAM_FRUITS.length - 1);
    expect(statusFor(FERBER_SUGAR_RATIO, sourceSugarRatio(ofFruit('raspberry')))).toBe(
      'below-source',
    );
  });
});

describe('pectina emprestada', () => {
  it('oferece gelatina de maçã só para o grupo III do NCHFP', () => {
    // "Always needs added acid, pectin or both."
    const withJelly = calculateJam({
      fruitId: 'blueberry',
      fruitGrams: 1000,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });
    expect(withJelly.appleJellyGrams).toBe(200);

    // Ameixa é grupo I: "enough natural pectin and acid ... with only added
    // sugar".
    const without = calculateJam({
      fruitId: 'plum',
      fruitGrams: 1000,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });
    expect(without.appleJellyGrams).toBe(0);
  });
});

describe('entradas de canto', () => {
  it('fruta desconhecida devolve zeros, e não uma receita inventada', () => {
    const result = calculateJam({
      fruitId: 'nao-existe',
      fruitGrams: 1000,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });

    expect(result.sugarGrams).toBe(0);
    expect(result.jars.max).toBe(0);
    // O ponto de gelificação não depende da fruta e continua válido.
    expect(result.settingCelsius).toBeCloseTo(104.44, 2);
  });

  it('peso e altitude negativos são tratados como zero', () => {
    const result = calculateJam({
      fruitId: 'fig',
      fruitGrams: -500,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: -100,
    });

    expect(result.sugarGrams).toBe(0);
    expect(result.settingCelsius).toBeCloseTo(104.44, 2);
  });
});
