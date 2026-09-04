'use client';

import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { isFlour, type BreadRecipe, type IngredientKey } from '@/data/bread/types';

interface RecipeTableProps {
  recipe: BreadRecipe;
  dict: BreadDictionary;
  locale: Locale;
  onPercentChange: (key: IngredientKey, percent: number) => void;
  /** Em receita própria a linha pode sair; num preset, não. */
  onRemove?: (key: IngredientKey) => void;
  removeLabel?: string;
}

/**
 * A receita calculada, com a coluna de porcentagem editável.
 *
 * Editar a porcentagem aqui é o "modo livre" (FR-011): não existe uma tela
 * separada para isso: a mesma tabela que mostra a receita é a que se ajusta.
 */
export function RecipeTable({
  recipe,
  dict,
  locale,
  onPercentChange,
  onRemove,
  removeLabel,
}: RecipeTableProps) {
  const fmt = useFormatters(locale);

  const rows = [...recipe.flours, ...recipe.lines];

  return (
    <div className="mt-6">
      {/* `relative` prende qualquer posicionamento absoluto interno a este
          container, para nada escapar e alargar a página. */}
      <div className="relative overflow-x-auto rounded-card border border-rule bg-surface">
        <table className="w-full min-w-lg border-collapse text-left">
          <caption className="sr-only">{dict.table.caption}</caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className="label-caps px-4 py-3 text-ink-muted">
                {dict.table.ingredient}
              </th>
              <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
                {dict.table.amount}
              </th>
              <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
                {dict.table.percent}
              </th>
              {onRemove && <th scope="col" className="w-10" />}
            </tr>
          </thead>

          <tbody>
            {rows.map((line) => (
              <tr key={line.key} className="border-b border-rule/70 last:border-b-0">
                <th
                  scope="row"
                  className="px-4 py-2.5 text-left font-normal text-ink"
                >
                  {dict.ingredients[line.key]}
                </th>
                <td
                  data-numeric
                  className="px-4 py-2.5 text-right font-bold tabular-nums text-ink"
                >
                  {fmt.mass(line.grams)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {isFlour(line.key) && !onRemove ? (
                    /* Num preset a farinha é a régua: ela É os 100%. Deixar
                       essa porcentagem editável produzia receita incoerente,
                       com "farinha 80%" ao lado de "farinha total 100%". O
                       tamanho da fornada se muda pelo peso, ali em cima.

                       Na receita própria é diferente: quem monta um blend
                       precisa dizer quanto é de cada farinha, e a soma volta
                       para 100 pelo aviso logo acima da tabela. */
                    <span
                      data-numeric
                      className="inline-flex items-center gap-1 pr-6 tabular-nums text-ink-muted"
                    >
                      {fmt.percent(line.percent)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {/* O rótulo vai em aria-label, não num <span class="sr-only">:
                          sr-only é position:absolute e escaparia deste container
                          de rolagem, empurrando a largura da página inteira. */}
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={0.1}
                        aria-label={`${dict.table.percent} — ${dict.ingredients[line.key]}`}
                        value={formatEditable(line.percent)}
                        onChange={(event) =>
                          onPercentChange(line.key, Number(event.target.value))
                        }
                        className="w-20 rounded-sm border border-rule bg-paper px-2 py-1 text-right tabular-nums text-ink focus:border-accent focus:outline-none"
                      />
                      <span aria-hidden="true" className="text-ink-muted">
                        %
                      </span>
                    </span>
                  )}
                </td>
                {onRemove && (
                  <td className="px-2 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(line.key)}
                      aria-label={`${removeLabel}: ${dict.ingredients[line.key]}`}
                      className="rounded-full border border-rule px-2 py-1 text-sm text-ink-muted transition-colors hover:border-danger hover:text-danger"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-rule-strong bg-paper-shade/60">
              <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                {dict.table.flourTotal}
              </th>
              <td
                data-numeric
                className="px-4 py-3 text-right font-bold tabular-nums text-ink"
              >
                {fmt.mass(recipe.flourGrams)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                {fmt.number(100)}%
              </td>
              {onRemove && <td />}
            </tr>
            <tr className="bg-paper-shade/60">
              <th scope="row" className="px-4 pb-3 text-left font-semibold text-ink">
                {dict.table.doughTotal}
              </th>
              <td
                data-numeric
                className="px-4 pb-3 text-right font-bold tabular-nums text-ink"
              >
                {fmt.mass(recipe.doughGrams)}
              </td>
              <td />
              {onRemove && <td />}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-2 text-xs text-ink-muted">{dict.table.editHint}</p>
    </div>
  );
}

/** Evita casas decimais fantasma no input sem perder precisão do estado. */
function formatEditable(percent: number): string {
  return String(Math.round(percent * 100) / 100);
}
