'use client';

import { useMemo, useReducer, useState } from 'react';

import { CATALOG, ingredientLabelOrFallback } from './catalog';
import { getRecipeType } from '@/data/gelato/recipe-types';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import { autoBalance, type BalanceOutcome } from '@/lib/gelato/balance';
import { calculateRecipe } from '@/lib/gelato/calc';
import { flawsInRecipe } from '@/lib/gelato/composition';
import { calculateNutrition } from '@/lib/gelato/nutrition';
import {
  gelatoReducer,
  initialGelatoState,
  targetGrams,
  type GelatoAction,
} from '@/lib/gelato/recipe-state';

/**
 * Mensagem honesta do otimizador: quando ele não resolve, diz quantas e quais
 * métricas continuaram fora, em vez de anunciar sucesso.
 */
function balanceMessage(
  outcome: BalanceOutcome,
  dict: GelatoDictionary,
  keptLabel: string | null,
): string {
  if (!outcome.changed) return dict.balance.unchanged;

  const kept = keptLabel ? `${dict.balance.keptFixed} ${keptLabel}. ` : '';
  if (outcome.solved) return `${kept}${dict.balance.solved}`;

  const remaining = outcome.remaining.map((key) => dict.metrics[key].label).join(', ');
  return `${kept}${dict.balance.partial} ${remaining}.`;
}

/** Estado da receita, cálculos derivados e as ações que a interface despacha. */
export function useGelatoRecipe(dict: GelatoDictionary) {
  const [state, dispatch] = useReducer(gelatoReducer, undefined, initialGelatoState);
  const [lastEditedItemId, setLastEditedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const recipeType = getRecipeType(state.recipeTypeId);
  const result = useMemo(
    () => calculateRecipe(state.items, CATALOG, recipeType),
    [state.items, recipeType],
  );
  const nutrition = useMemo(() => calculateNutrition(state.items, CATALOG), [state.items]);
  const flaws = useMemo(() => flawsInRecipe(state.items, CATALOG), [state.items]);

  /** Qualquer mudança invalida o veredito anterior do otimizador. */
  function run(action: GelatoAction) {
    setMessage(null);
    if (action.type === 'setGrams') setLastEditedItemId(action.itemId);
    dispatch(action);
  }

  function balanceNow() {
    const editedItem = state.items.find((item) => item.id === lastEditedItemId);
    const outcome = autoBalance({
      items: state.items,
      catalog: CATALOG,
      recipeType,
      // Mantém fixa a linha que a pessoa acabou de ajustar: é a intenção dela.
      fixedItemIds: new Set(editedItem ? [editedItem.id] : []),
      targetGrams: targetGrams(state),
    });

    const keptLabel = editedItem
      ? ingredientLabelOrFallback(dict, editedItem.ingredientId)
      : null;
    setMessage(balanceMessage(outcome, dict, keptLabel));

    if (!outcome.changed) return;
    dispatch({ type: 'setItems', items: outcome.items });
    setLastEditedItemId(null);
  }

  return { state, recipeType, result, nutrition, flaws, message, run, balanceNow };
}
