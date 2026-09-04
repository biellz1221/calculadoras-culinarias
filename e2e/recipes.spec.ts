import { expect, test, type Page } from '@playwright/test';

/**
 * Salvar, compartilhar e imprimir (FR-040 a FR-042), no navegador de verdade.
 *
 * O que os testes de unidade não alcançam e aqui importa: o localStorage
 * sobrevivendo a um recarregamento, o `?r=` atravessando uma navegação real e o
 * CSS de impressão de fato escondendo a aplicação — que é regra de mídia e só
 * existe num navegador.
 */

/** A página hidrata depois de servida; repete a interação até ela pegar. */
async function interactUntil(
  action: () => Promise<void>,
  assertion: () => Promise<void>,
) {
  await expect(async () => {
    await action();
    await assertion();
  }).toPass({ timeout: 15_000 });
}

async function saveAs(page: Page, name: string) {
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await page.getByLabel('Nome da receita').fill(name);
  await page.getByRole('button', { name: 'Guardar' }).click();
}

test('guarda a receita e a reabre depois de recarregar', async ({ page }) => {
  await page.goto('/paes');

  await interactUntil(
    async () => {
      await page.getByLabel('Gramas de farinha que você tem').fill('850');
      await saveAs(page, 'Fornada de domingo');
    },
    () => expect(page.getByText('Receita guardada neste navegador.')).toBeVisible(),
  );

  await page.reload();

  await page.getByRole('button', { name: /Minhas receitas \(1\)/ }).click();
  await page.getByRole('button', { name: 'Abrir' }).click();

  await expect(page.getByLabel('Gramas de farinha que você tem')).toHaveValue('850');
});

test('o link compartilhado abre a mesma receita', async ({ page, context }) => {
  await page.goto('/paes');

  await interactUntil(
    () => page.getByLabel('Gramas de farinha que você tem').fill('1234'),
    () => expect(page.getByLabel('Gramas de farinha que você tem')).toHaveValue('1234'),
  );

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copiar link' }).click();
  await expect(page.getByText(/Link copiado/)).toBeVisible();

  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain('?r=');

  // Outra aba, sem nada guardado: a receita tem que vir inteira do endereço.
  const other = await context.newPage();
  await other.goto(new URL(link).pathname + new URL(link).search);

  await expect(other.getByLabel('Gramas de farinha que você tem')).toHaveValue('1234');
  await other.close();
});

test('link alterado no caminho avisa em vez de abrir calado', async ({ page }) => {
  await page.goto('/paes?r=isto-nao-e-uma-receita');

  await expect(page.getByText(/não pôde ser aberto/)).toBeVisible();
  // O padrão continua servido: a página não quebra por causa de um link ruim.
  await expect(page.getByLabel('Gramas de farinha que você tem')).toHaveValue('500');
});

test('a impressão deixa na folha só a receita', async ({ page }) => {
  await page.goto('/picles');

  await interactUntil(
    () => page.getByLabel('Sal (%)').fill('0.8'),
    () => expect(page.getByText('Abaixo do mínimo seguro').first()).toBeVisible(),
  );

  await page.emulateMedia({ media: 'print' });

  // O cabeçalho do site e os controles somem; a folha aparece.
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Imprimir' })).toBeHidden();

  const sheet = page.locator('.print-sheet');
  await expect(sheet).toBeVisible();

  // E o aviso de segurança vai junto: é a regra que não se negocia.
  await expect(sheet.locator('.print-notice')).toContainText(
    'Abaixo do mínimo seguro',
  );

  await page.emulateMedia({ media: 'screen' });
});

test('o compartilhamento existe nas quatro calculadoras, nos dois idiomas', async ({
  page,
}) => {
  // Oito navegações num teste só, com a suíte inteira rodando em paralelo:
  // o padrão de 5 s do `expect` já estourou aqui por lentidão de máquina, não
  // por ausência do botão.
  const visible = (name: string) =>
    expect(page.getByRole('button', { name })).toBeVisible({ timeout: 15_000 });

  for (const path of ['/paes', '/picles', '/massas', '/gelato']) {
    await page.goto(path);
    await visible('Copiar link');
  }

  for (const path of ['/en/bread', '/en/pickles', '/en/pasta', '/en/gelato']) {
    await page.goto(path);
    await visible('Copy link');
  }
});
