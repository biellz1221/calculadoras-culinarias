import { citationSummary } from '@/components/citation';
import { getPreset } from '@/data/pickles/presets';
import { CLIMATES, MIN_SAFE_SALINITY, RANGES } from '@/data/pickles/ranges';
import { isVinegarPreset } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { calculateBrine, calculateDrySalt } from '@/lib/pickles/brine';
import { brineInput, type PicklesState } from '@/lib/pickles/state';
import { calculateVinegarPickle } from '@/lib/pickles/vinegar';
import type { RecipeCard, RecipeCardLine } from '@/lib/recipes/card';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A receita de picles como texto e como folha impressa.
 *
 * É a única das quatro em que `notices` não é enfeite: sal abaixo do piso e
 * acidez abaixo do mínimo são segurança alimentar, e a regra do projeto é que
 * o aviso acompanhe o resultado — inclusive no papel que vai para a bancada,
 * que é justamente o que a pessoa vai ler sem o site na frente.
 */
export function picklesRecipeCard({
  state,
  dict,
  fmt,
}: {
  state: PicklesState;
  dict: PicklesDictionary;
  fmt: Formatters;
}): RecipeCard {
  const preset = getPreset(state.presetId);
  const title = dict.presets[state.presetId as keyof PicklesDictionary['presets']];
  const subtitle = dict.modes[state.mode];

  if (!preset) return { title, subtitle, groups: [], notices: [], sources: [] };

  if (isVinegarPreset(preset)) {
    const result = calculateVinegarPickle(state.vinegar);

    const notices: string[] = [];
    if (result.status === 'below-minimum') notices.push(dict.vinegarStatus.belowBody);
    if (result.status === 'unusable-vinegar') {
      notices.push(dict.vinegarStatus.unusableBody);
    }

    return {
      title,
      subtitle,
      groups: [
        {
          heading: dict.result.title,
          lines: [
            {
              label: dict.result.vinegar,
              value: fmt.mass(result.vinegarGrams),
              strong: true,
            },
            { label: dict.result.water, value: fmt.mass(result.waterGrams) },
            { label: dict.result.salt, value: fmt.mass(result.saltGrams) },
            { label: dict.result.sugar, value: fmt.mass(result.sugarGrams) },
          ],
        },
        {
          lines: [
            {
              label: dict.result.acidity,
              value: fmt.percent(result.brineAcidity, 2),
              strong: true,
            },
            { label: dict.result.days, value: daysLine(preset.days, dict, fmt) },
          ],
        },
      ],
      notices,
      sources: citationSummary(
        [...preset.citations, ...RANGES['vinegar-acidity'].citations],
        dict.sources,
      ),
    };
  }

  const isBrine = preset.mode === 'brine';
  const climate = CLIMATES[preset.climate];

  const brine = calculateBrine({
    input: brineInput(state.brine),
    saltPercent: state.brine.saltPercent,
    basis: state.brine.basis,
  });
  const dry = calculateDrySalt(
    state.brine.inputKind === 'ingredients'
      ? brine.vegetableGrams
      : state.brine.vegetableGrams,
    state.brine.saltPercent,
  );

  const weigh: RecipeCardLine[] = [
    {
      label: dict.result.salt,
      value: fmt.mass(isBrine ? brine.saltGrams : dry.saltGrams),
      strong: true,
    },
    {
      label: dict.result.vegetable,
      value: fmt.mass(isBrine ? brine.vegetableGrams : dry.vegetableGrams),
    },
  ];

  if (isBrine) {
    weigh.push({ label: dict.result.water, value: fmt.mass(brine.waterGrams) });
    weigh.push({ label: dict.result.total, value: fmt.mass(brine.totalGrams) });
  }

  // A salinidade que a segurança olha é sempre a efetiva sobre o peso total,
  // mesmo quando a pessoa calculou sobre a água: é aí que mora o erro que o
  // BWF demonstra na p. 199.
  const effectiveSalinity = isBrine ? brine.percentOfTotal : dry.percentOfVegetable;

  const salinity: RecipeCardLine[] = isBrine
    ? [
        {
          label: `${dict.result.salt} ${dict.result.ofTotal}`,
          value: fmt.percent(brine.percentOfTotal, 2),
        },
        {
          label: `${dict.result.salt} ${dict.result.ofWater}`,
          value: fmt.percent(brine.percentOfWater, 2),
        },
      ]
    : [
        {
          label: `${dict.result.salt} ${dict.result.ofVegetable}`,
          value: fmt.percent(dry.percentOfVegetable, 2),
        },
      ];

  salinity.push({ label: dict.result.days, value: daysLine(preset.days, dict, fmt) });
  salinity.push({
    label: dict.result.temperature,
    value: fmt.temperatureRange(climate.celsius),
  });

  const notices: string[] = [];
  if (effectiveSalinity > 0 && effectiveSalinity < MIN_SAFE_SALINITY) {
    notices.push(
      `${dict.status.unsafe} (${fmt.percent(effectiveSalinity, 2)}). ${
        isBrine ? dict.notes.brineTotal : dict.notes.drySalt
      }`,
    );
  }

  return {
    title,
    subtitle,
    // O título "O que pesar" encabeça o que se pesa. A salinidade vem depois,
    // sem título: são leituras do que foi pesado, não mais ingredientes.
    groups: [{ heading: dict.result.title, lines: weigh }, { lines: salinity }],
    notices,
    sources: citationSummary(
      [...preset.citations, ...climate.citations],
      dict.sources,
    ),
  };
}

function daysLine(
  days: readonly [number, number],
  dict: PicklesDictionary,
  fmt: Formatters,
): string {
  return `${fmt.number(days[0])}–${fmt.number(days[1])} ${dict.result.daysUnit}`;
}
