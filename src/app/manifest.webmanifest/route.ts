import { manifestFor } from '@/lib/pwa';

/** Manifesto do site em português, servido na raiz. */

export const dynamic = 'force-static';

export function GET() {
  return Response.json(manifestFor('pt-BR'));
}
