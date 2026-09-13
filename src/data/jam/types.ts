import type { Citation } from '../citations';

/**
 * Modelo da calculadora de geleias.
 *
 * Consolidação em docs/research/geleias.md. Duas decisões de modelagem
 * merecem explicação aqui, porque são o que separa esta calculadora de uma
 * média disfarçada de fonte:
 *
 * 1. **A receita citada é guardada nas quantidades do próprio livro**, em onças,
 *    e a proporção sai delas. Razão entre duas massas é adimensional: 40 oz de
 *    açúcar para 62 oz de fruta são os mesmos 0,6452 em qualquer sistema. Assim
 *    nenhum fator de conversão entra no caminho, e o teste pode reproduzir a
 *    receita do livro como caso-verdade.
 * 2. **O grupo de pectina é do NCHFP**, não nosso. Ele não muda a quantidade de
 *    açúcar: muda se o suco de limão é obrigatório ou opcional.
 */

/**
 * Classificação do NCHFP, *Jellied Product Ingredients*:
 *
 * - `i` — "If not overripe, has enough natural pectin and acid for gel
 *   formation with only added sugar."
 * - `ii` — "Low in natural acid or pectin, and may need addition of either acid
 *   or pectin."
 * - `iii` — "Always needs added acid, pectin or both."
 */
export type PectinGroup = 'i' | 'ii' | 'iii';

/** De onde sai a proporção de açúcar que a calculadora usa. */
export type SugarLevel = 'source' | 'ferber' | 'custom';

/** A receita da fonte, nas unidades em que ela foi publicada. */
export interface SourceRecipe {
  /** Peso da fruta preparada, em onças. */
  fruitOz: number;
  /** Açúcar, em onças. */
  sugarOz: number;
  /** Suco de limão coado, em onças. Zero quando a receita não pede. */
  lemonOz: number;
  /** Topo da faixa, quando a receita dá faixa ("2 to 6 ounces"). */
  lemonMaxOz?: number;
  /** Potes de 8 oz fluidas que a receita declara render. */
  jars: readonly [number, number];
  /** Validade em meses, como o livro declara. */
  shelfMonths: readonly [number, number];
}

export interface JamFruit {
  id: string;
  group: PectinGroup;
  recipe: SourceRecipe;
  /** A receita citada. O grupo de pectina cita o NCHFP à parte. */
  citations: readonly Citation[];
}

export interface JamInput {
  /** Peso da fruta **preparada**: descascada, sem caroço, já cortada. */
  fruitGrams: number;
  fruitId: string;
  sugarLevel: SugarLevel;
  /** Proporção de açúcar sobre a fruta, só quando `sugarLevel` é `custom`. */
  customSugarRatio: number;
  /** Altitude do lugar onde se cozinha, em metros. */
  altitudeMeters: number;
}

/** Faixa fechada. Quando `min === max`, a fonte deu valor único. */
export interface Range {
  min: number;
  max: number;
}

export interface JamResult {
  sugarGrams: number;
  /** Proporção efetiva de açúcar sobre a fruta. */
  sugarRatio: number;
  lemonGrams: Range;
  /** Gelatina de maçã do Ferber, para fruta que não gelifica sozinha. */
  appleJellyGrams: number;
  /** Ponto de gelificação na altitude informada, em °C. */
  settingCelsius: number;
  /** Onde a água ferve nessa altitude, em °C. Oito graus Fahrenheit abaixo. */
  boilingCelsius: number;
  /** Minutos de banho-maria, tabela 2 do NCHFP. */
  processingMinutes: number;
  /** Água a evaporar até os 65 % de Ferber. Faixa, porque a fruta é faixa. */
  evaporationGrams: Range;
  /** Rendimento em potes de 8 oz fl, escalado do que a receita declara. */
  jars: Range;
  status: JamStatus;
}

/**
 * `below-source` é o caso que dispara aviso: menos açúcar do que a própria
 * fonte publica para aquela fruta. Não é um limiar nosso — é a receita.
 */
export type JamStatus = 'source' | 'above-source' | 'below-source';
