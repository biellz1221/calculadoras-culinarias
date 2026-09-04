import type { ReactNode } from 'react';

import { atkinson, fraunces } from '@/app/fonts';
import { ServiceWorkerBridge } from '@/components/service-worker';
import { HTML_LANG, type Locale } from '@/i18n/locales';

/**
 * O documento HTML de cada idioma.
 *
 * O site tem um root layout por idioma (route groups `(pt)` e `(en)`), porque é
 * o que permite servir `lang` correto no <html> sem middleware — o site é
 * estático (TD-001). Este componente concentra o que os dois têm em comum.
 */
export function RootHtml({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html lang={HTML_LANG[locale]} className={`${fraunces.variable} ${atkinson.variable}`}>
      <body>
        {children}
        <ServiceWorkerBridge locale={locale} />
      </body>
    </html>
  );
}
