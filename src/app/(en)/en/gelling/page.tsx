import type { Metadata } from 'next';

import { GellingPage } from '@/components/gelling/gelling-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getGellingDictionary } from '@/i18n/dictionaries/gelling';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getGellingDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'gelling',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function GellingEn() {
  return (
    <SiteShell locale={LOCALE} routeKey="gelling">
      <JsonLd data={calculatorSchema('gelling', LOCALE)} />
      <GellingPage locale={LOCALE} />
    </SiteShell>
  );
}
