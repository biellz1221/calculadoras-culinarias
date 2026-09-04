'use client';

import type { Dictionary } from '@/i18n/dictionaries/pt-BR';
import type { Locale } from '@/i18n/locales';
import type { SavedRecipe } from '@/lib/recipes/store';

/** Lista de receitas guardadas neste navegador, com abrir e apagar. */
export function SavedList({
  items,
  labels,
  locale,
  onLoad,
  onRemove,
}: {
  items: readonly SavedRecipe[];
  labels: Dictionary['recipe'];
  locale: Locale;
  onLoad: (state: unknown) => void;
  onRemove: (name: string) => void;
}) {
  if (items.length === 0) {
    return <p className="mt-4 text-sm text-ink-muted">{labels.empty}</p>;
  }

  return (
    <ul className="mt-4 divide-y divide-rule rounded-card border border-rule bg-surface">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">
              {item.name}
            </p>
            <p className="text-xs text-ink-muted">{formatSavedAt(item.savedAt, locale)}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onLoad(item.state)}
              className="rounded-full border border-rule px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-deep"
            >
              {labels.load}
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.name)}
              aria-label={`${labels.remove}: ${item.name}`}
              className="rounded-full border border-rule px-3 py-1 text-sm text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              {labels.remove}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Data curta; o horário não ajuda a escolher entre duas receitas de pão. */
function formatSavedAt(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}
