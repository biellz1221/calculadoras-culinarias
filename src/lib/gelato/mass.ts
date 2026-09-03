/**
 * Apresentação de massa e volume da calculadora de gelato.
 *
 * O estado é SEMPRE em gramas — nada aqui participa do cálculo. O que estas
 * funções decidem é só como o número aparece e como o que foi digitado volta
 * para gramas: num lote de 6 L, cada linha da receita viraria um número de
 * quatro dígitos, e ler "1.980,0 g" é pior que ler "1,980 kg".
 */

import { formatNumber } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

export type MassUnit = 'g' | 'kg';

/** Acima deste volume, o lote passa a ser exibido em quilos. */
export const KG_THRESHOLD_LITERS = 2;

export function massUnitForBatch(liters: number): MassUnit {
  return liters > KG_THRESHOLD_LITERS ? 'kg' : 'g';
}

/** Em kg usamos 3 casas: continua sendo precisão de 1 g na balança. */
function fractionDigits(unit: MassUnit): number {
  return unit === 'kg' ? 3 : 1;
}

/** Número da massa na unidade escolhida, sem sufixo. */
export function formatMassPlain(
  grams: number,
  unit: MassUnit,
  locale: Locale,
): string {
  const value = unit === 'kg' ? grams / 1000 : grams;
  const digits = fractionDigits(unit);
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Massa com sufixo de unidade. */
export function formatMass(grams: number, unit: MassUnit, locale: Locale): string {
  return `${formatMassPlain(grams, unit, locale)} ${unit}`;
}

/** Volume do lote — "1,5 L" em pt-BR, "1.5 L" em inglês. */
export function formatLiters(liters: number, locale: Locale): string {
  return `${formatNumber(liters, locale, {
    minimumFractionDigits: Number.isInteger(liters) ? 0 : 2,
    maximumFractionDigits: 2,
  })} L`;
}

/** Temperatura de serviço, sempre negativa. */
export function formatTemperature(celsius: number, locale: Locale): string {
  return `${formatNumber(celsius, locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} °C`;
}

/** Valor para o `value` de um input numérico, na unidade exibida. */
export function toInputMass(grams: number, unit: MassUnit): number {
  return unit === 'kg' ? Math.round(grams) / 1000 : Math.round(grams * 10) / 10;
}

/** Converte o que a pessoa digitou de volta para gramas. */
export function fromInputMass(value: number, unit: MassUnit): number {
  if (!Number.isFinite(value)) return 0;
  return unit === 'kg' ? value * 1000 : value;
}

export function massStep(unit: MassUnit): number {
  return unit === 'kg' ? 0.001 : 0.1;
}
