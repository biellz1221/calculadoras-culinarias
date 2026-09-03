'use client';

import { useState } from 'react';

import { ResultRow, SalinityMetric } from './result-row';
import { CitationRef } from '@/components/citation';
import { MassField, NumberField, Segmented } from '@/components/field';
import {
  CLIMATES,
  DEFAULT_VEGETABLE_SHARE,
  RANGES,
} from '@/data/pickles/ranges';
import { IngredientLines } from './ingredient-lines';
import type {
  BrineInput,
  BrinePreset,
  DrySaltPreset,
  IngredientLine,
  SaltBasis,
} from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { calculateBrine, calculateDrySalt } from '@/lib/pickles/brine';

interface BrinePanelProps {
  preset: BrinePreset | DrySaltPreset;
  dict: PicklesDictionary;
  locale: Locale;
}

/**
 * A lista livre começa preenchida com o mesmo lote dos campos de peso, para a
 * troca de modo não zerar o resultado que a pessoa estava vendo.
 */
function startingLines(isBrine: boolean): IngredientLine[] {
  const solid: IngredientLine = {
    id: 'solid-1',
    name: '',
    grams: 1000,
    role: 'solid',
  };

  if (!isBrine) return [solid];

  return [solid, { id: 'liquid-1', name: '', grams: 1000, role: 'liquid' }];
}

export function BrinePanel({ preset, dict, locale }: BrinePanelProps) {
  const fmt = useFormatters(locale);

  const isBrine = preset.mode === 'brine';

  const [inputKind, setInputKind] = useState<BrineInput['kind']>('weights');
  const [vegetableGrams, setVegetableGrams] = useState(1000);
  const [waterGrams, setWaterGrams] = useState(1000);
  const [jarMilliliters, setJarMilliliters] = useState(1000);
  const [vegetableShare, setVegetableShare] = useState(
    isBrine ? preset.vegetableShare : DEFAULT_VEGETABLE_SHARE,
  );
  const [saltPercent, setSaltPercent] = useState(preset.saltPercent);
  const [basis, setBasis] = useState<SaltBasis>(
    isBrine ? preset.basis : 'total',
  );
  const [lines, setLines] = useState<readonly IngredientLine[]>(() =>
    startingLines(isBrine),
  );

  const input: BrineInput =
    inputKind === 'ingredients'
      ? { kind: 'ingredients', lines }
      : inputKind === 'weights'
        ? { kind: 'weights', vegetableGrams, waterGrams }
        : { kind: 'jar', jarMilliliters, vegetableShare };

  const brine = calculateBrine({ input, saltPercent, basis });

  // Na salga direta o peso do vegetal pode vir do campo único ou da soma da
  // lista; o resto da conta é o mesmo.
  const dry = calculateDrySalt(
    inputKind === 'ingredients' ? brine.vegetableGrams : vegetableGrams,
    saltPercent,
  );
  const climate = CLIMATES[preset.climate];

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-6">
        <Segmented
          legend={dict.input.label}
          value={inputKind}
          onChange={setInputKind}
          options={
            isBrine
              ? [
                  { value: 'weights', label: dict.input.byWeights },
                  { value: 'jar', label: dict.input.byJar },
                  { value: 'ingredients', label: dict.input.byIngredients },
                ]
              : [
                  { value: 'weights', label: dict.input.byWeights },
                  { value: 'ingredients', label: dict.input.byIngredients },
                ]
          }
        />

        {isBrine && (
          <Segmented
            legend={dict.basis.label}
            value={basis}
            onChange={setBasis}
            options={[
              { value: 'total', label: dict.basis.total },
              { value: 'water', label: dict.basis.water },
            ]}
          />
        )}
      </div>

      {inputKind === 'ingredients' && (
        <IngredientLines
          lines={lines}
          onChange={setLines}
          dict={dict}
          locale={locale}
          allowLiquid={isBrine}
        />
      )}

      <div className="mt-6 flex flex-wrap items-start gap-5">
        {inputKind === 'weights' && (
          <MassField
            label={dict.input.vegetable}
            grams={vegetableGrams}
            onChange={setVegetableGrams}
            step={50}
          />
        )}

        {isBrine && inputKind === 'weights' && (
          <MassField
            label={dict.input.water}
            grams={waterGrams}
            onChange={setWaterGrams}
            step={50}
          />
        )}

        {isBrine && inputKind === 'jar' && (
          <>
            <NumberField
              label={dict.input.jar}
              value={jarMilliliters}
              onChange={setJarMilliliters}
              suffix="ml"
              step={100}
            />
            <NumberField
              label={dict.input.share}
              value={Math.round(vegetableShare * 100)}
              onChange={(value) => setVegetableShare(value / 100)}
              suffix="%"
              step={5}
              max={100}
              hint={dict.input.shareHint}
            />
          </>
        )}

        <NumberField
          label={dict.input.saltPercent}
          value={saltPercent}
          onChange={setSaltPercent}
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
            value={fmt.mass(
              isBrine ? brine.vegetableGrams : dry.vegetableGrams,
            )}
          />
          {isBrine && (
            <>
              <ResultRow
                label={dict.result.water}
                value={fmt.mass(brine.waterGrams)}
              />
              <ResultRow
                label={dict.result.total}
                value={fmt.mass(brine.totalGrams)}
              />
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
