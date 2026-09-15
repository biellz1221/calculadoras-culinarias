@AGENTS.md

# Calculadoras Culinárias

Site estático de calculadoras de cozinha em que **toda proporção exibida tem
citação bibliográfica**. Leia o [README](README.md) para a arquitetura e o
[PRD](docs/prd/prd-calculadoras-culinarias.md) para escopo e trade-offs.

## Regras que não se negociam

- **Número sem fonte não vai para a tela.** Toda proporção entra primeiro em
  `docs/research/`, com livro e página (ou capítulo, para EPUB), e só então no
  código. Se as fontes divergem, o padrão é escolhido com justificativa escrita e
  a divergência vira conteúdo — nunca uma escolha silenciosa.
- **Tudo em gramas.** O estado interno é sempre número puro em gramas; xícaras e
  colheres não existem aqui. Formatação por idioma só em `src/i18n/format.ts`.
- **Segurança alimentar não é sinalização de faixa.** Nas calculadoras de
  fermentação, sal abaixo do mínimo seguro exige aviso destacado, e o aviso
  acompanha o resultado (inclusive na impressão).
- **Os dois idiomas andam juntos.** Nenhuma página entra em produção só em
  português. Rota nova só entra em `PUBLISHED_ROUTES` quando existe nos dois.
- **Nada de servidor.** Sem API route, sem banco, sem `use client` desnecessário.
  A home não tem nenhum componente client — mantenha assim onde der.

## Antes de qualquer commit

```bash
pnpm verify   # lint + typecheck + testes + build
```

Branch `feature/...`, Conventional Commits em inglês, PR com CI verde. Nunca push
direto na `main` — merge na main publica em produção.

## Onde as coisas moram

- `src/i18n/routes.ts` — registro único de rotas (links, hreflang, sitemap).
- `src/i18n/dictionaries/pt-BR.ts` — dicionário canônico; o tipo do inglês é
  derivado dele.
- `src/data/books.ts` — a estante; nomes próprios ficam aqui, não nos dicionários.
- `src/lib/` — motores de cálculo puros, sempre com teste usando receita real do
  livro como caso-verdade.
