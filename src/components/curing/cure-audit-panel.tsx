'use client';

import { useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { CURE_SALTS } from '@/data/curing/cures';
import type { CuringMethod } from '@/data/curing/types';
import { getDictionary } from '@/i18n';
import type { CuringDictionary } from '@/i18n/dictionaries/curing';
import type { Locale } from '@/i18n/locales';
import { auditCure, type CuringAuditInput } from '@/lib/curing/audit';

const METHODS: readonly CuringMethod[] = ['comminuted', 'dry'];

/**
 * Conferir o que já está pesado.
 *
 * É a mesma conta da calculadora, lida ao contrário, e nenhum número novo
 * entra: piso, teto e fração de nitrito são os que já estão na página. Numa
 * calculadora em que errar dá botulismo, a segunda verdade sobre um número é
 * pior do que a ausência de uma ferramenta.
 */
export function CureAuditPanel({
  dict,
  locale,
}: {
  dict: CuringDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);

  const [input, setInput] = useState<CuringAuditInput>({
    meatGrams: 1000,
    cureId: 'cure-1',
    cureGrams: 2.4,
    method: 'comminuted',
  });

  const result = useMemo(() => auditCure(input), [input]);

  function set(patch: Partial<CuringAuditInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6 flex flex-col gap-6">
        <Segmented
          legend={copy.cureLabel}
          value={input.cureId}
          onChange={(cureId) => set({ cureId })}
          options={CURE_SALTS.map((item) => ({
            value: item.id,
            label: dict.cures[item.id as keyof CuringDictionary['cures']],
          }))}
        />

        <Segmented
          legend={copy.methodLabel}
          value={input.method}
          onChange={(method) => set({ method })}
          options={METHODS.map((value) => ({ value, label: dict.methods[value] }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <MassField
          label={copy.meat}
          grams={input.meatGrams}
          onChange={(meatGrams) => set({ meatGrams })}
          step={100}
        />
        <MassField
          label={copy.cureWeight}
          grams={input.cureGrams}
          onChange={(cureGrams) => set({ cureGrams })}
          step={0.1}
        />
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            ingoingPpm: copy.ingoingPpm,
            cure: copy.cureSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />
      </section>

      <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
        {copy.note}
      </p>
    </div>
  );
}
