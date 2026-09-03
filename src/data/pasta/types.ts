import type { Citation } from '../citations';

/**
 * Modelo da calculadora de massa fresca.
 *
 * Diferente do pão, aqui não existe "porcentagem de padeiro": as fontes
 * publicam as massas em gramas fechados (300 g de farinha + 3 ovos → 400 g,
 * serve 4) e o que escala a receita é o **ovo**, que só existe em unidades
 * inteiras. Por isso o preset guarda a receita como publicada e o motor ancora
 * tudo na massa de ovo — é o que permite mexer no peso real do ovo sem
 * desmontar a proporção da fonte.
 *
 * Conferência item a item em docs/research/massas.md.
 */

export type PastaFlourKey =
  | 'flour-00'
  | 'flour-all-purpose'
  | 'flour-semolina-fine'
  | 'flour-chickpea';

export type PastaEggKey = 'egg' | 'egg-yolk';

export type PastaIngredientKey =
  | PastaFlourKey
  | PastaEggKey
  | 'water'
  | 'milk'
  | 'spinach'
  | 'spinach-liquid'
  | 'beetroot-juice'
  | 'squid-ink';

export const PASTA_FLOUR_KEYS: readonly PastaFlourKey[] = [
  'flour-00',
  'flour-all-purpose',
  'flour-semolina-fine',
  'flour-chickpea',
];

export function isPastaFlour(key: PastaIngredientKey): key is PastaFlourKey {
  return (PASTA_FLOUR_KEYS as readonly string[]).includes(key);
}

export function isPastaEgg(key: PastaIngredientKey): key is PastaEggKey {
  return key === 'egg' || key === 'egg-yolk';
}

/**
 * Líquidos que dão cor à massa. Onde eles entram, a fonte já mexeu na farinha
 * (250 g na de espinafre, 320 g na de tinta) e a razão farinha:ovo deixa de
 * ser comparável — quem manda na hidratação ali é o purê, não o ovo.
 */
export const PASTA_COLOUR_KEYS: readonly PastaIngredientKey[] = [
  'spinach',
  'spinach-liquid',
  'beetroot-juice',
  'squid-ink',
];

export function isColourLiquid(key: PastaIngredientKey): boolean {
  return PASTA_COLOUR_KEYS.includes(key);
}

/**
 * Pesos de referência do ovo, sem casca. Zielonka trabalha com ovo médio (UK),
 * que é o que sustenta os 150 g de ovo dos 3 ovos da massa clássica; a gema de
 * 18 g sai das 4 gemas ≈ 72 g da massa rica. São as âncoras da conversão — o
 * usuário pode trocá-las pelo peso real do ovo dele.
 */
export const REFERENCE_EGG_GRAMS = 50;
export const REFERENCE_YOLK_GRAMS = 18;

/** Contexto da refeição, que decide os gramas de massa por pessoa. */
export type ServingStyle = 'starter' | 'main' | 'generous';

export const SERVING_STYLES: readonly ServingStyle[] = [
  'starter',
  'main',
  'generous',
];

export type PastaFamily = 'egg' | 'vegan' | 'gluten-free';

export type PastaShapeKind = 'ribbon' | 'sheet' | 'filled' | 'offcut';

export interface PastaLine {
  key: PastaIngredientKey;
  grams: number;
  /**
   * Farinha que a fonte manda incorporar durante a sova, além da pesada no
   * começo. É o "teste do polegar" da Hazan: a receita nasce úmida de
   * propósito e a farinha final é maior que a da lista.
   */
  absorbGrams?: number;
  /**
   * Quanto é preciso comprar para chegar aos `grams` que vão à massa: 150 g de
   * espinafre cru viram ~50 g depois de branqueados e espremidos, e 200 g de
   * beterraba rendem 40 g de suco coado. Sem isso a lista de compras mente.
   */
  prepGrams?: number;
}

export interface PastaPreset {
  id: string;
  family: PastaFamily;
  /** Receita como publicada, em gramas. */
  lines: readonly PastaLine[];
  /**
   * Rendimento publicado (massa pronta). Quando a fonte não publica, o motor
   * usa a soma dos ingredientes — nunca um número inventado.
   */
  yieldGrams?: number;
  /** Porções declaradas pela fonte para o rendimento acima. */
  servings?: number;
  /** Rendimento em peças, quando é assim que a fonte conta (tortellini). */
  pieceYield?: number;
  /** Formatos que a própria fonte desaconselha para esta massa. */
  unsuitable?: readonly PastaShapeKind[];
  citations: readonly Citation[];
  /** Chave no dicionário com o preparo específico da massa. */
  noteKey: string;
}

export interface PastaShape {
  id: string;
  kind: PastaShapeKind;
  /** Setting final na máquina de Zielonka (0 = cilindro mais aberto). */
  setting?: number;
  /** Segundo setting quando a fonte oferece alternativa. */
  altSetting?: number;
  /** As fontes não concordam na espessura deste formato. */
  divergent?: boolean;
  citations: readonly Citation[];
}

/**
 * Prato montado com a massa: a fonte publica o rendimento do prato inteiro
 * (forma de lasanha, peças de tortellini), que não sai da conta de gramas por
 * pessoa da massa em fita.
 */
export interface PastaDish {
  id: string;
  /** Massa da calculadora que a fonte usa no prato, quando existe preset. */
  presetId?: string;
  /** Massa crua pedida pela receita. */
  doughGrams?: number;
  /** Peças, quando a fonte conta assim. */
  pieces?: number;
  /** Porções publicadas, como faixa (fonte que dá um número só repete). */
  servings: readonly [number, number];
  citations: readonly Citation[];
  noteKey: string;
}

export interface PastaTarget {
  servings: number;
  gramsPerServing: number;
  /** Peso real de um ovo inteiro sem casca. */
  eggGrams: number;
  /** Peso real de uma gema. */
  yolkGrams: number;
}

/** Combinação de unidades inteiras de ovo que a calculadora sugere. */
export interface EggPlan {
  eggs: number;
  yolks: number;
  /** O que a escala pediria se ovo pudesse ser fracionado. */
  idealEggs: number;
  idealYolks: number;
  eggMassGrams: number;
}

export interface PastaRecipe {
  lines: readonly PastaLine[];
  plan: EggPlan;
  /** Fator aplicado à receita publicada depois do arredondamento dos ovos. */
  scale: number;
  flourGrams: number;
  /** Farinha máxima, contando a que a fonte manda incorporar na sova. */
  flourMaxGrams: number;
  /** Farinha que a escala pediria antes de arredondar os ovos. */
  idealFlourGrams: number;
  flourAdjustmentGrams: number;
  /** Tudo que não é farinha: ovo, água, purês e tinta. */
  liquidGrams: number;
  doughGrams: number;
  doughMaxGrams: number;
  yieldGrams: number;
  targetYieldGrams: number;
  servingsAchieved: number;
  hydrationPercent: number;
  /** Gramas de farinha por grama de ovo — a razão que as fontes disputam. */
  flourPerEggMass: number;
  /** A mesma razão contando a farinha incorporada na sova (Hazan). */
  flourMaxPerEggMass: number;
  /** Gramas de farinha por ovo do tamanho informado. */
  flourPerEgg: number;
  pieceYield?: number;
}
