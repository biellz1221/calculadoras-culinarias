import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { CALCULATORS, type CalculatorId } from '@/data/calculators';
import { formatAuthors, getBook } from '@/data/books';
import { GELATO_SOURCE } from '@/data/gelato/source';
import { getDictionary } from '@/i18n';
import { getCalculatorCopy } from '@/i18n/calculators';
import { LOCALES, type Locale } from '@/i18n/locales';
import { PUBLISHED_ROUTES, type RouteKey } from '@/i18n/routes';
import { INK, INK_MUTED, INK_SOFT, PALETTES, RULE } from '@/lib/palette';

/**
 * Imagem de compartilhamento de cada página, gerada no build.
 *
 * Poderia ser a convenção `opengraph-image` do Next, mas ela grava, no export
 * estático, um arquivo sem extensão, e servidor de arquivo estático decide o
 * `Content-Type` pela extensão. O Facebook recebendo `application/octet-stream`
 * simplesmente não mostra imagem. Como route handler o caminho é nosso, e
 * termina em `.png` de verdade.
 *
 * O cartão é o site em miniatura: o papel morno, a cor da calculadora, a
 * serifa do título e, no rodapé, as obras que sustentam os números. É o
 * argumento do site numa imagem só.
 */

export const dynamic = 'force-static';

const SIZE = { width: 1200, height: 630 };

const LOCALE_SLUG: Record<Locale, string> = { 'pt-BR': 'pt', en: 'en' };

const [display, body] = await Promise.all([
  readFile(join(process.cwd(), 'assets/fonts/Fraunces-SemiBold.ttf')),
  readFile(join(process.cwd(), 'assets/fonts/AtkinsonHyperlegible-Regular.ttf')),
]);

export function generateStaticParams() {
  return PUBLISHED_ROUTES.flatMap((routeKey) =>
    LOCALES.map((locale) => ({ slug: `${routeKey}-${LOCALE_SLUG[locale]}` })),
  );
}

function parseSlug(slug: string): { routeKey: RouteKey; locale: Locale } {
  const cut = slug.lastIndexOf('-');
  const routeKey = slug.slice(0, cut);
  const short = slug.slice(cut + 1);

  const locale = LOCALES.find((candidate) => LOCALE_SLUG[candidate] === short);
  const route = PUBLISHED_ROUTES.find((candidate) => candidate === routeKey);

  if (!locale || !route) {
    throw new Error(`Slug de imagem desconhecido: ${slug}`);
  }

  return { routeKey: route, locale };
}

/** As obras que assinam a calculadora, para o rodapé do cartão. */
function sourceLine(routeKey: RouteKey, locale: Locale): string {
  const dict = getDictionary(locale);

  if (routeKey === 'home') {
    return CALCULATORS.map((calculator) => dict.calculators[calculator.id].name).join(
      ' · ',
    );
  }

  const calculator = CALCULATORS.find((item) => item.route === routeKey);
  const surnames =
    calculator?.sources.map((id) => formatAuthors(getBook(id))) ?? [];

  // O gelato é o único que não sai de livro: os números vêm da planilha de um
  // curso, e o cartão diz isso em vez de inventar uma bibliografia.
  return surnames.length > 0 ? surnames.join(' · ') : GELATO_SOURCE.title;
}

function cardCopy(routeKey: RouteKey, locale: Locale) {
  const dict = getDictionary(locale);

  if (routeKey === 'home') {
    return {
      eyebrow: dict.site.name,
      title: dict.home.title,
      lead: dict.site.tagline,
    };
  }

  const copy = getCalculatorCopy(routeKey as CalculatorId, locale);
  return { eyebrow: dict.site.name, title: copy.title, lead: copy.meta.description };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { routeKey, locale } = parseSlug(slug);
  const palette = PALETTES[routeKey];
  const { eyebrow, title, lead } = cardCopy(routeKey, locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.page,
          fontFamily: 'Atkinson',
        }}
      >
        {/* O filete de cor no topo é a aba do fichário: identifica a
            calculadora antes de qualquer palavra ser lida. */}
        <div style={{ height: 14, backgroundColor: palette.accent }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '58px 72px 52px',
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: palette.accentDeep,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              marginTop: 38,
              fontFamily: 'Fraunces',
              fontSize: 68,
              lineHeight: 1.06,
              letterSpacing: -1.5,
              color: INK,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 26,
              maxWidth: 900,
              fontSize: 25,
              lineHeight: 1.5,
              color: INK_SOFT,
            }}
          >
            {lead}
          </div>

          <div style={{ display: 'flex', flex: 1 }} />

          <div style={{ height: 1, backgroundColor: RULE }} />
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 19,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: INK_MUTED,
            }}
          >
            <div style={{ color: palette.accentDeep }}>
              {sourceLine(routeKey, locale)}
            </div>
            <div>calculadorasculinarias.com.br</div>
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: 'Fraunces', data: display, weight: 600, style: 'normal' },
        { name: 'Atkinson', data: body, weight: 400, style: 'normal' },
      ],
    },
  );
}
