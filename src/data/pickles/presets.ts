import { cite } from '../citations';
import { DEFAULT_VEGETABLE_SHARE, KATZ_VEGETABLE_SHARE } from './ranges';
import type { PickleMode, PicklePreset } from './types';

/**
 * Presets transcritos das receitas das fontes, item a item, conforme
 * docs/research/picles-fermentacao.md §5.
 *
 * Cada preset guarda a **base de cálculo da própria fonte**. É o que permite
 * mostrar lado a lado que os 5% de Katz sobre a água e os 2% do BWF sobre o
 * total chegam quase ao mesmo produto. Converter tudo para uma base só
 * apagaria justamente a divergência que a página existe para explicar.
 *
 * `vegetableShare` é a proporção vegetal/pote que a própria fonte sugere:
 * metade e metade no exemplo do Noma (1 kg de couve-flor para 1 kg de água),
 * dois terços em Katz (salmoura na metade do peso dos vegetais).
 */

export const PICKLE_PRESETS: readonly PicklePreset[] = [
  {
    id: 'couve-flor',
    mode: 'brine',
    saltPercent: 2,
    basis: 'total',
    rangeKey: 'brine-total',
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    climate: 'fast',
    days: [5, 7],
    citations: [
      cite('noma', 'cap. 2, "Salt Sufficiently"'),
      cite('noma', 'cap. 2, "Turning Sweet to Sour"'),
    ],
  },
  {
    id: 'cenoura',
    mode: 'brine',
    saltPercent: 2,
    basis: 'total',
    rangeKey: 'brine-total',
    // 300 g de cenoura para 300–600 ml de salmoura, conforme o pote.
    vegetableShare: 0.4,
    climate: 'slow',
    days: [5, 90],
    citations: [cite('bwf', 211), cite('bwf', 212)],
  },
  {
    id: 'aspargo',
    mode: 'brine',
    saltPercent: 3,
    basis: 'total',
    rangeKey: 'brine-total',
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    climate: 'slow',
    days: [14, 14],
    citations: [cite('noma', 'cap. 2, "Lacto White Asparagus"')],
  },
  {
    id: 'kimchi-tropical',
    mode: 'brine',
    saltPercent: 2,
    basis: 'total',
    rangeKey: 'brine-total',
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    climate: 'slow',
    days: [5, 30],
    citations: [cite('bwf', 222), cite('bwf', 223)],
  },
  {
    id: 'molho-pimenta',
    mode: 'brine',
    saltPercent: 2,
    basis: 'total',
    rangeKey: 'brine-total',
    // 800 g de pimentas para 200 ml de água.
    vegetableShare: 0.8,
    climate: 'slow',
    days: [20, 60],
    citations: [
      cite('bwf', 241),
      cite('bwf', 242),
      cite('katz', 'cap. 5, "Fermentação de molho picante"'),
    ],
  },
  {
    id: 'jabuticaba',
    mode: 'brine',
    saltPercent: 2.5,
    basis: 'total',
    rangeKey: 'brine-total',
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    climate: 'slow',
    days: [7, 30],
    citations: [cite('bwf', 233)],
  },
  {
    id: 'manga-verde',
    mode: 'brine',
    saltPercent: 2.5,
    basis: 'total',
    rangeKey: 'brine-total',
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    climate: 'slow',
    days: [7, 30],
    citations: [cite('bwf', 237), cite('bwf', 238)],
  },
  {
    id: 'pepino-azedo',
    mode: 'brine',
    saltPercent: 5,
    basis: 'water',
    rangeKey: 'brine-water',
    vegetableShare: KATZ_VEGETABLE_SHARE,
    climate: 'slow',
    days: [3, 10],
    citations: [
      cite('katz', 'cap. 5, "Picles azedos"'),
      cite('katz', 'cap. 3, "Tabela de proporções de sal"'),
    ],
  },
  {
    id: 'pepino-malossol',
    mode: 'brine',
    saltPercent: 3.5,
    basis: 'water',
    rangeKey: 'brine-water',
    vegetableShare: KATZ_VEGETABLE_SHARE,
    climate: 'slow',
    days: [2, 7],
    citations: [cite('katz', 'cap. 5, "Picles azedos"')],
  },
  {
    id: 'azeitona',
    mode: 'brine',
    saltPercent: 5,
    basis: 'water',
    rangeKey: 'brine-water',
    vegetableShare: KATZ_VEGETABLE_SHARE,
    climate: 'slow',
    days: [21, 360],
    citations: [cite('katz', 'cap. 5, "Azeitonas na salmoura"')],
  },

  {
    id: 'chucrute',
    mode: 'dry-salt',
    saltPercent: 2,
    rangeKey: 'dry-salt',
    climate: 'slow',
    days: [15, 90],
    citations: [
      cite('bwf', 206),
      cite('bwf', 208),
      cite('katz', 'cap. 5, "Salgar com salga seca ou salmoura"'),
    ],
  },
  {
    id: 'chucrute-couve',
    mode: 'dry-salt',
    saltPercent: 2,
    rangeKey: 'dry-salt',
    climate: 'slow',
    days: [60, 120],
    citations: [cite('bwf', 209), cite('bwf', 210)],
  },
  {
    id: 'kimchi',
    mode: 'dry-salt',
    saltPercent: 2,
    rangeKey: 'dry-salt',
    climate: 'slow',
    days: [5, 30],
    citations: [
      cite('bwf', 224),
      cite('bwf', 225),
      cite('katz', 'cap. 5, "Kimchi"'),
    ],
  },
  {
    id: 'lacto-fruta',
    mode: 'dry-salt',
    saltPercent: 2,
    rangeKey: 'dry-salt',
    climate: 'fast',
    days: [5, 7],
    citations: [
      cite('noma', 'cap. 2, "Lacto Plums"'),
      cite('noma', 'cap. "Primer" — "Salt and Baker\'s Percentages"'),
    ],
  },
  {
    id: 'limao',
    mode: 'dry-salt',
    saltPercent: 15,
    rangeKey: 'salt-preserve',
    climate: 'slow',
    days: [10, 90],
    citations: [
      cite('bwf', 217),
      cite('bwf', 218),
      cite('katz', 'cap. 5, "Fermentação lática de frutas"'),
    ],
  },
  {
    id: 'boshi',
    mode: 'dry-salt',
    saltPercent: 10,
    rangeKey: 'salt-preserve',
    climate: 'slow',
    days: [30, 90],
    citations: [cite('bwf', 239), cite('bwf', 240)],
  },

  {
    id: 'quick-pickle',
    mode: 'vinegar',
    vinegarParts: 1,
    waterParts: 1,
    acidity: 5,
    // Os livros dizem só "a little salt and sugar"; usamos o meio das faixas
    // que a pesquisa consolidou (1–2% de sal, 2–5% de açúcar sobre o líquido).
    saltPercent: 1.5,
    sugarPercent: 3.5,
    days: [1, 14],
    citations: [cite('noma', 'cap. "Vinegar"')],
  },
  {
    id: 'flores-vinagre',
    mode: 'vinegar',
    vinegarParts: 1,
    waterParts: 0,
    acidity: 5,
    saltPercent: 0,
    sugarPercent: 0,
    days: [14, 60],
    citations: [cite('noma', 'cap. "Vinegar"')],
  },
];

export function getPreset(id: string): PicklePreset | undefined {
  return PICKLE_PRESETS.find((preset) => preset.id === id);
}

export function presetsFor(mode: PickleMode): readonly PicklePreset[] {
  return PICKLE_PRESETS.filter((preset) => preset.mode === mode);
}

export const DEFAULT_PRESETS: Record<PickleMode, string> = {
  brine: 'cenoura',
  'dry-salt': 'chucrute',
  vinegar: 'quick-pickle',
};
