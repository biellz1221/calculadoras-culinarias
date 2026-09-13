import { expect, test } from '@playwright/test';

/**
 * Geleias: o que esta página faz e nenhum dos livros faz.
 *
 * A aritmética do açúcar os unitários já conferem contra as receitas do Blue
 * Chair. Aqui o alvo é o que só se vê na tela: que a altitude muda o ponto de
 * gelificação, que a proporção muda com a fruta, e que reduzir o açúcar abaixo
 * da fonte carrega o aviso junto.
 */

test('a home leva à calculadora de geleias', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /abrir a calculadora de geleias/i }).click();
  await expect(page).toHaveURL(/\/geleias$/);
});

test('1 kg de morango pede os 645 g de açúcar da receita citada', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await expect(page.locator('#conteudo').getByText('645 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('cada fruta traz a proporção da própria receita', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await page.getByRole('button', { name: 'Framboesa' }).click();
    // My Raspberry Jam, p. 234: um a um, e a única sem limão do conjunto.
    await expect(page.locator('#conteudo').getByText('1 kg').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.getByText('A receita não leva limão')).toBeVisible();

  // Damasco, p. 168, é a de menos açúcar do livro: 0,42 contra 1,00.
  await page.getByRole('button', { name: 'Damasco' }).click();
  await expect(page.locator('#conteudo').getByText('417 g').first()).toBeVisible();
});

test('a altitude muda o ponto de gelificação', async ({ page }) => {
  await page.goto('/geleias');

  // Nível do mar: 220 °F, que são os 104,4 °C dos dois livros.
  await expect(page.locator('#conteudo').getByText('104,4 °C').first()).toBeVisible();

  await expect(async () => {
    // Brasília, 1.172 m. Cozinhar até 105 °C aqui passaria cinco graus.
    await page.getByLabel('Altitude (m)').fill('1172');
    await expect(page.locator('#conteudo').getByText('100,2 °C').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // E o banho-maria sobe de 5 para 10 minutos, pelo mesmo motivo físico.
  await expect(page.locator('#conteudo').getByText('10 min').first()).toBeVisible();
});

test('reduzir o açúcar abaixo da fonte carrega o aviso', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByRole('button', { name: 'Escolher' }).click();
    await page.getByLabel('Açúcar sobre a fruta (%)').fill('30');
    await expect(page.getByText('Abaixo da fonte')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(
    page.locator('#conteudo').getByText(/doce de geladeira/).first(),
  ).toBeVisible();
});

test('a tabela por altitude fica na página, fora da parte explicativa', async ({
  page,
}) => {
  await page.goto('/geleias');

  // É a razão de ser da página: não pode sumir na interface simplificada.
  await expect(
    page.getByRole('heading', { name: 'O ponto, na sua altitude' }),
  ).toBeVisible();
  await expect(page.locator('#conteudo').getByText('220').first()).toBeVisible();
});

test('a versão em inglês responde em /en/jam', async ({ page }) => {
  await page.goto('/en/jam');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('altitude');
});
