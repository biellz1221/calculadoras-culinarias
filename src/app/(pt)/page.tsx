import type { Metadata } from 'next';

import { HomePage } from '@/components/home-page';
import { LocaleGate } from '@/components/locale-gate';
import { SiteShell } from '@/components/site-shell';
import { getDictionary } from '@/i18n';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'pt-BR' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = {
  title: { absolute: dict.site.homeTitle },
  description: dict.site.description,
  alternates: alternatesFor('home', LOCALE),
};

export default function Home() {
  return (
    <SiteShell locale={LOCALE} routeKey="home">
      <LocaleGate locale={LOCALE} />
      <HomePage locale={LOCALE} />
    </SiteShell>
  );
}
