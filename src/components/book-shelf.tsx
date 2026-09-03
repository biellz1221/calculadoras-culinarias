import { BOOKS, formatAuthors } from '@/data/books';

/**
 * A estante: as obras que sustentam os cálculos do site. É a promessa central
 * do produto (FR-003) posta à vista já na home — a partir do M1 cada valor
 * exibido nas calculadoras aponta para uma destas entradas.
 */
export function BookShelf() {
  return (
    <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {BOOKS.map((book) => (
        <li key={book.id} className="flex gap-3 border-t border-rule pt-4">
          <span
            aria-hidden="true"
            className="mt-1.5 h-8 w-0.5 shrink-0 rounded-full bg-rule-strong"
          />
          <div className="min-w-0">
            <p className="font-display text-base leading-snug font-semibold text-ink">
              {book.title}
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              {formatAuthors(book)}
              <span className="text-ink-muted/70">
                {' · '}
                {book.publisher}
                {book.year ? `, ${book.year}` : ''}
              </span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
