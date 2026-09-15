import { expect, test, type Page } from '@playwright/test';

/**
 * A ferramenta principal da página.
 *
 * Os mesmos controles existem duas vezes desde que a página ganhou o painel de
 * "confira a sua receita", e é assim que tem de ser: o nome de uma textura ou
 * de um método é o mesmo nos dois lugares. Quem desempata é a região.
 */
const TOOL = 'Calculadora de gelificantes';

function tool(page: Page) {
  return page.getByRole('region', { name: TOOL });
}

/**
 * A calculadora de gelificantes (docs/research/gelificantes.md).
 *
 * O que estes testes protegem é a promessa da página: na quantidade de líquido
 * da fonte, a tela devolve a grama da fonte — e a conversão de Bloom, que é a
 * razão de existir da calculadora, reproduz a conta que o livro publica.
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

function agentRow(page: Page, name: string) {
  return page.getByRole('row').filter({ hasText: name }).first();
}

test('a home leva à calculadora de gelificantes', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /gelificantes/i }).first().click();

  await expect(page).toHaveURL(/\/gelificantes$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelatina');
});

test('devolve a gelatina da panna cotta do livro', async ({ page }) => {
  await page.goto('/gelificantes');

  // 530 g de líquido a 0,8% dão 4,24 g — a receita da fonte imprime 4,3 g.
  await interactUntil(
    () => page.getByLabel('Líquido', { exact: true }).fill('530'),
    () => expect(agentRow(page, 'Gelatina')).toContainText('4,24 g'),
  );

  await expect(agentRow(page, 'Gelatina')).toContainText('0,8%');
});

test('a conversão de Bloom muda o peso e conta as folhas', async ({ page }) => {
  await page.goto('/gelificantes');

  await interactUntil(
    () => page.getByLabel('Líquido', { exact: true }).fill('500'),
    // 500 g a 0,8% = 4 g de pó Knox.
    () => expect(page.getByText('4,00 g').first()).toBeVisible(),
  );

  // Trocando para folha ouro (Bloom nominal 205): 4 × 225 ÷ 205 = 4,39 g,
  // que a 2 g por folha dão 2,2 folhas.
  await interactUntil(
    async () => {
      await page.getByRole('button', { name: 'Ouro', exact: true }).click();
    },
    async () => {
      await expect(page.getByText('4,39 g').first()).toBeVisible();
    },
  );

  await expect(page.getByText(/2,2\s*folhas/)).toBeVisible();
});

test('a xantana aparece como espessante, não como gelificante', async ({ page }) => {
  await page.goto('/gelificantes');

  await interactUntil(
    async () => {
      await tool(page).getByRole('button', { name: 'Molho', exact: true }).click();
    },
    async () => {
      await expect(agentRow(page, 'Goma xantana')).toContainText('Só engrossa');
    },
  );

  await expect(agentRow(page, 'Ágar-ágar')).toContainText('Gelifica');
});

/**
 * Este teste já afirmou o contrário.
 *
 * Até 2026-09-15 a página declarava que a esferificação ficava de fora por
 * falta de fonte, e o e2e protegia essa declaração. O material do Scoolinary
 * chegou e a lacuna fechou — então o teste vira para o outro lado em vez de
 * sumir: agora ele garante que a técnica está na tela **com dose**.
 */
test('a esferificação deixou de ser lacuna e virou calculadora', async ({ page }) => {
  await page.goto('/gelificantes');

  const conteudo = page.locator('#conteudo');
  await expect(conteudo.getByText(/Esferificação fica de fora/i)).toHaveCount(0);
  await expect(conteudo.getByText('Alginato de sódio').first()).toBeVisible();
});

test('a versão em inglês responde em /en/gelling', async ({ page }) => {
  await page.goto('/en/gelling');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gelatin');
});

/**
 * Esferificação (docs/research/gelificantes.md, Parte IV).
 *
 * Era lacuna declarada na página até o material do Scoolinary chegar. O que
 * estes testes protegem: que a dose do produto e a do banho continuem sendo
 * porcentagens de líquidos **diferentes**, e que os limites da técnica direta
 * apareçam junto do resultado — dose certa numa base com laticínio não faz
 * esfera nenhuma.
 */
test('a esferificação direta separa a dose do produto da dose do banho', async ({
  page,
}) => {
  await page.goto('/gelificantes');

  const conteudo = page.locator('#conteudo');

  await interactUntil(
    () => page.getByLabel('Líquido a esferificar').fill('500'),
    // 0,5–1% de alginato sobre os 500 g da base.
    () => expect(conteudo.getByText('2,50 g – 5,00 g').first()).toBeVisible(),
  );

  // 0,5% de cloreto sobre o litro do banho: outra base, outro número.
  await expect(conteudo.getByText('5,00 g').first()).toBeVisible();
  await expect(conteudo.getByText('Cloreto de cálcio').first()).toBeVisible();
});

test('a reversa inverte quem leva o alginato, e perde os limites da direta', async ({
  page,
}) => {
  await page.goto('/gelificantes');

  const conteudo = page.locator('#conteudo');

  // Na direta, os limites estão na tela.
  await expect(
    conteudo.getByText(/O que a direta não aceita/i).first(),
  ).toBeVisible();

  await interactUntil(
    async () => {
      await page.getByRole('button', { name: 'Reversa', exact: true }).click();
    },
    async () => {
      await expect(conteudo.getByText('Gluconolactato').first()).toBeVisible();
    },
  );

  // A reversa não tem limites, porque ela existe justamente para não ter.
  await expect(conteudo.getByText(/O que a direta não aceita/i)).toHaveCount(0);
});

test('a página declara que a parte nova vem de material de curso', async ({
  page,
}) => {
  await page.goto('/gelificantes');

  const conteudo = page.locator('#conteudo');
  await expect(conteudo.getByText(/material de curso/i).first()).toBeVisible();
  await expect(conteudo.getByText(/Scoolinary/i).first()).toBeVisible();
});

test('os agentes novos aparecem com o que os torna diferentes', async ({ page }) => {
  await page.goto('/gelificantes');

  await interactUntil(
    async () => {
      await tool(page).getByRole('button', { name: 'Gel duro, de cortar', exact: true }).click();
    },
    async () => {
      await expect(
        page.getByRole('row').filter({ hasText: 'Metilcelulose' }).first(),
      ).toBeVisible();
    },
  );

  await interactUntil(
    async () => {
      await tool(page).getByRole('button', { name: 'Gel desenformável', exact: true }).click();
    },
    async () => {
      await expect(
        page.getByRole('row').filter({ hasText: 'Goma gelana' }).first(),
      ).toContainText('Não derrete depois de pronto');
    },
  );
});
