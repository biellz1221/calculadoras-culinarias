import { describe, expect, it } from 'vitest';

import { auditBrine, type BrineAuditInput } from './audit';

function audit(input: Partial<BrineAuditInput> = {}) {
  const result = auditBrine({
    methodId: 'equilibrium-poultry',
    proteinGrams: 2000,
    saltGrams: 12,
    liquidGrams: 200,
    sugarGrams: 0,
    ...input,
  });

  return (labelKey: string) =>
    result.metrics.find((metric) => metric.labelKey === labelKey);
}

describe('auditBrine', () => {
  it('reconhece a Basic Brine nas quantidades publicadas', () => {
    // 200 g de água e 12 g de sal para 2 kg de frango.
    expect(audit()('saltRatio')?.value).toBeCloseTo(0.6, 10);
    expect(audit()('saltRatio')?.status).toBe('in');
    expect(audit()('liquidRatio')?.status).toBe('in');
  });

  it('compara com receita, e não com faixa', () => {
    expect(audit()('saltRatio')?.referenceKind).toBe('point');
    expect(audit({ saltGrams: 30 })('saltRatio')?.beyondHardLimit).toBe(false);
  });

  it('diz quanto sal a receita da fonte pedia', () => {
    const target = audit({ saltGrams: 30 })('saltRatio')?.correction?.targetGrams;

    expect(target?.min).toBe(target?.max);
    expect(target?.min).toBeCloseTo(12, 10);
  });

  it('não acusa diferença menor que meio grama por quilo', () => {
    // A fonte publica pesos inteiros em grama; abaixo disso, é a mesma receita.
    expect(audit({ saltGrams: 12.8 })('saltRatio')?.status).toBe('in');
    expect(audit({ saltGrams: 14 })('saltRatio')?.status).toBe('above');
  });

  it('não compara líquido nem açúcar num método que não os usa', () => {
    // Salga seca não é salmoura com água de menos: é outro método.
    const metric = audit({
      methodId: 'dry-salting',
      liquidGrams: 0,
      saltGrams: 12.5,
    });

    expect(metric('saltRatio')).toBeDefined();
    expect(metric('liquidRatio')).toBeUndefined();
    expect(metric('sugarRatio')).toBeUndefined();
  });

  it('não mede nada sem proteína, nem com método que não existe', () => {
    expect(
      auditBrine({
        methodId: 'equilibrium-poultry',
        proteinGrams: 0,
        saltGrams: 12,
        liquidGrams: 200,
        sugarGrams: 0,
      }).metrics,
    ).toEqual([]);

    expect(
      auditBrine({
        methodId: 'não-existe',
        proteinGrams: 2000,
        saltGrams: 12,
        liquidGrams: 200,
        sugarGrams: 0,
      }).metrics,
    ).toEqual([]);
  });

  it('cita a receita em toda métrica', () => {
    for (const metric of auditBrine({
      methodId: 'equilibrium-poultry',
      proteinGrams: 2000,
      saltGrams: 30,
      liquidGrams: 500,
      sugarGrams: 0,
    }).metrics) {
      expect(metric.citations.length).toBeGreaterThan(0);
    }
  });
});
