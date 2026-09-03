import type { Metadata } from 'next';

import { PastaPage } from '@/components/pasta/pasta-page';
import { SiteShell } from '@/components/site-shell';
import { getPastaDictionary } from '@/i18n/dictionaries/pasta';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'en' as const;
const dict = getPastaDictionary(LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: alternatesFor('pasta', LOCALE),
};

export default function Pasta() {
  return (
    <SiteShell locale={LOCALE} routeKey="pasta">
      <PastaPage locale={LOCALE} />
    </SiteShell>
  );
}
