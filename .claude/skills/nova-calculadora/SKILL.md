---
name: nova-calculadora
description: Checklist completo para criar uma calculadora nova no site (rota, paleta, dicionários, glossário, testes, SEO). Use quando o pedido for "nova calculadora", "página nova", "adicionar <tema> ao site", ou quando uma rota nova for entrar em PUBLISHED_ROUTES. Use também para adicionar uma SEÇÃO grande a uma calculadora existente, pois metade dos registros se aplica.
---

# Nova calculadora

Criar uma calculadora toca **doze pontos de registro**, e três deles são listas
escritas à mão que nenhum typecheck cobre. Este é o subsistema de maior churn do
repo (routes.ts, calculators.ts, glossary.ts, palette.ts, dicionários — todos no
top-16 de mudanças), e cada calculadora nova até hoje esqueceu pelo menos um
ponto. A skill existe para que a próxima não esqueça nenhum.

## Antes de codar

1. **A pesquisa vem primeiro.** `docs/research/<tema>.md` com toda proporção,
   obra e página/seção. Número sem fonte não vai para a tela — se a pesquisa
   não existe, pare aqui e faça-a (ver skill `fonte-nova`).
2. Leia `docs/quality/LEARNINGS.md`, seção "Calculadora nova".
3. Copie a estrutura da calculadora **mais recente** (hoje: `gelling`), não da
   mais antiga — as convenções evoluem e a mais nova as tem todas.

## Os doze registros, na ordem que compila mais cedo

O typecheck pega os itens 1–7 se feitos fora de ordem; os itens 8–10 **só os
testes pegam**, e os 11–12 nada pega — por isso ficam por último e explícitos.

1. `src/i18n/routes.ts` — rota em `ROUTES` (pt na raiz, en sob `/en`) **e** em
   `PUBLISHED_ROUTES` (só quando as duas páginas existirem).
2. `src/data/calculators.ts` — `CalculatorId`, `CalculatorAccent` novo, entrada
   em `CALCULATORS` com `sources` apontando para obras que existem em `books.ts`.
3. `src/lib/palette.ts` — paleta em `PALETTES` (é `Record<RouteKey, …>`: não
   compila sem). Espelhar em `src/app/globals.css`: variáveis `--color-<accent>`
   e bloco `[data-calculator='<id>']`. O teste `palette.test.ts` compara os dois.
4. `src/components/calculator-index.tsx` — o accent novo no mapa `ACCENT`
   (classes Tailwind por extenso, senão o scanner não as vê).
5. Dicionários: `src/i18n/dictionaries/<id>-pt-BR.ts` (canônico),
   `<id>-en.ts` tipado `typeof <ptBR>`, e `<id>.ts` com o acessor. **Nunca
   `as const` no canônico** — congela os literais e o inglês deixa de tipar.
   FAQ usa chaves `question`/`answer`, não `q`/`a`.
6. `src/i18n/calculators.ts` — o acessor no registro `DICTIONARIES`.
7. `src/i18n/dictionaries/pt-BR.ts` e `en.ts` — nome e blurb no catálogo da home.
8. `src/data/glossary.ts` — verbetes com citação; e o registro do teste
   `glossary.test.ts` (`GLOSSARIES`) — **lista manual**.
9. `src/i18n/routes.test.ts` — `ALL_KEYS` — **lista manual**.
10. `e2e/seo.spec.ts` — `PAGES`, as duas línguas — **lista manual**; o sitemap
    conta `<url>` por essa lista.
11. Páginas: `src/app/(pt)/<slug>/page.tsx` e `src/app/(en)/en/<slug>/page.tsx`
    (copiar de uma existente; muda `LOCALE`, `routeKey`, dicionário).
12. `e2e/<id>.spec.ts` — no mínimo: chegada pela home, o número da fonte
    reproduzido na tela, e a versão `/en` respondendo.

## Regras de conteúdo que valem por dor passada

- Meta `title` ≤ 60 caracteres **com** o sufixo do site; `description` ≤ 160.
  `seo.test.ts` derruba, mas só depois de você escrever tudo — escreva curto já.
- Motor em `src/lib/<id>/` puro, com teste reproduzindo uma receita real da
  fonte (caso-verdade), não um número redondo inventado.
- Estado que sai para URL/localStorage: guardas `Record<Chave, true>` +
  `Object.hasOwn` em `src/lib/<id>/state.ts`, mesmo antes de serializar.
- Se a página é de fonte única, ela **declara isso** numa seção própria
  (padrão: ganache, gelificantes).

## Checagens antes de dar por pronto

- `rm -f tsconfig.tsbuildinfo && pnpm verify` — exit 0.
- `pnpm test:e2e` — inclui os specs novos e o `seo.spec` inteiro.
- As duas rotas respondem: abrir `/slug` e `/en/slug` no e2e ou no dev.
- `git status` não lista nada de `references/`.

## Modos de falha conhecidos

- **Compila mas a calculadora não aparece na home** → esqueceu o item 7 (prosa
  do catálogo) ou o item 4 (accent no índice).
- **`seo.spec` falha com contagem de sitemap errada** → item 10.
- **Teste de glossário passa mas o verbete não renderiza** → id do verbete não
  bate entre `glossary.ts` e o dicionário da calculadora.
- **E2E falha por strict mode com texto repetido** → a folha de impressão
  duplica a receita no DOM; use `exact: true`, `.first()` comentado ou escopo
  `#conteudo`.
