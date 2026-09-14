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
    // Exato: a âncora do verbete no glossário tem `aria-label` que contém
    // o nome do campo, e a busca por trecho pegaria as duas.
    () => page.getByLabel('Densidade da calda', { exact: true }).fill('1.2'),
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

  // O balanceamento continua sem obra publicada por trás — é a planilha do
  // curso. O ar e o peso de um litro, que a planilha não cobre, ganharam livro
  // em setembro de 2026, e a chamada diz as duas coisas.
  await expect(
    page.getByText(/não se apoia em obra publicada/),
  ).toBeVisible();
  await expect(page.getByText(/Clarke pela química do sorvete/)).toBeVisible();
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

test('a régua de bancada do overrun está na página, fora da parte explicativa', async ({
  page,
}) => {
  await page.goto('/gelato');

  // Era a única parte desta página sem fonte; não pode sumir na interface
  // simplificada.
  await expect(
    page.getByRole('heading', { name: 'O ar, e o peso de um litro' }),
  ).toBeVisible();

  // O exemplo de bancada de Corvitto, já preenchido: 270 g de mix para 200 g
  // de gelato dão 35%.
  await expect(page.getByText('35%').first()).toBeVisible();
  await expect(page.getByText('Dentro da faixa de Corvitto')).toBeVisible();
});

test('medir menos ar do que a faixa dispara o aviso certo', async ({ page }) => {
  await page.goto('/gelato');

  await expect(async () => {
    // Mesmo copo, quase o mesmo peso: quase nenhum ar entrou.
    await page.getByLabel('Peso do copo com mix').fill('210');
    await expect(page.getByText('Abaixo da faixa de Corvitto')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(async () => {
    // O dobro do peso: 100% de overrun, que é sorvete industrial, não gelato.
    await page.getByLabel('Peso do copo com mix').fill('400');
    await expect(page.getByText('Acima da faixa de Corvitto')).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('o caminho inverso dá o peso que um litro deveria ter', async ({ page }) => {
  await page.goto('/gelato');

  const content = page.locator('#conteudo');

  // 1,10 g/mL de Clarke a 35% de overrun: 815 g por litro.
  await expect(content.getByText('815 g').first()).toBeVisible();

  await expect(async () => {
    // Com a densidade que a aritmética de Corvitto pressupõe, 741 g.
    await page.getByLabel('Densidade da sua calda').fill('1');
    await expect(content.getByText('741 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('a divergência de densidade aparece com os dois números', async ({ page }) => {
  await page.goto('/gelato');

  await expect(
    page.getByRole('heading', { name: 'Onde as duas obras discordam' }),
  ).toBeVisible();

  const content = page.locator('#conteudo');
  await expect(content.getByText(/Clarke · 1,10/)).toBeVisible();
  await expect(content.getByText(/Corvitto · 1,00/)).toBeVisible();
});

test('a versão em inglês traz a mesma régua', async ({ page }) => {
  await page.goto('/en/gelato');

  await expect(
    page.getByRole('heading', { name: 'The air, and what a litre weighs' }),
  ).toBeVisible();
  await expect(page.getByText('Inside Corvitto’s band')).toBeVisible();
});
