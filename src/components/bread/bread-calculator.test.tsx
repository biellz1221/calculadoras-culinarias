import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BreadCalculator } from './bread-calculator';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';

const dict = getBreadDictionary('pt-BR');

function renderCalculator() {
  return render(<BreadCalculator dict={dict} locale="pt-BR" />);
}

function rowFor(name: string): HTMLElement {
  const cell = screen.getByRole('rowheader', { name });
  const row = cell.closest('tr');
  if (!row) throw new Error(`linha não encontrada: ${name}`);
  return row;
}

describe('calculadora de pães', () => {
  it('abre no pão francês com 500 g de farinha e mostra a receita do livro', () => {
    renderCalculator();

    expect(within(rowFor('Água')).getByText('300,0 g')).toBeInTheDocument();
    expect(within(rowFor('Sal')).getByText('10,0 g')).toBeInTheDocument();
    expect(within(rowFor('Banha')).getByText('20,0 g')).toBeInTheDocument();
  });

  it('recalcula ao trocar de pão', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: 'Baguete' }));

    // Baguete do Kayser: 65% de hidratação sobre 500 g.
    expect(within(rowFor('Água')).getByText('325,0 g')).toBeInTheDocument();
    expect(within(rowFor('Levain líquido')).getByText('100,0 g')).toBeInTheDocument();
  });

  it('deixa editar a porcentagem e reflete na hora', () => {
    renderCalculator();

    const input = within(rowFor('Água')).getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '75' } });

    expect(within(rowFor('Água')).getByText('375,0 g')).toBeInTheDocument();
  });

  it('avisa quando a hidratação sai da faixa das fontes', () => {
    renderCalculator();

    fireEvent.change(within(rowFor('Água')).getByRole('spinbutton'), {
      target: { value: '95' },
    });

    // 95% passa do limite duro de 90% — o aviso muda de tom.
    expect(screen.getByText(dict.balance.hardLimit)).toBeInTheDocument();
  });

  it('mostra a hidratação real quando há pré-fermento', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: 'Pão branco rústico (boule)' }));

    // 70% declarados viram 72,7% com o levain a 20%.
    expect(screen.getByText(/72,7%/)).toBeInTheDocument();
  });

  it('converte o alvo de peso de massa em farinha', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.target.dough }));
    fireEvent.change(screen.getByRole('spinbutton', { name: dict.target.doughHint }), {
      target: { value: '842' },
    });

    // O pão francês soma 168,4% — 842 g de massa vêm de 500 g de farinha.
    expect(within(rowFor('Farinha de trigo branca')).getByText('500,0 g')).toBeInTheDocument();
  });

  it('traz o preparo publicado na fonte', () => {
    renderCalculator();

    expect(screen.getByText(dict.process.title)).toBeInTheDocument();
    // A fonte aparece junto do preparo e junto das faixas do balanço.
    expect(screen.getAllByText(/Camargo/).length).toBeGreaterThan(0);
  });
});
