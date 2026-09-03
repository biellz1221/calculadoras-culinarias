import { describe, expect, it } from 'vitest';

import { BOOKS, formatAuthors, getBook } from './books';
import { CALCULATORS, isAvailable } from './calculators';
import { getDictionary } from '@/i18n';
import { LOCALES } from '@/i18n/locales';
import { isPublished, pathsFor } from '@/i18n/routes';

describe('estante', () => {
  it('não repete identificadores', () => {
    const ids = BOOKS.map((book) => book.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolve uma obra pelo identificador', () => {
    expect(getBook('kayser').title).toBe('The Larousse Book of Bread');
  });

  it('falha alto quando a obra não existe', () => {
    // Uma citação apontando para o vazio é pior do que um erro de build.
    // @ts-expect-error — identificador inexistente de propósito
    expect(() => getBook('inexistente')).toThrow();
  });

  it('formata autoria com "&" quando há mais de um autor', () => {
    expect(formatAuthors(getBook('kayser'))).toBe('Kayser');
    expect(formatAuthors(getBook('noma'))).toBe('Redzepi & Zilber');
    expect(formatAuthors(getBook('bwf'))).toBe('Carvalhaes & Andrade');

    // Instituição não tem sobrenome: cortar a última palavra de "University
    // of Georgia" dava "Georgia", que não é ninguém.
    expect(formatAuthors(getBook('nchfp'))).toBe('NCHFP');
    expect(formatAuthors(getBook('gelato-course'))).toBe('Lulo Fouet');
  });

  it('declara como cada obra é citada', () => {
    // EPUB não tem paginação física — citar "página" nesses casos seria mentira.
    expect(getBook('kayser').locator).toBe('page');
    expect(getBook('katz').locator).toBe('chapter');
  });
});

describe('catálogo de calculadoras', () => {
  it('aponta apenas para obras que existem na estante', () => {
    for (const calculator of CALCULATORS) {
      for (const source of calculator.sources) {
        expect(() => getBook(source), `${calculator.id} → ${source}`).not.toThrow();
      }
    }
  });

  it('tem nome e descrição em todos os idiomas', () => {
    for (const locale of LOCALES) {
      const dict = getDictionary(locale);
      for (const calculator of CALCULATORS) {
        const meta = dict.calculators[calculator.id];
        expect(meta.name.length, `${locale}/${calculator.id}`).toBeGreaterThan(0);
        expect(meta.blurb.length, `${locale}/${calculator.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('só fica disponível quando a rota está publicada nos dois idiomas', () => {
    for (const calculator of CALCULATORS) {
      expect(isAvailable(calculator)).toBe(isPublished(calculator.route));

      if (isAvailable(calculator)) {
        const paths = pathsFor(calculator.route);
        for (const locale of LOCALES) {
          expect(paths[locale]).toBeTruthy();
        }
      }
    }
  });

  it('dá uma aba de cor própria para cada calculadora', () => {
    const accents = CALCULATORS.map((calculator) => calculator.accent);
    expect(new Set(accents).size).toBe(accents.length);
  });
});
