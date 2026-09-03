'use client';

import { useState } from 'react';

import { ResultRow } from './result-row';
import { CitationRef } from '@/components/citation';
import { NumberField } from '@/components/field';
import { RangeBadge } from '@/components/range-badge';
import { MIN_BRINE_ACIDITY, RANGES } from '@/data/pickles/ranges';
import type { VinegarPreset } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { calculateVinegarPickle } from '@/lib/pickles/vinegar';

interface VinegarPanelProps {
  preset: VinegarPreset;
  dict: PicklesDictionary;
  locale: Locale;
}

export function VinegarPanel({ preset, dict, locale }: VinegarPanelProps) {
  const fmt = useFormatters(locale);

  const [liquidGrams, setLiquidGrams] = useState(500);
  const [vinegarAcidity, setVinegarAcidity] = useState(preset.acidity);
  const [vinegarParts, setVinegarParts] = useState(preset.vinegarParts);
  const [waterParts, setWaterParts] = useState(preset.waterParts);
  const [saltPercent, setSaltPercent] = useState(preset.saltPercent);
  const [sugarPercent, setSugarPercent] = useState(preset.sugarPercent);

  const result = calculateVinegarPickle({
    liquidGrams,
    vinegarAcidity,
    vinegarParts,
    waterParts,
    saltPercent,
    sugarPercent,
  });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-start gap-5">
        <NumberField
          label={dict.input.liquid}
          value={liquidGrams}
          onChange={setLiquidGrams}
          suffix="ml"
          step={50}
        />
        <NumberField
          label={dict.input.acidity}
          value={vinegarAcidity}
          onChange={setVinegarAcidity}
          suffix="%"
          step={0.5}
          hint={dict.input.acidityHint}
          width="w-24"
        />
        <NumberField
          label={dict.input.vinegarParts}
          value={vinegarParts}
          onChange={setVinegarParts}
          step={0.25}
          width="w-24"
        />
        <NumberField
          label={dict.input.waterParts}
          value={waterParts}
          onChange={setWaterParts}
          step={0.25}
          width="w-24"
        />
        <NumberField
          label={dict.input.saltPercent}
          value={saltPercent}
          onChange={setSaltPercent}
          suffix="%"
          step={0.5}
          width="w-24"
        />
        <NumberField
          label={dict.input.sugarPercent}
          value={sugarPercent}
          onChange={setSugarPercent}
          suffix="%"
          step={0.5}
          width="w-24"
        />
      </div>

      <section aria-live="polite" className="mt-8">
        <h2 className="label-caps text-accent-deep">{dict.result.title}</h2>

        <dl className="mt-4 rounded-card border border-rule bg-surface px-5 py-2">
          <ResultRow
            label={dict.result.vinegar}
            value={fmt.mass(result.vinegarGrams)}
            strong
          />
          <ResultRow
            label={dict.result.water}
            value={fmt.mass(result.waterGrams)}
          />
          <ResultRow
            label={dict.result.salt}
            value={fmt.mass(result.saltGrams)}
          />
          <ResultRow
            label={dict.result.sugar}
            value={fmt.mass(result.sugarGrams)}
          />
          <ResultRow
            label={dict.result.days}
            value={`${fmt.number(preset.days[0])}–${fmt.number(preset.days[1])} ${dict.result.daysUnit}`}
          />
        </dl>

        <AcidityVerdict result={result} dict={dict} locale={locale} />

        <CitationRef
          citations={[...preset.citations, ...RANGES['vinegar-acidity'].citations]}
          labels={dict.sources}
          className="mt-4 block"
        />
      </section>
    </div>
  );
}

function AcidityVerdict({
  result,
  dict,
  locale,
}: {
  result: ReturnType<typeof calculateVinegarPickle>;
  dict: PicklesDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);

  const safe = result.status === 'ok';

  return (
    <div className="mt-6 border-t border-rule pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="font-display text-base font-semibold text-ink">
          {dict.result.acidity}
        </h3>
        <div className="flex items-center gap-3">
          <span data-numeric className="text-lg font-bold tabular-nums text-ink">
            {fmt.percent(result.brineAcidity, 2)}
          </span>
          <RangeBadge
            status={safe ? 'in' : 'below'}
            beyondHardLimit={!safe}
            label={
              result.status === 'ok'
                ? dict.vinegarStatus.ok
                : result.status === 'below-minimum'
                  ? dict.vinegarStatus.belowMinimum
                  : dict.vinegarStatus.unusable
            }
          />
        </div>
      </div>

      <p className="mt-1 text-xs text-ink-muted">
        {`${dict.status.recommended}: ≥ ${fmt.percent(MIN_BRINE_ACIDITY)}`}
      </p>

      {result.status !== 'ok' && (
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
          {result.status === 'below-minimum'
            ? dict.vinegarStatus.belowBody
            : dict.vinegarStatus.unusableBody}
        </p>
      )}

      {result.status === 'below-minimum' && (
        <p className="mt-2 text-sm text-ink">
          <span className="label-caps mr-2 text-ink-muted">
            {dict.vinegarStatus.minimum}
          </span>
          {result.minimumWaterPerVinegar === undefined
            ? dict.vinegarStatus.pureVinegar
            : `${fmt.number(result.minimumWaterPerVinegar, { maximumFractionDigits: 2 })} ${dict.vinegarStatus.minimumValue}`}
        </p>
      )}
    </div>
  );
}
