import type { Citation } from '../citations';

/**
 * Modelo da calculadora de salmoura.
 *
 * Consolidação em docs/research/salmoura.md. Tudo aqui é **proporção sobre o
 * peso da proteína**, que é a coluna "SCALING" das receitas do Modernist e a
 * base em que a dose do Food Lab foi convertida.
 *
 * A distinção que o modelo precisa carregar não é de sabor, é de método:
 * salmoura de equilíbrio entrega toda a dose à carne, e salmoura de imersão
 * não. Na segunda o tempo é parte da receita, e passar dele estraga.
 */

/**
 * A receita da fonte, nas quantidades em que ela foi publicada.
 *
 * Guardar os pesos do livro em vez das porcentagens tem duas razões. A coluna
 * "SCALING" do Modernist é arredondada — 10 g de sal em 750 g de carne são
 * 1,333 %, e a tabela imprime 1,3 % —, e guardar o peso deixa o teste
 * reproduzir a receita exata. E a razão entre dois pesos não tem unidade, então
 * nada precisa ser convertido no caminho.
 */
export interface SourceBrine {
  proteinGrams: number;
  saltGrams: number;
  liquidGrams: number;
  sugarGrams: number;
}

export interface BrineMethod {
  id: string;
  /**
   * A receita citada. Ausente na salga seca, que não é receita: é uma dose por
   * peso, convertida de colher em `salt.ts`.
   */
  recipe?: SourceBrine;
  /** Sal, como fração do peso da proteína. */
  salt: number;
  /** Água ou líquido, como fração do peso da proteína. Zero na salga seca. */
  liquid: number;
  /** Açúcar, como fração do peso da proteína. */
  sugar: number;
  /** Faixa de tempo em horas, como a fonte declara. */
  hours: readonly [number, number];
  /**
   * Verdadeiro quando toda a dose acaba na carne, e o tempo só precisa ser
   * suficiente. Falso quando o tempo é contado e passar dele salga demais.
   */
  equilibrium: boolean;
  /** Exige seringa: a dose é injetada, não absorvida. */
  injected: boolean;
  /** A peça é enxaguada ao fim, então parte do sal não fica. */
  rinsed: boolean;
  citations: readonly Citation[];
}

export interface BrineInput {
  proteinGrams: number;
  methodId: string;
}

export interface BrineResult {
  saltGrams: number;
  liquidGrams: number;
  sugarGrams: number;
  /** Massa total da salmoura pronta. Zero nos métodos secos. */
  brineGrams: number;
  /**
   * Sal como fração do líquido, para quem quer conferir contra receita escrita
   * em "salmoura de 6%". Zero nos métodos secos.
   */
  saltInLiquid: number;
  /** O mesmo peso de sal, em colheres de chá de cada marca. */
  teaspoons: { diamondCrystal: number; mortonKosher: number };
}
