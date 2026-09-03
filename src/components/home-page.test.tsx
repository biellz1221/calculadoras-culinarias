import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomePage } from './home-page';
import { BOOKS } from '@/data/books';
import { CALCULATORS, isAvailable } from '@/data/calculators';
import { getDictionary } from '@/i18n';

describe('home', () => {
  it('anuncia a proposta do site no idioma pedido', () => {
    render(<HomePage locale="pt-BR" />);
    expect(
      screen.getByRole('heading', { level: 1, name: /proporções que fazem/i }),
    ).toBeInTheDocument();

    render(<HomePage locale="en" />);
    expect(
      screen.getByRole('heading', { level: 1, name: /ratios that make/i }),
    ).toBeInTheDocument();
  });

  it('lista todas as calculadoras do catálogo', () => {
    render(<HomePage locale="pt-BR" />);
    const dict = getDictionary('pt-BR');

    for (const calculator of CALCULATORS) {
      expect(
        screen.getByRole('heading', { name: dict.calculators[calculator.id].name }),
      ).toBeInTheDocument();
    }
  });

  it('não linka calculadora que ainda não tem página', () => {
    // A home só pode oferecer o que existe: link para rota não publicada é 404.
    render(<HomePage locale="pt-BR" />);
    const dict = getDictionary('pt-BR');

    for (const calculator of CALCULATORS) {
      const name = dict.calculators[calculator.id].name;
      const heading = screen.getByRole('heading', { name });
      const row = heading.closest('li');
      expect(row, name).not.toBeNull();

      const link = within(row as HTMLElement).queryByRole('link');

      if (isAvailable(calculator)) {
        expect(link, name).not.toBeNull();
      } else {
        expect(link, name).toBeNull();
        expect(within(row as HTMLElement).getByText(dict.home.comingSoon)).toBeInTheDocument();
      }
    }
  });

  it('mostra a estante inteira, que é a promessa do produto', () => {
    render(<HomePage locale="en" />);

    for (const book of BOOKS) {
      expect(screen.getByText(book.title), book.id).toBeInTheDocument();
    }
  });

  it('credita as obras que sustentam cada calculadora', () => {
    render(<HomePage locale="pt-BR" />);

    const heading = screen.getByRole('heading', { name: 'Pães' });
    const row = heading.closest('li') as HTMLElement;

    expect(within(row).getByText(/The Larousse Book of Bread/)).toBeInTheDocument();
    expect(within(row).getByText(/Direto ao Pão/)).toBeInTheDocument();
  });
});
