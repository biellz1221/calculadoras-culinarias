/**
 * Tipos do motor de balanceamento de gelato.
 *
 * O estado é sempre em gramas: os coeficientes da planilha de origem são frações
 * de 1 g e o motor nunca vê outra unidade. Formatação por idioma é problema da UI.
 */

/**
 * Categorias usadas apenas para agrupar o seletor de ingredientes.
 *
 * Os valores são os slugs da planilha de origem — são dados, não texto de
 * interface. O rótulo exibido vem do dicionário de idioma.
 */
export type IngredientCategory =
  | 'acucar'
  | 'laticinio'
  | 'fruta'
  | 'chocolate'
  | 'pasta'
  | 'vegetal'
  | 'estabilizante'
  | 'alcool'
  | 'aroma'
  | 'confeitaria'
  | 'base'
  | 'liquido';

/**
 * Composição de 1 g do ingrediente, em frações de 0 a 1.
 * `pod` e `pac` são coeficientes relativos à sacarose (sacarose = 1).
 */
export interface Ingredient {
  readonly id: string;
  readonly name: string;
  readonly category: IngredientCategory;
  readonly sugars: number;
  readonly fats: number;
  readonly msnf: number;
  readonly otherSolids: number;
  readonly totalSolids: number;
  readonly water: number;
  readonly pod: number;
  readonly pac: number;
  readonly protein: number;
  /** R$ por kg. 0 = sem custo cadastrado. */
  readonly costPerKg: number;
  readonly note?: string;
  /** true para ingredientes criados pelo usuário (não vêm da planilha). */
  readonly custom?: boolean;
}

/** Uma linha da receita: ingrediente + quantidade em gramas. */
export interface RecipeItem {
  readonly id: string;
  readonly ingredientId: string;
  readonly grams: number;
}

/** Métricas balanceáveis, na mesma ordem em que aparecem na planilha. */
export type MetricKey =
  | 'sugars'
  | 'fats'
  | 'msnf'
  | 'otherSolids'
  | 'totalSolids'
  | 'water'
  | 'pod'
  | 'pac';

/**
 * Faixa mínimo/máximo de uma métrica para um tipo de receita.
 *
 * Chama-se `MetricRange` e não `Range` porque `Range` é uma interface global do
 * DOM: o nome curto compila, mas confunde quem importa o tipo.
 */
export interface MetricRange {
  readonly min: number;
  readonly max: number;
}

export interface RecipeType {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly ranges: Readonly<Record<MetricKey, MetricRange>>;
}

/** Posição da métrica frente à faixa do tipo de base. */
export type MetricStatus = 'low' | 'ok' | 'high';

export interface MetricResult {
  readonly key: MetricKey;
  /** Massa em gramas na batida (para POD/PAC não se aplica: fica igual a `value`). */
  readonly grams: number;
  /** Fração de 0 a 1 para sólidos/água; valor absoluto por kg para POD/PAC. */
  readonly value: number;
  readonly range: MetricRange;
  readonly status: MetricStatus;
}

export interface RowResult {
  readonly itemId: string;
  readonly ingredientId: string;
  readonly grams: number;
  readonly percentOfBatch: number;
  readonly contributions: Readonly<Record<MetricKey, number>>;
  readonly cost: number;
  readonly costShare: number;
}

export interface RecipeResult {
  readonly totalGrams: number;
  readonly metrics: Readonly<Record<MetricKey, MetricResult>>;
  readonly proteinGrams: number;
  readonly proteinPercent: number;
  readonly totalCost: number;
  readonly costPerKg: number;
  /** Temperatura média de serviço em °C (negativa). PAC / 25. */
  readonly servingTemp: number;
  readonly isBalanced: boolean;
  /** Contribuição de cada linha, na mesma ordem dos itens recebidos. */
  readonly rows: readonly RowResult[];
}
