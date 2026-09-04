import { citationSummary } from '@/components/citation';
import { COOKING_WATER_CITATIONS } from '@/data/pasta/presets';
import type { PastaPreset, PastaRecipe } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import { cookRuleFor, cookingWaterLitres } from '@/lib/pasta/cooking';
import type { RecipeCard, RecipeCardLine } from '@/lib/recipes/card';
import type { PastaState } from '@/lib/pasta/state';
import type { Formatters } from '@/lib/use-formatters';

/** A receita de massa fresca como texto e como folha impressa. */
export function pastaRecipeCard({
  state,
  preset,
  recipe,
  dict,
  fmt,
}: {
  state: PastaState;
  preset: PastaPreset;
  recipe: PastaRecipe;
  dict: PastaDictionary;
  fmt: Formatters;
}): RecipeCard {
  const cook = cookRuleFor(preset.family);
  const [fastest, slowest] = cook.minutes;
  const water = cookingWaterLitres(recipe.yieldGrams);

  const ingredients: RecipeCardLine[] = recipe.lines.map((line) => {
    const grams = fmt.mass(line.grams);

    // Ovo sai nas duas moedas, como na tabela: a unidade é o que se compra, o
    // peso é o que manda na proporção.
    const value =
      line.key === 'egg' || line.key === 'egg-yolk'
        ? `${fmt.number(line.key === 'egg' ? recipe.plan.eggs : recipe.plan.yolks)} ${dict.result.units} · ${grams}`
        : grams;

    return {
      label: dict.ingredients[line.key],
      value:
        line.absorbGrams === undefined
          ? value
          : `${value} (${dict.table.absorb} ${fmt.mass(line.grams + line.absorbGrams)})`,
    };
  });

  return {
    title: dict.presets[state.presetId as keyof PastaDictionary['presets']],
    subtitle: `${fmt.number(state.servings)} ${dict.target.servings.toLowerCase()} · ${fmt.mass(state.gramsPerServing, 0)} ${dict.target.gramsPerServing.toLowerCase()}`,
    groups: [
      { lines: ingredients },
      {
        heading: dict.result.title,
        lines: [
          {
            label: dict.result.flour,
            value: fmt.mass(recipe.flourGrams),
            strong: true,
          },
          {
            label: dict.result.yieldLabel,
            value: fmt.mass(recipe.yieldGrams, 0),
            strong: true,
          },
          {
            label: dict.result.water,
            value: `${fmt.number(water, { maximumFractionDigits: 1 })} ${dict.result.litres}`,
          },
          {
            label: dict.result.cookTime,
            value: `${fmt.number(fastest)}–${fmt.number(slowest)} ${dict.result.minutes}`,
          },
        ],
      },
    ],
    notices: preset.unsuitable?.includes('filled')
      ? [dict.process.unsuitableFilled]
      : [],
    sources: citationSummary(
      [...preset.citations, ...cook.citations, ...COOKING_WATER_CITATIONS],
      dict.sources,
    ),
  };
}
