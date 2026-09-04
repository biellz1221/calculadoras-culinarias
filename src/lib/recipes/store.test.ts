import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MAX_NAME_LENGTH,
  MAX_SAVED_RECIPES,
  resetRecipeStoreForTests,
  useSavedRecipes,
} from './store';

beforeEach(() => {
  window.localStorage.clear();
  resetRecipeStoreForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('receitas guardadas', () => {
  it('guarda e recarrega o estado inteiro', () => {
    const { result } = renderHook(() => useSavedRecipes('bread'));

    act(() => {
      result.current.save('Boule de sábado', { presetId: 'boule', flourGrams: 500 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.state).toEqual({
      presetId: 'boule',
      flourGrams: 500,
    });
  });

  it('substitui a receita de mesmo nome em vez de duplicar', () => {
    const { result } = renderHook(() => useSavedRecipes('bread'));

    act(() => {
      result.current.save('Boule', { flourGrams: 500 });
    });
    let outcome = '';
    act(() => {
      outcome = result.current.save('Boule', { flourGrams: 900 });
    });

    expect(outcome).toBe('replaced');
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.state).toEqual({ flourGrams: 900 });
  });

  it('ignora espaço em volta do nome, para não criar gêmeas', () => {
    const { result } = renderHook(() => useSavedRecipes('bread'));

    act(() => {
      result.current.save('Boule', { flourGrams: 500 });
    });
    act(() => {
      result.current.save('  Boule  ', { flourGrams: 700 });
    });

    expect(result.current.items).toHaveLength(1);
  });

  it('para no limite e diz que parou', () => {
    const { result } = renderHook(() => useSavedRecipes('bread'));

    act(() => {
      for (let index = 0; index < MAX_SAVED_RECIPES; index += 1) {
        result.current.save(`Receita ${index}`, { index });
      }
    });

    expect(result.current.full).toBe(true);

    let outcome = '';
    act(() => {
      outcome = result.current.save('Mais uma', {});
    });

    // Cheio não bloqueia sobrescrever: só impede nome novo.
    expect(outcome).toBe('full');
    expect(result.current.items).toHaveLength(MAX_SAVED_RECIPES);
  });

  it('não mistura as calculadoras', () => {
    const bread = renderHook(() => useSavedRecipes('bread'));
    const pickles = renderHook(() => useSavedRecipes('pickles'));

    act(() => {
      bread.result.current.save('Boule', {});
    });

    expect(bread.result.current.items).toHaveLength(1);
    expect(pickles.result.current.items).toHaveLength(0);
  });

  it('apaga pelo nome', () => {
    const { result } = renderHook(() => useSavedRecipes('bread'));

    act(() => {
      result.current.save('Boule', {});
      result.current.save('Baguete', {});
    });
    act(() => {
      result.current.remove('Boule');
    });

    expect(result.current.items.map((item) => item.name)).toEqual(['Baguete']);
  });

  it('descarta a linha corrompida sem perder as outras', () => {
    window.localStorage.setItem(
      'cc:recipes:bread',
      JSON.stringify({
        v: 1,
        items: [
          { name: 'Boa', savedAt: '2026-01-01T00:00:00.000Z', state: { a: 1 } },
          { savedAt: '2026-01-01T00:00:00.000Z', state: {} },
          'nem objeto é',
        ],
      }),
    );

    const { result } = renderHook(() => useSavedRecipes('bread'));

    expect(result.current.items.map((item) => item.name)).toEqual(['Boa']);
  });

  it('esconde o recurso quando o navegador não deixa escrever', () => {
    // Aba anônima do Safari e storage desligado se comportam assim: o objeto
    // existe, e lança na hora de gravar.
    const blocked = vi
      .spyOn(window.localStorage, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('bloqueado', 'QuotaExceededError');
      });
    resetRecipeStoreForTests();

    try {
      const { result } = renderHook(() => useSavedRecipes('bread'));

      expect(result.current.available).toBe(false);

      let outcome = '';
      act(() => {
        outcome = result.current.save('Boule', {});
      });

      expect(outcome).toBe('unavailable');
    } finally {
      // O localStorage do happy-dom é um Proxy, e `restoreAllMocks` não o
      // desfaz: sem isto, o próximo caso herda o storage quebrado.
      blocked.mockRestore();
    }
  });

  it('descarta nome maior que o teto do campo', () => {
    // O campo na tela limita em 80; a leitura precisa repetir o limite, porque
    // o que está no storage não passou necessariamente pelo campo.
    window.localStorage.setItem(
      'cc:recipes:bread',
      JSON.stringify({
        v: 1,
        items: [
          {
            name: 'a'.repeat(MAX_NAME_LENGTH + 1),
            savedAt: '2026-01-01T00:00:00.000Z',
            state: {},
          },
        ],
      }),
    );

    const { result } = renderHook(() => useSavedRecipes('bread'));

    expect(result.current.items).toEqual([]);
  });

  it('sobrevive a lixo no localStorage', () => {
    window.localStorage.setItem('cc:recipes:bread', 'isto não é json');

    const { result } = renderHook(() => useSavedRecipes('bread'));

    expect(result.current.items).toEqual([]);
  });
});
