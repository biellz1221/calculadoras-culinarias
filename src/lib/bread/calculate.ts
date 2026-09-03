import {
  PRE_FERMENT_HYDRATION,
  isHydrationLiquid,
  isPreFerment,
  type BreadFormula,
  type BreadRecipe,
  type BreadTarget,
  type FormulaLine,
  type RecipeLine,
} from '@/data/bread/types';

/**
 * Motor da calculadora de pães.
 *
 * Contrato: as porcentagens da fórmula são sempre sobre a **farinha total**, e
 * a soma das farinhas é 100. Sob esse contrato, converter para gramas é
 * `farinha × porcentagem ÷ 100` para qualquer linha.
 *
 * Tudo aqui é número puro, sem arredondar: arredondamento é apresentação e
 * acontece só na formatação (NFR-007).
 */

function sumPercent(lines: readonly FormulaLine[]): number {
  return lines.reduce((total, line) => total + line.percent, 0);
}

/** Soma de toda a fórmula, com a farinha valendo 100. */
export function doughPercentTotal(formula: BreadFormula): number {
  return sumPercent(formula.flours) + sumPercent(formula.lines);
}

/** Hidratação declarada: água e leite sobre a farinha. */
export function declaredHydration(formula: BreadFormula): number {
  return formula.lines
    .filter((line) => isHydrationLiquid(line.key))
    .reduce((total, line) => total + line.percent, 0);
}

/**
 * Farinha e água escondidas dentro dos pré-fermentos, em pontos percentuais da
 * farinha da receita. Um levain líquido a 20% carrega 10 de farinha e 10 de
 * água. Ignorar isso subestima a hidratação real da massa (Kayser, p. 24).
 */
export function preFermentSplit(formula: BreadFormula): {
  flour: number;
  water: number;
} {
  let flour = 0;
  let water = 0;

  for (const line of formula.lines) {
    if (!isPreFerment(line.key)) continue;

    const hydration = PRE_FERMENT_HYDRATION[line.key];
    const flourPart = line.percent / (1 + hydration / 100);

    flour += flourPart;
    water += line.percent - flourPart;
  }

  return { flour, water };
}

/**
 * Hidratação real da massa, somando a água do pré-fermento à água livre e a
 * farinha do pré-fermento à farinha declarada.
 */
export function effectiveHydration(formula: BreadFormula): number {
  const { flour, water } = preFermentSplit(formula);
  const flourBase = sumPercent(formula.flours) + flour;

  if (flourBase <= 0) return 0;

  return ((declaredHydration(formula) + water) / flourBase) * 100;
}

/** Quanta farinha a meta pedida representa. */
export function flourGramsFor(formula: BreadFormula, target: BreadTarget): number {
  if (target.kind === 'flour') {
    return Math.max(0, target.grams);
  }

  const doughGrams =
    target.kind === 'dough'
      ? target.grams
      : Math.max(0, target.count) * Math.max(0, target.unitGrams);

  const total = doughPercentTotal(formula);
  if (total <= 0) return 0;

  return (Math.max(0, doughGrams) * 100) / total;
}

function toRecipeLines(
  lines: readonly FormulaLine[],
  flourGrams: number,
): RecipeLine[] {
  return lines.map((line) => ({
    key: line.key,
    percent: line.percent,
    grams: (flourGrams * line.percent) / 100,
  }));
}

export function calculateRecipe(
  formula: BreadFormula,
  target: BreadTarget,
): BreadRecipe {
  const flourGrams = flourGramsFor(formula, target);

  const flours = toRecipeLines(formula.flours, flourGrams);
  const lines = toRecipeLines(formula.lines, flourGrams);

  const salt = formula.lines.find((line) => line.key === 'salt')?.percent ?? 0;
  const totalFlourBase = sumPercent(formula.flours) + preFermentSplit(formula).flour;

  return {
    flourGrams,
    doughGrams: (flourGrams * doughPercentTotal(formula)) / 100,
    flours,
    lines,
    hydration: declaredHydration(formula),
    effectiveHydration: effectiveHydration(formula),
    salt,
    effectiveSalt: totalFlourBase > 0 ? (salt / totalFlourBase) * 100 : 0,
  };
}

/** Altera uma porcentagem da fórmula, devolvendo uma fórmula nova. */
export function withPercent(
  formula: BreadFormula,
  key: FormulaLine['key'],
  percent: number,
): BreadFormula {
  const apply = (lines: readonly FormulaLine[]): FormulaLine[] =>
    lines.map((line) =>
      line.key === key ? { ...line, percent: Math.max(0, percent) } : line,
    );

  return { flours: apply(formula.flours), lines: apply(formula.lines) };
}
