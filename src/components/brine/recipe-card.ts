import { citationSummary } from '@/components/citation';
import { getMethod } from '@/data/brine/methods';
import type { BrineResult } from '@/data/brine/types';
import type { BrineDictionary } from '@/i18n/dictionaries/brine';
import type { BrineState } from '@/lib/brine/state';
import { labelFor, type RecipeCard } from '@/lib/recipes/card';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A salmoura como texto e como folha impressa.
 *
 * O aviso de equilíbrio vai junto sempre. Quem imprime leva o papel para a
 * geladeira e não volta à tela, e a diferença entre "pode esquecer" e "tire às
 * cinco horas" é a única coisa desta página que estraga uma peça inteira.
 */
export function brineRecipeCard({
  state,
  result,
  dict,
  fmt,
}: {
  state: BrineState;
  result: BrineResult;
  dict: BrineDictionary;
  fmt: Formatters;
}): RecipeCard {
  const method = getMethod(state.methodId);

  const lines = [
    { label: dict.input.protein, value: fmt.mass(state.proteinGrams, 0) },
    { label: dict.result.salt, value: fmt.mass(result.saltGrams, 1), strong: true },
  ];

  if (result.liquidGrams > 0) {
    lines.push({ label: dict.result.liquid, value: fmt.mass(result.liquidGrams, 0), strong: false });
  }
  if (result.sugarGrams > 0) {
    lines.push({ label: dict.result.sugar, value: fmt.mass(result.sugarGrams, 1), strong: false });
  }

  const notices: string[] = [];
  if (method) {
    notices.push(method.equilibrium ? dict.equilibrium.yesBody : dict.equilibrium.noBody);
    if (method.injected) notices.push(dict.result.injectedHint);
    if (method.rinsed) notices.push(dict.result.rinsedHint);
  }

  return {
    title: labelFor(dict.methods, state.methodId),
    subtitle: `${fmt.mass(state.proteinGrams, 0)} · ${fmt.percent(
      (result.saltGrams / Math.max(1, state.proteinGrams)) * 100,
      2,
    )}`,
    groups: [
      { lines },
      {
        heading: dict.result.time,
        lines: [
          {
            label: dict.result.time,
            value: method ? formatHours(method.hours, dict, fmt) : '',
            strong: true,
          },
          {
            label: dict.equilibrium.title,
            value: method?.equilibrium ? dict.equilibrium.yes : dict.equilibrium.no,
          },
        ],
      },
    ],
    notices,
    sources: method ? citationSummary(method.citations, dict.sources) : [],
  };
}

export function formatHours(
  hours: readonly [number, number],
  dict: BrineDictionary,
  fmt: Formatters,
): string {
  const unit = (value: number) =>
    value < 1
      ? `${fmt.number(Math.round(value * 60))} ${dict.result.minutes}`
      : `${fmt.number(value)} ${dict.result.hours}`;

  const [low, high] = hours;
  const span = low === high ? unit(low) : `${fmt.number(low)}–${unit(high)}`;
  return `${span} ${dict.result.fridge}`;
}
