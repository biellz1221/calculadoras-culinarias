import { getMethod } from '@/data/brine/methods';
import { SALT_KINDS, teaspoonsFromGrams } from '@/data/brine/salt';
import type { BrineInput, BrineResult } from '@/data/brine/types';

/**
 * Motor da calculadora de salmoura.
 *
 * A conta é multiplicação: cada método tem três frações sobre o peso da
 * proteína, e a saída são três pesos. O que justifica a ferramenta é o que veio
 * antes da multiplicação — que as duas fontes publicam a dose em colher de uma
 * marca americana e em porcentagem escondida numa coluna de tabela, e que a
 * diferença entre elas não é a que a bibliografia do projeto dizia.
 *
 * Tudo em número puro, sem arredondar. Arredondamento é apresentação.
 */

const EMPTY: BrineResult = {
  saltGrams: 0,
  liquidGrams: 0,
  sugarGrams: 0,
  brineGrams: 0,
  saltInLiquid: 0,
  teaspoons: { diamondCrystal: 0, mortonKosher: 0 },
};

export function calculateBrine(input: BrineInput): BrineResult {
  const method = getMethod(input.methodId);
  const proteinGrams = Math.max(0, input.proteinGrams);

  if (!method) return EMPTY;

  const saltGrams = proteinGrams * method.salt;
  const liquidGrams = proteinGrams * method.liquid;
  const sugarGrams = proteinGrams * method.sugar;
  const brineGrams = liquidGrams > 0 ? liquidGrams + saltGrams + sugarGrams : 0;

  const diamond = SALT_KINDS.find((kind) => kind.id === 'diamondCrystal');
  const morton = SALT_KINDS.find((kind) => kind.id === 'mortonKosher');

  return {
    saltGrams,
    liquidGrams,
    sugarGrams,
    brineGrams,
    // Sobre a massa da salmoura pronta, que é como "salmoura de 6%" costuma
    // ser escrita. Sem líquido não existe a grandeza, e devolver zero é mais
    // honesto que devolver 100%.
    saltInLiquid: brineGrams > 0 ? saltGrams / brineGrams : 0,
    teaspoons: {
      diamondCrystal: diamond ? teaspoonsFromGrams(saltGrams, diamond) : 0,
      mortonKosher: morton ? teaspoonsFromGrams(saltGrams, morton) : 0,
    },
  };
}
