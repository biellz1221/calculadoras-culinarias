'use client';

import { useId } from 'react';

import { MassField } from '@/components/field';
import type { IngredientLine, IngredientRole } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { useFormatters } from '@/lib/use-formatters';

interface IngredientLinesProps {
  lines: readonly IngredientLine[];
  onChange: (lines: readonly IngredientLine[]) => void;
  dict: PicklesDictionary;
  locale: Locale;
  /** Salga direta não leva água, então o papel some da tela. */
  allowLiquid?: boolean;
}

/**
 * Lista livre do que vai para o pote.
 *
 * Cada linha declara se é sólido ou líquido, e é só isso que a conta precisa
 * saber: sólidos somam o peso dos vegetais, líquidos somam a água. O motor não
 * muda, muda só de onde os dois pesos vêm.
 */
export function IngredientLines({
  lines,
  onChange,
  dict,
  locale,
  allowLiquid = true,
}: IngredientLinesProps) {
  const fmt = useFormatters(locale);
  const groupId = useId();

  const solids = sumRole(lines, 'solid');
  const liquids = sumRole(lines, 'liquid');

  function update(id: string, patch: Partial<IngredientLine>) {
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function add() {
    onChange([
      ...lines,
      { id: `${groupId}-${lines.length}-${solids + liquids}`, name: '', grams: 0, role: 'solid' },
    ]);
  }

  function remove(id: string) {
    onChange(lines.filter((line) => line.id !== id));
  }

  return (
    <div className="mt-4">
      <ul className="flex flex-col gap-3">
        {lines.map((line, index) => (
          <li key={line.id} className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-40 flex-1 flex-col gap-1.5">
              <span className="text-sm text-ink-muted">
                {`${dict.ingredients.name} ${index + 1}`}
              </span>
              <input
                type="text"
                value={line.name}
                placeholder={dict.ingredients.namePlaceholder}
                onChange={(event) => update(line.id, { name: event.target.value })}
                className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>

            {/* NumberField mantém o sufixo de unidade fora do rótulo; dentro
                dele, "Peso" viraria "Peso g" no nome acessível do campo. */}
            <MassField
              label={dict.ingredients.amount}
              grams={line.grams}
              onChange={(grams) => update(line.id, { grams })}
              step={10}
              width="w-24"
            />

            {allowLiquid && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-ink-muted">{dict.ingredients.role}</span>
                <select
                  value={line.role}
                  onChange={(event) =>
                    update(line.id, { role: event.target.value as IngredientRole })
                  }
                  className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
                >
                  <option value="solid">{dict.ingredients.solid}</option>
                  <option value="liquid">{dict.ingredients.liquid}</option>
                </select>
              </label>
            )}

            <button
              type="button"
              onClick={() => remove(line.id)}
              aria-label={`${dict.ingredients.remove}: ${line.name || `${dict.ingredients.name} ${index + 1}`}`}
              className="rounded-full border border-rule px-3 py-2 text-sm text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              <span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
      </ul>

      {lines.length === 0 && (
        <p className="text-sm text-ink-muted">{dict.ingredients.empty}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-rule bg-surface px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-deep"
        >
          {`+ ${dict.ingredients.add}`}
        </button>

        {lines.length > 0 && (
          <p data-numeric className="text-sm tabular-nums text-ink-muted">
            <Total label={dict.ingredients.totalSolids} value={fmt.mass(solids)} />
            {allowLiquid && (
              <>
                {' · '}
                <Total label={dict.ingredients.totalLiquids} value={fmt.mass(liquids)} />
              </>
            )}
          </p>
        )}
      </div>

      {allowLiquid && (
        <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
          {dict.ingredients.roleHint}
        </p>
      )}
    </div>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className={cn('label-caps mr-1.5 text-ink-muted/70')}>{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </span>
  );
}

function sumRole(lines: readonly IngredientLine[], role: IngredientRole): number {
  return lines
    .filter((line) => line.role === role)
    .reduce((total, line) => total + (Number.isFinite(line.grams) ? line.grams : 0), 0);
}
