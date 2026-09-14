import { brineEn } from './brine-en';
import { brinePtBR } from './brine-pt-BR';
import type { Locale } from '../locales';

export type BrineDictionary = typeof brinePtBR;

const DICTIONARIES: Record<Locale, BrineDictionary> = {
  'pt-BR': brinePtBR,
  en: brineEn,
};

export function getBrineDictionary(locale: Locale): BrineDictionary {
  return DICTIONARIES[locale];
}
