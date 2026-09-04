import { cite, type Citation } from './citations';
import { GELATO_CITATIONS } from './gelato/source';
import type { CalculatorId } from './calculators';

/**
 * O registro do glossário: que verbetes existem, em que ordem e de onde saem.
 *
 * As definições são texto de interface e moram nos dicionários; a procedência é
 * dado e mora aqui, como toda citação do site. O elo é o `id`, que também vira
 * a âncora na URL — `#glossario-autolise` abre a página já na definição.
 *
 * Cada citação abaixo saiu do glossário da própria pesquisa em `docs/research/`,
 * onde a definição foi extraída da obra com localizador.
 */

export interface GlossaryEntry {
  readonly id: string;
  /**
   * Vazio quer dizer vazio: o verbete descreve a prática, mas não sai de fonte
   * nossa, e a tela diz isso no lugar da citação. Não é lacuna a tapar com uma
   * referência aproximada — é o estado honesto do que sabemos.
   */
  readonly citations: readonly Citation[];
}

/** docs/research/paes.md §6 */
const BREAD: readonly GlossaryEntry[] = [
  { id: 'bakers-percentage', citations: [cite('kayser', 307)] },
  { id: 'hydration', citations: [cite('kayser', 307), cite('kayser', 20)] },
  {
    id: 'autolyse',
    citations: [
      cite('kayser', 26),
      cite('kayser', 306),
      cite('camargo', 'cap. 1, Glossário'),
    ],
  },
  {
    id: 'levain',
    citations: [cite('kayser', 24), cite('camargo', 'cap. 1, "Sobre o fermento"')],
  },
  {
    id: 'poolish',
    citations: [
      cite('kayser', 26),
      cite('kayser', 307),
      cite('camargo', 'cap. 1, "Planejando as fornadas"'),
    ],
  },
  { id: 'biga', citations: [cite('camargo', 'cap. 1, "Planejando as fornadas"')] },
  { id: 'fermented-dough', citations: [cite('kayser', 26)] },
  {
    id: 'pointage-appret',
    citations: [cite('kayser', 30), cite('kayser', 306), cite('kayser', 307)],
  },
  { id: 'base-temperature', citations: [cite('kayser', 20), cite('kayser', 306)] },
  {
    id: 'flour-strength',
    citations: [cite('camargo', 'cap. 1, Glossário'), cite('kayser', 14)],
  },
];

/** docs/research/picles-fermentacao.md §7 */
const PICKLES: readonly GlossaryEntry[] = [
  {
    id: 'lactofermentation',
    citations: [cite('noma', 'cap. 2, "Turning Sweet to Sour"'), cite('bwf', 194)],
  },
  { id: 'brine', citations: [cite('katz', 'cap. 5, "Salmoura"')] },
  {
    id: 'dry-salting',
    citations: [cite('katz', 'cap. 5, "Salgar com salga seca ou salmoura"')],
  },
  {
    id: 'anaerobic',
    citations: [cite('noma', 'cap. "Primer" — "Bacteria"'), cite('bwf', 197)],
  },
  {
    id: 'kahm-yeast',
    citations: [
      cite('katz', 'cap. 5, "Bolores e leveduras na superfície"'),
      cite('noma', 'cap. 2, "Lacto Plums"'),
    ],
  },
  {
    id: 'ph',
    citations: [
      cite('noma', 'cap. "Primer" — "Potential of Hydrogen"'),
      cite('bwf', 203),
    ],
  },
  {
    id: 'vinegar-acidity',
    citations: [
      cite('katz', 'cap. 6, "Vinagre"'),
      cite('noma', 'cap. "Vinegar"'),
      cite('bwf', 45),
    ],
  },
  {
    id: 'quick-pickle',
    citations: [
      cite('katz', 'cap. 5, "Os fundamentos do kraut-chi"'),
      cite('noma', 'cap. "Vinegar"'),
    ],
  },
];

/** docs/research/massas.md §6 */
const PASTA: readonly GlossaryEntry[] = [
  {
    id: 'flour-00',
    citations: [cite('zielonka', 'cap. "Ingredients" — "Italian 00 Flour"')],
  },
  {
    id: 'fine-semolina',
    citations: [
      cite('zielonka', 'cap. "Ingredients" — "Fine & Coarse Semolina"'),
      cite('hazan', 'cap. "Pasta" — "How to Make Fresh Pasta at Home"'),
    ],
  },
  {
    id: 'coarse-semolina',
    citations: [cite('zielonka', 'cap. "Ingredients" — "Fine & Coarse Semolina"')],
  },
  {
    id: 'lamination',
    citations: [
      cite('hazan', 'cap. "Pasta" — "Thinning"'),
      cite('zielonka', 'cap. "Rolling & Shaping Pasta"'),
    ],
  },
  {
    id: 'matterello',
    citations: [
      cite('hazan', 'cap. "Pasta" — "The Machine Method and the Rolling-Pin Method"'),
    ],
  },
  {
    id: 'stuffing-dough',
    citations: [cite('hazan', 'cap. "Pasta" — "Stuffed and Shaped Pasta"')],
  },
  {
    id: 'tonnarelli',
    citations: [
      cite('hazan', 'cap. "Pasta" — "Tonnarelli"'),
      cite('zielonka', 'cap. "Chitarra"'),
    ],
  },
  {
    id: 'maltagliati',
    citations: [
      cite('hazan', 'cap. "Pasta" — "Soup Pasta — Maltagliati"'),
      cite('zielonka', 'cap. "Maltagliati"'),
    ],
  },
  {
    id: 'al-dente',
    citations: [
      cite('hazan', 'cap. "Pasta" — "The Essentials of Cooking Pasta — Al dente"'),
    ],
  },
  {
    id: 'bronze-die',
    citations: [cite('zielonka', 'cap. "Ingredients" — "Dried Pasta"')],
  },
];

/**
 * Planilha do curso, aba "Tabela de ingredientes".
 *
 * As métricas são as colunas da própria planilha e as faixas saem do bloco de
 * tolerância. A temperatura de serviço foi conferida na fonte: a célula C24 da
 * aba de receita calcula `PAC/25`, sob o rótulo "Temperatura Média de Serviço".
 *
 * `overrun` e `syrup-density` ficam sem citação porque **não existem na
 * planilha** — procurei por overrun, aeração, litro, volume, ml e densidade, e
 * não há nada. A definição continua na tela; a fonte é que não há, e a tela
 * passa a dizer isso.
 */
const GELATO: readonly GlossaryEntry[] = [
  { id: 'pod', citations: [GELATO_CITATIONS.ingredients] },
  { id: 'pac', citations: [GELATO_CITATIONS.ingredients] },
  { id: 'msnf', citations: [GELATO_CITATIONS.ingredients, GELATO_CITATIONS.ranges] },
  {
    id: 'total-solids',
    citations: [GELATO_CITATIONS.ingredients, GELATO_CITATIONS.ranges],
  },
  { id: 'overrun', citations: [] },
  { id: 'neutro', citations: [GELATO_CITATIONS.ingredients] },
  { id: 'serving-temperature', citations: [GELATO_CITATIONS.ranges] },
  { id: 'syrup-density', citations: [] },
];

export const GLOSSARY: Record<CalculatorId, readonly GlossaryEntry[]> = {
  bread: BREAD,
  pickles: PICKLES,
  pasta: PASTA,
  gelato: GELATO,
};

/** Âncora do verbete na página. O mesmo id nos dois idiomas. */
export function glossaryAnchor(id: string): string {
  return `glossario-${id}`;
}
