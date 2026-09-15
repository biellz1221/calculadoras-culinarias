import type { Citation } from '@/data/citations';
import type { RangeStatus } from '@/data/ranges';

/**
 * O contrato de "confira a receita que você já tem".
 *
 * Toda calculadora do site anda no sentido alvo → receita. Este módulo é o
 * sentido inverso: a pessoa traz os pesos dela e o site diz onde aquilo cai
 * dentro do que as fontes publicam — e, quando cai fora, quanto de um único
 * ingrediente traria a receita de volta.
 *
 * O que **não** está aqui é tão importante quanto o que está. Não há base de
 * 100% (farinha no pão, fruta na geleia, carne na cura), não há vocabulário de
 * papéis, não há faixa: cada calculadora resolve isso do seu jeito e entrega
 * métricas prontas. Tentar unificar as bases foi descartado no desenho — a
 * razão farinha:ovo e a dose de nitrito não são a mesma grandeza com nomes
 * diferentes.
 *
 * A regra do projeto vale inteira aqui: nenhuma métrica nasce de número novo.
 * Se a comparação não tem faixa publicada com citação, a métrica não aparece.
 */

export interface Bounds {
  readonly min: number;
  readonly max: number;
}

/**
 * A correção de uma métrica: mexa em **um** ingrediente e a receita entra na
 * faixa.
 *
 * É deliberadamente ingênua. Um ajuste real de receita mexe em tudo ao mesmo
 * tempo, e resolver esse sistema é o que o `autoBalance` do gelato faz — com
 * penalidade, passos e um contrato de falha parcial. Aqui a promessa é menor e
 * exata: mantida a base como está, este peso resolve esta faixa.
 */
export interface SimpleCorrection {
  /** Chave de dicionário do ingrediente a mexer — lida por `labelFor()`. */
  readonly subjectKey: string;
  /** Alvo em gramas. `min === max` quando a fonte publica ponto, não faixa. */
  readonly targetGrams: Bounds;
  readonly currentGrams: number;
}

/**
 * A unidade em que a métrica se lê.
 *
 * Existe para a tela saber formatar sem perguntar de qual calculadora veio.
 * `ratio` é grandeza sem unidade (farinha por grama de ovo, chocolate por grama
 * de creme): proporção entre massas não tem unidade, e escrever "g/g" só
 * convidaria alguém a converter.
 */
export type MetricUnit = 'percent' | 'ratio' | 'ppm';

/**
 * Como a fonte publica a referência.
 *
 * A diferença muda o texto na tela, e não é cosmética: "fora da faixa das
 * fontes" acusa a receita de estar fora do que a bibliografia respalda;
 * "diferente da fonte" só diz que ela não é aquela receita. Jam e brine
 * comparam com receita publicada — ponto, não faixa —, e chamar isso de erro
 * seria mentir sobre o que a fonte diz.
 */
export type ReferenceKind = 'range' | 'point';

export interface AuditMetric {
  /** Chave de dicionário do rótulo, na calculadora que emitiu a métrica. */
  readonly labelKey: string;
  readonly value: number;
  readonly unit: MetricUnit;
  readonly referenceKind: ReferenceKind;
  /** A faixa citada, já na unidade de `value`. */
  readonly reference: Bounds & {
    readonly hardMin?: number;
    readonly hardMax?: number;
  };
  readonly status: RangeStatus;
  readonly beyondHardLimit: boolean;
  /** Nunca vazia: métrica sem fonte não chega à tela. Invariante testado. */
  readonly citations: readonly Citation[];
  /**
   * Presente só quando há o que corrigir e existe variável dominante solúvel.
   * Métrica dentro da faixa não tem correção — não há nada a fazer.
   */
  readonly correction?: SimpleCorrection;
  /** Chave da nota que explica a consequência de sair da faixa. */
  readonly noteKey?: string;
}

export interface AuditResult {
  readonly metrics: readonly AuditMetric[];
}
