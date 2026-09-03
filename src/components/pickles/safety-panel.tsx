import { CitationRef } from '@/components/citation';
import { SAFETY_CITATIONS } from '@/data/pickles/ranges';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';

/**
 * Segurança alimentar acompanha o resultado, sempre visível e sem depender de
 * clique (FR-023). Não é conteúdo de apoio: é parte da resposta.
 */
export function SafetyPanel({ dict }: { dict: PicklesDictionary }) {
  const items = [
    { key: 'ph' as const, content: dict.safety.ph, citations: SAFETY_CITATIONS.ph },
    {
      key: 'submerged' as const,
      content: dict.safety.submerged,
      citations: SAFETY_CITATIONS.submerged,
    },
    { key: 'mold' as const, content: dict.safety.mold, citations: SAFETY_CITATIONS.mold },
    {
      key: 'botulism' as const,
      content: dict.safety.botulism,
      citations: SAFETY_CITATIONS.botulism,
    },
    {
      key: 'shelf' as const,
      content: dict.safety.shelf,
      citations: SAFETY_CITATIONS.shelf,
    },
  ];

  return (
    <section className="mt-10 rounded-card border border-rule-strong bg-surface p-5 sm:p-6">
      <h2 className="label-caps text-accent-deep">{dict.safety.title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
        {dict.safety.lead}
      </p>

      <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.key} className="border-t border-rule pt-4">
            <h3 className="font-display text-base leading-snug font-semibold text-ink">
              {item.content.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {item.content.body}
            </p>
            <CitationRef
              citations={item.citations}
              labels={dict.sources}
              className="mt-2 block"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
