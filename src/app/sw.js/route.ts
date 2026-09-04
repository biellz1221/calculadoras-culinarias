import { buildVersion } from '@/lib/pwa';

/**
 * Service worker do site (FR-043).
 *
 * Gerado como route handler, e não guardado em `public/`, por um motivo só: o
 * navegador só troca de service worker quando o arquivo muda byte a byte. Com
 * um arquivo fixo, um deploy novo nunca seria detectado, e a pessoa
 * continuaria vendo a versão de ontem sem que nada avisasse. Aqui a versão do
 * build entra no texto, então cada publicação é um arquivo diferente.
 *
 * A estratégia é cache de uso, não pré-carga. Pré-carregar o HTML das
 * calculadoras seria pior do que inútil: os nomes dos pacotes de JavaScript têm
 * hash e mudam a cada build, então a página abriria offline e nunca hidrataria
 * — apareceria inteira e não calcularia nada. Guardando o que foi de fato
 * visitado, HTML e JavaScript entram no cache juntos e combinando.
 */

export const dynamic = 'force-static';

function serviceWorker(version: string): string {
  return `// Gerado em build. Não edite: a fonte é src/app/sw.js/route.ts
const VERSION = ${JSON.stringify(version)};
const CACHE = 'cc-' + VERSION;

/** Arquivos de build têm hash no nome: o que está no cache nunca fica velho. */
const IMMUTABLE = /^\\/_next\\/static\\//;

/** Não guardamos o que existe para ser lido fresco por robô. */
const NEVER_CACHE = /^\\/(robots\\.txt|sitemap\\.xml|llms\\.txt)$/;

self.addEventListener('install', () => {
  // Sem skipWaiting: a versão nova espera. Trocar o worker embaixo de uma
  // página aberta faz o JavaScript já carregado conversar com pacotes de outra
  // versão. Quem decide a hora é a pessoa, pelo aviso na tela.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

/**
 * Rede primeiro, cache como rede de baixo.
 *
 * É o certo para o HTML: online, a pessoa recebe a página publicada agora;
 * offline, recebe a última que viu. O contrário mostraria conteúdo velho a
 * quem está perfeitamente conectado.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (NEVER_CACHE.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (IMMUTABLE.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
`;
}

export function GET() {
  return new Response(serviceWorker(buildVersion()), {
    headers: {
      'content-type': 'text/javascript; charset=utf-8',
      'cache-control': 'no-cache',
    },
  });
}
