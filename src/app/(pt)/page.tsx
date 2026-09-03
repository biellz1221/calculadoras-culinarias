import type { Metadata } from 'next';

import { HomePage } from '@/components/home-page';
import { JsonLd } from '@/components/json-ld';
import { LocaleGate } from '@/components/locale-gate';
import { SiteShell } from '@/components/site-shell';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/seo';
import { homeSchema } from '@/lib/structured-data';

const LOCALE = 'pt-BR' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = pageMetadata({
  routeKey: 'home',
  locale: LOCALE,
  title: dict.site.homeTitle,
  description: dict.site.description,
  keywords: dict.site.keywords,
  imageAlt: dict.site.imageAlt,
  standaloneTitle: true,
});

export default function Home() {
  return (
    <SiteShell locale={LOCALE} routeKey="home">
      <JsonLd data={homeSchema(LOCALE)} />
      <LocaleGate locale={LOCALE} />
      <HomePage locale={LOCALE} />
    </SiteShell>
  );
}
