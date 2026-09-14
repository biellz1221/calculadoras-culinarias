import { expect, test, type Page } from '@playwright/test';

/**
 * A calculadora de gelificantes (docs/research/gelificantes.md).
 *
 * O que estes testes protegem é a promessa da página: na quantidade de líquido
 * da fonte, a tela devolve a grama da fonte — e a conversão de Bloom, que é a
 * razão de existir da calculadora, reproduz a conta que o livro publica.
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

function agentRow(page: Page, name: string) {
  return page.getByRole('row').filter({ hasText: name }).first();
}

test('a home leva à calculadora de gelificantes', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /gelificantes/i }).first().click();

  await expect(page).toHaveURL(/\/gelificantes$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelatina');
});

test('devolve a gelatina da panna cotta do livro', async ({ page }) => {
  await page.goto('/gelificantes');

  // 530 g de líquido a 0,8% dão 4,24 g — a receita da fonte imprime 4,3 g.
  await interactUntil(
    () => page.getByLabel('Líquido').fill('530'),
    () => expect(agentRow(page, 'Gelatina')).toContainText('4,24 g'),
  );

  await expect(agentRow(page, 'Gelatina')).toContainText('0,8%');
});

test('a conversão de Bloom muda o peso e conta as folhas', async ({ page }) => {
  await page.goto('/gelificantes');

  await interactUntil(
    () => page.getByLabel('Líquido').fill('500'),
    // 500 g a 0,8% = 4 g de pó Knox.
    () => expect(page.getByText('4,00 g').first()).toBeVisible(),
  );

  // Trocando para folha ouro (Bloom nominal 205): 4 × 225 ÷ 205 = 4,39 g,
  // que a 2 g por folha dão 2,2 folhas.
  await interactUntil(
    async () => {
      await page.getByRole('button', { name: 'Ouro', exact: true }).click();
    },
    async () => {
      await expect(page.getByText('4,39 g').first()).toBeVisible();
    },
  );

  await expect(page.getByText(/2,2\s*folhas/)).toBeVisible();
});

test('a xantana aparece como espessante, não como gelificante', async ({ page }) => {
  await page.goto('/gelificantes');

  await interactUntil(
    async () => {
      await page.getByRole('button', { name: 'Molho', exact: true }).click();
    },
    async () => {
      await expect(agentRow(page, 'Goma xantana')).toContainText('Só engrossa');
    },
  );

  await expect(agentRow(page, 'Ágar-ágar')).toContainText('Gelifica');
});

test('a esferificação aparece como lacuna declarada, não some', async ({ page }) => {
  await page.goto('/gelificantes');

  await expect(
    page.locator('#conteudo').getByText(/Esferificação fica de fora/i).first(),
  ).toBeVisible();
});

test('a versão em inglês responde em /en/gelling', async ({ page }) => {
  await page.goto('/en/gelling');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelatin');
});
