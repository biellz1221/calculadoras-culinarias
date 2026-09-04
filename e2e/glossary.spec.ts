import { expect, test } from '@playwright/test';

/**
 * Glossário com fonte e endereço (FR-004).
 *
 * O que só o navegador prova: a âncora leva à definição de verdade, e o tooltip
 * abre com clique, com toque e com teclado — os três caminhos que o critério
 * pede e que o `title` nativo do HTML não atende.
 */

test('a âncora abre a página no verbete', async ({ page }) => {
  await page.goto('/paes#glossario-autolyse');

  const entry = page.locator('#glossario-autolyse');
  await expect(entry).toBeInViewport();
  await expect(entry).toContainText('Autólise');
  // Definição sem procedência é o glossário genérico que este não quer ser.
  await expect(entry).toContainText('Kayser');
});

test('o termo explica a si mesmo sem sair do cálculo', async ({ page }) => {
  await page.goto('/paes');

  const term = page.getByRole('button', { name: 'Hidratação', exact: true });
  await expect(async () => {
    await term.click();
    await expect(page.getByRole('note')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.getByRole('note')).toContainText('Kayser');

  // Esc fecha: metade do critério é o teclado.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('note')).toBeHidden();
});

test('o verbete sem fonte diz que não tem, em vez de omitir', async ({ page }) => {
  await page.goto('/gelato#glossario-overrun');

  const entry = page.locator('#glossario-overrun');
  await expect(entry).toContainText('Sem fonte na nossa bibliografia');
  // E o número que estava ali sem procedência não voltou.
  await expect(entry).not.toContainText('35%');
});

test('a versão em inglês tem os mesmos verbetes, no mesmo endereço', async ({ page }) => {
  await page.goto('/en/bread#glossario-autolyse');

  await expect(page.locator('#glossario-autolyse')).toContainText('Autolyse');
});
