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
  | 'ruhlman'
  | 'nchfp'
  | 'gelato-course';

export interface Book {
  id: BookId;
  title: string;
  authors: string[];
  /**
   * Quem assina: pessoa ou instituição.
   *
   * A citação curta de uma pessoa é o sobrenome, e é o que o site mostra. Já
   * "University of Georgia" não tem sobrenome: cortar a última palavra dava
   * "Georgia", que não é ninguém. Instituição se cita inteira, ou pela sigla
   * de `shortName`.
   */
  authorKind?: 'person' | 'organization';
  /** Como a obra é chamada nas citações, quando o nome completo não cabe. */
  shortName?: string;
  publisher: string;
  year?: number;
  /** Como as citações endereçam a obra. */
  locator: 'page' | 'chapter';
  /**
   * `book` = obra da estante; `official` = fonte oficial complementar
   * (NCHFP/USDA), usada só em regras de segurança alimentar (TD-004);
   * `course` = material de curso, que não é bibliografia e não deve se
   * disfarçar de uma.
   */
  kind: 'book' | 'official' | 'course';
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
  {
    // Fonte oficial complementar (TD-004). Nenhum dos livros fixa a acidez
    // mínima de conserva segura, e segurança alimentar não admite número sem
    // fonte — por isso a exceção às obras da estante.
    id: 'nchfp',
    title: 'National Center for Home Food Preservation',
    authors: ['University of Georgia'],
    authorKind: 'organization',
    shortName: 'NCHFP',
    publisher: 'USDA',
    locator: 'chapter',
    kind: 'official',
  },
  {
    // A calculadora de gelato nasceu de uma planilha de curso, não de um livro.
    // Fica declarada como o que é, em vez de ganhar ares de bibliografia.
    id: 'gelato-course',
    title: 'Planilha gelato do Curso 4.0',
    authors: ['Material de curso'],
    authorKind: 'organization',
    shortName: 'Planilha do curso',
    publisher: 'Acervo pessoal',
    locator: 'chapter',
    kind: 'course',
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

/**
 * "Redzepi & Zilber": o formato curto das listas e das citações inline.
 *
 * Pessoas se citam pelo sobrenome. Instituição não tem sobrenome, então usa a
 * sigla declarada em `shortName` ou o nome inteiro.
 */
export function formatAuthors(book: Book): string {
  if (book.shortName) return book.shortName;
  if (book.authorKind === 'organization') return book.authors.join(', ');

  const surnames = book.authors.map((author) => {
    const parts = author.split(' ');
    return parts[parts.length - 1] ?? author;
  });

  if (surnames.length === 1) return surnames[0] ?? '';
  return `${surnames.slice(0, -1).join(', ')} & ${surnames[surnames.length - 1]}`;
}
