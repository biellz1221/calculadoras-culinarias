import { picklesEn } from './pickles-en';
import { picklesPtBR } from './pickles-pt-BR';
import type { Locale } from '../locales';

export type PicklesDictionary = typeof picklesPtBR;

const DICTIONARIES: Record<Locale, PicklesDictionary> = {
  'pt-BR': picklesPtBR,
  en: picklesEn,
};

export function getPicklesDictionary(locale: Locale): PicklesDictionary {
  return DICTIONARIES[locale];
}
