import type { Metadata } from 'next';

import { BreadPage } from '@/components/bread/bread-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getBreadDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'bread',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Bread() {
  return (
    <SiteShell locale={LOCALE} routeKey="bread">
      <JsonLd data={calculatorSchema('bread', LOCALE)} />
      <BreadPage locale={LOCALE} />
    </SiteShell>
  );
}
