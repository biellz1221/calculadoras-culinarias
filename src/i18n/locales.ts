export const LOCALES = ['pt-BR', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * pt-BR é o idioma canônico: o domínio é .com.br e o público principal é
 * brasileiro. Por isso ele mora na raiz e o inglês fica sob /en (TD-005).
 */
export const DEFAULT_LOCALE: Locale = 'pt-BR';

/** Valor do atributo `lang` do <html> para cada idioma. */
export const HTML_LANG: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en',
};

/** Como cada idioma se chama no seletor — sempre no próprio idioma. */
export const LOCALE_NAME: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
};

/** Rótulo curto usado no seletor compacto do cabeçalho. */
export const LOCALE_SHORT: Record<Locale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
