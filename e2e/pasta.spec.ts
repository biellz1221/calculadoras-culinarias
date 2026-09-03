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

function flourRow(page: Page) {
  return page.getByRole('row').filter({ hasText: 'Farinha 00' }).first();
}

function eggRow(page: Page) {
  return page.getByRole('row').filter({ hasText: 'Ovo' }).first();
}

test('abre com a receita publicada na fonte', async ({ page }) => {
  await page.goto('/massas');

  // Zielonka: 300 g de farinha 00 e 3 ovos servem 4 pessoas.
  await expect(flourRow(page)).toContainText('300,0 g');
  await expect(eggRow(page)).toContainText('3 un');
});

test('escala pelo número de pessoas', async ({ page }) => {
  await page.goto('/massas');

  await interactUntil(
    () => page.getByLabel('Pessoas').fill('8'),
    () => expect(flourRow(page)).toContainText('600,0 g'),
  );
});

test('arredonda o ovo e mostra o ajuste de farinha', async ({ page }) => {
  await page.goto('/massas');

  await interactUntil(
    () => page.getByLabel('Pessoas').fill('6'),
    // A escala pediria 4,5 ovos; com 5 a farinha sobe 50 g.
    () => expect(page.getByText(/farinha sobe 50 g/)).toBeVisible(),
  );
});

test('ajusta a farinha ao peso real do ovo', async ({ page }) => {
  await page.goto('/massas');

  await interactUntil(
    // fill() em campo numérico usa ponto decimal, nunca vírgula.
    () => page.getByLabel('Peso de um ovo sem casca (g)').fill('60'),
    () => expect(flourRow(page)).toContainText('360,0 g'),
  );
});

test('sinaliza a porção fora da faixa das fontes', async ({ page }) => {
  await page.goto('/massas');

  await interactUntil(
    () => page.getByLabel('Massa por pessoa (g)').fill('200'),
    () => expect(page.getByText('Acima da faixa')).toBeVisible(),
  );
});

test('troca de massa e passa a medir hidratação', async ({ page }) => {
  await page.goto('/massas');

  await interactUntil(
    () => page.getByRole('button', { name: 'Sêmola e água (vegana)' }).click(),
    () => expect(page.getByRole('heading', { name: 'Hidratação' })).toBeVisible(),
  );

  await expect(page.getByText('46,4%')).toBeVisible();
});

test('traz o guia de formatos com as divergências marcadas', async ({ page }) => {
  await page.goto('/massas');

  await expect(
    page.getByRole('rowheader', { name: 'Lasanha', exact: true }),
  ).toBeVisible();
  // Lasanha e chitarra são os dois pontos em que os autores não param no mesmo
  // lugar; a marca é texto, não só cor.
  await expect(
    page.getByRole('row').filter({ hasText: 'As fontes divergem' }),
  ).toHaveCount(2);
});

test('a versão em inglês responde em /en/pasta', async ({ page }) => {
  await page.goto('/en/pasta');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('pasta');
  // Formatação por idioma: ponto decimal, não vírgula.
  await expect(
    page.getByRole('row').filter({ hasText: '00 flour' }).first(),
  ).toContainText('300.0 g');
});

test('a página de massas não rola horizontalmente no celular', async ({ page }) => {
  await page.goto('/massas');

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});
