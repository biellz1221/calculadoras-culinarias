import type { Metadata } from 'next';

import { GanachePage } from '@/components/ganache/ganache-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getGanacheDictionary } from '@/i18n/dictionaries/ganache';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'pt-BR' as const;
const dict = getGanacheDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'ganache',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Ganache() {
  return (
    <SiteShell locale={LOCALE} routeKey="ganache">
      <JsonLd data={calculatorSchema('ganache', LOCALE)} />
      <GanachePage locale={LOCALE} />
    </SiteShell>
  );
}
