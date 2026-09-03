import { ingredientLabelOrFallback } from './catalog';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { formatMass, type MassUnit } from '@/lib/gelato/mass';
import type { NutritionFacts, NutritionResult } from '@/lib/gelato/nutrition';

/** Macronutrientes na ordem de uma tabela nutricional. */
const MACROS = ['carbs', 'sugars', 'fats', 'protein'] as const;

type MacroKey = (typeof MACROS)[number];

const MACRO_LABEL: Record<MacroKey, keyof GelatoDictionary['nutrition']> = {
  carbs: 'carbs',
  sugars: 'ofWhichSugars',
  fats: 'fats',
  protein: 'protein',
};

interface Column {
  readonly key: string;
  readonly label: string;
  readonly hint: string;
  readonly facts: NutritionFacts;
}

interface NutritionPanelProps {
  nutrition: NutritionResult;
  dict: GelatoDictionary;
  locale: Locale;
  unit: MassUnit;
}

/**
 * Estimativa derivada da composição da planilha — orientação, não rotulagem.
 * O painel diz isso na cara, e não numa nota de rodapé.
 */
export function NutritionPanel({ nutrition, dict, locale, unit }: NutritionPanelProps) {
  const fmt = useFormatters(locale);

  if (nutrition.batchGrams <= 0) return null;

  const columns: readonly Column[] = [
    {
      key: 'portion',
      label: `${dict.nutrition.portion} ${fmt.mass(nutrition.portionGrams, 0)}`,
      hint: dict.nutrition.portionHint,
      facts: nutrition.perPortion,
    },
    {
      key: 'per100',
      label: dict.nutrition.per100,
      hint: dict.nutrition.per100Hint,
      facts: nutrition.per100g,
    },
    {
      key: 'batch',
      label: dict.nutrition.batch,
      hint: formatMass(nutrition.batchGrams, unit, locale),
      facts: nutrition.batch,
    },
  ];

  return (
    <section className="mt-12">
      <h2 className="label-caps text-brand-deep">{dict.nutrition.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {dict.nutrition.lead}
      </p>

      <div className="relative mt-5 overflow-x-auto rounded-card border border-rule bg-surface">
        <table className="w-full min-w-lg border-collapse text-left">
          <caption className="sr-only">{dict.nutrition.title}</caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className="label-caps px-4 py-3 text-ink-muted">
                {dict.nutrition.nutrient}
              </th>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 text-right">
                  <span className="block text-sm font-semibold text-ink">{column.label}</span>
                  <span className="block text-xs font-normal text-ink-muted">
                    {column.hint}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-rule/70">
              <th scope="row" className="px-4 py-2.5 text-left font-semibold text-ink">
                {dict.nutrition.energy}
              </th>
              {columns.map((column) => (
                <td
                  key={column.key}
                  data-numeric
                  className="px-4 py-2.5 text-right font-bold tabular-nums text-ink"
                >
                  {`${fmt.number(column.facts.kcal, {
                    maximumFractionDigits: 0,
                  })} kcal`}
                </td>
              ))}
            </tr>

            {MACROS.map((macro) => (
              <MacroRow key={macro} macro={macro} columns={columns} dict={dict} locale={locale} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
        {dict.nutrition.method}
      </p>
      <AdjustedNote nutrition={nutrition} dict={dict} />
    </section>
  );
}

function MacroRow({
  macro,
  columns,
  dict,
  locale,
}: {
  macro: MacroKey;
  columns: readonly Column[];
  dict: GelatoDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);

  const indented = macro === 'sugars';

  return (
    <tr className="border-b border-rule/70 last:border-b-0">
      <th
        scope="row"
        className={`py-2.5 text-left font-normal text-ink-soft ${indented ? 'pr-4 pl-8' : 'px-4'}`}
      >
        {dict.nutrition[MACRO_LABEL[macro]]}
      </th>
      {columns.map((column) => (
        <td
          key={column.key}
          data-numeric
          className="px-4 py-2.5 text-right tabular-nums text-ink-soft"
        >
          {fmt.mass(column.facts[macro])}
        </td>
      ))}
    </tr>
  );
}

/** Nomeia os ingredientes que entraram com fator próprio em vez de Atwater. */
function AdjustedNote({
  nutrition,
  dict,
}: {
  nutrition: NutritionResult;
  dict: GelatoDictionary;
}) {
  const names = [...new Set(nutrition.adjustedIngredientIds)].map((id) =>
    ingredientLabelOrFallback(dict, id),
  );
  if (names.length === 0) return null;

  return (
    <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
      {dict.nutrition.adjusted}{' '}
      <strong className="font-semibold text-ink-soft">{names.join(', ')}</strong>.
    </p>
  );
}
