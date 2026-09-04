'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { CalculatorId } from '@/data/calculators';

/**
 * Receitas salvas neste navegador.
 *
 * Sem conta, sem servidor, sem sincronização: o site não tem back-end (TD-001)
 * e não vai passar a ter por causa de um botão de salvar. O preço disso é
 * honesto e a interface diz qual é — as receitas ficam neste navegador.
 *
 * Mesma mecânica de `preferences.tsx`: `useSyncExternalStore` sobre o
 * localStorage, o que resolve a hidratação e ainda sincroniza abas de graça.
 */

export interface SavedRecipe {
  readonly name: string;
  /** ISO 8601. Serve para ordenar e para mostrar quando foi salva. */
  readonly savedAt: string;
  /** Estado da calculadora. Opaco aqui; quem valida é ela, ao carregar. */
  readonly state: unknown;
}

/**
 * Teto de receitas por calculadora.
 *
 * O localStorage é um orçamento compartilhado por todo o site (~5 MB) e não
 * avisa que encheu: ele lança na hora de escrever. Vinte receitas por
 * calculadora cabem com folga e ainda formam uma lista que se lê de uma vez.
 */
export const MAX_SAVED_RECIPES = 20;

export type SaveOutcome =
  | 'saved'
  | 'replaced'
  /** Lista cheia e nome novo: a pessoa precisa apagar alguma antes. */
  | 'full'
  | 'unavailable';

interface Shelf {
  readonly available: boolean;
  readonly items: readonly SavedRecipe[];
}

interface Stored {
  readonly v: number;
  readonly items: readonly SavedRecipe[];
}

const STORED_VERSION = 1;

const EMPTY: readonly SavedRecipe[] = [];

/**
 * Prateleira do primeiro render.
 *
 * `available: true` é otimismo deliberado, não mentira: o HTML é estático e
 * igual para todo mundo, então ele precisa escolher um dos dois casos. Storage
 * bloqueado é raro; começar escondendo o botão faria a esmagadora maioria das
 * visitas ver o controle aparecer do nada depois da hidratação.
 */
const INITIAL: Shelf = { available: true, items: EMPTY };

function storageKey(calculator: CalculatorId): string {
  return `cc:recipes:${calculator}`;
}

function isSavedRecipe(value: unknown): value is SavedRecipe {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    typeof record.name === 'string' &&
    record.name.length > 0 &&
    typeof record.savedAt === 'string' &&
    'state' in record
  );
}

function parse(raw: string | null): readonly SavedRecipe[] {
  if (!raw) return EMPTY;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY;

    const { items } = parsed as Partial<Stored>;
    if (!Array.isArray(items)) return EMPTY;

    // Item corrompido some sozinho em vez de derrubar a lista inteira: ninguém
    // deveria perder dezenove receitas porque uma ficou pela metade.
    return items.filter(isSavedRecipe).slice(0, MAX_SAVED_RECIPES);
  } catch {
    return EMPTY;
  }
}

/** Uma sondagem por sessão: escrever e apagar é o único teste que não mente. */
let availability: boolean | null = null;

function isAvailable(): boolean {
  if (availability !== null) return availability;

  try {
    const probe = 'cc:probe';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    availability = true;
  } catch {
    // Aba anônima do Safari, storage desligado nas configurações, iframe sem
    // permissão: em todos, escrever lança.
    availability = false;
  }

  return availability;
}

const caches = new Map<CalculatorId, { raw: string | null; shelf: Shelf }>();
const listeners = new Set<() => void>();

function readRaw(calculator: CalculatorId): string | null {
  try {
    return window.localStorage.getItem(storageKey(calculator));
  } catch {
    return null;
  }
}

/** O snapshot precisa ser estável entre chamadas, ou o React entra em laço. */
function getShelf(calculator: CalculatorId): Shelf {
  const available = isAvailable();
  const raw = available ? readRaw(calculator) : null;
  const cached = caches.get(calculator);

  if (cached && cached.raw === raw && cached.shelf.available === available) {
    return cached.shelf;
  }

  const shelf: Shelf = { available, items: parse(raw) };
  caches.set(calculator, { raw, shelf });

  return shelf;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function write(calculator: CalculatorId, items: readonly SavedRecipe[]): boolean {
  const payload: Stored = { v: STORED_VERSION, items };
  const raw = JSON.stringify(payload);

  try {
    window.localStorage.setItem(storageKey(calculator), raw);
  } catch {
    // Cota estourada por outro dado do mesmo domínio, por exemplo.
    return false;
  }

  caches.set(calculator, { raw, shelf: { available: true, items } });
  for (const listener of listeners) listener();

  return true;
}

export interface RecipeShelf {
  /** `false` esconde o recurso: sem storage não há o que salvar. */
  readonly available: boolean;
  readonly items: readonly SavedRecipe[];
  readonly full: boolean;
  save: (name: string, state: unknown) => SaveOutcome;
  remove: (name: string) => void;
}

export function useSavedRecipes(calculator: CalculatorId): RecipeShelf {
  const shelf = useSyncExternalStore(
    subscribe,
    useCallback(() => getShelf(calculator), [calculator]),
    useCallback(() => INITIAL, []),
  );

  const save = useCallback(
    (name: string, state: unknown): SaveOutcome => {
      const trimmed = name.trim();
      if (!trimmed) return 'unavailable';
      if (!isAvailable()) return 'unavailable';

      const current = getShelf(calculator).items;
      const existing = current.findIndex((item) => item.name === trimmed);
      const entry: SavedRecipe = {
        name: trimmed,
        savedAt: new Date().toISOString(),
        state,
      };

      // Mesmo nome substitui: é o que a pessoa espera de "salvar de novo", e
      // evita três "Pão branco" indistinguíveis na lista.
      if (existing >= 0) {
        const items = current.map((item, index) => (index === existing ? entry : item));
        return write(calculator, items) ? 'replaced' : 'unavailable';
      }

      if (current.length >= MAX_SAVED_RECIPES) return 'full';

      return write(calculator, [entry, ...current]) ? 'saved' : 'unavailable';
    },
    [calculator],
  );

  const remove = useCallback(
    (name: string) => {
      const items = getShelf(calculator).items.filter((item) => item.name !== name);
      write(calculator, items);
    },
    [calculator],
  );

  return useMemo(
    () => ({
      available: shelf.available,
      items: shelf.items,
      full: shelf.items.length >= MAX_SAVED_RECIPES,
      save,
      remove,
    }),
    [shelf, save, remove],
  );
}

/** Só para os testes: zera o cache de módulo entre casos. */
export function resetRecipeStoreForTests(): void {
  availability = null;
  caches.clear();
}
