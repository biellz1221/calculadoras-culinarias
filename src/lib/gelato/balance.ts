import { METRIC_KEYS, calculateRecipe, roundGrams } from './calc';
import type { Ingredient, MetricKey, RecipeItem, RecipeType } from './types';

export interface BalanceInput {
  readonly items: readonly RecipeItem[];
  readonly catalog: ReadonlyMap<string, Ingredient>;
  readonly recipeType: RecipeType;
  /** Linhas que não podem ser mexidas — normalmente a que o usuário acabou de editar. */
  readonly fixedItemIds: ReadonlySet<string>;
  readonly targetGrams: number;
}

export interface BalanceOutcome {
  readonly items: readonly RecipeItem[];
  readonly solved: boolean;
  /** Métricas que continuaram fora da faixa. */
  readonly remaining: readonly MetricKey[];
  readonly changed: boolean;
}

/** Peso do desvio de massa total frente aos desvios de faixa. */
const TOTAL_WEIGHT = 2;

/**
 * Margem de segurança, em fração da largura da faixa. O otimizador mira dentro
 * dessa zona e não na borda: parar exatamente no limite deixa a métrica sujeita
 * a voltar para fora no arredondamento para 0,1 g.
 */
const SAFETY_MARGIN = 0.04;

/** Frações da massa-alvo usadas como passo, do mais grosso ao mais fino. */
const STEP_FRACTIONS = [0.08, 0.04, 0.02, 0.01, 0.005, 0.002, 0.001] as const;

const MAX_PASSES_PER_STEP = 40;

/**
 * Quanto cada linha pode encolher e crescer em relação ao valor original.
 * O piso existe para o otimizador não zerar ingredientes funcionais — um
 * estabilizante quase não move as métricas, então sem isso ele é o primeiro a
 * ser descartado, o que arruinaria a receita na prática.
 */
const MIN_FACTOR = 0.25;
const MAX_FACTOR = 4;

interface Bound {
  readonly min: number;
  readonly max: number;
}

/** Uma linha que o otimizador pode mexer, já com o seu piso e teto resolvidos. */
interface Knob {
  readonly index: number;
  readonly bound: Bound;
}

type PenaltyFn = (candidate: readonly number[]) => number;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function boundsFor(items: readonly RecipeItem[], targetGrams: number): readonly Bound[] {
  const currentTotal = items.reduce((total, item) => total + item.grams, 0);
  const ceilingGrams = Math.max(targetGrams, currentTotal) * 1.5;
  // Uma linha que já estava zerada pode crescer do zero; as demais têm piso.
  return items.map((item) => ({
    min: item.grams > 0 ? item.grams * MIN_FACTOR : 0,
    max: item.grams > 0 ? Math.min(item.grams * MAX_FACTOR, ceilingGrams) : ceilingGrams,
  }));
}

/** Linhas livres: nem travadas pelo usuário, nem apontando para fora do catálogo. */
function knobsFor(input: BalanceInput, bounds: readonly Bound[]): readonly Knob[] {
  const knobs: Knob[] = [];

  input.items.forEach((item, index) => {
    const bound = bounds[index];
    // `bounds` tem exatamente o mesmo tamanho de `items`; o guarda existe só para
    // resolver o `T | undefined` do acesso indexado sem recorrer a `!`.
    if (!bound) return;
    if (input.fixedItemIds.has(item.id)) return;
    if (!input.catalog.has(item.ingredientId)) return;
    knobs.push({ index, bound });
  });

  return knobs;
}

/**
 * Custo de uma configuração: soma dos quadrados dos desvios de faixa
 * (normalizados pela largura) mais o desvio de massa total, ponderado.
 */
function penaltyFor(candidate: readonly number[], input: BalanceInput): number {
  const probe = input.items.map((item, index) => ({
    ...item,
    // Fallback inalcançável: `candidate` é sempre paralelo a `items`.
    grams: candidate[index] ?? item.grams,
  }));
  const result = calculateRecipe(probe, input.catalog, input.recipeType);
  let penalty = 0;

  for (const key of METRIC_KEYS) {
    const metric = result.metrics[key];
    const width = metric.range.max - metric.range.min;
    // Faixa de largura zero não serve como divisor; 1 mantém o desvio absoluto.
    const span = width || 1;
    const margin = width * SAFETY_MARGIN;
    const floor = metric.range.min + margin;
    const ceiling = metric.range.max - margin;
    if (metric.value < floor) {
      penalty += ((floor - metric.value) / span) ** 2;
    } else if (metric.value > ceiling) {
      penalty += ((metric.value - ceiling) / span) ** 2;
    }
  }

  const drift = (result.totalGrams - input.targetGrams) / (input.targetGrams || 1);
  return penalty + drift * drift * TOTAL_WEIGHT;
}

/**
 * Uma varredura por todas as linhas livres: para cada uma testa somar e subtrair
 * o passo e fica com o primeiro movimento que reduzir a penalidade.
 * Devolve a nova penalidade, ou `null` quando nenhuma linha melhorou.
 */
function sweep(
  grams: number[],
  knobs: readonly Knob[],
  step: number,
  best: number,
  penalty: PenaltyFn,
): number | null {
  let current = best;
  let improved = false;

  for (const { index, bound } of knobs) {
    // Fallback inalcançável: `knobs` só carrega índices válidos de `grams`.
    const before = grams[index] ?? 0;
    for (const delta of [step, -step]) {
      const next = clamp(before + delta, bound.min, bound.max);
      if (next === before) continue;
      grams[index] = next;
      const candidate = penalty(grams);
      if (candidate < current - 1e-12) {
        current = candidate;
        improved = true;
        break;
      }
      grams[index] = before;
    }
  }

  return improved ? current : null;
}

/**
 * Descida por coordenadas: varre as linhas com passos cada vez mais finos até
 * nenhuma varredura melhorar. Determinística de propósito — a mesma receita
 * sempre produz o mesmo resultado. Muta `grams` no lugar.
 */
function descend(
  grams: number[],
  knobs: readonly Knob[],
  targetGrams: number,
  penalty: PenaltyFn,
): void {
  let best = penalty(grams);
  if (knobs.length === 0 || best <= 0) return;

  for (const fraction of STEP_FRACTIONS) {
    const step = targetGrams * fraction;
    for (let pass = 0; pass < MAX_PASSES_PER_STEP; pass += 1) {
      const improved = sweep(grams, knobs, step, best, penalty);
      if (improved === null) break;
      best = improved;
      if (best === 0) break;
    }
    if (best === 0) break;
  }
}

/**
 * Ajusta as quantidades das linhas livres para trazer todas as métricas de volta
 * às faixas do tipo de receita, mantendo a massa total na meta do lote.
 *
 * Quando não dá para resolver mexendo só nas linhas livres, devolve `solved:
 * false` e a lista de métricas que continuaram fora, em vez de fingir sucesso.
 */
export function autoBalance(input: BalanceInput): BalanceOutcome {
  const { items, catalog, recipeType, targetGrams } = input;
  const bounds = boundsFor(items, targetGrams);
  const knobs = knobsFor(input, bounds);
  const grams = items.map((item) => item.grams);

  descend(grams, knobs, targetGrams, (candidate) => penaltyFor(candidate, input));

  const tuned = items.map((item, index) => ({
    ...item,
    grams: roundGrams(grams[index] ?? item.grams),
  }));

  const verdict = calculateRecipe(tuned, catalog, recipeType);
  const remaining = METRIC_KEYS.filter((key) => verdict.metrics[key].status !== 'ok');
  const changed = tuned.some((item, index) => item.grams !== items[index]?.grams);

  return { items: tuned, solved: remaining.length === 0, remaining, changed };
}
