import { cite } from '../citations';

/**
 * Quanto pesa uma colher de sal — e por que isso é a razão desta calculadora.
 *
 * O Food Lab dá a dose de salga seca em "1 teaspoon of Diamond Crystal kosher
 * salt per pound of meat". Colher de chá de uma marca americana, por libra: sem
 * conversão, não é executável numa cozinha brasileira.
 *
 * A ponte é a única obra da estante que publica o peso de um volume de sal:
 *
 *   "Morton's Kosher Salt; a cup weighs almost 8 ounces. Brian uses Diamond
 *   Crystal kosher salt; a cup of this salt weighs 4.8 ounces."
 *   — Ruhlman & Polcyn, cap. 2, "Salt"
 *
 * A conversão se confere sozinha na outra fonte: o Food Lab descreve a salmoura
 * de 6% como "about ½ cup Diamond Crystal kosher salt … per quart of water", e
 * meia xícara pelo peso acima dá 68 g em 946 g de água — 7,2%, o "about" dele.
 *
 * O tamanho do erro que a marca causa: a **mesma** colher de chá quase dobra a
 * dose se o sal for Morton. É por isso que a saída da calculadora é em gramas.
 */

/** Onça avoirdupois: definição, não estimativa. */
const GRAMS_PER_OUNCE = 28.349523125;

/** Xícara americana: 16 colheres de sopa, 48 colheres de chá. */
const TEASPOONS_PER_CUP = 48;

export interface SaltKind {
  id: 'diamondCrystal' | 'mortonKosher';
  /** Peso de uma xícara, em onças, como o livro publica. */
  cupOunces: number;
}

export const SALT_KINDS: readonly SaltKind[] = [
  { id: 'diamondCrystal', cupOunces: 4.8 },
  { id: 'mortonKosher', cupOunces: 8 },
];

export function gramsPerTeaspoon(kind: SaltKind): number {
  return (kind.cupOunces * GRAMS_PER_OUNCE) / TEASPOONS_PER_CUP;
}

export function teaspoonsFromGrams(grams: number, kind: SaltKind): number {
  return grams / gramsPerTeaspoon(kind);
}

export const SALT_WEIGHT_CITATIONS = [
  cite('ruhlman-charcuterie', 'cap. 2, "Salt" — pesos do sal kosher'),
];

/**
 * A dose de salga seca do Food Lab, já convertida: uma colher de chá de Diamond
 * Crystal (2,835 g) por libra (453,59237 g) dá 0,625 % do peso da carne.
 *
 * Fica aqui, e não em `methods.ts`, para o teste poder refazer a conta a partir
 * das duas fontes em vez de conferir a constante contra ela mesma.
 */
const GRAMS_PER_POUND = 453.59237;

export function dryDoseFromFoodLab(): number {
  const diamond = SALT_KINDS.find((kind) => kind.id === 'diamondCrystal');
  if (!diamond) return 0;
  return gramsPerTeaspoon(diamond) / GRAMS_PER_POUND;
}

export const DRY_DOSE_CITATIONS = [cite('foodlab', 579), ...SALT_WEIGHT_CITATIONS];
