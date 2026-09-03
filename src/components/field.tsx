'use client';

import { useId } from 'react';

import { cn } from '@/lib/cn';
import { usePreferences } from '@/lib/preferences';
import { GRAMS_PER_OUNCE, gramsToOunces } from '@/lib/units';

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
            'rounded-sm border border-rule bg-surface px-3 py-2 tabular-nums text-ink focus:border-accent focus:outline-none',
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

interface MassFieldProps {
  label: string;
  /** O valor real, sempre em gramas: é o que a calculadora usa. */
  grams: number;
  onChange: (grams: number) => void;
  /** Passo no sistema métrico; no imperial usamos um passo próprio de onça. */
  step?: number;
  hint?: string;
  width?: string;
}

/**
 * Campo de massa que fala a unidade do visitante.
 *
 * O estado continua em gramas. Este componente só traduz na entrada e na saída,
 * porque um campo que exibe onças e exige que a pessoa digite gramas é pior do
 * que não ter a opção de onças.
 */
export function MassField({
  label,
  grams,
  onChange,
  step = 10,
  hint,
  width,
}: MassFieldProps) {
  const { units } = usePreferences();
  const imperial = units === 'imperial';

  const display = imperial
    ? Math.round(gramsToOunces(grams) * 100) / 100
    : Math.round(grams * 10) / 10;

  return (
    <NumberField
      label={label}
      value={display}
      onChange={(value) =>
        onChange(imperial ? value * GRAMS_PER_OUNCE : value)
      }
      suffix={imperial ? 'oz' : 'g'}
      step={imperial ? 0.25 : step}
      hint={hint}
      width={width}
    />
  );
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
                selected && !emphasis && 'border-accent-deep bg-accent-tint text-accent-deep',
                !selected &&
                  'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent-deep',
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
