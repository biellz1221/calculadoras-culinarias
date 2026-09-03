'use client';

import type { PastaLine, PastaRecipe } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';

interface RecipeTableProps {
  recipe: PastaRecipe;
  dict: PastaDictionary;
  locale: Locale;
}

/**
 * A receita calculada, em gramas.
 *
 * Ovo aparece nas duas moedas ao mesmo tempo — "3 un · 150,0 g" — porque é a
 * unidade que se compra e o peso que manda na proporção. Sem coluna editável:
 * aqui quem escala a receita é o número de pessoas, não a porcentagem.
 */
export function RecipeTable({ recipe, dict, locale }: RecipeTableProps) {
  const fmt = useFormatters(locale);

  return (
    <div className="mt-4 rounded-card border border-rule bg-surface">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{dict.table.caption}</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="label-caps px-4 py-3 text-ink-muted">
              {dict.table.ingredient}
            </th>
            <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
              {dict.table.amount}
            </th>
          </tr>
        </thead>

        <tbody>
          {recipe.lines.map((line) => (
            <tr key={line.key} className="border-b border-rule/70">
              <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink">
                {dict.ingredients[line.key]}
                {line.prepGrams !== undefined && (
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {`${dict.table.prep} ${fmt.mass(line.prepGrams, 0)}`}
                  </span>
                )}
              </th>
              <td
                data-numeric
                className="px-4 py-2.5 text-right font-bold tabular-nums text-ink"
              >
                {amountFor(line, recipe, dict, fmt)}
                {line.absorbGrams !== undefined && (
                  <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                    {`${dict.table.absorb} ${fmt.mass(
                      line.grams + line.absorbGrams,
                    )}`}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-rule-strong bg-paper-shade/60">
            <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
              {dict.result.flour}
            </th>
            <td
              data-numeric
              className="px-4 py-3 text-right font-bold tabular-nums text-ink"
            >
              {fmt.mass(recipe.flourGrams)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** Ovo e gema saem em unidades inteiras mais o peso; o resto, só em gramas. */
function amountFor(
  line: PastaLine,
  recipe: PastaRecipe,
  dict: PastaDictionary,
  fmt: Formatters,
): string {
  const grams = fmt.mass(line.grams);

  if (line.key !== 'egg' && line.key !== 'egg-yolk') return grams;

  const units = line.key === 'egg' ? recipe.plan.eggs : recipe.plan.yolks;

  return `${fmt.number(units)} ${dict.result.units} · ${grams}`;
}
