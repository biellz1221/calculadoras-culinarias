import { ingredientLabelOrFallback } from './catalog';
import { citationSummary } from '@/components/citation';
import { GELATO_CITATIONS } from '@/data/gelato/source';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';
import { METRIC_KEYS, isPerKgMetric } from '@/lib/gelato/calc';
import {
  formatLiters,
  formatMass,
  formatTemperature,
  type MassUnit,
} from '@/lib/gelato/mass';
import type { GelatoState } from '@/lib/gelato/recipe-state';
import type { RecipeResult, RecipeType } from '@/lib/gelato/types';
import { formatPercent } from '@/i18n/format';
import { labelFor, type RecipeCard, type RecipeCardLine } from '@/lib/recipes/card';

/**
 * A receita de gelato como texto e como folha impressa.
 *
 * Não usa o `Formatters` das outras três: aqui a unidade é escolhida pelo
 * tamanho do lote (acima de 2 L a receita passa a ser lida em quilos), e é essa
 * a mesma decisão que a tabela na tela toma.
 */
export function gelatoRecipeCard({
  state,
  result,
  recipeType,
  dict,
  locale,
  unit,
}: {
  state: GelatoState;
  result: RecipeResult;
  recipeType: RecipeType;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
}): RecipeCard {
  const ingredients: RecipeCardLine[] = result.rows.map((row) => ({
    label: ingredientLabelOrFallback(dict, row.ingredientId),
    value: formatMass(row.grams, unit, locale),
  }));

  const metrics: RecipeCardLine[] = METRIC_KEYS.map((key) => {
    const metric = result.metrics[key];

    return {
      label: dict.metrics[key].label,
      value: isPerKgMetric(key)
        ? `${metric.value.toFixed(1)} ${dict.balance.perKg}`
        : formatPercent(metric.value * 100, locale, 1),
    };
  });

  const outOfRange = METRIC_KEYS.filter((key) => result.metrics[key].status !== 'ok');

  return {
    title: labelFor(dict.presets, state.presetId),
    subtitle: `${dict.bases[recipeType.id as keyof GelatoDictionary['bases']].name} · ${formatLiters(state.batchLiters, locale)}`,
    groups: [
      { lines: ingredients },
      {
        heading: dict.balance.title,
        lines: [
          {
            label: dict.balance.totalMass,
            value: formatMass(result.totalGrams, unit, locale),
            strong: true,
          },
          ...metrics,
          {
            label: dict.balance.servingTemp,
            value: formatTemperature(result.servingTemp, locale),
          },
        ],
      },
    ],
    // Fora da faixa não é risco à saúde como no picles, mas é o que decide se
    // a base vai boleável ou dura: some do papel e a folha vira uma lista de
    // pesos sem veredito.
    notices: result.isBalanced
      ? []
      : [
          `${outOfRange.length} ${
            outOfRange.length === 1
              ? dict.balance.outOfRangeOne
              : dict.balance.outOfRangeMany
          }: ${outOfRange.map((key) => dict.metrics[key].label).join(', ')}.`,
        ],
    sources: citationSummary(
      [GELATO_CITATIONS.ingredients, GELATO_CITATIONS.ranges],
      dict.sources,
    ),
  };
}
