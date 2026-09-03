import { BOOKS, getBook, type Book, type BookId } from '@/data/books';
import { CALCULATORS, isAvailable, type CalculatorId } from '@/data/calculators';
import { getDictionary } from '@/i18n';
import { getCalculatorCopy } from '@/i18n/calculators';
import type { Locale } from '@/i18n/locales';
import { pathFor, type RouteKey } from '@/i18n/routes';
import { ogImagePath } from '@/lib/seo';
import { absoluteUrl, SITE_REPOSITORY, SITE_UPDATED, SITE_URL } from '@/lib/site';

/**
 * JSON-LD do site.
 *
 * Duas plateias diferentes leem isto. O buscador quer saber que a página é uma
 * ferramenta gratuita e o que ela responde. Um assistente de IA quer o mesmo,
 * mais a bibliografia: `citation` declara, em formato que a máquina lê, de que
 * obra saiu cada número. É a mesma promessa da tela, dita na linguagem do
 * robô, e é o que permite um modelo citar o site sem ter que adivinhar.
 */

type Node = Record<string, unknown>;

const PUBLISHER_ID = `${SITE_URL}/#publisher`;

function websiteId(locale: Locale): string {
  return `${absoluteUrl(pathFor('home', locale))}#website`;
}

function publisher(locale: Locale): Node {
  const dict = getDictionary(locale);

  return {
    '@type': 'Organization',
    '@id': PUBLISHER_ID,
    name: dict.site.name,
    url: SITE_URL,
    sameAs: [SITE_REPOSITORY],
  };
}

/**
 * Uma obra da estante em schema.org.
 *
 * O tipo acompanha o que a obra é de verdade: livro é `Book`, orientação
 * oficial e planilha de curso são `CreativeWork`. Chamar as três de livro
 * facilitaria o código e mentiria na saída.
 */
function creativeWork(book: Book): Node {
  const authorType = book.authorKind === 'organization' ? 'Organization' : 'Person';

  const node: Node = {
    '@type': book.kind === 'book' ? 'Book' : 'CreativeWork',
    name: book.title,
    author: book.authors.map((name) => ({ '@type': authorType, name })),
    publisher: { '@type': 'Organization', name: book.publisher },
  };

  if (book.year !== undefined) node.datePublished = String(book.year);
  return node;
}

/**
 * Fontes que a página cita mas que não estão na estante da home.
 *
 * A estante são as obras publicadas (`kind: 'book'`), e é assim que ela se
 * apresenta ao visitante. Só que a página de picles se apoia também na
 * orientação oficial do NCHFP para a acidez mínima, e a de gelato inteira sai
 * de uma planilha de curso. Omitir as duas do JSON-LD faria a saída para
 * máquina prometer menos rastreabilidade do que a tela entrega.
 */
const EXTRA_SOURCES: Partial<Record<CalculatorId, readonly BookId[]>> = {
  pickles: ['nchfp'],
  gelato: ['gelato-course'],
};

function faqPage(
  locale: Locale,
  url: string,
  items: readonly { question: string; answer: string }[],
): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: locale,
    isPartOf: { '@id': websiteId(locale) },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function breadcrumbs(routeKey: RouteKey, locale: Locale, name: string): Node {
  const dict = getDictionary(locale);

  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.site.name,
        item: absoluteUrl(pathFor('home', locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: absoluteUrl(pathFor(routeKey, locale)),
      },
    ],
  };
}

/** Grafo da home: o site, quem publica, o catálogo e a estante. */
export function homeSchema(locale: Locale): Node {
  const dict = getDictionary(locale);
  const url = absoluteUrl(pathFor('home', locale));
  const available = CALCULATORS.filter(isAvailable);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      publisher(locale),
      {
        '@type': 'WebSite',
        '@id': websiteId(locale),
        url,
        name: dict.site.name,
        description: dict.site.description,
        inLanguage: locale,
        isAccessibleForFree: true,
        dateModified: SITE_UPDATED,
        publisher: { '@id': PUBLISHER_ID },
        image: absoluteUrl(ogImagePath('home', locale)),
        // A estante inteira, declarada como bibliografia do site.
        citation: BOOKS.map(creativeWork),
      },
      {
        '@type': 'ItemList',
        name: dict.home.calculatorsTitle,
        itemListElement: available.map((calculator, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: dict.calculators[calculator.id].name,
          description: dict.calculators[calculator.id].blurb,
          url: absoluteUrl(pathFor(calculator.route, locale)),
        })),
      },
      faqPage(locale, url, dict.home.faq.items),
    ],
  };
}

/** Grafo de uma calculadora: a ferramenta, o caminho até ela e as perguntas. */
export function calculatorSchema(id: CalculatorId, locale: Locale): Node {
  const dict = getDictionary(locale);
  const copy = getCalculatorCopy(id, locale);
  const calculator = CALCULATORS.find((item) => item.id === id);
  const routeKey: RouteKey = calculator?.route ?? id;
  const url = absoluteUrl(pathFor(routeKey, locale));
  const sources: readonly BookId[] = [
    ...(calculator?.sources ?? []),
    ...(EXTRA_SOURCES[id] ?? []),
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      publisher(locale),
      // Só o suficiente para o `isPartOf` abaixo apontar para alguma coisa. O
      // nó completo, com a estante inteira, mora na home: repeti-lo em toda
      // página dobraria o JSON-LD sem dizer nada de novo.
      {
        '@type': 'WebSite',
        '@id': websiteId(locale),
        url: absoluteUrl(pathFor('home', locale)),
        name: dict.site.name,
        inLanguage: locale,
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#calculator`,
        url,
        name: `${dict.calculators[id].name} · ${dict.site.name}`,
        description: copy.meta.description,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript.',
        inLanguage: locale,
        isAccessibleForFree: true,
        // Gratuito de verdade: sem plano pago escondido atrás de um botão.
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        dateModified: SITE_UPDATED,
        publisher: { '@id': PUBLISHER_ID },
        isPartOf: { '@id': websiteId(locale) },
        image: absoluteUrl(ogImagePath(routeKey, locale)),
        citation: sources.map((bookId) => creativeWork(getBook(bookId))),
      },
      breadcrumbs(routeKey, locale, dict.calculators[id].name),
      faqPage(locale, url, copy.faq.items),
    ],
  };
}
