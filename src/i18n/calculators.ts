import { getBreadDictionary } from './dictionaries/bread';
import { getGelatoDictionary } from './dictionaries/gelato';
import { getPastaDictionary } from './dictionaries/pasta';
import { getPicklesDictionary } from './dictionaries/pickles';
import type { Locale } from './locales';

import type { CalculatorId } from '@/data/calculators';

/**
 * O que toda calculadora tem, independente do assunto.
 *
 * Os quatro dicionários são muito diferentes entre si, cada um com os termos
 * do seu domínio. Esta fatia é o que serve para tratar as quatro em bloco:
 * gerar imagem de compartilhamento, montar JSON-LD e escrever o llms.txt sem
 * repetir um `switch` por calculadora em cada lugar.
 */
export interface CalculatorCopy {
  eyebrow: string;
  title: string;
  lead: string;
  meta: {
    title: string;
    description: string;
    keywords: readonly string[];
    imageAlt: string;
  };
  faq: {
    title: string;
    items: readonly { question: string; answer: string }[];
  };
}

const DICTIONARIES: Record<CalculatorId, (locale: Locale) => CalculatorCopy> = {
  bread: getBreadDictionary,
  pickles: getPicklesDictionary,
  pasta: getPastaDictionary,
  gelato: getGelatoDictionary,
};

export function getCalculatorCopy(id: CalculatorId, locale: Locale): CalculatorCopy {
  return DICTIONARIES[id](locale);
}
