'use client';

import { useId, useMemo, useState } from 'react';

import { AuditReport } from '@/components/audit/audit-report';
import { MassField, Segmented } from '@/components/field';
import { AGENTS, TEXTURE_IDS } from '@/data/gelling/agents';
import type { AgentId, TextureId } from '@/data/gelling/types';
import { getDictionary } from '@/i18n';
import type { GellingDictionary } from '@/i18n/dictionaries/gelling';
import type { Locale } from '@/i18n/locales';
import {
  auditGellingDose,
  texturesForDose,
  type GellingAuditInput,
} from '@/lib/gelling/audit';

/**
 * Conferir uma dose já usada — e, quando ela não bate, dizer o que ela faz.
 *
 * A segunda parte é o motivo de a seção existir. Quem dosou 0,8% de ágar
 * querendo molho não errou uma conta: fez um gel. Apontar em que textura a dose
 * cai responde melhor que apontar de quanto foi o desvio.
 */
export function DoseAuditPanel({
  dict,
  locale,
}: {
  dict: GellingDictionary;
  locale: Locale;
}) {
  const copy = dict.audit;
  const shared = getDictionary(locale);
  const selectId = useId();

  const [input, setInput] = useState<GellingAuditInput>({
    liquidGrams: 500,
    agentId: 'agar',
    agentGrams: 3.5,
    textureId: 'fluid-gel',
  });

  const result = useMemo(() => auditGellingDose(input), [input]);

  const percent =
    input.liquidGrams > 0 ? (input.agentGrams / input.liquidGrams) * 100 : 0;
  const elsewhere = useMemo(
    () =>
      texturesForDose(input.agentId, percent).filter(
        (textureId) => textureId !== input.textureId,
      ),
    [input.agentId, input.textureId, percent],
  );

  function set(patch: Partial<GellingAuditInput>) {
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
          options={TEXTURE_IDS.map((id: TextureId) => ({
            value: id,
            label: dict.textures[id],
          }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={selectId} className="text-sm text-ink-muted">
            {copy.agentLabel}
          </label>
          <select
            id={selectId}
            value={input.agentId}
            onChange={(event) => set({ agentId: event.target.value as AgentId })}
            className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
          >
            {AGENTS.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {dict.agents[agent.id]}
              </option>
            ))}
          </select>
        </div>

        <MassField
          label={copy.liquid}
          grams={input.liquidGrams}
          onChange={(liquidGrams) => set({ liquidGrams })}
          step={50}
        />
        <MassField
          label={copy.agentWeight}
          grams={input.agentGrams}
          onChange={(agentGrams) => set({ agentGrams })}
          step={0.5}
        />
      </div>

      <section aria-live="polite">
        <AuditReport
          metrics={result.metrics}
          labels={{
            dosePercent: copy.dosePercent,
            agent: copy.agentSubject,
          }}
          copy={shared.audit}
          citationLabels={dict.sources}
          locale={locale}
        />

        {result.metrics.length === 0 && (
          <p className="mt-4 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
            {copy.noDose}
          </p>
        )}

        {elsewhere.length > 0 && (
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
            {copy.alsoLands}{' '}
            <strong className="font-semibold text-ink">
              {elsewhere.map((id) => dict.textures[id]).join(', ')}
            </strong>
            .
          </p>
        )}
      </section>
    </div>
  );
}
