import type { Metadata } from 'next';

import { PicklesPage } from '@/components/pickles/pickles-page';
import { SiteShell } from '@/components/site-shell';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'pt-BR' as const;
const dict = getPicklesDictionary(LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: alternatesFor('pickles', LOCALE),
};

export default function Picles() {
  return (
    <SiteShell locale={LOCALE} routeKey="pickles">
      <PicklesPage locale={LOCALE} />
    </SiteShell>
  );
}
