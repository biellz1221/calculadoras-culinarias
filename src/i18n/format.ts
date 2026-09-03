import type { Locale } from './locales';

/**
 * Formatação numérica por idioma. Existe para que "32,5 g" em pt-BR vire
 * "32.5 g" em inglês sem que nenhuma tela precise saber disso (NFR-007 e
 * critério de locale da Story 1.2).
 *
 * O estado interno das calculadoras é sempre número puro em gramas; estas
 * funções cuidam só da apresentação.
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/** Massa em gramas — a precisão de pesagem padrão das calculadoras é 0,1 g. */
export function formatGrams(
  value: number,
  locale: Locale,
  fractionDigits = 1,
): string {
  const number = formatNumber(value, locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${number} g`;
}

/** Percentuais das calculadoras (hidratação, sal, etc.). */
export function formatPercent(
  value: number,
  locale: Locale,
  fractionDigits = 1,
): string {
  const number = formatNumber(value, locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
  return `${number}%`;
}
