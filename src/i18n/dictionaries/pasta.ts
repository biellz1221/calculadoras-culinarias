import { pastaEn } from './pasta-en';
import { pastaPtBR } from './pasta-pt-BR';
import type { Locale } from '../locales';

/**
 * Dicionário da calculadora de massa fresca, no mesmo padrão das outras: o
 * arquivo pt-BR é canônico e o inglês é tipado como `typeof` ele, então uma
 * chave nova em português quebra a compilação até ser traduzida.
 */
export type PastaDictionary = typeof pastaPtBR;

const DICTIONARIES: Record<Locale, PastaDictionary> = {
  'pt-BR': pastaPtBR,
  en: pastaEn,
};

export function getPastaDictionary(locale: Locale): PastaDictionary {
  return DICTIONARIES[locale];
}
