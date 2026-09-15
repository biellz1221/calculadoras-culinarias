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

/* Quantificador limitado de propósito: nome de placeholder é curto, e teto
   explícito é o que separa uma busca barata de uma que anda para trás. */
const PLACEHOLDER = /\{([a-zA-Z]{1,20})\}/g;

/**
 * Preenche `{min}`, `{max}`, `{subject}` e afins numa frase do dicionário.
 *
 * Os valores chegam **já formatados** pelo idioma: quem interpola não sabe
 * dividir grama de porcentagem, e essa ignorância é o que impede um
 * `toFixed()` de vazar para o outro idioma.
 *
 * A leitura é por `Object.hasOwn` porque `values` costuma ser montado com
 * chaves que vieram de dado, e `{constructor}` numa frase não pode devolver
 * função. Placeholder sem valor fica no texto: aparece no teste, não derruba a
 * página de quem está lendo.
 */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(PLACEHOLDER, (match, key: string) =>
    Object.hasOwn(values, key) ? (values[key] ?? match) : match,
  );
}
