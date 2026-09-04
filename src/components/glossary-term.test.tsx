import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BalancePanel } from './bread/balance-panel';
import { GlossaryTerm } from './glossary-term';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { calculateRecipe } from '@/lib/bread/calculate';
import { breadTarget, initialBreadState } from '@/lib/bread/state';

const dict = getBreadDictionary('pt-BR');
const glossary = dict.glossary;

function renderTerm(entryId: 'hydration' | 'poolish' = 'hydration') {
  return render(
    <GlossaryTerm
      calculator="bread"
      entryId={entryId}
      label={glossary.terms[entryId].term}
      definition={glossary.terms[entryId].definition}
      labels={{ ...dict.sources, ...glossary }}
    />,
  );
}

describe('termo com tooltip', () => {
  it('só abre quando pedem', () => {
    renderTerm();

    const button = screen.getByRole('button', { name: glossary.terms.hydration.term });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('note')).toBeNull();

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('note')).toBeInTheDocument();
  });

  it('mostra a definição e a fonte, não só a definição', () => {
    renderTerm('poolish');
    fireEvent.click(screen.getByRole('button'));

    const note = within(screen.getByRole('note'));
    expect(note.getByText(glossary.terms.poolish.definition)).toBeInTheDocument();
    // A promessa do site é a procedência: definição sem fonte aqui seria
    // exatamente o glossário genérico que este não quer ser.
    expect(note.getByText(/Kayser/)).toBeInTheDocument();
  });

  it('leva ao verbete inteiro', () => {
    renderTerm();
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('link', { name: glossary.full })).toHaveAttribute(
      'href',
      '#glossario-hydration',
    );
  });

  it('fecha com Esc', () => {
    // Teclado abre e fecha: é metade do critério, e o `title` nativo do HTML
    // não faz nem uma coisa nem outra.
    renderTerm();
    fireEvent.click(screen.getByRole('button'));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('note')).toBeNull();
  });

  it('fecha ao tocar fora', () => {
    renderTerm();
    fireEvent.click(screen.getByRole('button'));

    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole('note')).toBeNull();
  });
});

describe('o painel de balanço da massa', () => {
  it('explica hidratação e pré-fermento onde eles aparecem', () => {
    const state = initialBreadState();
    const recipe = calculateRecipe(state.formula, breadTarget(state));

    render(<BalancePanel recipe={recipe} dict={dict} locale="pt-BR" />);

    // Hidratação sempre; os pré-fermentos, quando a receita leva um.
    fireEvent.click(screen.getByRole('button', { name: dict.balance.hydration }));

    expect(
      within(screen.getByRole('note')).getByText(glossary.terms.hydration.definition),
    ).toBeInTheDocument();
  });

  it('deixa em paz o rótulo que não tem verbete', () => {
    const state = initialBreadState();
    const recipe = calculateRecipe(state.formula, breadTarget(state));

    render(<BalancePanel recipe={recipe} dict={dict} locale="pt-BR" />);

    // "Sal" se explica sozinho: virar botão seria ruído.
    expect(screen.queryByRole('button', { name: dict.balance.salt })).toBeNull();
  });
});
