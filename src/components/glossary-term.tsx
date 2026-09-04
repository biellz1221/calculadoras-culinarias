'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { CitationRef, type CitationLabels } from '@/components/citation';
import type { CalculatorId } from '@/data/calculators';
import { GLOSSARY, glossaryAnchor } from '@/data/glossary';

export interface GlossaryTermLabels extends CitationLabels {
  /** Link para o verbete inteiro, lá embaixo na página. */
  full: string;
  noSource: string;
}

/**
 * Um termo técnico que explica a si mesmo (FR-004).
 *
 * O rótulo vira botão: clique, toque ou foco abrem a definição curta com a
 * obra de onde ela saiu. É o que evita mandar quem está no meio de um cálculo
 * rolar até o glossário e depois procurar o caminho de volta.
 *
 * Botão, e não `title` do HTML: o `title` nativo não abre no toque, não abre
 * pelo teclado e não cabe uma citação. Aqui o mesmo controle atende mouse,
 * dedo e teclado, que é literalmente o que o critério pede.
 */
export function GlossaryTerm({
  calculator,
  entryId,
  label,
  definition,
  labels,
}: {
  calculator: CalculatorId;
  entryId: string;
  label: string;
  definition: string;
  labels: GlossaryTermLabels;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapper = useRef<HTMLSpanElement>(null);

  const entry = GLOSSARY[calculator].find((item) => item.id === entryId);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    // Clique fora fecha. `pointerdown` em vez de `click` para o painel sumir
    // antes de o clique chegar no que estava embaixo dele.
    const onPointer = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  if (!entry) return <>{label}</>;

  return (
    <span ref={wrapper} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="cursor-help border-b border-dotted border-rule-strong text-left transition-colors hover:border-accent hover:text-accent-deep"
      >
        {label}
      </button>

      {open && (
        <span
          id={panelId}
          role="note"
          className="absolute top-full left-0 z-30 mt-2 block w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded-card border border-rule bg-surface px-4 py-3 text-left shadow-lift"
        >
          <span className="block text-sm leading-relaxed font-normal text-ink-soft">
            {definition}
          </span>

          {entry.citations.length > 0 ? (
            <CitationRef
              citations={entry.citations}
              labels={labels}
              className="mt-2 block"
            />
          ) : (
            <span className="mt-2 block font-display text-xs leading-relaxed text-warn italic">
              {labels.noSource}
            </span>
          )}

          <a
            href={`#${glossaryAnchor(entry.id)}`}
            onClick={() => setOpen(false)}
            className="label-caps mt-2.5 inline-block text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent-deep"
          >
            {labels.full}
          </a>
        </span>
      )}
    </span>
  );
}
