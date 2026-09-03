import type { Citation } from '../citations';

/**
 * Modelo da calculadora de picles e fermentação.
 *
 * São três contas diferentes debaixo do mesmo teto, e a diferença entre elas é
 * a **base de cálculo** do sal:
 *
 * - `brine` — vegetais submersos em salmoura. O sal é calculado sobre o peso
 *   total do pote (vegetais + água), método Noma/BWF, ou sobre a água apenas,
 *   método Katz. Ver docs/research/picles-fermentacao.md §3.1.
 * - `dry-salt` — salga direta do vegetal picado (chucrute, kimchi). O sal é
 *   sobre o peso do vegetal e a salmoura sai do próprio vegetal.
 * - `vinegar` — picles de vinagre, que não fermenta: conserva por acidez
 *   adicionada.
 *
 * Convenção de porcentagem em toda a calculadora: o sal é % **da base**, não do
 * conjunto base + sal — a "porcentagem do padeiro" do Noma ("Primer", "Salt and
 * Baker's Percentages") e o *salting* do BWF (p. 198) coincidem nisso.
 */

export type PickleMode = 'brine' | 'dry-salt' | 'vinegar';

/** Sobre o que a porcentagem de sal da salmoura é calculada. */
export type SaltBasis = 'total' | 'water';

export type PickleRangeKey =
  | 'brine-total'
  | 'brine-water'
  | 'dry-salt'
  | 'salt-preserve'
  | 'vinegar-acidity'
  | 'quick-salt'
  | 'quick-sugar';

/** Os dois regimes de temperatura em que as fontes trabalham. */
export type ClimateKey = 'fast' | 'slow';

/**
 * Como a pessoa informa o tamanho do lote na salmoura: pesando vegetais e água
 * separadamente, ou partindo do volume do pote com uma proporção estimada.
 */
export type BrineInput =
  | { kind: 'weights'; vegetableGrams: number; waterGrams: number }
  | { kind: 'jar'; jarMilliliters: number; vegetableShare: number };

export interface BrineParams {
  input: BrineInput;
  saltPercent: number;
  basis: SaltBasis;
}

export interface BrineResult {
  vegetableGrams: number;
  waterGrams: number;
  /** Vegetais + água. O sal não entra aqui (porcentagem do padeiro). */
  totalGrams: number;
  saltGrams: number;
  /** Salinidade efetiva sobre o peso total — a que o produto tende no equilíbrio. */
  percentOfTotal: number;
  /** Salinidade efetiva sobre a água — a concentração inicial da salmoura. */
  percentOfWater: number;
  basis: SaltBasis;
}

export interface DrySaltResult {
  vegetableGrams: number;
  saltGrams: number;
  percentOfVegetable: number;
}

export interface VinegarParams {
  /** Líquido de cobertura total, em gramas (1 ml ≈ 1 g). */
  liquidGrams: number;
  /** Acidez declarada no rótulo do vinagre, em % de ácido acético. */
  vinegarAcidity: number;
  vinegarParts: number;
  waterParts: number;
  /** Sal e açúcar em % sobre o líquido de cobertura. */
  saltPercent: number;
  sugarPercent: number;
}

/**
 * `below-minimum` — a diluição escolhida derruba a acidez abaixo do piso.
 * `unusable-vinegar` — nem o vinagre puro alcança o piso; não há proporção que
 * resolva.
 */
export type VinegarStatus = 'ok' | 'below-minimum' | 'unusable-vinegar';

export interface VinegarResult {
  vinegarGrams: number;
  waterGrams: number;
  saltGrams: number;
  sugarGrams: number;
  /** Fração do líquido que é vinagre. */
  vinegarShare: number;
  /** Acidez do líquido de cobertura pronto, em % de ácido acético. */
  brineAcidity: number;
  /** Fração mínima de vinagre no líquido para alcançar o piso de acidez. */
  minimumVinegarShare: number;
  /** Partes de água por parte de vinagre na proporção mínima. */
  minimumWaterPerVinegar?: number;
  status: VinegarStatus;
}

interface PresetBase {
  id: string;
  /** Janela publicada na fonte, em dias. */
  days: readonly [number, number];
  citations: readonly Citation[];
}

interface FermentedPreset extends PresetBase {
  climate: ClimateKey;
  saltPercent: number;
  rangeKey: PickleRangeKey;
}

export interface BrinePreset extends FermentedPreset {
  mode: 'brine';
  basis: SaltBasis;
  /** Proporção vegetal/pote sugerida pela fonte, de 0 a 1. */
  vegetableShare: number;
}

export interface DrySaltPreset extends FermentedPreset {
  mode: 'dry-salt';
}

/** Picles de vinagre não fermenta: a janela em dias é de descanso na geladeira. */
export interface VinegarPreset extends PresetBase {
  mode: 'vinegar';
  vinegarParts: number;
  waterParts: number;
  acidity: number;
  saltPercent: number;
  sugarPercent: number;
}

export type PicklePreset = BrinePreset | DrySaltPreset | VinegarPreset;

export function isBrinePreset(preset: PicklePreset): preset is BrinePreset {
  return preset.mode === 'brine';
}

export function isDrySaltPreset(preset: PicklePreset): preset is DrySaltPreset {
  return preset.mode === 'dry-salt';
}

export function isVinegarPreset(preset: PicklePreset): preset is VinegarPreset {
  return preset.mode === 'vinegar';
}
