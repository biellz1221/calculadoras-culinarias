import type { Metadata } from 'next';

import { GelatoPage } from '@/components/gelato/gelato-page';
import { SiteShell } from '@/components/site-shell';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'pt-BR' as const;
const dict = getGelatoDictionary(LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: alternatesFor('gelato', LOCALE),
};

export default function Gelato() {
  return (
    <SiteShell locale={LOCALE} routeKey="gelato">
      <GelatoPage locale={LOCALE} />
    </SiteShell>
  );
}
