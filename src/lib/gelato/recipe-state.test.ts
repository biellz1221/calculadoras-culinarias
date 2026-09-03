import { describe, expect, it } from 'vitest';

import { DEFAULT_DENSITY } from '@/lib/gelato/calc';
import {
  gelatoReducer,
  initialGelatoState,
  isOffTarget,
  targetGrams,
  totalGrams,
  type GelatoState,
} from '@/lib/gelato/recipe-state';

function state(): GelatoState {
  return initialGelatoState();
}

describe('estado da receita de gelato', () => {
  it('começa no primeiro preset, já ajustado a 1 L', () => {
    const initial = state();

    expect(initial.presetId).toBe('fior-di-latte');
    expect(initial.density).toBe(DEFAULT_DENSITY);
    expect(targetGrams(initial)).toBeCloseTo(1100, 6);
    expect(totalGrams(initial.items)).toBeCloseTo(1100, 1);
  });

  it('reescala a receita inteira ao mudar o lote, preservando proporções', () => {
    const initial = state();
    const before = initial.items.map((item) => item.grams / totalGrams(initial.items));

    const bigger = gelatoReducer(initial, { type: 'setBatchLiters', liters: 4 });
    const after = bigger.items.map((item) => item.grams / totalGrams(bigger.items));

    expect(totalGrams(bigger.items)).toBeCloseTo(4400, 0);
    after.forEach((share, index) => expect(share).toBeCloseTo(before[index] ?? 0, 4));
  });

  it('a densidade também reescala — é ela que vira litros em gramas', () => {
    const denser = gelatoReducer(state(), { type: 'setDensity', density: 1.2 });

    expect(denser.density).toBe(1.2);
    expect(totalGrams(denser.items)).toBeCloseTo(1200, 0);
  });

  it('limita lote e densidade a valores utilizáveis', () => {
    expect(gelatoReducer(state(), { type: 'setBatchLiters', liters: 999 }).batchLiters).toBe(20);
    expect(gelatoReducer(state(), { type: 'setDensity', density: 0 }).density).toBe(0.8);
    expect(
      gelatoReducer(state(), { type: 'setDensity', density: Number.NaN }).density,
    ).toBe(0.8);
  });

  it('soma na linha existente em vez de duplicar o ingrediente', () => {
    const withSugar = gelatoReducer(state(), {
      type: 'addIngredient',
      ingredientId: 'acucar-sacarose',
      grams: 50,
    });

    const rows = withSugar.items.filter((item) => item.ingredientId === 'acucar-sacarose');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.grams).toBeCloseTo((state().items[3]?.grams ?? 0) + 50, 1);
  });

  it('usa o id do ingrediente como id da linha — estado determinístico', () => {
    const initial = state();
    expect(initial.items.every((item) => item.id === item.ingredientId)).toBe(true);
  });

  it('acusa desvio do lote depois de uma edição manual e o corrige', () => {
    const initial = state();
    const edited = gelatoReducer(initial, {
      type: 'setGrams',
      itemId: 'leite-integral',
      grams: 100,
    });

    expect(isOffTarget(edited)).toBe(true);
    expect(isOffTarget(gelatoReducer(edited, { type: 'scaleToBatch' }))).toBe(false);
  });

  it('não aceita gramas negativos', () => {
    const edited = gelatoReducer(state(), {
      type: 'setGrams',
      itemId: 'leite-integral',
      grams: -50,
    });

    expect(edited.items.find((item) => item.id === 'leite-integral')?.grams).toBe(0);
  });

  it('trocar de preset mantém o lote e a densidade escolhidos', () => {
    const bigger = gelatoReducer(state(), { type: 'setBatchLiters', liters: 3 });
    const sorbet = gelatoReducer(bigger, { type: 'loadPreset', presetId: 'sorbet-morango' });

    expect(sorbet.recipeTypeId).toBe('sorbet');
    expect(sorbet.batchLiters).toBe(3);
    expect(totalGrams(sorbet.items)).toBeCloseTo(3300, 0);
  });

  it('ignora preset desconhecido', () => {
    const initial = state();
    expect(gelatoReducer(initial, { type: 'loadPreset', presetId: 'nao-existe' })).toBe(initial);
  });
});
