import { expect, test, type Page } from '@playwright/test';

/**
 * A ferramenta principal da página.
 *
 * Os mesmos controles existem duas vezes desde que a página ganhou o painel de
 * "confira a sua receita", e é assim que tem de ser: o nome de uma textura ou
 * de um método é o mesmo nos dois lugares. Quem desempata é a região.
 */
const TOOL = 'Calculadora de ganache';

function tool(page: Page) {
  return page.getByRole('region', { name: TOOL });
}

/**
 * Ganache: a calculadora que entrega um prazo de validade.
 *
 * A proporção qualquer receita dá. O que só está no Wybauw — e o que estes
 * testes vigiam — é que a proporção muda com a textura, que o branco pede
 * manteiga de cacau extra, e que a validade de três semanas não sai da tela.
 */

test('a home leva à calculadora de ganache', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /abrir a calculadora de ganache/i }).click();
  await expect(page).toHaveURL(/\/ganache$/);
});

test('100 g de creme para bombom moldado pedem 120 g de chocolate', async ({ page }) => {
  await page.goto('/ganache');

  await expect(async () => {
    await page.getByLabel('Creme (g)').fill('100');
    await expect(page.locator('#conteudo').getByText('120 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // E 14 g de manteiga, que é o que separa esta da de bico.
  await expect(page.locator('#conteudo').getByText('14 g').first()).toBeVisible();
});

test('a proporção muda com a textura', async ({ page }) => {
  await page.goto('/ganache');

  await expect(async () => {
    await page.getByLabel('Creme (g)').fill('100');
    await tool(page).getByRole('button', { name: 'Bola de trufa' }).click();
    // 110 de chocolate, e a única das quatro sem manteiga.
    await expect(page.locator('#conteudo').getByText('110 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.getByText('Esta textura não leva')).toBeVisible();

  // O praliné cortado é o único com faixa, e ela é da fonte.
  await tool(page).getByRole('button', { name: 'Praliné cortado' }).click();
  await expect(page.locator('#conteudo').getByText('130 g – 180 g').first()).toBeVisible();
});

test('o chocolate branco pede manteiga de cacau extra', async ({ page }) => {
  await page.goto('/ganache');

  // Escopado na região do resultado: a expressão também aparece na pergunta
  // frequente sobre chocolate branco, que fica no HTML desde o começo.
  const result = page.getByRole('region', { name: 'O que pesar' });
  const row = result.getByText('Manteiga de cacau extra');

  await expect(row).toHaveCount(0);

  await expect(async () => {
    await page.getByRole('button', { name: 'Branco' }).click();
    await expect(row).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('a validade fica na tela, e o aviso sobre congelar junto', async ({ page }) => {
  await page.goto('/ganache');

  await expect(
    page.getByRole('heading', { name: /Três semanas, e congelar não muda isso/ }).first(),
  ).toBeVisible();
  await expect(
    page.locator('#conteudo').getByText(/Freezing never extends shelf life/).first(),
  ).toBeVisible();
});

test('declara que tem uma fonte só', async ({ page }) => {
  await page.goto('/ganache');

  // Num site cujo argumento é mostrar divergência, isto precisa estar escrito.
  await expect(page.getByRole('heading', { name: 'Uma fonte só, e por quê' })).toBeVisible();
});

test('a versão em inglês responde em /en/ganache', async ({ page }) => {
  await page.goto('/en/ganache');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('texture');
});
