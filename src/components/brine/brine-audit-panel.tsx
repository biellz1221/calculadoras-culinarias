'use client';

import { useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { BRINE_METHODS, getMethod } from '@/data/brine/methods';
import { getDictionary } from '@/i18n';
import type { BrineDictionary } from '@/i18n/dictionaries/brine';
import type { Locale } from '@/i18n/locales';
import { auditBrine, type BrineAuditInput } from '@/lib/brine/audit';

/**
 * Conferir a salmoura que já está na geladeira.
 *
 * A comparação é sempre com a receita do método escolhido, e não com uma faixa
 * nossa: o Modernist publica quantidades, não intervalos. Trocar de método muda
 * a régua inteira, e é por isso que ele vem antes dos pesos na tela.
 */
export function BrineAuditPanel({
  dict,
  locale,
}: {
  dict: BrineDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);

  const [input, setInput] = useState<BrineAuditInput>({
    methodId: 'equilibrium-poultry',
    proteinGrams: 2000,
    saltGrams: 12,
    liquidGrams: 200,
    sugarGrams: 0,
  });

  const result = useMemo(() => auditBrine(input), [input]);
  const method = getMethod(input.methodId);

  function set(patch: Partial<BrineAuditInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="mt-8">
      <p className="max-w-prose leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mt-6">
        <Segmented
          legend={copy.methodLabel}
          value={input.methodId}
          onChange={(methodId) => set({ methodId })}
          options={BRINE_METHODS.map((item) => ({
            value: item.id,
            label: dict.methods[item.id as keyof BrineDictionary['methods']],
          }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <MassField
          label={copy.protein}
          grams={input.proteinGrams}
          onChange={(proteinGrams) => set({ proteinGrams })}
          step={100}
        />
        <MassField
          label={copy.salt}
          grams={input.saltGrams}
          onChange={(saltGrams) => set({ saltGrams })}
          step={1}
        />

        {/* Método seco não tem líquido nem açúcar na fonte, e um campo que não
            entra em conta nenhuma só faz a pessoa procurar o resultado dele. */}
        {method && method.liquid > 0 && (
          <MassField
            label={copy.liquid}
            grams={input.liquidGrams}
            onChange={(liquidGrams) => set({ liquidGrams })}
            step={50}
          />
        )}
        {method && method.sugar > 0 && (
          <MassField
            label={copy.sugar}
            grams={input.sugarGrams}
            onChange={(sugarGrams) => set({ sugarGrams })}
            step={5}
          />
        )}
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            saltRatio: copy.saltRatio,
            liquidRatio: copy.liquidRatio,
            sugarRatio: copy.sugarRatio,
            salt: copy.saltSubject,
            liquid: copy.liquidSubject,
            sugar: copy.sugarSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />
      </section>
    </div>
  );
}
