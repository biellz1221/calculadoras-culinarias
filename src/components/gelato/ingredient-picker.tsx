'use client';

import { useRef } from 'react';

import type { IngredientOption } from './catalog';
import { PickerList } from './picker-list';
import { useIngredientPicker } from './use-ingredient-picker';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';

interface IngredientPickerProps {
  options: readonly IngredientOption[];
  dict: GelatoDictionary;
  onSelect: (ingredientId: string) => void;
}

/**
 * Seletor buscável dos 164 ingredientes. É um combobox de verdade: o foco fica
 * no campo de texto e a opção ativa é anunciada por `aria-activedescendant`,
 * então a navegação por teclado funciona sem tirar o cursor de onde se digita.
 */
export function IngredientPicker({ options, dict, onSelect }: IngredientPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const {
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
  } = useIngredientPicker(options, onSelect, rootRef);

  return (
    <div className="mt-8">
      <label htmlFor={inputId} className="label-caps text-ink-muted">
        {dict.picker.label}
      </label>

      <div ref={rootRef} className="relative mt-2.5">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open ? `${listId}-${highlight}` : undefined}
          autoComplete="off"
          placeholder={dict.picker.placeholder}
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
        />

        {open && (
          <PickerList
            listId={listId}
            options={matches.list}
            highlight={highlight}
            dict={dict}
            onChoose={choose}
            onHighlight={setHighlight}
          />
        )}
      </div>

      <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
        {matches.truncated ? dict.picker.truncated : dict.picker.hint}
      </p>
    </div>
  );
}
