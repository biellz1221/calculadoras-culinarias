'use client';

import { useId, useState } from 'react';

import { YEAST_KEYS, type YeastKey } from '@/data/bread/types';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import { useFormatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';
import { convertYeast, driedLevainFor, levainSubstitution } from '@/lib/bread/yeast';
import { cn } from '@/lib/cn';

interface YeastConverterProps {
  dict: BreadDictionary;
  locale: Locale;
}

export function YeastConverter({ dict, locale }: YeastConverterProps) {
  const fmt = useFormatters(locale);

  const [amount, setAmount] = useState(15);
  const [from, setFrom] = useState<YeastKey>('yeast-fresh');
  const [to, setTo] = useState<YeastKey>('yeast-instant');
  const [flourGrams, setFlourGrams] = useState(500);

  const converted = convertYeast(amount, from, to);
  const levain = levainSubstitution(flourGrams);

  return (
    <div className="mt-8 grid gap-8 border-t border-rule pt-6 lg:grid-cols-2">
      <div>
        <div className="flex flex-wrap items-end gap-4">
          <GramsField
            label={dict.yeastTool.amount}
            value={amount}
            onChange={setAmount}
            step={0.5}
            width="w-24"
          />

          <YeastSelect
            label={dict.yeastTool.from}
            value={from}
            onChange={setFrom}
            dict={dict}
          />
          <YeastSelect
            label={dict.yeastTool.to}
            value={to}
            onChange={setTo}
            dict={dict}
          />
        </div>

        <p
          aria-live="polite"
          className="mt-6 rounded-card bg-brand-tint px-4 py-3 text-ink"
        >
          <span className="label-caps text-brand-deep">{dict.yeastTool.result}</span>
          <span
            data-numeric
            className="mt-1 block font-display text-2xl font-semibold tabular-nums"
          >
            {fmt.mass(converted)}
          </span>
          <span className="mt-1 block text-sm text-ink-muted">
            {dict.ingredients[to]}
          </span>
        </p>

        <h3 className="mt-8 font-display text-base font-semibold text-ink">
          {dict.yeastTool.timeHint}
        </h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
          {dict.yeastTool.timeBody}
        </p>
      </div>

      <div className="border-t border-rule pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <h3 className="font-display text-base font-semibold text-ink">
          {dict.yeastTool.levainTitle}
        </h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
          {dict.yeastTool.levainBody}
        </p>

        <div className="mt-5">
          <GramsField
            label={dict.yeastTool.flourLabel}
            value={flourGrams}
            onChange={setFlourGrams}
            step={50}
          />
        </div>

        <dl aria-live="polite" className="mt-5">
          <LevainRow
            label={dict.yeastTool.levainUse}
            value={fmt.mass(levain.levainGrams)}
            strong
          />
          <LevainRow
            label={dict.yeastTool.levainFlour}
            value={`− ${fmt.mass(levain.flourAdjustment)}`}
          />
          <LevainRow
            label={dict.yeastTool.levainWater}
            value={`− ${fmt.mass(levain.waterAdjustment)}`}
          />
          <LevainRow
            label={dict.yeastTool.dried}
            value={fmt.mass(driedLevainFor(levain.levainGrams))}
          />
        </dl>
      </div>
    </div>
  );
}

/** Campo em gramas; a unidade fica fora do label para não virar nome do campo. */
function GramsField({
  label,
  value,
  onChange,
  step,
  width = 'w-32',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step: number;
  width?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-ink-muted">
        {label}
      </label>
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
          className={cn(
            'rounded-sm border border-rule bg-surface px-3 py-2 tabular-nums text-ink focus:border-brand focus:outline-none',
            width,
          )}
        />
        <span aria-hidden="true" className="text-ink-muted">
          g
        </span>
      </span>
    </div>
  );
}

function LevainRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-2 last:border-b-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd
        data-numeric
        className={cn(
          'tabular-nums text-ink',
          strong ? 'text-lg font-bold' : 'text-sm font-semibold',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function YeastSelect({
  label,
  value,
  onChange,
  dict,
}: {
  label: string;
  value: YeastKey;
  onChange: (value: YeastKey) => void;
  dict: BreadDictionary;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as YeastKey)}
        className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-brand focus:outline-none"
      >
        {YEAST_KEYS.map((key) => (
          <option key={key} value={key}>
            {dict.ingredients[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
