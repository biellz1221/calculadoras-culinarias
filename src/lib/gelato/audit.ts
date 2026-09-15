import { isPerKgMetric } from './calc';
import type { MetricResult } from './types';
import type { Bounds } from '@/lib/audit/types';

/**
 * A faixa da métrica traduzida para gramas do lote que está na tela.
 *
 * O gelato já é, desde sempre, "insira a sua receita": o que faltava era dizer
 * quanto. E aqui a resposta tem uma forma diferente das outras calculadoras.
 * No pão existe um ingrediente dominante — água resolve hidratação, e mais
 * nada muda. Num gelato, açúcar é sacarose, dextrose, mel e a fruta junto; e
 * acrescentar qualquer um deles muda a massa total, que é o denominador de
 * todas as oito métricas ao mesmo tempo.
 *
 * Por isso o alvo é da **grandeza**, não de um ingrediente, e vale para o lote
 * como ele está agora. A frase na tela diz isso com todas as letras. Resolver o
 * sistema inteiro — mexer em vários ingredientes de uma vez, respeitando a
 * massa-alvo — é o que `autoBalance` faz, e continua sendo o botão ao lado.
 */
export function correctionForMetric(
  metric: MetricResult,
  totalGrams: number,
): Bounds | null {
  if (metric.status === 'ok') return null;
  if (!Number.isFinite(totalGrams) || totalGrams <= 0) return null;

  // POD e PAC são por kg de mistura; sólidos e água são fração da massa.
  const perGram = isPerKgMetric(metric.key) ? totalGrams / 1000 : totalGrams;

  const min = metric.range.min * perGram;
  const max = metric.range.max * perGram;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  return { min, max };
}
