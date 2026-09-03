'use client';

import { NumberField, Segmented } from '@/components/field';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';
import { formatLiters, formatMass, type MassUnit } from '@/lib/gelato/mass';
import {
  MAX_DENSITY,
  MAX_LITERS,
  MIN_DENSITY,
  MIN_LITERS,
} from '@/lib/gelato/recipe-state';

const SHORTCUTS = [0.5, 1, 2, 4, 6, 10] as const;

interface BatchControlProps {
  liters: number;
  density: number;
  unit: MassUnit;
  targetGrams: number;
  currentGrams: number;
  dict: GelatoDictionary;
  locale: Locale;
  onLitersChange: (liters: number) => void;
  onDensityChange: (density: number) => void;
  onScaleToBatch: () => void;
}

/**
 * O lote é o botão de escala da receita: mexer no volume ou na densidade
 * reescala todas as linhas, preservando as proporções.
 */
export function BatchControl(props: BatchControlProps) {
  const { dict, locale, liters, density, unit, targetGrams } = props;

  return (
    <section className="mt-8 rounded-card border border-rule bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="label-caps text-accent-deep">{dict.batch.title}</h2>
          <p data-numeric className="mt-2 font-display text-3xl leading-none font-semibold">
            {formatLiters(liters, locale)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-muted">{dict.batch.mass}</p>
          <p data-numeric className="mt-1 text-xl leading-none font-semibold text-ink">
            {formatMass(targetGrams, unit, locale)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-start gap-x-8 gap-y-5">
        <NumberField
          label={dict.batch.liters}
          value={liters}
          onChange={props.onLitersChange}
          min={MIN_LITERS}
          max={MAX_LITERS}
          step={0.25}
          suffix={dict.batch.litersUnit}
          width="w-24"
        />
        <NumberField
          label={dict.batch.density}
          value={density}
          onChange={props.onDensityChange}
          min={MIN_DENSITY}
          max={MAX_DENSITY}
          step={0.01}
          suffix={dict.batch.densityUnit}
          hint={dict.batch.densityHint}
          width="w-24"
        />
      </div>

      <div className="mt-6">
        <Segmented
          legend={dict.batch.shortcuts}
          value={String(liters)}
          onChange={(value) => props.onLitersChange(Number(value))}
          emphasis
          options={SHORTCUTS.map((value) => ({
            value: String(value),
            label: formatLiters(value, locale),
          }))}
        />
      </div>

      <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
        {dict.batch.rescaleHint}
      </p>

      <DriftNotice {...props} />
    </section>
  );
}

/**
 * Só aparece quando a receita foi editada à mão e a massa saiu da meta. A
 * tolerância é relativa: alguns gramas em 4 kg são arredondamento, não desvio.
 */
function DriftNotice({
  dict,
  locale,
  unit,
  targetGrams,
  currentGrams,
  onScaleToBatch,
}: BatchControlProps) {
  const drift = currentGrams - targetGrams;
  const tolerance = Math.max(0.5, targetGrams * 0.001);
  if (Math.abs(drift) <= tolerance) return null;

  const message = drift > 0 ? dict.batch.driftAbove : dict.batch.driftBelow;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-warn-tint px-4 py-3">
      <p className="text-sm leading-snug text-ink">
        {message}{' '}
        <strong className="font-semibold tabular-nums">
          {formatMass(Math.abs(drift), unit, locale)}
        </strong>
        .
      </p>
      <button
        type="button"
        onClick={onScaleToBatch}
        className="shrink-0 rounded-full border border-ink bg-ink px-3.5 py-1.5 text-sm font-semibold text-paper transition-opacity hover:opacity-85"
      >
        {dict.batch.scaleToBatch}
      </button>
    </div>
  );
}
