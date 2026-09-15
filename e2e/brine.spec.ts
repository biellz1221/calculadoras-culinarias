import { expect, test, type Page } from '@playwright/test';

/**
 * A ferramenta principal da página.
 *
 * Os mesmos controles existem duas vezes desde que a página ganhou o painel de
 * "confira a sua receita", e é assim que tem de ser: o nome de uma textura ou
 * de um método é o mesmo nos dois lugares. Quem desempata é a região.
 */
const TOOL = 'Calculadora de salmoura';

function tool(page: Page) {
  return page.getByRole('region', { name: TOOL });
}

/**
 * Salmoura: a calculadora que existe porque a fonte dá a dose em colher de uma
 * marca americana.
 *
 * Os testes aqui vigiam o que só se vê na tela: que a resposta sai em grama,
 * que a colher aparece como conferência e não como resposta, e que o aviso de
 * equilíbrio muda com o método — que é a única coisa desta página capaz de
 * estragar uma peça inteira.
 */

test('a home leva à calculadora de salmoura', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: /abrir a calculadora de salmoura e salga/i })
    .click();
  await expect(page).toHaveURL(/\/salmoura$/);
});

test('1 kg de carne na salga seca pede 6,3 g de sal', async ({ page }) => {
  await page.goto('/salmoura');

  await expect(async () => {
    await page.getByLabel('Peso da proteína (g)').fill('1000');
    await expect(page.locator('#conteudo').getByText('6,3 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('reproduz a salmoura de ave do Modernist', async ({ page }) => {
  await page.goto('/salmoura');

  await expect(async () => {
    await page.getByLabel('Peso da proteína (g)').fill('2000');
    await tool(page).getByRole('button', { name: 'Equilíbrio, ave' }).click();
    // 12 g de sal e 200 g de água para 2 kg de frango.
    await expect(page.locator('#conteudo').getByText('12 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.locator('#conteudo').getByText('200 g').first()).toBeVisible();
});

test('o aviso muda entre equilíbrio e relógio', async ({ page }) => {
  await page.goto('/salmoura');

  // Salga seca é de equilíbrio: dá para esquecer na geladeira.
  await expect(page.getByRole('heading', { name: 'De equilíbrio' })).toBeVisible();

  await expect(async () => {
    await tool(page).getByRole('button', { name: 'Imersão, peixe' }).click();
    await expect(page.getByRole('heading', { name: 'Contada por tempo' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(
    page.locator('#conteudo').getByText(/o relógio é ingrediente/).first(),
  ).toBeVisible();
});

test('a colher aparece como conferência, e nas duas marcas', async ({ page }) => {
  await page.goto('/salmoura');

  await expect(page.getByText('A mesma dose em colher de chá')).toBeVisible();
  await expect(page.getByText('Diamond Crystal kosher')).toBeVisible();
  await expect(page.getByText('Morton kosher')).toBeVisible();
  await expect(
    page.locator('#conteudo').getByText(/A resposta é a grama/).first(),
  ).toBeVisible();
});

test('a medição do Food Lab fica na página, fora da parte explicativa', async ({
  page,
}) => {
  await page.goto('/salmoura');

  await expect(
    page.getByRole('heading', { name: 'A medição que decide a discussão' }),
  ).toBeVisible();
  await expect(page.locator('#conteudo').getByText('89,6%').first()).toBeVisible();
  await expect(page.locator('#conteudo').getByText('88,6%').first()).toBeVisible();
});

test('a versão em inglês responde em /en/brine', async ({ page }) => {
  await page.goto('/en/brine');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('grams');
});
