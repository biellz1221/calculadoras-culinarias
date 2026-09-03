'use client';

import type { ReactNode } from 'react';

import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { usePreferences } from '@/lib/preferences';

/**
 * Casca comum das páginas de calculadora: a ferramenta em cima e o conteúdo
 * explicativo embaixo, na ordem definida no PRD (FR-004).
 */
export function CalculatorLayout({
  eyebrow,
  title,
  lead,
  locale,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-6 sm:px-8 sm:pt-8">
      <header>
        <p className="animate-rise label-caps text-accent-deep">{eyebrow}</p>
        <h1
          className="animate-rise mt-4 max-w-3xl text-title text-balance"
          style={{ animationDelay: '70ms' }}
        >
          {title}
        </h1>
        <p
          className="animate-rise mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lead"
          style={{ animationDelay: '140ms' }}
        >
          {lead}
        </p>
        <SimplifyToggle locale={locale} />
      </header>
      {children}
    </div>
  );
}

/**
 * Liga e desliga a interface enxuta.
 *
 * Fica junto do título porque é aqui que a pessoa decide se quer ler ou só
 * calcular. A escolha é a mesma do modal de configurações e vale para todas as
 * calculadoras.
 */
function SimplifyToggle({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { simplified, setSimplified } = usePreferences();

  return (
    <button
      type="button"
      onClick={() => setSimplified(!simplified)}
      aria-pressed={simplified}
      className={cn(
        'label-caps mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors',
        simplified
          ? 'border-accent-deep bg-accent-tint text-accent-deep'
          : 'border-rule text-ink-muted hover:border-accent hover:text-accent-deep',
      )}
    >
      <span aria-hidden="true">{simplified ? '▤' : '▥'}</span>
      {simplified ? dict.preferences.simplifiedOn : dict.preferences.simplified}
    </button>
  );
}

/**
 * Seção de conteúdo com rótulo lateral.
 *
 * Marcada como `educational`, ela vira um bloco recolhido quando a pessoa pede
 * a interface simplificada. Recolher, e não remover: o conteúdo é a razão de
 * ser do site, e continua a um clique de distância.
 */
export function CalculatorSection({
  label,
  lead,
  educational = false,
  children,
}: {
  label: string;
  lead?: string;
  educational?: boolean;
  children: ReactNode;
}) {
  const { simplified } = usePreferences();

  if (educational && simplified) {
    return (
      <details className="mt-8 border-t border-rule pt-4">
        <summary className="label-caps cursor-pointer text-accent-deep">
          {label}
        </summary>
        <div className="mt-6">{children}</div>
      </details>
    );
  }

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-10">
        <h2 className="label-caps shrink-0 pt-1 text-accent-deep">{label}</h2>
        {lead && (
          <p className="max-w-xl text-base leading-relaxed text-ink-soft">{lead}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/** Bloco de prosa das seções explicativas. */
export function Prose({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="mt-8 max-w-2xl space-y-4 border-t border-rule pt-6">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="leading-relaxed text-ink-soft">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** Glossário compartilhado pelas calculadoras. */
export function GlossaryList({
  terms,
}: {
  terms: readonly { term: string; definition: string }[];
}) {
  return (
    <dl className="mt-8 grid gap-x-10 gap-y-6 border-t border-rule pt-6 sm:grid-cols-2">
      {terms.map((entry) => (
        <div key={entry.term}>
          <dt className="font-display text-base font-semibold text-ink">
            {entry.term}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
            {entry.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Tabela de divergências entre fontes, o diferencial editorial do site. */
export function DivergenceTable({
  columns,
  items,
}: {
  columns: { topic: string; sources: string; decision: string };
  items: readonly { topic: string; sources: string; decision: string }[];
}) {
  return (
    <div className="relative mt-8 overflow-x-auto border-t border-rule">
      <table className="w-full min-w-2xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rule">
            {[columns.topic, columns.sources, columns.decision].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="label-caps py-3 pr-6 align-bottom text-ink-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.topic} className="border-b border-rule last:border-b-0">
              <th
                scope="row"
                className="w-40 py-4 pr-6 align-top font-display text-base font-semibold text-ink"
              >
                {item.topic}
              </th>
              <td className="w-1/3 py-4 pr-6 align-top leading-relaxed text-ink-muted">
                {item.sources}
              </td>
              <td className="py-4 align-top leading-relaxed text-ink-soft">
                {item.decision}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
