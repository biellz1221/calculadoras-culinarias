import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScalePanel } from './scale-panel';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';

const dict = getBreadDictionary('pt-BR');
const copy = dict.scale;

const RECIPE = ['Farinha de trigo 1000 g', 'Água 650 g', 'Sal 20 g'].join('\n');

function paste(text: string) {
  render(<ScalePanel dict={dict} locale="pt-BR" />);
  fireEvent.change(screen.getByLabelText(copy.inputLabel), { target: { value: text } });
}

/** A tabela do resultado, para não confundir com a tabela do que foi lido. */
function resultRow(name: string): HTMLElement {
  const table = screen.getByRole('table', { name: copy.resultTitle });
  return within(table).getByRole('rowheader', { name }).closest('tr') as HTMLElement;
}

describe('escalar uma receita colada', () => {
  it('escala tudo na mesma proporção (cenário 1)', () => {
    paste(RECIPE);

    fireEvent.change(screen.getByLabelText(copy.newFlour), { target: { value: '600' } });

    expect(resultRow('Farinha de trigo')).toHaveTextContent('600,0 g');
    expect(resultRow('Água')).toHaveTextContent('390,0 g');
    expect(resultRow('Sal')).toHaveTextContent('12,0 g');
  });

  it('mostra a porcentagem de padeiro com a faixa sinalizada (cenário 2)', () => {
    paste(RECIPE);

    expect(
      screen.getByRole('heading', { name: dict.balance.hydration }),
    ).toBeInTheDocument();
    // 650 de água sobre 1000 de farinha: 65%, dentro da faixa das fontes.
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getAllByText(dict.balance.status.in).length).toBeGreaterThan(0);
  });

  it('sinaliza a hidratação fora do limite das fontes', () => {
    paste('Farinha 1000 g\nÁgua 950 g\nSal 20 g');

    expect(screen.getByText(dict.balance.hardLimit)).toBeInTheDocument();
  });

  it('esconde a análise sem farinha identificável (cenário 3)', () => {
    paste('Manteiga 200 g\nAçúcar 150 g');

    fireEvent.click(screen.getByRole('button', { name: copy.byTotal }));
    fireEvent.change(screen.getByLabelText(copy.newTotal), { target: { value: '700' } });

    expect(screen.getByText(copy.noAnalysis)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: dict.balance.hydration })).toBeNull();
    // A escala proporcional simples continua funcionando.
    expect(resultRow('Manteiga')).toHaveTextContent('400,0 g');
  });

  it('deixa corrigir o papel que eu li errado', () => {
    // O leitor não conhece "polenta" como farinha. Sem poder corrigir, a
    // pessoa ficaria com uma análise errada e nenhuma saída.
    paste('Polenta 1000 g\nÁgua 700 g');

    expect(screen.getByText(copy.noAnalysis)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(`${copy.roleLabel}: Polenta`), {
      target: { value: 'flour' },
    });

    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('deixa apagar a linha que não era ingrediente', () => {
    paste('Farinha 1000 g\nAssadeira 24 g');

    fireEvent.click(screen.getByRole('button', { name: `${copy.removeLine}: Assadeira` }));

    expect(screen.queryByText('Assadeira')).toBeNull();
  });

  it('avisa quando não há como escalar pela farinha', () => {
    paste('Manteiga 200 g');

    expect(screen.getByText(copy.noFlourTarget)).toBeInTheDocument();
  });

  it('diz que não leu nada em vez de ficar mudo', () => {
    paste('Bata tudo no liquidificador e leve ao forno.');

    expect(screen.getByText(copy.nothingRead)).toBeInTheDocument();
  });

  it('avisa que contou ml como grama', () => {
    paste('Farinha 1000 g\nÁgua 650 ml');

    expect(screen.getByText(copy.millilitersNote)).toBeInTheDocument();
  });
});
