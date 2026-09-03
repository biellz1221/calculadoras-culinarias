import { expect, test, type Page } from '@playwright/test';

/**
 * A página é servida estática e só depois hidrata. Digitar antes disso faz o
 * React descartar o valor na hidratação, então a interação é repetida até
 * pegar — é a diferença entre um teste honesto e um teste intermitente.
 */
async function interactUntil(
  action: () => Promise<void>,
  assertion: () => Promise<void>,
) {
  await expect(async () => {
    await action();
    await assertion();
  }).toPass({ timeout: 15_000 });
}

function waterRow(page: Page) {
  return page.getByRole('row').filter({ hasText: 'Água' }).first();
}

test('a home leva à calculadora de pães', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /abrir a calculadora de pães/i }).click();

  await expect(page).toHaveURL(/\/paes$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pão');
});

test('abre com a receita publicada na fonte', async ({ page }) => {
  await page.goto('/paes');

  // Pão francês do Camargo: 500 g de farinha e 60% de hidratação.
  await expect(waterRow(page)).toContainText('300,0 g');
});

test('calcula a receita a partir da farinha informada', async ({ page }) => {
  await page.goto('/paes');

  await interactUntil(
    () => page.getByLabel('Gramas de farinha que você tem').fill('1000'),
    () => expect(waterRow(page)).toContainText('600,0 g'),
  );
});

test('editar a porcentagem recalcula e sinaliza a faixa', async ({ page }) => {
  await page.goto('/paes');

  await interactUntil(
    () => waterRow(page).getByRole('spinbutton').fill('95'),
    () => expect(page.getByText('Fora do limite das fontes')).toBeVisible(),
  );
});

test('a versão em inglês responde em /en/bread', async ({ page }) => {
  await page.goto('/en/bread');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bread');
  // Formatação por idioma: ponto decimal, não vírgula.
  await expect(page.getByRole('row').filter({ hasText: 'Water' }).first()).toContainText(
    '300.0 g',
  );
});

test('o conversor de fermento converte fresco para instantâneo', async ({ page }) => {
  await page.goto('/paes');

  // O resultado é o único parágrafo com aria-live da página.
  const result = page.locator('p[aria-live="polite"]');

  await interactUntil(
    () => page.getByLabel('Quantidade').fill('15'),
    // 15 g de fresco viram 5 g de instantâneo (fator de 1/3, Camargo).
    () => expect(result).toContainText('5,0 g'),
  );
});

test('a página de pães não rola horizontalmente no celular', async ({ page }) => {
  await page.goto('/paes');

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});
