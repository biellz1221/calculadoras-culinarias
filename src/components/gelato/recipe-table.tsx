'use client';

import { ingredientLabelOrFallback } from './catalog';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import { formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';
import {
  formatMass,
  formatMassPlain,
  fromInputMass,
  massStep,
  toInputMass,
  type MassUnit,
} from '@/lib/gelato/mass';
import type { RecipeResult, RowResult } from '@/lib/gelato/types';

interface RecipeTableProps {
  result: RecipeResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
  /** Ingredientes cuja composição não fecha na planilha de origem. */
  flaggedIds: ReadonlySet<string>;
  onGramsChange: (itemId: string, grams: number) => void;
  onRemove: (itemId: string) => void;
}

/** A receita em gramas, com toda quantidade editável. */
export function RecipeTable({
  result,
  dict,
  locale,
  unit,
  flaggedIds,
  onGramsChange,
  onRemove,
}: RecipeTableProps) {
  if (result.rows.length === 0) {
    return (
      <div className="mt-6 rounded-card border border-dashed border-rule-strong px-5 py-10 text-center">
        <p className="font-display text-lg text-ink-soft">{dict.table.empty}</p>
        <p className="mt-1 text-sm text-ink-muted">{dict.table.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* `relative` prende qualquer posicionamento absoluto interno a este
          container, para nada escapar e alargar a página no celular. */}
      <div className="relative overflow-x-auto rounded-card border border-rule bg-surface">
        <table className="w-full min-w-lg border-collapse text-left">
          <caption className="sr-only">{dict.table.caption}</caption>
          <Head dict={dict} unit={unit} />
          <tbody>
            {result.rows.map((row) => (
              <Row
                key={row.itemId}
                row={row}
                dict={dict}
                locale={locale}
                unit={unit}
                flagged={flaggedIds.has(row.ingredientId)}
                onGramsChange={onGramsChange}
                onRemove={onRemove}
              />
            ))}
          </tbody>
          <Foot result={result} dict={dict} locale={locale} unit={unit} />
        </table>
      </div>

      <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
        {dict.table.editHint}
      </p>
    </div>
  );
}

function Head({ dict, unit }: { dict: GelatoDictionary; unit: MassUnit }) {
  return (
    <thead>
      <tr className="border-b border-rule">
        <th scope="col" className="label-caps px-4 py-3 text-ink-muted">
          {dict.table.ingredient}
        </th>
        <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
          {`${dict.table.amount} (${unit})`}
        </th>
        <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
          {dict.table.share}
        </th>
        <th scope="col" className="label-caps hidden px-4 py-3 text-right text-ink-muted sm:table-cell">
          {`${dict.table.solids} (${unit})`}
        </th>
        <th scope="col" className="label-caps px-4 py-3 text-right text-ink-muted">
          {dict.table.remove}
        </th>
      </tr>
    </thead>
  );
}

interface RowProps {
  row: RowResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
  flagged: boolean;
  onGramsChange: (itemId: string, grams: number) => void;
  onRemove: (itemId: string) => void;
}

function Row({ row, dict, locale, unit, flagged, onGramsChange, onRemove }: RowProps) {
  const label = ingredientLabelOrFallback(dict, row.ingredientId);

  return (
    <tr className="border-b border-rule/70 last:border-b-0">
      <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink">
        {label}
        {flagged && (
          <span className="mt-0.5 block text-xs leading-snug text-warn">
            <span aria-hidden="true">! </span>
            {dict.table.flagged}
          </span>
        )}
      </th>

      <td className="px-4 py-2.5 text-right">
        {/* O rótulo vai em aria-label, e não num <span class="sr-only">: sr-only
            é position:absolute e escaparia deste container de rolagem,
            empurrando a largura da página inteira. */}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={massStep(unit)}
          aria-label={`${label} — ${dict.table.amount} (${unit})`}
          value={toInputMass(row.grams, unit)}
          onChange={(event) =>
            onGramsChange(row.itemId, fromInputMass(Number(event.target.value), unit))
          }
          className="w-24 rounded-sm border border-rule bg-paper px-2 py-1 text-right tabular-nums text-ink focus:border-accent focus:outline-none"
        />
      </td>

      <td data-numeric className="px-4 py-2.5 text-right tabular-nums text-ink-soft">
        {formatPercent(row.percentOfBatch * 100, locale)}
      </td>

      <td
        data-numeric
        className="hidden px-4 py-2.5 text-right tabular-nums text-ink-soft sm:table-cell"
      >
        {formatMassPlain(row.contributions.totalSolids, unit, locale)}
      </td>

      <td className="px-4 py-2.5 text-right">
        <button
          type="button"
          onClick={() => onRemove(row.itemId)}
          aria-label={`${dict.table.remove} — ${label}`}
          className="rounded-sm px-2 py-1 text-ink-muted transition-colors hover:bg-danger-tint hover:text-danger"
        >
          <span aria-hidden="true">×</span>
        </button>
      </td>
    </tr>
  );
}

function Foot({
  result,
  dict,
  locale,
  unit,
}: {
  result: RecipeResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
}) {
  return (
    <tfoot>
      <tr className="border-t-2 border-rule-strong bg-paper-shade/60">
        <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
          {dict.table.total}
        </th>
        <td data-numeric className="px-4 py-3 text-right font-bold tabular-nums text-ink">
          {formatMass(result.totalGrams, unit, locale)}
        </td>
        <td data-numeric className="px-4 py-3 text-right tabular-nums text-ink-muted">
          {formatPercent(100, locale)}
        </td>
        <td
          data-numeric
          className="hidden px-4 py-3 text-right tabular-nums text-ink-muted sm:table-cell"
        >
          {formatMassPlain(result.metrics.totalSolids.grams, unit, locale)}
        </td>
        <td />
      </tr>
    </tfoot>
  );
}
