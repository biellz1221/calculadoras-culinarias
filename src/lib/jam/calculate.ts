import {
  LEGAL_PARTS,
  PECTIN_DOSE_OVER_SUGAR,
  getEmbrapaRow,
  legalSugarRatio,
} from '@/data/jam/brazil';
import {
  FERBER_APPLE_JELLY_RATIO,
  FERBER_SUGAR_RATIO,
  FERBER_TARGET_SUGAR,
  FRUIT_OWN_SUGAR,
  freshSugarRatio,
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
  ReferenceBasis,
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
 * - quando não existe receita — toda fruta que entrou pela Tabela 1 da Embrapa —
 *   a proporção sai da definição legal brasileira, e a régua do aviso muda
 *   junto;
 * - o ponto de gelificação é calculado a partir da **altitude**, porque os
 *   105 °C de Ferber e os 220 °F de Saunders são números de nível do mar;
 * - a água a evaporar é a única conta que combina fontes, e vem declarada como
 *   estimativa — 65 % de açúcar no produto pronto e 10 % a 15 % de açúcar
 *   próprio da fruta, os dois de Ferber. Desde 2026-09-14 o 65 % tem segunda
 *   fonte independente: é o mínimo de sólidos solúveis da geleia extra na norma
 *   brasileira.
 *
 * Tudo em número puro, sem arredondar. Arredondamento é apresentação.
 */

const EMPTY_RANGE: Range = { min: 0, max: 0 };

/** A geleia extra da norma: cinquenta partes de fruta para cinquenta de açúcar. */
export const LEGAL_EXTRA_RATIO = legalSugarRatio(LEGAL_PARTS.extra);

/** A comum, com a exceção de marmelo, laranja e maçã. */
export function legalCommonRatio(fruit: JamFruit): number {
  return legalSugarRatio(
    fruit.legalException ? LEGAL_PARTS.commonException : LEGAL_PARTS.common,
  );
}

/**
 * Contra o que o aviso compara, e por quê.
 *
 * Fruta com receita publicada é comparada com a receita. Fruta que só tem a
 * classificação brasileira é comparada com a geleia extra, que é a menor
 * proporção que a norma admite chamar de geleia. Duas réguas porque são duas
 * coisas diferentes, e o texto do aviso muda junto.
 */
export function referenceFor(fruit: JamFruit): {
  ratio: number;
  basis: ReferenceBasis;
} {
  const recipe = sourceSugarRatio(fruit);
  if (recipe !== null) return { ratio: recipe, basis: 'recipe' };
  // A receita fresca vem antes da norma: proporção publicada para **aquela**
  // fruta vale mais que a régua geral de rótulo, mesmo sendo de outro produto.
  const fresh = freshSugarRatio(fruit);
  if (fresh !== null) return { ratio: fresh, basis: 'fresh' };
  return { ratio: LEGAL_EXTRA_RATIO, basis: 'norm' };
}

export function sugarRatioFor(
  fruit: JamFruit,
  level: SugarLevel,
  custom: number,
): number {
  if (level === 'fresh') return freshSugarRatio(fruit) ?? LEGAL_EXTRA_RATIO;
  if (level === 'ferber') return FERBER_SUGAR_RATIO;
  if (level === 'extra') return LEGAL_EXTRA_RATIO;
  if (level === 'common') return legalCommonRatio(fruit);
  if (level === 'custom') return Math.max(0, custom);
  // `source` numa fruta sem receita não deveria chegar aqui — `parseJamState`
  // recusa a combinação. Se chegar, cai na régua da norma em vez de quebrar.
  return referenceFor(fruit).ratio;
}

/**
 * O aviso compara com a fonte, não com um limiar nosso.
 *
 * Abaixo do que a própria receita publica para aquela fruta, o produto sai do
 * regime que o livro testou: NCHFP manda não reduzir açúcar de receita testada
 * e trata doce de açúcar reduzido como doce de geladeira.
 */
/**
 * Tolerância de meio ponto percentual: quem escolhe `source` não pode cair em
 * `below-source` por resíduo de ponto flutuante.
 *
 * Tem nome porque a conferência de receita trazida de fora usa a mesma, e duas
 * tolerâncias diferentes para a mesma comparação seriam duas verdades sobre
 * quando uma receita é a receita da fonte.
 */
export const SUGAR_RATIO_TOLERANCE = 0.005;

export function statusFor(ratio: number, referenceRatio: number): JamStatus {
  if (ratio < referenceRatio - SUGAR_RATIO_TOLERANCE) return 'below-source';
  if (ratio > referenceRatio + SUGAR_RATIO_TOLERANCE) return 'above-source';
  return 'source';
}

/**
 * Pectina em pó, quando se usa pectina em pó.
 *
 * A base é o **açúcar**, não a fruta nem o produto pronto: "0,5% a 1,5% de
 * pectina em relação à quantidade de açúcar usado na formulação". Errar a base
 * aqui erraria a dose por um fator de dois.
 *
 * Sai como faixa de propósito. Onde cair dentro dela depende da pectina própria
 * da fruta, e a fonte diz isso sem converter em número.
 */
export function pectinRange(sugarGrams: number): Range {
  const [low, high] = PECTIN_DOSE_OVER_SUGAR;
  return { min: sugarGrams * low, max: sugarGrams * high };
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

/**
 * Rendimento, escalado do que a receita declara.
 *
 * `null` quando não há receita: a Embrapa classifica a fruta e não diz quantos
 * potes ela rende. Escalar o rendimento de outra fruta seria número sem fonte.
 */
function scaleJars(fruit: JamFruit, fruitGrams: number): Range | null {
  if (!fruit.recipe) return null;
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

/** A linha da Tabela 1 da fruta, para quem precisa do par pectina/acidez. */
export function embrapaRowFor(fruit: JamFruit) {
  return getEmbrapaRow(fruit.embrapaId);
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
      referenceRatio: LEGAL_EXTRA_RATIO,
      referenceBasis: 'norm',
      pectinGrams: EMPTY_RANGE,
      lemonGrams: EMPTY_RANGE,
      appleJellyGrams: 0,
      settingCelsius: setting,
      boilingCelsius: boiling,
      processingMinutes: minutes,
      evaporationGrams: EMPTY_RANGE,
      jars: null,
      status: 'below-source',
    };
  }

  const ratio = sugarRatioFor(fruit, input.sugarLevel, input.customSugarRatio);
  const sugarGrams = fruitGrams * ratio;
  const lemon = sourceLemonRatio(fruit);
  const reference = referenceFor(fruit);

  return {
    sugarGrams,
    sugarRatio: ratio,
    referenceRatio: reference.ratio,
    referenceBasis: reference.basis,
    pectinGrams: pectinRange(sugarGrams),
    lemonGrams: lemon
      ? { min: fruitGrams * lemon.min, max: fruitGrams * lemon.max }
      : EMPTY_RANGE,
    appleJellyGrams: needsAddedPectin(fruit)
      ? fruitGrams * FERBER_APPLE_JELLY_RATIO
      : 0,
    settingCelsius: setting,
    boilingCelsius: boiling,
    processingMinutes: minutes,
    evaporationGrams: evaporationRange(fruitGrams, sugarGrams),
    jars: scaleJars(fruit, fruitGrams),
    status: statusFor(ratio, reference.ratio),
  };
}
