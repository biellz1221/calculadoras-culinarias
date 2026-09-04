import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

/**
 * Servidor estático de `out/`, para os testes de service worker.
 *
 * O resto da suíte roda contra o `next dev`, e é o certo: mensagens de erro
 * melhores e recarga rápida. Só que o service worker não se registra em
 * desenvolvimento de propósito — guardar em cache os pacotes que trocam a cada
 * salvamento transforma qualquer edição num mistério. Testar offline exige,
 * então, servir o build de verdade.
 *
 * Sem dependência nova: é `node:http` e o suficiente de tipos MIME para o que
 * o export gera. O que ele imita do hospedeiro estático é a regra que importa
 * aqui — `Content-Type` decidido pela extensão do arquivo.
 */

const root = resolve(process.argv[2] ?? 'out');
const port = Number(process.argv[3] ?? 3101);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Impede que `..` no caminho leve para fora de `out/`. */
function safeJoin(pathname) {
  const candidate = normalize(join(root, decodeURIComponent(pathname)));
  return candidate.startsWith(root) ? candidate : null;
}

async function resolveFile(pathname) {
  const base = safeJoin(pathname);
  if (!base) return null;

  // O export grava `paes.html`, e o site linka `/paes`.
  for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // Próximo candidato.
    }
  }

  return null;
}

const server = createServer((request, response) => {
  void (async () => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const file = await resolveFile(pathname);

    if (!file) {
      const notFound = await resolveFile('/404.html');
      response.writeHead(404, { 'content-type': TYPES['.html'] });
      if (notFound) createReadStream(notFound).pipe(response);
      else response.end('404');
      return;
    }

    response.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      // Sem cache do lado do servidor: quem manda guardar aqui é o service
      // worker, e é justamente ele que estamos testando.
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(response);
  })();
});

server.listen(port, () => {
  console.log(`servindo ${root} em http://localhost:${port}`);
});
