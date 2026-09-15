import { describe, expect, it } from 'vitest';

import { auditPasta, type PastaAuditInput } from './audit';

function audit(input: Partial<PastaAuditInput> = {}) {
  const result = auditPasta({
    base: 'egg',
    flourGrams: 300,
    eggGrams: 150,
    waterGrams: 0,
    ...input,
  });

  return (labelKey: string) =>
    result.metrics.find((metric) => metric.labelKey === labelKey);
}

describe('auditPasta', () => {
  it('lê a massa do Zielonka como a razão que ela é', () => {
    // Classic Egg Dough: 300 g de farinha para 150 g de ovo.
    expect(audit()('flourPerEgg')?.value).toBeCloseTo(2, 10);
    expect(audit()('flourPerEgg')?.status).toBe('in');
  });

  it('põe a massa da Hazan abaixo da faixa sem acusá-la de erro', () => {
    // A Hazan começa em 1,4 e incorpora farinha na sova até ~2,4. O começo
    // dela é abaixo da faixa recomendada e dentro do que a fonte respalda.
    const metric = audit({ flourGrams: 210 })('flourPerEgg');

    expect(metric?.status).toBe('below');
    expect(metric?.beyondHardLimit).toBe(false);
  });

  it('diz quanta farinha a faixa pede para o ovo que já está na tigela', () => {
    const metric = audit({ flourGrams: 210 })('flourPerEgg');

    // 1,5 a 2,0 vezes os 150 g de ovo.
    expect(metric?.correction?.targetGrams).toEqual({ min: 225, max: 300 });
  });

  it('marca como sem respaldo a massa fora das duas pontas', () => {
    expect(audit({ flourGrams: 400 })('flourPerEgg')?.beyondHardLimit).toBe(true);
    expect(audit({ flourGrams: 180 })('flourPerEgg')?.beyondHardLimit).toBe(true);
  });

  it('lê massa de água como hidratação, e não como razão de ovo', () => {
    // Vegan Semolina Dough: 130 g de água para 280 g de sêmola.
    const metric = audit({
      base: 'water',
      flourGrams: 280,
      eggGrams: 0,
      waterGrams: 130,
    })('waterHydration');

    expect(metric?.value).toBeCloseTo(46.43, 2);
    expect(metric?.status).toBe('in');
  });

  it('não mede razão de ovo numa massa sem ovo', () => {
    // A régua errada não devolve zero: devolve silêncio.
    expect(audit({ eggGrams: 0 })('flourPerEgg')).toBeUndefined();
  });

  it('não mede hidratação sem farinha', () => {
    const metric = audit({ base: 'water', flourGrams: 0, waterGrams: 130 });

    expect(metric('waterHydration')).toBeUndefined();
  });

  it('nunca mistura as duas leituras na mesma resposta', () => {
    const egg = auditPasta({
      base: 'egg',
      flourGrams: 300,
      eggGrams: 150,
      waterGrams: 100,
    });

    expect(egg.metrics.map((metric) => metric.labelKey)).toEqual(['flourPerEgg']);
  });

  it('cita a fonte da faixa', () => {
    expect(audit()('flourPerEgg')?.citations.length).toBeGreaterThan(0);
  });
});
