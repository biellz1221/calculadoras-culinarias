import { describe, expect, it } from 'vitest';

import {
  calculatePasta,
  idealScaleFor,
  planEggs,
  presetEggMass,
  presetFlourGrams,
  presetYieldGrams,
  usesEggRatio,
} from './calculate';
import { PASTA_PRESETS, getPastaPreset } from '@/data/pasta/presets';
import { PASTA_DISHES } from '@/data/pasta/dishes';
import {
  REFERENCE_EGG_GRAMS,
  REFERENCE_YOLK_GRAMS,
  type PastaIngredientKey,
  type PastaPreset,
  type PastaRecipe,
  type PastaTarget,
} from '@/data/pasta/types';

function presetOf(id: string): PastaPreset {
  const preset = getPastaPreset(id);
  if (!preset) throw new Error(`preset ausente: ${id}`);
  return preset;
}

/** Alvo que pede exatamente `scale` vezes a receita publicada. */
function targetFor(
  preset: PastaPreset,
  scale: number,
  eggGrams = REFERENCE_EGG_GRAMS,
): PastaTarget {
  return {
    servings: 4,
    gramsPerServing: (presetYieldGrams(preset) * scale) / 4,
    eggGrams,
    yolkGrams: REFERENCE_YOLK_GRAMS,
  };
}

function gramsOf(recipe: PastaRecipe, key: PastaIngredientKey): number {
  return recipe.lines
    .filter((line) => line.key === key)
    .reduce((total, line) => total + line.grams, 0);
}

describe('massa clássica do Zielonka como caso-verdade', () => {
  // "The Doughs", Classic Egg Dough: 300 g de farinha 00 + 3 ovos → 400 g,
  // serve 4, ou seja, 100 g de massa por pessoa.
  const recipe = calculatePasta(presetOf('classica'), {
    servings: 4,
    gramsPerServing: 100,
    eggGrams: REFERENCE_EGG_GRAMS,
    yolkGrams: REFERENCE_YOLK_GRAMS,
  });

  it('reproduz as gramas publicadas no livro', () => {
    expect(recipe.flourGrams).toBeCloseTo(300, 6);
    expect(gramsOf(recipe, 'egg')).toBeCloseTo(150, 6);
    expect(recipe.plan.eggs).toBe(3);
    expect(recipe.plan.yolks).toBe(0);
  });

  it('rende os 400 g que servem 4', () => {
    expect(recipe.yieldGrams).toBeCloseTo(400, 6);
    expect(recipe.servingsAchieved).toBeCloseTo(4, 6);
    expect(recipe.scale).toBeCloseTo(1, 6);
  });

  it('confirma os 100 g de farinha por ovo', () => {
    expect(recipe.flourPerEgg).toBeCloseTo(100, 6);
    // 2 g de farinha por grama de ovo; o Ratio pede 1,5, a divergência que a
    // página explica.
    expect(recipe.flourPerEggMass).toBeCloseTo(2, 6);
  });

  it('não inventa ajuste de farinha quando a escala fecha em ovo inteiro', () => {
    expect(recipe.flourAdjustmentGrams).toBeCloseTo(0, 6);
    expect(recipe.plan.idealEggs).toBeCloseTo(3, 6);
  });

  it('escala para 8 pessoas dobrando tudo', () => {
    const dobro = calculatePasta(presetOf('classica'), {
      servings: 8,
      gramsPerServing: 100,
      eggGrams: REFERENCE_EGG_GRAMS,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    expect(dobro.plan.eggs).toBe(6);
    expect(dobro.flourGrams).toBeCloseTo(600, 6);
  });
});

describe('fração de ovo', () => {
  it('sugere a combinação inteira mais próxima e mostra o ajuste', () => {
    // 6 pessoas × 100 g = 600 g: a escala pediria 4,5 ovos.
    const recipe = calculatePasta(presetOf('classica'), {
      servings: 6,
      gramsPerServing: 100,
      eggGrams: REFERENCE_EGG_GRAMS,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    expect(recipe.plan.idealEggs).toBeCloseTo(4.5, 6);
    // Empate entre 4 e 5 vai para o maior: sobra massa, não falta.
    expect(recipe.plan.eggs).toBe(5);
    expect(recipe.idealFlourGrams).toBeCloseTo(450, 6);
    expect(recipe.flourGrams).toBeCloseTo(500, 6);
    expect(recipe.flourAdjustmentGrams).toBeCloseTo(50, 6);
  });

  it('nunca desce a zero ovo quando há massa para fazer', () => {
    const recipe = calculatePasta(presetOf('classica'), {
      servings: 1,
      gramsPerServing: 85,
      eggGrams: REFERENCE_EGG_GRAMS,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    expect(recipe.plan.eggs).toBe(1);
    expect(recipe.flourGrams).toBeCloseTo(100, 6);
  });

  it('mantém a proporção de gemas da massa rica', () => {
    const recipe = calculatePasta(presetOf('rica-em-gemas'), targetFor(presetOf('rica-em-gemas'), 1.5));

    // 2 ovos + 4 gemas × 1,5 = 3 ovos + 6 gemas, sem arredondamento.
    expect(recipe.plan.eggs).toBe(3);
    expect(recipe.plan.yolks).toBe(6);
    expect(recipe.flourGrams).toBeCloseTo(420, 6);
  });

  it('trata alvo zerado como receita vazia em vez de quebrar', () => {
    const recipe = calculatePasta(presetOf('classica'), {
      servings: 0,
      gramsPerServing: 100,
      eggGrams: REFERENCE_EGG_GRAMS,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    expect(recipe.plan.eggs).toBe(0);
    expect(recipe.flourGrams).toBe(0);
    expect(recipe.doughGrams).toBe(0);
  });
});

describe('peso real do ovo', () => {
  it('ajusta a farinha ao ovo grande, mantendo a razão da fonte', () => {
    const recipe = calculatePasta(presetOf('classica'), {
      servings: 4,
      gramsPerServing: 100,
      eggGrams: 60,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    // 3 ovos de 60 g são 180 g de ovo; a 2 g de farinha por grama de ovo, a
    // farinha sobe de 300 para 360 g.
    expect(recipe.plan.eggs).toBe(3);
    expect(gramsOf(recipe, 'egg')).toBeCloseTo(180, 6);
    expect(recipe.flourGrams).toBeCloseTo(360, 6);
    expect(recipe.flourPerEggMass).toBeCloseTo(2, 6);
  });

  it('pede menos unidades quando o ovo é maior', () => {
    const preset = presetOf('classica');
    const plan = planEggs(preset, 1, {
      servings: 4,
      gramsPerServing: 100,
      eggGrams: 75,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    // 150 g de ovo cabem em 2 ovos de 75 g.
    expect(plan.eggs).toBe(2);
    expect(plan.eggMassGrams).toBeCloseTo(150, 6);
  });
});

describe('massa amarela da Hazan', () => {
  const preset = presetOf('hazan-amarela');
  const recipe = calculatePasta(preset, targetFor(preset, 1));

  it('parte de 1 cup por 2 ovos e chega a ¾ lb', () => {
    expect(recipe.plan.eggs).toBe(2);
    expect(recipe.flourGrams).toBeCloseTo(140, 6);
    expect(recipe.yieldGrams).toBeCloseTo(340, 6);
  });

  it('separa a farinha pesada da farinha incorporada na sova', () => {
    expect(recipe.flourMaxGrams).toBeCloseTo(240, 6);
    // 1,4 na lista, 2,4 depois do teste do polegar: os dois extremos da faixa.
    expect(recipe.flourPerEggMass).toBeCloseTo(1.4, 6);
    expect(recipe.flourMaxPerEggMass).toBeCloseTo(2.4, 6);
  });
});

describe('tortellini da Hazan como caso-verdade', () => {
  const preset = presetOf('hazan-tortellini');

  it('a receita cheia é de 4 ovos, 2 cups e 1 colher de leite', () => {
    const recipe = calculatePasta(preset, targetFor(preset, 1));

    expect(recipe.plan.eggs).toBe(4);
    expect(recipe.flourGrams).toBeCloseTo(280, 6);
    expect(gramsOf(recipe, 'milk')).toBeCloseTo(14, 6);
    expect(recipe.pieceYield).toBeCloseTo(200, 6);
  });

  it('metade da receita dá os ~100 tortellini que ela serve a 6', () => {
    const recipe = calculatePasta(preset, targetFor(preset, 0.5));
    const dish = PASTA_DISHES.find((item) => item.id === 'tortellini-hazan');

    expect(recipe.plan.eggs).toBe(2);
    expect(recipe.flourGrams).toBeCloseTo(140, 6);
    expect(recipe.pieceYield).toBeCloseTo(100, 6);
    expect(dish?.pieces).toBe(100);
    expect(dish?.servings[0]).toBe(6);
  });
});

describe('lasanha como caso-verdade', () => {
  it('reproduz a massa verde de 2 ovos da lasanha da Hazan', () => {
    // "Baked Green Lasagne…": massa verde de 2 ovos + 1½ cups (~450 g) numa
    // forma de 23 × 30 cm, 6 porções.
    const preset = presetOf('hazan-verde');
    const recipe = calculatePasta(preset, targetFor(preset, 1));
    const dish = PASTA_DISHES.find((item) => item.id === 'lasagne-hazan');

    expect(recipe.plan.eggs).toBe(2);
    expect(recipe.flourGrams).toBeCloseTo(210, 6);
    expect(gramsOf(recipe, 'spinach')).toBeCloseTo(140, 6);
    expect(recipe.yieldGrams).toBeCloseTo(450, 6);
    expect(dish?.doughGrams).toBe(450);
    expect(dish?.servings).toEqual([6, 6]);
  });

  it('a lasanha do Zielonka pede 1½ receita da massa clássica', () => {
    // 600 g de massa para a forma de 26 × 20 cm.
    const recipe = calculatePasta(presetOf('classica'), {
      servings: 6,
      gramsPerServing: 100,
      eggGrams: REFERENCE_EGG_GRAMS,
      yolkGrams: REFERENCE_YOLK_GRAMS,
    });

    expect(recipe.targetYieldGrams).toBeCloseTo(600, 6);
    expect(recipe.idealFlourGrams).toBeCloseTo(450, 6);
  });
});

describe('massas sem ovo e coloridas', () => {
  it('escala a massa de sêmola sem arredondar nada', () => {
    const preset = presetOf('semola-vegana');
    const recipe = calculatePasta(preset, targetFor(preset, 0.75));

    expect(recipe.plan.eggs).toBe(0);
    expect(recipe.scale).toBeCloseTo(0.75, 6);
    expect(recipe.flourGrams).toBeCloseTo(210, 6);
    expect(gramsOf(recipe, 'water')).toBeCloseTo(97.5, 6);
  });

  it('mantém os 46% de hidratação da sêmola', () => {
    const preset = presetOf('semola-vegana');
    const recipe = calculatePasta(preset, targetFor(preset, 1));

    expect(recipe.hydrationPercent).toBeCloseTo(46.4, 1);
  });

  it('pesa o purê de espinafre inteiro, com o ovo dentro dele', () => {
    // Z, Spinach Egg Dough: 150 g de espinafre cru + 1 ovo dão 100–110 g de
    // purê, e o ovo não pode ser contado de novo por fora.
    const preset = presetOf('espinafre-ovo');
    const recipe = calculatePasta(preset, targetFor(preset, 1));

    expect(recipe.flourGrams).toBeCloseTo(250, 6);
    expect(gramsOf(recipe, 'egg') + gramsOf(recipe, 'spinach')).toBeCloseTo(100, 6);
    expect(recipe.plan.eggs).toBe(1);
    expect(recipe.plan.yolks).toBe(1);
  });

  it('leva a compra do espinafre cru junto', () => {
    const preset = presetOf('espinafre-ovo');
    const recipe = calculatePasta(preset, targetFor(preset, 2));
    const spinach = recipe.lines.find((line) => line.key === 'spinach');

    expect(spinach?.grams).toBeCloseTo(100, 6);
    expect(spinach?.prepGrams).toBeCloseTo(300, 6);
  });

  it('sobe a farinha da massa de tinta de lula para compensar o líquido', () => {
    const preset = presetOf('tinta-de-lula');
    const recipe = calculatePasta(preset, targetFor(preset, 1));

    expect(recipe.flourGrams).toBeCloseTo(320, 6);
    expect(gramsOf(recipe, 'squid-ink')).toBeCloseTo(40, 6);
  });
});

describe('integridade dos presets', () => {
  it('volta à receita publicada quando o alvo é o rendimento da fonte', () => {
    for (const preset of PASTA_PRESETS) {
      const recipe = calculatePasta(preset, targetFor(preset, 1));

      expect(recipe.scale, preset.id).toBeCloseTo(1, 6);
      expect(recipe.flourGrams, preset.id).toBeCloseTo(presetFlourGrams(preset), 6);
      expect(recipe.flourAdjustmentGrams, preset.id).toBeCloseTo(0, 6);
    }
  });

  it('serve o número de porções que a fonte declara', () => {
    for (const preset of PASTA_PRESETS) {
      if (preset.servings === undefined || preset.yieldGrams === undefined) continue;

      const recipe = calculatePasta(preset, {
        servings: preset.servings,
        gramsPerServing: preset.yieldGrams / preset.servings,
        eggGrams: REFERENCE_EGG_GRAMS,
        yolkGrams: REFERENCE_YOLK_GRAMS,
      });

      expect(recipe.servingsAchieved, preset.id).toBeCloseTo(preset.servings, 6);
    }
  });

  it('tem farinha, fonte e rendimento em todos', () => {
    for (const preset of PASTA_PRESETS) {
      expect(presetFlourGrams(preset), preset.id).toBeGreaterThan(0);
      expect(preset.citations.length, preset.id).toBeGreaterThan(0);
      expect(presetYieldGrams(preset), preset.id).toBeGreaterThan(0);
    }
  });

  it('não repete ingrediente dentro da mesma receita', () => {
    for (const preset of PASTA_PRESETS) {
      const keys = preset.lines.map((line) => line.key);
      expect(new Set(keys).size, preset.id).toBe(keys.length);
    }
  });

  it('mantém a razão farinha:ovo das massas ao ovo dentro do que as fontes dizem', () => {
    // Só vale onde o ovo É o líquido: na massa colorida o purê entra no lugar
    // de parte do ovo e a fonte já ajustou a farinha.
    for (const preset of PASTA_PRESETS) {
      if (!usesEggRatio(preset)) continue;

      const ratio = presetFlourGrams(preset) / presetEggMass(preset);
      expect(ratio, preset.id).toBeGreaterThanOrEqual(1.4);
      expect(ratio, preset.id).toBeLessThanOrEqual(2.4);
    }
  });

  it('não aplica a razão farinha:ovo às massas coloridas e sem ovo', () => {
    expect(usesEggRatio(presetOf('classica'))).toBe(true);
    expect(usesEggRatio(presetOf('espinafre-ovo'))).toBe(false);
    expect(usesEggRatio(presetOf('tinta-de-lula'))).toBe(false);
    expect(usesEggRatio(presetOf('semola-vegana'))).toBe(false);
  });

  it('não pede escala quando não há alvo', () => {
    expect(idealScaleFor(presetOf('classica'), targetFor(presetOf('classica'), 0))).toBe(0);
  });
});
