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

### Busca e leitura por máquina

Nenhuma página escreve `openGraph` à mão. O Next **substitui** campos aninhados
em vez de fundi-los, então uma página que declarasse só `openGraph.title`
perderia `siteName` e `locale` do layout em silêncio. Quem monta o bloco inteiro
é [`pageMetadata`](src/lib/seo.ts), e a página só passa título, descrição,
palavras-chave e o texto alternativo da imagem.

- **Imagem de compartilhamento**: gerada no build em
  [`src/app/og/[slug]/image.png/`](src/app/og/), uma por rota e por idioma, na
  paleta da própria calculadora. É route handler, e não a convenção
  `opengraph-image`, porque esta grava arquivo **sem extensão** no export
  estático, e aí o `Content-Type` sai como binário genérico e o card não aparece.
  As fontes em `assets/fonts/` existem só para isso: o gerador não lê WOFF2.
- **JSON-LD** em [`src/lib/structured-data.ts`](src/lib/structured-data.ts):
  `WebApplication` gratuita, `BreadcrumbList`, `FAQPage` e, o que interessa de
  verdade aqui, `citation` com a estante. É a promessa do site dita em formato
  que a máquina lê.
- **`/llms.txt`**: o site resumido para assistentes de IA, com as páginas, a
  bibliografia e as respostas diretas nos dois idiomas.
- **Paleta espelhada**: as cores vivem no CSS e em
  [`src/lib/palette.ts`](src/lib/palette.ts), porque o cartão é gerado fora do
  navegador. `palette.test.ts` compara os dois e falha se divergirem.
- **Endereço canônico sem barra final**, inclusive na raiz: é a grafia que o
  Next impõe ao `canonical`, e sitemap, `og:url` e JSON-LD seguem ela via
  `absoluteUrl`.

### Salvar, compartilhar e imprimir

As três saídas de uma receita calculada (FR-040 a FR-042) saem do mesmo par, e é
o que as mantém coerentes entre si:

| Peça | Papel |
| --- | --- |
| **Estado** (`src/lib/<calc>/state.ts`) | Tudo o que reconstrói a calculadora, num objeto só e serializável. Cada módulo exporta um `parse…State` que valida entrada não confiável |
| **`RecipeCard`** ([`src/lib/recipes/card.ts`](src/lib/recipes/card.ts)) | O resultado já formatado: linhas, avisos e fontes. Cada calculadora monta o seu em `components/<calc>/recipe-card.ts` |

Em cima desse par:

- **Guardar**: [`src/lib/recipes/store.ts`](src/lib/recipes/store.ts), localStorage
  por calculadora, 20 receitas, mesmo nome substitui. Sem storage o recurso some
  em vez de quebrar.
- **Link**: o estado inteiro vai dentro da URL, em `?r=`, num envelope
  **versionado** ([`snapshot.ts`](src/lib/recipes/snapshot.ts)). Link de versão
  que não sabemos ler diz isso; link corrompido também. O canonical continua
  apontando para a página limpa, e o `?r=` sai da barra assim que a receita muda.
- **Papel**: [`PrintSheet`](src/components/recipes/print-sheet.tsx) monta a folha
  num portal no `body`, e o CSS de impressão esconde a aplicação inteira. Isso
  garante o que a regra do projeto exige — **o aviso de segurança acompanha o
  resultado, inclusive impresso**.

> O que entra por `?r=` é texto que qualquer pessoa escreve. Nada dali chega ao
> motor de cálculo sem passar por um `parse…State`, que recusa o estado inteiro
> ao primeiro campo inválido — meia receita na tela é pior que nenhuma.

Efeito colateral nos testes: a folha repete a receita no DOM. O Vitest a ignora
por configuração (`vitest.setup.ts`) e, no Playwright, asserção sobre a tela usa
`page.locator('#conteudo')`.

## Domínios

O site responde em **calculadorasculinarias.com.br**, que é o endereço canônico
dos dois idiomas.

**culinarycalculators.com** é porta de entrada em inglês: o
[`vercel.json`](vercel.json) redireciona tudo o que chega por ele para a árvore
`/en` do domínio canônico, mapeando também os slugs em português (`/paes` →
`/en/bread`). Um único site indexado, sem conteúdo duplicado.

Para ligar: acrescentar o domínio (e o `www`) ao projeto na Vercel. Até lá o
`vercel.json` fica inerte. Se o domínio for apenas apontado para o mesmo deploy,
sem o redirecionamento, `isEnglishHost` em [`src/lib/site.ts`](src/lib/site.ts)
ainda leva a raiz para o inglês pelo cliente.

O redirecionamento é **307 (temporário)** de propósito: 308 fica gravado no
navegador de quem visitou uma vez e amarraria uma decisão que ainda pode mudar —
dar ao `.com` um build próprio, com canonical nele mesmo, é a alternativa se um
dia o inglês justificar domínio de verdade. Vale trocar para permanente quando
a escolha estiver assentada.

## Publicando uma calculadora nova

1. Extrair as proporções para `docs/research/`, com citação.
2. Criar o motor de cálculo puro em `src/lib/`, com teste usando uma receita real
   do livro como caso-verdade.
3. Criar as páginas nos **dois** idiomas (`(pt)/<slug>` e `(en)/en/<slug>`).
4. Acrescentar textos nos dois dicionários, incluindo `meta` (título, descrição,
   `keywords`, `imageAlt`) e a `faq` da calculadora.
5. Acrescentar a rota em `PUBLISHED_ROUTES` — é o que acende o link na home,
   coloca a página no sitemap e gera a imagem de compartilhamento dela.

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
- **Route handler no export estático sem `force-static`**: o build morre com uma
  mensagem que fala de `revalidate` e não do arquivo. Vale para `/llms.txt`, para
  as imagens de OG e para qualquer rota nova que gere arquivo.
- **Sobrenome de instituição**: `formatAuthors` cortava a última palavra e
  transformava "University of Georgia" em "Georgia". Obra assinada por
  instituição declara `authorKind: 'organization'` e a sigla em `shortName`.

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
