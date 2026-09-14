import type { Citation } from '../citations';

/**
 * Modelo da calculadora de gelificantes.
 *
 * Tudo aqui é **porcentagem sobre o peso do líquido**, que é como a fonte
 * publica: "0,25 g de ágar para cada 100 g de líquido". O que conta como
 * líquido é o que a própria fonte conta — na panna cotta são leite, creme e
 * purê de fruta, sem o açúcar e sem o sal.
 *
 * Consolidação em docs/research/gelificantes.md.
 */

/** Textura-alvo. É por onde a pessoa entra: ela sabe o que quer, não a dose. */
export type TextureId = 'thin' | 'sauce' | 'fluid-gel' | 'puree' | 'set';

export type AgentId =
  | 'gelatin'
  | 'agar'
  | 'xanthan'
  | 'iota'
  | 'kappa'
  | 'wondra';

/** Faixa fechada em % do líquido. `min === max` quando a fonte deu valor único. */
export interface Dose {
  min: number;
  max: number;
  citations: readonly Citation[];
}

export interface Agent {
  id: AgentId;
  /** Doses publicadas, por textura. Textura ausente = a fonte não publicou. */
  doses: Partial<Record<TextureId, Dose>>;
  /** Forma gel de verdade, ou só engrossa? É o que separa ágar de xantana. */
  gels: boolean;
  /** Precisa ferver para hidratar. */
  needsBoil: boolean;
  /**
   * Temperatura em que o gel se desfaz, quando a fonte publica. É a diferença
   * prática entre gelatina (37 °C) e ágar (85 °C).
   */
  holdsToCelsius?: number;
  /**
   * Agente que só funciona em dupla. A carragena da fonte é sempre iota com
   * kappa, e publicar uma sem a outra seria publicar meia receita.
   */
  pairedWith?: AgentId;
  citations: readonly Citation[];
}

export interface GellingInput {
  liquidGrams: number;
  textureId: TextureId;
}

export interface AgentDose {
  agent: Agent;
  /** Gramas do agente para o líquido informado. */
  grams: Dose;
  percent: Dose;
}

/**
 * Grau de gelatina, pelo sistema de Bloom.
 *
 * `bloom` é a faixa que a fonte publica; quando ela dá valor único, min e max
 * são iguais. `gramsPerSheet` só existe para as vendidas em folha — a Knox é pó
 * e o livro imprime "n/a".
 */
export interface GelatinGrade {
  id: 'bronze' | 'silver' | 'gold' | 'knox' | 'platinum';
  bloom: readonly [number, number];
  gramsPerSheet?: number;
}
