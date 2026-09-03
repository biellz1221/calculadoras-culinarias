import { describe, expect, it } from 'vitest';

import { getDictionary } from '@/i18n';
import { LOCALES } from '@/i18n/locales';

type Node = Record<string, unknown>;

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }

  return Object.entries(value as Node).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function collectStrings(value: unknown, prefix = ''): [string, unknown][] {
  if (typeof value !== 'object' || value === null) {
    return [[prefix, value]];
  }

  return Object.entries(value as Node).flatMap(([key, child]) =>
    collectStrings(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('dicionários', () => {
  it('tem exatamente as mesmas chaves em todos os idiomas', () => {
    // O tipo já garante isso na compilação; o teste protege contra alguém
    // afrouxar a tipagem no futuro.
    const reference = collectKeys(getDictionary('pt-BR')).sort();

    for (const locale of LOCALES) {
      expect(collectKeys(getDictionary(locale)).sort(), locale).toEqual(reference);
    }
  });

  it('não deixa nenhum texto vazio ou não traduzido', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of collectStrings(getDictionary(locale))) {
        expect(typeof value, `${locale}: ${key}`).toBe('string');
        expect(String(value).trim().length, `${locale}: ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('traduz de fato: os textos diferem entre os idiomas', () => {
    // Nomes próprios e unidades se escrevem igual nos dois idiomas. Qualquer
    // outra chave idêntica é tradução esquecida, e o teste falha por isso.
    const SAME_IN_BOTH = [
      'calculators.gelato.name',
      'preferences.celsius',
      'preferences.fahrenheit',
    ];

    const pt = new Map(collectStrings(getDictionary('pt-BR')));
    const en = new Map(collectStrings(getDictionary('en')));

    const identical = [...pt.entries()]
      .filter(([key, value]) => en.get(key) === value)
      .map(([key]) => key);

    expect(identical.sort()).toEqual([...SAME_IN_BOTH].sort());
  });
});
