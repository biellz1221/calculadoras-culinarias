'use client';

import { useMemo, useState } from 'react';

import { MassField, NumberField, Segmented } from '@/components/field';
import { MetricRow } from '@/components/range-badge';
import { isBeyondHardLimit, statusFor } from '@/data/bread/ranges';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import type { Locale } from '@/i18n/locales';
import {
  flourGramsOf,
  parseRecipeText,
  scaleRecipe,
  type LineRole,
  type ScaleLine,
  type ScaleTarget,
} from '@/lib/bread/scale';
import { useFormatters } from '@/lib/use-formatters';

type TargetKind = ScaleTarget['kind'];

const ROLES: readonly LineRole[] = ['flour', 'water', 'salt', 'other'];

/**
 * Escalar uma receita que a pessoa já tem (FR-013).
 *
 * O fluxo é em dois passos de propósito: primeiro a tabela do que foi lido do
 * texto colado, com o papel de cada linha editável, e só então a receita
 * escalada. O leitor de texto acerta a maior parte e vai errar em alguma —
 * mostrar o que ele entendeu, antes de escalar, é o que transforma um erro
 * silencioso num clique de correção.
 */
export function ScalePanel({
  dict,
  locale,
}: {
  dict: BreadDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const copy = dict.scale;

  const [text, setText] = useState('');
  const [overrides, setOverrides] = useState<Record<string, LineRole>>({});
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());

  const [kind, setKind] = useState<TargetKind>('flour');
  const [flourGrams, setFlourGrams] = useState(500);
  const [totalGrams, setTotalGrams] = useState(1000);
  const [unitCount, setUnitCount] = useState(8);
  const [unitGrams, setUnitGrams] = useState(90);

  /** O que foi lido, já com as correções de papel e as linhas removidas. */
  const lines = useMemo<ScaleLine[]>(
    () =>
      parseRecipeText(text)
        .filter((line) => !removed.has(line.id))
        .map((line) => ({ ...line, role: overrides[line.id] ?? line.role })),
    [text, overrides, removed],
  );

  const target = useMemo<ScaleTarget>(() => {
    if (kind === 'total') return { kind: 'total', grams: totalGrams };
    if (kind === 'units') return { kind: 'units', count: unitCount, unitGrams };
    return { kind: 'flour', grams: flourGrams };
  }, [kind, flourGrams, totalGrams, unitCount, unitGrams]);

  const hasFlour = flourGramsOf(lines) > 0;
  const recipe = useMemo(() => scaleRecipe(lines, target), [lines, target]);

  const usesMilliliters = lines.some((line) => line.fromMilliliters);

  return (
    <div className="mt-8">
      <label className="block">
        <span className="text-sm text-ink-muted">{copy.inputLabel}</span>
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setOverrides({});
            setRemoved(new Set());
          }}
          rows={8}
          placeholder={copy.placeholder}
          className="mt-2 w-full rounded-card border border-rule bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-ink focus:border-accent focus:outline-none"
        />
      </label>

      {text.trim().length > 0 && lines.length === 0 && (
        <p className="mt-3 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
          {copy.nothingRead}
        </p>
      )}

      {lines.length > 0 && (
        <>
          <section className="mt-8">
            <h3 className="label-caps text-accent-deep">{copy.readTitle}</h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
              {copy.readLead}
            </p>

            <ul className="mt-4 divide-y divide-rule rounded-card border border-rule bg-surface">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-ink">{line.name}</span>
                  <span
                    data-numeric
                    className="tabular-nums font-semibold text-ink-soft"
                  >
                    {fmt.mass(line.grams)}
                  </span>

                  <label className="flex items-center gap-2">
                    <span className="sr-only">{`${copy.roleLabel}: ${line.name}`}</span>
                    <select
                      value={line.role}
                      onChange={(event) =>
                        setOverrides((current) => ({
                          ...current,
                          [line.id]: event.target.value as LineRole,
                        }))
                      }
                      className="rounded-sm border border-rule bg-paper px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {copy.roles[role]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setRemoved((current) => new Set(current).add(line.id))
                    }
                    aria-label={`${copy.removeLine}: ${line.name}`}
                    className="rounded-full border border-rule px-2.5 py-1 text-sm text-ink-muted transition-colors hover:border-danger hover:text-danger"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>

            {usesMilliliters && (
              <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
                {copy.millilitersNote}
              </p>
            )}
          </section>

          <fieldset className="mt-8">
            <Segmented
              legend={copy.targetLabel}
              value={kind}
              onChange={setKind}
              options={[
                { value: 'flour' as const, label: copy.byFlour },
                { value: 'total' as const, label: copy.byTotal },
                { value: 'units' as const, label: copy.byUnits },
              ]}
            />

            <div className="mt-4 flex flex-wrap items-end gap-4">
              {kind === 'flour' && (
                <MassField
                  label={copy.newFlour}
                  grams={flourGrams}
                  onChange={setFlourGrams}
                />
              )}
              {kind === 'total' && (
                <MassField
                  label={copy.newTotal}
                  grams={totalGrams}
                  onChange={setTotalGrams}
                />
              )}
              {kind === 'units' && (
                <>
                  <NumberField
                    label={dict.target.unitsCount}
                    value={unitCount}
                    onChange={setUnitCount}
                    step={1}
                    min={1}
                  />
                  <MassField
                    label={dict.target.unitWeight}
                    grams={unitGrams}
                    onChange={setUnitGrams}
                  />
                </>
              )}
            </div>

            {kind === 'flour' && !hasFlour && (
              <p className="mt-3 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
                {copy.noFlourTarget}
              </p>
            )}
          </fieldset>

          <section aria-live="polite" className="mt-8">
            <h3 className="label-caps text-accent-deep">{copy.resultTitle}</h3>

            <div className="mt-4 overflow-x-auto rounded-card border border-rule bg-surface">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{copy.resultTitle}</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="label-caps px-4 py-3 text-ink-muted">
                      {dict.table.ingredient}
                    </th>
                    <th
                      scope="col"
                      className="label-caps px-4 py-3 text-right text-ink-muted"
                    >
                      {dict.table.amount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.lines.map((line) => (
                    <tr key={line.id} className="border-b border-rule/70 last:border-b-0">
                      <th
                        scope="row"
                        className="px-4 py-2.5 text-left font-normal text-ink"
                      >
                        {line.name}
                      </th>
                      <td
                        data-numeric
                        className="px-4 py-2.5 text-right font-bold tabular-nums text-ink"
                      >
                        {fmt.mass(line.grams)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-rule-strong bg-paper-shade/60">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">
                      {dict.table.doughTotal}
                    </th>
                    <td
                      data-numeric
                      className="px-4 py-3 text-right font-bold tabular-nums text-ink"
                    >
                      {fmt.mass(recipe.totalGrams)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {recipe.analysis ? (
              <div className="mt-6">
                <Metric
                  label={dict.balance.hydration}
                  percent={recipe.analysis.hydration}
                  rule={recipe.analysis.hydrationRule}
                  note={dict.notes.hydration}
                  dict={dict}
                  locale={locale}
                />
                <Metric
                  label={dict.balance.salt}
                  percent={recipe.analysis.salt}
                  rule={recipe.analysis.saltRule}
                  note={dict.notes.salt}
                  dict={dict}
                  locale={locale}
                />
              </div>
            ) : (
              <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink-muted">
                {copy.noAnalysis}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

/** Uma métrica da leitura em porcentagem de padeiro, com a faixa da fonte. */
function Metric({
  label,
  percent,
  rule,
  note,
  dict,
  locale,
}: {
  label: string;
  percent: number;
  rule: Parameters<typeof statusFor>[1];
  note: string;
  dict: BreadDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const status = statusFor(percent, rule);
  const beyond = isBeyondHardLimit(percent, rule);

  return (
    <MetricRow
      label={label}
      value={fmt.percent(percent)}
      status={status}
      statusLabel={beyond ? dict.balance.hardLimit : dict.balance.status[status]}
      beyondHardLimit={beyond}
      range={`${dict.balance.recommended}: ${fmt.percent(rule.min)} – ${fmt.percent(rule.max)}`}
      note={status === 'in' ? undefined : note}
    />
  );
}
