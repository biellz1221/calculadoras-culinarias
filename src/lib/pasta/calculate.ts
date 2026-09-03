import {
  REFERENCE_EGG_GRAMS,
  REFERENCE_YOLK_GRAMS,
  isColourLiquid,
  isPastaFlour,
  type EggPlan,
  type PastaLine,
  type PastaPreset,
  type PastaRecipe,
  type PastaTarget,
} from '@/data/pasta/types';

/**
 * Motor da calculadora de massa fresca.
 *
 * Contrato: a receita da fonte é publicada em gramas fechados e escala inteira
 * pelo **peso de ovo**. Como ovo só existe em unidade inteira, o motor primeiro
 * decide quantos ovos e gemas usar e só então deriva a escala real da receita —
 * é o contrário do pão, onde a farinha manda.
 *
 * Tudo aqui é número puro, sem arredondar: arredondamento é apresentação e
 * acontece só na formatação (NFR-007).
 */

const positive = (value: number): number =>
  Number.isFinite(value) && value > 0 ? value : 0;

function totalOf(
  lines: readonly PastaLine[],
  pick: (line: PastaLine) => number,
): number {
  return lines.reduce((total, line) => total + pick(line), 0);
}

/** Unidades de ovo e gema da receita publicada, nos pesos de referência. */
export function presetEggUnits(preset: PastaPreset): {
  eggs: number;
  yolks: number;
} {
  const gramsOf = (key: PastaLine['key']): number =>
    totalOf(preset.lines, (line) => (line.key === key ? line.grams : 0));

  return {
    eggs: gramsOf('egg') / REFERENCE_EGG_GRAMS,
    yolks: gramsOf('egg-yolk') / REFERENCE_YOLK_GRAMS,
  };
}

/** Peso de ovo da receita publicada — a âncora de toda a escala. */
export function presetEggMass(preset: PastaPreset): number {
  const { eggs, yolks } = presetEggUnits(preset);
  return eggs * REFERENCE_EGG_GRAMS + yolks * REFERENCE_YOLK_GRAMS;
}

/**
 * A razão farinha:ovo só descreve a massa quando o ovo é o líquido. Nas massas
 * coloridas o purê entra no lugar de parte do ovo e a própria fonte já mexeu na
 * farinha — comparar com a faixa ali diria bobagem.
 */
export function usesEggRatio(preset: PastaPreset): boolean {
  return (
    presetEggMass(preset) > 0 &&
    !preset.lines.some((line) => isColourLiquid(line.key))
  );
}

export function presetFlourGrams(preset: PastaPreset): number {
  return totalOf(preset.lines, (line) =>
    isPastaFlour(line.key) ? line.grams : 0,
  );
}

/**
 * Rendimento da receita publicada. Quando a fonte declara (400 g, ¾ lb), é o
 * declarado; quando não declara, é a soma das parcelas — incluindo a farinha
 * que ainda vai ser incorporada na sova.
 */
export function presetYieldGrams(preset: PastaPreset): number {
  if (preset.yieldGrams !== undefined) return preset.yieldGrams;
  return totalOf(preset.lines, (line) => line.grams + (line.absorbGrams ?? 0));
}

/** Escala que o alvo pediria se ovo pudesse ser cortado ao meio. */
export function idealScaleFor(preset: PastaPreset, target: PastaTarget): number {
  const base = presetYieldGrams(preset);
  if (base <= 0) return 0;

  return (positive(target.servings) * positive(target.gramsPerServing)) / base;
}

/** Inteiros vizinhos do ideal; a receita que leva ovo nunca desce a zero. */
function candidatesFor(ideal: number, required: boolean): number[] {
  if (!(ideal > 0)) return [required ? 1 : 0];

  const floor = Math.max(required ? 1 : 0, Math.floor(ideal));
  const ceil = Math.max(floor, Math.ceil(ideal));

  return floor === ceil ? [floor] : [floor, ceil];
}

/**
 * A combinação inteira de ovos e gemas mais próxima do que a escala pediria.
 *
 * Empate — 4,5 ovos, entre 4 e 5 — vai para a combinação maior: sobrar massa
 * é menos ruim do que faltar, e a massa que sobra congela.
 */
export function planEggs(
  preset: PastaPreset,
  idealScale: number,
  target: PastaTarget,
): EggPlan {
  const base = presetEggUnits(preset);
  const eggGrams = positive(target.eggGrams) || REFERENCE_EGG_GRAMS;
  const yolkGrams = positive(target.yolkGrams) || REFERENCE_YOLK_GRAMS;

  // Ovo maior faz o mesmo peso de ovo caber em menos unidades.
  const idealEggs = base.eggs * idealScale * (REFERENCE_EGG_GRAMS / eggGrams);
  const idealYolks = base.yolks * idealScale * (REFERENCE_YOLK_GRAMS / yolkGrams);
  const idealMass = idealScale * presetEggMass(preset);

  let best: EggPlan = {
    eggs: 0,
    yolks: 0,
    idealEggs,
    idealYolks,
    eggMassGrams: 0,
  };
  let bestGap = Number.POSITIVE_INFINITY;

  for (const eggs of candidatesFor(idealEggs, base.eggs > 0 && idealScale > 0)) {
    for (const yolks of candidatesFor(
      idealYolks,
      base.yolks > 0 && idealScale > 0,
    )) {
      const eggMassGrams = eggs * eggGrams + yolks * yolkGrams;
      const gap = Math.abs(eggMassGrams - idealMass);
      const tied = Math.abs(gap - bestGap) < 1e-9;

      if (gap < bestGap - 1e-9 || (tied && eggMassGrams > best.eggMassGrams)) {
        best = { eggs, yolks, idealEggs, idealYolks, eggMassGrams };
        bestGap = gap;
      }
    }
  }

  return best;
}

function scaleLines(
  preset: PastaPreset,
  scale: number,
  plan: EggPlan,
  target: PastaTarget,
): PastaLine[] {
  const eggGrams = positive(target.eggGrams) || REFERENCE_EGG_GRAMS;
  const yolkGrams = positive(target.yolkGrams) || REFERENCE_YOLK_GRAMS;

  return preset.lines.map((line) => {
    if (line.key === 'egg') return { key: line.key, grams: plan.eggs * eggGrams };
    if (line.key === 'egg-yolk') {
      return { key: line.key, grams: plan.yolks * yolkGrams };
    }

    return {
      key: line.key,
      grams: line.grams * scale,
      ...(line.absorbGrams === undefined
        ? {}
        : { absorbGrams: line.absorbGrams * scale }),
      ...(line.prepGrams === undefined
        ? {}
        : { prepGrams: line.prepGrams * scale }),
    };
  });
}

export function calculatePasta(
  preset: PastaPreset,
  target: PastaTarget,
): PastaRecipe {
  const idealScale = idealScaleFor(preset, target);
  const plan = planEggs(preset, idealScale, target);
  const baseEggMass = presetEggMass(preset);

  // Sem ovo (massas de água) não há arredondamento: a escala é a pedida.
  const scale = baseEggMass > 0 ? plan.eggMassGrams / baseEggMass : idealScale;

  const lines = scaleLines(preset, scale, plan, target);
  const flourGrams = totalOf(lines, (line) =>
    isPastaFlour(line.key) ? line.grams : 0,
  );
  const absorbGrams = totalOf(lines, (line) => line.absorbGrams ?? 0);
  const liquidGrams = totalOf(lines, (line) =>
    isPastaFlour(line.key) ? 0 : line.grams,
  );

  const doughGrams = flourGrams + liquidGrams;
  const idealFlourGrams = presetFlourGrams(preset) * idealScale;
  const eggMass = plan.eggMassGrams;

  return {
    lines,
    plan,
    scale,
    flourGrams,
    flourMaxGrams: flourGrams + absorbGrams,
    idealFlourGrams,
    flourAdjustmentGrams: flourGrams - idealFlourGrams,
    liquidGrams,
    doughGrams,
    doughMaxGrams: doughGrams + absorbGrams,
    yieldGrams:
      preset.yieldGrams === undefined
        ? doughGrams + absorbGrams
        : preset.yieldGrams * scale,
    targetYieldGrams: positive(target.servings) * positive(target.gramsPerServing),
    servingsAchieved: servingsFor(preset, scale, target),
    hydrationPercent: flourGrams > 0 ? (liquidGrams / flourGrams) * 100 : 0,
    flourPerEggMass: eggMass > 0 ? flourGrams / eggMass : 0,
    flourMaxPerEggMass: eggMass > 0 ? (flourGrams + absorbGrams) / eggMass : 0,
    flourPerEgg: plan.eggs > 0 ? flourGrams / plan.eggs : 0,
    ...(preset.pieceYield === undefined
      ? {}
      : { pieceYield: preset.pieceYield * scale }),
  };
}

function servingsFor(
  preset: PastaPreset,
  scale: number,
  target: PastaTarget,
): number {
  const perServing = positive(target.gramsPerServing);
  if (perServing <= 0) return 0;

  return (presetYieldGrams(preset) * scale) / perServing;
}
