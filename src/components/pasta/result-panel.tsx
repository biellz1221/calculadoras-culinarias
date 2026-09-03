'use client';

import { RecipeTable } from './recipe-table';
import { CitationRef } from '@/components/citation';
import { COOKING_WATER_CITATIONS } from '@/data/pasta/presets';
import type { PastaPreset, PastaRecipe } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { cookRuleFor, cookingWaterLitres } from '@/lib/pasta/cooking';
import { cn } from '@/lib/cn';

interface ResultPanelProps {
  preset: PastaPreset;
  recipe: PastaRecipe;
  dict: PastaDictionary;
  locale: Locale;
}

export function ResultPanel({ preset, recipe, dict, locale }: ResultPanelProps) {
  const fmt = useFormatters(locale);

  const cook = cookRuleFor(preset.family);
  const water = cookingWaterLitres(recipe.yieldGrams);
  const [fastest, slowest] = cook.minutes;

  return (
    <section aria-live="polite" className="mt-10">
      <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

      <RecipeTable recipe={recipe} dict={dict} locale={locale} />

      <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
        {dict.result.yieldNote}
      </p>

      <dl className="mt-6 rounded-card border border-rule bg-surface px-5 py-2">
        <SummaryRow
          label={dict.result.yieldLabel}
          value={fmt.mass(recipe.yieldGrams, 0)}
          strong
        />
        <SummaryRow
          label={dict.result.servings}
          value={`${fmt.number(recipe.servingsAchieved, {
            maximumFractionDigits: 1,
          })} ${dict.result.servingsUnit}`}
        />
        {recipe.pieceYield !== undefined && (
          <SummaryRow
            label={dict.result.pieces}
            value={fmt.number(Math.round(recipe.pieceYield))}
          />
        )}
        <SummaryRow
          label={dict.result.water}
          value={`${fmt.number(water, { maximumFractionDigits: 1 })} ${dict.result.litres}`}
        />
        <SummaryRow
          label={dict.result.cookTime}
          value={`${fmt.number(fastest)}–${fmt.number(slowest)} ${dict.result.minutes}`}
        />
      </dl>

      <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
        {adjustmentText(recipe, dict, fmt)}
      </p>

      <CitationRef
        citations={[...preset.citations, ...cook.citations, ...COOKING_WATER_CITATIONS]}
        labels={dict.sources}
        className="mt-3 block"
      />
    </section>
  );
}

/**
 * A frase do arredondamento: quantos ovos a escala pediria e para onde a
 * farinha andou por causa do ovo inteiro. É o coração do FR-030, porque o
 * número sozinho esconderia a decisão.
 */
function adjustmentText(
  recipe: PastaRecipe,
  dict: PastaDictionary,
  fmt: Formatters,
): string {
  const { adjustment } = dict.result;
  const difference = recipe.flourAdjustmentGrams;

  if (recipe.plan.eggs === 0 || Math.abs(difference) < 0.5) {
    return adjustment.exact;
  }

  const ideal = fmt.number(recipe.plan.idealEggs, {
    maximumFractionDigits: 1,
  });
  const verb = difference > 0 ? adjustment.more : adjustment.less;

  return `${adjustment.ideal} ${ideal} ${adjustment.eggsWord}: ${verb} ${fmt.mass(
    Math.abs(difference),
    0,
  )}.`;
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-3 last:border-b-0">
      <dt className={cn('text-sm', strong ? 'font-semibold text-ink' : 'text-ink-muted')}>
        {label}
      </dt>
      <dd
        data-numeric
        className={cn(
          'tabular-nums text-ink',
          strong ? 'font-display text-2xl font-semibold' : 'text-sm font-semibold',
        )}
      >
        {value}
      </dd>
    </div>
  );
}
