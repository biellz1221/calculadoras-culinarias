import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BreadCalculator } from './bread-calculator';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import {
  addIngredient,
  flourPercentTotal,
  initialBreadState,
  isCustom,
  normalizeFlours,
  parseBreadState,
  removeIngredient,
} from '@/lib/bread/state';

const dict = getBreadDictionary('pt-BR');
const copy = dict.custom;

/**
 * A receita que não é de nenhum livro.
 *
 * Nasceu de um caso concreto: um pão de hambúrguer com tangzhong que não é
 * nenhum dos dezesseis presets, e que antes disto a calculadora não tinha como
 * receber. O que ela oferece a uma receita de fora são as faixas e os avisos —
 * o mesmo que oferece às de dentro.
 */

describe('estado de receita própria', () => {
  it('acrescentar ingrediente vira receita própria', () => {
    const state = addIngredient(initialBreadState(), 'butter');

    expect(isCustom(state)).toBe(true);
    expect(state.formula.lines.some((line) => line.key === 'butter')).toBe(true);
  });

  it('manda farinha para a régua e o resto para a lista', () => {
    const state = addIngredient(initialBreadState(), 'flour-rye');

    expect(state.formula.flours.some((line) => line.key === 'flour-rye')).toBe(true);
    expect(state.formula.lines.some((line) => line.key === 'flour-rye')).toBe(false);
  });

  it('não duplica ingrediente que já está na receita', () => {
    const once = addIngredient(initialBreadState(), 'butter');
    const twice = addIngredient(once, 'butter');

    expect(twice.formula.lines.filter((line) => line.key === 'butter')).toHaveLength(1);
  });

  it('tira o ingrediente das duas listas', () => {
    const state = removeIngredient(initialBreadState(), 'salt');
    expect(state.formula.lines.some((line) => line.key === 'salt')).toBe(false);
  });

  it('acerta as farinhas para 100 preservando a proporção', () => {
    // Contrato do motor: a farinha é a régua dos 100%. Somando 120, cada
    // ingrediente sairia 20% mais pesado do que o número na tela promete.
    const base = initialBreadState();
    const state = {
      ...base,
      formula: {
        ...base.formula,
        flours: [
          { key: 'flour-white' as const, percent: 80 },
          { key: 'flour-rye' as const, percent: 40 },
        ],
      },
    };

    const fixed = normalizeFlours(state);

    expect(flourPercentTotal(fixed.formula)).toBeCloseTo(100, 10);
    // 80:40 continua sendo 2:1.
    expect(fixed.formula.flours[0]?.percent).toBeCloseTo(66.667, 3);
  });

  it('aceita receita própria no link, sem preset por trás', () => {
    const state = addIngredient(initialBreadState(), 'butter');
    expect(parseBreadState(state)).toMatchObject({ presetId: 'custom' });
  });
});

describe('a calculadora em receita própria', () => {
  function openCustom() {
    render(<BreadCalculator dict={dict} locale="pt-BR" />);
    fireEvent.click(screen.getByRole('button', { name: copy.preset }));
  }

  it('parte da fórmula que estava na tela', () => {
    // Pegar a boule, trocar o que quiser e seguir dali é melhor do que começar
    // de uma folha em branco.
    render(<BreadCalculator dict={dict} locale="pt-BR" />);
    const antes = screen.getAllByRole('rowheader').map((cell) => cell.textContent);

    fireEvent.click(screen.getByRole('button', { name: copy.preset }));

    // Os mesmos ingredientes; o que muda é ganhar os controles de edição.
    expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(
      antes,
    );
  });

  it('deixa acrescentar e tirar ingrediente', () => {
    openCustom();

    fireEvent.change(screen.getByLabelText(copy.add), { target: { value: 'butter' } });
    expect(
      within(screen.getByRole('table')).getByText(dict.ingredients.butter),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: `${copy.remove}: ${dict.ingredients.butter}` }),
    );
    expect(
      within(screen.getByRole('table')).queryByText(dict.ingredients.butter),
    ).toBeNull();
  });

  it('avisa quando as farinhas não somam 100 e conserta', () => {
    openCustom();

    fireEvent.change(screen.getByLabelText(copy.add), {
      target: { value: 'flour-rye' },
    });
    const rye = screen.getByLabelText(`${dict.table.percent} — ${dict.ingredients['flour-rye']}`);
    fireEvent.change(rye, { target: { value: '25' } });

    expect(screen.getByText(new RegExp(copy.flourSum))).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: copy.normalize }));

    expect(screen.queryByText(new RegExp(copy.flourSum))).toBeNull();
  });

  it('não oferece os controles quando é um preset', () => {
    render(<BreadCalculator dict={dict} locale="pt-BR" />);
    expect(screen.queryByLabelText(copy.add)).toBeNull();
  });
});
