import { getTexture } from '@/data/ganache/textures';
import type { GanacheTexture, Range } from '@/data/ganache/types';
import { metricFromPoint, metricFromRule } from '@/lib/audit/metric';
import type { AuditMetric, AuditResult } from '@/lib/audit/types';

/**
 * A ganache que a pessoa já emulsionou, lida na tabela do Wybauw.
 *
 * A base 100 é a substância mole — creme, leite, licor, glicose —, como no
 * cabeçalho da tabela. Não é "creme de leite": uma ganache com licor tem duas
 * linhas na base, e somá-las é o que faz a proporção bater.
 *
 * Três das quatro texturas são valor único publicado (100/120/14), e uma é
 * faixa (100/130 a 180). As duas formas convivem no resultado: onde a fonte deu
 * ponto, a tela diz "a proporção da fonte"; onde deu faixa, diz "na faixa".
 */
export interface GanacheAuditInput {
  textureId: string;
  softGrams: number;
  chocolateGrams: number;
  butterGrams: number;
}

/**
 * Metade do menor passo que o Wybauw publica em cada coluna.
 *
 * A tabela anda de 10 em 10 no chocolate (110, 120, 130) e de 1 em 1 na
 * manteiga (14, 24, 25), sempre por 100 de base. Meia casa dessas é o mais
 * fino que a fonte permite distinguir: abaixo disso, dizer que a receita
 * "difere da fonte" seria afirmar uma precisão que a tabela não tem.
 */
const CHOCOLATE_TOLERANCE = 0.05;
const BUTTER_TOLERANCE = 0.005;

export function auditGanache(input: GanacheAuditInput): AuditResult {
  const texture = getTexture(input.textureId);
  if (!texture) return { metrics: [] };

  const soft = positive(input.softGrams);
  // Sem substância mole não há base 100, e toda a tabela é sobre ela.
  if (soft <= 0) return { metrics: [] };

  return {
    metrics: keep([
      ratioMetric({
        labelKey: 'chocolateRatio',
        subjectKey: 'chocolate',
        reference: texture.chocolate,
        tolerance: CHOCOLATE_TOLERANCE,
        currentGrams: positive(input.chocolateGrams),
        softGrams: soft,
        texture,
      }),
      ratioMetric({
        labelKey: 'butterRatio',
        subjectKey: 'butter',
        reference: texture.butter,
        tolerance: BUTTER_TOLERANCE,
        currentGrams: positive(input.butterGrams),
        softGrams: soft,
        texture,
      }),
    ]),
  };
}

function ratioMetric(params: {
  labelKey: string;
  subjectKey: string;
  reference: Range;
  tolerance: number;
  currentGrams: number;
  softGrams: number;
  texture: GanacheTexture;
}): AuditMetric | null {
  const { labelKey, subjectKey, reference, currentGrams, softGrams, texture } =
    params;

  const value = currentGrams / softGrams;
  const correction = {
    kind: 'dominant' as const,
    subjectKey,
    baseGrams: softGrams,
    currentGrams,
  };

  // Ponto e faixa não são o mesmo tipo de afirmação, e a diferença aparece na
  // tela: a trufa é 100/110, não "entre isso e aquilo".
  if (reference.min === reference.max) {
    return metricFromPoint({
      labelKey,
      value,
      unit: 'ratio',
      point: reference.min,
      tolerance: params.tolerance,
      citations: texture.citations,
      correction,
    });
  }

  return metricFromRule({
    labelKey,
    value,
    unit: 'ratio',
    rule: {
      min: reference.min,
      max: reference.max,
      citations: texture.citations,
      noteKey: labelKey,
    },
    correction,
  });
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function keep(metrics: readonly (AuditMetric | null)[]): AuditMetric[] {
  return metrics.filter((metric) => metric !== null);
}
