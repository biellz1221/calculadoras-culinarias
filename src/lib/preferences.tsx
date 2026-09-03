'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { TemperatureScale, UnitSystem } from './units';

export interface Preferences {
  units: UnitSystem;
  temperature: TemperatureScale;
}

export const DEFAULT_PREFERENCES: Preferences = {
  units: 'metric',
  temperature: 'celsius',
};

const STORAGE_KEY = 'cc:preferences';

/**
 * Preferências de exibição do visitante, lidas do localStorage.
 *
 * Usamos `useSyncExternalStore` porque é exatamente o caso dele: um estado que
 * mora fora do React, precisa de um valor diferente no servidor (o padrão, já
 * que o HTML é estático e não sabe o que este navegador escolheu) e muda em
 * outras abas. Ele resolve a hidratação sozinho e ainda sincroniza as abas de
 * graça, sem `setState` dentro de efeito.
 */

let cachedRaw: string | null = null;
let cached: Preferences = DEFAULT_PREFERENCES;

const listeners = new Set<() => void>();

function parse(raw: string | null): Preferences {
  if (!raw) return DEFAULT_PREFERENCES;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFERENCES;

    const record = parsed as Record<string, unknown>;

    return {
      units: record.units === 'imperial' ? 'imperial' : 'metric',
      temperature: record.temperature === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Aba anônima ou storage bloqueado: seguimos no padrão.
    return null;
  }
}

/** O snapshot precisa ser estável entre chamadas, ou o React entra em laço. */
function getSnapshot(): Preferences {
  const raw = readRaw();

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }

  return cached;
}

function getServerSnapshot(): Preferences {
  return DEFAULT_PREFERENCES;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function write(next: Preferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem storage a escolha se perde ao recarregar; melhor que quebrar a página.
  }

  cachedRaw = JSON.stringify(next);
  cached = next;

  for (const listener of listeners) listener();
}

export interface PreferencesValue extends Preferences {
  setUnits: (units: UnitSystem) => void;
  setTemperature: (scale: TemperatureScale) => void;
}

export function usePreferences(): PreferencesValue {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setUnits = useCallback(
    (units: UnitSystem) => write({ ...getSnapshot(), units }),
    [],
  );

  const setTemperature = useCallback(
    (temperature: TemperatureScale) => write({ ...getSnapshot(), temperature }),
    [],
  );

  return useMemo(
    () => ({ ...preferences, setUnits, setTemperature }),
    [preferences, setUnits, setTemperature],
  );
}
