import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

/**
 * Registro único de rotas do site.
 *
 * O site é estático (TD-001), então não há middleware para negociar idioma:
 * cada página existe fisicamente no caminho abaixo. Este mapa é a fonte de
 * verdade para links internos, seletor de idioma, hreflang e sitemap —
 * mudou aqui, mudou em todo lugar.
 *
 * Convenção de slugs: pt-BR na raiz e em português, inglês sob /en (TD-005).
 */
const ROUTES = {
  home: { 'pt-BR': '/', en: '/en' },
  bread: { 'pt-BR': '/paes', en: '/en/bread' },
  pickles: { 'pt-BR': '/picles', en: '/en/pickles' },
  pasta: { 'pt-BR': '/massas', en: '/en/pasta' },
  gelato: { 'pt-BR': '/gelato', en: '/en/gelato' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

/**
 * Rotas que já existem como página publicada. Uma rota só entra aqui quando a
 * página correspondente foi criada nos dois idiomas — é o que o sitemap usa e
 * o que impede o site de linkar para uma página que ainda não existe.
 */
export const PUBLISHED_ROUTES: readonly RouteKey[] = [
  'home',
  'bread',
  'pickles',
  'pasta',
  'gelato',
];

export function pathFor(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

export function isPublished(key: RouteKey): boolean {
  return PUBLISHED_ROUTES.includes(key);
}

/** Todos os idiomas de uma rota, para montar hreflang e o seletor de idioma. */
export function pathsFor(key: RouteKey): Record<Locale, string> {
  return { ...ROUTES[key] };
}

/**
 * Bloco `alternates` do metadata do Next: canonical no próprio idioma e um
 * hreflang recíproco por idioma, com x-default apontando para o canônico
 * do site (pt-BR).
 */
export function alternatesFor(key: RouteKey, locale: Locale) {
  const paths = pathsFor(key);
  const languages: Record<string, string> = {};

  for (const other of LOCALES) {
    languages[other] = paths[other];
  }
  languages['x-default'] = paths[DEFAULT_LOCALE];

  return { canonical: paths[locale], languages };
}
