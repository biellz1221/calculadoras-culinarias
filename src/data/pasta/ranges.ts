import { cite, type Citation } from '../citations';
import type { ServingStyle } from './types';

/**
 * Faixas e porções da calculadora de massa fresca.
 *
 * Como no pão, `min`/`max` é a faixa recomendada — fora dela a tela sinaliza,
 * mas não impede — e `hardMin`/`hardMax` marcam o ponto onde nenhuma das
 * fontes dá respaldo. Consolidação em docs/research/massas.md, seções 3 e 4.
 */

export type PastaRangeKey =
  | 'serving-grams'
  | 'flour-per-egg-mass'
  | 'water-hydration';

export type RangeStatus = 'below' | 'in' | 'above';

export interface RangeRule {
  min: number;
  max: number;
  hardMin?: number;
  hardMax?: number;
  citations: readonly Citation[];
  /** Chave no dicionário com a consequência de sair da faixa. */
  noteKey: string;
}

const Z = (section: string): Citation => cite('zielonka', section);
const H = (section: string): Citation => cite('hazan', section);

export const PASTA_RANGES: Record<PastaRangeKey, RangeRule> = {
  // 100 g/pessoa em todas as receitas do Zielonka; a Hazan tira 3 porções
  // padrão (~113 g) ou 4 de entrada (~85 g) da mesma massa de 2 ovos.
  'serving-grams': {
    min: 85,
    max: 115,
    citations: [Z('"How to Cook Pasta"'), H('"Pasta" — For yellow pasta dough')],
    noteKey: 'servingGrams',
  },

  // Gramas de farinha por grama de ovo. Zielonka nasce em 2,0 (300 g : 150 g);
  // o Ratio manda 1,5× o peso dos ovos; a Hazan começa em 1,4 e sobe até ~2,4
  // incorporando farinha na sova. Fora de 1,4–2,4 nenhuma fonte respalda.
  'flour-per-egg-mass': {
    min: 1.5,
    max: 2,
    hardMin: 1.4,
    hardMax: 2.4,
    citations: [
      Z('"The Doughs" — Classic Egg Dough'),
      cite('ruhlman', '"Pasta Dough"'),
      H('"Pasta" — For yellow pasta dough'),
    ],
    noteKey: 'flourPerEggMass',
  },

  // Massas de água: 130 g para 280 g de sêmola (46%) e 140–150 g de líquido
  // vegetal para 300 g (47–50%).
  'water-hydration': {
    min: 46,
    max: 50,
    citations: [
      Z('"The Doughs" — Vegan Semolina Dough'),
      Z('"The Doughs" — Vegan Beetroot Dough'),
    ],
    noteKey: 'waterHydration',
  },
};

export function statusFor(value: number, rule: RangeRule): RangeStatus {
  if (value < rule.min) return 'below';
  if (value > rule.max) return 'above';
  return 'in';
}

/** Passou do limite onde nenhuma das fontes dá respaldo. */
export function isBeyondHardLimit(value: number, rule: RangeRule): boolean {
  if (rule.hardMin !== undefined && value < rule.hardMin) return true;
  if (rule.hardMax !== undefined && value > rule.hardMax) return true;
  return false;
}

/**
 * Gramas de massa fresca por pessoa em cada contexto de refeição.
 *
 * O padrão é o prato principal: 100 g é o número redondo do Zielonka (400 g
 * servem 4 em todas as receitas dele) e cai dentro da faixa da Hazan. A
 * entrada são as 4 porções que ela tira de ¾ lb; a porção generosa é o topo
 * da faixa consolidada — as 3 porções dela dão ~113 g.
 */
export const SERVING_GRAMS: Record<ServingStyle, number> = {
  starter: 85,
  main: 100,
  generous: 115,
};

export const SERVING_CITATIONS: Record<ServingStyle, readonly Citation[]> = {
  starter: [H('"Pasta" — For yellow pasta dough')],
  main: [Z('"How to Cook Pasta"')],
  generous: [H('"Pasta" — For yellow pasta dough')],
};
