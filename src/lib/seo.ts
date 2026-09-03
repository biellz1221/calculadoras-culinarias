import type { Metadata } from 'next';

import { getDictionary } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/locales';
import { alternatesFor, pathFor, type RouteKey } from '@/i18n/routes';
import { absoluteUrl } from '@/lib/site';

/**
 * Metadata de página em um lugar só.
 *
 * Existe por um detalhe do Next: campos aninhados como `openGraph` não se
 * fundem entre layout e página, o último que declarar substitui o anterior
 * inteiro. Uma página que declarasse só `openGraph.title` perderia o
 * `siteName` e o `locale` do layout sem avisar. Então quem monta o bloco
 * inteiro é esta função, e as páginas só dizem o que muda.
 */

/** Formato que o Open Graph espera para idioma: `pt_BR`, não `pt-BR`. */
const OG_LOCALE: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  en: 'en_US',
};

/** Pedaço de URL que identifica o idioma na imagem de compartilhamento. */
const OG_SLUG: Record<Locale, string> = {
  'pt-BR': 'pt',
  en: 'en',
};

/**
 * Caminho da imagem de compartilhamento de uma página.
 *
 * Termina em `.png` de propósito: a convenção `opengraph-image` do Next gera,
 * no export estático, um arquivo sem extensão, e servidor de arquivo estático
 * decide `Content-Type` pela extensão. Sem ela, o Facebook recebe a imagem
 * como binário genérico e não mostra nada.
 */
export function ogImagePath(routeKey: RouteKey, locale: Locale): string {
  return `/og/${routeKey}-${OG_SLUG[locale]}/image.png`;
}

interface PageMetadataInput {
  routeKey: RouteKey;
  locale: Locale;
  /** Título da aba e do buscador, sem o nome do site. */
  title: string;
  description: string;
  keywords: readonly string[];
  /** Texto alternativo da imagem de compartilhamento. */
  imageAlt: string;
  /**
   * Home: o título já contém o nome do site, então o template não se aplica.
   */
  standaloneTitle?: boolean;
}

export function pageMetadata({
  routeKey,
  locale,
  title,
  description,
  keywords,
  imageAlt,
  standaloneTitle = false,
}: PageMetadataInput): Metadata {
  const dict = getDictionary(locale);
  const url = absoluteUrl(pathFor(routeKey, locale));
  const image = {
    url: ogImagePath(routeKey, locale),
    width: 1200,
    height: 630,
    alt: imageAlt,
    type: 'image/png',
  };

  // O título de compartilhamento carrega o nome do site quando ele não está
  // no próprio título: no card não existe template para completar a frase.
  const socialTitle = standaloneTitle ? title : `${title} · ${dict.site.name}`;

  return {
    title: standaloneTitle ? { absolute: title } : title,
    description,
    keywords: [...keywords],
    alternates: alternatesFor(routeKey, locale),
    openGraph: {
      type: 'website',
      url,
      siteName: dict.site.name,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map(
        (other) => OG_LOCALE[other],
      ),
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        // Sem teto de trecho: o valor da página está no texto explicativo, e
        // limitar o snippet só reduz a chance de ele responder a pergunta.
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}
