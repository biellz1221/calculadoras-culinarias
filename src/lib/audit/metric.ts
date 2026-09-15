import { solveDominant } from './solve';
import type {
  AuditMetric,
  Bounds,
  MetricUnit,
  SimpleCorrection,
} from './types';
import type { Citation } from '@/data/citations';
import { isBeyondHardLimit, statusFor, type RangeRule } from '@/data/ranges';

/**
 * Os dois construtores de métrica — um para faixa publicada, outro para receita
 * publicada.
 *
 * Existem para concentrar num lugar os invariantes que as nove calculadoras
 * precisam respeitar igual: correção só aparece quando há o que corrigir, e
 * valor que não é número não vira métrica. Escrever isso nove vezes é como se
 * descobre, meses depois, que oito estavam certas.
 */

/** Como a correção de uma métrica é obtida. */
export type CorrectionSpec =
  /** Resolve a faixa para o dominante: o caso comum. */
  | {
      kind: 'dominant';
      subjectKey: string;
      currentGrams: number;
      baseGrams: number;
    }
  /**
   * Alvo já calculado por quem chama. É o caminho da cura, onde ir do ppm até
   * as gramas de sal de cura passa pela fração de nitrito da mistura —
   * `cureGramsFor()` já sabe fazer isso, e refazer a conta aqui seria uma
   * segunda verdade sobre um número de segurança alimentar.
   */
  | {
      kind: 'explicit';
      subjectKey: string;
      currentGrams: number;
      targetGrams: Bounds | null;
    };

/** Métrica comparada com faixa publicada — pão, massa, picles, ganache, gelificantes. */
export function metricFromRule(params: {
  labelKey: string;
  value: number;
  unit: MetricUnit;
  rule: RangeRule;
  correction?: CorrectionSpec;
}): AuditMetric | null {
  const { labelKey, value, unit, rule } = params;
  if (!Number.isFinite(value)) return null;

  const status = statusFor(value, rule);

  return {
    labelKey,
    value,
    unit,
    referenceKind: 'range',
    reference: {
      min: rule.min,
      max: rule.max,
      hardMin: rule.hardMin,
      hardMax: rule.hardMax,
    },
    status,
    beyondHardLimit: isBeyondHardLimit(value, rule),
    citations: rule.citations,
    // Dentro da faixa não há o que corrigir, e oferecer um alvo assim mesmo
    // convidaria a mexer numa receita que já está certa.
    correction:
      status === 'in'
        ? undefined
        : resolveCorrection(params.correction, unit, {
            min: rule.min,
            max: rule.max,
          }),
    noteKey: rule.noteKey,
  };
}

/**
 * Métrica comparada com **receita** publicada — geleia e salmoura.
 *
 * `tolerance` é do chamador de propósito: é ele quem sabe com que precisão a
 * própria obra publica o número, e o motivo mora ao lado da chamada.
 */
export function metricFromPoint(params: {
  labelKey: string;
  value: number;
  unit: MetricUnit;
  point: number;
  tolerance: number;
  citations: readonly Citation[];
  noteKey?: string;
  correction?: CorrectionSpec;
}): AuditMetric | null {
  const { labelKey, value, unit, point, tolerance } = params;
  if (!Number.isFinite(value) || !Number.isFinite(point)) return null;

  const status =
    value < point - tolerance ? 'below' : value > point + tolerance ? 'above' : 'in';

  return {
    labelKey,
    value,
    unit,
    referenceKind: 'point',
    reference: { min: point, max: point },
    status,
    beyondHardLimit: false,
    citations: params.citations,
    correction:
      status === 'in'
        ? undefined
        : resolveCorrection(params.correction, unit, { min: point, max: point }),
    noteKey: params.noteKey,
  };
}

function resolveCorrection(
  spec: CorrectionSpec | undefined,
  unit: MetricUnit,
  reference: Bounds,
): SimpleCorrection | undefined {
  if (!spec) return undefined;
  if (!Number.isFinite(spec.currentGrams)) return undefined;

  const targetGrams =
    spec.kind === 'dominant'
      ? solveDominant(reference, spec.baseGrams, unit)
      : spec.targetGrams;

  if (!targetGrams) return undefined;
  if (!Number.isFinite(targetGrams.min) || !Number.isFinite(targetGrams.max)) {
    return undefined;
  }

  return {
    subjectKey: spec.subjectKey,
    targetGrams,
    currentGrams: spec.currentGrams,
  };
}
