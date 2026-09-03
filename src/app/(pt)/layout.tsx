import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../globals.css';

import { RootHtml } from '@/components/root-html';
import { getDictionary } from '@/i18n';
import { SITE_URL } from '@/lib/site';

const LOCALE = 'pt-BR' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.site.name,
    template: `%s · ${dict.site.name}`,
  },
  description: dict.site.description,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: dict.site.name,
  },
};

export default function PortugueseRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RootHtml locale={LOCALE}>{children}</RootHtml>;
}
