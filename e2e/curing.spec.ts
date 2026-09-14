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

test('o sal nº 2 mostra a soma na moeda da norma, sem selo de conformidade', async ({
  page,
}) => {
  await page.goto('/cura');

  const content = page.locator('#conteudo');

  // O nº 1 não leva nitrato: a linha da soma não teria o que dizer.
  await expect(content.getByText('Soma, como nitrito de sódio')).toHaveCount(0);

  await expect(async () => {
    await page.getByRole('button', { name: /nº 2|#2/i }).click();
    await expect(content.getByText('Soma, como nitrito de sódio')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // No alvo padrão de 150 ppm, o nº 2 traz 96 ppm de nitrato junto, e a soma
  // na moeda da norma dá 228 — número que ninguém adivinha de cabeça, e é
  // exatamente por isso que vale mostrá-lo.
  // `exact` porque a prosa da seção de limites repete os mesmos números — o
  // que é proposital: o texto explica exatamente o caso que a tela mostra.
  await expect(content.getByText('96 ppm', { exact: true })).toBeVisible();
  await expect(content.getByText('228 ppm', { exact: true })).toBeVisible();

  // E a trava que importa: passar dos 150 ppm brasileiros não vira reprovação,
  // porque aquilo é resíduo e isto é entrada.
  await expect(page.getByText('Dentro da faixa')).toBeVisible();
});

test('a página explica como a soma é feita, e com que massas molares', async ({
  page,
}) => {
  await page.goto('/cura');

  await expect(
    page.getByRole('heading', { name: 'Como a soma é feita' }),
  ).toBeVisible();
  await expect(page.getByText(/dividida? por 1,231|dividir o nitrato por 1,231|divida o nitrato por 1,231/i).first()).toBeVisible();
  await expect(page.getByText(/84,99/)).toBeVisible();

  // E o terceiro teto, que a pesquisa não tinha.
  await expect(page.getByText(/300 ppm para nitrato sozinho/)).toBeVisible();
});
