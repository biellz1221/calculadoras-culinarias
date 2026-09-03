# Calculadoras Culinárias

Site de calculadoras de cozinha em gramas — pães, picles e massa fresca — em que
**toda proporção exibida tem citação bibliográfica** (livro, autor e página ou
capítulo). Quando as fontes divergem, a diferença é explicada em vez de
escondida.

Produção: [calculadorasculinarias.com.br](https://calculadorasculinarias.com.br) ·
pt-BR na raiz, inglês em `/en`.

## Como rodar

```bash
pnpm install
pnpm dev        # servidor de desenvolvimento
pnpm verify     # lint + typecheck + testes + build (rodar antes de todo commit)
pnpm test:e2e   # Playwright (desktop e mobile); precisa de `pnpm exec playwright install chromium`
pnpm build      # gera out/
pnpm start      # serve out/ localmente
```

## Documentos que mandam no projeto

| Documento | Para quê |
| --- | --- |
| [`docs/prd/prd-calculadoras-culinarias.md`](docs/prd/prd-calculadoras-culinarias.md) | Requisitos, escopo e as decisões de trade-off (TD-001 a TD-005) |
| [`docs/prd/stories-calculadoras-culinarias.md`](docs/prd/stories-calculadoras-culinarias.md) | Stories com critérios de aceite em Gherkin |
| [`docs/research/*.md`](docs/research/) | **Fonte de verdade numérica.** Proporções extraídas dos livros, com citação item a item |

Números novos entram primeiro em `docs/research/`, com citação, e só depois no
código. Um valor sem fonte não vai para a tela.

## Arquitetura

**Build 100% estático** (`output: 'export'`). Não existe API route, servidor nem
banco: todo cálculo roda no navegador e a persistência é `localStorage`, link
compartilhável e impressão. É o TD-001 do PRD — o que mantém o custo em zero e o
deploy trivial.

### Idiomas

Sem middleware (site estático não tem), então cada página existe fisicamente:

```
src/app/
├── (pt)/          → <html lang="pt-BR">, home em /
├── (en)/en/       → <html lang="en">,   home em /en
└── global-not-found.tsx
```

Dois **root layouts** via route groups — é o que permite servir o `lang` certo em
cada idioma sem negociação em tempo de request.

- [`src/i18n/routes.ts`](src/i18n/routes.ts) — registro único de rotas. Links
  internos, seletor de idioma, `hreflang` e sitemap saem todos daqui.
  `PUBLISHED_ROUTES` controla o que já existe: rota fora da lista não é linkada
  nem entra no sitemap.
- [`src/i18n/dictionaries/`](src/i18n/dictionaries/) — `pt-BR.ts` é o dicionário
  canônico e o tipo `Dictionary` é derivado dele, então **acrescentar uma chave
  em português quebra a compilação do inglês até ser traduzida**.
- Nomes próprios (títulos de livros, autores) ficam em `src/data/`, nunca nos
  dicionários.

### Fontes bibliográficas

[`src/data/books.ts`](src/data/books.ts) é a estante. Cada obra declara `locator`
(`page` para PDF/impresso, `chapter` para EPUB, que não tem paginação física) —
citar "página" de um EPUB seria mentira.

## Publicando uma calculadora nova

1. Extrair as proporções para `docs/research/`, com citação.
2. Criar o motor de cálculo puro em `src/lib/`, com teste usando uma receita real
   do livro como caso-verdade.
3. Criar as páginas nos **dois** idiomas (`(pt)/<slug>` e `(en)/en/<slug>`).
4. Acrescentar textos nos dois dicionários.
5. Acrescentar a rota em `PUBLISHED_ROUTES` — é o que acende o link na home e
   coloca a página no sitemap.

## Deploy

Vercel, pela integração com o GitHub: **merge na `main` publica**. Por isso nunca
se faz push direto na `main` — o caminho é PR com a CI verde.

A CI (`.github/workflows/ci.yml`) roda em pull request e faz só verificação
(lint, tipos, testes, build e e2e). Deploy nunca sai da Action.

## Armadilhas que já custaram tempo

- **`sr-only` dentro de container com `overflow-x-auto`**: `sr-only` é
  `position: absolute`, então o elemento se ancora no ancestral posicionado mais
  próximo — que fica fora do container de rolagem — e alarga a página inteira no
  mobile. Para rótulo de campo dentro de tabela rolável, use `aria-label` no
  próprio input.
- **Sufixo de unidade dentro do `<label>`**: vira parte do nome acessível
  ("Peso da massa g") e quebra `getByLabel`. O sufixo fica fora do label, com
  `aria-hidden`. É o que `NumberField` em [`src/components/field.tsx`](src/components/field.tsx) já faz.
- **E2E por `127.0.0.1`**: o dev server do Next bloqueia recursos de `/_next`
  vindos de outra origem. A página carrega, mas nunca hidrata, e todo teste de
  interação falha parecendo bug de estado. O `baseURL` do Playwright usa
  `localhost` de propósito.
- **`fill()` com vírgula em campo numérico**: o valor de um `input[type=number]`
  é sempre com ponto, mesmo o site exibindo vírgula. Nos testes, use `'0.8'`.

## Armadilhas conhecidas do ambiente

- **`NODE_ENV=development` exportado no shell** quebra o `next build` com um erro
  obscuro de `useContext`. O script `build` força `NODE_ENV=production`; ainda
  assim vale remover a variável do seu `~/.zshrc`, porque ela afeta qualquer
  projeto Node.
- **TypeScript fixado na linha 6.x**: o `typescript-eslint` que vem no
  `eslint-config-next` ainda não roda com o TypeScript 7.
- **Versão do React declarada no ESLint**: a autodetecção do
  `eslint-plugin-react` usa uma API que o ESLint 10 removeu.
- `references/` (as obras) e `calculadora gelato/` estão fora do versionamento.
