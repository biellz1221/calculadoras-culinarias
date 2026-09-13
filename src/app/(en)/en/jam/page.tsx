import type { Metadata } from 'next';

import { JamPage } from '@/components/jam/jam-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getJamDictionary } from '@/i18n/dictionaries/jam';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getJamDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'jam',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Jam() {
  return (
    <SiteShell locale={LOCALE} routeKey="jam">
      <JsonLd data={calculatorSchema('jam', LOCALE)} />
      <JamPage locale={LOCALE} />
    </SiteShell>
  );
}
