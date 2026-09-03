import Link from 'next/link';

import { getDictionary } from '@/i18n';
import { LOCALES, LOCALE_NAME, LOCALE_SHORT, type Locale } from '@/i18n/locales';
import { pathsFor, type RouteKey } from '@/i18n/routes';
import { cn } from '@/lib/cn';

interface LanguageSwitcherProps {
  locale: Locale;
  routeKey: RouteKey;
}

/**
 * Troca de idioma sem JavaScript: são dois links para a mesma página no outro
 * idioma, resolvidos pelo registro de rotas. Como todo link interno de um
 * idioma aponta para rotas daquele idioma, a escolha se mantém pela navegação
 * — sem cookie, sem localStorage e sem redirecionamento automático.
 */
export function LanguageSwitcher({ locale, routeKey }: LanguageSwitcherProps) {
  const dict = getDictionary(locale);
  const paths = pathsFor(routeKey);

  return (
    <nav aria-label={dict.a11y.languageNav}>
      <ul className="flex items-center gap-1">
        {LOCALES.map((option) => {
          const isCurrent = option === locale;

          return (
            <li key={option} className="flex items-center">
              <Link
                href={paths[option]}
                hrefLang={option}
                lang={option}
                aria-current={isCurrent ? 'true' : undefined}
                aria-label={
                  isCurrent
                    ? `${dict.a11y.currentLanguage}: ${LOCALE_NAME[option]}`
                    : LOCALE_NAME[option]
                }
                className={cn(
                  'label-caps rounded-full px-2.5 py-1.5 transition-colors',
                  isCurrent
                    ? 'bg-ink text-paper'
                    : 'text-ink-muted hover:bg-brand-tint hover:text-brand-deep',
                )}
              >
                {LOCALE_SHORT[option]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
