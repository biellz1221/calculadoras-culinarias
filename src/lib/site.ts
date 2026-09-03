export const SITE_URL = 'https://calculadorasculinarias.com.br';

export const SITE_REPOSITORY = 'https://github.com/biellz1221/calculadoras-culinarias';

/**
 * Data da última revisão de conteúdo, usada no sitemap e no JSON-LD.
 *
 * É constante de propósito. `new Date()` no build faria o site anunciar
 * conteúdo novo a cada deploy, inclusive quando só o CSS mudou, e um sitemap
 * que grita "atualizado" toda semana sem nada mudar perde credibilidade com o
 * buscador. Suba este valor quando o conteúdo mudar de verdade.
 */
export const SITE_UPDATED = '2026-09-03';

/** Cor do chrome do navegador em telas pequenas: o mesmo papel morno do site. */
export const SITE_THEME_COLOR = '#fbf6ee';

/**
 * Endereço absoluto de um caminho do site.
 *
 * Canonical, hreflang, sitemap, og:url e JSON-LD precisam escrever o mesmo
 * endereço com exatamente as mesmas letras. O detalhe que os separava era a
 * raiz: `new URL('/')` devolve `.../com.br/`, com barra, e o Next normaliza o
 * canonical para `.../com.br`, sem. Como o canonical é o que não dá para
 * mudar, é ele que dita a grafia, e a barra final cai aqui.
 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString().replace(/\/$/, '');
}
