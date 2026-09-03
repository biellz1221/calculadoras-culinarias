import type { Metadata } from 'next';

import { BreadPage } from '@/components/bread/bread-page';
import { SiteShell } from '@/components/site-shell';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { alternatesFor } from '@/i18n/routes';

const LOCALE = 'en' as const;
const dict = getBreadDictionary(LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: alternatesFor('bread', LOCALE),
};

export default function Bread() {
  return (
    <SiteShell locale={LOCALE} routeKey="bread">
      <BreadPage locale={LOCALE} />
    </SiteShell>
  );
}
