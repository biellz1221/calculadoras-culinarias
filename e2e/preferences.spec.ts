import { expect, test, type Page } from '@playwright/test';

/** Abre o modal de configurações e escolhe uma opção. */
async function choose(page: Page, option: string) {
  await expect(async () => {
    await page.getByRole('button', { name: 'Configurações' }).click();
    await expect(page.getByRole('button', { name: option })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await page.getByRole('button', { name: option }).click();
  await page.getByRole('button', { name: 'Pronto' }).click();
}

test('a escolha de unidades muda os números e sobrevive ao recarregar', async ({
  page,
}) => {
  await page.goto('/paes');

  const waterRow = page.getByRole('row').filter({ hasText: 'Água' }).first();
  await expect(waterRow).toContainText('300,0 g');

  await choose(page, 'Onças e libras');

  // 300 g de água viram 10,58 oz.
  await expect(waterRow).toContainText('10,58 oz');

  await page.reload();
  await expect(
    page.getByRole('row').filter({ hasText: 'Água' }).first(),
  ).toContainText('10,58 oz');
});

test('a escolha de temperatura converte a faixa de fermentação', async ({ page }) => {
  await page.goto('/picles');

  // Escopo na tela: a folha de impressão traz a mesma faixa, na mesma unidade.
  const screenOnly = page.locator('#conteudo');

  await expect(screenOnly.getByText('10–21 °C')).toBeVisible();

  await choose(page, 'Fahrenheit');

  await expect(screenOnly.getByText('50–70 °F')).toBeVisible();
});

test('a interface simplificada recolhe as explicações', async ({ page }) => {
  await page.goto('/paes');

  const glossary = page.getByRole('heading', { name: 'Glossário' });
  await expect(glossary).toBeVisible();

  await expect(async () => {
    await page.getByRole('button', { name: /interface simplificada/i }).click();
    // Recolhido, e não removido: o conteúdo vira um bloco que abre num clique.
    await expect(page.locator('details').filter({ hasText: 'Glossário' })).toHaveCount(1);
  }).toPass({ timeout: 15_000 });
});

test('cada calculadora tem a sua própria paleta', async ({ page }) => {
  const accents = new Map<string, string>();

  for (const path of ['/paes', '/picles', '/massas', '/gelato']) {
    await page.goto(path);
    const accent = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-calculator]') as Element)
        .getPropertyValue('--color-accent')
        .trim(),
    );
    accents.set(path, accent);
  }

  expect(new Set(accents.values()).size).toBe(4);
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
