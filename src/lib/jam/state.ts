import { DEFAULT_FRUIT_ID, getFruit } from '@/data/jam/fruits';
import { MAX_ALTITUDE_METERS } from '@/data/jam/setting-point';
import type { SugarLevel } from '@/data/jam/types';

/** Estado da calculadora de geleias, num objeto só, como as outras cinco. */

export interface JamState {
  readonly fruitId: string;
  readonly fruitGrams: number;
  readonly sugarLevel: SugarLevel;
  /** Só vale quando `sugarLevel` é `custom`; guardado sempre para o slider. */
  readonly customSugarRatio: number;
  readonly altitudeMeters: number;
}

const SUGAR_LEVELS: Record<SugarLevel, true> = {
  source: true,
  ferber: true,
  extra: true,
  common: true,
  custom: true,
};

/**
 * Os níveis que valem para qualquer fruta.
 *
 * `source` é o único que depende da fruta escolhida: ele significa "a proporção
 * da receita publicada", e goiaba não tem receita publicada em lugar nenhum.
 */
export function sugarLevelsFor(fruitId: string): readonly SugarLevel[] {
  const hasRecipe = Boolean(getFruit(fruitId)?.recipe);
  return hasRecipe
    ? ['source', 'ferber', 'extra', 'common', 'custom']
    : ['extra', 'common', 'ferber', 'custom'];
}

/**
 * O nível a manter ao trocar de fruta.
 *
 * Quem estava em "a da receita" e troca para goiaba não pode continuar em
 * "a da receita" — não existe. Cai na geleia extra da norma, que é a régua que
 * passa a valer para aquela fruta, e não num silêncio.
 */
export function levelForFruit(fruitId: string, level: SugarLevel): SugarLevel {
  return sugarLevelsFor(fruitId).includes(level) ? level : 'extra';
}

/**
 * O padrão abre no nível do mar, e não numa cidade nossa.
 *
 * Zero é o único valor que não afirma nada sobre onde a pessoa está, e é o
 * valor em que a calculadora reproduz os números que os dois livros publicam —
 * 220 °F e 105 °C. A página pede a altitude logo no primeiro campo.
 */
export const DEFAULT_ALTITUDE_METERS = 0;

/** Teto de açúcar aceito: o dobro do peso da fruta já é calda, não geleia. */
export const MAX_SUGAR_RATIO = 2;

export function initialJamState(): JamState {
  return {
    fruitId: DEFAULT_FRUIT_ID,
    fruitGrams: 1000,
    sugarLevel: 'source',
    customSugarRatio: 0.6,
    altitudeMeters: DEFAULT_ALTITUDE_METERS,
  };
}

function finiteNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

/**
 * Valida estado vindo de link ou de receita guardada.
 *
 * Entrada não confiável: o id da fruta é conferido contra o catálogo (chave de
 * fora num objeto comum devolve `Object.prototype`, não `undefined`), o nível
 * de açúcar contra o registro, e os números contra faixa. Estado ruim é
 * recusado inteiro — meia receita na tela é pior que nenhuma.
 */
export function parseJamState(value: unknown): JamState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (typeof record.fruitId !== 'string' || !getFruit(record.fruitId)) return null;
  if (
    typeof record.sugarLevel !== 'string' ||
    !Object.hasOwn(SUGAR_LEVELS, record.sugarLevel)
  ) {
    return null;
  }
  // Combinação impossível vinda de link: `source` numa fruta sem receita. É
  // recusa, e não conserto silencioso — quem abre o link tem de ver o que o
  // link diz ou nada.
  if (!sugarLevelsFor(record.fruitId).includes(record.sugarLevel as SugarLevel)) {
    return null;
  }

  const fruitGrams = finiteNumber(record.fruitGrams, 0, 1e7);
  const customSugarRatio = finiteNumber(record.customSugarRatio, 0, MAX_SUGAR_RATIO);
  const altitudeMeters = finiteNumber(record.altitudeMeters, 0, MAX_ALTITUDE_METERS);
  if (fruitGrams === null || customSugarRatio === null || altitudeMeters === null) {
    return null;
  }

  return {
    fruitId: record.fruitId,
    fruitGrams,
    sugarLevel: record.sugarLevel as SugarLevel,
    customSugarRatio,
    altitudeMeters,
  };
}

export const JAM_SNAPSHOT = {
  baselineFor: (fruitId: string): JamState | null =>
    getFruit(fruitId) ? { ...initialJamState(), fruitId } : null,
  presetOf: (state: JamState): string => state.fruitId,
  parse: parseJamState,
};
