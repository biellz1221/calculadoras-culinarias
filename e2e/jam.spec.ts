import { expect, test } from '@playwright/test';

/**
 * Geleias: o que esta página faz e nenhum dos livros faz.
 *
 * A aritmética do açúcar os unitários já conferem contra as receitas do Blue
 * Chair. Aqui o alvo é o que só se vê na tela: que a altitude muda o ponto de
 * gelificação, que a proporção muda com a fruta, e que reduzir o açúcar abaixo
 * da fonte carrega o aviso junto.
 *
 * Desde a entrada da fruta brasileira há um segundo alvo: trocar para uma fruta
 * sem receita pesada tem de mudar a **forma** do resultado, não só o número —
 * some o rendimento, some a dose de limão, e o aviso troca de régua.
 */

test('a home leva à calculadora de geleias', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /abrir a calculadora de geleias/i }).click();
  await expect(page).toHaveURL(/\/geleias$/);
});

test('1 kg de morango pede os 645 g de açúcar da receita citada', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await expect(page.locator('#conteudo').getByText('645 g').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });
});

test('cada fruta traz a proporção da própria receita', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await page.getByLabel('Fruta', { exact: true }).selectOption('raspberry');
    // My Raspberry Jam, p. 234: um a um, e a única sem limão do conjunto.
    await expect(page.locator('#conteudo').getByText('1 kg').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.getByText('A receita não leva limão')).toBeVisible();

  // Damasco, p. 168, é a de menos açúcar do livro: 0,42 contra 1,00.
  await page.getByLabel('Fruta', { exact: true }).selectOption('apricot');
  await expect(page.locator('#conteudo').getByText('417 g').first()).toBeVisible();
});

test('a altitude muda o ponto de gelificação', async ({ page }) => {
  await page.goto('/geleias');

  // Nível do mar: 220 °F, que são os 104,4 °C dos dois livros.
  await expect(page.locator('#conteudo').getByText('104,4 °C').first()).toBeVisible();

  await expect(async () => {
    // Brasília, 1.172 m. Cozinhar até 105 °C aqui passaria cinco graus.
    await page.getByLabel('Altitude (m)').fill('1172');
    await expect(page.locator('#conteudo').getByText('100,2 °C').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // E o banho-maria sobe de 5 para 10 minutos, pelo mesmo motivo físico.
  await expect(page.locator('#conteudo').getByText('10 min').first()).toBeVisible();
});

test('reduzir o açúcar abaixo da fonte carrega o aviso', async ({ page }) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByRole('button', { name: 'Escolher' }).click();
    await page.getByLabel('Açúcar sobre a fruta (%)').fill('30');
    await expect(page.getByText('Abaixo da fonte')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(
    page.locator('#conteudo').getByText(/doce de geladeira/).first(),
  ).toBeVisible();
});

test('a tabela por altitude fica na página, fora da parte explicativa', async ({
  page,
}) => {
  await page.goto('/geleias');

  // É a razão de ser da página: não pode sumir na interface simplificada.
  await expect(
    page.getByRole('heading', { name: 'O ponto, na sua altitude' }),
  ).toBeVisible();
  await expect(page.locator('#conteudo').getByText('220').first()).toBeVisible();
});

test('a versão em inglês responde em /en/jam', async ({ page }) => {
  await page.goto('/en/jam');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('altitude');
});

test('goiaba entra pela tabela brasileira, e a tela diz que não há receita', async ({
  page,
}) => {
  await page.goto('/geleias');

  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await page.getByLabel('Fruta', { exact: true }).selectOption('guava');
    // 50:50 da geleia extra: um quilo de fruta pede um quilo de açúcar.
    await expect(page.locator('#conteudo').getByText('1 kg').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // A classificação da Embrapa aparece, e é ela que desempata o grupo III.
  // `.first()` porque a tabela de divergências repete a frase lá embaixo, ao
  // explicar por que a goiaba deixou de ficar de fora.
  await expect(page.getByText(/pectina rica, acidez média/i).first()).toBeVisible();

  // E a página declara que receita pesada não existe, em vez de inventar uma.
  await expect(
    page.getByText(/Nenhuma obra da estante publica receita pesada/i),
  ).toBeVisible();
});

test('o que a Embrapa não publica some do resultado', async ({ page }) => {
  await page.goto('/geleias');

  const content = page.locator('#conteudo');

  // Com morango, a receita do Blue Chair declara rendimento.
  await expect(async () => {
    await page.getByLabel('Fruta preparada (g)').fill('1000');
    await expect(content.getByText('Rende, mais ou menos')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // Com goiaba, some: a fonte não declara, e escalar de outra fruta seria
  // número sem fonte.
  await expect(async () => {
    await page.getByLabel('Fruta', { exact: true }).selectOption('guava');
    await expect(content.getByText('Rende, mais ou menos')).toHaveCount(0);
  }).toPass({ timeout: 15_000 });

  await expect(
    content.getByText('A fonte classifica a acidez, não publica a dose'),
  ).toBeVisible();
});

test('o aviso de açúcar baixo muda de régua com a fruta', async ({ page }) => {
  await page.goto('/geleias');

  // Fruta com receita: a régua é a receita, e o aviso é o do NCHFP.
  await expect(async () => {
    await page.getByRole('button', { name: 'Escolher' }).click();
    await page.getByLabel('Açúcar sobre a fruta (%)').fill('30');
    await expect(page.getByText('Abaixo da fonte')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  // Fruta sem receita: a régua é a norma, e o aviso é de categoria, não o
  // "doce de geladeira" de quem reduziu uma receita testada.
  await expect(async () => {
    await page.getByLabel('Fruta', { exact: true }).selectOption('guava');
    await expect(page.getByText('Abaixo da norma')).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(
    page.locator('#conteudo').getByText(/menor proporção que a legislação brasileira/i),
  ).toBeVisible();
});

test('trocar para fruta sem receita não deixa a escolha em "a da receita"', async ({
  page,
}) => {
  await page.goto('/geleias');

  const sugar = page.getByRole('button', { name: 'A da receita' });
  await expect(sugar).toHaveAttribute('aria-pressed', 'true');

  await expect(async () => {
    await page.getByLabel('Fruta', { exact: true }).selectOption('passionfruit');
    // O botão deixa de existir, porque a escolha deixou de existir.
    await expect(sugar).toHaveCount(0);
  }).toPass({ timeout: 15_000 });

  await expect(page.getByRole('button', { name: 'Extra (50:50)' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('a Tabela 1 e a régua legal ficam na página, fora da parte explicativa', async ({
  page,
}) => {
  await page.goto('/geleias');

  await expect(
    page.getByRole('heading', { name: 'O que as fontes brasileiras acrescentam' }),
  ).toBeVisible();

  // As 38 linhas, com a origem de cada uma declarada.
  const table = page.getByRole('table', { name: 'A Tabela 1, inteira' });
  await expect(table.getByRole('row')).toHaveCount(39);
  await expect(table.getByRole('cell', { name: 'Jackix (1988)' }).first()).toBeVisible();

  // E a régua legal, com a exceção que a própria norma abre.
  await expect(page.getByText('Comum de marmelo, laranja e maçã')).toBeVisible();
});

test('a página em inglês traz a fruta brasileira com o nome em inglês', async ({
  page,
}) => {
  await page.goto('/en/jam');

  await expect(async () => {
    await page.getByLabel('Prepared fruit (g)').fill('1000');
    await page.getByLabel('Fruit', { exact: true }).selectOption('guava');
    await expect(page.locator('#conteudo').getByText('1 kg').first()).toBeVisible();
  }).toPass({ timeout: 15_000 });

  await expect(page.getByText(/pectin rich, acidity medium/i).first()).toBeVisible();
});
