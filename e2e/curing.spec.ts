import { expect, test } from '@playwright/test';

/**
 * Cura de carnes: a única calculadora do site em que o número errado machuca.
 *
 * Os testes aqui vigiam menos a aritmética, que os unitários cobrem contra as
 * fontes, e mais o que a página promete e recusa a prometer.
 */

test('a home leva à calculadora de cura', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /abrir a calculadora de cura/i }).click();
  await expect(page).toHaveURL(/\/cura$/);
});

test('calcula os 2,4 g de cura #1 por quilo a 150 ppm', async ({ page }) => {
  await page.goto('/cura');

  await expect(async () => {
    await page.getByLabel('Peso da carne (g)').fill('1000');
    await page.getByLabel('Nitrito de entrada (ppm)').fill('150');
    await expect(page.locator('#conteudo').getByText('2,4 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('o aviso de perigo aparece antes dos campos, sem precisar rolar', async ({
  page,
}) => {
  await page.goto('/cura');

  const aviso = page.getByText('Antes de qualquer coisa');
  await expect(aviso).toBeInViewport();
  await expect(page.getByText(/Clostridium botulinum/).first()).toBeVisible();
});

test('trata dose abaixo do piso como perigo, não como fora de faixa', async ({
  page,
}) => {
  await page.goto('/cura');

  await expect(async () => {
    await page.getByLabel('Nitrito de entrada (ppm)').fill('80');
    await expect(page.getByText('Abaixo do mínimo seguro')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // Escopo na tela: a folha de impressão leva o mesmo aviso, e é para levar.
  await expect(
    page.locator('#conteudo').getByText(/não cumpre a função que a justifica/),
  ).toBeVisible();
});

test('o teto muda com o método', async ({ page }) => {
  await page.goto('/cura');

  await expect(async () => {
    await page.getByLabel('Nitrito de entrada (ppm)').fill('300');
    await expect(page.getByText('Acima do teto do método')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // Cura seca aguenta 625 ppm: o sal fica na superfície e boa parte não entra.
  await page.getByRole('button', { name: 'Cura seca em peça inteira' }).click();
  await expect(page.getByText('Dentro da faixa')).toBeVisible();
});

test('não promete conformidade que não pode provar', async ({ page }) => {
  await page.goto('/cura');

  // A frase que separa esta calculadora das de charcutaria em inglês. Repare
  // que ela não nomeia a norma: a IN 211/2023 substituiu a RDC 272/2019 em
  // março de 2023, e um teste preso ao número de uma norma quebra junto com
  // ela — foi exatamente o que aconteceu aqui.
  await expect(
    page.locator('#conteudo').getByText(/não certifica conformidade com a norma brasileira/),
  ).toBeVisible();
  await expect(page.getByText(/150 mg\/kg/).first()).toBeVisible();
});

test('a versão em inglês responde em /en/curing', async ({ page }) => {
  await page.goto('/en/curing');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nitrite');
});
