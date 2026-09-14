import { cite } from '../citations';
import { dryDoseFromFoodLab } from './salt';
import type { BrineMethod, SourceBrine } from './types';

/**
 * Os cinco métodos, com as proporções das fontes.
 *
 * Extração e conferência em docs/research/salmoura.md §3. Quatro saem das
 * receitas do Modernist at Home; o quinto, a salga seca, sai do Food Lab por
 * uma conversão de volume para peso documentada em `salt.ts`.
 *
 * As quatro receitas guardam os **pesos publicados** e derivam a proporção
 * deles. A coluna "SCALING" do livro é arredondada — 10 g de sal em 750 g de
 * carne são 1,333 % e a tabela imprime 1,3 % — e é o peso que reproduz a
 * receita.
 */

const MC = (section: string) => cite('modernist-home', section);

function fromRecipe(
  recipe: SourceBrine,
): Pick<BrineMethod, 'recipe' | 'salt' | 'liquid' | 'sugar'> {
  return {
    recipe,
    salt: recipe.saltGrams / recipe.proteinGrams,
    liquid: recipe.liquidGrams / recipe.proteinGrams,
    sugar: recipe.sugarGrams / recipe.proteinGrams,
  };
}

export const BRINE_METHODS: readonly BrineMethod[] = [
  {
    // Não é receita, é dose por peso: "rub about 1 teaspoon of Diamond Crystal
    // kosher salt per pound of meat" (p. 579), convertida em `salt.ts` para
    // 0,625 % pelo peso do sal que Ruhlman & Polcyn publicam. Tempo: 24 a 48 h
    // para ave (p. 579), até três dias para bife (p. 291).
    id: 'dry-salting',
    salt: dryDoseFromFoodLab(),
    liquid: 0,
    sugar: 0,
    hours: [24, 48],
    equilibrium: true,
    injected: false,
    rinsed: false,
    citations: [
      cite('foodlab', 579),
      cite('foodlab', 291),
      cite('ruhlman-charcuterie', 'cap. 2, "Salt" — pesos do sal kosher'),
    ],
  },
  {
    // Basic Brine for Whole Poultry: 200 g de água e 12 g de sal para 2 kg de
    // frango. Injetada, 24 h na geladeira, descoberta.
    id: 'equilibrium-poultry',
    ...fromRecipe({
      proteinGrams: 2000,
      saltGrams: 12,
      liquidGrams: 200,
      sugarGrams: 0,
    }),
    hours: [24, 24],
    equilibrium: true,
    injected: true,
    rinsed: false,
    citations: [MC('cap. "Brines and Marinades" — Basic Brine for Whole Poultry')],
  },
  {
    // Sweet Brine for Meats: 75 g de leite e 75 g de suco de maçã, 10 g de sal
    // e 9 g de açúcar para 750 g de carne. Injetada, depois imersa no que
    // sobrar; 12 h. Peça de até 3,5 cm de espessura.
    id: 'sweet-meat',
    ...fromRecipe({
      proteinGrams: 750,
      saltGrams: 10,
      liquidGrams: 150,
      sugarGrams: 9,
    }),
    hours: [12, 12],
    equilibrium: true,
    injected: true,
    rinsed: false,
    citations: [MC('cap. "Brines and Marinades" — Sweet Brine for Meats')],
  },
  {
    // Fish Brine: 1 kg de água, 50 g de sal e 40 g de açúcar para 600 g de
    // peixe em porções. Imersão de 5 h (leve) a 12 h (firme). **Não é de
    // equilíbrio**: o tempo é parte da receita.
    id: 'immersion-fish',
    ...fromRecipe({
      proteinGrams: 600,
      saltGrams: 50,
      liquidGrams: 1000,
      sugarGrams: 40,
    }),
    hours: [5, 12],
    equilibrium: false,
    injected: false,
    rinsed: false,
    citations: [MC('cap. "Brines and Marinades" — Fish Brine')],
  },
  {
    // Fish Cure: 35 g de sal e 25 g de açúcar por quilo de peixe. Cobrir,
    // 45 minutos na geladeira, enxaguar, secar e cozinhar.
    id: 'cure-fish',
    ...fromRecipe({
      proteinGrams: 1000,
      saltGrams: 35,
      liquidGrams: 0,
      sugarGrams: 25,
    }),
    hours: [0.75, 0.75],
    equilibrium: false,
    injected: false,
    rinsed: true,
    citations: [MC('cap. "Brines and Marinades" — Fish Cure')],
  },
];

export function getMethod(id: string): BrineMethod | undefined {
  return BRINE_METHODS.find((method) => method.id === id);
}

export const DEFAULT_METHOD_ID = 'dry-salting';

/**
 * O alvo declarado do Modernist, para a página mostrar contra o que a dose é
 * comparada: "You're shooting for a final concentration of about 0.5% salt
 * throughout the meat."
 */
export const MODERNIST_TARGET_SALT = 0.005;

export const TARGET_CITATIONS = [cite('modernist-home', 'cap. "Brines and Marinades"')];

/**
 * A medição que fecha a divergência: doze peitos de frango, mesmo forno, mesma
 * temperatura final, e o que sobra do peso inicial depois de assar.
 *
 * Food Lab, pp. 359–360. A salmoura ganha um ponto percentual, e a frase que
 * vem depois é a razão de a página não escolher por ninguém: o ponto ganho é
 * água de torneira.
 */
export const FOODLAB_TRIAL = [
  { id: 'plain', afterSoak: 0.991, afterCooking: 0.829 },
  { id: 'brined', afterSoak: 1.116, afterCooking: 0.896 },
  { id: 'salted', afterSoak: 0.994, afterCooking: 0.886 },
  { id: 'water', afterSoak: 1.032, afterCooking: 0.817 },
] as const;

export const TRIAL_CITATIONS = [cite('foodlab', 360)];

/** Furar a peça leva contaminação de superfície para dentro. */
export const PUNCTURE_CITATIONS = [
  cite('modernist-home', 'quadro "The Hazards of Puncturing"'),
];
