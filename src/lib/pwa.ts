import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';
import { SITE_THEME_COLOR, SITE_UPDATED } from '@/lib/site';

/**
 * O site instalado na tela de início (FR-043).
 *
 * São dois manifestos, um por idioma, e não um só. Um manifesto carrega um nome
 * e um `start_url`, e os dois mudam com o idioma: quem instala pelo inglês
 * merece o ícone com o nome em inglês abrindo em `/en`, não em português. É a
 * mesma regra que vale para o resto do site — os dois idiomas andam juntos.
 */

/** Ícones do aplicativo, gerados no build por `app/icon/[variant]/image.png`. */
const ICONS = [
  { src: '/icon/192/image.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/icon/512/image.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  {
    src: '/icon/512-maskable/image.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
] as const;

export function manifestFor(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    name: dict.site.name,
    short_name: dict.site.shortName,
    description: dict.site.tagline,
    lang: locale,
    start_url: pathFor('home', locale),
    // `scope` na raiz mesmo no inglês: instalado pelo `/en`, o aplicativo
    // continua podendo navegar para o português se a pessoa trocar o idioma.
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: SITE_THEME_COLOR,
    theme_color: SITE_THEME_COLOR,
    icons: ICONS,
  };
}

/**
 * Versão do que está publicado.
 *
 * O service worker só se atualiza quando o arquivo dele muda byte a byte. Com
 * uma constante escrita à mão, um deploy que mexeu só no conteúdo não trocaria
 * nada — e a pessoa continuaria vendo a versão de ontem sem saber. O SHA do
 * commit muda a cada publicação, que é exatamente a cadência certa.
 */
export function buildVersion(): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? `dev-${SITE_UPDATED}`;
}
