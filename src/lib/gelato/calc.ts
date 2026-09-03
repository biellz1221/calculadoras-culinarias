import type {
  Ingredient,
  MetricKey,
  MetricRange,
  MetricResult,
  MetricStatus,
  RecipeItem,
  RecipeResult,
  RecipeType,
  RowResult,
} from './types';

/** Ordem canônica das métricas — igual à da planilha. */
export const METRIC_KEYS: readonly MetricKey[] = [
  'sugars',
  'fats',
  'msnf',
  'otherSolids',
  'totalSolids',
  'water',
  'pod',
  'pac',
];

/**
 * POD e PAC são normalizados por kg de mistura (planilha: 1000 * soma / total).
 * As demais métricas são frações da massa total.
 */
const PER_KG_METRICS: ReadonlySet<MetricKey> = new Set<MetricKey>(['pod', 'pac']);

export function isPerKgMetric(key: MetricKey): boolean {
  return PER_KG_METRICS.has(key);
}

/** Densidade padrão da calda de gelato, em g/mL. Usada para converter litros em gramas. */
export const DEFAULT_DENSITY = 1.1;

export function litersToGrams(liters: number, density = DEFAULT_DENSITY): number {
  return liters * 1000 * density;
}

export function gramsToLiters(grams: number, density = DEFAULT_DENSITY): number {
  return grams / (1000 * density);
}

/** Arredonda para 0,1 g — a menor unidade prática numa balança de bancada. */
export function roundGrams(grams: number): number {
  return Math.round(grams * 10) / 10;
}

function statusFor(value: number, range: MetricRange): MetricStatus {
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'ok';
}

function emptyContributions(): Record<MetricKey, number> {
  return { sugars: 0, fats: 0, msnf: 0, otherSolids: 0, totalSolids: 0, water: 0, pod: 0, pac: 0 };
}

function contributionsFor(ingredient: Ingredient, grams: number): Record<MetricKey, number> {
  return {
    sugars: grams * ingredient.sugars,
    fats: grams * ingredient.fats,
    msnf: grams * ingredient.msnf,
    otherSolids: grams * ingredient.otherSolids,
    totalSolids: grams * ingredient.totalSolids,
    water: grams * ingredient.water,
    pod: grams * ingredient.pod,
    pac: grams * ingredient.pac,
  };
}

interface Accumulated {
  readonly totals: Readonly<Record<MetricKey, number>>;
  readonly rows: readonly RowResult[];
  readonly totalGrams: number;
  readonly totalCost: number;
  readonly proteinGrams: number;
}

/** Soma linha a linha: cada linha contribui `gramas * coeficiente` para cada métrica. */
function accumulate(
  items: readonly RecipeItem[],
  catalog: ReadonlyMap<string, Ingredient>,
): Accumulated {
  const totals = emptyContributions();
  const rows: RowResult[] = [];
  let totalGrams = 0;
  let totalCost = 0;
  let proteinGrams = 0;

  for (const item of items) {
    const grams = Number.isFinite(item.grams) ? item.grams : 0;
    const ingredient = catalog.get(item.ingredientId);
    // Ingrediente fora do catálogo vira linha neutra: soma massa, não soma
    // composição nem custo. É o equivalente ao IFERROR da planilha.
    const contributions = ingredient ? contributionsFor(ingredient, grams) : emptyContributions();
    const cost = ingredient ? (grams * ingredient.costPerKg) / 1000 : 0;

    totalGrams += grams;
    totalCost += cost;
    proteinGrams += ingredient ? grams * ingredient.protein : 0;
    for (const key of METRIC_KEYS) totals[key] += contributions[key];

    rows.push({
      itemId: item.id,
      ingredientId: item.ingredientId,
      grams,
      // Participações só fazem sentido depois de conhecer os totais.
      percentOfBatch: 0,
      contributions,
      cost,
      costShare: 0,
    });
  }

  return { totals, rows, totalGrams, totalCost, proteinGrams };
}

function buildMetrics(
  totals: Readonly<Record<MetricKey, number>>,
  totalGrams: number,
  recipeType: RecipeType,
): Record<MetricKey, MetricResult> {
  const safeTotal = totalGrams > 0 ? totalGrams : 1;

  const build = (key: MetricKey): MetricResult => {
    const range = recipeType.ranges[key];
    const grams = totals[key];
    const value = isPerKgMetric(key) ? (1000 * grams) / safeTotal : grams / safeTotal;
    return {
      key,
      grams,
      value,
      range,
      // Receita vazia não está "na faixa": fica marcada como abaixo do mínimo.
      status: totalGrams > 0 ? statusFor(value, range) : 'low',
    };
  };

  // Objeto montado campo a campo em vez de acumulado num `{} as Record<...>`:
  // sem asserção, o compilador garante que nenhuma métrica ficou de fora.
  return {
    sugars: build('sugars'),
    fats: build('fats'),
    msnf: build('msnf'),
    otherSolids: build('otherSolids'),
    totalSolids: build('totalSolids'),
    water: build('water'),
    pod: build('pod'),
    pac: build('pac'),
  };
}

/**
 * Calcula a receita inteira replicando o modelo da planilha:
 * cada linha contribui `gramas * coeficiente do ingrediente` para cada métrica.
 */
export function calculateRecipe(
  items: readonly RecipeItem[],
  catalog: ReadonlyMap<string, Ingredient>,
  recipeType: RecipeType,
): RecipeResult {
  const { totals, rows, totalGrams, totalCost, proteinGrams } = accumulate(items, catalog);
  const safeTotal = totalGrams > 0 ? totalGrams : 1;
  const metrics = buildMetrics(totals, totalGrams, recipeType);

  return {
    totalGrams,
    metrics,
    proteinGrams,
    proteinPercent: proteinGrams / safeTotal,
    totalCost,
    costPerKg: (1000 * totalCost) / safeTotal,
    servingTemp: -(metrics.pac.value / 25),
    isBalanced: totalGrams > 0 && METRIC_KEYS.every((key) => metrics[key].status === 'ok'),
    rows: rows.map((row) => ({
      ...row,
      percentOfBatch: row.grams / safeTotal,
      costShare: totalCost > 0 ? row.cost / totalCost : 0,
    })),
  };
}

/**
 * Reescala todas as linhas proporcionalmente para atingir `targetGrams`,
 * preservando as proporções da receita. Retorna os itens inalterados se não houver massa.
 */
export function scaleToTarget(
  items: readonly RecipeItem[],
  targetGrams: number,
): readonly RecipeItem[] {
  const current = items.reduce((sum, item) => sum + item.grams, 0);
  if (current <= 0 || targetGrams <= 0) return items;
  const factor = targetGrams / current;
  return items.map((item) => ({ ...item, grams: roundGrams(item.grams * factor) }));
}
