import { describe, expect, it } from 'vitest';

import { auditPickles, type PicklesAuditInput } from './audit';
import { MIN_SAFE_SALINITY } from '@/data/pickles/ranges';

function audit(input: Partial<PicklesAuditInput> = {}) {
  const result = auditPickles({
    mode: 'brine',
    vegetableGrams: 1000,
    waterGrams: 1000,
    saltGrams: 40,
    ...input,
  });

  return (labelKey: string) =>
    result.metrics.find((metric) => metric.labelKey === labelKey);
}

describe('auditPickles', () => {
  it('lê o mesmo sal das duas maneiras, porque as duas são verdade', () => {
    // O caso do BWF, p. 199: 1 kg de rabanete + 20 g de sal + 1 L de água.
    // Sobre a água são 2%; sobre o pote inteiro, 1% — e é o pote que fermenta.
    const metric = audit({ saltGrams: 20 });

    expect(metric('saltOfTotal')?.value).toBeCloseTo(1, 10);
    expect(metric('saltOfWater')?.value).toBeCloseTo(2, 10);
  });

  it('acusa como inseguro o sal que parecia suficiente', () => {
    const metric = audit({ saltGrams: 20 });

    // 1% está abaixo do piso de segurança das fontes, e a página precisa dizer
    // isso mesmo que a leitura sobre a água pareça confortável.
    expect(metric('saltOfTotal')?.status).toBe('below');
    expect(metric('saltOfTotal')?.beyondHardLimit).toBe(true);
    expect(metric('saltOfTotal')?.reference.hardMin).toBe(MIN_SAFE_SALINITY);
  });

  it('diz quanto sal o pote pedia', () => {
    const metric = audit({ saltGrams: 20 });

    // 2 a 3% de 2 kg de pote.
    expect(metric('saltOfTotal')?.correction?.targetGrams).toEqual({
      min: 40,
      max: 60,
    });
    expect(metric('saltOfTotal')?.correction?.currentGrams).toBe(20);
  });

  it('aprova a salmoura que está na faixa sobre o total', () => {
    const metric = audit({ saltGrams: 40 });

    expect(metric('saltOfTotal')?.status).toBe('in');
    expect(metric('saltOfTotal')?.correction).toBeUndefined();
  });

  it('nunca põe o sal no próprio denominador', () => {
    // 40 g sobre 2000 g de base são 2%. Sobre 2040 seriam 1,96% — e é assim
    // que uma conserva sai do piso de segurança sem ninguém perceber.
    const metric = audit({ saltGrams: 40 });

    expect(metric('saltOfTotal')?.value).toBeCloseTo(2, 10);
  });

  it('mede a salga seca sobre o vegetal, e só ela', () => {
    const metric = audit({ mode: 'dry-salt', saltGrams: 18, waterGrams: 0 });

    expect(metric('drySalt')?.value).toBeCloseTo(1.8, 10);
    expect(metric('drySalt')?.status).toBe('in');
    expect(metric('saltOfWater')).toBeUndefined();
  });

  it('não inventa leitura sobre água que não existe', () => {
    const metric = audit({ waterGrams: 0 });

    expect(metric('saltOfWater')).toBeUndefined();
    expect(metric('saltOfTotal')?.value).toBeCloseTo(4, 10);
  });

  it('cita a fonte de cada faixa', () => {
    for (const metric of auditPickles({
      mode: 'brine',
      vegetableGrams: 1000,
      waterGrams: 1000,
      saltGrams: 40,
    }).metrics) {
      expect(metric.citations.length).toBeGreaterThan(0);
    }
  });

  it('trata entrada estragada como ausência, não como zero na tela', () => {
    const result = auditPickles({
      mode: 'brine',
      vegetableGrams: Number.NaN,
      waterGrams: Number.POSITIVE_INFINITY,
      saltGrams: 40,
    });

    expect(result.metrics).toEqual([]);
  });
});
