import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '../globals.css';

import { RootHtml } from '@/components/root-html';
import { getDictionary } from '@/i18n';
import { SITE_THEME_COLOR, SITE_URL } from '@/lib/site';

const LOCALE = 'en' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.site.name,
    template: `%s · ${dict.site.name}`,
  },
  description: dict.site.description,
  applicationName: dict.site.name,
  manifest: '/en/manifest.webmanifest',
  formatDetection: { telephone: false, address: false, date: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: dict.site.name,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: SITE_THEME_COLOR,
};

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootHtml locale={LOCALE}>{children}</RootHtml>;
}
