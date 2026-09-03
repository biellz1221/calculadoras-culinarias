/**
 * Estado da receita de gelato. Puro e sempre em gramas — a interface só despacha
 * ações e formata o que sai daqui.
 *
 * O `id` da linha é o próprio `ingredientId`: acrescentar um ingrediente que já
 * está na receita soma na linha existente em vez de duplicar, então o par é
 * único por construção. Isso mantém o estado determinístico, o que importa num
 * site estático — id sorteado no servidor e outro no cliente quebraria a
 * hidratação.
 */

import { DEFAULT_DENSITY, litersToGrams, roundGrams, scaleToTarget } from './calc';
import type { RecipeItem } from './types';
import { PRESETS, type Preset } from '@/data/gelato/presets';
import { DEFAULT_RECIPE_TYPE_ID } from '@/data/gelato/recipe-types';

export interface GelatoState {
  readonly presetId: string;
  readonly recipeTypeId: string;
  readonly items: readonly RecipeItem[];
  readonly batchLiters: number;
  readonly density: number;
}

export type GelatoAction =
  | { type: 'loadPreset'; presetId: string }
  | { type: 'setRecipeType'; recipeTypeId: string }
  | { type: 'setBatchLiters'; liters: number }
  | { type: 'setDensity'; density: number }
  | { type: 'addIngredient'; ingredientId: string; grams: number }
  | { type: 'setGrams'; itemId: string; grams: number }
  | { type: 'removeItem'; itemId: string }
  | { type: 'setItems'; items: readonly RecipeItem[] }
  | { type: 'scaleToBatch' };

export const MIN_LITERS = 0.25;
export const MAX_LITERS = 20;
export const MIN_DENSITY = 0.8;
export const MAX_DENSITY = 1.4;

/** Quantidade inicial de uma linha nova — quem monta a receita ajusta depois. */
export const DEFAULT_ADD_GRAMS = 100;

export function targetGrams(state: GelatoState): number {
  return litersToGrams(state.batchLiters, state.density);
}

export function totalGrams(items: readonly RecipeItem[]): number {
  return items.reduce((sum, item) => sum + item.grams, 0);
}

/**
 * Diferença entre a receita e a meta do lote, com tolerância relativa: alguns
 * gramas em 4 kg são ruído de arredondamento, não desvio.
 */
export function isOffTarget(state: GelatoState): boolean {
  const target = targetGrams(state);
  const tolerance = Math.max(0.5, target * 0.001);
  return Math.abs(totalGrams(state.items) - target) > tolerance;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function fromPreset(preset: Preset, batchLiters: number, density: number): GelatoState {
  const items = preset.items.map((item) => ({
    id: item.ingredientId,
    ingredientId: item.ingredientId,
    grams: item.grams,
  }));

  return {
    presetId: preset.id,
    recipeTypeId: preset.recipeTypeId,
    items: scaleToTarget(items, litersToGrams(batchLiters, density)),
    batchLiters,
    density,
  };
}

export function initialGelatoState(): GelatoState {
  const first = PRESETS[0];
  if (!first) {
    return {
      presetId: '',
      recipeTypeId: DEFAULT_RECIPE_TYPE_ID,
      items: [],
      batchLiters: 1,
      density: DEFAULT_DENSITY,
    };
  }
  return fromPreset(first, 1, DEFAULT_DENSITY);
}

/** Acrescentar ingrediente repetido soma na linha que já existe. */
function addIngredient(
  state: GelatoState,
  ingredientId: string,
  grams: number,
): GelatoState {
  const existing = state.items.find((item) => item.ingredientId === ingredientId);

  if (existing) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.id === existing.id
          ? { ...item, grams: roundGrams(item.grams + grams) }
          : item,
      ),
    };
  }

  return {
    ...state,
    items: [...state.items, { id: ingredientId, ingredientId, grams }],
  };
}

/** O controle de lote é o botão de escala: mexer nele reescala a receita inteira. */
function rescale(state: GelatoState, liters: number, density: number): GelatoState {
  return {
    ...state,
    batchLiters: liters,
    density,
    items: scaleToTarget(state.items, litersToGrams(liters, density)),
  };
}

export function gelatoReducer(state: GelatoState, action: GelatoAction): GelatoState {
  switch (action.type) {
    case 'loadPreset': {
      const preset = PRESETS.find((item) => item.id === action.presetId);
      if (!preset) return state;
      return fromPreset(preset, state.batchLiters, state.density);
    }

    case 'setRecipeType':
      return { ...state, recipeTypeId: action.recipeTypeId };

    case 'setBatchLiters':
      return rescale(state, clamp(action.liters, MIN_LITERS, MAX_LITERS), state.density);

    case 'setDensity':
      return rescale(
        state,
        state.batchLiters,
        clamp(action.density, MIN_DENSITY, MAX_DENSITY),
      );

    case 'addIngredient':
      return addIngredient(state, action.ingredientId, action.grams);

    case 'setGrams':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId
            ? { ...item, grams: Math.max(0, action.grams) }
            : item,
        ),
      };

    case 'removeItem':
      return { ...state, items: state.items.filter((item) => item.id !== action.itemId) };

    case 'setItems':
      return { ...state, items: action.items };

    case 'scaleToBatch':
      return { ...state, items: scaleToTarget(state.items, targetGrams(state)) };

    default:
      return state;
  }
}
