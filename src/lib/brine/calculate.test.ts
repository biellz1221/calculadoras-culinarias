import { describe, expect, it } from 'vitest';

import { calculateBrine } from './calculate';
import {
  BRINE_METHODS,
  FOODLAB_TRIAL,
  MODERNIST_TARGET_SALT,
  getMethod,
} from '@/data/brine/methods';
import {
  SALT_KINDS,
  dryDoseFromFoodLab,
  gramsPerTeaspoon,
  teaspoonsFromGrams,
} from '@/data/brine/salt';

/**
 * Os casos-verdade são as receitas do Modernist e a conversão de volume para
 * peso do Ruhlman & Polcyn, que é o que torna a dose do Food Lab executável.
 *
 * Se o motor, alimentado com o peso de proteína da receita, devolve o sal e a
 * água da receita, ele está certo pelas fontes e não pela minha álgebra.
 */

function ofMethod(id: string) {
  const method = getMethod(id);
  if (!method) throw new Error(`método ausente do catálogo: ${id}`);
  return method;
}

function run(methodId: string, proteinGrams: number) {
  return calculateBrine({ methodId, proteinGrams });
}

describe('as receitas do Modernist at Home, reproduzidas', () => {
  it('Basic Brine for Whole Poultry: 2 kg de frango pedem 200 g de água e 12 g de sal', () => {
    const result = run('equilibrium-poultry', 2000);

    expect(result.liquidGrams).toBeCloseTo(200, 6);
    expect(result.saltGrams).toBeCloseTo(12, 6);
    expect(result.sugarGrams).toBe(0);
  });

  it('Sweet Brine for Meats: 750 g de carne pedem 150 g de líquido, 10 g de sal e 9 g de açúcar', () => {
    const result = run('sweet-meat', 750);

    // 10% de leite mais 10% de suco de maçã.
    expect(result.liquidGrams).toBeCloseTo(150, 6);
    expect(result.saltGrams).toBeCloseTo(10, 6);
    expect(result.sugarGrams).toBeCloseTo(9, 6);
  });

  it('Fish Brine: 600 g de peixe pedem 1 kg de água, 50 g de sal e 40 g de açúcar', () => {
    const result = run('immersion-fish', 600);

    expect(result.liquidGrams).toBeCloseTo(1000, 6);
    expect(result.saltGrams).toBeCloseTo(50, 6);
    expect(result.sugarGrams).toBeCloseTo(40, 6);
  });

  it('Fish Cure: 1 kg de peixe pede 35 g de sal e 25 g de açúcar, sem água', () => {
    const result = run('cure-fish', 1000);

    expect(result.saltGrams).toBeCloseTo(35, 6);
    expect(result.sugarGrams).toBeCloseTo(25, 6);
    expect(result.liquidGrams).toBe(0);
    expect(result.brineGrams).toBe(0);
  });

  it('a dose injetada de ave cai em cima do alvo que o livro declara', () => {
    // "You're shooting for a final concentration of about 0.5% salt."
    const poultry = ofMethod('equilibrium-poultry');
    expect(poultry.salt).toBeGreaterThanOrEqual(MODERNIST_TARGET_SALT);
    expect(poultry.salt - MODERNIST_TARGET_SALT).toBeLessThan(0.002);
  });
});

describe('a colher americana virando grama', () => {
  it('reproduz os pesos que Ruhlman & Polcyn publicam', () => {
    const diamond = SALT_KINDS.find((kind) => kind.id === 'diamondCrystal')!;
    const morton = SALT_KINDS.find((kind) => kind.id === 'mortonKosher')!;

    // 4,8 oz por xícara, 48 colheres de chá na xícara.
    expect(gramsPerTeaspoon(diamond)).toBeCloseTo(2.835, 3);
    expect(gramsPerTeaspoon(morton)).toBeCloseTo(4.725, 3);
  });

  it('a dose de salga seca do Food Lab é 0,625% do peso da carne', () => {
    // "1 teaspoon of Diamond Crystal kosher salt per pound of meat" refeito a
    // partir das duas fontes, e não conferido contra a própria constante.
    expect(dryDoseFromFoodLab()).toBeCloseTo(0.00625, 5);
    expect(ofMethod('dry-salting').salt).toBeCloseTo(dryDoseFromFoodLab(), 10);
  });

  it('confere a densidade contra a outra fonte', () => {
    // Food Lab, p. 359: a salmoura de "about 6 percent" é "½ cup Diamond
    // Crystal kosher salt per quart of water". Meia xícara pelo peso do
    // Ruhlman em 946 g de água tem de cair perto de 6%.
    const diamond = SALT_KINDS.find((kind) => kind.id === 'diamondCrystal')!;
    const halfCup = gramsPerTeaspoon(diamond) * 24;

    expect(halfCup).toBeCloseTo(68, 0);
    expect((100 * halfCup) / (946 + halfCup)).toBeGreaterThan(6);
    expect((100 * halfCup) / (946 + halfCup)).toBeLessThan(8);
  });

  it('a mesma colher quase dobra a dose se a marca muda', () => {
    // É o motivo de a saída ser em gramas. Um por libra de cada marca:
    const grams = 100;
    const diamond = SALT_KINDS.find((kind) => kind.id === 'diamondCrystal')!;
    const morton = SALT_KINDS.find((kind) => kind.id === 'mortonKosher')!;

    expect(teaspoonsFromGrams(grams, diamond)).toBeGreaterThan(
      teaspoonsFromGrams(grams, morton) * 1.6,
    );
  });

  it('devolve o peso em colheres das duas marcas', () => {
    // 1 kg de carne na salga seca: 6,25 g de sal.
    const result = run('dry-salting', 1000);

    expect(result.saltGrams).toBeCloseTo(6.25, 6);
    expect(result.teaspoons.diamondCrystal).toBeCloseTo(6.25 / 2.835, 2);
    expect(result.teaspoons.mortonKosher).toBeCloseTo(6.25 / 4.725, 2);
  });
});

describe('a divergência que a pesquisa corrigiu', () => {
  it('as duas fontes concordam sobre o sal, dentro de um erro de colher', () => {
    // A bibliografia do projeto dizia 0,5 % contra 0,85 %. Lidas as fontes, são
    // 0,6 % e 0,625 % — diferença menor que 0,3 g num quilo de carne.
    const dry = ofMethod('dry-salting').salt;
    const wet = ofMethod('equilibrium-poultry').salt;

    expect(Math.abs(dry - wet) * 1000).toBeLessThan(0.3);
  });

  it('a diferença está na água, não no sal', () => {
    expect(ofMethod('dry-salting').liquid).toBe(0);
    expect(ofMethod('equilibrium-poultry').liquid).toBeCloseTo(0.1, 10);
  });

  it('o experimento do Food Lab dá um ponto para a salmoura, e ele é água', () => {
    const brined = FOODLAB_TRIAL.find((row) => row.id === 'brined')!;
    const salted = FOODLAB_TRIAL.find((row) => row.id === 'salted')!;
    const water = FOODLAB_TRIAL.find((row) => row.id === 'water')!;
    const plain = FOODLAB_TRIAL.find((row) => row.id === 'plain')!;

    // A salmoura fica um ponto percentual acima da salga seca.
    expect((brined.afterCooking - salted.afterCooking) * 100).toBeCloseTo(1, 1);
    // E só a água não ajuda: sozinha, sai pior que não fazer nada.
    expect(water.afterCooking).toBeLessThan(plain.afterCooking);
  });
});

describe('equilíbrio e não equilíbrio', () => {
  it('marca como fora de equilíbrio exatamente os dois métodos de peixe', () => {
    const timed = BRINE_METHODS.filter((method) => !method.equilibrium).map((m) => m.id);
    expect(timed.sort()).toEqual(['cure-fish', 'immersion-fish']);
  });

  it('a salmoura de peixe é muito mais forte que a de equilíbrio, e é por isso', () => {
    // 8,3 % sobre o peixe contra 0,6 % sobre a ave: a de imersão nunca poderia
    // ser deixada até equilibrar.
    expect(ofMethod('immersion-fish').salt).toBeGreaterThan(
      ofMethod('equilibrium-poultry').salt * 10,
    );
  });

  it('calcula a força da salmoura sobre a massa pronta', () => {
    // 600 g de peixe: 50 g de sal e 40 g de açúcar em 1 kg de água.
    const result = run('immersion-fish', 600);
    expect(result.brineGrams).toBeCloseTo(1090, 6);
    expect(result.saltInLiquid * 100).toBeCloseTo(4.6, 1);
  });

  it('não inventa concentração onde não há líquido', () => {
    expect(run('dry-salting', 1000).saltInLiquid).toBe(0);
    expect(run('cure-fish', 1000).saltInLiquid).toBe(0);
  });
});

describe('entradas de canto', () => {
  it('método desconhecido devolve zeros, e não uma dose inventada', () => {
    const result = run('salmoura-do-vizinho', 1000);
    expect(result.saltGrams).toBe(0);
    expect(result.teaspoons.diamondCrystal).toBe(0);
  });

  it('peso negativo é tratado como zero', () => {
    expect(run('dry-salting', -500).saltGrams).toBe(0);
  });

  it('escala linear: o dobro da carne, o dobro de tudo', () => {
    const one = run('sweet-meat', 750);
    const two = run('sweet-meat', 1500);

    expect(two.saltGrams).toBeCloseTo(one.saltGrams * 2, 10);
    expect(two.liquidGrams).toBeCloseTo(one.liquidGrams * 2, 10);
    expect(two.saltInLiquid).toBeCloseTo(one.saltInLiquid, 10);
  });
});
