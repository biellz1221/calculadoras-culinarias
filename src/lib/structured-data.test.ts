import { describe, expect, it } from 'vitest';

import { calculatorSchema, homeSchema } from './structured-data';

import { BOOKS } from '@/data/books';
import { CALCULATORS } from '@/data/calculators';
import { LOCALES } from '@/i18n/locales';

type Node = Record<string, unknown>;

function graph(schema: Node): Node[] {
  return schema['@graph'] as Node[];
}

function nodeOfType(schema: Node, type: string): Node {
  const found = graph(schema).find((node) => node['@type'] === type);
  expect(found, `nó ${type} ausente`).toBeDefined();
  return found as Node;
}

describe('JSON-LD da home', () => {
  it.each(LOCALES)('declara a estante inteira em %s', (locale) => {
    const website = nodeOfType(homeSchema(locale), 'WebSite');
    const citation = website.citation as Node[];

    // A promessa do site é bibliográfica; a saída para máquina tem que dizer
    // a mesma coisa que a tela, obra por obra.
    expect(citation).toHaveLength(BOOKS.length);
    expect(citation.map((work) => work.name)).toEqual(BOOKS.map((book) => book.title));
  });

  it('só chama de livro o que é livro', () => {
    const website = nodeOfType(homeSchema('pt-BR'), 'WebSite');
    const byName = new Map(
      (website.citation as Node[]).map((work) => [work.name, work['@type']]),
    );

    for (const book of BOOKS) {
      expect(byName.get(book.title), book.id).toBe(
        book.kind === 'book' ? 'Book' : 'CreativeWork',
      );
    }
  });

  it('lista as calculadoras disponíveis', () => {
    const list = nodeOfType(homeSchema('pt-BR'), 'ItemList');
    expect((list.itemListElement as Node[]).length).toBe(CALCULATORS.length);
  });
});

describe('JSON-LD das calculadoras', () => {
  const cases = CALCULATORS.flatMap((calculator) =>
    LOCALES.map((locale) => ({ id: calculator.id, locale })),
  );

  it.each(cases)('cita pelo menos uma fonte em $id/$locale', ({ id, locale }) => {
    const app = nodeOfType(calculatorSchema(id, locale), 'WebApplication');
    // Inclusive o gelato, cuja fonte é planilha de curso e não livro: número
    // sem procedência não vai para a tela nem para o JSON-LD.
    expect((app.citation as Node[]).length).toBeGreaterThan(0);
  });

  it.each(cases)('se declara gratuita em $id/$locale', ({ id, locale }) => {
    const app = nodeOfType(calculatorSchema(id, locale), 'WebApplication');
    expect(app.isAccessibleForFree).toBe(true);
    expect(app.offers).toMatchObject({ price: '0' });
  });

  it.each(cases)('traz caminho e perguntas em $id/$locale', ({ id, locale }) => {
    const schema = calculatorSchema(id, locale);
    const crumbs = nodeOfType(schema, 'BreadcrumbList');
    expect((crumbs.itemListElement as Node[]).length).toBe(2);

    const faq = nodeOfType(schema, 'FAQPage');
    const questions = faq.mainEntity as Node[];
    expect(questions.length).toBeGreaterThanOrEqual(3);
    for (const question of questions) {
      expect(question['@type']).toBe('Question');
      expect((question.acceptedAnswer as Node).text).toBeTruthy();
    }
  });

  it('aponta o isPartOf para um nó que existe no próprio grafo', () => {
    // Referência solta é JSON-LD válido, mas não ajuda ninguém: o buscador
    // precisa achar o site do outro lado da seta.
    const schema = calculatorSchema('bread', 'pt-BR');
    const app = nodeOfType(schema, 'WebApplication');
    const site = nodeOfType(schema, 'WebSite');

    expect((app.isPartOf as Node)['@id']).toBe(site['@id']);
  });
});
