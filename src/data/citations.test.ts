import { describe, expect, it } from 'vitest';

import { BOOKS, getBook } from './books';
import { assertCitation, cite, type Citation } from './citations';
import { BREAD_PRESETS } from './bread/presets';
import { RANGES } from './bread/ranges';
import { formatCitation } from '@/components/citation';
import { YEAST_CITATIONS } from '@/lib/bread/yeast';

const LABELS = { page: 'p.', section: 'cap.' };

describe('regras de citação', () => {
  it('exige página para obra paginada', () => {
    expect(() => assertCitation({ book: 'kayser', page: 48 })).not.toThrow();
    expect(() => assertCitation({ book: 'kayser' })).toThrow();
  });

  it('exige capítulo para obra sem paginação física', () => {
    expect(() => assertCitation({ book: 'katz', section: 'cap. 5' })).not.toThrow();
    expect(() => assertCitation({ book: 'katz' })).toThrow();
  });

  it('recusa página em EPUB', () => {
    // É a regra central do site: EPUB não tem página, então dizer "p. 30" seria
    // inventar uma precisão que a obra não tem.
    expect(() => assertCitation({ book: 'katz', page: 30 })).toThrow();
  });

  it('recusa capítulo onde a obra é citada por página', () => {
    expect(() => assertCitation({ book: 'kayser', section: 'cap. 2' })).toThrow();
  });

  it('aceita os dois formatos pelo atalho cite()', () => {
    expect(cite('kayser', 48).page).toBe(48);
    expect(cite('camargo', 'cap. 3').section).toBe('cap. 3');
  });
});

describe('formatação da citação', () => {
  it('usa sobrenome e página', () => {
    expect(formatCitation(cite('kayser', 48), LABELS)).toBe('Kayser, p. 48');
  });

  it('não duplica o prefixo quando a seção já diz "cap."', () => {
    expect(formatCitation(cite('camargo', 'cap. 3, "Pão francês"'), LABELS)).toBe(
      'Camargo, cap. 3, "Pão francês"',
    );
  });

  it('acrescenta o prefixo quando a seção não tem', () => {
    expect(formatCitation(cite('noma', 'Primer'), LABELS)).toBe('Redzepi & Zilber, cap. Primer');
  });
});

describe('citações usadas pela calculadora de pães', () => {
  const all: Citation[] = [
    ...BREAD_PRESETS.flatMap((preset) => preset.citations),
    ...Object.values(RANGES).flatMap((rule) => rule.citations),
    ...Object.values(YEAST_CITATIONS).flat(),
  ];

  it('são todas válidas para a obra que citam', () => {
    for (const citation of all) {
      expect(() => assertCitation(citation), JSON.stringify(citation)).not.toThrow();
    }
  });

  it('todo preset tem pelo menos uma fonte', () => {
    for (const preset of BREAD_PRESETS) {
      expect(preset.citations.length, preset.id).toBeGreaterThan(0);
    }
  });

  it('toda faixa recomendada tem pelo menos uma fonte', () => {
    for (const [key, rule] of Object.entries(RANGES)) {
      expect(rule.citations.length, key).toBeGreaterThan(0);
    }
  });

  it('só aponta para obras que existem na estante', () => {
    for (const citation of all) {
      expect(() => getBook(citation.book)).not.toThrow();
    }
  });
});

describe('estante', () => {
  it('separa obra, fonte oficial e material de curso', () => {
    // Material de curso não pode se apresentar como bibliografia; fonte oficial
    // de segurança é exceção declarada (TD-004).
    expect(getBook('nchfp').kind).toBe('official');
    expect(getBook('gelato-course').kind).toBe('course');
    expect(BOOKS.filter((book) => book.kind === 'book').length).toBeGreaterThanOrEqual(8);
  });
});
