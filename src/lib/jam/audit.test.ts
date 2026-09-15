import { auditJam } from './audit';
import { referenceFor } from './calculate';
import { describe, expect, it } from 'vitest';

import { JAM_FRUITS } from '@/data/jam/fruits';
import type { JamFruit } from '@/data/jam/types';

function fruitById(id: string): JamFruit {
  const found = JAM_FRUITS.find((fruit) => fruit.id === id);
  if (!found) throw new Error(`fruta ${id} não existe`);
  return found;
}

const STRAWBERRY = fruitById('strawberry');

function audit(fruit: JamFruit, sugarGrams: number, pectinGrams = 0) {
  const result = auditJam(fruit, { fruitGrams: 1000, sugarGrams, pectinGrams });
  return {
    basis: result.basis,
    metric: (labelKey: string) =>
      result.metrics.find((item) => item.labelKey === labelKey),
  };
}

describe('auditJam', () => {
  it('reconhece a receita do livro como a receita do livro', () => {
    // O morango do Blue Chair, na proporção publicada, sobre 1 kg de fruta.
    const reference = referenceFor(STRAWBERRY).ratio;
    const { metric } = audit(STRAWBERRY, reference * 1000);

    expect(metric('sugarRatio')?.status).toBe('in');
    expect(metric('sugarRatio')?.referenceKind).toBe('point');
    expect(metric('sugarRatio')?.correction).toBeUndefined();
  });

  it('chama de diferente, e não de errada, a geleia com menos açúcar', () => {
    const { metric } = audit(STRAWBERRY, 400);

    expect(metric('sugarRatio')?.status).toBe('below');
    // Seguir outra receita não é sair do que as fontes respaldam.
    expect(metric('sugarRatio')?.beyondHardLimit).toBe(false);
  });

  it('aponta o açúcar da fonte como alvo único', () => {
    const reference = referenceFor(STRAWBERRY).ratio;
    const target = audit(STRAWBERRY, 400).metric('sugarRatio')?.correction
      ?.targetGrams;

    expect(target?.min).toBe(target?.max);
    expect(target?.min).toBeCloseTo(reference * 1000, 6);
  });

  it('usa a mesma tolerância do motor para dizer que é a proporção da fonte', () => {
    // Meio ponto percentual: dentro disso, é a receita do livro.
    const reference = referenceFor(STRAWBERRY).ratio;

    expect(audit(STRAWBERRY, (reference + 0.004) * 1000).metric('sugarRatio')?.status).toBe(
      'in',
    );
    expect(audit(STRAWBERRY, (reference + 0.006) * 1000).metric('sugarRatio')?.status).toBe(
      'above',
    );
  });

  it('nomeia de qual régua veio a referência', () => {
    expect(audit(STRAWBERRY, 600).basis).toBe('recipe');
  });

  it('mede a pectina sobre o açúcar, nunca sobre a fruta', () => {
    // 0,5% a 1,5% do açúcar. Com 600 g de açúcar, 6 g são 1% — dentro.
    // Sobre a fruta seriam 0,6%, e a dose erraria por quase o dobro.
    const { metric } = audit(STRAWBERRY, 600, 6);

    expect(metric('pectinPercent')?.value).toBeCloseTo(1, 10);
    expect(metric('pectinPercent')?.status).toBe('in');
  });

  it('diz quanta pectina a faixa pede', () => {
    const target = audit(STRAWBERRY, 600, 15).metric('pectinPercent')?.correction
      ?.targetGrams;

    expect(target).toEqual({ min: 3, max: 9 });
  });

  it('fica calado sobre pectina quando ninguém usou pectina', () => {
    expect(audit(STRAWBERRY, 600).metric('pectinPercent')).toBeUndefined();
  });

  it('não mede nada sem fruta', () => {
    const result = auditJam(STRAWBERRY, {
      fruitGrams: 0,
      sugarGrams: 600,
      pectinGrams: 0,
    });

    expect(result.metrics).toEqual([]);
  });

  it('cita a receita fresca quando é ela que responde, e não a régua legal', () => {
    // Trocar uma pela outra faria a página anunciar a fonte errada: receita
    // publicada e mínimo de rótulo não têm a mesma autoridade.
    const fresh = JAM_FRUITS.find((fruit) => !fruit.recipe && fruit.fresh);
    if (!fresh) return;

    const result = auditJam(fresh, {
      fruitGrams: 1000,
      sugarGrams: 100,
      pectinGrams: 0,
    });

    expect(result.basis).toBe('fresh');
    expect(result.metrics[0]?.citations).toEqual(fresh.fresh?.citations);
  });

  it('recusa a fruta que caiu na base errada em vez de citar outra obra', () => {
    // Invariante entre dois arquivos: `referenceFor` só devolve 'fresh' para
    // fruta com receita fresca. Se algum dia devolver sem, é melhor quebrar o
    // painel do que exibir a citação de outra fonte.
    const semFresca = { ...STRAWBERRY, recipe: undefined, fresh: undefined };
    const result = auditJam(semFresca, {
      fruitGrams: 1000,
      sugarGrams: 600,
      pectinGrams: 0,
    });

    // Sem receita nenhuma, a base é a norma — e aí a régua legal é a certa.
    expect(result.basis).toBe('norm');
    expect(result.metrics[0]?.citations.length).toBeGreaterThan(0);
  });

  it('cita a fonte de toda métrica que emite', () => {
    const result = auditJam(STRAWBERRY, {
      fruitGrams: 1000,
      sugarGrams: 400,
      pectinGrams: 6,
    });

    expect(result.metrics.length).toBe(2);
    for (const metric of result.metrics) {
      expect(metric.citations.length).toBeGreaterThan(0);
    }
  });
});
