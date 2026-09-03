import { describe, expect, it } from 'vitest';

import {
  calculateBrine,
  calculateDrySalt,
  percentForBasis,
  resolveAmounts,
  waterForShare,
} from './brine';
import { PICKLE_PRESETS, getPreset } from '@/data/pickles/presets';
import { MIN_SAFE_SALINITY, RANGES, statusFor } from '@/data/pickles/ranges';
import { isBrinePreset, isDrySaltPreset } from '@/data/pickles/types';

describe('salmoura do Noma como caso-verdade', () => {
  // "Salt Sufficiently": 1 kg de couve-flor + 1 kg de água levam 40 g de sal,
  // que o livro chama de "4% salt brine" e diz que equilibra perto de 2%.
  const result = calculateBrine({
    input: { kind: 'weights', vegetableGrams: 1000, waterGrams: 1000 },
    saltPercent: 2,
    basis: 'total',
  });

  it('devolve os 40 g de sal publicados', () => {
    expect(result.saltGrams).toBeCloseTo(40, 6);
  });

  it('mostra as duas leituras da mesma salmoura', () => {
    // É a página inteira em dois números: 2% do pote é 4% da água.
    expect(result.percentOfTotal).toBeCloseTo(2, 6);
    expect(result.percentOfWater).toBeCloseTo(4, 6);
  });
});

describe('salmoura do Katz como caso-verdade', () => {
  // Picles azedos de pepino: 5% sobre o peso da água (50 g por litro).
  const result = calculateBrine({
    input: { kind: 'weights', vegetableGrams: 600, waterGrams: 1000 },
    saltPercent: 5,
    basis: 'water',
  });

  it('calcula o sal sobre a água, não sobre o pote', () => {
    expect(result.saltGrams).toBeCloseTo(50, 6);
    expect(result.percentOfWater).toBeCloseTo(5, 6);
  });

  it('revela a salinidade menor que o produto realmente terá', () => {
    // 50 g num pote de 1,6 kg dão pouco mais de 3%, não os 5% do rótulo.
    expect(result.percentOfTotal).toBeCloseTo(3.125, 3);
  });
});

describe('o erro que o BWF demonstra na p. 199', () => {
  it('expõe 1% onde a intuição diz 2%', () => {
    // 1 kg de vegetal + 1 L de água + 20 g de sal: quem calculou os 20 g só
    // sobre o vegetal acha que fez 2%, mas o pote inteiro está a 1%.
    const result = calculateBrine({
      input: { kind: 'weights', vegetableGrams: 1000, waterGrams: 1000 },
      saltPercent: 1,
      basis: 'total',
    });

    expect(result.saltGrams).toBeCloseTo(20, 6);
    expect(result.percentOfTotal).toBeCloseTo(1, 6);
    expect(statusFor(result.percentOfTotal, RANGES['brine-total'])).toBe('below');
  });
});

describe('chucrute do BWF como caso-verdade', () => {
  it('devolve os 20 g de sal por quilo de repolho', () => {
    // BWF, pp. 206–208: 1 kg de repolho e 20 g de sal.
    const result = calculateDrySalt(1000, 2);

    expect(result.saltGrams).toBeCloseTo(20, 6);
    expect(result.percentOfVegetable).toBeCloseTo(2, 6);
  });
});

describe('entrada por volume do pote', () => {
  it('reparte o pote pela proporção informada', () => {
    const amounts = resolveAmounts({
      kind: 'jar',
      jarMilliliters: 1000,
      vegetableShare: 0.6,
    });

    expect(amounts.totalGrams).toBeCloseTo(1000, 6);
    expect(amounts.vegetableGrams).toBeCloseTo(600, 6);
    expect(amounts.waterGrams).toBeCloseTo(400, 6);
  });

  it('não deixa a proporção sair de 0 a 1', () => {
    const acima = resolveAmounts({
      kind: 'jar',
      jarMilliliters: 1000,
      vegetableShare: 1.8,
    });

    expect(acima.vegetableGrams).toBeCloseTo(1000, 6);
    expect(acima.waterGrams).toBeCloseTo(0, 6);
  });

  it('calcula a água que a proporção pede para um peso de vegetal', () => {
    expect(waterForShare(600, 0.6)).toBeCloseTo(400, 6);
    // Proporções degeneradas não devolvem Infinity nem NaN.
    expect(waterForShare(600, 1)).toBe(0);
    expect(waterForShare(600, 0)).toBe(0);
  });
});

describe('lista livre de ingredientes', () => {
  const lines = [
    { id: '1', name: 'Cenoura', grams: 400, role: 'solid' as const },
    { id: '2', name: 'Pepino', grams: 300, role: 'solid' as const },
    { id: '3', name: 'Alho', grams: 20, role: 'solid' as const },
    { id: '4', name: 'Água', grams: 800, role: 'liquid' as const },
  ];

  it('soma as linhas por papel', () => {
    const amounts = resolveAmounts({ kind: 'ingredients', lines });

    expect(amounts.vegetableGrams).toBeCloseTo(720, 6);
    expect(amounts.waterGrams).toBeCloseTo(800, 6);
    expect(amounts.totalGrams).toBeCloseTo(1520, 6);
  });

  it('conta o aromático no total, como qualquer sólido', () => {
    // Os 20 g de alho não são decoração: eles ocupam o pote e diluem o sal.
    const semAlho = resolveAmounts({
      kind: 'ingredients',
      lines: lines.filter((line) => line.name !== 'Alho'),
    });

    expect(semAlho.totalGrams).toBeCloseTo(1500, 6);
  });

  it('chega ao mesmo sal que a entrada por pesos', () => {
    const porLista = calculateBrine({
      input: { kind: 'ingredients', lines },
      saltPercent: 2,
      basis: 'total',
    });
    const porPesos = calculateBrine({
      input: { kind: 'weights', vegetableGrams: 720, waterGrams: 800 },
      saltPercent: 2,
      basis: 'total',
    });

    expect(porLista.saltGrams).toBeCloseTo(porPesos.saltGrams, 9);
    expect(porLista.saltGrams).toBeCloseTo(30.4, 6);
  });

  it('ignora linha vazia ou com peso inválido', () => {
    const amounts = resolveAmounts({
      kind: 'ingredients',
      lines: [
        { id: '1', name: 'Repolho', grams: 500, role: 'solid' },
        { id: '2', name: '', grams: Number.NaN, role: 'solid' },
        { id: '3', name: 'Nada', grams: -50, role: 'liquid' },
      ],
    });

    expect(amounts.vegetableGrams).toBeCloseTo(500, 6);
    expect(amounts.waterGrams).toBe(0);
  });

  it('funciona na salga direta, sem líquido nenhum', () => {
    const amounts = resolveAmounts({
      kind: 'ingredients',
      lines: [
        { id: '1', name: 'Repolho', grams: 1000, role: 'solid' },
        { id: '2', name: 'Cenoura', grams: 200, role: 'solid' },
      ],
    });

    expect(amounts.waterGrams).toBe(0);
    expect(amounts.totalGrams).toBeCloseTo(1200, 6);
  });
});

describe('troca de método sem mexer na receita', () => {
  it('expressa o mesmo sal na outra base', () => {
    const result = calculateBrine({
      input: { kind: 'weights', vegetableGrams: 500, waterGrams: 500 },
      saltPercent: 2,
      basis: 'total',
    });

    expect(percentForBasis(result, 'total')).toBeCloseTo(2, 6);
    expect(percentForBasis(result, 'water')).toBeCloseTo(4, 6);
  });
});

describe('robustez do motor', () => {
  it('trata entrada inválida como zero em vez de devolver NaN', () => {
    const result = calculateBrine({
      input: { kind: 'weights', vegetableGrams: -5, waterGrams: Number.NaN },
      saltPercent: 2,
      basis: 'total',
    });

    expect(result.saltGrams).toBe(0);
    expect(result.percentOfTotal).toBe(0);
    expect(result.percentOfWater).toBe(0);
  });

  it('não divide por zero quando não há água', () => {
    const result = calculateBrine({
      input: { kind: 'weights', vegetableGrams: 1000, waterGrams: 0 },
      saltPercent: 2,
      basis: 'total',
    });

    expect(result.percentOfWater).toBe(0);
    expect(result.saltGrams).toBeCloseTo(20, 6);
  });
});

describe('integridade dos presets', () => {
  it('mantém todo preparo fermentado no mínimo seguro ou acima', () => {
    // Abaixo de 1,5% nenhuma fonte dá respaldo, e isso é segurança alimentar,
    // não preferência de sabor.
    for (const preset of PICKLE_PRESETS) {
      if (isBrinePreset(preset) || isDrySaltPreset(preset)) {
        expect(preset.saltPercent, preset.id).toBeGreaterThanOrEqual(
          MIN_SAFE_SALINITY,
        );
      }
    }
  });

  it('aponta cada preset para uma faixa que existe', () => {
    for (const preset of PICKLE_PRESETS) {
      if (isBrinePreset(preset) || isDrySaltPreset(preset)) {
        expect(RANGES[preset.rangeKey], preset.id).toBeDefined();
      }
    }
  });

  it('dá fonte a todo preset', () => {
    for (const preset of PICKLE_PRESETS) {
      expect(preset.citations.length, preset.id).toBeGreaterThan(0);
    }
  });

  it('não repete identificador', () => {
    const ids = PICKLE_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolve preset pelo id', () => {
    expect(getPreset('chucrute')?.mode).toBe('dry-salt');
    expect(getPreset('inexistente')).toBeUndefined();
  });
});
