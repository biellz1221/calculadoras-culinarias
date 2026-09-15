import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuditReport } from './audit-report';
import { RANGES } from '@/data/bread/ranges';
import { cite } from '@/data/citations';
import { getDictionary } from '@/i18n';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import type { Locale } from '@/i18n/locales';
import { metricFromPoint, metricFromRule } from '@/lib/audit/metric';
import type { AuditMetric } from '@/lib/audit/types';

const LABELS = {
  hydration: 'Hidratação',
  water: 'a água',
  sugarRatio: 'Açúcar sobre fruta',
  sugar: 'o açúcar',
};

function show(metrics: readonly AuditMetric[], locale: Locale = 'pt-BR') {
  const dict = getDictionary(locale);

  render(
    <AuditReport
      metrics={metrics}
      labels={LABELS}
      copy={dict.audit}
      citationLabels={getBreadDictionary(locale).sources}
      locale={locale}
    />,
  );

  return dict;
}

function hydration(value: number, waterGrams: number): AuditMetric {
  const metric = metricFromRule({
    labelKey: 'hydration',
    value,
    unit: 'percent',
    rule: RANGES.hydration,
    correction: {
      kind: 'dominant',
      subjectKey: 'water',
      baseGrams: 500,
      currentGrams: waterGrams,
    },
  });

  if (!metric) throw new Error('métrica de apoio do teste não deveria ser nula');
  return metric;
}

describe('AuditReport', () => {
  it('diz onde o valor caiu e qual é a faixa das fontes', () => {
    const dict = show([hydration(65, 325)]);

    expect(screen.getByRole('heading', { name: 'Hidratação' })).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText(dict.audit.status.in)).toBeInTheDocument();
    expect(screen.getByText('Faixa das fontes: 60% a 70%')).toBeInTheDocument();
  });

  it('não sugere nada para a receita que já está na faixa', () => {
    show([hydration(65, 325)]);

    expect(screen.queryByText(/Para entrar na faixa/)).not.toBeInTheDocument();
  });

  it('resolve a faixa em gramas do ingrediente quando a receita está fora', () => {
    show([hydration(50, 250)]);

    expect(
      screen.getByText('Para entrar na faixa: a água entre 300,0 g e 350,0 g.'),
    ).toBeInTheDocument();
  });

  it('avisa quando o valor saiu do respaldo das fontes', () => {
    const dict = show([hydration(95, 475)]);

    expect(screen.getByText(dict.audit.hardLimit)).toBeInTheDocument();
    expect(screen.queryByText(dict.audit.status.above)).not.toBeInTheDocument();
  });

  it('formata número e unidade pelo idioma da página', () => {
    show([hydration(50, 250)], 'en');

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(
      screen.getByText('To land in the range: a água between 300.0 g and 350.0 g.'),
    ).toBeInTheDocument();
  });

  it('cita a fonte de cada métrica', () => {
    show([hydration(65, 325)]);

    // A hidratação do pão se apoia em Kayser, entre outros.
    expect(screen.getByText(/Kayser/)).toBeInTheDocument();
  });

  it('trata fonte que publica receita como diferença, não como erro', () => {
    const metric = metricFromPoint({
      labelKey: 'sugarRatio',
      value: 0.4,
      unit: 'ratio',
      point: 40 / 62,
      tolerance: 0.005,
      citations: [cite('saunders', 42)],
      correction: {
        kind: 'dominant',
        subjectKey: 'sugar',
        baseGrams: 1000,
        currentGrams: 400,
      },
    });

    const dict = show(metric ? [metric] : []);

    expect(screen.getByText(dict.audit.pointStatus.below)).toBeInTheDocument();
    expect(screen.queryByText(dict.audit.status.below)).not.toBeInTheDocument();
    // Ponto, e não faixa: a frase aponta um valor só.
    expect(
      screen.getByText('Para chegar à proporção da fonte: o açúcar em 645,2 g.'),
    ).toBeInTheDocument();
  });

  it('não deixa uma chave de fora do dicionário virar objeto na tela', () => {
    // `labels['__proto__']` devolve o Object.prototype em qualquer objeto
    // comum, e o React derruba a página ao receber isso como filho.
    const metric = metricFromRule({
      labelKey: '__proto__',
      value: 50,
      unit: 'percent',
      rule: RANGES.hydration,
      correction: {
        kind: 'dominant',
        subjectKey: 'constructor',
        baseGrams: 500,
        currentGrams: 250,
      },
    });

    expect(() => show(metric ? [metric] : [])).not.toThrow();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('pede os pesos quando ainda não há o que medir', () => {
    const dict = show([]);

    expect(screen.getByText(dict.audit.empty)).toBeInTheDocument();
  });
});
