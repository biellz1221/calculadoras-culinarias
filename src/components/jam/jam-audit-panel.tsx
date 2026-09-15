'use client';

import { useId, useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField } from '@/components/field';
import { JAM_FRUITS } from '@/data/jam/fruits';
import { getDictionary } from '@/i18n';
import type { JamDictionary } from '@/i18n/dictionaries/jam';
import type { Locale } from '@/i18n/locales';
import { auditJam, type JamAuditInput } from '@/lib/jam/audit';
import { labelFor } from '@/lib/recipes/card';

/**
 * Conferir uma geleia já cozida contra a receita publicada para aquela fruta.
 *
 * A fruta vem primeiro porque ela é quem escolhe a régua: cada uma tem a sua
 * receita, e as que nenhum livro cobre caem na norma. A tela diz qual das três
 * respondeu — uma receita do Blue Chair e o mínimo legal de geleia extra não
 * são a mesma autoridade.
 */
export function JamAuditPanel({
  dict,
  locale,
}: {
  dict: JamDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);
  const selectId = useId();

  const [fruitId, setFruitId] = useState('strawberry');
  const [amounts, setAmounts] = useState<JamAuditInput>({
    fruitGrams: 1000,
    sugarGrams: 600,
    pectinGrams: 0,
  });

  const fruit = JAM_FRUITS.find((item) => item.id === fruitId) ?? JAM_FRUITS[0]!;
  const result = useMemo(() => auditJam(fruit, amounts), [fruit, amounts]);

  function set(patch: Partial<JamAuditInput>) {
    setAmounts((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={selectId} className="text-sm text-ink-muted">
            {copy.fruitLabel}
          </label>
          <select
            id={selectId}
            value={fruitId}
            onChange={(event) => setFruitId(event.target.value)}
            className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
          >
            {JAM_FRUITS.map((item) => (
              <option key={item.id} value={item.id}>
                {labelFor(dict.fruits, item.id)}
              </option>
            ))}
          </select>
        </div>

        <MassField
          label={copy.fruit}
          grams={amounts.fruitGrams}
          onChange={(fruitGrams) => set({ fruitGrams })}
          step={100}
          hint={copy.fruitHint}
        />
        <MassField
          label={copy.sugar}
          grams={amounts.sugarGrams}
          onChange={(sugarGrams) => set({ sugarGrams })}
          step={50}
        />
        <MassField
          label={copy.pectin}
          grams={amounts.pectinGrams}
          onChange={(pectinGrams) => set({ pectinGrams })}
          step={1}
          hint={copy.pectinHint}
        />
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            sugarRatio: copy.sugarRatio,
            pectinPercent: copy.pectinPercent,
            sugar: copy.sugarSubject,
            pectin: copy.pectinSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />

        {/* Qual régua respondeu muda o peso da resposta, e a página nomeia. */}
        <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
          {copy.basis[result.basis]}
        </p>
      </section>
    </div>
  );
}
