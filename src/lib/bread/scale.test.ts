import { describe, expect, it } from 'vitest';

import {
  classifyLine,
  flourGramsOf,
  parseAmount,
  parseRecipeText,
  scaleRecipe,
  type ScaleLine,
} from './scale';

/**
 * O parser é a parte difícil desta ferramenta.
 *
 * O resto é regra de três; aqui é adivinhar o que uma pessoa quis dizer ao
 * colar a receita do caderno. Cada caso abaixo é uma forma que gente usa de
 * verdade — e os de recusa importam tanto quanto os de acerto, porque
 * classificar salsinha como sal estragaria justamente o número que a faixa
 * sinaliza.
 */

describe('quantidade escrita por gente', () => {
  it.each([
    ['500', 500],
    ['0,5', 0.5],
    ['0.5', 0.5],
    ['1.000', 1000],
    ['1,000', 1000],
    ['1.234,5', 1234.5],
    ['1,234.5', 1234.5],
    ['12.345,67', 12345.67],
  ])('lê %s como %s', (raw, expected) => {
    expect(parseAmount(raw)).toBe(expected);
  });

  it('recusa o que não é número', () => {
    expect(parseAmount('a gosto')).toBeNull();
    expect(parseAmount('')).toBeNull();
  });
});

describe('papel do ingrediente', () => {
  it.each([
    ['Farinha de trigo', 'flour'],
    ['farinha integral', 'flour'],
    ['Sêmola de grano duro', 'flour'],
    ['Bread flour', 'flour'],
    ['Whole wheat flour', 'flour'],
    ['Água', 'water'],
    ['agua morna', 'water'],
    ['Water', 'water'],
    ['Leite integral', 'water'],
    ['Sal', 'salt'],
    ['sal grosso', 'salt'],
    ['Fine sea salt', 'salt'],
    ['Fermento biológico seco', 'other'],
    ['Azeite', 'other'],
  ])('classifica "%s" como %s', (name, role) => {
    expect(classifyLine(name)).toBe(role);
  });

  it('não confunde salsa com sal', () => {
    // Comparação por palavra inteira, não por trecho. Salsinha virando sal
    // estragaria exatamente o número que a faixa de segurança sinaliza.
    expect(classifyLine('Salsa picada')).toBe('other');
    expect(classifyLine('Salsicha')).toBe('other');
    expect(classifyLine('Aguardente')).toBe('other');
  });

  it('resolve a favor da farinha quando a linha cita as duas coisas', () => {
    expect(classifyLine('Farinha com sal')).toBe('flour');
  });
});

describe('receita colada', () => {
  it('lê o nome antes ou depois da quantidade', () => {
    const lines = parseRecipeText(
      ['Farinha de trigo 1000 g', '650 g de água', 'Sal: 20g'].join('\n'),
    );

    expect(lines.map((line) => [line.name, line.grams, line.role])).toEqual([
      ['Farinha de trigo', 1000, 'flour'],
      ['água', 650, 'water'],
      ['Sal', 20, 'salt'],
    ]);
  });

  it('aceita marcador de lista, travessão e quilo', () => {
    const lines = parseRecipeText(
      ['- Farinha — 1,2 kg', '• Água ....... 780 ml', '* Sal 24 g'].join('\n'),
    );

    expect(lines.map((line) => line.grams)).toEqual([1200, 780, 24]);
    expect(lines[1]?.fromMilliliters).toBe(true);
  });

  it('ignora título de seção e instrução em vez de reclamar', () => {
    // Toda receita colada vem com linha que não é ingrediente. Avisar sobre
    // cada uma seria ruído em cima de algo que a pessoa não pediu.
    const lines = parseRecipeText(
      [
        'Para a massa:',
        'Farinha 500 g',
        '',
        'Misture tudo e deixe descansar por 30 minutos.',
        'Sal a gosto',
      ].join('\n'),
    );

    expect(lines).toHaveLength(1);
    expect(lines[0]?.name).toBe('Farinha');
  });

  it('assume gramas quando não há unidade', () => {
    const lines = parseRecipeText('Farinha 500\nÁgua 350');

    expect(lines.map((line) => line.grams)).toEqual([500, 350]);
  });

  it('não confunde o número do nome com a quantidade', () => {
    // "Farinha tipo 1" tem um número antes da quantidade. Quem pegasse o
    // primeiro número leria essa farinha como um grama.
    const lines = parseRecipeText('Farinha de trigo tipo 1 — 1000 g\nFarinha 00: 500 g');

    expect(lines.map((line) => [line.name, line.grams])).toEqual([
      ['Farinha de trigo tipo 1', 1000],
      ['Farinha 00', 500],
    ]);
  });

  it('entende litro por extenso', () => {
    const lines = parseRecipeText('Água 1 litro');

    expect(lines[0]?.grams).toBe(1000);
    expect(lines[0]?.fromMilliliters).toBe(true);
  });

  it('descarta instrução com número solto', () => {
    // "Forno a 250" passa por tudo o mais: linha curta, número sem unidade
    // depois. Quem a denuncia é o próprio nome.
    const lines = parseRecipeText(
      ['Forno a 250', 'Descanse 40', 'Rendimento 2', 'Farinha 500 g'].join('\n'),
    );

    expect(lines.map((line) => line.name)).toEqual(['Farinha']);
  });

  it('descarta instrução com unidade de tempo', () => {
    const lines = parseRecipeText('Deixe descansar por 30 minutos\nÁgua 350 g');

    expect(lines.map((line) => line.name)).toEqual(['Água']);
  });
});

/** Uma receita de padeiro comum: 1 kg de farinha a 65% e 2% de sal. */
function baseRecipe(): ScaleLine[] {
  return parseRecipeText(
    ['Farinha de trigo 1000 g', 'Água 650 g', 'Sal 20 g', 'Fermento seco 7 g'].join('\n'),
  );
}

describe('escala', () => {
  it('escala tudo na mesma proporção pela farinha', () => {
    const { lines, factor, flourGrams } = scaleRecipe(baseRecipe(), {
      kind: 'flour',
      grams: 600,
    });

    expect(factor).toBeCloseTo(0.6, 10);
    expect(flourGrams).toBeCloseTo(600, 10);
    expect(lines.map((line) => line.grams)).toEqual([600, 390, 12, 4.2]);
  });

  it('escala pelo peso total', () => {
    const recipe = baseRecipe();
    const { totalGrams, lines } = scaleRecipe(recipe, { kind: 'total', grams: 834 });

    // A receita soma 1677 g; metade disso é 838,5. Aqui pedimos 834.
    expect(totalGrams).toBeCloseTo(834, 10);
    expect(lines[0]?.grams).toBeCloseTo((1000 * 834) / 1677, 10);
  });

  it('escala por número de unidades', () => {
    const { totalGrams } = scaleRecipe(baseRecipe(), {
      kind: 'units',
      count: 8,
      unitGrams: 90,
    });

    expect(totalGrams).toBeCloseTo(720, 10);
  });

  it('traz a leitura em porcentagem de padeiro quando dá para ler', () => {
    const { analysis } = scaleRecipe(baseRecipe(), { kind: 'flour', grams: 600 });

    expect(analysis?.hydration).toBeCloseTo(65, 10);
    expect(analysis?.salt).toBeCloseTo(2, 10);
  });

  it('esconde a análise quando não há farinha identificável', () => {
    // Sem farinha não existe a régua de 100%. Mostrar zero passaria por
    // leitura válida, e não é: é ausência de leitura.
    const recipe = parseRecipeText('Manteiga 200 g\nAçúcar 150 g\nOvos 100 g');
    const { analysis, totalGrams } = scaleRecipe(recipe, { kind: 'total', grams: 900 });

    expect(analysis).toBeUndefined();
    expect(totalGrams).toBeCloseTo(900, 10);
  });

  it('não divide por zero quando a receita está vazia', () => {
    const empty = scaleRecipe([], { kind: 'flour', grams: 500 });

    expect(empty.factor).toBe(0);
    expect(empty.totalGrams).toBe(0);
    expect(empty.analysis).toBeUndefined();
  });

  it('não escala pela farinha quando não há farinha', () => {
    const recipe = parseRecipeText('Manteiga 200 g');
    expect(scaleRecipe(recipe, { kind: 'flour', grams: 500 }).factor).toBe(0);
  });

  it('conta a farinha de mais de uma linha', () => {
    const recipe = parseRecipeText('Farinha branca 800 g\nFarinha de centeio 200 g');
    expect(flourGramsOf(recipe)).toBe(1000);
  });
});
