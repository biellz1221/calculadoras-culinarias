import { describe, expect, it } from 'vitest';

import { calculateRecipe, gramsToLiters, litersToGrams, roundGrams, scaleToTarget } from './calc';
import type { Ingredient, RecipeItem, RecipeType } from './types';
import { INGREDIENTS } from '@/data/gelato/ingredients';
import { PRESETS } from '@/data/gelato/presets';
import { RECIPE_TYPES } from '@/data/gelato/recipe-types';
import { GELATO_SOURCE } from '@/data/gelato/source';

const CATALOG = new Map<string, Ingredient>(INGREDIENTS.map((i) => [i.id, i]));

function typeById(id: string): RecipeType {
  const found = RECIPE_TYPES.find((t) => t.id === id);
  if (!found) throw new Error(`tipo ${id} não existe`);
  return found;
}

function item(ingredientId: string, grams: number): RecipeItem {
  return { id: `${ingredientId}-${grams}`, ingredientId, grams };
}

describe('calculateRecipe', () => {
  // Receita da aba "Gelato de Leite" da planilha original (linhas 9 a 15),
  // usada como caso-verdade: os totais precisam bater com o Excel.
  const planilha: RecipeItem[] = [
    item('agua', 550),
    item('eritritol', 100),
    item('polidextrose-fibra', 330),
    item('acucar-glucose-em-po', 10),
    item('neutro', 6),
    item('sucralose', 4),
    item('polpa-de-acai-10-14', 1000),
  ];

  it('reproduz os totais em gramas da planilha', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.totalGrams).toBe(2000);
    expect(r.metrics.sugars.grams).toBeCloseTo(149.5, 4);
    expect(r.metrics.fats.grams).toBeCloseTo(70, 4);
    expect(r.metrics.msnf.grams).toBeCloseTo(0, 4);
    expect(r.metrics.otherSolids.grams).toBeCloseTo(359.5, 4);
    expect(r.metrics.totalSolids.grams).toBeCloseTo(583, 4);
    expect(r.metrics.water.grams).toBeCloseTo(1417, 4);
  });

  it('reproduz as porcentagens e o POD/PAC por kg da planilha', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.metrics.sugars.value).toBeCloseTo(0.07475, 6);
    expect(r.metrics.fats.value).toBeCloseTo(0.035, 6);
    expect(r.metrics.otherSolids.value).toBeCloseTo(0.17975, 6);
    expect(r.metrics.totalSolids.value).toBeCloseTo(0.2915, 6);
    expect(r.metrics.water.value).toBeCloseTo(0.7085, 6);
    expect(r.metrics.pod.value).toBeCloseTo(194.2, 4);
    expect(r.metrics.pac.value).toBeCloseTo(280.5, 4);
  });

  it('reproduz o custo total da planilha', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.totalCost).toBeCloseTo(57.75, 4);
    expect(r.costPerKg).toBeCloseTo(28.875, 4);
  });

  it('classifica cada métrica contra a faixa do tipo de receita', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.metrics.sugars.status).toBe('low');
    expect(r.metrics.fats.status).toBe('low');
    expect(r.metrics.msnf.status).toBe('low');
    expect(r.metrics.otherSolids.status).toBe('high');
    expect(r.metrics.totalSolids.status).toBe('low');
    expect(r.metrics.water.status).toBe('high');
    expect(r.metrics.pod.status).toBe('ok');
    expect(r.metrics.pac.status).toBe('ok');
    expect(r.isBalanced).toBe(false);
  });

  it('deriva a temperatura de serviço de PAC / 25', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.servingTemp).toBeCloseTo(-11.22, 4);
  });

  it('marca isBalanced quando todas as métricas caem na faixa', () => {
    const equilibrada: RecipeItem[] = [
      item('leite-integral', 600),
      item('creme-de-leite-fresco-35', 100),
      item('leite-em-po-desnatado', 35),
      item('acucar-sacarose', 120),
      item('acucar-dextrose', 40),
      item('neutro', 5),
    ];
    const r = calculateRecipe(equilibrada, CATALOG, typeById('gelato-leite'));
    expect(r.isBalanced).toBe(true);
  });

  it('ignora ingredientes desconhecidos mas conta a massa deles', () => {
    const r = calculateRecipe([item('nao-existe', 100)], CATALOG, typeById('sorbet'));
    expect(r.totalGrams).toBe(100);
    expect(r.metrics.totalSolids.grams).toBe(0);
    expect(r.rows[0]?.contributions.sugars).toBe(0);
  });

  it('não divide por zero com receita vazia', () => {
    const r = calculateRecipe([], CATALOG, typeById('sorbet'));
    expect(r.totalGrams).toBe(0);
    expect(Number.isFinite(r.metrics.pod.value)).toBe(true);
    expect(r.isBalanced).toBe(false);
  });

  it('calcula a participação de cada linha na massa e no custo', () => {
    const r = calculateRecipe(planilha, CATALOG, typeById('gelato-leite'));
    expect(r.rows[0]?.percentOfBatch).toBeCloseTo(0.275, 6);
    expect(r.rows[6]?.costShare).toBeCloseTo(0.692641, 5);
  });

  it('calcula a proteína da batida', () => {
    const r = calculateRecipe([item('leite-integral', 1000)], CATALOG, typeById('gelato-leite'));
    expect(r.proteinGrams).toBeCloseTo(35, 4);
    expect(r.proteinPercent).toBeCloseTo(0.035, 6);
  });
});

describe('scaleToTarget', () => {
  it('reescala preservando as proporções', () => {
    const scaled = scaleToTarget([item('agua', 500), item('acucar-sacarose', 500)], 2000);
    expect(scaled.map((i) => i.grams)).toEqual([1000, 1000]);
  });

  it('mantém a receita quando a massa atual é zero', () => {
    const items = [item('agua', 0)];
    expect(scaleToTarget(items, 1000)).toBe(items);
  });

  it('arredonda para 0,1 g', () => {
    const scaled = scaleToTarget([item('agua', 333), item('acucar-sacarose', 667)], 1000.5);
    expect(scaled[0]?.grams).toBe(333.2);
  });
});

describe('roundGrams', () => {
  it('arredonda para a menor unidade prática da balança', () => {
    expect(roundGrams(12.34)).toBe(12.3);
    expect(roundGrams(12.35)).toBe(12.4);
  });
});

describe('conversão litros/gramas', () => {
  it('usa a densidade padrão de 1,1 g/mL', () => {
    expect(litersToGrams(2)).toBeCloseTo(2200, 6);
    expect(gramsToLiters(2200)).toBeCloseTo(2, 6);
  });

  it('aceita densidade customizada', () => {
    expect(litersToGrams(1, 1.05)).toBeCloseTo(1050, 6);
  });
});

describe('catálogo de ingredientes', () => {
  it('tem ids únicos', () => {
    const ids = new Set(INGREDIENTS.map((i) => i.id));
    expect(ids.size).toBe(INGREDIENTS.length);
  });

  it('traz os 164 ingredientes declarados na procedência', () => {
    expect(INGREDIENTS).toHaveLength(164);
    expect(GELATO_SOURCE.kind).toBe('course-spreadsheet');
  });

  it('mantém todos os coeficientes de composição entre 0 e 1', () => {
    for (const i of INGREDIENTS) {
      for (const key of ['sugars', 'fats', 'msnf', 'otherSolids', 'totalSolids', 'water'] as const) {
        expect(i[key], `${i.name}.${key}`).toBeGreaterThanOrEqual(0);
        expect(i[key], `${i.name}.${key}`).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('presets', () => {
  it('todos fecham dentro das faixas do seu tipo de receita', () => {
    for (const preset of PRESETS) {
      const items: RecipeItem[] = preset.items.map((i, idx) => ({
        id: `${preset.id}-${idx}`,
        ingredientId: i.ingredientId,
        grams: i.grams,
      }));
      const r = calculateRecipe(items, CATALOG, typeById(preset.recipeTypeId));
      const fora = Object.values(r.metrics)
        .filter((m) => m.status !== 'ok')
        .map((m) => `${m.key}=${m.value.toFixed(4)} (${m.status})`);
      expect(fora, `${preset.name}: ${fora.join(', ')}`).toEqual([]);
    }
  });

  it('só referencia ingredientes existentes no catálogo', () => {
    for (const preset of PRESETS) {
      for (const i of preset.items) {
        expect(CATALOG.has(i.ingredientId), `${preset.name} → ${i.ingredientId}`).toBe(true);
      }
    }
  });

  it('cobre todos os tipos de base', () => {
    const covered = new Set(PRESETS.map((p) => p.recipeTypeId));
    for (const type of RECIPE_TYPES) {
      expect(covered.has(type.id), type.id).toBe(true);
    }
  });
});
