import { formatAuthors, getBook } from '@/data/books';
import type { Citation } from '@/data/citations';
import { cn } from '@/lib/cn';

export interface CitationLabels {
  /** Abreviação de "página" — "p." em pt-BR, "p." em inglês. */
  page: string;
  /** Abreviação de "capítulo" — "cap." em pt-BR, "ch." em inglês. */
  section: string;
}

/**
 * Formata uma citação como "Kayser, p. 48" ou "Camargo, cap. 3".
 *
 * A obra é quem decide se pode ser citada por página ou por capítulo — EPUB não
 * tem paginação física. `assertCitation` já garante isso na construção do dado.
 */
export function formatCitation(citation: Citation, labels: CitationLabels): string {
  const book = getBook(citation.book);
  const author = formatAuthors(book);

  if (citation.page !== undefined) {
    return `${author}, ${labels.page} ${citation.page}`;
  }

  const section = citation.section ?? '';
  const prefix = section.startsWith('cap.') ? '' : `${labels.section} `;

  return `${author}, ${prefix}${section}`.trim();
}

interface CitationRefProps {
  citations: readonly Citation[];
  labels: CitationLabels;
  className?: string;
}

/**
 * Agrupa as citações por obra, para "Kayser, p. 48 · Kayser, p. 54" virar
 * "Kayser, p. 48, 54". Sem isso, uma métrica sustentada por quatro trechos do
 * mesmo livro vira uma linha ilegível de nome repetido.
 */
export function citationSummary(
  citations: readonly Citation[],
  labels: CitationLabels,
): string[] {
  const groups = new Map<string, { author: string; locators: string[] }>();

  for (const citation of citations) {
    const book = getBook(citation.book);
    const author = formatAuthors(book);
    const locator =
      citation.page !== undefined
        ? `${labels.page} ${citation.page}`
        : (citation.section ?? '');

    const group = groups.get(citation.book) ?? { author, locators: [] };
    if (locator && !group.locators.includes(locator)) group.locators.push(locator);
    groups.set(citation.book, group);
  }

  return [...groups.values()].map(
    (group) => `${group.author}, ${group.locators.join(', ')}`,
  );
}

/** Citação inline, no espírito de uma nota de rodapé. */
export function CitationRef({ citations, labels, className }: CitationRefProps) {
  if (citations.length === 0) return null;

  return (
    <span
      className={cn(
        'font-display text-xs leading-relaxed text-ink-muted italic',
        className,
      )}
    >
      {citationSummary(citations, labels).join(' · ')}
    </span>
  );
}

interface SourceListProps {
  citations: readonly Citation[];
  labels: CitationLabels;
  title: string;
  lead?: string;
}

/**
 * Bloco "Fontes" de uma calculadora: uma entrada por obra, com todos os pontos
 * citados agrupados, para a mesma obra não aparecer cinco vezes.
 */
export function SourceList({ citations, labels, title, lead }: SourceListProps) {
  const byBook = new Map<string, Citation[]>();

  for (const citation of citations) {
    const current = byBook.get(citation.book) ?? [];
    const alreadyThere = current.some(
      (item) => item.page === citation.page && item.section === citation.section,
    );
    if (!alreadyThere) current.push(citation);
    byBook.set(citation.book, current);
  }

  return (
    <section className="mt-20 sm:mt-28">
      <h2 className="label-caps text-accent-deep">{title}</h2>
      {lead && (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">{lead}</p>
      )}

      <ul className="mt-8 grid gap-x-10 gap-y-6 border-t border-rule pt-6 sm:grid-cols-2">
        {[...byBook.entries()].map(([bookId, items]) => {
          const book = getBook(bookId as Citation['book']);
          const locators = items
            .map((item) =>
              item.page !== undefined
                ? `${labels.page} ${item.page}`
                : (item.section ?? ''),
            )
            .join(' · ');

          return (
            <li key={bookId} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-1.5 h-8 w-0.5 shrink-0 rounded-full bg-rule-strong"
              />
              <div className="min-w-0">
                <p className="font-display text-base leading-snug font-semibold text-ink">
                  {/* Obra que vive na internet vira link: o site promete que dá
                      para conferir o número, e conferir um curso ou uma
                      orientação oficial é abrir o endereço dela. */}
                  {book.url ? (
                    <a
                      href={book.url}
                      rel="noreferrer"
                      className="underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent-deep hover:decoration-accent"
                    >
                      {book.title}
                    </a>
                  ) : (
                    book.title
                  )}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {formatAuthors(book)}
                  <span className="text-ink-muted/70">{` · ${book.publisher}`}</span>
                </p>
                <p className="mt-1 font-display text-xs text-ink-muted italic">
                  {locators}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
