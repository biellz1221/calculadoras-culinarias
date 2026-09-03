import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales';
import { PUBLISHED_ROUTES, pathsFor } from '@/i18n/routes';
import { absoluteUrl, SITE_UPDATED } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Só entram rotas já publicadas nos dois idiomas — o registro em
 * `PUBLISHED_ROUTES` é a mesma fonte que a home usa para decidir o que linkar,
 * então o sitemap nunca anuncia uma página que ainda não existe.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLISHED_ROUTES.flatMap((routeKey) => {
    const paths = pathsFor(routeKey);
    const languages: Record<string, string> = Object.fromEntries(
      LOCALES.map((locale) => [locale, absoluteUrl(paths[locale])]),
    );
    // Mesmo conjunto de hreflang do <head>: quem chega pelo sitemap precisa
    // encontrar a mesma reciprocidade que encontraria na página.
    languages['x-default'] = absoluteUrl(paths[DEFAULT_LOCALE]);

    return LOCALES.map((locale) => ({
      url: absoluteUrl(paths[locale]),
      alternates: { languages },
      lastModified: SITE_UPDATED,
      // Calculadora é referência, não notícia: muda quando uma fonte nova
      // entra na estante, o que acontece em meses, não em dias.
      changeFrequency: 'monthly' as const,
      // A home é porta de entrada; as calculadoras são o que a pessoa procura.
      // A diferença é pequena de propósito: nenhuma delas é secundária.
      priority: routeKey === 'home' ? 1 : 0.9,
    }));
  });
}
