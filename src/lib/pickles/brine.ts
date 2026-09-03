import { JAR_GRAMS_PER_MILLILITER } from '@/data/pickles/ranges';
import type {
  BrineInput,
  BrineParams,
  BrineResult,
  DrySaltResult,
  SaltBasis,
} from '@/data/pickles/types';

/**
 * Motor da lactofermentação: salmoura e salga direta.
 *
 * O contrato é o mesmo dos três livros: a porcentagem de sal é sobre a **base**
 * (o total do pote, ou só a água, ou só o vegetal), nunca sobre base + sal
 * (Noma, "Primer", "Salt and Baker's Percentages"; BWF, p. 198).
 *
 * A saída traz sempre as **duas** salinidades efetivas, sobre o total e sobre
 * a água, porque é a diferença entre elas que a página existe para mostrar. É
 * também o que revela o erro que o BWF demonstra na p. 199: 1 kg de rabanete +
 * 20 g de sal + 1 L de água não são 2%, são 1%.
 *
 * Tudo aqui é número puro, sem arredondar: arredondamento é apresentação.
 */

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function clampShare(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export interface BrineAmounts {
  vegetableGrams: number;
  waterGrams: number;
  totalGrams: number;
}

/**
 * Converte a entrada em gramas. No modo por volume, o pote é estimado a 1 g/ml
 * e repartido pela proporção vegetal/água informada: estimativa declarada, que
 * a interface mostra como tal.
 */
export function resolveAmounts(input: BrineInput): BrineAmounts {
  if (input.kind === 'weights') {
    const vegetableGrams = positive(input.vegetableGrams);
    const waterGrams = positive(input.waterGrams);
    return { vegetableGrams, waterGrams, totalGrams: vegetableGrams + waterGrams };
  }

  // Lista livre: a conta é a mesma de sempre, só que os dois pesos vêm de
  // somar as linhas por papel. Nada aqui sabe o que é cada ingrediente.
  if (input.kind === 'ingredients') {
    let vegetableGrams = 0;
    let waterGrams = 0;

    for (const line of input.lines) {
      const grams = positive(line.grams);
      if (line.role === 'liquid') waterGrams += grams;
      else vegetableGrams += grams;
    }

    return { vegetableGrams, waterGrams, totalGrams: vegetableGrams + waterGrams };
  }

  const totalGrams = positive(input.jarMilliliters) * JAR_GRAMS_PER_MILLILITER;
  const vegetableGrams = totalGrams * clampShare(input.vegetableShare);

  return { vegetableGrams, waterGrams: totalGrams - vegetableGrams, totalGrams };
}

export function calculateBrine({
  input,
  saltPercent,
  basis,
}: BrineParams): BrineResult {
  const { vegetableGrams, waterGrams, totalGrams } = resolveAmounts(input);
  const base = basis === 'water' ? waterGrams : totalGrams;
  const saltGrams = (base * positive(saltPercent)) / 100;

  return {
    vegetableGrams,
    waterGrams,
    totalGrams,
    saltGrams,
    percentOfTotal: totalGrams > 0 ? (saltGrams / totalGrams) * 100 : 0,
    percentOfWater: waterGrams > 0 ? (saltGrams / waterGrams) * 100 : 0,
    basis,
  };
}

/**
 * A mesma quantidade de sal, expressa na outra base. Serve para trocar o método
 * sem mudar a receita: os 5% sobre a água de Katz viram os 1,7% sobre o total
 * que o produto realmente terá.
 */
export function percentForBasis(result: BrineResult, basis: SaltBasis): number {
  return basis === 'water' ? result.percentOfWater : result.percentOfTotal;
}

/**
 * Salga direta: o sal é sobre o peso do vegetal e a salmoura sai do próprio
 * vegetal por osmose, então a salinidade final do produto é a própria
 * porcentagem aplicada (Katz, cap. 5, "Salgar com salga seca ou salmoura").
 */
export function calculateDrySalt(
  vegetableGrams: number,
  saltPercent: number,
): DrySaltResult {
  const grams = positive(vegetableGrams);
  const percent = positive(saltPercent);

  return {
    vegetableGrams: grams,
    saltGrams: (grams * percent) / 100,
    percentOfVegetable: percent,
  };
}

/** Quanta água a proporção vegetal/água pede para um peso de vegetal dado. */
export function waterForShare(
  vegetableGrams: number,
  vegetableShare: number,
): number {
  const share = clampShare(vegetableShare);
  if (share <= 0 || share >= 1) return 0;

  return (positive(vegetableGrams) * (1 - share)) / share;
}
