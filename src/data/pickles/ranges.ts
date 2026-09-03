import { cite, type Citation } from '../citations';
import type { ClimateKey, PickleRangeKey } from './types';

/**
 * Faixas, pisos e constantes da calculadora de picles.
 *
 * `min`/`max` é a faixa usual das fontes: fora dela a calculadora sinaliza,
 * porque conserva boa às vezes mora na borda. `hardMin`/`hardMax` marcam o ponto
 * em que as fontes deixam de dar respaldo.
 *
 * Segurança alimentar não é sinalização de faixa: o piso de sal seguro
 * (`MIN_SAFE_SALINITY`) e o piso de acidez do picles de vinagre
 * (`MIN_BRINE_ACIDITY`) são verificados à parte, com aviso próprio.
 *
 * Consolidação em docs/research/picles-fermentacao.md, seções 2, 3, 4 e 6.
 */

export interface RangeRule {
  min: number;
  max: number;
  hardMin?: number;
  hardMax?: number;
  citations: readonly Citation[];
  /** Chave no dicionário com a consequência de sair da faixa. */
  noteKey: string;
}

/**
 * Piso de sal, em % sobre o peso total (vegetais + água).
 *
 * 1,5% é o menor valor que qualquer uma das fontes endossa: Katz registra
 * 1,5–2% como padrão comercial da salga seca. Abaixo disso a calculadora emite
 * aviso de segurança, e não apenas sinalização de faixa. O NCHFP é explícito em
 * não reduzir o sal de chucrute e picles fermentados.
 *
 * A verificação roda sempre sobre a salinidade **efetiva no peso total**, mesmo
 * quando a pessoa calculou sobre a água: é justamente aí que mora o erro que o
 * BWF demonstra na p. 199 (1 kg de rabanete + 20 g de sal + 1 L de água = 1%).
 */
export const MIN_SAFE_SALINITY = 1.5;

/** Teto de tolerância das bactérias lácticas ao sal. */
export const LAB_SALT_CEILING = 8;

/**
 * Piso de acidez do líquido de cobertura de um picles de vinagre, em % de ácido
 * acético.
 *
 * É exatamente o que a proporção de referência produz: vinagre de 5% de acidez
 * diluído 1:1 em água (Noma). O NCHFP recomenda vinagre de 5% e é categórico em
 * não alterar a proporção vinagre:água:alimento das receitas testadas, porque
 * precisa haver um nível mínimo e uniforme de ácido em todo o produto. Katz
 * registra 2% como o ponto em que outros micro-organismos passam a dominar, e os
 * 2,5% ficam acima desse colapso, com margem.
 */
export const MIN_BRINE_ACIDITY = 2.5;

/** Acidez do vinagre comercial de referência. */
export const REFERENCE_ACIDITY = 5;

/** pH alvo de qualquer conserva ácida. */
export const TARGET_PH = 4.6;

/**
 * Conversão do volume do pote em peso. Água é ~1 g/ml e vegetais picados ficam
 * perto disso. É estimativa declarada, não número de fonte, e a interface diz
 * isso na tela. Quem quiser precisão pesa.
 */
export const JAR_GRAMS_PER_MILLILITER = 1;

/**
 * Quanto do pote é vegetal, no modo por volume. O padrão vem do exemplo do Noma
 * (1 kg de couve-flor para 1 kg de água); o modo Katz trabalha com salmoura na
 * metade do peso dos vegetais, o que dá dois terços de vegetal.
 */
export const DEFAULT_VEGETABLE_SHARE = 0.5;
export const KATZ_VEGETABLE_SHARE = 2 / 3;

export const RANGES: Record<PickleRangeKey, RangeRule> = {
  'brine-total': {
    min: 2,
    max: 3,
    hardMin: MIN_SAFE_SALINITY,
    hardMax: LAB_SALT_CEILING,
    citations: [
      cite('bwf', 198),
      cite('bwf', 199),
      cite('noma', 'cap. 2, "Salt Sufficiently"'),
      cite('noma', 'cap. 2, "Lacto White Asparagus"'),
    ],
    noteKey: 'brineTotal',
  },

  'brine-water': {
    min: 3.5,
    max: 5,
    hardMax: 15,
    citations: [
      cite('katz', 'cap. 3, "Tabela de proporções de sal"'),
      cite('katz', 'cap. 5, "Picles azedos"'),
      cite('katz', 'cap. 5, "Kimchi"'),
    ],
    noteKey: 'brineWater',
  },

  'dry-salt': {
    min: 1.5,
    max: 2,
    hardMin: MIN_SAFE_SALINITY,
    hardMax: 3,
    citations: [
      cite('katz', 'cap. 3, "Tabela de proporções de sal"'),
      cite('bwf', 199),
      cite('katz', 'cap. 5, "Kimchi"'),
    ],
    noteKey: 'drySalt',
  },

  // Conserva salgada, não lactofermentação de mesa: limão marroquino e os
  // "boshi" trabalham num patamar de sal em que quase nada mais cresce.
  'salt-preserve': {
    min: 10,
    max: 15,
    hardMin: 6,
    citations: [
      cite('bwf', 217),
      cite('bwf', 239),
      cite('katz', 'cap. 5, "Tsukemono"'),
    ],
    noteKey: 'saltPreserve',
  },

  'vinegar-acidity': {
    min: MIN_BRINE_ACIDITY,
    max: REFERENCE_ACIDITY,
    hardMin: MIN_BRINE_ACIDITY,
    citations: [
      cite('nchfp', '"General Information on Pickling"'),
      cite('katz', 'cap. 6, "Vinagre"'),
      cite('noma', 'cap. "Vinegar"'),
    ],
    noteKey: 'vinegarAcidity',
  },

  'quick-salt': {
    min: 1,
    max: 2,
    citations: [cite('noma', 'cap. "Vinegar"')],
    noteKey: 'quickSalt',
  },

  'quick-sugar': {
    min: 2,
    max: 5,
    citations: [cite('noma', 'cap. "Vinegar"')],
    noteKey: 'quickSugar',
  },
};

/** Os dois regimes de temperatura em que as fontes trabalham (FR-023). */
export const CLIMATES: Record<
  ClimateKey,
  { celsius: readonly [number, number]; citations: readonly Citation[] }
> = {
  fast: {
    celsius: [21, 28],
    citations: [
      cite('noma', 'cap. 2, "Control the Climate"'),
      cite('noma', 'cap. 2, "Lacto Plums"'),
    ],
  },
  slow: {
    celsius: [10, 21],
    citations: [
      cite('katz', 'cap. 5, "Quanto tempo deixar fermentando?"'),
      cite('bwf', 196),
      cite('bwf', 48),
    ],
  },
};

/** Citações do bloco de segurança alimentar, sempre visível junto do resultado. */
export const SAFETY_CITATIONS = {
  ph: [
    cite('bwf', 47),
    cite('noma', 'cap. "Primer" — "Cleanliness, Pathogens, and Safety"'),
  ],
  phOfficial: [cite('nchfp', '"Ensuring Safe Canned Foods"')],
  saltFloor: [
    cite('katz', 'cap. 3, "Tabela de proporções de sal"'),
    cite('bwf', 17),
  ],
  saltFloorOfficial: [cite('nchfp', '"General Information on Fermenting"')],
  mold: [
    cite('katz', 'cap. 5, "Bolores e leveduras na superfície"'),
    cite('bwf', 201),
  ],
  submerged: [cite('katz', 'cap. 5, "Comprimir"'), cite('bwf', 197)],
  botulism: [cite('bwf', 18), cite('katz', 'cap. 5, "Os fundamentos do kraut-chi"')],
  shelf: [cite('bwf', 202), cite('bwf', 203)],
  shelfOfficial: [cite('nchfp', '"General Information on Pickling"')],
} as const;

export function statusFor(
  value: number,
  rule: RangeRule,
): 'below' | 'in' | 'above' {
  if (value < rule.min) return 'below';
  if (value > rule.max) return 'above';
  return 'in';
}

/** Passou do limite em que as fontes deixam de dar respaldo. */
export function isBeyondHardLimit(value: number, rule: RangeRule): boolean {
  if (rule.hardMin !== undefined && value < rule.hardMin) return true;
  if (rule.hardMax !== undefined && value > rule.hardMax) return true;
  return false;
}

export function ruleFor(key: PickleRangeKey): RangeRule {
  return RANGES[key];
}
