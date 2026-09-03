import type { MetadataRoute } from 'next';

import { LOCALES, type Locale } from '@/i18n/locales';
import { PUBLISHED_ROUTES, pathsFor } from '@/i18n/routes';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Só entram rotas já publicadas nos dois idiomas — o registro em
 * `PUBLISHED_ROUTES` é a mesma fonte que a home usa para decidir o que linkar,
 * então o sitemap nunca anuncia uma página que ainda não existe.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, SITE_URL).toString();

  return PUBLISHED_ROUTES.flatMap((routeKey) => {
    const paths = pathsFor(routeKey);
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, absolute(paths[locale])]),
    ) as Record<Locale, string>;

    return LOCALES.map((locale) => ({
      url: absolute(paths[locale]),
      alternates: { languages },
    }));
  });
}
