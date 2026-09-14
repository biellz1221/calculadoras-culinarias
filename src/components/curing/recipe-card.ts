import { citationSummary } from '@/components/citation';
import { getCure, METHOD_CEILING_PPM, MIN_INGOING_PPM } from '@/data/curing/cures';
import type { CuringResult } from '@/data/curing/types';
import type { CuringDictionary } from '@/i18n/dictionaries/curing';
import type { CuringState } from '@/lib/curing/state';
import { labelFor, type RecipeCard } from '@/lib/recipes/card';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A cura como texto e como folha impressa.
 *
 * O aviso aqui não é opcional em nenhuma das saídas. Quem imprime leva o papel
 * para a bancada e não volta à tela; quem manda por mensagem manda a dose junto
 * com o motivo de ela ser aquela.
 */
export function curingRecipeCard({
  state,
  result,
  dict,
  fmt,
}: {
  state: CuringState;
  result: CuringResult;
  dict: CuringDictionary;
  fmt: Formatters;
}): RecipeCard {
  const cure = getCure(state.cureId);

  const lines = [
    { label: dict.result.cure, value: fmt.mass(result.cureGrams, 1), strong: true },
    { label: dict.result.salt, value: fmt.mass(result.saltFromCureGrams, 1) },
    {
      label: dict.result.nitrite,
      value: `${fmt.number(Math.round(result.nitritePpm))} ppm`,
    },
  ];

  if (cure && cure.nitrate > 0) {
    lines.push({
      label: dict.result.nitrate,
      value: `${fmt.number(Math.round(result.nitratePpm))} ppm`,
    });
  }

  const notices: string[] = [];
  if (result.status === 'below-minimum') notices.push(dict.status.belowBody);
  if (result.status === 'above-limit') notices.push(dict.status.aboveBody);
  // O aviso de grandeza vai sempre, mesmo com tudo dentro da faixa: é o que
  // impede alguém de tratar este papel como certificado de conformidade.
  notices.push(dict.limits.honesty);

  return {
    title: labelFor(dict.cures, state.cureId),
    subtitle: `${dict.methods[state.method]} · ${fmt.mass(state.meatGrams, 0)} · ${fmt.number(state.targetPpm)} ppm`,
    groups: [
      { lines },
      {
        heading: dict.status.minimum,
        lines: [
          {
            label: dict.status.minimum,
            value: `${fmt.number(MIN_INGOING_PPM)} ppm`,
          },
          {
            label: dict.status.ceiling,
            value: `${fmt.number(METHOD_CEILING_PPM[state.method])} ppm`,
          },
        ],
      },
    ],
    notices,
    sources: cure ? citationSummary(cure.citations, dict.sources) : [],
  };
}
