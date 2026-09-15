import { expect, test } from '@playwright/test';

/**
 * Conferir uma receita trazida de fora — nas nove calculadoras.
 *
 * O que estes testes vigiam não é a conta, que os testes de motor já cobrem: é
 * que a seção chega à tela, que a frase de correção aparece quando há o que
 * corrigir, e que ela **não** aparece quando não há. Uma sugestão sobre uma
 * receita que já está certa é pior que nenhuma sugestão.
 *
 * Toda asserção escopa em `#conteudo`: a folha de impressão repete a receita no
 * DOM, e busca por texto solta acha duas de tudo.
 */

/** O corpo da página, sem a folha de impressão. */
const CONTENT = '#conteudo';

test('o pão diz quanto líquido a faixa pede', async ({ page }) => {
  await page.goto('/paes');

  await expect(async () => {
    await page
      .getByLabel('Ingredientes da sua receita, um por linha')
      .fill('Farinha 1000 g\nÁgua 500 g\nSal 20 g');
    await expect(
      page.locator(CONTENT).getByText('Para entrar na faixa: o líquido entre 600,0 g e 700,0 g.'),
    ).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('o pão aceita a receita digitada sem passar pelo adivinhador', async ({ page }) => {
  await page.goto('/paes');

  // Só o clique no modo entra no laço: ele é idempotente. Acrescentar linha
  // não é, e cada repetição do laço criaria mais uma.
  await expect(async () => {
    await page.getByRole('button', { name: 'Digitar ingrediente por ingrediente' }).click();
    await expect(page.getByText('+ Acrescentar ingrediente')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await page.getByText('+ Acrescentar ingrediente').click();
  await page.getByLabel('Ingrediente 1', { exact: true }).fill('Polenta');
  await page.getByLabel('Peso').first().fill('1000');
  await page.getByLabel('Papel na massa').first().selectOption('flour');

  await page.getByText('+ Acrescentar ingrediente').click();
  await page.getByLabel('Ingrediente 2', { exact: true }).fill('Água');
  await page.getByLabel('Peso').nth(1).fill('700');
  await page.getByLabel('Papel na massa').nth(1).selectOption('water');

  // "Polenta" não está na lista de palavras de farinha, e aqui não precisa
  // estar: quem digitou já disse o que ela é.
  await expect(page.locator(CONTENT).getByText('70%', { exact: true })).toBeVisible();
});

test('o picles mostra as duas leituras do mesmo sal', async ({ page }) => {
  await page.goto('/picles');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Sal que você usou').fill('20');
    // 1 kg de vegetal + 1 L de água + 20 g de sal: 1% no pote, 2% na água.
    await expect(content.getByRole('heading', { name: 'O seu sal sobre o pote' })).toBeVisible();
    await expect(content.getByRole('heading', { name: 'O seu sal sobre a água' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(content.getByText('Fora do limite das fontes').first()).toBeVisible();
});

test('a massa fresca lê a receita do Zielonka como dentro da faixa', async ({ page }) => {
  await page.goto('/massas');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Farinha da sua massa').fill('300');
    await page.getByLabel('Ovo da sua massa').fill('150');
    await expect(content.getByRole('heading', { name: 'Farinha por ovo na sua massa' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // 300 para 150 é exatamente a Classic Egg Dough: não há o que sugerir.
  await expect(content.getByText(/Para entrar na faixa/)).toHaveCount(0);
});

test('a geleia compara com a receita da fonte, não com uma faixa nossa', async ({ page }) => {
  await page.goto('/geleias');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Açúcar que você usou').fill('300');
    await expect(content.getByRole('heading', { name: 'Açúcar por grama de fruta' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(content.getByText('Abaixo da fonte').first()).toBeVisible();
  await expect(
    content.getByText('A comparação é com a receita pesada que a fonte publica para esta fruta.'),
  ).toBeVisible();
});

test('o ganache aponta a faixa de chocolate das pralinés de corte', async ({ page }) => {
  await page.goto('/ganache');

  // O nome da textura é o mesmo nos dois seletores da página, e é o nome certo
  // nos dois. Quem desempata é a região: a seção tem nome acessível.
  const section = page.getByRole('region', { name: 'Confira a ganache que você já faz' });

  await expect(async () => {
    await section.getByRole('button', { name: 'Praliné cortado' }).click();
    await page.getByLabel('Chocolate da sua ganache').fill('250');
    await expect(
      section.getByText('Para entrar na faixa: o chocolate entre 130,0 g e 180,0 g.'),
    ).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('a salmoura aponta o sal da receita publicada', async ({ page }) => {
  await page.goto('/salmoura');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Sal da sua salmoura').fill('40');
    await expect(
      content.getByText('Para chegar à proporção da fonte: o sal em 12,0 g.'),
    ).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('a cura acusa a dose abaixo do piso como o lado perigoso', async ({ page }) => {
  await page.goto('/cura');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Sal de cura que você pesou').fill('1');
    await expect(content.getByRole('heading', { name: 'Nitrito de entrada do que você pesou' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(content.getByText('Fora do limite das fontes').first()).toBeVisible();
  // A leitura é de entrada, e o limite brasileiro é de resíduo: a nota diz a
  // diferença sem repetir a promessa que a seção dos limites já carrega.
  await expect(content.getByText(/nitrito de \*\*entrada\*\*|entrada/).first()).toBeVisible();
});

test('os gelificantes dizem em que textura a dose cai', async ({ page }) => {
  await page.goto('/gelificantes');

  const content = page.locator(CONTENT);

  await expect(async () => {
    await page.getByLabel('Agente que você usou').selectOption('agar');
    await page.getByLabel('Agente que você pesou').fill('5');
    // 5 g em 500 g são 1%: o topo do purê e o pé do gel duro.
    await expect(content.getByRole('heading', { name: 'Dose sobre o líquido' })).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(content.getByText(/cai também em/)).toBeVisible();
});

test('o gelato diz quanto de cada grandeza cabe no lote atual', async ({ page }) => {
  await page.goto('/gelato');

  const content = page.locator(CONTENT);
  const sugar = page.getByRole('row').filter({ hasText: 'Açúcar sacarose' }).first();

  await expect(async () => {
    await sugar.getByRole('spinbutton').fill('400');
    await expect(content.getByText(/Para entrar na faixa neste lote de/).first()).toBeVisible();
  }).toPass({ timeout: 20_000 });
});
