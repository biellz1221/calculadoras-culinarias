import type { RouteKey } from '@/i18n/routes';

/**
 * As paletas por calculadora em TypeScript.
 *
 * O site inteiro se pinta pelas custom properties de `globals.css`; esta cópia
 * existe porque a imagem de compartilhamento é gerada fora do navegador, onde
 * não há CSS para consultar. Os valores estão espelhados nos dois lugares e o
 * teste em `palette.test.ts` compara um com o outro, então uma cor trocada só
 * no CSS quebra a suíte em vez de aparecer torta num card do WhatsApp.
 */
export interface Palette {
  /** Fundo da página. */
  page: string;
  /** Cor de acento, usada em filetes e detalhes. */
  accent: string;
  /** Versão escura do acento, a única com contraste para texto pequeno. */
  accentDeep: string;
}

export const INK = '#2a2521';
export const INK_SOFT = '#574d43';
export const INK_MUTED = '#6f6558';
export const RULE = '#e6dccb';

/** Mel tostado da marca, para o ícone do aplicativo instalado. */
export const BRAND_DEEP = '#7d4a1c';
export const BRAND_TINT = '#f6e7d2';

export const PALETTES: Record<RouteKey, Palette> = {
  home: { page: '#fbf6ee', accent: '#a9662a', accentDeep: '#7d4a1c' },
  bread: { page: '#fdf8ee', accent: '#a97016', accentDeep: '#7a4e0f' },
  pickles: { page: '#f8faf2', accent: '#5a7a45', accentDeep: '#40592f' },
  pasta: { page: '#fdf7f2', accent: '#b25733', accentDeep: '#8a3f22' },
  gelato: { page: '#fdf6f8', accent: '#a34e6a', accentDeep: '#7d374f' },
  curing: { page: '#fcf7f4', accent: '#9c5f3c', accentDeep: '#74432a' },
  jam: { page: '#fbf7fd', accent: '#7a4a86', accentDeep: '#5c3566' },
  brine: { page: '#f5faf9', accent: '#3f6b6e', accentDeep: '#2f5154' },
  ganache: { page: '#f9f5f2', accent: '#4e3a2e', accentDeep: '#382720' },
  gelling: { page: '#f6f7fb', accent: '#4f628a', accentDeep: '#3a4a6b' },
};
