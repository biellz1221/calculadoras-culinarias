import {
  AGENTS,
  GELATIN_GRADES,
  REFERENCE_BLOOM,
  agentsFor,
} from '@/data/gelling/agents';
import type {
  Agent,
  AgentDose,
  Dose,
  GelatinGrade,
  GellingInput,
  TextureId,
} from '@/data/gelling/types';

/**
 * Motor da calculadora de gelificantes.
 *
 * Contrato: toda dose é porcentagem sobre o **peso do líquido**, e converter
 * para grama é `líquido × porcentagem ÷ 100`. Número puro, sem arredondar:
 * arredondamento é apresentação.
 */

function scale(dose: Dose, liquidGrams: number): Dose {
  return {
    min: (liquidGrams * dose.min) / 100,
    max: (liquidGrams * dose.max) / 100,
    citations: dose.citations,
  };
}

/** Quanto de cada agente que a fonte cobre para a textura pedida. */
export function dosesFor({ liquidGrams, textureId }: GellingInput): AgentDose[] {
  const grams = Math.max(0, liquidGrams);

  return agentsFor(textureId).map((agent) => {
    const percent = agent.doses[textureId]!;
    return { agent, percent, grams: scale(percent, grams) };
  });
}

/**
 * Conversão de Bloom, pela fórmula que a fonte publica:
 * `MB = MA × BA ÷ BB`.
 *
 * Quanto mais forte a gelatina (Bloom maior), menos peso para o mesmo gel.
 */
export function bloomEquivalent(
  massA: number,
  bloomA: number,
  bloomB: number,
): number {
  if (bloomB <= 0) return 0;
  return (massA * bloomA) / bloomB;
}

/** O meio da faixa de Bloom de um grau. Grau de valor único devolve o valor. */
export function nominalBloom(grade: GelatinGrade): number {
  return (grade.bloom[0] + grade.bloom[1]) / 2;
}

export function getGrade(id: GelatinGrade['id']): GelatinGrade {
  const grade = GELATIN_GRADES.find((item) => item.id === id);
  if (!grade) throw new Error(`Grau de gelatina desconhecido: ${id}`);
  return grade;
}

export interface GelatinResult {
  /** Gramas de gelatina Knox (225 Bloom), que é a base da dose publicada. */
  referenceGrams: number;
  /** Gramas do grau escolhido, pela conversão de Bloom. */
  grams: number;
  /** Quantas folhas, quando o grau é vendido em folha. */
  sheets?: number;
  bloom: number;
}

/**
 * A conta completa da gelatina: da dose publicada até o número de folhas.
 *
 * O peso por folha vem da tabela da fonte. A contagem de folhas sai em número
 * quebrado de propósito — arredondar aqui esconderia que meia folha a mais ou a
 * menos muda o gel, e quem quer inteiro arredonda com os olhos.
 */
export function gelatinFor(
  liquidGrams: number,
  percent: number,
  gradeId: GelatinGrade['id'],
): GelatinResult {
  const referenceGrams = (Math.max(0, liquidGrams) * percent) / 100;
  const grade = getGrade(gradeId);
  const bloom = nominalBloom(grade);
  const grams = bloomEquivalent(referenceGrams, REFERENCE_BLOOM, bloom);

  return {
    referenceGrams,
    grams,
    bloom,
    sheets: grade.gramsPerSheet ? grams / grade.gramsPerSheet : undefined,
  };
}

/** Os agentes que gelificam de verdade, para separar do que só engrossa. */
export function gellingAgents(): readonly Agent[] {
  return AGENTS.filter((agent) => agent.gels);
}

/** Todas as texturas em que algum agente tem dose publicada. */
export function texturesWithDose(): readonly TextureId[] {
  const seen = new Set<TextureId>();
  for (const agent of AGENTS) {
    for (const key of Object.keys(agent.doses) as TextureId[]) seen.add(key);
  }
  return [...seen];
}
