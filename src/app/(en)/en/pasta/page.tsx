import type { Metadata } from 'next';

import { PastaPage } from '@/components/pasta/pasta-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getPastaDictionary } from '@/i18n/dictionaries/pasta';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getPastaDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'pasta',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Pasta() {
  return (
    <SiteShell locale={LOCALE} routeKey="pasta">
      <JsonLd data={calculatorSchema('pasta', LOCALE)} />
      <PastaPage locale={LOCALE} />
    </SiteShell>
  );
}
