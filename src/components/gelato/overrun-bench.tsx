'use client';

import { useId, useState } from 'react';

import { CitationRef } from '@/components/citation';
import { NumberField } from '@/components/field';
import { RangeBadge } from '@/components/range-badge';
import {
  CORVITTO_LITRE_CITATIONS,
  CORVITTO_MIX_DENSITY,
  GELATO_OVERRUN,
  GELATO_OVERRUN_CITATIONS,
  ICE_EXPANSION_CITATIONS,
  INDUSTRIAL_OVERRUN_CITATIONS,
  LOW_FAT_OVERRUN_CEILING,
  MIX_DENSITY,
  MIX_DENSITY_CITATIONS,
  OVERRUN_METHOD_CITATIONS,
  litreGramsForOverrun,
  overrunFromWeights,
} from '@/data/gelato/aeration';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';
import { MAX_DENSITY, MIN_DENSITY } from '@/lib/gelato/recipe-state';
import { useFormatters } from '@/lib/use-formatters';

/**
 * A régua de bancada do overrun.
 *
 * É o que esta calculadora não fazia e podia: o balanceamento é o que entra na
 * panela, e o ar é o que a máquina acrescenta. Nenhuma planilha de
 * balanceamento dá esse número, mas uma balança e um copo dão — e a conta é de
 * Corvitto, p. 44.
 *
 * Duas perguntas separadas, e por isso dois blocos:
 *
 * 1. **Quanto entrou?** Dois pesos do mesmo recipiente, e a divisão responde.
 *    Não precisa de densidade nenhuma: o volume se cancela.
 * 2. **Quanto deveria pesar?** Aí sim entra a densidade da calda, porque a
 *    pergunta é sobre um litro. O campo repete o do lote de propósito: são
 *    perguntas diferentes, e esta seção tem de funcionar sozinha na impressão.
 */
export function OverrunBench({
  dict,
  locale,
}: {
  dict: GelatoDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const resultId = useId();
  const [mixGrams, setMixGrams] = useState(270);
  const [gelatoGrams, setGelatoGrams] = useState(200);
  const [targetPercent, setTargetPercent] = useState(GELATO_OVERRUN.target * 100);
  const [density, setDensity] = useState(MIX_DENSITY);

  const measured = overrunFromWeights(mixGrams, gelatoGrams);
  const litreGrams = litreGramsForOverrun(density, targetPercent / 100);
  const corvittoLitre = litreGramsForOverrun(
    CORVITTO_MIX_DENSITY,
    GELATO_OVERRUN.target,
  );

  const status =
    measured < GELATO_OVERRUN.min
      ? 'below'
      : measured > GELATO_OVERRUN.max
        ? 'above'
        : 'in';

  return (
    <div className="mt-6">
      <p className="max-w-prose leading-relaxed text-ink-soft">{dict.aeration.targetBody}</p>
      <CitationRef
        citations={GELATO_OVERRUN_CITATIONS}
        labels={dict.sources}
        className="mt-2 block"
      />

      <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">
        {dict.aeration.industrialBody}
      </p>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
        {`${dict.aeration.sorbetNote} (${fmt.percent(LOW_FAT_OVERRUN_CEILING * 100, 0)})`}
      </p>
      <CitationRef
        citations={INDUSTRIAL_OVERRUN_CITATIONS}
        labels={dict.sources}
        className="mt-2 block"
      />

      <h3 className="mt-10 font-display text-lg font-semibold text-ink">
        {dict.aeration.measureTitle}
      </h3>
      <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
        {dict.aeration.measureBody}
      </p>

      <section
        aria-live="polite"
        aria-labelledby={resultId}
        className="mt-5 rounded-card border border-rule bg-surface px-5 py-4"
      >
        <h4 id={resultId} className="sr-only">
          {dict.aeration.measuredLabel}
        </h4>

        <div className="flex flex-wrap items-start gap-5">
          <NumberField
            label={dict.aeration.mixLabel}
            value={mixGrams}
            onChange={setMixGrams}
            suffix="g"
            step={10}
          />
          <NumberField
            label={dict.aeration.gelatoLabel}
            value={gelatoGrams}
            onChange={setGelatoGrams}
            suffix="g"
            step={10}
          />
        </div>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
          {dict.aeration.measuredHint}
        </p>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-rule pt-3">
          <span className="text-sm font-semibold text-ink">
            {dict.aeration.measuredLabel}
          </span>
          <span className="flex items-baseline gap-3">
            <span data-numeric className="font-display text-3xl font-semibold text-ink">
              {fmt.percent(Math.max(0, measured) * 100, 0)}
            </span>
            <RangeBadge
              status={status}
              label={
                status === 'in'
                  ? dict.aeration.inRange
                  : status === 'above'
                    ? dict.aeration.aboveRange
                    : dict.aeration.belowRange
              }
            />
          </span>
        </div>
      </section>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
        {dict.aeration.sameEquation}
      </p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
        {dict.aeration.cupNote}
      </p>
      <CitationRef
        citations={OVERRUN_METHOD_CITATIONS}
        labels={dict.sources}
        className="mt-2 block"
      />

      {/* O caminho inverso: da meta para o peso que a balança deveria mostrar. */}
      <div className="mt-8 rounded-card border-2 border-accent-deep/25 bg-accent-tint/50 px-5 py-4">
        <div className="flex flex-wrap items-start gap-5">
          <NumberField
            label={dict.aeration.targetLabel}
            value={targetPercent}
            onChange={setTargetPercent}
            suffix="%"
            step={5}
            max={200}
          />
          <NumberField
            label={dict.aeration.densityLabel}
            value={density}
            onChange={setDensity}
            suffix={dict.batch.densityUnit}
            step={0.01}
            min={MIN_DENSITY}
            max={MAX_DENSITY}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-rule pt-3">
          <span className="text-sm font-semibold text-ink">
            {dict.aeration.resultLabel}
          </span>
          <span data-numeric className="font-display text-3xl font-semibold text-ink">
            {fmt.mass(litreGrams, 0)}
          </span>
        </div>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
          {dict.aeration.resultHint}
        </p>
        <CitationRef
          citations={MIX_DENSITY_CITATIONS}
          labels={dict.sources}
          className="mt-2 block"
        />
      </div>

      <h3 className="mt-10 font-display text-lg font-semibold text-ink">
        {dict.aeration.divergenceTitle}
      </h3>
      <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
        {dict.aeration.divergenceBody}
      </p>
      <dl className="mt-4 max-w-md">
        <Row
          label={`Clarke · ${fmt.number(MIX_DENSITY, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${dict.batch.densityUnit}`}
          value={fmt.mass(litreGramsForOverrun(MIX_DENSITY, GELATO_OVERRUN.target), 0)}
        />
        <Row
          label={`Corvitto · ${fmt.number(CORVITTO_MIX_DENSITY, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${dict.batch.densityUnit}`}
          value={fmt.mass(corvittoLitre, 0)}
        />
      </dl>
      <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
        {dict.aeration.divergenceDecision}
      </p>
      <CitationRef
        citations={[...MIX_DENSITY_CITATIONS, ...CORVITTO_LITRE_CITATIONS]}
        labels={dict.sources}
        className="mt-2 block"
      />

      <h3 className="mt-10 font-display text-lg font-semibold text-ink">
        {dict.aeration.iceTitle}
      </h3>
      <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">{dict.aeration.iceBody}</p>
      <CitationRef
        citations={ICE_EXPANSION_CITATIONS}
        labels={dict.sources}
        className="mt-2 block"
      />
    </div>
  );
}

/** Uma linha da comparação de densidades. O valor é peso de um litro. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-2 last:border-b-0">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd data-numeric className="text-sm font-semibold tabular-nums text-ink">
        {value}
      </dd>
    </div>
  );
}
