import type { Citation } from './citations';

/**
 * A régua comum a toda calculadora que compara um valor com faixa publicada.
 *
 * Nasceu triplicada — pão, massa e picles tinham a mesma definição e as mesmas
 * duas funções, palavra por palavra. A diferença entre elas nunca esteve no
 * tipo, e sim nos números, que continuam cada um na sua casa: aqui não mora
 * nenhum valor, só a forma de comparar.
 *
 * `min`/`max` é a faixa recomendada: fora dela a tela sinaliza, mas não impede —
 * receita boa às vezes mora na borda. `hardMin`/`hardMax` marcam o ponto em que
 * as fontes deixam de dar respaldo, e aí o aviso muda de natureza.
 *
 * Segurança alimentar não se sinaliza por faixa. Onde existe piso de segurança
 * (o sal do picles, o nitrito da cura), ele é conferido à parte, com aviso
 * próprio, mesmo quando também aparece como `hardMin`.
 */

export type RangeStatus = 'below' | 'in' | 'above';

export interface RangeRule {
  min: number;
  max: number;
  hardMin?: number;
  hardMax?: number;
  citations: readonly Citation[];
  /**
   * Chave no dicionário com a consequência de sair da faixa. É o que transforma
   * um alerta de cor em informação útil.
   */
  noteKey: string;
}

export function statusFor(
  value: number,
  rule: Pick<RangeRule, 'min' | 'max'>,
): RangeStatus {
  if (value < rule.min) return 'below';
  if (value > rule.max) return 'above';
  return 'in';
}

/** Passou do limite em que as fontes deixam de dar respaldo. */
export function isBeyondHardLimit(
  value: number,
  rule: Pick<RangeRule, 'hardMin' | 'hardMax'>,
): boolean {
  if (rule.hardMin !== undefined && value < rule.hardMin) return true;
  if (rule.hardMax !== undefined && value > rule.hardMax) return true;
  return false;
}
