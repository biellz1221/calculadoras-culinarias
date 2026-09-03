import Link from 'next/link';
import type { ReactNode } from 'react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ScaleMark } from '@/components/scale-mark';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { pathFor, type RouteKey } from '@/i18n/routes';
import { SITE_REPOSITORY } from '@/lib/site';

interface SiteShellProps {
  locale: Locale;
  routeKey: RouteKey;
  children: ReactNode;
}

export function SiteShell({ locale, routeKey, children }: SiteShellProps) {
  const dict = getDictionary(locale);
  const home = pathFor('home', locale);

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="label-caps sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {dict.a11y.skipToContent}
      </a>

      <header className="border-b border-rule">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href={home}
            className="group flex items-center gap-2.5 text-ink no-underline"
          >
            <ScaleMark className="size-6 shrink-0 text-brand transition-transform duration-500 group-hover:-rotate-6" />
            <span className="font-display text-lg leading-none font-semibold tracking-tight sm:text-xl">
              {dict.site.name}
            </span>
          </Link>

          <LanguageSwitcher locale={locale} routeKey={routeKey} />
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        {/* Fora da home, o caminho de volta ao catálogo. Vive aqui e não em cada
            calculadora porque é navegação do site, não conteúdo da página. */}
        {routeKey !== 'home' && (
          <div className="mx-auto w-full max-w-5xl px-5 pt-6 sm:px-8 sm:pt-8">
            <Link
              href={home}
              className="group inline-flex items-center gap-2 text-sm text-ink-muted no-underline transition-colors hover:text-brand-deep"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              >
                ←
              </span>
              {dict.nav.backToCalculators}
            </Link>
          </div>
        )}

        {children}
      </main>

      <footer className="mt-24 border-t border-rule">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 text-sm leading-relaxed text-ink-muted sm:grid-cols-2 sm:px-8">
          <p className="max-w-sm">{dict.footer.privacy}</p>
          <div className="max-w-sm sm:justify-self-end">
            <p>{dict.footer.method}</p>
            <a
              href={SITE_REPOSITORY}
              className="mt-3 inline-block underline decoration-rule-strong underline-offset-4 transition-colors hover:text-brand-deep hover:decoration-brand"
              rel="noreferrer"
            >
              {dict.footer.repository}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
