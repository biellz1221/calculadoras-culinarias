import { citationSummary } from '@/components/citation';
import { getPreset } from '@/data/bread/presets';
import { RANGES, isBeyondHardLimit, ruleFor } from '@/data/bread/ranges';
import type { BreadRecipe } from '@/data/bread/types';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { labelFor, type RecipeCard, type RecipeCardLine } from '@/lib/recipes/card';
import type { BreadState } from '@/lib/bread/state';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A receita de pão como texto e como folha impressa.
 *
 * Os mesmos números da tabela, formatados pelo mesmo `Formatters` — é o que
 * garante que a pessoa que imprime pese o que estava vendo, inclusive quando
 * escolheu onças nas preferências.
 */
export function breadRecipeCard({
  state,
  recipe,
  dict,
  fmt,
}: {
  state: BreadState;
  recipe: BreadRecipe;
  dict: BreadDictionary;
  fmt: Formatters;
}): RecipeCard {
  const preset = getPreset(state.presetId);
  const title = labelFor(dict.presets, state.presetId);

  const ingredients: RecipeCardLine[] = [...recipe.flours, ...recipe.lines].map(
    (line) => ({
      label: dict.ingredients[line.key],
      value: fmt.mass(line.grams),
    }),
  );

  const hasPreFerment = Math.abs(recipe.effectiveHydration - recipe.hydration) > 0.05;

  const balance: RecipeCardLine[] = [
    {
      label: dict.table.flourTotal,
      value: fmt.mass(recipe.flourGrams),
      strong: true,
    },
    {
      label: dict.table.doughTotal,
      value: fmt.mass(recipe.doughGrams),
      strong: true,
    },
    { label: dict.balance.hydration, value: fmt.percent(recipe.hydration) },
  ];

  if (hasPreFerment) {
    balance.push({
      label: dict.balance.effectiveHydration,
      value: fmt.percent(recipe.effectiveHydration),
    });
  }

  balance.push({ label: dict.balance.salt, value: fmt.percent(recipe.salt) });

  const process: RecipeCardLine[] = [];
  if (preset?.process.ovenCelsius !== undefined) {
    process.push({
      label: dict.process.oven,
      value: fmt.temperature(preset.process.ovenCelsius),
    });
  }
  if (preset?.process.bakeMinutes) {
    const [min, max] = preset.process.bakeMinutes;
    process.push({
      label: dict.process.bake,
      value: `${fmt.number(min)}–${fmt.number(max)} ${dict.process.minutes}`,
    });
  }

  return {
    title,
    subtitle: targetLine(state, dict, fmt),
    groups: [
      { lines: ingredients },
      { heading: dict.balance.title, lines: balance },
      ...(process.length > 0 ? [{ heading: dict.process.title, lines: process }] : []),
    ],
    notices: hardLimitNotices(recipe, dict),
    sources: preset ? citationSummary(preset.citations, dict.sources) : [],
  };
}

/** O que a pessoa pediu: tanta farinha, tanta massa, ou tantas unidades. */
function targetLine(
  state: BreadState,
  dict: BreadDictionary,
  fmt: Formatters,
): string {
  if (state.mode === 'dough') {
    return `${dict.target.doughHint}: ${fmt.mass(state.doughGrams)}`;
  }

  if (state.mode === 'units') {
    return `${fmt.number(state.unitCount)} × ${fmt.mass(state.unitGrams)}`;
  }

  return `${dict.target.flourHint}: ${fmt.mass(state.flourGrams)}`;
}

/**
 * Métricas que passaram do limite duro das fontes.
 *
 * Só o limite duro vira aviso no papel. Estar fora da faixa recomendada é
 * comum e às vezes proposital; passar do limite é onde o pão deixa de
 * funcionar, e essa é a informação que precisa acompanhar a receita até a
 * bancada.
 */
function hardLimitNotices(recipe: BreadRecipe, dict: BreadDictionary): string[] {
  const notices: string[] = [];

  const check = (label: string, value: number, rule = RANGES.hydration) => {
    if (isBeyondHardLimit(value, rule)) {
      notices.push(`${label}: ${dict.balance.hardLimit}.`);
    }
  };

  check(dict.balance.hydration, recipe.hydration, RANGES.hydration);
  check(dict.balance.salt, recipe.salt, RANGES.salt);

  for (const line of recipe.lines) {
    if (line.key === 'salt') continue;

    const rule = ruleFor(line.key);
    if (rule) check(dict.ingredients[line.key], line.percent, rule);
  }

  return notices;
}
