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
    // Escopo na tela: a folha de impressão repete o aviso, e é para repetir.
    () =>
      expect(
        page.locator('#conteudo').getByText('Fora do limite das fontes'),
      ).toBeVisible(),
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

  // Escopado na seção do conversor: a página tem outros `aria-live` agora
  // (o guia de fermentação trouxe dois), e "o único" envelheceu.
  const result = page
    .locator('section')
    .filter({ hasText: 'Conversor de fermento' })
    .locator('p[aria-live="polite"]')
    .first();

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

/**
 * Os pães do Levante (docs/research/paes-regionais.md).
 *
 * O que estes testes protegem não é a existência do preset — disso o teste de
 * unidade já cuida. É o comportamento que a pesquisa comprou com dificuldade: na
 * farinha que o próprio livro usa, a tela precisa devolver as gramas que o livro
 * imprime; a pita salga acima da faixa europeia e **tem** de sinalizar isso sem
 * ser acusada de erro; e o malawach não pode aparecer com a manteiga de
 * laminação dentro da massa.
 */
async function escolhePao(page: Page, nome: string) {
  await interactUntil(
    async () => {
      await page.getByRole('button', { name: nome, exact: true }).click();
    },
    async () => {
      await expect(
        page.getByRole('button', { name: nome, exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
    },
  );
}

test('a pita devolve as gramas impressas no livro e salga acima da faixa europeia', async ({
  page,
}) => {
  await page.goto('/paes');
  await escolhePao(page, 'Pita de frigideira');

  // Scheft, p. 116: 550 g de farinha, 335 g de água, 15 g de sal.
  await interactUntil(
    () => page.getByLabel('Gramas de farinha que você tem').fill('550'),
    () => expect(waterRow(page)).toContainText('335,0 g'),
  );

  const conteudo = page.locator('#conteudo');
  await expect(
    page.getByRole('row').filter({ hasText: 'Sal' }).first(),
  ).toContainText('15,0 g');

  // 2,73% de sal é acima do usual europeu, e o selo diz isso.
  await expect(conteudo.getByText('Acima da faixa').first()).toBeVisible();

  // Mas não "fora do limite das fontes": Scheft é a fonte.
  await expect(conteudo.getByText('Fora do limite das fontes')).toHaveCount(0);
});

test('o malawach não traz a manteiga que só lamina', async ({ page }) => {
  await page.goto('/paes');
  await escolhePao(page, 'Malawach');

  // Scheft, p. 145: 1 kg de farinha, 630 g de água, 4 g de fermento químico.
  await interactUntil(
    () => page.getByLabel('Gramas de farinha que você tem').fill('1000'),
    () => expect(waterRow(page)).toContainText('630,0 g'),
  );

  const tabela = page.getByRole('table').first();
  await expect(tabela).not.toContainText('Manteiga');
  await expect(tabela).toContainText('Fermento químico');

  // E o texto explica onde a manteiga foi parar.
  await expect(
    page.locator('#conteudo').getByText(/manteiga.*lamina/i).first(),
  ).toBeVisible();
});
