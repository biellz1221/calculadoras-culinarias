import { describe, expect, it } from 'vitest';

import { BREAD_SNAPSHOT, initialBreadState, parseBreadState } from '@/lib/bread/state';
import {
  GELATO_SNAPSHOT,
  initialGelatoState,
  parseGelatoState,
} from '@/lib/gelato/recipe-state';
import { PASTA_SNAPSHOT, initialPastaState, parsePastaState } from '@/lib/pasta/state';
import {
  PICKLES_SNAPSHOT,
  initialPicklesState,
  parsePicklesState,
} from '@/lib/pickles/state';
import { DEFAULT_PASTA_PRESET_ID } from '@/data/pasta/presets';
import type { CalculatorId } from '@/data/calculators';
import { decodeSnapshot, encodeSnapshot } from './snapshot';

/**
 * O que entra por link é entrada não confiável.
 *
 * Um `?r=` é texto que qualquer pessoa escreve, e o que sai dele vira a receita
 * que alguém vai pesar. Estes testes cobrem a fronteira: ida e volta preserva o
 * estado, e tudo o que não é estado válido é recusado por inteiro — sem estado
 * pela metade, sem `NaN` na tela, sem ingrediente que não existe.
 */

interface ParseCase {
  readonly id: CalculatorId;
  readonly initial: object;
  /** Cada calculadora devolve o seu próprio tipo; aqui só interessa não ser nulo. */
  readonly parse: (value: unknown) => unknown;
  readonly shape: {
    baselineFor: (presetId: string) => never;
    presetOf: (state: never) => string;
    parse: (value: unknown) => unknown;
  };
}

const CALCULATORS: readonly ParseCase[] = [
  {
    id: 'bread',
    initial: initialBreadState(),
    parse: parseBreadState,
    shape: BREAD_SNAPSHOT as never,
  },
  {
    id: 'pasta',
    initial: initialPastaState(DEFAULT_PASTA_PRESET_ID),
    parse: parsePastaState,
    shape: PASTA_SNAPSHOT as never,
  },
  {
    id: 'pickles',
    initial: initialPicklesState(),
    parse: parsePicklesState,
    shape: PICKLES_SNAPSHOT as never,
  },
  {
    id: 'gelato',
    initial: initialGelatoState(),
    parse: parseGelatoState,
    shape: GELATO_SNAPSHOT as never,
  },
];

/** Os estados são interfaces, que não ganham índice implícito. */
function asRecord(value: object): Record<string, unknown> {
  return value as unknown as Record<string, unknown>;
}

describe('estado que volta de um link', () => {
  it.each(CALCULATORS)('$id sobrevive à ida e volta', ({ id, initial, shape }) => {
    const result = decodeSnapshot(
      encodeSnapshot(id, initial as never, shape as never),
      id,
      shape as never,
    );

    expect(result).toEqual({ status: 'ok', state: initial });
  });

  it.each(CALCULATORS)('$id recusa o que não é objeto', ({ parse }) => {
    for (const value of [null, undefined, 42, 'texto', [], true]) {
      expect(parse(value)).toBeNull();
    }
  });

  it.each(CALCULATORS)('$id recusa preset chamado __proto__', ({ initial, parse }) => {
    // Não é curiosidade: `dicionario['__proto__']` devolve o `Object.prototype`
    // em vez de `undefined`, então um preset com esse nome faria o título da
    // receita virar objeto — e o React derruba a página ao receber isso como
    // filho. Link que quebra a página de quem abre, e barato de montar.
    expect(parse({ ...asRecord(initial), presetId: '__proto__' })).toBeNull();
    expect(parse({ ...asRecord(initial), presetId: 'constructor' })).toBeNull();
    expect(parse({ ...asRecord(initial), presetId: 'receita-que-não-existe' })).toBeNull();
  });

  it.each(CALCULATORS)('$id recusa estado incompleto', ({ initial, parse }) => {
    for (const key of Object.keys(asRecord(initial))) {
      const partial = { ...asRecord(initial) };
      delete partial[key];

      expect(parse(partial), `sem ${key}`).toBeNull();
    }
  });
});

describe('validação da calculadora de pães', () => {
  const base = initialBreadState();

  it('recusa preset que não existe', () => {
    expect(parseBreadState({ ...base, presetId: 'pão-de-mentira' })).toBeNull();
  });

  it('recusa ingrediente fora do catálogo', () => {
    // Chave desconhecida atravessaria até a tabela e sairia como linha em
    // branco com um peso ao lado.
    const formula = {
      flours: [{ key: 'flour-white', percent: 100 }],
      lines: [{ key: 'plutonio', percent: 2 }],
    };

    expect(parseBreadState({ ...base, formula })).toBeNull();
  });

  it.each([
    ['NaN', Number.NaN],
    ['infinito', Number.POSITIVE_INFINITY],
    ['negativo', -100],
    ['absurdo', 1e12],
  ])('recusa farinha %s', (_label, flourGrams) => {
    expect(parseBreadState({ ...base, flourGrams })).toBeNull();
  });

  it('aceita uma fórmula editada dentro dos limites', () => {
    const formula = {
      flours: [
        { key: 'flour-white', percent: 80 },
        { key: 'flour-rye', percent: 20 },
      ],
      lines: [
        { key: 'water', percent: 72 },
        { key: 'salt', percent: 2 },
      ],
    };

    expect(parseBreadState({ ...base, formula })).toMatchObject({ formula });
  });
});

describe('validação da calculadora de picles', () => {
  const base = initialPicklesState();

  it('recusa preset que não combina com o modo', () => {
    // "Modo salmoura com preset de chucrute" renderiza a tela de um método
    // com os números do outro — e aqui isso passa por cima de um aviso de
    // segurança alimentar.
    expect(parsePicklesState({ ...base, presetId: 'chucrute' })).toBeNull();
  });

  it('recusa linha com id repetido', () => {
    const lines = [
      { id: 'x', name: '', grams: 100, role: 'solid' },
      { id: 'x', name: '', grams: 200, role: 'solid' },
    ];

    expect(parsePicklesState({ ...base, brine: { ...base.brine, lines } })).toBeNull();
  });

  it('recusa papel de ingrediente inventado', () => {
    const lines = [{ id: 'x', name: '', grams: 100, role: 'gasoso' }];

    expect(parsePicklesState({ ...base, brine: { ...base.brine, lines } })).toBeNull();
  });

  it('recusa proporção de vegetal fora de 0 a 1', () => {
    expect(
      parsePicklesState({ ...base, brine: { ...base.brine, vegetableShare: 7 } }),
    ).toBeNull();
  });
});

describe('validação da calculadora de gelato', () => {
  const base = initialGelatoState();

  it('recusa ingrediente que não está no catálogo', () => {
    const items = [{ id: 'unobtainium', ingredientId: 'unobtainium', grams: 100 }];

    expect(parseGelatoState({ ...base, items })).toBeNull();
  });

  it('recusa id de linha que não é o do ingrediente', () => {
    const first = base.items[0];
    expect(first).toBeDefined();

    const items = [{ ...first, id: 'outra-coisa' }];

    expect(parseGelatoState({ ...base, items })).toBeNull();
  });

  it('recusa lote fora dos limites do controle', () => {
    expect(parseGelatoState({ ...base, batchLiters: 999 })).toBeNull();
    expect(parseGelatoState({ ...base, density: 0 })).toBeNull();
  });
});

describe('validação da calculadora de massas', () => {
  const base = initialPastaState(DEFAULT_PASTA_PRESET_ID);

  it('recusa ovo de peso zero, que faria a escala dividir por nada', () => {
    expect(parsePastaState({ ...base, eggGrams: 0 })).toBeNull();
  });

  it('recusa contexto de refeição inventado', () => {
    expect(parsePastaState({ ...base, style: 'banquete' })).toBeNull();
  });
});
