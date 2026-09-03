import { formatNumber } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

/**
 * Conversão e apresentação de unidades.
 *
 * O estado interno de toda calculadora continua em **gramas e graus Celsius** —
 * nada aqui participa de cálculo algum. Estas funções decidem só como o número
 * aparece na tela.
 *
 * Nota de produto: o modo imperial é por **peso** (onças e libras), nunca por
 * volume. Xícaras e colheres continuam fora do site: o que torna uma receita
 * repetível é a balança, e isso não muda com o sistema de unidades.
 */

export type UnitSystem = 'metric' | 'imperial';
export type TemperatureScale = 'celsius' | 'fahrenheit';

export const GRAMS_PER_OUNCE = 28.349523125;
export const GRAMS_PER_POUND = 453.59237;

/** Acima disso a massa passa a ser exibida na unidade maior. */
const KILOGRAM_THRESHOLD = 1000;
const POUND_THRESHOLD = GRAMS_PER_POUND;

export function gramsToOunces(grams: number): number {
  return grams / GRAMS_PER_OUNCE;
}

export function gramsToPounds(grams: number): number {
  return grams / GRAMS_PER_POUND;
}

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

interface MassParts {
  value: number;
  unit: 'g' | 'kg' | 'oz' | 'lb';
  digits: number;
}

/**
 * Escolhe unidade e precisão para uma massa.
 *
 * A precisão existe para quem vai pesar: 3 casas em kg ainda são 1 g na
 * balança, e 2 casas em onça ficam abaixo de 0,3 g.
 */
function massParts(grams: number, system: UnitSystem): MassParts {
  if (system === 'imperial') {
    return grams >= POUND_THRESHOLD
      ? { value: gramsToPounds(grams), unit: 'lb', digits: 2 }
      : { value: gramsToOunces(grams), unit: 'oz', digits: 2 };
  }

  return grams >= KILOGRAM_THRESHOLD
    ? { value: grams / 1000, unit: 'kg', digits: 3 }
    : { value: grams, unit: 'g', digits: 1 };
}

export function formatMass(
  grams: number,
  locale: Locale,
  system: UnitSystem,
  /** Força a precisão da unidade base (g/oz); usado onde a fonte é grosseira. */
  overrideDigits?: number,
): string {
  const parts = massParts(grams, system);
  const digits = overrideDigits ?? parts.digits;

  const number = formatNumber(parts.value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return `${number} ${parts.unit}`;
}

export function formatTemperature(
  celsius: number,
  locale: Locale,
  scale: TemperatureScale,
  digits = 0,
): string {
  const value = scale === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
  const symbol = scale === 'fahrenheit' ? '°F' : '°C';

  const number = formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return `${number} ${symbol}`;
}

/** Faixa de temperatura — "10–21 °C" vira "50–70 °F". */
export function formatTemperatureRange(
  range: readonly [number, number],
  locale: Locale,
  scale: TemperatureScale,
): string {
  const [min, max] = range;
  const convert = (value: number) =>
    scale === 'fahrenheit' ? celsiusToFahrenheit(value) : value;

  return `${formatNumber(Math.round(convert(min)), locale)}–${formatTemperature(max, locale, scale)}`;
}

/** Volume: mililitros no métrico, onças líquidas no imperial. */
export const MILLILITERS_PER_FLUID_OUNCE = 29.5735295625;

export function formatVolume(
  milliliters: number,
  locale: Locale,
  system: UnitSystem,
): string {
  if (system === 'imperial') {
    const value = milliliters / MILLILITERS_PER_FLUID_OUNCE;
    return `${formatNumber(value, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} fl oz`;
  }

  return `${formatNumber(milliliters, locale, { maximumFractionDigits: 0 })} ml`;
}
