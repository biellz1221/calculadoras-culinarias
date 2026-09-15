import { describe, expect, it } from 'vitest';

import { metricFromPoint, metricFromRule } from './metric';
import { solveDominant, solvePoint } from './solve';
import { RANGES } from '@/data/bread/ranges';
import { cite } from '@/data/citations';

describe('solveDominant', () => {
  it('resolve a faixa de hidratação para as gramas de água', () => {
    // 60–70% de 500 g de farinha.
    expect(solveDominant({ min: 60, max: 70 }, 500, 'percent')).toEqual({
      min: 300,
      max: 350,
    });
  });

  it('resolve razão sem multiplicar por nada', () => {
    // Wybauw: 1,2 a 1,8 g de chocolate por grama de creme, sobre 100 g.
    expect(solveDominant({ min: 1.2, max: 1.8 }, 100, 'ratio')).toEqual({
      min: 120,
      max: 180,
    });
  });

  it('resolve ppm sobre o peso da carne', () => {
    // 120 ppm de nitrito puro em 1 kg de carne são 0,12 g de nitrito.
    const target = solveDominant({ min: 120, max: 200 }, 1000, 'ppm');
    expect(target?.min).toBeCloseTo(0.12, 10);
    expect(target?.max).toBeCloseTo(0.2, 10);
  });

  it('cala a boca quando não há base', () => {
    // Sem farinha não existe porcentagem de padeiro, e uma sugestão vinda de
    // divisão por zero é pior que nenhuma sugestão.
    expect(solveDominant({ min: 60, max: 70 }, 0, 'percent')).toBeNull();
    expect(solveDominant({ min: 60, max: 70 }, -10, 'percent')).toBeNull();
    expect(solveDominant({ min: 60, max: 70 }, Number.NaN, 'percent')).toBeNull();
    expect(
      solveDominant({ min: 60, max: 70 }, Number.POSITIVE_INFINITY, 'percent'),
    ).toBeNull();
  });

  it('cala a boca quando a referência não é número', () => {
    expect(solveDominant({ min: Number.NaN, max: 70 }, 500, 'percent')).toBeNull();
  });
});

describe('solvePoint', () => {
  it('devolve as duas pontas iguais', () => {
    // Blue Chair: 40 oz de açúcar para 62 oz de fruta — a razão não tem
    // unidade, então 0,645 sobre 1000 g de fruta são 645 g de açúcar.
    const target = solvePoint(40 / 62, 1000);
    expect(target?.min).toBe(target?.max);
    expect(target?.min).toBeCloseTo(645.16, 2);
  });
});

describe('metricFromRule', () => {
  const water = (baseGrams: number, currentGrams: number) =>
    ({
      kind: 'dominant',
      subjectKey: 'water',
      baseGrams,
      currentGrams,
    }) as const;

  it('não sugere correção para receita que já está na faixa', () => {
    const metric = metricFromRule({
      labelKey: 'hydration',
      value: 65,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: water(500, 325),
    });

    expect(metric?.status).toBe('in');
    expect(metric?.correction).toBeUndefined();
  });

  it('resolve a faixa quando a receita está fora', () => {
    const metric = metricFromRule({
      labelKey: 'hydration',
      value: 50,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: water(500, 250),
    });

    expect(metric?.status).toBe('below');
    expect(metric?.correction?.targetGrams).toEqual({ min: 300, max: 350 });
    expect(metric?.correction?.currentGrams).toBe(250);
  });

  it('marca o limite duro separado da faixa', () => {
    const metric = metricFromRule({
      labelKey: 'hydration',
      value: 95,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: water(500, 475),
    });

    expect(metric?.status).toBe('above');
    expect(metric?.beyondHardLimit).toBe(true);
    expect(metric?.reference.hardMax).toBe(90);
  });

  it('emite a métrica sem correção quando não há base utilizável', () => {
    // O diagnóstico continua valendo: o valor foi medido, só não há régua para
    // dizer quantas gramas resolvem.
    const metric = metricFromRule({
      labelKey: 'hydration',
      value: 50,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: water(0, 250),
    });

    expect(metric?.status).toBe('below');
    expect(metric?.correction).toBeUndefined();
  });

  it('recusa valor que não é número em vez de exibir NaN', () => {
    expect(
      metricFromRule({
        labelKey: 'hydration',
        value: Number.NaN,
        unit: 'percent',
        rule: RANGES.hydration,
      }),
    ).toBeNull();
  });

  it('carrega as citações da regra, sempre', () => {
    const metric = metricFromRule({
      labelKey: 'salt',
      value: 2,
      unit: 'percent',
      rule: RANGES.salt,
    });

    expect(metric?.citations.length).toBeGreaterThan(0);
  });
});

describe('metricFromPoint', () => {
  const citations = [cite('saunders', 42)];

  it('aceita a receita como igual dentro da tolerância declarada', () => {
    const metric = metricFromPoint({
      labelKey: 'sugarRatio',
      value: 0.648,
      unit: 'ratio',
      point: 40 / 62,
      tolerance: 0.005,
      citations,
    });

    expect(metric?.status).toBe('in');
    expect(metric?.referenceKind).toBe('point');
    expect(metric?.correction).toBeUndefined();
  });

  it('aponta o alvo único quando a receita difere da fonte', () => {
    const metric = metricFromPoint({
      labelKey: 'sugarRatio',
      value: 0.4,
      unit: 'ratio',
      point: 40 / 62,
      tolerance: 0.005,
      citations,
      correction: {
        kind: 'dominant',
        subjectKey: 'sugar',
        baseGrams: 1000,
        currentGrams: 400,
      },
    });

    expect(metric?.status).toBe('below');
    expect(metric?.correction?.targetGrams.min).toBe(
      metric?.correction?.targetGrams.max,
    );
    expect(metric?.correction?.targetGrams.min).toBeCloseTo(645.16, 2);
  });

  it('nunca marca limite duro: receita diferente não é receita errada', () => {
    const metric = metricFromPoint({
      labelKey: 'sugarRatio',
      value: 0.1,
      unit: 'ratio',
      point: 40 / 62,
      tolerance: 0.005,
      citations,
    });

    expect(metric?.beyondHardLimit).toBe(false);
  });

  it('aceita alvo já calculado por quem chama', () => {
    // O caminho da cura: as gramas de sal de cura saem de `cureGramsFor()`,
    // que conhece a fração de nitrito da mistura.
    const metric = metricFromPoint({
      labelKey: 'ingoingPpm',
      value: 90,
      unit: 'ppm',
      point: 150,
      tolerance: 0,
      citations,
      correction: {
        kind: 'explicit',
        subjectKey: 'cure',
        currentGrams: 1.44,
        targetGrams: { min: 2.4, max: 2.4 },
      },
    });

    expect(metric?.correction?.targetGrams).toEqual({ min: 2.4, max: 2.4 });
  });
});
