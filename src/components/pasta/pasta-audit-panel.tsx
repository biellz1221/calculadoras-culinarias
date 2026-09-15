'use client';

import { useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { getDictionary } from '@/i18n';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import type { Locale } from '@/i18n/locales';
import { auditPasta, type PastaAuditInput } from '@/lib/pasta/audit';

/**
 * Conferir a massa que a pessoa já sova.
 *
 * A escolha da base não é preferência de interface: massa de ovo e massa de
 * água são lidas por réguas diferentes, e aplicar uma na outra dá número certo
 * sobre a pergunta errada.
 */
export function PastaAuditPanel({
  dict,
  locale,
}: {
  dict: PastaDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);

  const [input, setInput] = useState<PastaAuditInput>({
    base: 'egg',
    flourGrams: 300,
    eggGrams: 150,
    waterGrams: 130,
  });

  const result = useMemo(() => auditPasta(input), [input]);

  function set(patch: Partial<PastaAuditInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6">
        <Segmented
          legend={copy.baseLabel}
          value={input.base}
          onChange={(base) => set({ base })}
          options={[
            { value: 'egg' as const, label: copy.eggBase },
            { value: 'water' as const, label: copy.waterBase },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <MassField
          label={copy.flour}
          grams={input.flourGrams}
          onChange={(flourGrams) => set({ flourGrams })}
          step={25}
        />

        {input.base === 'egg' ? (
          <MassField
            label={copy.egg}
            grams={input.eggGrams}
            onChange={(eggGrams) => set({ eggGrams })}
            step={25}
            hint={copy.eggHint}
          />
        ) : (
          <MassField
            label={copy.water}
            grams={input.waterGrams}
            onChange={(waterGrams) => set({ waterGrams })}
            step={10}
          />
        )}
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            flourPerEgg: copy.flourPerEgg,
            waterHydration: copy.waterHydration,
            flour: copy.flourSubject,
            water: copy.waterSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />
      </section>
    </div>
  );
}
