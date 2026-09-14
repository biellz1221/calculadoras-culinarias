import { ganacheEn } from './ganache-en';
import { ganachePtBR } from './ganache-pt-BR';
import type { Locale } from '../locales';

export type GanacheDictionary = typeof ganachePtBR;

const DICTIONARIES: Record<Locale, GanacheDictionary> = {
  'pt-BR': ganachePtBR,
  en: ganacheEn,
};

export function getGanacheDictionary(locale: Locale): GanacheDictionary {
  return DICTIONARIES[locale];
}
