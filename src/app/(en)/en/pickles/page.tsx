import type { Metadata } from 'next';

import { PicklesPage } from '@/components/pickles/pickles-page';
import { SiteShell } from '@/components/site-shell';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'en' as const;
const dict = getPicklesDictionary(LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: alternatesFor('pickles', LOCALE),
};

export default function Pickles() {
  return (
    <SiteShell locale={LOCALE} routeKey="pickles">
      <PicklesPage locale={LOCALE} />
    </SiteShell>
  );
}
