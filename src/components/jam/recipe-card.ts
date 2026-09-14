import { citationSummary } from '@/components/citation';
import { getFruit } from '@/data/jam/fruits';
import { SETTING_POINT_CITATIONS } from '@/data/jam/setting-point';
import type { JamResult } from '@/data/jam/types';
import type { JamDictionary } from '@/i18n/dictionaries/jam';
import type { JamState } from '@/lib/jam/state';
import { labelFor, type RecipeCard } from '@/lib/recipes/card';
import type { Formatters } from '@/lib/use-formatters';

/**
 * A geleia como texto e como folha impressa.
 *
 * O ponto de gelificação vai junto sempre, e com a altitude do lado: é o número
 * que muda de cozinha para cozinha, e quem imprime leva o papel para a bancada
 * sem voltar à tela. Um papel que dissesse só "105 °C" seria pior que nenhum.
 */
export function jamRecipeCard({
  state,
  result,
  dict,
  fmt,
}: {
  state: JamState;
  result: JamResult;
  dict: JamDictionary;
  fmt: Formatters;
}): RecipeCard {
  const fruit = getFruit(state.fruitId);

  const range = (min: number, max: number, digits = 0) => {
    const low = fmt.mass(min, digits);
    const high = fmt.mass(max, digits);
    return low === high ? low : `${low} – ${high}`;
  };

  const lines = [
    { label: dict.input.fruitGrams, value: fmt.mass(state.fruitGrams, 0) },
    { label: dict.result.sugar, value: fmt.mass(result.sugarGrams, 0), strong: true },
  ];

  if (result.lemonGrams.max > 0) {
    lines.push({
      label: dict.result.lemon,
      value: range(result.lemonGrams.min, result.lemonGrams.max),
      strong: false,
    });
  }

  if (result.appleJellyGrams > 0) {
    lines.push({
      label: dict.result.appleJelly,
      value: fmt.mass(result.appleJellyGrams, 0),
      strong: false,
    });
  }

  lines.push({
    label: dict.result.pectin,
    value: range(result.pectinGrams.min, result.pectinGrams.max, 1),
    strong: false,
  });

  const byNorm = result.referenceBasis === 'norm';
  const notices: string[] = [];
  if (result.status === 'below-source') {
    notices.push(byNorm ? dict.status.normBelowBody : dict.status.belowBody);
  }
  if (result.status === 'above-source') {
    notices.push(byNorm ? dict.status.normAboveBody : dict.status.aboveBody);
  }
  // Vai sempre: é o aviso que impede alguém de cozinhar até o número do livro
  // francês numa cidade a mil metros.
  notices.push(dict.point.honesty);

  return {
    title: labelFor(dict.fruits, state.fruitId),
    subtitle: `${fmt.mass(state.fruitGrams, 0)} · ${fmt.percent(result.sugarRatio * 100, 0)} · ${fmt.number(state.altitudeMeters)} m`,
    groups: [
      { lines },
      {
        heading: dict.point.resultTitle,
        // O rendimento entra aqui só quando a receita declara rendimento. Para
        // fruta que veio da tabela da Embrapa a linha some: escalar o número de
        // outra fruta seria imprimir um dado que fonte nenhuma publicou.
        lines: [
          {
            label: dict.point.setting,
            value: fmt.temperature(result.settingCelsius, 1),
            strong: true,
          },
          { label: dict.point.boiling, value: fmt.temperature(result.boilingCelsius, 1) },
          {
            label: dict.point.processing,
            value: `${fmt.number(result.processingMinutes)} ${dict.point.minutes}`,
          },
          ...(result.jars
            ? [
                {
                  label: dict.result.jars,
                  value: `${fmt.number(Math.round(result.jars.min))}–${fmt.number(Math.round(result.jars.max))} ${dict.result.jarsUnit}`,
                },
              ]
            : []),
        ],
      },
    ],
    notices,
    sources: fruit
      ? citationSummary([...fruit.citations, ...SETTING_POINT_CITATIONS], dict.sources)
      : [],
  };
}
