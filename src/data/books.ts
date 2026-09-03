/**
 * A estante do site.
 *
 * Toda proporção exibida em qualquer calculadora aponta para uma destas obras
 * (FR-003). Títulos e nomes de autor são nomes próprios: ficam aqui, em `data`,
 * e não nos dicionários de idioma.
 *
 * `locator` diz como uma citação endereça a obra: PDFs e livros impressos têm
 * página; EPUBs não têm paginação física, então citamos capítulo/seção.
 *
 * As extrações completas, com as citações item a item, estão em docs/research/.
 */
export type BookId =
  | 'kayser'
  | 'camargo'
  | 'katz'
  | 'noma'
  | 'bwf'
  | 'zielonka'
  | 'hazan'
  | 'ruhlman';

export interface Book {
  id: BookId;
  title: string;
  authors: string[];
  publisher: string;
  year?: number;
  /** Como as citações endereçam a obra. */
  locator: 'page' | 'chapter';
  /**
   * `book` = obra da estante; `official` = fonte oficial complementar
   * (NCHFP/USDA), usada só em regras de segurança alimentar (TD-004).
   */
  kind: 'book' | 'official';
}

export const BOOKS: readonly Book[] = [
  {
    id: 'kayser',
    title: 'The Larousse Book of Bread',
    authors: ['Éric Kayser'],
    publisher: 'Phaidon',
    locator: 'page',
    kind: 'book',
  },
  {
    id: 'camargo',
    title: 'Direto ao Pão',
    authors: ['Luiz Américo Camargo'],
    publisher: 'Senac São Paulo',
    year: 2020,
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'katz',
    title: 'A Arte da Fermentação',
    authors: ['Sandor Ellix Katz'],
    publisher: 'Tapioca',
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'noma',
    title: 'The Noma Guide to Fermentation',
    authors: ['René Redzepi', 'David Zilber'],
    publisher: 'Artisan',
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'bwf',
    title: 'Brazilian Way Fermentation',
    authors: ['Fernando Goldenstein Carvalhaes', 'Leonardo Alves de Andrade'],
    publisher: 'Melhoramentos',
    locator: 'page',
    kind: 'book',
  },
  {
    id: 'zielonka',
    title: 'The Pasta Man',
    authors: ['Mateo Zielonka'],
    publisher: 'Quadrille',
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'hazan',
    title: 'Essentials of Classic Italian Cooking',
    authors: ['Marcella Hazan'],
    publisher: 'Knopf',
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'ruhlman',
    title: 'Ratio',
    authors: ['Michael Ruhlman'],
    publisher: 'Scribner',
    locator: 'chapter',
    kind: 'book',
  },
];

const BOOKS_BY_ID = new Map(BOOKS.map((book) => [book.id, book]));

export function getBook(id: BookId): Book {
  const book = BOOKS_BY_ID.get(id);
  if (!book) {
    throw new Error(`Obra desconhecida na estante: ${id}`);
  }
  return book;
}

/** "Redzepi & Zilber" — formato curto usado nas listas e citações inline. */
export function formatAuthors(book: Book): string {
  const surnames = book.authors.map((author) => {
    const parts = author.split(' ');
    return parts[parts.length - 1] ?? author;
  });

  if (surnames.length === 1) return surnames[0] ?? '';
  return `${surnames.slice(0, -1).join(', ')} & ${surnames[surnames.length - 1]}`;
}
