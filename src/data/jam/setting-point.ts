import { cite } from '../citations';

/**
 * O ponto de gelificação e o banho-maria, os dois por altitude.
 *
 * É a razão de esta calculadora existir em português. Ferber manda cozinhar a
 * 105 °C e Saunders a 220 °F — os dois o mesmo ponto, e os dois números de
 * nível do mar (Alsácia e Oakland). O NCHFP é o único que escreve a regra na
 * forma que sobrevive à mudança de lugar:
 *
 *   "When done, the temperature of the jelly should be 220°F, 8°F above the
 *   boiling point of water, if you are at sea level."
 *
 * Não é uma temperatura: é uma diferença. Boa parte do Brasil urbano mora
 * acima dos 300 m a partir dos quais McGee diz que conserva "won't set at the
 * appropriate stage of cooking, or won't set at all".
 */

/** O NCHFP diz que o ponto é oito graus Fahrenheit acima da fervura da água. */
const SETTING_ABOVE_BOILING_F = 8;

/** Definição internacional do pé: 0,3048 m exatos. Conversão, não estimativa. */
const METERS_PER_FOOT = 0.3048;

export function feetFromMeters(meters: number): number {
  return meters / METERS_PER_FOOT;
}

function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/**
 * A tabela publicada pelo NCHFP, em pés e °F.
 *
 * **A tabela não segue a regra de bolso da própria página.** O texto diz
 * "For each 1000 feet of elevation above sea level, subtract 2 degrees F", mas
 * de 4.000 para 5.000 pés a tabela cai só 1 °F, e daí para cima fica um grau
 * acima da regra em todas as linhas:
 *
 *     tabela   220 218 216 214 212 211 209 207 205
 *     regra    220 218 216 214 212 210 208 206 204
 *
 * A tabela está certa e a regra é que é aproximação: o ponto de ebulição da
 * água não cai em linha reta com a altitude, a queda desacelera. Por isso o
 * cálculo interpola **a tabela**, e não a regra. Até 4.000 pés (1.219 m) as
 * duas coincidem, o que cobre praticamente toda cidade brasileira grande —
 * São Paulo, Belo Horizonte, Curitiba e Brasília inclusive.
 */
export const NCHFP_SETTING_TABLE: readonly { feet: number; fahrenheit: number }[] = [
  { feet: 0, fahrenheit: 220 },
  { feet: 1000, fahrenheit: 218 },
  { feet: 2000, fahrenheit: 216 },
  { feet: 3000, fahrenheit: 214 },
  { feet: 4000, fahrenheit: 212 },
  { feet: 5000, fahrenheit: 211 },
  { feet: 6000, fahrenheit: 209 },
  { feet: 7000, fahrenheit: 207 },
  { feet: 8000, fahrenheit: 205 },
];

/** Ponto de gelificação em °F, interpolado na tabela do NCHFP. */
function settingFahrenheit(altitudeMeters: number): number {
  const feet = Math.max(0, feetFromMeters(altitudeMeters));

  for (let i = 1; i < NCHFP_SETTING_TABLE.length; i += 1) {
    const lower = NCHFP_SETTING_TABLE[i - 1]!;
    const upper = NCHFP_SETTING_TABLE[i]!;
    if (feet <= upper.feet) {
      const t = (feet - lower.feet) / (upper.feet - lower.feet);
      return lower.fahrenheit + t * (upper.fahrenheit - lower.fahrenheit);
    }
  }

  // Acima da última linha, segue a inclinação do último trecho. Não há cidade
  // brasileira aqui — o ponto mais alto do país tem 2.995 m, ou 9.826 pés.
  const last = NCHFP_SETTING_TABLE[NCHFP_SETTING_TABLE.length - 1]!;
  const previous = NCHFP_SETTING_TABLE[NCHFP_SETTING_TABLE.length - 2]!;
  const slope =
    (last.fahrenheit - previous.fahrenheit) / (last.feet - previous.feet);
  return last.fahrenheit + (feet - last.feet) * slope;
}

/** Onde a geleia dá o ponto na altitude informada, em °C. */
export function settingCelsius(altitudeMeters: number): number {
  return fahrenheitToCelsius(settingFahrenheit(altitudeMeters));
}

/** Onde a água ferve nessa altitude, em °C. Oito graus Fahrenheit abaixo. */
export function boilingCelsius(altitudeMeters: number): number {
  return fahrenheitToCelsius(
    settingFahrenheit(altitudeMeters) - SETTING_ABOVE_BOILING_F,
  );
}

export const SETTING_POINT_CITATIONS = [
  cite('nchfp', 'Testing Jelly without Added Pectin'),
  cite('saunders', 26),
  cite('ferber', 'cap. "Le sucre et la cuisson"'),
];

export const ALTITUDE_CITATIONS = [cite('mcgee-keys', 104)];

/**
 * Banho-maria para geleia sem pectina adicionada, tabela 2 do NCHFP:
 * 5 min até 1.000 pés, 10 min de 1.001 a 6.000, 15 min acima disso.
 */
const PROCESSING_TABLE: readonly { upToFeet: number; minutes: number }[] = [
  { upToFeet: 1000, minutes: 5 },
  { upToFeet: 6000, minutes: 10 },
  { upToFeet: Number.POSITIVE_INFINITY, minutes: 15 },
];

export function processingMinutes(altitudeMeters: number): number {
  const feet = feetFromMeters(altitudeMeters);
  const row = PROCESSING_TABLE.find((item) => feet <= item.upToFeet);
  // A última linha tem teto infinito, então `row` nunca é indefinido; o
  // fallback existe só para o tipo.
  return row?.minutes ?? 15;
}

export const PROCESSING_CITATIONS = [
  cite('nchfp', 'Making Jam without added Pectin — tabela 2'),
];

/** Teto de altitude aceito na entrada. O ponto mais alto do Brasil tem 2.995 m. */
export const MAX_ALTITUDE_METERS = 4000;
