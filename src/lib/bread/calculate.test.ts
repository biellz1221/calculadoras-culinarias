import { describe, expect, it } from 'vitest';

import {
  calculateRecipe,
  declaredHydration,
  doughPercentTotal,
  effectiveHydration,
  flourGramsFor,
  withPercent,
} from './calculate';
import { BREAD_PRESETS, getPreset } from '@/data/bread/presets';
import type { BreadFormula } from '@/data/bread/types';

function formulaOf(id: string): BreadFormula {
  const preset = getPreset(id);
  if (!preset) throw new Error(`preset ausente: ${id}`);
  return preset.formula;
}

function gramsOf(id: string, key: string, flourGrams: number): number {
  const recipe = calculateRecipe(formulaOf(id), { kind: 'flour', grams: flourGrams });
  return [...recipe.flours, ...recipe.lines].find((line) => line.key === key)?.grams ?? 0;
}

describe('boule do Kayser (p. 48) como caso-verdade', () => {
  // 500 g farinha · 350 g água · 100 g levain · 2 g fermento fresco · 10 g sal
  it('reproduz as gramas publicadas no livro', () => {
    expect(gramsOf('boule', 'flour-white', 500)).toBeCloseTo(500, 6);
    expect(gramsOf('boule', 'water', 500)).toBeCloseTo(350, 6);
    expect(gramsOf('boule', 'levain-liquid', 500)).toBeCloseTo(100, 6);
    expect(gramsOf('boule', 'yeast-fresh', 500)).toBeCloseTo(2, 6);
    expect(gramsOf('boule', 'salt', 500)).toBeCloseTo(10, 6);
  });

  it('soma a massa total das parcelas', () => {
    const recipe = calculateRecipe(formulaOf('boule'), { kind: 'flour', grams: 500 });
    expect(recipe.doughGrams).toBeCloseTo(962, 6);
  });
});

describe('pão francês do Camargo (cap. 3) como caso-verdade', () => {
  // 500 g farinha · 300 ml água · 20 g banha · 7 g açúcar · 5 g fermento · 10 g sal
  it('reproduz as gramas publicadas', () => {
    expect(gramsOf('pao-frances', 'water', 500)).toBeCloseTo(300, 6);
    expect(gramsOf('pao-frances', 'lard', 500)).toBeCloseTo(20, 6);
    expect(gramsOf('pao-frances', 'sugar', 500)).toBeCloseTo(7, 6);
    expect(gramsOf('pao-frances', 'yeast-instant', 500)).toBeCloseTo(5, 6);
    expect(gramsOf('pao-frances', 'salt', 500)).toBeCloseTo(10, 6);
  });
});

describe('hidratação', () => {
  it('separa a declarada da real quando há pré-fermento', () => {
    const boule = formulaOf('boule');

    // A água livre é 70% da farinha declarada...
    expect(declaredHydration(boule)).toBeCloseTo(70, 6);
    // ...mas o levain a 20% traz mais 10 de farinha e 10 de água.
    expect(effectiveHydration(boule)).toBeCloseTo((80 / 110) * 100, 6);
  });

  it('confere com o exemplo trabalhado da pesquisa', () => {
    // docs/research/paes.md §4.2: 100 farinha, 65 água e 20% de levain líquido
    // dão hidratação real de ~68%.
    const formula: BreadFormula = {
      flours: [{ key: 'flour-white', percent: 100 }],
      lines: [
        { key: 'water', percent: 65 },
        { key: 'levain-liquid', percent: 20 },
      ],
    };

    expect(effectiveHydration(formula)).toBeCloseTo(68.18, 2);
  });

  it('reproduz os 83% da ciabatta com poolish', () => {
    // Camargo, cap. 4: 480 g de farinha total e 400 g de água → 83%.
    expect(effectiveHydration(formulaOf('ciabatta'))).toBeCloseTo(83.3, 1);
  });

  it('é igual à declarada quando não há pré-fermento', () => {
    const frances = formulaOf('pao-frances');
    expect(effectiveHydration(frances)).toBeCloseTo(declaredHydration(frances), 6);
  });
});

describe('sal sobre a farinha total', () => {
  it('desconta a farinha que entra pelo pré-fermento', () => {
    // A ciabatta leva 2% de sal sobre a farinha da massa, que viram 1,7% quando
    // se conta também a farinha da poolish. É o número que a pesquisa publica.
    const recipe = calculateRecipe(formulaOf('ciabatta'), {
      kind: 'flour',
      grams: 400,
    });

    expect(recipe.salt).toBeCloseTo(2, 6);
    expect(recipe.effectiveSalt).toBeCloseTo(1.7, 1);
  });

  it('coincide com o declarado sem pré-fermento', () => {
    const recipe = calculateRecipe(formulaOf('pao-frances'), {
      kind: 'flour',
      grams: 500,
    });

    expect(recipe.effectiveSalt).toBeCloseTo(recipe.salt, 6);
  });
});

describe('metas de fornada', () => {
  it('converte peso de massa em farinha e volta ao mesmo ponto', () => {
    const formula = formulaOf('boule');
    const flour = flourGramsFor(formula, { kind: 'dough', grams: 962 });

    expect(flour).toBeCloseTo(500, 6);
  });

  it('calcula a farinha a partir de unidades', () => {
    const formula = formulaOf('pao-hamburguer');
    const flour = flourGramsFor(formula, { kind: 'units', count: 8, unitGrams: 90 });
    const recipe = calculateRecipe(formula, { kind: 'units', count: 8, unitGrams: 90 });

    expect(recipe.doughGrams).toBeCloseTo(720, 6);
    expect(flour * (doughPercentTotal(formula) / 100)).toBeCloseTo(720, 6);
  });

  it('trata entrada inválida como zero em vez de quebrar', () => {
    const formula = formulaOf('boule');

    expect(flourGramsFor(formula, { kind: 'flour', grams: -100 })).toBe(0);
    expect(flourGramsFor(formula, { kind: 'units', count: 0, unitGrams: 90 })).toBe(0);
  });

  it('escala proporcionalmente', () => {
    const dobro = gramsOf('boule', 'water', 1000);
    expect(dobro).toBeCloseTo(gramsOf('boule', 'water', 500) * 2, 6);
  });
});

describe('edição da fórmula', () => {
  it('muda só a linha pedida e devolve uma fórmula nova', () => {
    const original = formulaOf('boule');
    const alterada = withPercent(original, 'water', 75);

    expect(declaredHydration(alterada)).toBeCloseTo(75, 6);
    expect(declaredHydration(original)).toBeCloseTo(70, 6);
  });

  it('não aceita porcentagem negativa', () => {
    const alterada = withPercent(formulaOf('boule'), 'water', -10);
    expect(declaredHydration(alterada)).toBe(0);
  });
});

describe('integridade dos presets', () => {
  it('tem a base de farinha somando 100 em todos', () => {
    for (const preset of BREAD_PRESETS) {
      const total = preset.formula.flours.reduce((sum, f) => sum + f.percent, 0);
      expect(total, preset.id).toBeCloseTo(100, 1);
    }
  });

  it('não repete ingrediente dentro da mesma fórmula', () => {
    for (const preset of BREAD_PRESETS) {
      const keys = [...preset.formula.flours, ...preset.formula.lines].map((l) => l.key);
      expect(new Set(keys).size, preset.id).toBe(keys.length);
    }
  });

  it('leva sal e algum líquido ou ovo em todas as massas', () => {
    for (const preset of BREAD_PRESETS) {
      const keys = preset.formula.lines.map((line) => line.key);
      expect(keys, preset.id).toContain('salt');
      expect(
        keys.some((key) => key === 'water' || key === 'milk' || key === 'egg'),
        preset.id,
      ).toBe(true);
    }
  });

  it('monta exatamente o lote pedido quando a meta é por unidades', () => {
    for (const preset of BREAD_PRESETS) {
      if (!preset.yield) continue;

      const recipe = calculateRecipe(preset.formula, {
        kind: 'units',
        count: preset.yield.count,
        unitGrams: preset.yield.unitGrams,
      });

      const target = preset.yield.count * preset.yield.unitGrams;
      expect(recipe.doughGrams, preset.id).toBeCloseTo(target, 6);
    }
  });
});
