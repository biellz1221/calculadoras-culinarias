'use client';

import { useMemo } from 'react';

import { BalancePanel } from './balance-panel';
import { BatchControl } from './batch-control';
import { buildOptions } from './catalog';
import { FlawNotice } from './flaw-notice';
import { IngredientPicker } from './ingredient-picker';
import { NutritionPanel } from './nutrition-panel';
import { RecipeTable } from './recipe-table';
import { useGelatoRecipe } from './use-gelato-recipe';
import { Segmented } from '@/components/field';
import { PRESETS } from '@/data/gelato/presets';
import { RECIPE_TYPES } from '@/data/gelato/recipe-types';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';
import { massUnitForBatch } from '@/lib/gelato/mass';
import { DEFAULT_ADD_GRAMS, targetGrams, totalGrams } from '@/lib/gelato/recipe-state';

interface GelatoCalculatorProps {
  dict: GelatoDictionary;
  locale: Locale;
}

export function GelatoCalculator({ dict, locale }: GelatoCalculatorProps) {
  const recipe = useGelatoRecipe(dict);
  const { state, result } = recipe;
  const options = useMemo(() => buildOptions(dict, locale), [dict, locale]);
  const flaggedIds = new Set(recipe.flaws.map((flaw) => flaw.ingredientId));

  // Lotes grandes viram números de quatro dígitos em gramas; acima de 2 L, kg.
  const unit = massUnitForBatch(state.batchLiters);

  return (
    <div className="mt-10">
      <Choosers dict={dict} recipe={recipe} />

      <BatchControl
        dict={dict}
        locale={locale}
        liters={state.batchLiters}
        density={state.density}
        unit={unit}
        targetGrams={targetGrams(state)}
        currentGrams={totalGrams(state.items)}
        onLitersChange={(liters) => recipe.run({ type: 'setBatchLiters', liters })}
        onDensityChange={(density) => recipe.run({ type: 'setDensity', density })}
        onScaleToBatch={() => recipe.run({ type: 'scaleToBatch' })}
      />

      <IngredientPicker
        options={options}
        dict={dict}
        onSelect={(ingredientId) =>
          recipe.run({ type: 'addIngredient', ingredientId, grams: DEFAULT_ADD_GRAMS })
        }
      />

      <RecipeTable
        result={result}
        dict={dict}
        locale={locale}
        unit={unit}
        flaggedIds={flaggedIds}
        onGramsChange={(itemId, grams) => recipe.run({ type: 'setGrams', itemId, grams })}
        onRemove={(itemId) => recipe.run({ type: 'removeItem', itemId })}
      />

      <FlawNotice flaws={recipe.flaws} dict={dict} />

      <BalancePanel
        result={result}
        dict={dict}
        locale={locale}
        unit={unit}
        message={recipe.message}
        onAutoBalance={recipe.balanceNow}
      />

      <NutritionPanel
        nutrition={recipe.nutrition}
        dict={dict}
        locale={locale}
        unit={unit}
      />
    </div>
  );
}

/** Receita de partida e tipo de base — as duas escolhas que enquadram o resto. */
function Choosers({
  dict,
  recipe,
}: {
  dict: GelatoDictionary;
  recipe: ReturnType<typeof useGelatoRecipe>;
}) {
  const { state, recipeType } = recipe;

  return (
    <>
      <Segmented
        legend={dict.presetLabel}
        value={state.presetId}
        onChange={(presetId) => recipe.run({ type: 'loadPreset', presetId })}
        emphasis
        options={PRESETS.map((preset) => ({
          value: preset.id,
          label: dict.presets[preset.id as keyof GelatoDictionary['presets']],
        }))}
      />

      <div className="mt-8">
        <Segmented
          legend={dict.baseLabel}
          value={state.recipeTypeId}
          onChange={(recipeTypeId) => recipe.run({ type: 'setRecipeType', recipeTypeId })}
          options={RECIPE_TYPES.map((type) => ({
            value: type.id,
            label: dict.bases[type.id as keyof GelatoDictionary['bases']].name,
          }))}
        />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          {dict.bases[recipeType.id as keyof GelatoDictionary['bases']].description}
        </p>
      </div>
    </>
  );
}
