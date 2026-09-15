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

/**
 * Textura-alvo. É por onde a pessoa entra: ela sabe o que quer, não a dose.
 *
 * A lista é uma escada de resultado, do mais fino ao mais duro. As quatro
 * primeiras vêm do Modernist, que fala em espessura de molho; as três últimas
 * do Scoolinary, que fala em firmeza de gel. São eixos diferentes, e por isso
 * cada agente só aparece na textura em que **a fonte dele** publicou dose.
 */
export type TextureId =
  | 'thin'
  | 'sauce'
  | 'puree'
  | 'fluid-gel'
  | 'soft-set'
  | 'set'
  | 'hard-set';

export type AgentId =
  | 'gelatin'
  | 'agar'
  | 'xanthan'
  | 'iota'
  | 'kappa'
  | 'gellan'
  | 'methylcellulose'
  | 'pectin'
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
  /** Temperatura em que o gel se forma, quando a fonte publica. */
  setsAtCelsius?: number;
  /**
   * Gel que não derrete depois de formado. Só o gellan, na estante: é o que
   * permite recheio que vai ao forno.
   */
  irreversible?: boolean;
  /**
   * Gelifica **esquentando** e derrete esfriando — o contrário de todos os
   * outros. Só a metilcelulose, e é o que torna gel frito possível.
   */
  gelsWhenHot?: boolean;
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

/* -------------------------------------------------------------------------- */
/* Esferificação                                                              */
/* -------------------------------------------------------------------------- */

/**
 * As duas técnicas. A diferença não é de gosto, é de física: numa o cálcio
 * entra na esfera e não para; na outra o alginato é grande demais para entrar e
 * só reage na superfície.
 */
export type SpherificationId = 'direct' | 'reverse';

export interface SpherificationAdditive {
  /** Chave no dicionário. Não é `AgentId`: alginato e cálcio não gelificam sós. */
  key: 'alginate' | 'calcium-chloride' | 'gluconolactate' | 'xanthan' | 'sodium-citrate';
  /** % sobre o peso do líquido a que pertence — base ou banho. */
  percent: Dose;
  /** Opcional na fonte: a faixa começa em zero. */
  optional: boolean;
}

export interface SpherificationMethod {
  id: SpherificationId;
  /** O que entra no líquido que vira esfera. */
  base: readonly SpherificationAdditive[];
  /** O que entra na água do banho. */
  bath: readonly SpherificationAdditive[];
  /**
   * Chaves no dicionário com o que esta técnica **não** aceita. Vale tanto
   * quanto a dose: dose certa em base impossível não faz esfera nenhuma.
   */
  limitKeys: readonly string[];
  citations: readonly Citation[];
}
