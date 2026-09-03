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

function row(page: Page, ingredient: string) {
  return page.getByRole('row').filter({ hasText: ingredient }).first();
}

function amount(page: Page, ingredient: string) {
  return row(page, ingredient).getByRole('spinbutton');
}

test('abre com a receita de partida reescalada para o lote', async ({ page }) => {
  await page.goto('/gelato');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelato');
  // Fior di latte em 1 L a 1,10 g/mL: 1100 g de calda, proporções preservadas.
  await expect(amount(page, 'Leite integral')).toHaveValue('733.3');
  await expect(page.getByRole('row').filter({ hasText: 'Total' })).toContainText(
    '1.100,0 g',
  );
});

test('a receita de partida fecha dentro das faixas do tipo de base', async ({ page }) => {
  await page.goto('/gelato');

  await expect(page.getByText('Equilibrada')).toBeVisible();
  await expect(page.getByText('Na faixa').first()).toBeVisible();
});

test('mudar o lote reescala a receita e troca a unidade em kg', async ({ page }) => {
  await page.goto('/gelato');

  await interactUntil(
    () => page.getByRole('button', { name: '4 L', exact: true }).click(),
    // Acima de 2 L a apresentação passa para quilos: 2933,2 g viram 2,933 kg.
    () => expect(amount(page, 'Leite integral')).toHaveValue('2.933'),
  );

  await expect(page.getByRole('columnheader', { name: /Quantidade \(kg\)/ })).toBeVisible();
});

test('a densidade muda a massa da calda do lote', async ({ page }) => {
  await page.goto('/gelato');

  await interactUntil(
    () => page.getByLabel('Densidade da calda').fill('1.2'),
    () => expect(page.getByText('1.200,0 g').first()).toBeVisible(),
  );
});

test('equilibra automaticamente depois de uma edição manual', async ({ page }) => {
  await page.goto('/gelato');

  await interactUntil(
    () => amount(page, 'Açúcar sacarose').fill('60'),
    () => expect(page.getByText(/fora da faixa/).first()).toBeVisible(),
  );

  await page.getByRole('button', { name: 'Equilibrar automaticamente' }).click();

  // Mantém fixa a linha editada e conserta o resto.
  await expect(page.getByText(/as oito métricas voltaram/)).toBeVisible();
  await expect(amount(page, 'Açúcar sacarose')).toHaveValue('60');
});

test('quando não dá para equilibrar, diz o que continuou fora', async ({ page }) => {
  await page.goto('/gelato');

  // Uma base de leite medida pela régua do sorbet não tem como fechar: o
  // otimizador não consegue tirar os sólidos do leite mexendo só nas quantidades.
  await interactUntil(
    () => page.getByRole('button', { name: 'Sorbet', exact: true }).click(),
    () => expect(page.getByRole('button', { name: 'Equilibrar automaticamente' })).toBeEnabled(),
  );

  await page.getByRole('button', { name: 'Equilibrar automaticamente' }).click();

  await expect(page.getByText(/Continuam fora da faixa/)).toBeVisible();
});

test('busca sem acento e acrescenta o ingrediente', async ({ page }) => {
  await page.goto('/gelato');

  await interactUntil(
    async () => {
      await page.getByLabel('Buscar ingrediente').fill('morango');
      await page.getByLabel('Buscar ingrediente').press('Enter');
    },
    () => expect(amount(page, 'Morango')).toHaveValue('100'),
  );
});

test('avisa quando a receita usa ingrediente de composição inconsistente', async ({
  page,
}) => {
  await page.goto('/gelato');

  await interactUntil(
    async () => {
      await page.getByLabel('Buscar ingrediente').fill('pacoca');
      await page.getByLabel('Buscar ingrediente').press('Enter');
    },
    () =>
      expect(
        page.getByText('Ingredientes com composição inconsistente na planilha'),
      ).toBeVisible(),
  );

  await expect(page.getByText('Muda o resultado')).toBeVisible();
  await expect(page.getByText(/Sólidos e água somam zero/)).toBeVisible();
});

test('mostra a estimativa nutricional como orientação, não rotulagem', async ({ page }) => {
  await page.goto('/gelato');

  await expect(
    page.getByRole('heading', { name: 'Estimativa nutricional' }),
  ).toBeVisible();
  await expect(page.getByText(/não é rotulagem/)).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'Energia' })).toContainText('kcal');
});

test('a seção de fontes diz que não há obra publicada por trás', async ({ page }) => {
  await page.goto('/gelato');

  await expect(
    page.getByText(/única calculadora do site que não se apoia em obra publicada/),
  ).toBeVisible();
});

test('a versão em inglês responde em /en/gelato', async ({ page }) => {
  await page.goto('/en/gelato');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelato');
  // Formatação por idioma: ponto decimal, não vírgula.
  await expect(page.getByRole('row').filter({ hasText: 'Total' })).toContainText(
    '1,100.0 g',
  );
  await expect(page.getByRole('row').filter({ hasText: 'Whole milk' })).toBeVisible();
});

test('a página de gelato não rola horizontalmente em 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 720 });
  await page.goto('/gelato');

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});
