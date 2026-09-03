import { breadEn } from './bread-en';
import { breadPtBR } from './bread-pt-BR';
import type { Locale } from '../locales';

/**
 * Cada calculadora tem o seu próprio dicionário, separado do dicionário do
 * site. É muito texto específico (nomes de ingredientes, notas de faixa,
 * conteúdo educativo) e misturar tudo num arquivo só deixaria o dicionário
 * principal ingovernável.
 *
 * O padrão é sempre o mesmo: o arquivo pt-BR é canônico e o inglês é tipado
 * como `typeof` ele, então uma chave nova em português quebra a compilação até
 * ser traduzida.
 */
export type BreadDictionary = typeof breadPtBR;

const DICTIONARIES: Record<Locale, BreadDictionary> = {
  'pt-BR': breadPtBR,
  en: breadEn,
};

export function getBreadDictionary(locale: Locale): BreadDictionary {
  return DICTIONARIES[locale];
}
