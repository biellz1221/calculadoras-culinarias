'use client';

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import type { IngredientOption } from './catalog';
import { matchesQuery } from '@/lib/gelato/search';

/** Teto de resultados: a lista rolável tem que caber na tela e no orçamento de DOM. */
const MAX_RESULTS = 40;

/** Navegação circular. Devolve `null` quando a tecla não é de navegação. */
function nextHighlight(key: string, current: number, count: number): number | null {
  if (count === 0) return null;
  if (key === 'ArrowDown') return (current + 1) % count;
  if (key === 'ArrowUp') return (current - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

/**
 * Estado do combobox de ingredientes: busca, abertura e navegação por teclado.
 *
 * O `rootRef` vem de fora de propósito: quem monta o DOM é o componente, e um
 * ref devolvido por hook contamina todo o objeto de retorno para as regras do
 * compilador do React.
 */
export function useIngredientPicker(
  options: readonly IngredientOption[],
  onSelect: (ingredientId: string) => void,
  rootRef: RefObject<HTMLDivElement | null>,
) {
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const matches = useMemo(() => {
    const found = options.filter((option) => matchesQuery(option.label, query));
    return { list: found.slice(0, MAX_RESULTS), truncated: found.length > MAX_RESULTS };
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open, rootRef]);

  /** Buscar de novo recomeça a navegação do topo, sem efeito no meio. */
  function changeQuery(value: string) {
    setQuery(value);
    setHighlight(0);
    setOpen(true);
  }

  function choose(option: IngredientOption | undefined) {
    if (!option) return;
    onSelect(option.id);
    changeQuery('');
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose(matches.list[highlight]);
      return;
    }
    const next = nextHighlight(event.key, highlight, matches.list.length);
    if (next === null) return;
    event.preventDefault();
    setOpen(true);
    setHighlight(next);
  }

  return {
    inputId,
    listId,
    query,
    open,
    highlight,
    matches,
    changeQuery,
    setOpen,
    setHighlight,
    choose,
    onKeyDown,
  };
}
