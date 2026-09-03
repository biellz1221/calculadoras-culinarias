import { expect, test } from '@playwright/test';

test('a escolha de unidades muda os números e sobrevive ao recarregar', async ({
  page,
}) => {
  await page.goto('/paes');

  const waterRow = page.getByRole('row').filter({ hasText: 'Água' }).first();
  await expect(waterRow).toContainText('300,0 g');

  await expect(async () => {
    await page.getByRole('button', { name: /unidades: on(ç|c)as/i }).click();
    // 300 g de água viram 10,58 oz.
    await expect(waterRow).toContainText('10,58 oz');
  }).toPass({ timeout: 15_000 });

  await page.reload();
  await expect(
    page.getByRole('row').filter({ hasText: 'Água' }).first(),
  ).toContainText('10,58 oz');
});

test('a escolha de temperatura converte a faixa de fermentação', async ({ page }) => {
  await page.goto('/picles');

  await expect(page.getByText('10–21 °C')).toBeVisible();

  await expect(async () => {
    await page.getByRole('button', { name: /temperatura: fahrenheit/i }).click();
    await expect(page.getByText('50–70 °F')).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('a farinha não tem porcentagem editável', async ({ page }) => {
  await page.goto('/paes');

  // A farinha é a base de 100%: editá-la produziria receita incoerente.
  const flourRow = page
    .getByRole('row')
    .filter({ hasText: 'Farinha de trigo branca' })
    .first();

  await expect(flourRow).toContainText('100%');
  await expect(flourRow.getByRole('spinbutton')).toHaveCount(0);

  // As outras linhas seguem editáveis.
  await expect(
    page.getByRole('row').filter({ hasText: 'Água' }).first().getByRole('spinbutton'),
  ).toHaveCount(1);
});

test('a raiz respeita o idioma guardado pelo visitante', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.setItem('cc:locale', 'en'));

  await page.goto('/');

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('um link direto em inglês não é redirecionado', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => window.localStorage.setItem('cc:locale', 'pt-BR'));

  await page.goto('/en/bread');

  // Quem recebeu um link em inglês abre o que foi enviado.
  await expect(page).toHaveURL(/\/en\/bread$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
