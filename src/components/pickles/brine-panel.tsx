'use client';

import { useState } from 'react';

import { ResultRow, SalinityMetric } from './result-row';
import { CitationRef } from '@/components/citation';
import { NumberField, Segmented } from '@/components/field';
import {
  CLIMATES,
  DEFAULT_VEGETABLE_SHARE,
  RANGES,
} from '@/data/pickles/ranges';
import type {
  BrineInput,
  BrinePreset,
  DrySaltPreset,
  SaltBasis,
} from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { formatGrams, formatNumber } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';
import { calculateBrine, calculateDrySalt } from '@/lib/pickles/brine';

interface BrinePanelProps {
  preset: BrinePreset | DrySaltPreset;
  dict: PicklesDictionary;
  locale: Locale;
}

export function BrinePanel({ preset, dict, locale }: BrinePanelProps) {
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

  const input: BrineInput =
    inputKind === 'weights'
      ? { kind: 'weights', vegetableGrams, waterGrams }
      : { kind: 'jar', jarMilliliters, vegetableShare };

  const brine = calculateBrine({ input, saltPercent, basis });
  const dry = calculateDrySalt(vegetableGrams, saltPercent);
  const climate = CLIMATES[preset.climate];

  return (
    <div className="mt-8">
      {isBrine && (
        <div className="flex flex-col gap-6">
          <Segmented
            legend={dict.input.label}
            value={inputKind}
            onChange={setInputKind}
            options={[
              { value: 'weights', label: dict.input.byWeights },
              { value: 'jar', label: dict.input.byJar },
            ]}
          />

          <Segmented
            legend={dict.basis.label}
            value={basis}
            onChange={setBasis}
            options={[
              { value: 'total', label: dict.basis.total },
              { value: 'water', label: dict.basis.water },
            ]}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-start gap-5">
        {(!isBrine || inputKind === 'weights') && (
          <NumberField
            label={dict.input.vegetable}
            value={vegetableGrams}
            onChange={setVegetableGrams}
            suffix="g"
            step={50}
          />
        )}

        {isBrine && inputKind === 'weights' && (
          <NumberField
            label={dict.input.water}
            value={waterGrams}
            onChange={setWaterGrams}
            suffix="g"
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
        <h2 className="label-caps text-brand-deep">{dict.result.title}</h2>

        <dl className="mt-4 rounded-card border border-rule bg-surface px-5 py-2">
          <ResultRow
            label={dict.result.salt}
            value={formatGrams(isBrine ? brine.saltGrams : dry.saltGrams, locale)}
            strong
          />
          <ResultRow
            label={dict.result.vegetable}
            value={formatGrams(
              isBrine ? brine.vegetableGrams : dry.vegetableGrams,
              locale,
            )}
          />
          {isBrine && (
            <>
              <ResultRow
                label={dict.result.water}
                value={formatGrams(brine.waterGrams, locale)}
              />
              <ResultRow
                label={dict.result.total}
                value={formatGrams(brine.totalGrams, locale)}
              />
            </>
          )}
          <ResultRow
            label={dict.result.days}
            value={`${formatNumber(preset.days[0], locale)}–${formatNumber(preset.days[1], locale)} ${dict.result.daysUnit}`}
          />
          <ResultRow
            label={dict.result.temperature}
            value={`${formatNumber(climate.celsius[0], locale)}–${formatNumber(climate.celsius[1], locale)} °C`}
          />
        </dl>

        <div className="mt-6">
          {isBrine ? (
            <>
              <SalinityMetric
                label={`${dict.result.salt} — ${dict.result.ofTotal}`}
                percent={brine.percentOfTotal}
                rule={RANGES['brine-total']}
                note={dict.notes.brineTotal}
                dict={dict}
                locale={locale}
              />
              <SalinityMetric
                label={`${dict.result.salt} — ${dict.result.ofWater}`}
                percent={brine.percentOfWater}
                rule={RANGES['brine-water']}
                note={dict.notes.brineWater}
                dict={dict}
                locale={locale}
              />
            </>
          ) : (
            <SalinityMetric
              label={`${dict.result.salt} — ${dict.result.ofVegetable}`}
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
