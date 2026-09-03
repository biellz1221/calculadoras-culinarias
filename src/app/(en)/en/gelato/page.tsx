import type { Metadata } from 'next';

import { GelatoPage } from '@/components/gelato/gelato-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getGelatoDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'gelato',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Gelato() {
  return (
    <SiteShell locale={LOCALE} routeKey="gelato">
      <JsonLd data={calculatorSchema('gelato', LOCALE)} />
      <GelatoPage locale={LOCALE} />
    </SiteShell>
  );
}
