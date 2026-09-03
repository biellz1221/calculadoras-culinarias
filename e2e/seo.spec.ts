import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  { path: '/', key: 'home', locale: 'pt-BR' },
  { path: '/paes', key: 'bread', locale: 'pt-BR' },
  { path: '/picles', key: 'pickles', locale: 'pt-BR' },
  { path: '/massas', key: 'pasta', locale: 'pt-BR' },
  { path: '/gelato', key: 'gelato', locale: 'pt-BR' },
  { path: '/en', key: 'home', locale: 'en' },
  { path: '/en/bread', key: 'bread', locale: 'en' },
  { path: '/en/pickles', key: 'pickles', locale: 'en' },
  { path: '/en/pasta', key: 'pasta', locale: 'en' },
  { path: '/en/gelato', key: 'gelato', locale: 'en' },
];

async function meta(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).first().getAttribute('content')) ?? '';
}

for (const target of PAGES) {
  test(`${target.path} traz o bloco social completo`, async ({ page }) => {
    await page.goto(target.path);

    await expect(page).toHaveTitle(/.+/);
    expect(await meta(page, 'meta[name="description"]')).not.toBe('');
    expect(await meta(page, 'meta[name="keywords"]')).toContain(',');

    expect(await meta(page, 'meta[property="og:title"]')).not.toBe('');
    expect(await meta(page, 'meta[property="og:description"]')).not.toBe('');
    expect(await meta(page, 'meta[property="og:site_name"]')).not.toBe('');
    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');

    // Canonical, og:url e sitemap precisam escrever o mesmo endereço com as
    // mesmas letras. Na raiz isso significa sem barra final, que é como o
    // Next normaliza o canonical e, por isso, como o resto do site escreve.
    const expected = `https://calculadorasculinarias.com.br${
      target.path === '/' ? '' : target.path
    }`;

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');
    expect(canonical).toBe(expected);
    expect(await meta(page, 'meta[property="og:url"]')).toBe(expected);

    // Cada página aponta para as duas versões e para o padrão do domínio.
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);
  });

  test(`${target.path} tem imagem de compartilhamento servida como PNG`, async ({
    page,
    request,
  }) => {
    await page.goto(target.path);
    const image = await meta(page, 'meta[property="og:image"]');
    expect(image).toContain(`/og/${target.key}-`);

    // O que quebra card de rede social não é a tag, é o arquivo: caminho sem
    // extensão volta como binário genérico e o Facebook não mostra nada.
    const response = await request.get(new URL(image).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test(`${target.path} publica JSON-LD válido`, async ({ page }) => {
    await page.goto(target.path);

    const raw = await page.locator('script[type="application/ld+json"]').innerText();
    const data = JSON.parse(raw) as {
      '@graph': { '@type': string; mainEntity?: unknown[] }[];
    };

    const types = data['@graph'].map((node) => node['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('FAQPage');
    expect(types).toContain(target.key === 'home' ? 'WebSite' : 'WebApplication');

    const faq = data['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faq?.mainEntity?.length).toBeGreaterThanOrEqual(3);
  });
}

test('as perguntas frequentes estão no HTML, não atrás de um clique', async ({
  page,
}) => {
  await page.goto('/paes');

  // Conteúdo dobrado atrás de JavaScript é conteúdo que buscador e assistente
  // podem não ler; a FAQ é justamente o que eles citam.
  await expect(
    page.getByRole('heading', { name: 'O que é porcentagem de padeiro?' }),
  ).toBeVisible();
});

test('robots libera o site e aponta o sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain('Sitemap: https://calculadorasculinarias.com.br/sitemap.xml');
  expect(body).toContain('GPTBot');
  expect(body).toContain('ClaudeBot');
  expect(body).not.toContain('Disallow: /');
});

test('o sitemap lista as dez páginas com os idiomas cruzados', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body.match(/<url>/g)).toHaveLength(PAGES.length);
  for (const target of PAGES) {
    const suffix = target.path === '/' ? '' : target.path;
    expect(body).toContain(`<loc>https://calculadorasculinarias.com.br${suffix}</loc>`);
  }
  expect(body).toContain('hreflang="x-default"');
});

test('llms.txt descreve o site para quem lê por máquina', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');

  const body = await response.text();
  expect(body).toContain('# Calculadoras Culinárias');
  for (const path of ['/paes', '/picles', '/massas', '/gelato', '/en/bread']) {
    expect(body, path).toContain(`https://calculadorasculinarias.com.br${path}`);
  }
  // A bibliografia é o argumento do site: ela precisa estar aqui.
  expect(body).toContain('The Larousse Book of Bread');
  expect(body).toContain('material de curso');
});
