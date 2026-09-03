import { en } from './dictionaries/en';
import { ptBR, type Dictionary } from './dictionaries/pt-BR';
import type { Locale } from './locales';

const DICTIONARIES: Record<Locale, Dictionary> = {
  'pt-BR': ptBR,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };
export * from './locales';
export * from './routes';
