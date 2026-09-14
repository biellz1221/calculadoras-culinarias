import { curingEn } from './curing-en';
import { curingPtBR } from './curing-pt-BR';
import type { Locale } from '../locales';

export type CuringDictionary = typeof curingPtBR;

const DICTIONARIES: Record<Locale, CuringDictionary> = {
  'pt-BR': curingPtBR,
  en: curingEn,
};

export function getCuringDictionary(locale: Locale): CuringDictionary {
  return DICTIONARIES[locale];
}
