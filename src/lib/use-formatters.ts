'use client';

import { useMemo } from 'react';

import { usePreferences } from './preferences';
import {
  formatMass,
  formatTemperature,
  formatTemperatureRange,
  formatVolume,
} from './units';
import { formatNumber, formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

export interface Formatters {
  /** Massa a partir de gramas, na unidade que o visitante escolheu. */
  mass: (grams: number, digits?: number) => string;
  temperature: (celsius: number, digits?: number) => string;
  temperatureRange: (range: readonly [number, number]) => string;
  volume: (milliliters: number) => string;
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
  percent: (value: number, digits?: number) => string;
}

/**
 * Formatadores já amarrados ao idioma da página e às preferências do visitante.
 *
 * Existe para que nenhuma tela precise saber se o leitor pediu gramas ou onças:
 * as calculadoras continuam pensando em gramas e chamam `mass()`.
 */
export function useFormatters(locale: Locale): Formatters {
  const { units, temperature } = usePreferences();

  return useMemo(
    () => ({
      mass: (grams, digits) => formatMass(grams, locale, units, digits),
      temperature: (celsius, digits) =>
        formatTemperature(celsius, locale, temperature, digits),
      temperatureRange: (range) => formatTemperatureRange(range, locale, temperature),
      volume: (milliliters) => formatVolume(milliliters, locale, units),
      number: (value, options) => formatNumber(value, locale, options),
      percent: (value, digits) => formatPercent(value, locale, digits),
    }),
    [locale, units, temperature],
  );
}
