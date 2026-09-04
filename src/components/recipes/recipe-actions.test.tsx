import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BreadCalculator } from '@/components/bread/bread-calculator';
import { PicklesCalculator } from '@/components/pickles/pickles-calculator';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import { getDictionary } from '@/i18n';
import { BREAD_SNAPSHOT, initialBreadState } from '@/lib/bread/state';
import { decodeSnapshot, SHARE_PARAM } from '@/lib/recipes/snapshot';
import { resetRecipeStoreForTests } from '@/lib/recipes/store';

const dict = getDictionary('pt-BR');
const copy = dict.recipe;
const bread = getBreadDictionary('pt-BR');
const pickles = getPicklesDictionary('pt-BR');

beforeEach(() => {
  window.localStorage.clear();
  resetRecipeStoreForTests();
  window.history.replaceState(null, '', '/paes');
});

/** A folha de impressão é ignorada nas buscas por texto; aqui é o alvo. */
function printSheet(): HTMLElement {
  const sheet = document.querySelector('.print-sheet');
  expect(sheet, 'folha de impressão não montou').not.toBeNull();
  return sheet as HTMLElement;
}

describe('ações da receita', () => {
  it('guarda a receita e a traz de volta pelo nome', () => {
    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    fireEvent.change(screen.getByLabelText(bread.target.flourHint), {
      target: { value: '900' },
    });

    fireEvent.click(screen.getByRole('button', { name: copy.save }));
    fireEvent.change(screen.getByLabelText(copy.nameLabel), {
      target: { value: 'Minha boule' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.confirm }));

    expect(screen.getByText(copy.saved)).toBeInTheDocument();

    // Muda tudo e volta: o estado guardado tem que reconstruir a receita.
    fireEvent.change(screen.getByLabelText(bread.target.flourHint), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByRole('button', { name: `${copy.mine} (1)` }));
    fireEvent.click(screen.getByRole('button', { name: copy.load }));

    expect(screen.getByLabelText(bread.target.flourHint)).toHaveValue(900);
    expect(screen.getByText(copy.loaded)).toBeInTheDocument();
  });

  it('recusa a receita guardada que não passa mais na validação', () => {
    window.localStorage.setItem(
      'cc:recipes:bread',
      JSON.stringify({
        v: 1,
        items: [
          {
            name: 'De outra era',
            savedAt: '2026-01-01T00:00:00.000Z',
            state: { presetId: 'pão-que-não-existe' },
          },
        ],
      }),
    );

    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    fireEvent.click(screen.getByRole('button', { name: `${copy.mine} (1)` }));
    fireEvent.click(screen.getByRole('button', { name: copy.load }));

    expect(screen.getByText(copy.brokenEntry)).toBeInTheDocument();
  });

  it('copia um link que decodifica de volta no estado exibido', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // `navigator.clipboard` só tem getter; substituir a propriedade inteira é
    // o caminho para o teste enxergar o que foi copiado.
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    fireEvent.change(screen.getByLabelText(bread.target.flourHint), {
      target: { value: '750' },
    });
    fireEvent.click(screen.getByRole('button', { name: copy.copyLink }));

    expect(writeText).toHaveBeenCalledOnce();

    const link = new URL(writeText.mock.calls[0]?.[0] as string);
    const encoded = link.searchParams.get(SHARE_PARAM);
    expect(encoded).not.toBeNull();

    const decoded = decodeSnapshot(encoded as string, 'bread', BREAD_SNAPSHOT);
    expect(decoded).toMatchObject({ status: 'ok', state: { flourGrams: 750 } });
  });

  it('abre a calculadora no estado que veio pelo link', () => {
    const state = {
      v: 1,
      c: 'bread',
      s: { ...structuredClone(baselineState()), flourGrams: 1234 },
    };
    const encoded = toBase64Url(JSON.stringify(state));
    window.history.replaceState(null, '', `/paes?${SHARE_PARAM}=${encoded}`);

    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    expect(screen.getByLabelText(bread.target.flourHint)).toHaveValue(1234);
  });

  it('explica o link ilegível em vez de abrir calado no padrão', () => {
    window.history.replaceState(null, '', `/paes?${SHARE_PARAM}=lixo!!!`);

    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    expect(screen.getByText(new RegExp(copy.linkInvalid))).toBeInTheDocument();
  });

  it('limpa o link da barra assim que a receita muda', () => {
    const encoded = toBase64Url(
      JSON.stringify({ v: 1, c: 'bread', s: baselineState() }),
    );
    window.history.replaceState(null, '', `/paes?${SHARE_PARAM}=${encoded}`);

    render(<BreadCalculator dict={bread} locale="pt-BR" />);
    expect(window.location.search).toContain(SHARE_PARAM);

    fireEvent.change(screen.getByLabelText(bread.target.flourHint), {
      target: { value: '600' },
    });

    // Endereço que não corresponde mais ao que está na tela é armadilha para
    // quem copia a barra em vez de usar o botão.
    expect(window.location.search).toBe('');
  });
});

describe('a folha de impressão', () => {
  it('traz a receita, e só ela', () => {
    render(<BreadCalculator dict={bread} locale="pt-BR" />);

    const sheet = printSheet();

    const openingPreset = initialBreadState().presetId as keyof typeof bread.presets;
    expect(sheet.querySelector('h1')?.textContent).toBe(bread.presets[openingPreset]);
    expect(sheet.textContent).toContain(bread.ingredients.water);
    expect(sheet.textContent).toContain(bread.table.doughTotal);

    // Nenhum controle vai para o papel: a folha é o resultado, não a tela.
    expect(sheet.querySelector('button, input, select')).toBeNull();
  });

  it('leva o aviso de segurança para o papel', () => {
    render(<PicklesCalculator dict={pickles} locale="pt-BR" />);

    fireEvent.change(screen.getByLabelText(pickles.input.saltPercent), {
      target: { value: '0.8' },
    });

    // A regra do projeto: o aviso acompanha o resultado, inclusive impresso.
    // Quem leva o papel para a bancada é quem não vai reabrir a tela.
    expect(printSheet().querySelector('.print-notice')?.textContent).toContain(
      pickles.status.unsafe,
    );
  });
});

/** Estado de partida da calculadora de pães, em formato de snapshot. */
function baselineState() {
  return {
    presetId: 'boule',
    formula: {
      flours: [{ key: 'flour-white', percent: 100 }],
      lines: [
        { key: 'water', percent: 70 },
        { key: 'salt', percent: 2 },
      ],
    },
    mode: 'flour',
    flourGrams: 500,
    doughGrams: 1000,
    unitCount: 8,
    unitGrams: 90,
  };
}

function toBase64Url(value: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
