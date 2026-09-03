import { gelatoEn } from './gelato-en';
import { gelatoPtBR } from './gelato-pt-BR';
import type { Locale } from '../locales';

/**
 * Mesmo padrão das demais calculadoras: o arquivo pt-BR é canônico e o inglês é
 * tipado como `typeof` ele, então uma chave nova em português quebra a
 * compilação do inglês até ser traduzida.
 */
export type GelatoDictionary = typeof gelatoPtBR;

const DICTIONARIES: Record<Locale, GelatoDictionary> = {
  'pt-BR': gelatoPtBR,
  en: gelatoEn,
};

export function getGelatoDictionary(locale: Locale): GelatoDictionary {
  return DICTIONARIES[locale];
}
