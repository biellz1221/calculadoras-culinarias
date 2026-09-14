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
  | 'ruhlman-charcuterie'
  | 'saunders'
  | 'ferber'
  | 'mcgee-keys'
  | 'mcgee-ofc'
  | 'modernist-home'
  | 'foodlab'
  | 'wybauw'
  | 'nchfp'
  | 'embrapa-geleias'
  | 'embrapa-geleias-artesanal'
  | 'embrapa-hortalicas'
  | 'embrapa-processamento'
  | 'marianski'
  | 'anvisa-in211'
  | 'dipoa-of15'
  | 'fsis-424'
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
  /**
   * Onde a obra está, quando ela vive na internet.
   *
   * Livro impresso não tem endereço; curso e orientação oficial têm, e aí o
   * leitor consegue chegar na fonte em vez de acreditar na palavra do site.
   */
  url?: string;
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
    // Outro Ruhlman, e não o `Ratio`: a composição do sal de cura e a razão de
    // trabalho da cura seca são deste, escrito com Brian Polcyn. O PDF que
    // temos não traz a paginação impressa no texto, então cita-se por capítulo.
    id: 'ruhlman-charcuterie',
    title: 'Charcuterie: The Craft of Salting, Smoking, and Curing',
    authors: ['Michael Ruhlman', 'Brian Polcyn'],
    publisher: 'W. W. Norton',
    year: 2005,
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'saunders',
    title: 'The Blue Chair Jam Cookbook',
    authors: ['Rachel Saunders'],
    publisher: 'Andrews McMeel',
    year: 2009,
    locator: 'page',
    kind: 'book',
  },
  {
    id: 'ferber',
    title: 'Mes confitures',
    authors: ['Christine Ferber'],
    publisher: 'Payot',
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'mcgee-keys',
    title: 'Keys to Good Cooking',
    authors: ['Harold McGee'],
    publisher: 'Penguin',
    year: 2010,
    locator: 'page',
    kind: 'book',
  },
  {
    id: 'mcgee-ofc',
    title: 'On Food and Cooking',
    authors: ['Harold McGee'],
    publisher: 'Scribner',
    locator: 'chapter',
    kind: 'book',
  },
  {
    // Volume único do Modernist para casa. O PDF que temos não tem paginação
    // confiável na camada de texto, então cita-se por capítulo e por quadro.
    id: 'modernist-home',
    title: 'Modernist Cuisine at Home',
    authors: ['Nathan Myhrvold', 'Maxime Bilet'],
    publisher: 'The Cooking Lab',
    year: 2012,
    locator: 'chapter',
    kind: 'book',
  },
  {
    id: 'foodlab',
    title: 'The Food Lab: Better Home Cooking Through Science',
    authors: ['J. Kenji López-Alt'],
    publisher: 'W. W. Norton',
    year: 2015,
    locator: 'page',
    kind: 'book',
  },
  {
    // O PDF traz a paginação impressa na margem em algumas páginas, mas o
    // deslocamento não se confirma no fim do volume. Deslocamento que não se
    // confere de ponta a ponta não é conversão: cita-se por seção.
    id: 'wybauw',
    title: 'Fine Chocolates: Great Experience',
    authors: ['Jean-Pierre Wybauw'],
    publisher: 'Lannoo',
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
    url: 'https://nchfp.uga.edu/',
    locator: 'chapter',
    kind: 'official',
  },
  {
    /**
     * O manual industrial de geleia da Embrapa, e a Tabela 1 que ele publica.
     *
     * Entra como obra oficial: publicação de empresa pública de pesquisa, com
     * ISSN, série numerada e endereço permanente. Quem duvidar do número abre o
     * PDF na Infoteca-e e confere.
     *
     * Citada por seção, não por página: o PDF diagrama duas páginas impressas
     * por página de arquivo e não traz numeração na camada de texto. Mesmo caso
     * do Wybauw — deslocamento que não se confere de ponta a ponta não vira
     * citação de página.
     *
     * **Trinta das 38 linhas da Tabela 1 são de JACKIX (1988)**, e a Embrapa
     * reproduz. As citações dessas linhas dizem isso; ver docs/research/
     * geleias.md §12.
     */
    id: 'embrapa-geleias',
    title: 'Manual para a produção de geléias de frutas em escala industrial',
    authors: ['Renata Torrezan'],
    shortName: 'Embrapa, Documentos 29',
    publisher: 'Embrapa Agroindústria de Alimentos',
    year: 1998,
    url: 'https://www.infoteca.cnptia.embrapa.br/bitstream/doc/415585/1/1998DOC0029.pdf',
    locator: 'chapter',
    kind: 'official',
  },
  {
    /**
     * A régua caseira da mesma casa, e a que publica a dose de pectina.
     *
     * O Doc 29 é de escala industrial; este é de bancada, e traz onze
     * formulações pesadas que obedecem à faixa de pectina que ele próprio
     * publica — a autoconferência que autorizou transcrever a faixa.
     *
     * Por seção pelo mesmo motivo do irmão: manter as duas obras da Embrapa
     * endereçadas do mesmo jeito.
     */
    id: 'embrapa-geleias-artesanal',
    title: 'Preparo artesanal de geleias e geleiadas',
    authors: ['Ana Cristina Richter Krolow'],
    shortName: 'Embrapa, Documentos 138',
    publisher: 'Embrapa Clima Temperado',
    year: 2013,
    url: 'https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1018391/1/Documento138.pdf',
    locator: 'chapter',
    kind: 'official',
  },
  {
    /**
     * A cartilha de conserva de hortaliça da Embrapa.
     *
     * Mesma autora do Documentos 138 de geleias. Entra pela classificação de
     * acidez, que é onde ela **diverge** do NCHFP: a régua brasileira traça a
     * linha em pH 4,5 e a americana em 4,6. Ver picles-fermentacao.md.
     *
     * Paginação conferida: impressa = PDF menos 2.
     */
    id: 'embrapa-hortalicas',
    title: 'Hortaliças em conserva',
    authors: ['Ana Cristina Richter Krolow'],
    shortName: 'Embrapa, Agroindústria Familiar',
    publisher: 'Embrapa Informação Tecnológica',
    year: 2006,
    locator: 'page',
    kind: 'official',
  },
  {
    /**
     * O manual grande de hortaliça, e a segunda fonte da faixa de salga.
     *
     * Ele corrobora em português o 1,5% a 2% que o Katz publica como padrão
     * comercial da salga seca — duas fontes que não se conhecem, mesma faixa.
     *
     * Paginação conferida em quatro pontos: impressa = PDF menos 1.
     */
    id: 'embrapa-processamento',
    title: 'Processamento de hortaliças em pequena escala',
    authors: ['Cristina Maria Monteiro Machado'],
    shortName: 'Embrapa Hortaliças',
    publisher: 'Embrapa Hortaliças',
    year: 2008,
    locator: 'page',
    kind: 'official',
  },
  {
    id: 'marianski',
    title: 'Home Production of Quality Meats and Sausages',
    authors: ['Stanley Marianski', 'Adam Marianski'],
    publisher: 'Bookmagic',
    year: 2010,
    locator: 'chapter',
    kind: 'book',
  },
  {
    /**
     * A norma brasileira de aditivos em carnes.
     *
     * Entra na estante como obra oficial, e não como livro, porque é o que ela
     * é: texto legal com data, número e endereço público. Quem duvidar do
     * número abre o DOU e confere.
     *
     * **Substituiu a RDC 272/2019**, que era o que citávamos até 2026-09-14. A
     * RDC 778/2023 consolidou a legislação de aditivos e revogou 67 normas, a
     * 272 entre elas (art. 13, LVI). O número não mudou — a IN 211 repete os
     * mesmos 150 mg/kg, com a mesma redação —, mas página de segurança
     * alimentar tem de apontar para o texto em vigor.
     */
    id: 'anvisa-in211',
    title:
      'Instrução Normativa nº 211, de 1º de março de 2023 — limites máximos e condições de uso dos aditivos alimentares autorizados',
    authors: ['Agência Nacional de Vigilância Sanitária'],
    authorKind: 'organization',
    shortName: 'ANVISA',
    publisher: 'Ministério da Saúde',
    year: 2023,
    url: 'https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao',
    locator: 'chapter',
    kind: 'official',
  },
  {
    /**
     * O ofício que publica a aritmética da soma.
     *
     * A ANVISA fixa o teto de 150 mg/kg como soma de nitrito e nitrato; quem
     * publica **como** somar é o DIPOA, e é isto aqui. Entra na estante pelo
     * mesmo motivo das outras normas: texto oficial com número, data e endereço
     * público.
     *
     * Ele se confere sozinho — imprime as próprias massas molares na linha
     * seguinte aos fatores. Ver docs/research/cura-carnes.md §4.1, inclusive
     * para a divergência de 0,1% no fator do nitrato de potássio, que o site
     * registra e não corrige: citar norma é reproduzir o que ela manda fazer.
     *
     * Paginação 1:1, conferida pelo rodapé de cada página.
     */
    id: 'dipoa-of15',
    title:
      'Ofício Circular nº 15/2009/GAB/DIPOA — uso de conservantes e aditivos em produtos cárneos',
    authors: ['Departamento de Inspeção de Produtos de Origem Animal'],
    authorKind: 'organization',
    shortName: 'DIPOA',
    publisher: 'Ministério da Agricultura, Pecuária e Abastecimento',
    year: 2009,
    url: 'https://wikisda.agricultura.gov.br/',
    locator: 'page',
    kind: 'official',
  },
  {
    id: 'fsis-424',
    title: '9 CFR 424.21 — Use of food ingredients and sources of radiation',
    authors: ['USDA Food Safety and Inspection Service'],
    authorKind: 'organization',
    shortName: 'FSIS',
    publisher: 'Code of Federal Regulations',
    url: 'https://www.ecfr.gov/current/title-9/section-424.21',
    locator: 'chapter',
    kind: 'official',
  },
  {
    // A calculadora de gelato nasceu da planilha de balanceamento de um curso,
    // não de um livro. Fica declarada como o que é, com autor e endereço, em
    // vez de virar uma "planilha" anônima com ares de bibliografia.
    id: 'gelato-course',
    title: 'Gelato Direto ao Ponto: planilha de balanceamento',
    authors: ['Luis Paulo dos Santos Barros'],
    shortName: 'Lulo Fouet',
    publisher: 'Lulo Fouet',
    url: 'https://lulofouet.com/gelatodiretoaoponto/',
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
