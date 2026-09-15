import { describe, expect, it } from 'vitest';

import { auditGanache, type GanacheAuditInput } from './audit';

function audit(input: Partial<GanacheAuditInput> = {}) {
  const result = auditGanache({
    textureId: 'moulded',
    softGrams: 100,
    chocolateGrams: 120,
    butterGrams: 14,
    ...input,
  });

  return (labelKey: string) =>
    result.metrics.find((metric) => metric.labelKey === labelKey);
}

describe('auditGanache', () => {
  it('reconhece a linha 100/120/14 do Wybauw', () => {
    // "Soft (in moulded pralines): 100 / 120 / 14".
    expect(audit()('chocolateRatio')?.status).toBe('in');
    expect(audit()('butterRatio')?.status).toBe('in');
    expect(audit()('chocolateRatio')?.referenceKind).toBe('point');
  });

  it('lê a faixa das pralinés de corte como faixa', () => {
    // "Cut pralines: 100 / 130 to 180 / 24 to 30" — a única com faixa.
    const metric = audit({
      textureId: 'cut',
      chocolateGrams: 150,
      butterGrams: 27,
    });

    expect(metric('chocolateRatio')?.referenceKind).toBe('range');
    expect(metric('chocolateRatio')?.status).toBe('in');
  });

  it('diz quanto chocolate a faixa de corte pede', () => {
    const metric = audit({
      textureId: 'cut',
      chocolateGrams: 200,
      butterGrams: 27,
    });

    expect(metric('chocolateRatio')?.status).toBe('above');
    expect(metric('chocolateRatio')?.correction?.targetGrams).toEqual({
      min: 130,
      max: 180,
    });
  });

  it('aponta o valor único quando a fonte publicou um valor único', () => {
    const target = audit({ chocolateGrams: 200 })('chocolateRatio')?.correction
      ?.targetGrams;

    expect(target?.min).toBe(target?.max);
    expect(target?.min).toBeCloseTo(120, 10);
  });

  it('não acusa diferença mais fina do que a tabela sabe expressar', () => {
    // A tabela anda de 10 em 10 no chocolate; 122 g em 100 g de creme é a
    // mesma linha do livro.
    expect(audit({ chocolateGrams: 122 })('chocolateRatio')?.status).toBe('in');
    expect(audit({ chocolateGrams: 130 })('chocolateRatio')?.status).toBe('above');
  });

  it('mede sobre a substância mole inteira, não só sobre o creme', () => {
    // 80 g de creme mais 20 g de licor são a mesma base 100 da tabela.
    expect(audit({ softGrams: 100, chocolateGrams: 120 })('chocolateRatio')?.value).toBeCloseTo(
      1.2,
      10,
    );
  });

  it('lê a trufa como a única sem manteiga', () => {
    const metric = audit({
      textureId: 'truffle',
      chocolateGrams: 110,
      butterGrams: 0,
    });

    expect(metric('chocolateRatio')?.status).toBe('in');
    expect(metric('butterRatio')?.status).toBe('in');
  });

  it('acusa manteiga numa trufa, que a fonte faz sem', () => {
    const metric = audit({
      textureId: 'truffle',
      chocolateGrams: 110,
      butterGrams: 20,
    });

    expect(metric('butterRatio')?.status).toBe('above');
    expect(metric('butterRatio')?.correction?.targetGrams).toEqual({
      min: 0,
      max: 0,
    });
  });

  it('não mede nada sem base e nem com textura que não existe', () => {
    expect(auditGanache({
      textureId: 'moulded',
      softGrams: 0,
      chocolateGrams: 120,
      butterGrams: 14,
    }).metrics).toEqual([]);

    expect(auditGanache({
      textureId: 'não-existe',
      softGrams: 100,
      chocolateGrams: 120,
      butterGrams: 14,
    }).metrics).toEqual([]);
  });

  it('cita a tabela em toda métrica', () => {
    for (const metric of auditGanache({
      textureId: 'cut',
      softGrams: 100,
      chocolateGrams: 200,
      butterGrams: 40,
    }).metrics) {
      expect(metric.citations.length).toBeGreaterThan(0);
    }
  });
});
