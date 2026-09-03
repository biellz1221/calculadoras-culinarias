import type { Metadata } from 'next';

import { PicklesPage } from '@/components/pickles/pickles-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'en' as const;
const dict = getPicklesDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'pickles',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Pickles() {
  return (
    <SiteShell locale={LOCALE} routeKey="pickles">
      <JsonLd data={calculatorSchema('pickles', LOCALE)} />
      <PicklesPage locale={LOCALE} />
    </SiteShell>
  );
}
