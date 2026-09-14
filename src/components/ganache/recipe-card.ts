import { citationSummary } from '@/components/citation';
import {
  FREEZING_CITATIONS,
  SHELF_LIFE_WEEKS,
  getTexture,
} from '@/data/ganache/textures';
import type { GanacheResult, Range } from '@/data/ganache/types';
import type { GanacheDictionary } from '@/i18n/dictionaries/ganache';
import type { GanacheState } from '@/lib/ganache/state';
import { labelFor, type RecipeCard } from '@/lib/recipes/card';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A ganache como texto e como folha impressa.
 *
 * O prazo de três semanas e o aviso sobre congelar vão junto sempre. Quem
 * imprime leva o papel para a bancada e faz uma fornada de bombom que vai para
 * a vitrine — a validade é a informação que decide se aquilo pode ser vendido na
 * semana seguinte, e é a que nenhuma receita traz.
 */
export function ganacheRecipeCard({
  state,
  result,
  dict,
  fmt,
}: {
  state: GanacheState;
  result: GanacheResult;
  dict: GanacheDictionary;
  fmt: Formatters;
}): RecipeCard {
  const texture = getTexture(state.textureId);

  const mass = (range: Range, digits = 0) => {
    const low = fmt.mass(range.min, digits);
    const high = fmt.mass(range.max, digits);
    return low === high ? low : `${low} – ${high}`;
  };

  const lines = [
    { label: dict.input.soft, value: fmt.mass(state.softGrams, 0) },
    { label: dict.result.chocolate, value: mass(result.chocolateGrams), strong: true },
  ];

  if (result.butterGrams.max > 0) {
    lines.push({ label: dict.result.butter, value: mass(result.butterGrams), strong: false });
  }
  if (result.extraCocoaButterGrams > 0) {
    lines.push({
      label: dict.result.extra,
      value: fmt.mass(result.extraCocoaButterGrams, 1),
      strong: false,
    });
  }

  return {
    title: labelFor(dict.textures, state.textureId),
    subtitle: `${labelFor(dict.chocolates, state.chocolate)} · ${fmt.mass(state.softGrams, 0)}`,
    groups: [
      { lines },
      {
        heading: dict.shelf.title,
        lines: [
          {
            label: dict.result.total,
            value: mass(result.totalGrams),
          },
          {
            label: dict.result.water,
            value: `${mass(result.waterGrams)} · ${fmt.percent(result.waterShare * 100, 0)}`,
          },
        ],
      },
    ],
    notices: [
      `${fmt.number(SHELF_LIFE_WEEKS)} ${dict.shelf.weeks}. ${dict.shelf.freezing}`,
    ],
    sources: citationSummary(
      [...(texture?.citations ?? []), ...FREEZING_CITATIONS],
      dict.sources,
    ),
  };
}
