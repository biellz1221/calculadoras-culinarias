import { jamEn } from './jam-en';
import { jamPtBR } from './jam-pt-BR';
import type { Locale } from '../locales';

export type JamDictionary = typeof jamPtBR;

const DICTIONARIES: Record<Locale, JamDictionary> = {
  'pt-BR': jamPtBR,
  en: jamEn,
};

export function getJamDictionary(locale: Locale): JamDictionary {
  return DICTIONARIES[locale];
}
