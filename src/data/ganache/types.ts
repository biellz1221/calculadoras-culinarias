import type { Citation } from '../citations';

/**
 * Modelo da calculadora de ganache.
 *
 * Consolidação em docs/research/ganache.md. A base 100 é o peso das
 * **substâncias moles** — que no cabeçalho da tabela do Wybauw é "cream, milk,
 * liqueur, invert sugar, glucose, etc.", e não só creme de leite.
 *
 * O tipo de chocolate não muda a proporção: muda a manteiga de cacau extra que
 * o branco precisa para dar a mesma textura.
 */

export type ChocolateKind = 'dark' | 'milk' | 'white';

/** Faixa fechada. Quando `min === max`, a fonte deu valor único. */
export interface Range {
  min: number;
  max: number;
}

export interface GanacheTexture {
  id: string;
  /** Chocolate por unidade de substância mole. */
  chocolate: Range;
  /** Manteiga por unidade de substância mole. Zero na trufa. */
  butter: Range;
  citations: readonly Citation[];
}

export interface GanacheInput {
  /** Creme, leite, licor — a base 100 da tabela. */
  softGrams: number;
  textureId: string;
  chocolate: ChocolateKind;
}

export interface GanacheResult {
  chocolateGrams: Range;
  butterGrams: Range;
  /** Manteiga de cacau extra. Só no branco, e 2 % do total. */
  extraCocoaButterGrams: number;
  totalGrams: Range;
  /** Água que a receita traz, do creme e da manteiga. */
  waterGrams: Range;
  /** Água como fração do total, no ponto médio da faixa. */
  waterShare: number;
}
