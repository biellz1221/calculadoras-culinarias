import { describe, expect, it } from 'vitest';

import {
  LEGAL_EXTRA_RATIO,
  calculateJam,
  evaporationRange,
  gramsFromOunces,
  legalCommonRatio,
  pectinRange,
  referenceFor,
  statusFor,
  sugarRatioFor,
} from './calculate';
import {
  EMBRAPA_TABLE,
  LEGAL_PARTS,
  PECTIN_DOSE_OVER_SUGAR,
  getEmbrapaRow,
} from '@/data/jam/brazil';
import {
  CLASSIFIED_FRUIT_IDS,
  FERBER_SUGAR_RATIO,
  JAM_FRUITS,
  WEIGHED_FRUIT_IDS,
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
import { getJamDictionary } from '@/i18n/dictionaries/jam';
import { LOCALES } from '@/i18n/locales';
import { labelFor } from '@/lib/recipes/card';

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

/** A receita, para os testes que só fazem sentido onde existe receita. */
function recipeOf(fruit: JamFruit) {
  if (!fruit.recipe) throw new Error(`${fruit.id} não tem receita pesada`);
  return fruit.recipe;
}

function ratioOf(fruit: JamFruit): number {
  const ratio = sourceSugarRatio(fruit);
  if (ratio === null) throw new Error(`${fruit.id} não tem proporção de receita`);
  return ratio;
}

function lemonOf(fruit: JamFruit) {
  const lemon = sourceLemonRatio(fruit);
  if (!lemon) throw new Error(`${fruit.id} não tem limão de receita`);
  return lemon;
}

/** As nove do Blue Chair. O resto entrou pela tabela brasileira, sem receita. */
const WEIGHED = JAM_FRUITS.filter((fruit) => fruit.recipe);

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
    const plum = lemonOf(ofFruit('plum'));
    expect(plum.max / plum.min).toBeCloseTo(3, 10);

    // Framboesa, p. 234, não leva limão nenhum: é a única do conjunto.
    const raspberry = lemonOf(ofFruit('raspberry'));
    expect(raspberry.min).toBe(0);
    expect(raspberry.max).toBe(0);

    // Morango, p. 178: valor único, mesmo tendo duas adições (4 oz + 2 oz).
    const strawberry = lemonOf(ofFruit('strawberry'));
    expect(strawberry.max).toBe(strawberry.min);
  });

  it('escala o rendimento que o livro declara', () => {
    // Figo, p. 224: 5,5 lb de fruta rendem onze potes de 8 oz. Metade da
    // receita tem de render cinco e meio.
    const fruit = ofFruit('fig');
    const half = gramsFromOunces(recipeOf(fruit).fruitOz) / 2;

    const result = calculateJam({
      fruitId: 'fig',
      fruitGrams: half,
      sugarLevel: 'source',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });

    expect(result.jars?.min).toBeCloseTo(5.5, 6);
    expect(result.jars?.max).toBeCloseTo(5.5, 6);
  });

  it('a proporção é adimensional: onça e grama dão o mesmo número', () => {
    // É o que dispensa converter as libras de Saunders. Se este teste falha,
    // algum fator de conversão entrou onde não devia.
    for (const fruit of WEIGHED) {
      const { sugarOz, fruitOz } = recipeOf(fruit);
      const inOunces = sugarOz / fruitOz;
      const inGrams = gramsFromOunces(sugarOz) / gramsFromOunces(fruitOz);
      expect(inGrams).toBeCloseTo(inOunces, 12);
    }
  });

  it('cada fruta tem uma proporção diferente, que é o ponto', () => {
    // Damasco a 0,42 e framboesa a 1,00 no mesmo livro. Uma média deste
    // conjunto não seria fonte de ninguém.
    expect(ratioOf(ofFruit('apricot'))).toBeCloseTo(0.4167, 4);
    expect(ratioOf(ofFruit('raspberry'))).toBe(1);
    expect(ratioOf(ofFruit('blueberry'))).toBe(0.75);
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
    const apricot = ratioOf(ofFruit('apricot'));
    const blueberry = ratioOf(ofFruit('blueberry'));

    // 0,50 está acima do que a fonte publica para damasco e abaixo do que
    // publica para mirtilo. O mesmo número, dois vereditos.
    expect(statusFor(0.5, apricot)).toBe('above-source');
    expect(statusFor(0.5, blueberry)).toBe('below-source');
  });

  it('escolher a proporção da fonte nunca dispara aviso', () => {
    for (const fruit of WEIGHED) {
      const ratio = sugarRatioFor(fruit, 'source', 0);
      expect(statusFor(ratio, ratioOf(fruit)), fruit.id).toBe('source');
    }
  });

  it('a proporção de Ferber fica acima da fonte em quase toda fruta', () => {
    // 0,80 é generoso perto do Blue Chair, que trabalha com pouco açúcar. A
    // exceção é a framboesa, que Saunders faz um a um.
    const above = WEIGHED.filter(
      (fruit) => statusFor(FERBER_SUGAR_RATIO, ratioOf(fruit)) === 'above-source',
    );

    expect(above).toHaveLength(WEIGHED.length - 1);
    expect(statusFor(FERBER_SUGAR_RATIO, ratioOf(ofFruit('raspberry')))).toBe(
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
    expect(result.jars).toBeNull();
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

describe('a Tabela 1 da Embrapa, como transcrita', () => {
  it('tem as 38 linhas da fonte, cada uma com um nível de cada eixo', () => {
    // A trava da extração: se uma coluna tivesse escorregado no `pdftotext`,
    // alguma linha teria dois níveis do mesmo eixo ou nenhum. Trinta e oito é
    // a contagem da página renderizada, conferida a olho contra esta.
    expect(EMBRAPA_TABLE).toHaveLength(38);

    for (const row of EMBRAPA_TABLE) {
      expect(['rich', 'medium', 'poor'], row.id).toContain(row.pectin);
      expect(['high', 'medium', 'low'], row.id).toContain(row.acidity);
    }
  });

  it('marca as 30 linhas que são de Jackix, e não as outras oito', () => {
    // O asterisco da fonte. Citação de terceira mão se declara, e o número de
    // linhas marcadas é parte da transcrição.
    const viaJackix = EMBRAPA_TABLE.filter((row) => row.viaJackix);
    expect(viaJackix).toHaveLength(30);

    // As oito próprias da Embrapa, conferidas na página.
    const own = EMBRAPA_TABLE.filter((row) => !row.viaJackix).map((row) => row.id);
    expect(own.sort()).toEqual(
      [
        'acerola',
        'araca',
        'banana',
        'caja-manga',
        'sugar-apple',
        'passionfruit',
        'peach-green',
        'pomegranate',
      ].sort(),
    );
  });

  it('a goiaba é rica em pectina e média em acidez — o desempate', () => {
    // O NCHFP põe a goiaba no grupo III, "acid, pectin or both", sem dizer
    // qual. McGee diz que sobra pectina. A Embrapa decide, e a favor do McGee.
    const guava = getEmbrapaRow('guava');
    expect(guava?.pectin).toBe('rich');
    expect(guava?.acidity).toBe('medium');
  });

  it('onde as duas classificações se encontram, elas concordam', () => {
    // Morango, pêssego maduro e figo maduro estão nas duas tabelas. O NCHFP
    // põe as três no grupo III; a Embrapa chama as três de pobres em pectina.
    // Duas réguas feitas em continentes diferentes, mesmo veredito.
    for (const id of ['strawberry', 'peach', 'fig']) {
      const fruit = ofFruit(id);
      expect(fruit.group, id).toBe('iii');
      expect(getEmbrapaRow(fruit.embrapaId)?.pectin, id).toBe('poor');
    }
  });

  it('toda fruta tem pelo menos uma base, e todo vínculo existe', () => {
    for (const fruit of JAM_FRUITS) {
      expect(Boolean(fruit.recipe || fruit.embrapaId), fruit.id).toBe(true);
      if (fruit.embrapaId) {
        expect(getEmbrapaRow(fruit.embrapaId), fruit.id).toBeDefined();
      }
    }

    // As duas famílias somam o catálogo inteiro, sem sobra nem repetição.
    expect(WEIGHED_FRUIT_IDS).toHaveLength(9);
    expect(CLASSIFIED_FRUIT_IDS).toHaveLength(35);
    expect(new Set([...WEIGHED_FRUIT_IDS, ...CLASSIFIED_FRUIT_IDS]).size).toBe(
      JAM_FRUITS.length,
    );
  });
});

describe('a régua da legislação brasileira', () => {
  it('guarda as partes como a norma escreve, e deriva a proporção', () => {
    // "Cinqüenta partes de frutas frescas ... para cinqüenta partes de açúcar"
    // e "quarenta partes ... para sessenta partes".
    expect(LEGAL_PARTS.extra).toEqual({ fruit: 50, sugar: 50 });
    expect(LEGAL_PARTS.common).toEqual({ fruit: 40, sugar: 60 });
    expect(LEGAL_PARTS.commonException).toEqual({ fruit: 35, sugar: 65 });

    expect(LEGAL_EXTRA_RATIO).toBe(1);
    expect(legalCommonRatio(ofFruit('guava'))).toBe(1.5);
  });

  it('marmelo, laranja e maçã levam a exceção que a própria norma abre', () => {
    // "As geléias de marmelo, laranja e maçã poderão ser preparadas com trinta
    // e cinco partes de frutas frescas ... e sessenta e cinco de açúcar."
    for (const id of ['quince', 'orange', 'apple-tart', 'apple-sweet']) {
      expect(legalCommonRatio(ofFruit(id)), id).toBeCloseTo(65 / 35, 10);
    }

    // E não vale para mais ninguém.
    const others = JAM_FRUITS.filter((fruit) => fruit.legalException).map((f) => f.id);
    expect(others.sort()).toEqual(
      ['apple-sweet', 'apple-tart', 'orange', 'quince'].sort(),
    );
  });

  it('a menor proporção da norma iguala ou supera as nove receitas', () => {
    // É a divergência que a página publica: a norma classifica produto
    // industrial rotulado, e Saunders escreve receita de casa.
    const below = WEIGHED.filter((fruit) => ratioOf(fruit) < LEGAL_EXTRA_RATIO);
    expect(below).toHaveLength(8);

    // Nenhuma receita do livro passa do mínimo legal. A norma é o teto de
    // açúcar do Blue Chair inteiro, e é só o piso dela.
    const above = WEIGHED.filter((fruit) => ratioOf(fruit) > LEGAL_EXTRA_RATIO);
    expect(above).toHaveLength(0);

    // A framboesa é um a um exato, e é a única que empata com a norma.
    expect(ratioOf(ofFruit('raspberry'))).toBe(LEGAL_EXTRA_RATIO);
  });
});

describe('fruta sem receita pesada', () => {
  const guava = {
    fruitId: 'guava',
    fruitGrams: 1000,
    sugarLevel: 'extra' as const,
    customSugarRatio: 0,
    altitudeMeters: 0,
  };

  it('usa a norma como régua e diz que é a norma', () => {
    const result = calculateJam(guava);

    expect(result.referenceBasis).toBe('norm');
    expect(result.referenceRatio).toBe(1);
    expect(result.sugarGrams).toBe(1000);
    expect(result.status).toBe('source');
  });

  it('omite o que a fonte não publica em vez de emprestar de outra fruta', () => {
    const result = calculateJam(guava);

    // A Embrapa não declara rendimento nem dose de limão para a goiaba.
    expect(result.jars).toBeNull();
    expect(result.lemonGrams).toEqual({ min: 0, max: 0 });
  });

  it('não oferece gelatina de maçã para fruta rica em pectina', () => {
    // A goiaba é rica em pectina pela Embrapa: o que falta nela é ácido.
    expect(calculateJam(guava).appleJellyGrams).toBe(0);

    // O maracujá é pobre, e aí a sugestão de Ferber aparece.
    const passionfruit = calculateJam({ ...guava, fruitId: 'passionfruit' });
    expect(passionfruit.appleJellyGrams).toBe(200);
  });

  it('a proporção de Ferber fica abaixo da norma, e o aviso muda de tom', () => {
    // 0,80 é generoso perto do Blue Chair e insuficiente perto da norma. O
    // aviso daqui não é o do NCHFP sobre receita testada — é de categoria.
    const ferber = calculateJam({ ...guava, sugarLevel: 'ferber' });
    expect(ferber.status).toBe('below-source');
    expect(ferber.referenceBasis).toBe('norm');
  });

  it('a geleia comum fica acima da extra', () => {
    const common = calculateJam({ ...guava, sugarLevel: 'common' });
    expect(common.sugarGrams).toBe(1500);
    expect(common.status).toBe('above-source');
  });

  it('a régua de fruta com receita continua sendo a receita', () => {
    const fig = calculateJam({ ...guava, fruitId: 'fig', sugarLevel: 'source' });
    expect(fig.referenceBasis).toBe('recipe');
    expect(fig.referenceRatio).toBeCloseTo(ratioOf(ofFruit('fig')), 10);
  });
});

describe('pectina em pó', () => {
  it('é calculada sobre o açúcar, não sobre a fruta', () => {
    // A base é o que mais se erra numa transcrição apressada, e errá-la aqui
    // erraria a dose pela metade ou pelo dobro.
    const result = calculateJam({
      fruitId: 'guava',
      fruitGrams: 1000,
      sugarLevel: 'common',
      customSugarRatio: 0,
      altitudeMeters: 0,
    });

    expect(result.sugarGrams).toBe(1500);
    expect(result.pectinGrams.min).toBeCloseTo(1500 * 0.005, 10);
    expect(result.pectinGrams.max).toBeCloseTo(1500 * 0.015, 10);
    // Se a base fosse a fruta, o topo daria 15 g em vez de 22,5 g.
    expect(result.pectinGrams.max).not.toBeCloseTo(1000 * 0.015, 6);
  });

  it.each([
    // As formulações pesadas do próprio Doc 138: pectina (g), açúcar (g).
    ['geleiada de pêssego comum', 30, 4500],
    ['geleiada de pêssego comum, 2', 45, 5800],
    ['geleia de pêssego extra', 45, 8600],
    ['geleia de pêssego comum, 80 g', 80, 7500],
    ['geleia de caroço de pêssego', 40, 4000],
    ['geleia de morango extra', 25, 3700],
    ['geleia de morango extra, 1 kg', 10, 1000],
    ['geleia de morango extra, Vendruscolo', 25, 2500],
    ['geleia de morango comum', 45, 6000],
    ['geleia de uva comum', 35, 5500],
  ])('%s cai dentro da faixa que o próprio documento publica', (_, pectin, sugar) => {
    // Dez das onze formulações obedecem à regra da mesma publicação. É a
    // autoconferência que autorizou transcrever a faixa.
    const range = pectinRange(sugar);
    expect(pectin).toBeGreaterThanOrEqual(range.min);
    expect(pectin).toBeLessThanOrEqual(range.max);
  });

  it('a décima primeira formulação fica fora, e por pouco', () => {
    // 40 g para 8,8 kg de açúcar dá 0,45%, cinco centésimos abaixo do piso.
    // Registrado em vez de arredondado para dentro.
    expect(40 / 8800).toBeLessThan(PECTIN_DOSE_OVER_SUGAR[0]);
    expect(40 / 8800).toBeGreaterThan(0.0045);
  });
});

describe('a proporção da Embrapa e a régua, juntas', () => {
  it('as duas frutas que compartilham linha com receita não mudaram de resposta', () => {
    // Morango, pêssego e figo ganharam vínculo com a Tabela 1, e isso não pode
    // ter mexido no açúcar nem no limão que a receita de Saunders entrega.
    for (const [id, sugarOz, fruitOz] of [
      ['strawberry', 2.5 * LB, 3 * LB + 14],
      ['peach', 3 * LB, 5.5 * LB],
      ['fig', 3 * LB, 2.5 * LB + 3 * LB],
    ] as const) {
      const result = calculateJam({
        fruitId: id,
        fruitGrams: gramsFromOunces(fruitOz),
        sugarLevel: 'source',
        customSugarRatio: 0,
        altitudeMeters: 0,
      });
      expect(result.sugarGrams, id).toBeCloseTo(gramsFromOunces(sugarOz), 6);
      expect(referenceFor(ofFruit(id)).basis, id).toBe('recipe');
    }
  });
});

describe('todo id tem rótulo nos dois idiomas', () => {
  it.each(LOCALES)('%s nomeia o seletor e a Tabela 1 inteira', (locale) => {
    // Falhou uma vez de verdade: `fig-ripe` e `peach-ripe` foram absorvidos
    // pelas receitas de Saunders e saíram do seletor, mas continuam sendo duas
    // linhas da Tabela 1 na página — e ficaram sem nome, em branco na tabela.
    const dict = getJamDictionary(locale);

    for (const id of [
      ...JAM_FRUITS.map((fruit) => fruit.id),
      ...EMBRAPA_TABLE.map((row) => row.id),
    ]) {
      expect(labelFor(dict.fruits, id), `${locale}: ${id}`).not.toBe('');
    }
  });
});
