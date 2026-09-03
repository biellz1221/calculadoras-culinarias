'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getDictionary } from '@/i18n';
import { LOCALES, LOCALE_NAME, type Locale } from '@/i18n/locales';
import { pathsFor, type RouteKey } from '@/i18n/routes';
import { cn } from '@/lib/cn';
import { storeLocale } from '@/lib/locale-preference';
import { usePreferences } from '@/lib/preferences';

interface SettingsDialogProps {
  locale: Locale;
  routeKey: RouteKey;
}

/**
 * Todas as preferências num lugar só.
 *
 * Usa o <dialog> nativo: ele já traz foco preso dentro do modal, fechamento
 * por Esc e a camada de fundo, sem precisar reimplementar nada disso à mão.
 *
 * Tudo o que muda aqui é gravado no localStorage. Cookie seria necessário se o
 * servidor precisasse saber da escolha antes de responder, e não é o caso: o
 * site é estático e quem aplica a preferência é o próprio navegador. Sem
 * cookie, também não há banner de consentimento a pedir.
 */
export function SettingsDialog({ locale, routeKey }: SettingsDialogProps) {
  const dict = getDictionary(locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const { units, temperature, simplified, setUnits, setTemperature, setSimplified } =
    usePreferences();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const paths = pathsFor(routeKey);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.preferences.open}
        className="label-caps flex items-center rounded-full border border-rule px-3 py-1.5 text-ink-muted transition-colors hover:border-accent hover:text-accent-deep"
      >
        {/* Em tela estreita só cabe o símbolo: cabeçalho com a marca, a palavra
            inteira e o seletor de idioma estourava a largura em 360 px. */}
        <span aria-hidden="true" className="sm:hidden">
          ☰
        </span>
        <span className="hidden sm:inline">{dict.preferences.open}</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // Clique na área escura, fora do painel, fecha.
          if (event.target === dialogRef.current) setOpen(false);
        }}
        aria-labelledby="settings-title"
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-card border border-rule bg-page p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="p-6 sm:p-8">
          <h2 id="settings-title" className="font-display text-title">
            {dict.preferences.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {dict.preferences.lead}
          </p>

          <Group label={dict.preferences.language}>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((option) => (
                <Link
                  key={option}
                  href={paths[option]}
                  hrefLang={option}
                  lang={option}
                  onClick={() => storeLocale(option)}
                  aria-current={option === locale ? 'true' : undefined}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm no-underline transition-colors',
                    option === locale
                      ? 'border-ink bg-ink text-paper'
                      : 'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent-deep',
                  )}
                >
                  {LOCALE_NAME[option]}
                </Link>
              ))}
            </div>
          </Group>

          <Group label={dict.preferences.units} note={dict.preferences.unitsNote}>
            <Choice
              options={[
                { value: 'metric' as const, label: dict.preferences.metric },
                { value: 'imperial' as const, label: dict.preferences.imperial },
              ]}
              value={units}
              onChange={setUnits}
              legend={dict.preferences.units}
            />
          </Group>

          <Group
            label={dict.preferences.temperature}
            note={dict.preferences.temperatureNote}
          >
            <Choice
              options={[
                { value: 'celsius' as const, label: dict.preferences.celsius },
                { value: 'fahrenheit' as const, label: dict.preferences.fahrenheit },
              ]}
              value={temperature}
              onChange={setTemperature}
              legend={dict.preferences.temperature}
            />
          </Group>

          <Group label={dict.preferences.display} note={dict.preferences.simplifiedNote}>
            <Choice
              options={[
                { value: 'full' as const, label: dict.preferences.simplifiedOff },
                { value: 'simple' as const, label: dict.preferences.simplifiedOn },
              ]}
              value={simplified ? 'simple' : 'full'}
              onChange={(value) => setSimplified(value === 'simple')}
              legend={dict.preferences.simplified}
            />
          </Group>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              {dict.preferences.done}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

function Group({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 border-t border-rule pt-5">
      <h3 className="label-caps text-accent-deep">{label}</h3>
      <div className="mt-3">{children}</div>
      {note && (
        <p className="mt-2.5 max-w-prose text-xs leading-relaxed text-ink-muted">
          {note}
        </p>
      )}
    </section>
  );
}

function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              option.value === value
                ? 'border-accent-deep bg-accent-tint text-accent-deep'
                : 'border-rule bg-surface text-ink-soft hover:border-accent',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
