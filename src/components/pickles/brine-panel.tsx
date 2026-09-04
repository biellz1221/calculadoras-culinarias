'use client';

import { IngredientLines } from './ingredient-lines';
import { ResultRow, SalinityMetric } from './result-row';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField, Segmented } from '@/components/field';
import { CLIMATES, RANGES } from '@/data/pickles/ranges';
import type { BrinePreset, BrineInput, DrySaltPreset } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { calculateBrine, calculateDrySalt } from '@/lib/pickles/brine';
import { brineInput, type BrineState } from '@/lib/pickles/state';

interface BrinePanelProps {
  preset: BrinePreset | DrySaltPreset;
  state: BrineState;
  onChange: (patch: Partial<BrineState>) => void;
  dict: PicklesDictionary;
  locale: Locale;
}

export function BrinePanel({ preset, state, onChange, dict, locale }: BrinePanelProps) {
  const fmt = useFormatters(locale);

  const isBrine = preset.mode === 'brine';

  const brine = calculateBrine({
    input: brineInput(state),
    saltPercent: state.saltPercent,
    basis: state.basis,
  });

  // Na salga direta o peso do vegetal pode vir do campo único ou da soma da
  // lista; o resto da conta é o mesmo.
  const dry = calculateDrySalt(
    state.inputKind === 'ingredients' ? brine.vegetableGrams : state.vegetableGrams,
    state.saltPercent,
  );
  const climate = CLIMATES[preset.climate];

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-6">
        <Segmented
          legend={dict.input.label}
          value={state.inputKind}
          onChange={(inputKind: BrineInput['kind']) => onChange({ inputKind })}
          options={
            isBrine
              ? [
                  { value: 'weights' as const, label: dict.input.byWeights },
                  { value: 'jar' as const, label: dict.input.byJar },
                  { value: 'ingredients' as const, label: dict.input.byIngredients },
                ]
              : [
                  { value: 'weights' as const, label: dict.input.byWeights },
                  { value: 'ingredients' as const, label: dict.input.byIngredients },
                ]
          }
        />

        {isBrine && (
          <Segmented
            legend={dict.basis.label}
            value={state.basis}
            onChange={(basis) => onChange({ basis })}
            options={[
              { value: 'total' as const, label: dict.basis.total },
              { value: 'water' as const, label: dict.basis.water },
            ]}
          />
        )}
      </div>

      {state.inputKind === 'ingredients' && (
        <IngredientLines
          lines={state.lines}
          onChange={(lines) => onChange({ lines })}
          dict={dict}
          locale={locale}
          allowLiquid={isBrine}
        />
      )}

      <div className="mt-6 flex flex-wrap items-start gap-5">
        {state.inputKind === 'weights' && (
          <MassField
            label={dict.input.vegetable}
            grams={state.vegetableGrams}
            onChange={(vegetableGrams) => onChange({ vegetableGrams })}
            step={50}
          />
        )}

        {isBrine && state.inputKind === 'weights' && (
          <MassField
            label={dict.input.water}
            grams={state.waterGrams}
            onChange={(waterGrams) => onChange({ waterGrams })}
            step={50}
          />
        )}

        {isBrine && state.inputKind === 'jar' && (
          <>
            <NumberField
              label={dict.input.jar}
              value={state.jarMilliliters}
              onChange={(jarMilliliters) => onChange({ jarMilliliters })}
              suffix="ml"
              step={100}
            />
            <NumberField
              label={dict.input.share}
              value={Math.round(state.vegetableShare * 100)}
              onChange={(value) => onChange({ vegetableShare: value / 100 })}
              suffix="%"
              step={5}
              max={100}
              hint={dict.input.shareHint}
            />
          </>
        )}

        <NumberField
          label={dict.input.saltPercent}
          value={state.saltPercent}
          onChange={(saltPercent) => onChange({ saltPercent })}
          suffix="%"
          step={0.1}
        />
      </div>

      <section aria-live="polite" className="mt-8">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        <dl className="mt-4 rounded-card border border-rule bg-surface px-5 py-2">
          <ResultRow
            label={dict.result.salt}
            value={fmt.mass(isBrine ? brine.saltGrams : dry.saltGrams)}
            strong
          />
          <ResultRow
            label={dict.result.vegetable}
            value={fmt.mass(isBrine ? brine.vegetableGrams : dry.vegetableGrams)}
          />
          {isBrine && (
            <>
              <ResultRow label={dict.result.water} value={fmt.mass(brine.waterGrams)} />
              <ResultRow label={dict.result.total} value={fmt.mass(brine.totalGrams)} />
            </>
          )}
          <ResultRow
            label={dict.result.days}
            value={`${fmt.number(preset.days[0])}–${fmt.number(preset.days[1])} ${dict.result.daysUnit}`}
          />
          <ResultRow
            label={dict.result.temperature}
            value={fmt.temperatureRange(climate.celsius)}
          />
        </dl>

        <div className="mt-6">
          {isBrine ? (
            <>
              <SalinityMetric
                label={`${dict.result.salt} ${dict.result.ofTotal}`}
                percent={brine.percentOfTotal}
                rule={RANGES['brine-total']}
                note={dict.notes.brineTotal}
                dict={dict}
                locale={locale}
              />
              <SalinityMetric
                label={`${dict.result.salt} ${dict.result.ofWater}`}
                percent={brine.percentOfWater}
                rule={RANGES['brine-water']}
                note={dict.notes.brineWater}
                dict={dict}
                locale={locale}
              />
            </>
          ) : (
            <SalinityMetric
              label={`${dict.result.salt} ${dict.result.ofVegetable}`}
              percent={dry.percentOfVegetable}
              rule={RANGES[preset.rangeKey]}
              note={dict.notes.drySalt}
              dict={dict}
              locale={locale}
            />
          )}
        </div>

        {isBrine && (
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
            {dict.basis.explain}
          </p>
        )}

        <CitationRef
          citations={[...preset.citations, ...climate.citations]}
          labels={dict.sources}
          className="mt-4 block"
        />
      </section>
    </div>
  );
}
