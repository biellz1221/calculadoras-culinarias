import { describe, expect, it } from 'vitest';

import { LOCALES } from './locales';
import {
  PUBLISHED_ROUTES,
  alternatesFor,
  isPublished,
  pathFor,
  pathsFor,
} from './routes';

import { SITE_URL } from '@/lib/site';

const ALL_KEYS = ['home', 'bread', 'pickles', 'pasta', 'gelato'] as const;

describe('registro de rotas', () => {
  it('define um caminho para cada idioma em toda rota', () => {
    for (const key of ALL_KEYS) {
      const paths = pathsFor(key);
      for (const locale of LOCALES) {
        expect(paths[locale], `${key}/${locale}`).toMatch(/^\//);
      }
    }
  });

  it('mantém pt-BR na raiz e inglês sob /en', () => {
    for (const key of ALL_KEYS) {
      const paths = pathsFor(key);
      expect(paths.en === '/en' || paths.en.startsWith('/en/')).toBe(true);
      expect(paths['pt-BR'].startsWith('/en')).toBe(false);
    }
  });

  it('usa slugs distintos entre os idiomas fora da home', () => {
    for (const key of ALL_KEYS) {
      if (key === 'home') continue;
      const paths = pathsFor(key);
      expect(paths['pt-BR']).not.toBe(paths.en);
    }
  });

  it('não repete o mesmo caminho em rotas diferentes', () => {
    const seen = new Set<string>();
    for (const key of ALL_KEYS) {
      for (const path of Object.values(pathsFor(key))) {
        expect(seen.has(path), `caminho duplicado: ${path}`).toBe(false);
        seen.add(path);
      }
    }
  });

  it('só marca como publicada uma rota que existe no registro', () => {
    for (const key of PUBLISHED_ROUTES) {
      expect(ALL_KEYS).toContain(key);
      expect(isPublished(key)).toBe(true);
    }
  });

  it('resolve o caminho de cada idioma', () => {
    expect(pathFor('home', 'pt-BR')).toBe('/');
    expect(pathFor('home', 'en')).toBe('/en');
    expect(pathFor('bread', 'pt-BR')).toBe('/paes');
    expect(pathFor('bread', 'en')).toBe('/en/bread');
  });
});

describe('alternates de hreflang', () => {
  it('aponta o canonical para o endereço absoluto do próprio idioma', () => {
    // Absoluto e sem barra final, que é a grafia que o Next impõe ao
    // canonical e que o resto do site adota para não haver duas grafias da
    // mesma página.
    expect(alternatesFor('home', 'pt-BR').canonical).toBe(SITE_URL);
    expect(alternatesFor('home', 'en').canonical).toBe(`${SITE_URL}/en`);
  });

  it('lista todos os idiomas e um x-default no idioma canônico', () => {
    const { languages } = alternatesFor('bread', 'en');

    expect(languages['pt-BR']).toBe(`${SITE_URL}/paes`);
    expect(languages['en']).toBe(`${SITE_URL}/en/bread`);
    expect(languages['x-default']).toBe(`${SITE_URL}/paes`);
  });

  it('gera o mesmo conjunto de alternates a partir de qualquer idioma', () => {
    // Reciprocidade: é o que o Google exige para o par de páginas ser aceito.
    expect(alternatesFor('home', 'pt-BR').languages).toEqual(
      alternatesFor('home', 'en').languages,
    );
  });
});
