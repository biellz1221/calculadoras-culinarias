import { gellingEn } from './gelling-en';
import { gellingPtBR } from './gelling-pt-BR';
import type { Locale } from '../locales';

/**
 * O pt-BR é canônico e o inglês é tipado como `typeof` ele: chave nova em
 * português quebra a compilação até ser traduzida.
 */
export type GellingDictionary = typeof gellingPtBR;

const DICTIONARIES: Record<Locale, GellingDictionary> = {
  'pt-BR': gellingPtBR,
  en: gellingEn,
};

export function getGellingDictionary(locale: Locale): GellingDictionary {
  return DICTIONARIES[locale];
}
