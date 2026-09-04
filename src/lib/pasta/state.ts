import { getPastaPreset } from '@/data/pasta/presets';
import { SERVING_GRAMS } from '@/data/pasta/ranges';
import {
  REFERENCE_EGG_GRAMS,
  REFERENCE_YOLK_GRAMS,
  SERVING_STYLES,
  type PastaTarget,
  type ServingStyle,
} from '@/data/pasta/types';

/**
 * Estado da calculadora de massa fresca, num objeto só — mesmo motivo do pão:
 * salvar, compartilhar e imprimir precisam da receita inteira de uma vez.
 */

export interface PastaState {
  readonly presetId: string;
  readonly servings: number;
  readonly style: ServingStyle;
  readonly gramsPerServing: number;
  readonly eggGrams: number;
  readonly yolkGrams: number;
}

export function initialPastaState(presetId: string): PastaState {
  return {
    presetId,
    servings: 4,
    style: 'main',
    gramsPerServing: SERVING_GRAMS.main,
    eggGrams: REFERENCE_EGG_GRAMS,
    yolkGrams: REFERENCE_YOLK_GRAMS,
  };
}

export function pastaTarget(state: PastaState): PastaTarget {
  return {
    servings: state.servings,
    gramsPerServing: state.gramsPerServing,
    eggGrams: state.eggGrams,
    yolkGrams: state.yolkGrams,
  };
}

/**
 * Trocar o contexto da refeição preenche os gramas por pessoa, mas não prende:
 * o campo continua editável para quem sabe o tamanho da própria porção.
 */
export function chooseStyle(state: PastaState, style: ServingStyle): PastaState {
  return { ...state, style, gramsPerServing: SERVING_GRAMS[style] };
}

function finiteNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;

  return value;
}

/** Valida estado vindo de link compartilhado ou de receita guardada. */
export function parsePastaState(value: unknown): PastaState | null {
  if (typeof value !== 'object' || value === null) return null;

  const record = value as Record<string, unknown>;

  if (typeof record.presetId !== 'string' || !getPastaPreset(record.presetId)) {
    return null;
  }
  if (!SERVING_STYLES.includes(record.style as ServingStyle)) return null;

  // Um ovo de 0 g faria a escala dividir por zero; 10 000 porções travariam a
  // busca de combinação inteira de ovos. Os limites são generosos e finitos.
  const servings = finiteNumber(record.servings, 1, 1000);
  const gramsPerServing = finiteNumber(record.gramsPerServing, 1, 5000);
  const eggGrams = finiteNumber(record.eggGrams, 1, 500);
  const yolkGrams = finiteNumber(record.yolkGrams, 1, 500);

  if (
    servings === null ||
    gramsPerServing === null ||
    eggGrams === null ||
    yolkGrams === null
  ) {
    return null;
  }

  return {
    presetId: record.presetId,
    servings,
    style: record.style as ServingStyle,
    gramsPerServing,
    eggGrams,
    yolkGrams,
  };
}
