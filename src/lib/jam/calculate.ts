import {
  FERBER_APPLE_JELLY_RATIO,
  FERBER_SUGAR_RATIO,
  FERBER_TARGET_SUGAR,
  FRUIT_OWN_SUGAR,
  getFruit,
  needsAddedPectin,
  sourceLemonRatio,
  sourceSugarRatio,
} from '@/data/jam/fruits';
import {
  boilingCelsius,
  processingMinutes,
  settingCelsius,
} from '@/data/jam/setting-point';
import type {
  JamFruit,
  JamInput,
  JamResult,
  JamStatus,
  Range,
  SugarLevel,
} from '@/data/jam/types';

/**
 * Motor da calculadora de geleias.
 *
 * As contas são regra de três sobre o peso da fruta preparada, que é a base
 * que Saunders manda usar: "always base the amount of sugar on the total
 * weight of raw prepared fruit being used" (p. 22). O que a calculadora tem de
 * seu é o resto:
 *
 * - a proporção sai da receita citada para **aquela** fruta, não de uma média;
 * - o ponto de gelificação é calculado a partir da **altitude**, porque os
 *   105 °C de Ferber e os 220 °F de Saunders são números de nível do mar;
 * - a água a evaporar é a única conta que combina fontes, e vem declarada como
 *   estimativa — 65 % de açúcar no produto pronto e 10 % a 15 % de açúcar
 *   próprio da fruta, os dois de Ferber.
 *
 * Tudo em número puro, sem arredondar. Arredondamento é apresentação.
 */

const EMPTY_RANGE: Range = { min: 0, max: 0 };

export function sugarRatioFor(
  fruit: JamFruit,
  level: SugarLevel,
  custom: number,
): number {
  if (level === 'ferber') return FERBER_SUGAR_RATIO;
  if (level === 'custom') return Math.max(0, custom);
  return sourceSugarRatio(fruit);
}

/**
 * O aviso compara com a fonte, não com um limiar nosso.
 *
 * Abaixo do que a própria receita publica para aquela fruta, o produto sai do
 * regime que o livro testou: NCHFP manda não reduzir açúcar de receita testada
 * e trata doce de açúcar reduzido como doce de geladeira.
 */
export function statusFor(ratio: number, sourceRatio: number): JamStatus {
  // Tolerância de meio ponto percentual: quem escolhe `source` não pode cair
  // em `below-source` por resíduo de ponto flutuante.
  if (ratio < sourceRatio - 0.005) return 'below-source';
  if (ratio > sourceRatio + 0.005) return 'above-source';
  return 'source';
}

/**
 * Água a evaporar até os 65 % de Ferber.
 *
 * Açúcar total = adicionado + o que a fruta traz (10 % a 15 % do peso dela).
 * A 65 %, a massa final é `açúcar total ÷ 0,65`, e o que falta tirar é a
 * diferença para a massa que entrou na panela. Sai como faixa porque os
 * 10 %–15 % são faixa.
 *
 * É a conta que explica por que geleia de pouco açúcar cozinha muito mais: com
 * menos açúcar, mais água precisa sair para chegar aos mesmos 65 %.
 */
export function evaporationRange(fruitGrams: number, sugarGrams: number): Range {
  const input = fruitGrams + sugarGrams;
  const bounds = FRUIT_OWN_SUGAR.map((own) => {
    const totalSugar = sugarGrams + fruitGrams * own;
    const final = totalSugar / FERBER_TARGET_SUGAR;
    return Math.max(0, input - final);
  });

  // Mais açúcar próprio na fruta significa menos água a tirar: a faixa chega
  // invertida da conta e é ordenada aqui.
  return { min: Math.min(...bounds), max: Math.max(...bounds) };
}

function scaleJars(fruit: JamFruit, fruitGrams: number): Range {
  const [low, high] = fruit.recipe.jars;
  // A escala é sobre a fruta, e a razão entre dois pesos de fruta não tem
  // unidade — as onças do livro não precisam virar gramas para isso.
  const factor = fruitGrams / gramsFromOunces(fruit.recipe.fruitOz);
  return { min: low * factor, max: high * factor };
}

/** Onça avoirdupois: 28,349523125 g exatos. Definição, não estimativa. */
const GRAMS_PER_OUNCE = 28.349523125;

export function gramsFromOunces(ounces: number): number {
  return ounces * GRAMS_PER_OUNCE;
}

export function calculateJam(input: JamInput): JamResult {
  const fruit = getFruit(input.fruitId);
  const fruitGrams = Math.max(0, input.fruitGrams);
  const altitude = Math.max(0, input.altitudeMeters);

  const setting = settingCelsius(altitude);
  const boiling = boilingCelsius(altitude);
  const minutes = processingMinutes(altitude);

  if (!fruit) {
    return {
      sugarGrams: 0,
      sugarRatio: 0,
      lemonGrams: EMPTY_RANGE,
      appleJellyGrams: 0,
      settingCelsius: setting,
      boilingCelsius: boiling,
      processingMinutes: minutes,
      evaporationGrams: EMPTY_RANGE,
      jars: EMPTY_RANGE,
      status: 'below-source',
    };
  }

  const ratio = sugarRatioFor(fruit, input.sugarLevel, input.customSugarRatio);
  const sugarGrams = fruitGrams * ratio;
  const lemon = sourceLemonRatio(fruit);

  return {
    sugarGrams,
    sugarRatio: ratio,
    lemonGrams: { min: fruitGrams * lemon.min, max: fruitGrams * lemon.max },
    appleJellyGrams: needsAddedPectin(fruit.group)
      ? fruitGrams * FERBER_APPLE_JELLY_RATIO
      : 0,
    settingCelsius: setting,
    boilingCelsius: boiling,
    processingMinutes: minutes,
    evaporationGrams: evaporationRange(fruitGrams, sugarGrams),
    jars: scaleJars(fruit, fruitGrams),
    status: statusFor(ratio, sourceSugarRatio(fruit)),
  };
}
