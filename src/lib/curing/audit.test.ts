import { auditCure, type CuringAuditInput } from './audit';
import { cureGramsFor, ingoingPpm } from './calculate';
import { describe, expect, it } from 'vitest';

import { METHOD_CEILING_PPM, MIN_INGOING_PPM, getCure } from '@/data/curing/cures';

function audit(input: Partial<CuringAuditInput> = {}) {
  const result = auditCure({
    meatGrams: 1000,
    cureId: 'cure-1',
    cureGrams: 2.4,
    method: 'comminuted',
    ...input,
  });

  return result.metrics[0];
}

const CURE_1 = getCure('cure-1')!;

describe('auditCure', () => {
  it('lê o ppm de entrada do que foi pesado', () => {
    // 2,4 g de cura #1 (6,25% de nitrito) em 1 kg de carne: 150 ppm.
    expect(audit()?.value).toBeCloseTo(150, 6);
    expect(audit()?.status).toBe('in');
  });

  it('fecha o círculo com a calculadora, e não por outra conta', () => {
    // O invariante que vale numa página de segurança alimentar: ler o que a
    // calculadora mandou pesar devolve o alvo que foi pedido.
    for (const targetPpm of [120, 150, 156]) {
      const grams = cureGramsFor(targetPpm, 1000, CURE_1.nitrite);
      expect(ingoingPpm(grams, 1000, CURE_1.nitrite)).toBeCloseTo(targetPpm, 9);
      expect(audit({ cureGrams: grams })?.value).toBeCloseTo(targetPpm, 9);
    }
  });

  it('trata o abaixo do piso como o lado perigoso', () => {
    // Metade da dose: cor de curado, sem a proteção da cura.
    const metric = audit({ cureGrams: 1.2 });

    expect(metric?.status).toBe('below');
    expect(metric?.beyondHardLimit).toBe(true);
    expect(metric?.reference.min).toBe(MIN_INGOING_PPM);
  });

  it('acusa a dose acima do teto do método', () => {
    const metric = audit({ cureGrams: 3 });

    expect(metric?.value).toBeCloseTo(187.5, 6);
    expect(metric?.status).toBe('above');
    expect(metric?.beyondHardLimit).toBe(true);
  });

  it('usa o teto do método escolhido, não um teto único', () => {
    // A cura seca tem teto quatro vezes maior: o sal fica na superfície.
    const dry = audit({ cureGrams: 3, method: 'dry' });

    expect(dry?.status).toBe('in');
    expect(dry?.reference.max).toBe(METHOD_CEILING_PPM.dry);
  });

  it('diz quanto pesar, pela mesma função que a calculadora usa', () => {
    const target = audit({ cureGrams: 1.2 })?.correction?.targetGrams;

    expect(target?.min).toBeCloseTo(cureGramsFor(120, 1000, CURE_1.nitrite), 9);
    expect(target?.max).toBeCloseTo(
      cureGramsFor(METHOD_CEILING_PPM.comminuted, 1000, CURE_1.nitrite),
      9,
    );
  });

  it('respeita a fração de nitrito de cada produto', () => {
    // O Peklosol tem 0,6% de nitrito contra os 6,25% da cura #1: a mesma
    // pesagem dá dose dez vezes menor, e é exatamente por isso que a
    // calculadora existe.
    const peklosol = getCure('peklosol');
    if (!peklosol) return;

    const metric = audit({ cureId: 'peklosol', cureGrams: 2.4 });
    expect(metric?.value).toBeCloseTo(
      ingoingPpm(2.4, 1000, peklosol.nitrite),
      9,
    );
  });

  it('não mede nada sem carne nem com produto que não existe', () => {
    expect(auditCure({
      meatGrams: 0,
      cureId: 'cure-1',
      cureGrams: 2.4,
      method: 'comminuted',
    }).metrics).toEqual([]);

    expect(auditCure({
      meatGrams: 1000,
      cureId: 'não-existe',
      cureGrams: 2.4,
      method: 'comminuted',
    }).metrics).toEqual([]);
  });

  it('cita a norma do piso e a do teto', () => {
    expect(audit()?.citations.length).toBeGreaterThanOrEqual(2);
  });
});
