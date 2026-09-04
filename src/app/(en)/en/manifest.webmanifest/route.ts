import { manifestFor } from '@/lib/pwa';

/** Manifesto do site em inglês: mesmo aplicativo, nome e porta de entrada dele. */

export const dynamic = 'force-static';

export function GET() {
  return Response.json(manifestFor('en'));
}
