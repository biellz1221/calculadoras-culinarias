import type { Metadata } from 'next';

import { BrinePage } from '@/components/brine/brine-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getBrineDictionary } from '@/i18n/dictionaries/brine';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'pt-BR' as const;
const dict = getBrineDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'brine',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Salmoura() {
  return (
    <SiteShell locale={LOCALE} routeKey="brine">
      <JsonLd data={calculatorSchema('brine', LOCALE)} />
      <BrinePage locale={LOCALE} />
    </SiteShell>
  );
}
