import { expect, test } from '@playwright/test';

test('a home responde em português na raiz', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('proporções');
});

test('a troca de idioma leva à mesma página em inglês', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('navigation', { name: /idioma/i }).getByText('EN').click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ratios');
});

test('a navegação em inglês continua em inglês', async ({ page }) => {
  await page.goto('/en');

  // O logo é o link mais provável de tirar alguém do idioma escolhido.
  await page.getByRole('banner').getByRole('link').first().click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('não há rolagem horizontal em tela pequena', async ({ page }) => {
  await page.goto('/');

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});

test('o link de pular para o conteúdo funciona pelo teclado', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');

  const focused = page.locator(':focus');
  await expect(focused).toHaveText(/pular para o conteúdo/i);
  await expect(focused).toBeVisible();
});
