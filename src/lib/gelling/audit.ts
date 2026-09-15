import { AGENTS, getAgent } from '@/data/gelling/agents';
import type { AgentId, TextureId } from '@/data/gelling/types';
import { metricFromPoint, metricFromRule } from '@/lib/audit/metric';
import type { AuditResult } from '@/lib/audit/types';

/**
 * A dose que a pessoa já usou, lida contra a faixa publicada do agente.
 *
 * A calculadora acima vai da textura à dose. Esta seção vai no sentido oposto,
 * e tem uma pergunta a mais: se a dose não bate com a textura pretendida, em
 * qual textura ela bate? É informação que só existe neste sentido, e costuma
 * ser a resposta real — quem dosou 0,8% de ágar não errou a conta, fez outro
 * produto.
 *
 * Agente sem dose publicada para a textura escolhida simplesmente não produz
 * métrica. A tabela cobre o que as fontes cobrem, e preencher o resto seria
 * inventar faixa.
 */
export interface GellingAuditInput {
  liquidGrams: number;
  agentId: AgentId;
  agentGrams: number;
  textureId: TextureId;
}

/**
 * Meia casa da menor precisão que a tabela publica (0,25%, 0,4%, 0,7%).
 *
 * Abaixo disso, duas doses são a mesma dose — e sem uma tolerância a receita
 * publicada acusaria a si mesma, porque a divisão em ponto flutuante não
 * devolve o decimal exato que o livro imprime.
 */
const DOSE_TOLERANCE_PERCENT = 0.005;

export function auditGellingDose(input: GellingAuditInput): AuditResult {
  const liquidGrams = positive(input.liquidGrams);
  if (liquidGrams <= 0) return { metrics: [] };

  const agent = getAgent(input.agentId);
  const dose = agent.doses[input.textureId];
  // A fonte não publica este agente para esta textura. Não é dose errada: é
  // pergunta que a bibliografia não responde.
  if (!dose) return { metrics: [] };

  const agentGrams = positive(input.agentGrams);
  const value = (agentGrams / liquidGrams) * 100;
  const correction = {
    kind: 'dominant' as const,
    subjectKey: 'agent',
    baseGrams: liquidGrams,
    currentGrams: agentGrams,
  };

  // Boa parte da tabela publica dose única (0,7% de ágar no gel fluido), e
  // valor único não é faixa de largura zero: comparar sem tolerância acusaria
  // "acima da faixa" a própria receita do livro, porque 3,5 ÷ 500 × 100 não dá
  // exatamente 0,7 em ponto flutuante. Cada dose carrega a citação da sua
  // linha da tabela.
  const metric =
    dose.min === dose.max
      ? metricFromPoint({
          labelKey: 'dosePercent',
          value,
          unit: 'percent',
          point: dose.min,
          tolerance: DOSE_TOLERANCE_PERCENT,
          citations: dose.citations,
          noteKey: 'dose',
          correction,
        })
      : metricFromRule({
          labelKey: 'dosePercent',
          value,
          unit: 'percent',
          rule: {
            min: dose.min,
            max: dose.max,
            citations: dose.citations,
            noteKey: 'dose',
          },
          correction,
        });

  return { metrics: metric ? [metric] : [] };
}

/**
 * Em que texturas esta dose cairia, com este agente.
 *
 * A pergunta que a tela faz quando a dose não bate com a textura pedida: não
 * "quanto você errou", e sim "o que você fez".
 */
export function texturesForDose(
  agentId: AgentId,
  percent: number,
): readonly TextureId[] {
  if (!Number.isFinite(percent)) return [];

  const agent = AGENTS.find((item) => item.id === agentId);
  if (!agent) return [];

  return (Object.keys(agent.doses) as TextureId[]).filter((textureId) => {
    const dose = agent.doses[textureId];
    return dose !== undefined && percent >= dose.min && percent <= dose.max;
  });
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}
