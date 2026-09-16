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
 * Frações **mássicas**, de 0 a 1.
 *
 * `carbohydrate` é o carboidrato **sem a fibra**. Nas tabelas de composição
 * (USDA; ASHRAE, Tabela 3) o carboidrato total já inclui a fibra — a amêndoa do
 * ASHRAE fecha em 100% sem somar os 10,9% de fibra. Passar o total e a fibra
 * conta a fibra duas vezes, e a soma passa de 1.
 *
 * `alcohol` existe para ser recusado: o modelo não tem etanol, e responder
 * como se álcool fosse água erra calado (ver `compositionDensity`).
 */
export interface Composition {
  water?: number;
  protein?: number;
  fat?: number;
  carbohydrate?: number;
  fiber?: number;
  ash?: number;
  alcohol?: number;
}

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
 * número de 0 a 1, se alguma densidade não for positiva, ou se não sobrar nada
 * para somar.
 */
export function mixtureDensity(parts: readonly MixturePart[]): number | null {
  let specificVolume = 0;

  for (const { fraction, density } of parts) {
    if (!isFraction(fraction)) return null;
    if (!Number.isFinite(density) || density <= 0) return null;
    specificVolume += fraction / density;
  }

  return specificVolume > 0 ? 1 / specificVolume : null;
}

/**
 * Densidade de um líquido de composição conhecida, em g/mL.
 *
 * Nulo quando:
 * - há álcool — o modelo não tem etanol e erraria 5,6% num destilado sem avisar;
 *   mistura de água e etanol vai por `ethanolWaterDensity`;
 * - a temperatura sai de 0 a 100 °C, onde o alimento deixa de ser líquido;
 * - alguma fração não é número de 0 a 1;
 * - a soma das frações se afasta de 1 mais que o arredondamento de uma tabela de
 *   composição permite — o sinal mais comum de fibra contada duas vezes.
 */
export function compositionDensity(composition: Composition, celsius: number): number | null {
  const alcohol = composition.alcohol ?? 0;
  if (!Number.isFinite(alcohol) || alcohol !== 0) return null;

  if (!Number.isFinite(celsius) || celsius < LIQUID_MIN_CELSIUS || celsius > LIQUID_MAX_CELSIUS) {
    return null;
  }

  const parts: MixturePart[] = [];
  let sum = 0;

  for (const constituent of CONSTITUENTS) {
    const fraction = composition[constituent] ?? 0;
    if (!isFraction(fraction)) return null;
    if (fraction === 0) continue;

    sum += fraction;
    parts.push({ fraction, density: constituentDensity(constituent, celsius)! });
  }

  if (Math.abs(sum - 1) > COMPOSITION_SUM_TOLERANCE) return null;
  return mixtureDensity(parts);
}
