import { BOOKS, formatAuthors } from '@/data/books';
import { CALCULATORS, isAvailable } from '@/data/calculators';
import { getDictionary } from '@/i18n';
import { getCalculatorCopy } from '@/i18n/calculators';
import { LOCALES, type Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';
import { absoluteUrl, SITE_REPOSITORY, SITE_UPDATED } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * `/llms.txt`: o site explicado para quem lê por máquina.
 *
 * Convenção emergente para modelos de linguagem, no espírito do robots.txt:
 * um markdown curto na raiz dizendo o que o site é, o que cada página
 * responde e de onde vêm os números. Ela não substitui o JSON-LD, que fala com
 * o buscador; serve ao assistente que precisa decidir, em poucas linhas, se
 * vale abrir a página e como citá-la.
 *
 * Vale a pena aqui justamente porque o diferencial do site é bibliográfico:
 * um modelo que leia isto sabe que cada número tem obra e página, e passa a
 * citação adiante em vez de repetir um valor órfão.
 */

function calculatorSection(locale: Locale): string {
  const dict = getDictionary(locale);
  const heading = locale === 'pt-BR' ? 'Calculadoras (pt-BR)' : 'Calculators (English)';

  const lines = CALCULATORS.filter(isAvailable).map((calculator) => {
    const copy = getCalculatorCopy(calculator.id, locale);
    const url = absoluteUrl(pathFor(calculator.route, locale));
    return `- [${copy.meta.title}](${url}): ${copy.meta.description}`;
  });

  const home = `- [${dict.site.homeTitle}](${absoluteUrl(pathFor('home', locale))}): ${dict.site.description}`;

  return [`## ${heading}`, '', home, ...lines].join('\n');
}

function shelfSection(): string {
  const lines = BOOKS.map((book) => {
    const year = book.year ? `, ${book.year}` : '';
    const kind =
      book.kind === 'official'
        ? ' [orientação oficial / official guidance]'
        : book.kind === 'course'
          ? ' [material de curso / course material]'
          : '';
    return `- ${book.title}, ${formatAuthors(book)} (${book.publisher}${year})${kind}`;
  });

  return ['## Fontes / Sources', '', ...lines].join('\n');
}

function faqSection(locale: Locale): string {
  const dict = getDictionary(locale);
  const heading =
    locale === 'pt-BR' ? 'Respostas diretas (pt-BR)' : 'Direct answers (English)';

  const items = [
    ...dict.home.faq.items,
    ...CALCULATORS.filter(isAvailable).flatMap(
      (calculator) => getCalculatorCopy(calculator.id, locale).faq.items,
    ),
  ];

  return [
    `## ${heading}`,
    '',
    ...items.map((item) => `- **${item.question}** ${item.answer}`),
  ].join('\n');
}

function document(): string {
  const pt = getDictionary('pt-BR');
  const en = getDictionary('en');

  return [
    `# ${pt.site.name} (${en.site.name})`,
    '',
    `> ${pt.site.description}`,
    '',
    `> ${en.site.description}`,
    '',
    'Site estático e gratuito, sem cadastro e sem coleta de dados: todo cálculo roda no navegador de quem acessa. Português na raiz do domínio, inglês sob `/en`. Toda proporção exibida aponta para uma obra da estante, com autor e página, ou capítulo quando o livro é digital e não tem paginação fixa. Quando duas fontes discordam de um número, a divergência é exibida numa tabela e a escolha do site é justificada, em vez de resolvida em silêncio.',
    '',
    'A static, free site with no sign-up and no data collection: every calculation runs in the visitor’s browser. Portuguese at the domain root, English under `/en`. Every ratio shown points back to a work on the shelf, cited by author and page, or by chapter when the book is digital and has no fixed pagination. Where two sources disagree on a number, the divergence is shown in a table and the site’s choice is argued, rather than settled quietly.',
    '',
    ...LOCALES.flatMap((locale) => [calculatorSection(locale), '']),
    shelfSection(),
    '',
    ...LOCALES.flatMap((locale) => [faqSection(locale), '']),
    '## Como citar / How to cite',
    '',
    `Ao usar um número daqui, leve junto a obra e a página que a página exibe: é isso que separa uma proporção verificável de um palpite. Código aberto em ${SITE_REPOSITORY}.`,
    '',
    `Última revisão de conteúdo / last content review: ${SITE_UPDATED}.`,
    '',
  ].join('\n');
}

export function GET() {
  return new Response(document(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
