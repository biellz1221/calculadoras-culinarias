'use client';

import { useEffect, useRef, useState } from 'react';

import { PrintSheet } from './print-sheet';
import { SavedList } from './saved-list';
import { CALCULATORS, type CalculatorId } from '@/data/calculators';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';
import { cn } from '@/lib/cn';
import { recipeCardText, type RecipeCard } from '@/lib/recipes/card';
import { useSavedRecipes } from '@/lib/recipes/store';
import { useRecipeSharing } from '@/lib/recipes/use-recipe-sharing';
import { absoluteUrl } from '@/lib/site';

interface RecipeActionsProps<S> {
  calculator: CalculatorId;
  locale: Locale;
  /** Estado serializável da calculadora, do jeito que ela guarda. */
  state: S;
  /** O resultado calculado, para o texto, a folha impressa e o nome sugerido. */
  card: RecipeCard;
  /** Validação de estado vindo de fora: link recebido ou receita antiga salva. */
  parse: (value: unknown) => S | null;
  onRestore: (state: S) => void;
}

/**
 * Salvar, compartilhar e imprimir a receita calculada (FR-040 a FR-042).
 *
 * As três saem do mesmo par — o estado, que reconstrói a calculadora, e o
 * `RecipeCard`, que é o resultado já formatado. Nenhuma delas passa por
 * servidor: salvar é localStorage, compartilhar é a receita inteira dentro da
 * URL e imprimir é uma folha montada no próprio navegador.
 */
export function RecipeActions<S>({
  calculator,
  locale,
  state,
  card,
  parse,
  onRestore,
}: RecipeActionsProps<S>) {
  const dict = getDictionary(locale);
  const copy = dict.recipe;

  const shelf = useSavedRecipes(calculator);
  const sharing = useRecipeSharing({ calculator, state, parse, onRestore });

  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  const nameInput = useRef<HTMLInputElement>(null);

  const route = CALCULATORS.find((item) => item.id === calculator)?.route ?? calculator;
  const pageUrl = absoluteUrl(pathFor(route, locale));

  useEffect(() => {
    if (naming) nameInput.current?.focus();
  }, [naming]);

  function announce(text: string) {
    setMessage(text);
    setManualCopy(null);
  }

  /**
   * Copiar exige contexto seguro e, em alguns navegadores, um gesto recente.
   * Quando falha, mostramos o texto para a pessoa copiar à mão em vez de
   * anunciar um sucesso que não houve.
   */
  async function copyToClipboard(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      announce(success);
    } catch {
      setMessage(copy.copyManually);
      setManualCopy(text);
    }
  }

  async function share() {
    const text = recipeCardText(card, { sources: copy.sources }, sharing.buildLink());

    // Web Share é o caminho do celular, que é onde a receita costuma sair da
    // cozinha para a conversa. No desktop quase nunca existe, e aí copiar é o
    // mesmo gesto com um passo a mais.
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: card.title, text });
        return;
      } catch {
        // Cancelar o menu de compartilhamento também cai aqui. Copiar em
        // seguida é inofensivo e resolve o caso de a chamada ter falhado.
      }
    }

    await copyToClipboard(text, copy.textCopied);
  }

  function saveNow() {
    const outcome = shelf.save(name, state);

    if (outcome === 'saved' || outcome === 'replaced') {
      announce(outcome === 'saved' ? copy.saved : copy.replaced);
      setNaming(false);
      setName('');
      return;
    }

    announce(outcome === 'full' ? copy.full : copy.blocked);
  }

  function load(value: unknown) {
    const parsed = parse(value);

    if (parsed === null) {
      announce(copy.brokenEntry);
      return;
    }

    onRestore(parsed);
    setListOpen(false);
    announce(copy.loaded);
  }

  return (
    <section aria-label={copy.actionsLabel} className="mt-10 border-t border-rule pt-6">
      <div className="flex flex-wrap items-center gap-2">
        {shelf.available && (
          <>
            <Action
              onClick={() => {
                // O título da receita é o melhor palpite de nome, e é palpite:
                // o campo abre selecionável e a pessoa reescreve por cima.
                if (!naming) setName(card.title);
                setNaming(!naming);
              }}
              expanded={naming}
            >
              {copy.save}
            </Action>
            <Action
              onClick={() => setListOpen((open) => !open)}
              expanded={listOpen}
              disabled={shelf.items.length === 0}
            >
              {`${copy.mine} (${shelf.items.length})`}
            </Action>
          </>
        )}

        <Action onClick={share}>{copy.share}</Action>
        <Action
          onClick={() => void copyToClipboard(sharing.buildLink(), copy.linkCopied)}
        >
          {copy.copyLink}
        </Action>
        <Action onClick={() => window.print()}>{copy.print}</Action>
      </div>

      {naming && (
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            saveNow();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="recipe-name" className="text-sm text-ink-muted">
              {copy.nameLabel}
            </label>
            <input
              id="recipe-name"
              ref={nameInput}
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              className="w-64 max-w-full rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={name.trim().length === 0}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {copy.confirm}
          </button>
          <button
            type="button"
            onClick={() => setNaming(false)}
            className="rounded-full border border-rule px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-deep"
          >
            {copy.cancel}
          </button>
        </form>
      )}

      {listOpen && shelf.available && (
        <SavedList
          items={shelf.items}
          labels={copy}
          locale={locale}
          onLoad={load}
          onRemove={shelf.remove}
        />
      )}

      {/* Um só canal de retorno para todas as ações. `role="status"` já traz
          `aria-live="polite"` e `aria-atomic`, que é exatamente o que uma
          mensagem curta de confirmação pede: anunciada inteira, e sem
          interromper quem está no meio de uma frase. */}
      <p role="status" className="mt-3 min-h-5 text-sm text-ink-muted">
        {message}
      </p>

      {manualCopy && (
        <label className="mt-1 block">
          <span className="label-caps text-ink-muted">{copy.manualLabel}</span>
          <textarea
            readOnly
            rows={4}
            value={manualCopy}
            onFocus={(event) => event.target.select()}
            className="mt-2 w-full rounded-sm border border-rule bg-surface px-3 py-2 font-mono text-xs text-ink-soft"
          />
        </label>
      )}

      {sharing.status !== 'none' && sharing.status !== 'restored' && (
        <p className="mt-3 flex flex-wrap items-center gap-3 rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
          {sharing.status === 'outdated' ? copy.linkOutdated : copy.linkInvalid}
          <button
            type="button"
            onClick={sharing.dismiss}
            className="label-caps underline decoration-warn/40 underline-offset-4"
          >
            {copy.dismiss}
          </button>
        </p>
      )}

      <PrintSheet card={card} footer={`${dict.site.name} · ${pageUrl}`} />
    </section>
  );
}

function Action({
  children,
  onClick,
  expanded,
  disabled,
}: {
  children: string;
  onClick: () => void;
  expanded?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-expanded={expanded}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
        expanded
          ? 'border-accent-deep bg-accent-tint text-accent-deep'
          : 'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent-deep',
        disabled && 'opacity-40 hover:border-rule hover:text-ink-soft',
      )}
    >
      {children}
    </button>
  );
}
