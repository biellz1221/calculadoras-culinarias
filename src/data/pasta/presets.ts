import { cite, type Citation } from '../citations';
import {
  REFERENCE_EGG_GRAMS,
  REFERENCE_YOLK_GRAMS,
  type PastaFamily,
  type PastaLine,
  type PastaPreset,
} from './types';

/**
 * Presets da calculadora de massa fresca, transcritos em gramas das receitas
 * das fontes (docs/research/massas.md, seção 5).
 *
 * Três convenções valem para todos:
 * - Ovos e gemas entram como peso (3 ovos = 150 g), usando os pesos de
 *   referência do modelo. O motor devolve o número de unidades.
 * - Quando a fonte publica uma **faixa** para um líquido (o purê de espinafre
 *   rende 100–110 g), a receita usa o piso da faixa. É um número publicado —
 *   uma média entre os extremos seria número nosso, e número nosso não vai
 *   para a tela.
 * - `grams` é sempre o que vai à balança na hora de misturar; o que se compra
 *   antes do preparo (espinafre cru, beterraba inteira) vai em `prepGrams`.
 */

const g = (
  key: PastaLine['key'],
  grams: number,
  extra?: { absorbGrams?: number; prepGrams?: number },
): PastaLine => ({ key, grams, ...extra });

const eggs = (count: number): PastaLine => g('egg', count * REFERENCE_EGG_GRAMS);
const yolks = (count: number): PastaLine =>
  g('egg-yolk', count * REFERENCE_YOLK_GRAMS);

const Z = (section: string): Citation => cite('zielonka', section);
const H = (section: string): Citation => cite('hazan', section);
const R = (section: string): Citation => cite('ruhlman', section);

const DOUGHS = '"The Doughs"';
const PASTA = '"Pasta"';

/**
 * Farinha que a massa da Hazan ainda vai absorver na sova: a receita nasce com
 * 1 cup por 2 ovos e ela manda incorporar mais até o polegar sair limpo, o que
 * leva a ~240 g de farinha para 2 ovos (docs/research/massas.md, seção 3). Sem
 * esse número a receita dela pareceria líquida demais ao lado das outras.
 */
const HAZAN_ABSORB_PER_TWO_EGGS = 100;

export const PASTA_PRESETS: readonly PastaPreset[] = [
  {
    id: 'classica',
    family: 'egg',
    lines: [g('flour-00', 300), eggs(3)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Classic Egg Dough`), R('"Pasta Dough"')],
    noteKey: 'classica',
  },
  {
    id: 'rica-em-gemas',
    family: 'egg',
    lines: [g('flour-00', 280), eggs(2), yolks(4)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Rich Egg Dough`)],
    noteKey: 'rica-em-gemas',
  },
  {
    id: 'hazan-amarela',
    family: 'egg',
    lines: [
      g('flour-all-purpose', 140, { absorbGrams: HAZAN_ABSORB_PER_TWO_EGGS }),
      eggs(2),
    ],
    yieldGrams: 340,
    servings: 3,
    citations: [H(`${PASTA} — For yellow pasta dough`)],
    noteKey: 'hazan-amarela',
  },
  {
    id: 'hazan-recheada',
    family: 'egg',
    lines: [
      g('flour-all-purpose', 140, { absorbGrams: HAZAN_ABSORB_PER_TWO_EGGS }),
      eggs(2),
      g('milk', 7),
    ],
    yieldGrams: 340,
    servings: 3,
    citations: [H(`${PASTA} — For yellow pasta dough, Note`)],
    noteKey: 'hazan-recheada',
  },
  {
    id: 'hazan-verde',
    family: 'egg',
    // Aqui a farinha já sobe de 1 para 1½ cup por causa da umidade do
    // espinafre, e o rendimento publicado (~450 g) fecha com a soma das
    // parcelas: não há farinha extra implícita, ao contrário da massa amarela.
    lines: [g('flour-all-purpose', 210), eggs(2), g('spinach', 140, { prepGrams: 225 })],
    yieldGrams: 450,
    servings: 4,
    citations: [H(`${PASTA} — For green pasta dough`)],
    noteKey: 'hazan-verde',
  },
  {
    id: 'hazan-tortellini',
    family: 'egg',
    // Mesma proporção da massa amarela (1 cup por 2 ovos), então vale a mesma
    // farinha de sova. A fonte conta o rendimento em peças: ~200 tortellini.
    lines: [
      g('flour-all-purpose', 280, { absorbGrams: 2 * HAZAN_ABSORB_PER_TWO_EGGS }),
      eggs(4),
      g('milk', 14),
    ],
    pieceYield: 200,
    citations: [H(`${PASTA} — Tortellini with Meat and Cheese Filling`)],
    noteKey: 'hazan-tortellini',
  },
  {
    id: 'semola-vegana',
    family: 'vegan',
    lines: [g('flour-semolina-fine', 280), g('water', 130)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Vegan Semolina Dough`)],
    noteKey: 'semola-vegana',
  },
  {
    id: 'espinafre-ovo',
    family: 'egg',
    // O purê É o líquido e vai pesado: 150 g de espinafre cru branqueados e
    // espremidos, batidos COM 1 ovo, dão 100–110 g. O ovo já está dentro
    // desses 100 g — listá-lo por fora contaria o mesmo ovo duas vezes.
    lines: [
      g('flour-00', 250),
      eggs(1),
      g('spinach', 50, { prepGrams: 150 }),
      yolks(1),
    ],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Spinach Egg Dough`)],
    noteKey: 'espinafre-ovo',
  },
  {
    id: 'espinafre-vegana',
    family: 'vegan',
    lines: [
      g('flour-semolina-fine', 300),
      g('spinach-liquid', 140, { prepGrams: 250 }),
    ],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Vegan Spinach Dough`)],
    noteKey: 'espinafre-vegana',
  },
  {
    id: 'beterraba-ovo',
    family: 'egg',
    lines: [
      g('flour-00', 250),
      g('beetroot-juice', 40, { prepGrams: 200 }),
      eggs(1),
      yolks(2),
    ],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Beetroot Egg Dough`)],
    noteKey: 'beterraba-ovo',
  },
  {
    id: 'beterraba-vegana',
    family: 'vegan',
    lines: [
      g('flour-semolina-fine', 300),
      g('beetroot-juice', 150, { prepGrams: 500 }),
    ],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Vegan Beetroot Dough`)],
    noteKey: 'beterraba-vegana',
  },
  {
    id: 'tinta-de-lula',
    family: 'egg',
    // A tinta é líquido a mais, então a farinha sobe de 300 para 320 g.
    lines: [g('flour-00', 320), eggs(2), yolks(2), g('squid-ink', 40)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Squid Ink Egg Dough`)],
    noteKey: 'tinta-de-lula',
  },
  {
    id: 'sem-gluten',
    family: 'gluten-free',
    lines: [g('flour-chickpea', 300), eggs(3)],
    yieldGrams: 400,
    servings: 4,
    unsuitable: ['filled'],
    citations: [Z(`${DOUGHS} — Gluten-Free Egg Dough`)],
    noteKey: 'sem-gluten',
  },
];

export function getPastaPreset(id: string): PastaPreset | undefined {
  return PASTA_PRESETS.find((preset) => preset.id === id);
}

export const DEFAULT_PASTA_PRESET_ID = 'classica';

export interface CookingRule {
  minutes: readonly [number, number];
  citations: readonly Citation[];
}

/**
 * Tempo de cozimento por família de massa. A massa de grão-de-bico é uma massa
 * ao ovo fresca e cozinha como as outras; a de sêmola, que não leva ovo,
 * precisa de bem mais tempo.
 */
export const COOK_MINUTES: Record<PastaFamily, CookingRule> = {
  egg: { minutes: [1.5, 2], citations: [Z('"Tagliatelle"'), Z('"Pappardelle"')] },
  'gluten-free': { minutes: [1.5, 2], citations: [Z('"Tagliatelle"')] },
  vegan: {
    minutes: [5, 6],
    citations: [Z(`${DOUGHS} — Vegan Semolina Dough`)],
  },
};

/**
 * Água de cozimento: 1 L por 100 g de massa (Zielonka), com o piso de 3 quarts
 * da Hazan — que trabalha com 4 quarts por libra, ~0,84 L/100 g.
 */
export const WATER_LITRES_PER_100G = 1;
export const MIN_WATER_LITRES = 3;

export const COOKING_WATER_CITATIONS: readonly Citation[] = [
  Z('"How to Cook Pasta"'),
  H(`${PASTA} — The Essentials of Cooking Pasta, Water`),
];
