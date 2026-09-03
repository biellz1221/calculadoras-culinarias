import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PastaCalculator } from './pasta-calculator';
import { getPastaDictionary } from '@/i18n/dictionaries/pasta';

const dict = getPastaDictionary('pt-BR');

function renderCalculator() {
  return render(<PastaCalculator dict={dict} locale="pt-BR" />);
}

/** Texto inteiro da linha da receita, achada pelo nome do ingrediente. */
function rowText(ingredient: string): string {
  const row = screen.getByText(ingredient).closest('tr');
  if (!row) throw new Error(`linha não encontrada: ${ingredient}`);
  return row.textContent ?? '';
}

/** Valor de uma linha do resumo (dt → dd). */
function summaryValue(label: string): string {
  return screen.getByText(label).nextElementSibling?.textContent ?? '';
}

/** Número exibido numa métrica do balanço, pelo título dela. */
function metricValue(label: string): string {
  const heading = screen.getByRole('heading', { name: label });
  const row = heading.closest('div')?.parentElement;
  return row?.querySelector('[data-numeric]')?.textContent ?? '';
}

describe('calculadora de massa fresca', () => {
  it('abre na massa clássica com a receita do livro para 4 pessoas', () => {
    renderCalculator();

    expect(rowText('Farinha 00')).toContain('300,0 g');
    // Ovo aparece em unidades e em gramas.
    expect(rowText('Ovo')).toContain('3 un');
    expect(rowText('Ovo')).toContain('150,0 g');
    expect(summaryValue(dict.result.yieldLabel)).toBe('400 g');
  });

  it('escala pelo número de pessoas', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.target.servings), {
      target: { value: '8' },
    });

    expect(rowText('Farinha 00')).toContain('600,0 g');
    expect(rowText('Ovo')).toContain('6 un');
  });

  it('arredonda o ovo e conta o ajuste de farinha', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.target.servings), {
      target: { value: '6' },
    });

    // A escala pediria 4,5 ovos; com 5 a farinha sobe 50 g.
    expect(rowText('Ovo')).toContain('5 un');
    expect(screen.getByText(/4,5 ovos/)).toBeInTheDocument();
    expect(screen.getByText(/farinha sobe 50 g/)).toBeInTheDocument();
  });

  it('troca os gramas por pessoa ao mudar o contexto da refeição', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.target.styles.starter }));

    expect(metricValue(dict.balance.servingSize)).toBe('85 g');
  });

  it('avisa quando a porção por pessoa sai da faixa das fontes', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.target.gramsPerServing), {
      target: { value: '200' },
    });

    expect(screen.getByText(dict.balance.status.above)).toBeInTheDocument();
  });

  it('ajusta a farinha ao peso real do ovo', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.target.eggWeight), {
      target: { value: '60' },
    });

    // 3 ovos de 60 g pedem 360 g de farinha para manter a razão da fonte.
    expect(rowText('Farinha 00')).toContain('360,0 g');
    expect(metricValue(dict.balance.flourPerEggMass)).toBe('2');
  });

  it('mostra a farinha que a Hazan manda incorporar na sova', () => {
    renderCalculator();

    fireEvent.click(
      screen.getByRole('button', { name: dict.presets['hazan-amarela'] }),
    );

    expect(rowText('Farinha de trigo comum')).toContain('140,0 g');
    expect(rowText('Farinha de trigo comum')).toContain('240,0 g');
    // 1,4 fica abaixo da faixa; a nota explica que é de propósito.
    expect(metricValue(dict.balance.flourPerEggMass)).toBe('1,4');
    expect(screen.getByText(dict.balance.status.below)).toBeInTheDocument();
  });

  it('troca para a massa de sêmola e passa a medir hidratação', () => {
    renderCalculator();

    fireEvent.click(
      screen.getByRole('button', { name: dict.presets['semola-vegana'] }),
    );

    expect(metricValue(dict.balance.hydration)).toBe('46,4%');
    expect(screen.queryByLabelText(dict.target.eggWeight)).toBeNull();
    expect(screen.queryByRole('heading', { name: dict.balance.flourPerEggMass })).toBeNull();
  });

  it('não mede farinha por ovo na massa colorida e explica por quê', () => {
    renderCalculator();

    fireEvent.click(
      screen.getByRole('button', { name: dict.presets['espinafre-ovo'] }),
    );

    expect(screen.getByText(dict.balance.colourNote)).toBeInTheDocument();
    // O purê é o líquido: 50 g de espinafre espremido de 150 g crus.
    expect(rowText('Espinafre branqueado e espremido')).toContain('50,0 g');
    expect(rowText('Espinafre branqueado e espremido')).toContain('150 g');
  });

  it('avisa que a massa sem glúten não fecha raviólo', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.presets['sem-gluten'] }));

    expect(screen.getByText(dict.process.unsuitableFilled)).toBeInTheDocument();
  });

  it('conta as peças da massa de tortellini', () => {
    renderCalculator();

    fireEvent.click(
      screen.getByRole('button', { name: dict.presets['hazan-tortellini'] }),
    );

    expect(screen.getByText(dict.result.pieces)).toBeInTheDocument();
  });

  it('traz o preparo publicado na fonte, com citação', () => {
    renderCalculator();

    expect(screen.getByText(dict.process.notes.classica)).toBeInTheDocument();
    expect(screen.getAllByText(/Zielonka/).length).toBeGreaterThan(0);
  });
});
