import { cite, type Citation } from '../citations';

/**
 * Pontos de calibração de fermento × tempo (FR-014).
 *
 * São os valores que as fontes publicam junto das receitas, não interpolação
 * nossa: cada linha é uma receita real, com a dose que ela usa e a janela que o
 * livro dá. A regra do Camargo — metade do fermento, dobro do tempo — serve
 * para andar entre eles, e é ela que o conversor aplica.
 *
 * O estágio vem junto de propósito. Misturar a primeira fermentação da baguete
 * com a segunda da napoletana daria uma curva bonita e errada: são etapas
 * diferentes do mesmo processo.
 *
 * Consolidação em docs/research/paes.md §4.5.
 */

export type RiseStage = 'first' | 'second';

export interface FermentationPoint {
  /** Chave no dicionário: o pão de onde o ponto saiu. */
  readonly recipeKey: string;
  /** Dose de fermento seco instantâneo, em % da farinha. */
  readonly yeastPercent: number;
  readonly stage: RiseStage;
  /** Janela publicada, em minutos. */
  readonly minutes: readonly [number, number];
  readonly citations: readonly Citation[];
}

export const FERMENTATION_POINTS: readonly FermentationPoint[] = [
  {
    recipeKey: 'french',
    yeastPercent: 1,
    stage: 'first',
    minutes: [60, 90],
    citations: [cite('camargo', 'cap. 3, "Pão francês"')],
  },
  {
    recipeKey: 'ciabatta',
    yeastPercent: 0.6,
    stage: 'first',
    minutes: [120, 120],
    citations: [cite('camargo', 'cap. 4, "Ciabatta"')],
  },
  {
    recipeKey: 'napoletana',
    yeastPercent: 0.04,
    stage: 'second',
    minutes: [300, 480],
    citations: [cite('camargo', 'cap. 4, "Massa de pizza ao estilo napoletano"')],
  },
];

/**
 * Janela típica da primeira fermentação, quando não há ponto de calibração
 * mais próximo. Kayser, p. 30.
 */
export const TYPICAL_FIRST_RISE = {
  minutes: [60, 180] as const,
  citations: [cite('kayser', 30)] as const,
};

/**
 * Retardo na geladeira: a ~4 °C a massa modelada segura a noite inteira.
 * É o que transforma pão de fim de semana em pão de manhã de terça.
 */
export const COLD_RETARD = {
  celsius: 4,
  hours: [10, 12] as const,
  citations: [cite('kayser', 30)] as const,
};

/**
 * O ponto de calibração mais próximo de uma dose.
 *
 * Proximidade em escala logarítmica, porque a relação é de proporção: de 0,04%
 * para 0,08% é o mesmo salto que de 1% para 2%, e comparar diferença absoluta
 * mandaria toda dose pequena para o mesmo ponto.
 */
export function closestPoint(
  yeastPercent: number,
  stage: RiseStage,
): FermentationPoint | undefined {
  const candidates = FERMENTATION_POINTS.filter((point) => point.stage === stage);
  if (yeastPercent <= 0 || candidates.length === 0) return undefined;

  return candidates.reduce((best, point) =>
    Math.abs(Math.log(point.yeastPercent / yeastPercent)) <
    Math.abs(Math.log(best.yeastPercent / yeastPercent))
      ? point
      : best,
  );
}
