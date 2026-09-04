import { ImageResponse } from 'next/og';

import { BRAND_DEEP, BRAND_TINT, INK } from '@/lib/palette';

/**
 * Ícones do aplicativo instalado, gerados no build.
 *
 * Mesmo motivo do cartão de compartilhamento: o Next grava arquivo sem
 * extensão nas convenções de metadata, e servidor estático decide o
 * `Content-Type` pela extensão. Um ícone servido como binário genérico não
 * aparece na tela de início de ninguém.
 *
 * São três variantes porque servem a duas máscaras diferentes:
 * - `any` desenha o quadrado arredondado inteiro, como o favicon;
 * - `maskable` sangra a cor até a borda e encolhe a marca para dentro da zona
 *   segura, porque o Android recorta o ícone na forma do sistema — círculo,
 *   pétala, o que for — e o que estiver perto da borda some.
 */

export const dynamic = 'force-static';

interface Variant {
  readonly size: number;
  readonly maskable: boolean;
}

const VARIANTS: Record<string, Variant> = {
  '192': { size: 192, maskable: false },
  '512': { size: 512, maskable: false },
  '512-maskable': { size: 512, maskable: true },
};

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

/**
 * A balança do site, em SVG.
 *
 * Vai como imagem embutida, e não como JSX: o gerador desenha caixas e texto,
 * não traços de SVG. O `viewBox` é o mesmo de `ScaleMark`, para o ícone e a
 * marca do cabeçalho serem o mesmo desenho.
 */
function markDataUri(stroke: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.4v14.2"/><path d="M5 7.1h14"/><path d="M8.4 18.6h7.2"/><path d="M2.6 13.1 5 7.6l2.4 5.5a2.7 2.7 0 0 1-4.8 0Z"/><path d="M16.6 13.1 19 7.6l2.4 5.5a2.7 2.7 0 0 1-4.8 0Z"/><circle cx="12" cy="4.4" r="1.3" fill="${BRAND_DEEP}" stroke="none"/></svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  const config = VARIANTS[variant];

  if (!config) throw new Error(`Variante de ícone desconhecida: ${variant}`);

  const { size, maskable } = config;
  // Zona segura da máscara: 80% do lado. Fora dela o Android pode recortar.
  const mark = Math.round(size * (maskable ? 0.52 : 0.68));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: INK,
          borderRadius: maskable ? 0 : Math.round(size * 0.22),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri(BRAND_TINT)} width={mark} height={mark} alt="" />
      </div>
    ),
    { width: size, height: size },
  );
}
