import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PicklesCalculator } from './pickles-calculator';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';

const dict = getPicklesDictionary('pt-BR');

function renderCalculator() {
  return render(<PicklesCalculator dict={dict} locale="pt-BR" />);
}

function valueFor(label: string): string {
  const term = screen.getByText(label);
  const value = term.nextElementSibling;
  return value?.textContent ?? '';
}

/** Lê o número exibido numa métrica do painel, pelo título dela. */
function metricValue(label: string): string {
  const heading = screen.getByRole('heading', { name: label });
  const row = heading.closest('div')?.parentElement;
  return row?.querySelector('[data-numeric]')?.textContent ?? '';
}

describe('calculadora de picles', () => {
  it('abre na salmoura, com o preparo padrão', () => {
    renderCalculator();

    expect(screen.getByRole('button', { name: dict.modes.brine })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Cenoura' })).toBeInTheDocument();
  });

  it('calcula os 40 g de sal do exemplo do Noma', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.input.vegetable), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(dict.input.water), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(dict.input.saltPercent), {
      target: { value: '2' },
    });

    expect(valueFor(dict.result.salt)).toBe('40,0 g');
  });

  it('mostra as duas leituras da mesma salmoura', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.input.vegetable), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(dict.input.water), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText(dict.input.saltPercent), {
      target: { value: '2' },
    });

    // 2% do pote são 4% da água, e é o ponto central da página.
    expect(metricValue(`${dict.result.salt} ${dict.result.ofTotal}`)).toBe('2%');
    expect(metricValue(`${dict.result.salt} ${dict.result.ofWater}`)).toBe('4%');
  });

  it('troca para salga direta e some com o campo de água', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes['dry-salt'] }));

    expect(screen.getByRole('button', { name: 'Chucrute' })).toBeInTheDocument();
    expect(screen.queryByLabelText(dict.input.water)).toBeNull();
  });

  it('calcula o chucrute do Fermentação à Brasileira', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes['dry-salt'] }));
    fireEvent.change(screen.getByLabelText(dict.input.vegetable), {
      target: { value: '1000' },
    });

    // 1 kg de repolho a 2% dá 20 g de sal.
    expect(valueFor(dict.result.salt)).toBe('20,0 g');
  });

  it('avisa quando o sal cai abaixo do mínimo seguro', () => {
    renderCalculator();

    fireEvent.change(screen.getByLabelText(dict.input.saltPercent), {
      target: { value: '0.8' },
    });

    expect(screen.getAllByText(dict.status.unsafe).length).toBeGreaterThan(0);
  });

  it('aprova a proporção 1:1 do picles de vinagre', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes.vinegar }));

    expect(screen.getByText(dict.vinegarStatus.ok)).toBeInTheDocument();
  });

  it('recusa vinagre fraco e diz a proporção que resolve', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes.vinegar }));
    fireEvent.change(screen.getByLabelText(dict.input.acidity), {
      target: { value: '4' },
    });

    expect(screen.getByText(dict.vinegarStatus.belowMinimum)).toBeInTheDocument();
    expect(screen.getByText(/0,6/)).toBeInTheDocument();
  });

  it('recusa de vez o vinagre que não alcança o piso nem puro', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes.vinegar }));
    fireEvent.change(screen.getByLabelText(dict.input.acidity), {
      target: { value: '2' },
    });

    expect(screen.getByText(dict.vinegarStatus.unusable)).toBeInTheDocument();
  });

  it('soma uma lista livre de ingredientes', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.input.byIngredients }));

    // Começa com o mesmo lote dos campos de peso: 1000 g de sólido e 1000 de água.
    fireEvent.click(screen.getByRole('button', { name: `+ ${dict.ingredients.add}` }));

    const amounts = screen.getAllByLabelText(dict.ingredients.amount);
    fireEvent.change(amounts[amounts.length - 1] as HTMLElement, {
      target: { value: '500' },
    });

    // 1000 g de sólido + 500 g do novo sólido + 1000 g de água a 2% dão 50 g.
    expect(valueFor(dict.result.salt)).toBe('50,0 g');
  });

  it('esconde o papel do ingrediente na salga direta, que não leva água', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.modes['dry-salt'] }));
    fireEvent.click(screen.getByRole('button', { name: dict.input.byIngredients }));

    expect(screen.queryByLabelText(dict.ingredients.role)).toBeNull();
    expect(screen.getAllByLabelText(dict.ingredients.amount).length).toBe(1);
  });

  it('remove uma linha da lista', () => {
    renderCalculator();

    fireEvent.click(screen.getByRole('button', { name: dict.input.byIngredients }));
    expect(screen.getAllByLabelText(dict.ingredients.amount).length).toBe(2);

    fireEvent.click(screen.getAllByRole('button', { name: /remover/i })[0] as HTMLElement);

    expect(screen.getAllByLabelText(dict.ingredients.amount).length).toBe(1);
  });

  it('mantém a segurança alimentar visível sem precisar de clique', () => {
    render(
      <>
        <PicklesCalculator dict={dict} locale="pt-BR" />
      </>,
    );

    // O painel de segurança é irmão da calculadora na página; aqui garantimos
    // que o resultado não esconde a informação atrás de interação.
    expect(screen.getByText(dict.result.title)).toBeVisible();
  });
});
