import { describe, expect, it } from 'vitest';

import { auditBread } from './audit';
import type { LineRole, ScaleLine } from './scale';

function line(name: string, grams: number, role: LineRole): ScaleLine {
  return { id: name, name, grams, role, fromMilliliters: false };
}

/** Uma receita de padeiro: farinha, água e sal em gramas. */
function recipe(flour: number, water: number, salt: number): ScaleLine[] {
  return [
    line('Farinha', flour, 'flour'),
    line('Água', water, 'water'),
    line('Sal', salt, 'salt'),
  ];
}

function metric(lines: readonly ScaleLine[], labelKey: string) {
  return auditBread(lines).metrics.find((item) => item.labelKey === labelKey);
}

describe('auditBread', () => {
  it('lê hidratação e sal em porcentagem de padeiro', () => {
    const lines = recipe(1000, 650, 20);

    expect(metric(lines, 'hydration')?.value).toBeCloseTo(65, 10);
    expect(metric(lines, 'saltPercent')?.value).toBeCloseTo(2, 10);
  });

  it('aprova a receita que cai dentro das duas faixas', () => {
    const lines = recipe(1000, 650, 20);

    expect(metric(lines, 'hydration')?.status).toBe('in');
    expect(metric(lines, 'saltPercent')?.status).toBe('in');
    expect(metric(lines, 'hydration')?.correction).toBeUndefined();
  });

  it('acusa a ciabatta como massa molhada e diz quanta água a faixa pede', () => {
    // 80% é o mais molhado que a estante publica (Scheft, p. 180) — acima da
    // faixa recomendada, e ainda assim dentro do que uma fonte respalda.
    const lines = recipe(1000, 800, 20);
    const hydration = metric(lines, 'hydration');

    expect(hydration?.status).toBe('above');
    expect(hydration?.beyondHardLimit).toBe(false);
    expect(hydration?.correction?.targetGrams).toEqual({ min: 600, max: 700 });
    expect(hydration?.correction?.currentGrams).toBe(800);
  });

  it('marca como sem respaldo a massa acima de qualquer fonte', () => {
    const hydration = metric(recipe(1000, 950, 20), 'hydration');

    expect(hydration?.beyondHardLimit).toBe(true);
  });

  it('trata o teto duro como valor aceito, não como valor excluído', () => {
    // O bagel de Jerusalém do Scheft (p. 176) tem exatamente 3% de sal, que é
    // o teto duro. Estar no limite não é estar além dele.
    const salt = metric(recipe(1000, 650, 30), 'saltPercent');

    expect(salt?.status).toBe('above');
    expect(salt?.beyondHardLimit).toBe(false);
  });

  it('soma todas as farinhas como base, e todos os líquidos como hidratação', () => {
    const lines = [
      line('Farinha branca', 800, 'flour'),
      line('Farinha de centeio', 200, 'flour'),
      line('Água', 400, 'water'),
      line('Leite', 250, 'water'),
      line('Sal', 20, 'salt'),
    ];

    expect(metric(lines, 'hydration')?.value).toBeCloseTo(65, 10);
  });

  it('não mede nada sem farinha identificada', () => {
    // Sem régua de 100%, porcentagem de qualquer coisa é número inventado.
    const lines = [line('Água', 650, 'water'), line('Sal', 20, 'salt')];

    expect(auditBread(lines).metrics).toEqual([]);
  });

  it('ignora peso que não é número em vez de apagar a leitura', () => {
    const lines = [
      line('Farinha', 1000, 'flour'),
      line('Água', 650, 'water'),
      line('Fermento', Number.NaN, 'other'),
      line('Sal', 20, 'salt'),
    ];

    expect(metric(lines, 'hydration')?.value).toBeCloseTo(65, 10);
  });

  it('cita a fonte das duas faixas', () => {
    for (const item of auditBread(recipe(1000, 650, 20)).metrics) {
      expect(item.citations.length).toBeGreaterThan(0);
    }
  });
});
