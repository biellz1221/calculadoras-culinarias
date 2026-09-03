import { expect, test, type Page } from '@playwright/test';

/** A página hidrata depois de servida; repete a interação até ela pegar. */
async function interactUntil(
  action: () => Promise<void>,
  assertion: () => Promise<void>,
) {
  await expect(async () => {
    await action();
    await assertion();
  }).toPass({ timeout: 15_000 });
}

function metric(page: Page, name: string) {
  return page.getByRole('heading', { name }).locator('..').locator('[data-numeric]');
}

test('a home leva à calculadora de picles', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('link', { name: /abrir a calculadora de picles e fermentação/i })
    .click();

  await expect(page).toHaveURL(/\/picles$/);
});

test('calcula os 40 g de sal do exemplo do Noma', async ({ page }) => {
  await page.goto('/picles');

  await interactUntil(
    async () => {
      await page.getByLabel('Vegetais (g)').fill('1000');
      await page.getByLabel('Água (g)').fill('1000');
      await page.getByLabel('Sal (%)').fill('2');
    },
    () => expect(page.getByText('40,0 g')).toBeVisible(),
  );
});

test('mostra a mesma salmoura nas duas bases de cálculo', async ({ page }) => {
  await page.goto('/picles');

  await interactUntil(
    async () => {
      await page.getByLabel('Vegetais (g)').fill('1000');
      await page.getByLabel('Água (g)').fill('1000');
      await page.getByLabel('Sal (%)').fill('2');
    },
    async () => {
      await expect(metric(page, 'Sal sobre o pote')).toHaveText('2%');
      await expect(metric(page, 'Sal sobre a água')).toHaveText('4%');
    },
  );
});

test('avisa quando o sal fica abaixo do mínimo seguro', async ({ page }) => {
  await page.goto('/picles');

  await interactUntil(
    // Campo numérico do HTML usa ponto no valor, mesmo exibindo vírgula ao usuário.
    () => page.getByLabel('Sal (%)').fill('0.8'),
    () => expect(page.getByText('Abaixo do mínimo seguro').first()).toBeVisible(),
  );
});

test('recusa vinagre fraco demais no picles de vinagre', async ({ page }) => {
  await page.goto('/picles');

  await interactUntil(
    async () => {
      await page.getByRole('button', { name: 'Picles de vinagre' }).click();
      await page.getByLabel('Acidez do seu vinagre (%)').fill('2');
    },
    () => expect(page.getByText('Este vinagre não serve')).toBeVisible(),
  );
});

test('a segurança alimentar aparece sem precisar de clique', async ({ page }) => {
  await page.goto('/picles');

  await expect(page.getByText('Antes de fechar o pote')).toBeVisible();
  await expect(page.getByText('O alvo é pH abaixo de 4,6')).toBeVisible();
});

test('a versão em inglês responde em /en/pickles', async ({ page }) => {
  await page.goto('/en/pickles');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('salt');
});

test('a página de picles não rola horizontalmente no celular', async ({ page }) => {
  await page.goto('/picles');

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});
