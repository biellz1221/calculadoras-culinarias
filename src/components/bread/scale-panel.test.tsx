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
      screen.getByRole('heading', { name: copy.hydration }),
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
    expect(screen.queryByRole('heading', { name: copy.hydration })).toBeNull();
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

describe('sugerir o balanceamento', () => {
  it('diz quanto líquido a faixa pede quando a massa está seca', () => {
    paste('Farinha 1000 g\nÁgua 500 g\nSal 20 g');

    expect(screen.getByText(dict.balance.status.below)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Para entrar na faixa: ${copy.subjects.water} entre 600,0 g e 700,0 g.`,
      ),
    ).toBeInTheDocument();
  });

  it('não sugere nada para a receita que já está na faixa', () => {
    paste(RECIPE);

    expect(screen.queryByText(/Para entrar na faixa/)).not.toBeInTheDocument();
  });

  it('cita a fonte da faixa ao lado da leitura', () => {
    paste(RECIPE);

    expect(screen.getAllByText(/Kayser/).length).toBeGreaterThan(0);
  });
});

describe('digitar a receita ingrediente por ingrediente', () => {
  function typeRecipe() {
    render(<ScalePanel dict={dict} locale="pt-BR" />);
    fireEvent.click(screen.getByRole('button', { name: copy.byTyping }));
  }

  function addLine(name: string, grams: string, role: string, index: number) {
    fireEvent.click(screen.getByText(`+ ${copy.manual.add}`));
    fireEvent.change(screen.getByLabelText(`${copy.manual.name} ${index}`), {
      target: { value: name },
    });
    fireEvent.change(screen.getAllByLabelText(copy.manual.amount)[index - 1]!, {
      target: { value: grams },
    });
    fireEvent.change(screen.getAllByLabelText(copy.roleLabel)[index - 1]!, {
      target: { value: role },
    });
  }

  it('lê a receita digitada sem passar pelo adivinhador', () => {
    typeRecipe();
    addLine('Farinha', '1000', 'flour', 1);
    addLine('Água', '650', 'water', 2);

    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('não mostra a tabela de conferência: não houve nada a adivinhar', () => {
    typeRecipe();
    addLine('Farinha', '1000', 'flour', 1);

    expect(screen.queryByText(copy.readTitle)).not.toBeInTheDocument();
  });

  it('classifica pelo papel escolhido, não pelo nome escrito', () => {
    // "Polenta" não está na lista de palavras de farinha, e aqui não precisa
    // estar: quem digitou já disse o que ela é.
    typeRecipe();
    addLine('Polenta', '1000', 'flour', 1);
    addLine('Água', '700', 'water', 2);

    expect(screen.getByText('70%')).toBeInTheDocument();
  });
});
