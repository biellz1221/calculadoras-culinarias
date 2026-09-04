import { expect, test } from '@playwright/test';

import { BUILD_URL } from '../playwright.config';

/**
 * PWA e offline (FR-043), contra o build de produção.
 *
 * Estes são os únicos testes que não rodam contra o `next dev`: o service
 * worker não se registra em desenvolvimento de propósito, então o único jeito
 * de verificar o critério — "fico offline e a calculadora ainda calcula" — é
 * servir o `out/` de verdade. É também o tipo de coisa que ninguém descobre
 * sem testar: um PWA quebrado parece perfeito enquanto houver rede.
 */

test.use({ baseURL: BUILD_URL });

/** O worker registra depois do load; esperar por ele evita teste instável. */
async function waitForServiceWorker(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 20_000,
  });
}

test('o manifesto descreve o aplicativo em cada idioma', async ({ request }) => {
  const pt = await request.get(`${BUILD_URL}/manifest.webmanifest`);
  expect(pt.ok()).toBe(true);

  const ptManifest = await pt.json();
  expect(ptManifest.name).toBe('Calculadoras Culinárias');
  expect(ptManifest.start_url).toBe('/');
  expect(ptManifest.lang).toBe('pt-BR');
  expect(ptManifest.display).toBe('standalone');

  const en = await request.get(`${BUILD_URL}/en/manifest.webmanifest`);
  const enManifest = await en.json();
  expect(enManifest.name).toBe('Culinary Calculators');
  // Instalado pelo inglês, o aplicativo abre em inglês.
  expect(enManifest.start_url).toBe('/en');
  expect(enManifest.lang).toBe('en');

  // Nome curto cabe embaixo do ícone: o que passa disso vira reticências.
  for (const manifest of [ptManifest, enManifest]) {
    expect(manifest.short_name.length).toBeLessThanOrEqual(12);
  }
});

test('os ícones existem e são PNG de verdade', async ({ request }) => {
  for (const variant of ['192', '512', '512-maskable']) {
    const response = await request.get(`${BUILD_URL}/icon/${variant}/image.png`);

    expect(response.ok(), variant).toBe(true);
    // A lição do cartão de compartilhamento: sem `Content-Type` de imagem, o
    // ícone não aparece na tela de início de ninguém.
    expect(response.headers()['content-type'], variant).toContain('image/png');
  }
});

test('cada página aponta para o manifesto do próprio idioma', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/manifest.webmanifest',
  );

  await page.goto('/en');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/en/manifest.webmanifest',
  );
});

test('a calculadora visitada continua calculando offline', async ({ page, context }) => {
  await page.goto('/paes');
  await waitForServiceWorker(page);

  // Segunda visita com o worker no comando: é aqui que a página entra no cache.
  await page.reload();
  await expect(page.getByLabel('Gramas de farinha que você tem')).toBeVisible();

  await context.setOffline(true);
  await page.reload();

  // Não basta carregar: precisa hidratar e recalcular. Uma página que abre
  // offline e não responde ao campo não serve para nada na cozinha.
  await expect(page.getByLabel('Gramas de farinha que você tem')).toBeVisible();
  await page.getByLabel('Gramas de farinha que você tem').fill('800');

  await expect(
    page.locator('#conteudo').getByRole('row').filter({ hasText: 'Água' }).first(),
  ).toContainText('480,0 g');

  await context.setOffline(false);
});

test('o service worker não guarda o que robô precisa ler fresco', async ({ page }) => {
  await page.goto('/');
  await waitForServiceWorker(page);

  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const keys = await Promise.all(
      names.map(async (name) => {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        return requests.map((request) => new URL(request.url).pathname);
      }),
    );
    return keys.flat();
  });

  expect(cached).not.toContain('/robots.txt');
  expect(cached).not.toContain('/sitemap.xml');
  expect(cached).not.toContain('/llms.txt');
});
