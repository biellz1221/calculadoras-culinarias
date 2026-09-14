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

/**
 * Classificação da Tabela 1 do Embrapa Doc 29, em dois eixos.
 *
 * Não é traduzível no grupo do NCHFP e não tenta ser. A americana tem um eixo
 * só, que mistura as duas carências ("acid, pectin or both"); a brasileira
 * separa. Para a goiaba isso é a diferença entre não saber o que fazer e saber:
 * pectina rica, acidez média — falta ácido, não falta pectina.
 */
export type EmbrapaPectin = 'rich' | 'medium' | 'poor';
export type EmbrapaAcidity = 'high' | 'medium' | 'low';

export interface EmbrapaFruitRow {
  id: string;
  pectin: EmbrapaPectin;
  acidity: EmbrapaAcidity;
  /**
   * Linha marcada com asterisco na tabela: é de JACKIX (1988), e a Embrapa
   * reproduz. São 30 das 38, e a tela marca quais.
   */
  viaJackix: boolean;
}

/**
 * De onde sai a proporção de açúcar que a calculadora usa.
 *
 * `extra` e `common` são as duas classes da legislação brasileira de alimentos,
 * transcritas no Doc 29. São régua de **produto industrial rotulado**, e por
 * isso pedem mais açúcar que qualquer receita de casa da estante — a menor
 * delas é um para um. Está na tela como divergência, não como escolha calada.
 */
export type SugarLevel =
  | 'source'
  | 'fresh'
  | 'ferber'
  | 'extra'
  | 'common'
  | 'custom';

/**
 * Uma geleia de uso imediato, como o receituário do MMA publica.
 *
 * **Não é conserva, e a diferença é de segurança, não de estilo.** O modo de
 * preparo cozinha a 65–70 °C — o suficiente para dissolver a pectina, longe do
 * ponto de gelificação —, não enche pote, não passa por banho-maria, e o livro
 * não declara validade. É componente de prato, para comer no dia.
 *
 * As quantidades ficam **em grama**, que é como a fonte publica. Ao contrário
 * das receitas de Saunders, aqui não há onça nenhuma para converter.
 */
export interface FreshRecipe {
  fruitGrams: number;
  sugarGrams: number;
  /** Pectina em pó, quando a receita usa. */
  pectinGrams?: number;
  /** Caldo de limão, quando a receita usa. */
  lemonGrams?: number;
  citations: readonly Citation[];
}

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

/**
 * Uma fruta da calculadora.
 *
 * `recipe` e `group` deixaram de ser obrigatórios em 2026-09-14. Goiaba,
 * jabuticaba e maracujá não têm receita pesada em nenhuma obra da estante e não
 * estão na tabela do NCHFP; entram pela classificação da Embrapa, com a
 * proporção vindo da norma. Uma fruta precisa de **pelo menos uma** das duas
 * bases, e há teste garantindo isso.
 */
export interface JamFruit {
  id: string;
  /** Grupo do NCHFP. Fruta que não está na tabela americana não tem. */
  group?: PectinGroup;
  /** Receita pesada do Blue Chair. Fruta brasileira não tem. */
  recipe?: SourceRecipe;
  /** Linha da Tabela 1 do Embrapa Doc 29, quando a fruta está lá. */
  embrapaId?: string;
  /**
   * Receita fresca do receituário do MMA, quando existe.
   *
   * É a terceira base possível de uma fruta, e a mais fraca das três em
   * conservação: vale como proporção publicada para fruta que nenhum livro de
   * conserva cobre, e **sempre** vem com o aviso de uso imediato.
   */
  fresh?: FreshRecipe;
  /**
   * Marmelo, laranja e maçã: a norma deixa a geleia comum ir a 35:65 em vez de
   * 40:60. É exceção escrita na própria definição legal.
   */
  legalException?: boolean;
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
  /** Contra o que o aviso compara, e de onde essa régua vem. */
  referenceRatio: number;
  referenceBasis: ReferenceBasis;
  /** Pectina em pó: 0,5% a 1,5% **do açúcar**, do Embrapa Doc 138. */
  pectinGrams: Range;
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
  /**
   * Rendimento em potes de 8 oz fl, escalado do que a receita declara.
   *
   * `null` para fruta sem receita pesada: a Embrapa não declara rendimento, e
   * escalar o de outra fruta seria inventar.
   */
  jars: Range | null;
  status: JamStatus;
}

/**
 * Contra o que o aviso de açúcar compara.
 *
 * `recipe` — a receita publicada para aquela fruta, e o aviso é o do NCHFP
 * sobre reduzir açúcar de receita testada.
 * `fresh` — a receita fresca do MMA, para fruta nativa que nenhum livro de
 * conserva cobre. O aviso aí não é sobre prateleira: é que o produto **não
 * vai** para a prateleira, qualquer que seja a proporção.
 * `norm` — a geleia extra da legislação brasileira (um para um), para fruta que
 * não tem receita em lugar nenhum. O aviso aí é outro: abaixo dela o produto
 * não é o que a norma chama de geleia. Dizer "doce de geladeira" para quem está
 * a 0,80 seguindo Ferber seria alarme falso.
 */
export type ReferenceBasis = 'recipe' | 'fresh' | 'norm';

/**
 * `below-source` é o caso que dispara aviso: menos açúcar do que a própria
 * fonte publica para aquela fruta. Não é um limiar nosso — é a receita.
 */
export type JamStatus = 'source' | 'above-source' | 'below-source';
