import { getBook, type BookId } from './books';

/**
 * Uma citação aponta para um lugar exato de uma obra da estante.
 *
 * A obra declara em `locator` como pode ser endereçada: PDF e impresso têm
 * `page`; EPUB não tem paginação física, então é `section`. Dizer "página 48"
 * de um EPUB seria inventar — `assertCitation` existe para impedir isso, e há
 * teste garantindo que nenhuma citação do site quebra a regra.
 */
export interface Citation {
  book: BookId;
  /** Página impressa. Só para obras com `locator: 'page'`. */
  page?: number;
  /** Capítulo ou seção. Só para obras com `locator: 'chapter'`. */
  section?: string;
}

export function assertCitation(citation: Citation): Citation {
  const book = getBook(citation.book);

  if (book.locator === 'page' && citation.page === undefined) {
    throw new Error(`Citação de ${book.title} precisa de página.`);
  }

  if (book.locator === 'chapter' && !citation.section) {
    throw new Error(`Citação de ${book.title} precisa de capítulo/seção.`);
  }

  if (book.locator === 'page' && citation.section) {
    throw new Error(
      `${book.title} é citada por página; use "page" em vez de "section".`,
    );
  }

  if (book.locator === 'chapter' && citation.page !== undefined) {
    throw new Error(
      `${book.title} não tem paginação física; use "section" em vez de "page".`,
    );
  }

  return citation;
}

/** Só um atalho legível para declarar citações nos arquivos de dados. */
export function cite(book: BookId, at: number | string): Citation {
  return assertCitation(
    typeof at === 'number' ? { book, page: at } : { book, section: at },
  );
}
