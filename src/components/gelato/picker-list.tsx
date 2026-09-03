'use client';

import { useEffect, useRef } from 'react';

import { groupLabel, type IngredientOption } from './catalog';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { IngredientGroup } from '@/data/gelato/metrics';
import { cn } from '@/lib/cn';

interface Slot {
  readonly option: IngredientOption;
  readonly index: number;
}

interface Group {
  readonly group: IngredientGroup;
  readonly slots: readonly Slot[];
}

/** Agrupa mantendo o índice na lista plana: é ele que a navegação por teclado usa. */
function groupSlots(options: readonly IngredientOption[]): readonly Group[] {
  const groups: Group[] = [];

  options.forEach((option, index) => {
    const last = groups[groups.length - 1];
    if (last && last.group === option.group) {
      groups[groups.length - 1] = { group: last.group, slots: [...last.slots, { option, index }] };
      return;
    }
    groups.push({ group: option.group, slots: [{ option, index }] });
  });

  return groups;
}

interface PickerListProps {
  listId: string;
  options: readonly IngredientOption[];
  highlight: number;
  dict: GelatoDictionary;
  onChoose: (option: IngredientOption) => void;
  onHighlight: (index: number) => void;
}

export function PickerList({
  listId,
  options,
  highlight,
  dict,
  onChoose,
  onHighlight,
}: PickerListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Mantém a opção destacada visível quando a navegação é por teclado.
  useEffect(() => {
    const current = listRef.current?.querySelector(`#${CSS.escape(`${listId}-${highlight}`)}`);
    current?.scrollIntoView({ block: 'nearest' });
  }, [highlight, listId]);

  return (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      aria-label={dict.picker.listLabel}
      className="absolute inset-x-0 z-30 mt-1.5 max-h-80 overflow-y-auto rounded-card border border-rule bg-surface py-1 shadow-lift"
    >
      {options.length === 0 && (
        <li role="presentation" className="px-3.5 py-3 text-sm text-ink-muted">
          {dict.picker.empty}
        </li>
      )}

      {groupSlots(options).map(({ group, slots }) => (
        <li key={group} role="group" aria-label={groupLabel(dict, group)}>
          <p aria-hidden="true" className="label-caps px-3.5 pt-3 pb-1 text-ink-muted">
            {groupLabel(dict, group)}
          </p>
          <ul role="presentation">
            {slots.map(({ option, index }) => (
              <li
                key={option.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => onHighlight(index)}
                // Sem isto o input perde o foco antes do clique registrar.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onChoose(option)}
                className={cn(
                  'cursor-pointer px-3.5 py-2 text-sm',
                  index === highlight ? 'bg-accent-tint text-accent-deep' : 'text-ink',
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
