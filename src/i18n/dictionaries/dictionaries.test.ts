import { describe, expect, it } from 'vitest';

import { getBreadDictionary } from './bread';
import { getBrineDictionary } from './brine';
import { getCuringDictionary } from './curing';
import { getGanacheDictionary } from './ganache';
import { getGelatoDictionary } from './gelato';
import { getGellingDictionary } from './gelling';
import { getJamDictionary } from './jam';
import { getPastaDictionary } from './pasta';
import { getPicklesDictionary } from './pickles';
import { getDictionary } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/locales';

type Node = Record<string, unknown>;

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }

  return Object.entries(value as Node).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function collectStrings(value: unknown, prefix = ''): [string, unknown][] {
  if (typeof value !== 'object' || value === null) {
    return [[prefix, value]];
  }

  return Object.entries(value as Node).flatMap(([key, child]) =>
    collectStrings(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('dicionários', () => {
  it('tem exatamente as mesmas chaves em todos os idiomas', () => {
    // O tipo já garante isso na compilação; o teste protege contra alguém
    // afrouxar a tipagem no futuro.
    const reference = collectKeys(getDictionary('pt-BR')).sort();

    for (const locale of LOCALES) {
      expect(collectKeys(getDictionary(locale)).sort(), locale).toEqual(reference);
    }
  });

  it('não deixa nenhum texto vazio ou não traduzido', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of collectStrings(getDictionary(locale))) {
        expect(typeof value, `${locale}: ${key}`).toBe('string');
        expect(String(value).trim().length, `${locale}: ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('traduz de fato: os textos diferem entre os idiomas', () => {
    // Nomes próprios e unidades se escrevem igual nos dois idiomas. Qualquer
    // outra chave idêntica é tradução esquecida, e o teste falha por isso.
    const SAME_IN_BOTH = [
      // Nomes que são a mesma palavra nos dois idiomas. Não é tradução
      // esquecida: é como se escreve.
      'calculators.ganache.name',
      'calculators.gelato.name',
      'preferences.celsius',
      'preferences.fahrenheit',
    ];

    const pt = new Map(collectStrings(getDictionary('pt-BR')));
    const en = new Map(collectStrings(getDictionary('en')));

    const identical = [...pt.entries()]
      .filter(([key, value]) => en.get(key) === value)
      .map(([key]) => key);

    expect(identical.sort()).toEqual([...SAME_IN_BOTH].sort());
  });
});

/**
 * As mesmas três garantias, agora nos dicionários de cada calculadora.
 *
 * Eles nunca estiveram cobertos: o teste acima só olha o dicionário do site, e
 * é nos de calculadora que mora quase todo o texto — inclusive os nove blocos
 * de "confira a sua receita". A tipagem `typeof xPtBR` já obriga as chaves a
 * baterem, mas não diz nada sobre texto vazio nem sobre tradução esquecida.
 */
const CALCULATOR_DICTIONARIES: readonly {
  name: string;
  get: (locale: Locale) => unknown;
  /**
   * Chaves que se escrevem igual nos dois idiomas.
   *
   * São de quatro tipos, e nenhum é tradução esquecida: nome próprio de receita
   * ou de forma (focaccia, tagliatelle, kimchi), termo técnico que o ofício usa
   * na língua de origem (poolish, tangzhong, couverture, POD), unidade
   * abreviada (min, h, p.) e nome de ingrediente ou marca (Nutella, rum).
   *
   * Qualquer chave nova que apareça aqui é tradução que faltou — o teste falha
   * até alguém decidir qual dos dois casos é.
   */
  sameInBoth: readonly string[];
}[] = [
  {
    name: 'bread',
    get: getBreadDictionary,
    sameInBoth: [
      'fermentation.hours',
      'glossary.terms.biga.term',
      'glossary.terms.levain.term',
      'glossary.terms.poolish.term',
      'glossary.terms.tangzhong.term',
      'ingredients.poolish',
      'ingredients.tangzhong',
      'meta.keywords.6',
      'meta.keywords.7',
      'presets.brioche',
      'presets.focaccia',
      'presets.jachnun',
      'presets.laffa',
      'presets.malawach',
      'process.minutes',
      'sources.page',
      'yeastTool.result',
    ],
  },
  {
    name: 'brine',
    get: getBrineDictionary,
    sameInBoth: [
      'glossary.terms.salting-out.term',
      'result.diamondCrystal',
      'result.hours',
      'result.minutes',
      'result.mortonKosher',
      'sources.page',
    ],
  },
  {
    name: 'curing',
    get: getCuringDictionary,
    sameInBoth: [
      'glossary.terms.botulism.term',
      'glossary.terms.ppm.term',
      'meta.keywords.4',
      'sources.page',
    ],
  },
  {
    name: 'ganache',
    get: getGanacheDictionary,
    sameInBoth: [
      'glossary.terms.couverture.term',
      'glossary.terms.ganache.term',
      'glossary.terms.syneresis.term',
      'input.chocolate',
      'result.chocolate',
      'sources.page',
    ],
  },
  {
    name: 'gelato',
    get: getGelatoDictionary,
    sameInBoth: [
      'bases.sorbet.name',
      'batch.densityUnit',
      'batch.litersUnit',
      'categories.base',
      'glossary.terms.overrun.term',
      'glossary.terms.pac.term',
      'glossary.terms.pod.term',
      'ingredients.banana',
      'ingredients.biscoff',
      'ingredients.brigadeiro',
      'ingredients.cachaca',
      'ingredients.cointreau',
      'ingredients.cream-cheese',
      'ingredients.croissant',
      'ingredients.dpo-165-premium-aroma-italia',
      'ingredients.fruta-nativa-guabiroba',
      'ingredients.kiwi',
      'ingredients.maltitol',
      'ingredients.mascarpone',
      'ingredients.nutella',
      'ingredients.rum',
      'ingredients.sucralose',
      'ingredients.whey-protein-80',
      'metrics.pac.label',
      'metrics.pod.label',
      'nutrition.per100',
      'presets.fior-di-latte',
      'sources.page',
      'table.total',
    ],
  },
  {
    name: 'gelling',
    get: getGellingDictionary,
    sameInBoth: [
      'bloom.bloomLabel',
      'bloom.grades.bronze',
      'bloom.use',
      'sources.page',
    ],
  },
  {
    name: 'jam',
    get: getJamDictionary,
    sameInBoth: [
      'brazil.brixHeader',
      'brazil.jackix',
      'brazil.legalExtra',
      'brazil.torrezan',
      'fruits.acerola',
      'fruits.umbu',
      'fruits.uvaia',
      'glossary.terms.nappe.term',
      'input.altitude',
      'point.minutes',
      'sources.page',
      'sugarLevels.extra',
      'sugarLevels.ferber',
    ],
  },
  {
    name: 'pasta',
    get: getPastaDictionary,
    sameInBoth: [
      'dishes.items.tortelliniHazan.name',
      'glossary.terms.al-dente.term',
      'glossary.terms.maltagliati.term',
      'glossary.terms.matterello.term',
      'glossary.terms.tonnarelli.term',
      'result.litres',
      'result.minutes',
      'shapes.items.chitarra.name',
      'shapes.items.garganelli.name',
      'shapes.items.maltagliati.name',
      'shapes.items.pappardelle.name',
      'shapes.items.tagliatelle.name',
      'shapes.setting',
      'sources.page',
    ],
  },
  {
    name: 'pickles',
    get: getPicklesDictionary,
    sameInBoth: [
      'glossary.terms.ph.term',
      'presets.boshi',
      'presets.jabuticaba',
      'presets.kimchi',
      'sources.page',
    ],
  },
];

describe.each(CALCULATOR_DICTIONARIES)(
  'dicionário de $name',
  ({ get, sameInBoth }) => {
    it('tem as mesmas chaves nos dois idiomas', () => {
      const reference = collectKeys(get('pt-BR')).sort();

      for (const locale of LOCALES) {
        expect(collectKeys(get(locale)).sort(), locale).toEqual(reference);
      }
    });

    it('não deixa texto vazio', () => {
      for (const locale of LOCALES) {
        for (const [key, value] of collectStrings(get(locale))) {
          expect(String(value).trim().length, `${locale}: ${key}`).toBeGreaterThan(0);
        }
      }
    });

    it('traduz de fato: os textos diferem entre os idiomas', () => {
      const pt = new Map(collectStrings(get('pt-BR')));
      const en = new Map(collectStrings(get('en')));

      const identical = [...pt.entries()]
        .filter(([key, value]) => en.get(key) === value)
        .map(([key]) => key);

      expect(identical.sort()).toEqual([...sameInBoth].sort());
    });
  },
);
