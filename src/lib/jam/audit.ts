import { referenceFor, SUGAR_RATIO_TOLERANCE } from './calculate';
import {
  LEGAL_CITATIONS,
  PECTIN_DOSE_CITATIONS,
  PECTIN_DOSE_OVER_SUGAR,
} from '@/data/jam/brazil';
import type { JamFruit, ReferenceBasis } from '@/data/jam/types';
import { metricFromPoint, metricFromRule } from '@/lib/audit/metric';
import type { AuditMetric, AuditResult } from '@/lib/audit/types';

/**
 * A geleia que a pessoa já cozinhou, comparada com a receita da fonte.
 *
 * Aqui a referência não é faixa: é **uma receita**, publicada para aquela
 * fruta. Por isso a leitura de açúcar sai como ponto, e o vocabulário muda
 * junto — "acima da fonte" é o que é verdade, e "fora da faixa" seria acusar de
 * erro quem seguiu outra receita legítima.
 *
 * O que não muda é a consequência: abaixo do que o livro publica, o produto sai
 * do regime que ele testou, e é isso que o aviso da página já diz.
 */
export interface JamAuditInput {
  fruitGrams: number;
  sugarGrams: number;
  /** Opcional: só quem usa pectina em pó tem esse número. */
  pectinGrams: number;
}

export interface JamAuditResult extends AuditResult {
  /** Qual régua respondeu: receita da fruta, receita fresca ou a norma. */
  basis: ReferenceBasis;
}

export function auditJam(fruit: JamFruit, input: JamAuditInput): JamAuditResult {
  const fruitGrams = positive(input.fruitGrams);
  const sugarGrams = positive(input.sugarGrams);
  const pectinGrams = positive(input.pectinGrams);

  const reference = referenceFor(fruit);

  const metrics = keep([
    fruitGrams > 0
      ? metricFromPoint({
          labelKey: 'sugarRatio',
          value: sugarGrams / fruitGrams,
          unit: 'ratio',
          point: reference.ratio,
          // A mesma tolerância que o motor usa para dizer "é a proporção da
          // fonte". Duas tolerâncias dariam duas respostas para a pergunta.
          tolerance: SUGAR_RATIO_TOLERANCE,
          citations: citationsFor(fruit, reference.basis),
          correction: {
            kind: 'dominant',
            subjectKey: 'sugar',
            baseGrams: fruitGrams,
            currentGrams: sugarGrams,
          },
        })
      : null,

    // A dose de pectina é sobre o **açúcar**, não sobre a fruta nem sobre o
    // produto pronto. Errar a base aqui erraria a dose por um fator de dois.
    sugarGrams > 0 && pectinGrams > 0
      ? metricFromRule({
          labelKey: 'pectinPercent',
          value: (pectinGrams / sugarGrams) * 100,
          unit: 'percent',
          rule: {
            min: PECTIN_DOSE_OVER_SUGAR[0] * 100,
            max: PECTIN_DOSE_OVER_SUGAR[1] * 100,
            citations: PECTIN_DOSE_CITATIONS,
            noteKey: 'pectinDose',
          },
          correction: {
            kind: 'dominant',
            subjectKey: 'pectin',
            baseGrams: sugarGrams,
            currentGrams: pectinGrams,
          },
        })
      : null,
  ]);

  return { metrics, basis: reference.basis };
}

/**
 * De onde sai a referência de açúcar desta fruta.
 *
 * A receita citada quando existe; a norma quando não há nenhuma. São obras
 * diferentes dizendo coisas diferentes, e a página precisa nomear qual está
 * falando — foi para isso que `referenceFor` devolve a base junto da razão.
 */
function citationsFor(fruit: JamFruit, basis: ReferenceBasis) {
  if (basis === 'recipe') return fruit.citations;
  if (basis === 'fresh' && fruit.fresh) return fruit.fresh.citations;
  return LEGAL_CITATIONS;
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function keep(metrics: readonly (AuditMetric | null)[]): AuditMetric[] {
  return metrics.filter((metric) => metric !== null);
}
