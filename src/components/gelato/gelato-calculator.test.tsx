import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GelatoCalculator } from './gelato-calculator';
import { INGREDIENTS } from '@/data/gelato/ingredients';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import { LOCALES } from '@/i18n/locales';

const dict = getGelatoDictionary('pt-BR');

function renderCalculator() {
  return render(<GelatoCalculator dict={dict} locale="pt-BR" />);
}

function amountFor(label: string): HTMLElement {
  return screen.getByLabelText(`${label} — ${dict.table.amount} (g)`);
}

describe('rótulos de ingrediente', () => {
  it('cobre os 164 ingredientes nos dois idiomas', () => {
    for (const locale of LOCALES) {
      const labels: Record<string, string | undefined> =
        getGelatoDictionary(locale).ingredients;

      for (const ingredient of INGREDIENTS) {
        expect(labels[ingredient.id], `${locale}: ${ingredient.id}`).toBeTruthy();
      }
      expect(Object.keys(labels), locale).toHaveLength(INGREDIENTS.length);
    }
  });
});

describe('calculadora de gelato', () => {
  it('abre com a receita de partida já reescalada para o lote', () => {
    renderCalculator();

    // Fior di latte em 1 L a 1,10 g/mL: 900 g de receita viram 1100 g de calda.
    expect(amountFor('Leite integral')).toHaveValue(733.3);
    expect(screen.getByText(dict.balance.balanced)).toBeInTheDocument();
  });

  it('reescala a receita inteira quando o lote muda', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.batch.liters), {
      target: { value: '2' },
    });

    expect(amountFor('Leite integral')).toHaveValue(1466.6);
  });

  it('sinaliza as métricas fora da faixa do tipo de base escolhido', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.bases.sorbet.name }));

    // Uma base de leite medida pela régua do sorbet não fecha em várias métricas.
    expect(screen.getAllByText(dict.balance.status.above).length).toBeGreaterThan(0);
  });

  it('equilibra o resto mantendo fixa a linha editada à mão', () => {
    renderCalculator();

    fireEvent.change(amountFor('Açúcar sacarose'), { target: { value: '60' } });
    fireEvent.click(screen.getByRole('button', { name: dict.balance.autoBalance }));

    expect(screen.getByText(new RegExp(dict.balance.solved))).toBeInTheDocument();
    expect(amountFor('Açúcar sacarose')).toHaveValue(60);
  });

  it('é honesta quando o otimizador não resolve', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.bases.sorbet.name }));
    fireEvent.click(screen.getByRole('button', { name: dict.balance.autoBalance }));

    expect(screen.getByText(new RegExp(dict.balance.partial))).toBeInTheDocument();
  });

  it('avisa sobre ingrediente com composição inconsistente na planilha', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.picker.label), {
      target: { value: 'pacoca' },
    });
    fireEvent.keyDown(screen.getByLabelText(dict.picker.label), { key: 'Enter' });

    expect(screen.getByText(dict.flaws.title)).toBeInTheDocument();
    expect(screen.getByText(dict.flaws.severity.severe)).toBeInTheDocument();
    expect(screen.getByText(dict.flaws.issues['no-composition'])).toBeInTheDocument();
  });

  it('remove a linha sem mexer nas outras', () => {
    renderCalculator();

    fireEvent.click(
      screen.getByRole('button', { name: `${dict.table.remove} — Neutro (estabilizante)` }),
    );

    expect(screen.queryByLabelText(`Neutro (estabilizante) — ${dict.table.amount} (g)`))
      .toBeNull();
    expect(amountFor('Leite integral')).toHaveValue(733.3);
  });
});
