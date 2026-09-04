import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { BRAND_DEEP, BRAND_TINT, INK, PALETTES } from './palette';

import { PUBLISHED_ROUTES, type RouteKey } from '@/i18n/routes';

/**
 * A paleta vive em dois lugares: no CSS, que pinta o site, e em TypeScript,
 * que pinta a imagem de compartilhamento (gerada fora do navegador, sem CSS
 * para consultar). Este teste é o que impede os dois de divergirem em
 * silêncio e o card sair com a cor de ontem.
 */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

/** Lê uma custom property de dentro de um bloco do CSS. */
function readToken(selector: string, token: string): string | undefined {
  const block = css.split(selector)[1]?.split('}')[0];
  return block?.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1]?.trim();
}

function blockFor(routeKey: RouteKey): string {
  return routeKey === 'home' ? '@theme {' : `[data-calculator='${routeKey}'] {`;
}

describe('paleta', () => {
  it.each(PUBLISHED_ROUTES)('bate com o CSS em %s', (routeKey) => {
    const selector = blockFor(routeKey);
    const palette = PALETTES[routeKey];

    expect(readToken(selector, '--color-page')).toBe(palette.page);
    expect(readToken(selector, '--color-accent')).toBe(palette.accent);
    expect(readToken(selector, '--color-accent-deep')).toBe(palette.accentDeep);
  });

  it('dá uma cor distinta a cada calculadora', () => {
    const accents = PUBLISHED_ROUTES.map((key) => PALETTES[key].accent);
    expect(new Set(accents).size).toBe(accents.length);
  });

  it('bate com o CSS também nas cores da marca', () => {
    // O ícone do aplicativo instalado é gerado fora do navegador, como o
    // cartão de compartilhamento — e some da mesma forma se divergir do CSS.
    expect(readToken('@theme {', '--color-brand-deep')).toBe(BRAND_DEEP);
    expect(readToken('@theme {', '--color-brand-tint')).toBe(BRAND_TINT);
    expect(readToken('@theme {', '--color-ink')).toBe(INK);
  });
});
