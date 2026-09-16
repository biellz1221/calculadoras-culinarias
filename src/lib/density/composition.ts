import {
  COMPOSITION_SUM_TOLERANCE,
  CONSTITUENTS,
  CONSTITUENT_DENSITY,
  CONSTITUENT_MAX_CELSIUS,
  CONSTITUENT_MIN_CELSIUS,
  LIQUID_MAX_CELSIUS,
  LIQUID_MIN_CELSIUS,
  type Constituent,
} from '@/data/density/composition';

/**
 * Densidade de um líquido pela composição (Choi & Okos, via ASHRAE cap. 19).
 *
 * Tudo aqui sai em g/mL, como o resto do motor, exceto `mixtureDensity`, que
 * devolve na unidade das densidades que recebe.
 */

/**
 * Frações **mássicas**, de 0 a 1, como uma tabela de composição publica.
 *
 * `totalCarbohydrate` é o carboidrato **total**, com a fibra dentro — é assim
 * que o USDA ("by difference") e a Tabela 3 do ASHRAE o dão: a amêndoa de lá
 * fecha em 100% sem somar a coluna de fibra. `fiber` é a parte dele que é fibra,
 * e o motor subtrai por dentro. Receber as duas colunas como a tabela imprime
 * torna impossível contar a fibra duas vezes, em vez de tentar detectar.
 *
 * `alcohol` existe para ser recusado: o modelo não tem etanol, e responder
 * como se álcool fosse água erra calado (ver `compositionDensity`).
 */
export interface Composition {
  water?: number;
  protein?: number;
  fat?: number;
  totalCarbohydrate?: number;
  fiber?: number;
  ash?: number;
  alcohol?: number;
}

/** As chaves que o motor aceita. Chave fora daqui — `ethanol` por engano, digamos — é recusada. */
const COMPOSITION_KEYS: Record<keyof Composition, true> = {
  water: true,
  protein: true,
  fat: true,
  totalCarbohydrate: true,
  fiber: true,
  ash: true,
  alcohol: true,
};

/**
 * Folga de ponto flutuante na comparação da soma. `Math.abs(0.99 − 1)` vale
 * 0,010000000000000009, e sem folga a borda que a tolerância promete aceitar
 * seria recusada — o mesmo `0,7000000000000001` que já custou caro no site.
 */
const FLOAT_SLACK = 1e-9;

export interface MixturePart {
  /** Fração mássica. */
  fraction: number;
  /** Densidade do componente, em qualquer unidade — a mesma para todos. */
  density: number;
}

function isFraction(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

/**
 * Densidade de um constituinte puro, em g/mL, pelas Tabelas 1 e 2.
 *
 * Nulo fora de −40 a 150 °C, a faixa que as tabelas declaram, e para
 * constituinte que não está no catálogo.
 */
export function constituentDensity(constituent: Constituent, celsius: number): number | null {
  if (!Object.hasOwn(CONSTITUENT_DENSITY, constituent)) return null;
  if (
    !Number.isFinite(celsius) ||
    celsius < CONSTITUENT_MIN_CELSIUS ||
    celsius > CONSTITUENT_MAX_CELSIUS
  ) {
    return null;
  }

  const [c0, c1, c2] = CONSTITUENT_DENSITY[constituent];
  return (c0 + c1 * celsius + c2 * celsius ** 2) / 1000;
}

/**
 * A equação (6) do ASHRAE com porosidade zero: `ρ = 1 ÷ Σ (xᵢ ÷ ρᵢ)`.
 *
 * As frações entram como vieram, sem normalizar — é o que a fonte faz no
 * exemplo resolvido, cujas frações somam 1,0034. Nulo se alguma fração não for
 * número de 0 a 1, se alguma densidade não for positiva, se não sobrar nada
 * para somar, ou se a conta estourar (densidade minúscula faz `x/ρ` virar
 * infinito, e `1/∞` seria um zero fisicamente absurdo).
 */
export function mixtureDensity(parts: readonly MixturePart[]): number | null {
  let specificVolume = 0;

  for (const { fraction, density } of parts) {
    if (!isFraction(fraction)) return null;
    if (!Number.isFinite(density) || density <= 0) return null;
    specificVolume += fraction / density;
  }

  if (!Number.isFinite(specificVolume) || specificVolume <= 0) return null;
  return 1 / specificVolume;
}

/**
 * Lê a composição só pelas propriedades próprias do objeto, e só das chaves
 * conhecidas. Um objeto que herde `water` de um protótipo não tem água.
 */
function ownFractions(composition: Composition): Record<keyof Composition, number> | null {
  for (const key of Object.keys(composition)) {
    if (!Object.hasOwn(COMPOSITION_KEYS, key)) return null;
  }

  const read = {} as Record<keyof Composition, number>;
  for (const key of Object.keys(COMPOSITION_KEYS) as (keyof Composition)[]) {
    const value = Object.hasOwn(composition, key) ? composition[key] : undefined;
    const fraction = value ?? 0;
    if (!isFraction(fraction)) return null;
    read[key] = fraction;
  }
  return read;
}

/**
 * Densidade de um líquido de composição conhecida, em g/mL.
 *
 * Nulo quando:
 * - há álcool — o modelo não tem etanol e erraria 5,6% num destilado sem avisar;
 *   mistura de água e etanol vai por `ethanolWaterDensity`;
 * - a temperatura sai de 0 a 100 °C, onde o alimento deixa de ser líquido;
 * - há chave desconhecida, ou alguma fração não é número de 0 a 1;
 * - a fibra passa do carboidrato total, de que ela é parte;
 * - a soma se afasta de 1 mais que o arredondamento de uma tabela permite.
 */
export function compositionDensity(composition: Composition, celsius: number): number | null {
  const x = ownFractions(composition);
  if (!x || x.alcohol !== 0) return null;

  if (!Number.isFinite(celsius) || celsius < LIQUID_MIN_CELSIUS || celsius > LIQUID_MAX_CELSIUS) {
    return null;
  }
  if (x.fiber > x.totalCarbohydrate) return null;

  const sum = x.water + x.protein + x.fat + x.totalCarbohydrate + x.ash;
  if (Math.abs(sum - 1) > COMPOSITION_SUM_TOLERANCE + FLOAT_SLACK) return null;

  const byConstituent: Record<Constituent, number> = {
    water: x.water,
    protein: x.protein,
    fat: x.fat,
    carbohydrate: x.totalCarbohydrate - x.fiber,
    fiber: x.fiber,
    ash: x.ash,
  };

  const parts = CONSTITUENTS.filter((constituent) => byConstituent[constituent] > 0).map(
    (constituent) => ({
      fraction: byConstituent[constituent],
      density: constituentDensity(constituent, celsius)!,
    }),
  );
  return mixtureDensity(parts);
}
