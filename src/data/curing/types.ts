import type { Citation } from '../citations';

/**
 * Modelo da calculadora de cura.
 *
 * Tudo aqui é **ppm de entrada**: miligramas de nitrito por quilo de carne, no
 * que se pesa e mistura. Não é o resíduo do produto pronto, que é outra
 * grandeza e só se conhece por análise — a distinção está em
 * docs/research/cura-carnes.md §4 e é a coisa mais importante desta
 * calculadora.
 */

/** Como o sal de cura chega ao produto. Muda o teto legal americano. */
export type CuringMethod = 'comminuted' | 'dry';

export interface CureSalt {
  id: string;
  /** Fração de nitrito de sódio no produto, de 0 a 1. */
  nitrite: number;
  /** Fração de nitrato de sódio. Zero no #1. */
  nitrate: number;
  citations: readonly Citation[];
}

export interface CuringInput {
  meatGrams: number;
  cureId: string;
  /** Alvo de nitrito de entrada, em ppm. */
  targetPpm: number;
}

export interface CuringResult {
  /** O que pesar, em gramas. */
  cureGrams: number;
  /** Nitrito de entrada obtido, em ppm. Deve bater com o alvo. */
  nitritePpm: number;
  /** Nitrato de entrada, em ppm. Zero com o #1. */
  nitratePpm: number;
  /**
   * Nitrito mais nitrato convertido, expresso como nitrito de sódio.
   *
   * É a moeda em que a norma brasileira mede — nitrato ÷ 1,231 + nitrito, do
   * Ofício DIPOA 15/2009. **Continua sendo entrada**, e o teto de 150 ppm da
   * norma é de resíduo: o número mostra em que unidade a régua fala, e não se o
   * produto está conforme. Com o #1, que não leva nitrato, é igual a
   * `nitritePpm`.
   */
  combinedAsNitritePpm: number;
  /** Sal comum que o sal de cura traz junto, em gramas. */
  saltFromCureGrams: number;
  status: CuringStatus;
}

/**
 * `below-minimum` é o caso perigoso: nitrito de menos não segura o
 * *Clostridium botulinum*. `above-limit` é o outro lado, e também não é gosto.
 */
export type CuringStatus = 'ok' | 'below-minimum' | 'above-limit';
