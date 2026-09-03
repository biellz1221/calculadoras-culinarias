'use client';

import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales';

const STORAGE_KEY = 'cc:locale';

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Aba anônima ou storage bloqueado: a escolha vale só para esta visita.
  }
}

export function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value && isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Idioma provável do visitante pelo navegador.
 *
 * A regra é simples de propósito: qualquer variante de português — pt, pt-BR,
 * pt-PT — leva ao português; todo o resto vai para o inglês. Não tentamos
 * adivinhar mais do que isso porque o site só tem dois idiomas.
 */
export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;

  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const candidate of candidates) {
    const tag = candidate.toLowerCase();
    if (tag.startsWith('pt')) return 'pt-BR';
    if (tag.startsWith('en')) return 'en';
  }

  return 'en';
}

/** O que o visitante escolheu antes; na falta disso, o que o navegador sugere. */
export function preferredLocale(): Locale {
  return readStoredLocale() ?? detectLocale();
}
