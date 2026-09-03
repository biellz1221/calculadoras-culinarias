import { describe, expect, it } from 'vitest';

import { INGREDIENTS } from '@/data/gelato/ingredients';
import {
  auditCatalog,
  flawsInRecipe,
  inspectIngredient,
} from '@/lib/gelato/composition';
import type { Ingredient } from '@/lib/gelato/types';

const CATALOG = new Map(INGREDIENTS.map((item) => [item.id, item]));

function ingredient(id: string): Ingredient {
  const found = CATALOG.get(id);
  if (!found) throw new Error(`ingrediente ausente no catálogo: ${id}`);
  return found;
}

/**
 * Retrato da planilha de origem. Se o número mudar, foi a planilha que mudou,
 * e aí a mudança precisa ser lida, não silenciada.
 */
const FLAWED_IDS = [
  'base-de-agua',
  'croissant',
  'ervilha-seca',
  'leite-condensado',
  'leite-de-coco',
  'licor-amaretto',
  'pacoca',
  'pasta-de-amendoim-100',
  'pitaya',
  'pudim',
  'raspa-de-limao-casca',
  'stevia-em-po',
  'sucralose',
  'whey-protein-80',
] as const;

describe('auditoria de composição', () => {
  it('encontra os ingredientes que não fecham na planilha de origem', () => {
    const flaws = auditCatalog(INGREDIENTS);

    expect(INGREDIENTS).toHaveLength(164);
    expect(flaws).toHaveLength(14);
    expect(flaws.map((flaw) => flaw.ingredientId).sort()).toEqual(
      [...FLAWED_IDS].sort(),
    );
  });

  it('separa o que muda o resultado do que é desvio de arredondamento', () => {
    const severe = auditCatalog(INGREDIENTS)
      .filter((flaw) => flaw.severity === 'severe')
      .map((flaw) => flaw.ingredientId)
      .sort();

    // Os quatro em que o dado se contradiz de forma que o motor não tem como
    // contornar: massa sem composição, ou sólido cadastrado como 100% água.
    expect(severe).toEqual([
      'licor-amaretto',
      'pacoca',
      'raspa-de-limao-casca',
      'whey-protein-80',
    ]);
  });

  it('classifica massa sem composição alguma', () => {
    const flaw = inspectIngredient(ingredient('pacoca'));

    expect(flaw?.issues).toContain('no-composition');
    expect(flaw?.severity).toBe('severe');
    expect(flaw?.closureDrift).toBe(-1);
  });

  it('classifica sólido cadastrado como 100% água', () => {
    const flaw = inspectIngredient(ingredient('whey-protein-80'));

    expect(flaw?.issues).toEqual(['solids-contradicted']);
    // Sólidos e água fecham em 1: é só a parcela que contradiz o total.
    expect(flaw?.closureDrift).toBe(0);
    expect(flaw?.partsDrift).toBeGreaterThan(0.9);
  });

  it('não acusa ingrediente coerente', () => {
    expect(inspectIngredient(ingredient('leite-integral'))).toBeNull();
    expect(inspectIngredient(ingredient('acucar-sacarose'))).toBeNull();
    expect(inspectIngredient(ingredient('agua'))).toBeNull();
  });

  it('aponta só o que está na receita, e uma vez por ingrediente', () => {
    const flaws = flawsInRecipe(
      [
        { id: 'a', ingredientId: 'leite-integral', grams: 600 },
        { id: 'b', ingredientId: 'pacoca', grams: 80 },
        { id: 'c', ingredientId: 'pacoca', grams: 20 },
        { id: 'd', ingredientId: 'acucar-sacarose', grams: 120 },
      ],
      CATALOG,
    );

    expect(flaws.map((flaw) => flaw.ingredientId)).toEqual(['pacoca']);
  });

  it('ignora linha zerada e ingrediente fora do catálogo', () => {
    const flaws = flawsInRecipe(
      [
        { id: 'a', ingredientId: 'pacoca', grams: 0 },
        { id: 'b', ingredientId: 'ingrediente-inexistente', grams: 100 },
      ],
      CATALOG,
    );

    expect(flaws).toEqual([]);
  });
});
