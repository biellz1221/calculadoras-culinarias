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
 * Duas convenções valem para todos:
 * - Ovos e gemas entram como peso (3 ovos = 150 g), usando os pesos de
 *   referência do modelo. O motor devolve o número de unidades.
 * - Quando a fonte publica uma **faixa** para um líquido (o purê de espinafre
 *   rende 100–110 g), a receita usa o piso da faixa. É um número publicado —
 *   uma média entre os extremos seria número nosso, e número nosso não vai
 *   para a tela.
 */

const g = (key: PastaLine['key'], grams: number, absorbGrams?: number): PastaLine =>
  absorbGrams === undefined ? { key, grams } : { key, grams, absorbGrams };

const eggs = (count: number): PastaLine => g('egg', count * REFERENCE_EGG_GRAMS);
const yolks = (count: number): PastaLine =>
  g('egg-yolk', count * REFERENCE_YOLK_GRAMS);

const Z = (section: string): Citation => cite('zielonka', section);
const H = (section: string): Citation => cite('hazan', section);

const DOUGHS = '"The Doughs"';
const PASTA = '"Pasta"';

export const PASTA_PRESETS: readonly PastaPreset[] = [
  {
    id: 'classica',
    family: 'egg',
    lines: [g('flour-00', 300), eggs(3)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Classic Egg Dough`)],
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
    // 1 cup de farinha é o ponto de partida; a fonte manda incorporar farinha
    // até a massa não grudar no polegar, o que leva a ~240 g no total.
    lines: [g('flour-all-purpose', 140, 100), eggs(2)],
    yieldGrams: 340,
    servings: 3,
    citations: [H(`${PASTA} — For yellow pasta dough`)],
    noteKey: 'hazan-amarela',
  },
  {
    id: 'hazan-recheada',
    family: 'egg',
    lines: [g('flour-all-purpose', 140, 100), eggs(2), g('milk', 7)],
    yieldGrams: 340,
    servings: 3,
    citations: [H(`${PASTA} — For yellow pasta dough, Note`)],
    noteKey: 'hazan-recheada',
  },
  {
    id: 'hazan-verde',
    family: 'egg',
    lines: [g('flour-all-purpose', 210), eggs(2), g('spinach', 140)],
    yieldGrams: 450,
    servings: 4,
    citations: [H(`${PASTA} — For green pasta dough`)],
    noteKey: 'hazan-verde',
  },
  {
    id: 'hazan-tortellini',
    family: 'egg',
    // A fonte conta o rendimento em peças, não em gramas: ~200 tortellini.
    lines: [g('flour-all-purpose', 280), eggs(4), g('milk', 14)],
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
    lines: [g('flour-00', 250), g('spinach', 150), eggs(1), yolks(1)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Spinach Egg Dough`)],
    noteKey: 'espinafre-ovo',
  },
  {
    id: 'espinafre-vegana',
    family: 'vegan',
    lines: [g('flour-semolina-fine', 300), g('spinach-liquid', 140)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Vegan Spinach Dough`)],
    noteKey: 'espinafre-vegana',
  },
  {
    id: 'beterraba-ovo',
    family: 'egg',
    lines: [g('flour-00', 250), g('beetroot-juice', 40), eggs(1), yolks(2)],
    yieldGrams: 400,
    servings: 4,
    citations: [Z(`${DOUGHS} — Beetroot Egg Dough`)],
    noteKey: 'beterraba-ovo',
  },
  {
    id: 'beterraba-vegana',
    family: 'vegan',
    lines: [g('flour-semolina-fine', 300), g('beetroot-juice', 150)],
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
  minutes: [number, number];
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

/** Água de cozimento: 1 L por 100 g de massa, com piso de 3 L. */
export const COOKING_WATER_CITATIONS: readonly Citation[] = [
  Z('"How to Cook Pasta"'),
  H(`${PASTA} — The Essentials of Cooking Pasta, Water`),
];
