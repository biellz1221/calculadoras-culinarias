'use client';

import { useId } from 'react';

import { cn } from '@/lib/cn';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Unidade exibida ao lado do campo; fica fora do rótulo de propósito. */
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
  width?: string;
}

/**
 * Campo numérico dos formulários das calculadoras.
 *
 * O sufixo de unidade fica FORA do `<label>` e escondido do leitor de tela:
 * dentro dele, viraria parte do nome acessível do campo ("Água (g) g") e
 * quebraria qualquer busca por rótulo.
 */
export function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
  max,
  hint,
  width = 'w-32',
}: NumberFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

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
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
          className={cn(
            'rounded-sm border border-rule bg-surface px-3 py-2 tabular-nums text-ink focus:border-brand focus:outline-none',
            width,
          )}
        />
        {suffix && (
          <span aria-hidden="true" className="text-ink-muted">
            {suffix}
          </span>
        )}
      </span>
      {hint && (
        <p id={hintId} className="max-w-xs text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function clamp(value: number, min: number, max?: number): number {
  if (!Number.isFinite(value)) return min;
  const lower = Math.max(min, value);
  return max === undefined ? lower : Math.min(max, lower);
}

interface SegmentedProps<T extends string> {
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Realce forte para a escolha principal da tela. */
  emphasis?: boolean;
}

/** Grupo de botões que se comporta como um seletor. */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  emphasis = false,
}: SegmentedProps<T>) {
  return (
    <fieldset>
      <legend className="label-caps text-ink-muted">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                selected && emphasis && 'border-ink bg-ink text-paper',
                selected && !emphasis && 'border-brand-deep bg-brand-tint text-brand-deep',
                !selected &&
                  'border-rule bg-surface text-ink-soft hover:border-brand hover:text-brand-deep',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
