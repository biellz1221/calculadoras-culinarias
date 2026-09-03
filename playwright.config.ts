import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

// Precisa ser `localhost`, e não 127.0.0.1: o dev server do Next bloqueia
// recursos de /_next vindos de outra origem, e sem eles a página carrega mas
// nunca hidrata — o que faz todo teste de interação falhar por engano.
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    // O navegador precisa dizer que fala português: a raiz do site detecta o
    // idioma e, com um navegador em inglês, mandaria todo teste para /en.
    locale: 'pt-BR',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // NFR-006: toda calculadora precisa ser utilizável em viewport pequeno.
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: `pnpm exec next dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
