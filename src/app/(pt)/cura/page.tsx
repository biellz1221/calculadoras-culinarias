import type { Metadata } from 'next';

import { CuringPage } from '@/components/curing/curing-page';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { getCuringDictionary } from '@/i18n/dictionaries/curing';
import { pageMetadata } from '@/lib/seo';
import { calculatorSchema } from '@/lib/structured-data';

const LOCALE = 'pt-BR' as const;
const dict = getCuringDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'curing',
  locale: LOCALE,
  title: dict.meta.title,
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  imageAlt: dict.meta.imageAlt,
});

export default function Cura() {
  return (
    <SiteShell locale={LOCALE} routeKey="curing">
      <JsonLd data={calculatorSchema('curing', LOCALE)} />
      <CuringPage locale={LOCALE} />
    </SiteShell>
  );
}
