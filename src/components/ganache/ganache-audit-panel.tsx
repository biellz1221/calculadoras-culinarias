'use client';

import { useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { GANACHE_TEXTURES } from '@/data/ganache/textures';
import { getDictionary } from '@/i18n';
import type { GanacheDictionary } from '@/i18n/dictionaries/ganache';
import type { Locale } from '@/i18n/locales';
import { auditGanache, type GanacheAuditInput } from '@/lib/ganache/audit';

/**
 * Conferir uma ganache já emulsionada contra a tabela do Wybauw.
 *
 * O campo da base fala em "substâncias moles" e não em creme porque é o que a
 * tabela diz: licor e glicose entram na mesma base 100, e quem somar só o creme
 * erra a proporção sem errar nenhuma conta.
 */
export function GanacheAuditPanel({
  dict,
  locale,
}: {
  dict: GanacheDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);

  const [input, setInput] = useState<GanacheAuditInput>({
    textureId: 'moulded',
    softGrams: 100,
    chocolateGrams: 120,
    butterGrams: 14,
  });

  const result = useMemo(() => auditGanache(input), [input]);

  function set(patch: Partial<GanacheAuditInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6">
        <Segmented
          legend={copy.textureLabel}
          value={input.textureId}
          onChange={(textureId) => set({ textureId })}
          options={GANACHE_TEXTURES.map((texture) => ({
            value: texture.id,
            label: dict.textures[texture.id as keyof GanacheDictionary['textures']],
          }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <MassField
          label={copy.soft}
          grams={input.softGrams}
          onChange={(softGrams) => set({ softGrams })}
          step={25}
          hint={copy.softHint}
        />
        <MassField
          label={copy.chocolate}
          grams={input.chocolateGrams}
          onChange={(chocolateGrams) => set({ chocolateGrams })}
          step={25}
        />
        <MassField
          label={copy.butter}
          grams={input.butterGrams}
          onChange={(butterGrams) => set({ butterGrams })}
          step={5}
        />
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            chocolateRatio: copy.chocolateRatio,
            butterRatio: copy.butterRatio,
            chocolate: copy.chocolateSubject,
            butter: copy.butterSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />
      </section>
    </div>
  );
}
