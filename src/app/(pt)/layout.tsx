import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '../globals.css';

import { RootHtml } from '@/components/root-html';
import { getDictionary } from '@/i18n';
import { SITE_THEME_COLOR, SITE_URL } from '@/lib/site';

const LOCALE = 'pt-BR' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.site.name,
    template: `%s · ${dict.site.name}`,
  },
  description: dict.site.description,
  applicationName: dict.site.name,
  // Numa página cheia de gramas, o iOS transforma sequências de dígitos em
  // link de telefone por conta própria. Aqui isso é bug, não conveniência.
  formatDetection: { telephone: false, address: false, date: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: dict.site.name,
  },
};

export const viewport: Viewport = {
  // O site é claro por desenho: os tons de tinta foram conferidos sobre papel
  // morno. Declarar isso impede o escurecimento automático do Chrome no
  // Android, que inverteria as cores sem passar pelo teste de contraste.
  colorScheme: 'light',
  themeColor: SITE_THEME_COLOR,
};

export default function PortugueseRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RootHtml locale={LOCALE}>{children}</RootHtml>;
}
