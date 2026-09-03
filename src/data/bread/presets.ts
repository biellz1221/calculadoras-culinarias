import { cite, type Citation } from '../citations';
import type {
  BreadPreset,
  BreadProcess,
  FormulaLine,
  IngredientKey,
} from './types';

/**
 * Presets da calculadora de pães, transcritos das receitas das fontes e
 * convertidos para porcentagem de padeiro.
 *
 * Convenções:
 * - `flours` é a **base de farinha** da receita e soma 100. Farinhas que a
 *   fonte trata como aditivo (a farinha de arroz do pão de sanduíche) entram em
 *   `lines`, porque não fazem parte da base sobre a qual tudo é calculado.
 * - Pré-fermentos ficam em `lines` com a sua porcentagem sobre a base; a
 *   farinha e a água que eles carregam entram na hidratação real pelo motor.
 *
 * Cada preset carrega a citação exata da fonte. Conferência item a item em
 * docs/research/paes.md, seção 5.
 */

const l = (key: IngredientKey, percent: number): FormulaLine => ({ key, percent });

function preset(
  id: string,
  flours: FormulaLine[],
  lines: FormulaLine[],
  citations: Citation[],
  process: BreadProcess,
  yieldInfo?: { count: number; unitGrams: number },
): BreadPreset {
  return { id, formula: { flours, lines }, citations, process, yield: yieldInfo };
}

const WHITE_ONLY = [l('flour-white', 100)];

export const BREAD_PRESETS: readonly BreadPreset[] = [
  preset(
    'boule',
    WHITE_ONLY,
    [l('water', 70), l('levain-liquid', 20), l('yeast-fresh', 0.4), l('salt', 2)],
    [cite('kayser', 48)],
    {
      firstRiseMinutes: [90, 120],
      secondRiseMinutes: [120, 120],
      ovenCelsius: 230,
      bakeMinutes: [40, 45],
      noteKey: 'steam',
    },
    { count: 1, unitGrams: 920 },
  ),

  preset(
    'baguette',
    WHITE_ONLY,
    [l('water', 65), l('levain-liquid', 20), l('yeast-fresh', 0.6), l('salt', 2)],
    [cite('kayser', 54)],
    {
      firstRiseMinutes: [90, 90],
      secondRiseMinutes: [100, 100],
      ovenCelsius: 230,
      bakeMinutes: [20, 20],
      noteKey: 'autolyse',
    },
    { count: 3, unitGrams: 300 },
  ),

  preset(
    'pao-frances',
    WHITE_ONLY,
    [
      l('water', 60),
      l('lard', 4),
      l('sugar', 1.4),
      l('yeast-instant', 1),
      l('salt', 2),
    ],
    [cite('camargo', 'cap. 3, "Pão francês"')],
    {
      firstRiseMinutes: [60, 60],
      secondRiseMinutes: [70, 70],
      bakeMinutes: [20, 25],
    },
    { count: 10, unitGrams: 85 },
  ),

  preset(
    'integral',
    [l('flour-white', 66.7), l('flour-wholewheat', 33.3)],
    [l('water', 70), l('yeast-instant', 0.83), l('salt', 2)],
    [cite('camargo', 'cap. 3, "Pão integral"')],
    {
      firstRiseMinutes: [100, 100],
      secondRiseMinutes: [45, 45],
      bakeMinutes: [45, 45],
      noteKey: 'folds',
    },
    { count: 1, unitGrams: 900 },
  ),

  preset(
    'centeio',
    [l('flour-rye', 70), l('flour-white', 30)],
    [l('water', 72), l('levain-liquid', 20), l('yeast-fresh', 0.4), l('salt', 2)],
    [cite('kayser', 112)],
    {
      firstRiseMinutes: [60, 60],
      secondRiseMinutes: [60, 60],
      ovenCelsius: 225,
      bakeMinutes: [30, 30],
      noteKey: 'ryeWatch',
    },
    { count: 3, unitGrams: 320 },
  ),

  preset(
    'focaccia',
    WHITE_ONLY,
    [
      l('water', 66),
      l('olive-oil', 6),
      l('levain-liquid', 20),
      l('yeast-fresh', 1.4),
      l('salt', 2),
    ],
    [cite('kayser', 124)],
    {
      firstRiseMinutes: [120, 120],
      secondRiseMinutes: [90, 90],
      ovenCelsius: 230,
      bakeMinutes: [15, 20],
    },
    { count: 1, unitGrams: 940 },
  ),

  preset(
    'ciabatta',
    WHITE_ONLY,
    // A poolish são 80 g de farinha e 80 g de água (40% da farinha da massa); o
    // 1 g de fermento dela entra no total de fermento, não na conta de água.
    [l('water', 80), l('poolish', 40), l('yeast-instant', 0.75), l('salt', 2)],
    [cite('camargo', 'cap. 4, "Pão tipo ciabatta"')],
    {
      firstRiseMinutes: [120, 120],
      secondRiseMinutes: [60, 60],
      bakeMinutes: [35, 35],
      noteKey: 'poolishAhead',
    },
    { count: 2, unitGrams: 440 },
  ),

  preset(
    'pizza-napoletana',
    WHITE_ONLY,
    [l('water', 65), l('salt', 1), l('yeast-instant', 0.04)],
    [cite('camargo', 'cap. 4, "Massa de pizza ao estilo napoletano"')],
    {
      firstRiseMinutes: [60, 120],
      secondRiseMinutes: [300, 480],
      noteKey: 'napoletana',
    },
    { count: 3, unitGrams: 275 },
  ),

  preset(
    'pizza-caseira',
    WHITE_ONLY,
    [
      l('water', 62),
      l('levain-liquid', 20),
      l('yeast-fresh', 1),
      l('sugar', 3),
      l('olive-oil', 6),
      l('salt', 2),
    ],
    [cite('kayser', 228), cite('kayser', 301)],
    {
      firstRiseMinutes: [120, 120],
      secondRiseMinutes: [60, 60],
      ovenCelsius: 235,
      bakeMinutes: [15, 15],
      noteKey: 'pizzaHydration',
    },
    { count: 2, unitGrams: 500 },
  ),

  preset(
    'pao-de-forma',
    WHITE_ONLY,
    [
      l('water', 56),
      l('levain-liquid', 15),
      l('yeast-fresh', 4),
      l('sugar', 8),
      l('butter', 8),
      l('creme-fraiche', 4),
      l('milk-powder', 2),
      l('salt', 2),
    ],
    [cite('kayser', 260)],
    {
      firstRiseMinutes: [60, 60],
      secondRiseMinutes: [90, 90],
      ovenCelsius: 170,
      bakeMinutes: [30, 40],
    },
    { count: 2, unitGrams: 500 },
  ),

  preset(
    'pao-sanduiche',
    WHITE_ONLY,
    [
      l('water', 60),
      l('butter', 2),
      l('flour-rice', 2),
      l('xanthan', 1),
      l('yeast-instant', 1),
      l('salt', 2),
    ],
    [cite('camargo', 'cap. 3, "Pão para sanduíche"')],
    { firstRiseMinutes: [60, 90], secondRiseMinutes: [60, 60] },
  ),

  preset(
    'pao-hamburguer',
    WHITE_ONLY,
    [
      l('milk', 66.7),
      l('lard', 9.5),
      l('sugar', 1.4),
      l('yeast-instant', 0.95),
      l('salt', 1.9),
    ],
    [cite('camargo', 'cap. 3, "Pão de hambúrguer"')],
    {
      firstRiseMinutes: [75, 75],
      secondRiseMinutes: [40, 40],
      ovenCelsius: 200,
      bakeMinutes: [20, 25],
    },
    { count: 8, unitGrams: 90 },
  ),

  preset(
    'pao-hot-dog',
    WHITE_ONLY,
    [
      l('water', 50),
      l('egg', 12.5),
      l('butter', 12.5),
      l('sugar', 2.5),
      l('yeast-instant', 1),
      l('salt', 2),
    ],
    [cite('camargo', 'cap. 3, "Pão de hot-dog"')],
    {
      firstRiseMinutes: [80, 90],
      secondRiseMinutes: [60, 60],
      ovenCelsius: 200,
      bakeMinutes: [20, 25],
    },
    { count: 6, unitGrams: 120 },
  ),

  preset(
    'pao-de-leite',
    WHITE_ONLY,
    [
      l('milk', 66.7),
      l('sugar', 5),
      l('butter', 6.7),
      l('yeast-instant', 1),
      l('salt', 1.7),
    ],
    [cite('camargo', 'cap. 3, "Pão de leite"')],
    {
      firstRiseMinutes: [90, 90],
      secondRiseMinutes: [30, 30],
      bakeMinutes: [25, 25],
    },
    { count: 8, unitGrams: 70 },
  ),

  preset(
    'brioche',
    WHITE_ONLY,
    [
      l('egg', 54),
      l('butter', 50),
      l('sugar', 16),
      l('levain-liquid', 15),
      l('yeast-fresh', 4),
      l('salt', 2),
    ],
    [cite('kayser', 242)],
    {
      firstRiseMinutes: [120, 180],
      secondRiseMinutes: [90, 120],
      ovenCelsius: 170,
      bakeMinutes: [25, 25],
      noteKey: 'brioche',
    },
    { count: 4, unitGrams: 300 },
  ),

  preset(
    'broa',
    [l('flour-corn', 66.7), l('flour-rye', 22.2), l('flour-white', 11.1)],
    [l('water', 83.3), l('yeast-instant', 1.1), l('salt', 1.8)],
    [cite('camargo', 'cap. 3, "Broa à portuguesa"')],
    {
      firstRiseMinutes: [90, 90],
      ovenCelsius: 240,
      bakeMinutes: [35, 40],
      noteKey: 'scald',
    },
    { count: 1, unitGrams: 700 },
  ),
];

export function getPreset(id: string): BreadPreset | undefined {
  return BREAD_PRESETS.find((item) => item.id === id);
}

export const DEFAULT_PRESET_ID = 'pao-frances';
