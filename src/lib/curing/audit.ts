import { cureGramsFor, ingoingPpm } from './calculate';
import {
  METHOD_CEILING_PPM,
  METHOD_CITATIONS,
  MIN_INGOING_CITATIONS,
  MIN_INGOING_PPM,
  getCure,
} from '@/data/curing/cures';
import type { CuringMethod } from '@/data/curing/types';
import { metricFromRule } from '@/lib/audit/metric';
import type { AuditResult } from '@/lib/audit/types';

/**
 * O caminho inverso da calculadora: a pessoa já pesou, e quer saber o que pesou.
 *
 * As duas funções que isto precisa já existiam — `ingoingPpm` para ler e
 * `cureGramsFor` para resolver — e é de propósito que nenhuma conta nova nasce
 * aqui. Esta é a página em que errar não estraga o jantar, e uma segunda
 * verdade sobre o mesmo número seria a pior coisa a acrescentar a ela.
 *
 * Os dois limites também são os mesmos: o piso do FSIS e o teto do método,
 * exatamente como a calculadora acima os usa. Abaixo do piso, o produto tem cor
 * de curado e não tem a proteção da cura — por isso `below` aqui é o lado
 * perigoso, ao contrário de quase toda outra faixa do site.
 */
export interface CuringAuditInput {
  meatGrams: number;
  cureId: string;
  cureGrams: number;
  method: CuringMethod;
}

export function auditCure(input: CuringAuditInput): AuditResult {
  const cure = getCure(input.cureId);
  if (!cure) return { metrics: [] };

  const meatGrams = positive(input.meatGrams);
  const cureGrams = positive(input.cureGrams);
  if (meatGrams <= 0) return { metrics: [] };

  const ceiling = METHOD_CEILING_PPM[input.method];

  const metric = metricFromRule({
    labelKey: 'ingoingPpm',
    value: ingoingPpm(cureGrams, meatGrams, cure.nitrite),
    unit: 'ppm',
    rule: {
      min: MIN_INGOING_PPM,
      max: ceiling,
      // Piso e teto são os mesmos números da calculadora, e aqui eles são
      // limite duro nas duas pontas: não existe "um pouco fora" em nitrito.
      hardMin: MIN_INGOING_PPM,
      hardMax: ceiling,
      citations: [...MIN_INGOING_CITATIONS, ...METHOD_CITATIONS],
      noteKey: 'ingoingPpm',
    },
    correction: {
      kind: 'explicit',
      subjectKey: 'cure',
      currentGrams: cureGrams,
      // Ir do ppm às gramas passa pela fração de nitrito da mistura, que muda
      // com o produto — 6,25% no #1, 0,6% no Peklosol. `cureGramsFor` já sabe
      // disso, e refazer a conta aqui seria escrever a fração duas vezes.
      targetGrams: {
        min: cureGramsFor(MIN_INGOING_PPM, meatGrams, cure.nitrite),
        max: cureGramsFor(ceiling, meatGrams, cure.nitrite),
      },
    },
  });

  return { metrics: metric ? [metric] : [] };
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}
