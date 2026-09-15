'use client';

import { useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { getDictionary } from '@/i18n';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';
import { auditPickles, type PicklesAuditInput } from '@/lib/pickles/audit';

/**
 * Conferir o sal de um pote que já está montado.
 *
 * A calculadora acima responde "quanto sal eu ponho". Esta seção responde à
 * pergunta seguinte, que é a que chega por mensagem: já pus, está certo? As
 * duas leituras aparecem juntas de propósito — a mesma colher de sal é 2% da
 * água e 1% do pote, e é o pote que fermenta.
 */
export function SaltAudit({
  dict,
  locale,
}: {
  dict: PicklesDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);

  const [input, setInput] = useState<PicklesAuditInput>({
    mode: 'brine',
    vegetableGrams: 1000,
    waterGrams: 1000,
    saltGrams: 20,
  });

  const result = useMemo(() => auditPickles(input), [input]);

  function set(patch: Partial<PicklesAuditInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6">
        <Segmented
          legend={copy.modeLabel}
          value={input.mode}
          onChange={(mode) => set({ mode })}
          options={[
            { value: 'brine' as const, label: copy.brineMode },
            { value: 'dry-salt' as const, label: copy.dryMode },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <MassField
          label={copy.vegetables}
          grams={input.vegetableGrams}
          onChange={(vegetableGrams) => set({ vegetableGrams })}
          step={50}
        />

        {input.mode === 'brine' && (
          <MassField
            label={copy.water}
            grams={input.waterGrams}
            onChange={(waterGrams) => set({ waterGrams })}
            step={50}
          />
        )}

        <MassField
          label={copy.salt}
          grams={input.saltGrams}
          onChange={(saltGrams) => set({ saltGrams })}
          step={5}
        />
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            saltOfTotal: copy.saltOfTotal,
            saltOfWater: copy.saltOfWater,
            drySalt: copy.drySaltReading,
            salt: copy.saltSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />
      </section>

      <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
        {copy.safetyNote}
      </p>
    </div>
  );
}
