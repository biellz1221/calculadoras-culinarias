@AGENTS.md

# Calculadoras Culinárias

Site estático de calculadoras de cozinha (Next 16 `output: 'export'`, React 19,
Tailwind 4, pnpm) em que **toda proporção exibida tem citação bibliográfica**.
pt-BR na raiz, inglês sob `/en`. Sessões quase sempre começam por
`src/data/<calculadora>/` (números + citações), `src/lib/<calculadora>/`
(motor puro) ou `docs/research/` (pesquisa que precede os dois).

**Antes de qualquer tarefa, leia `docs/quality/LEARNINGS.md`.** É o catálogo
acumulado de erros reais deste repo; quase toda regra daqui nasceu de um deles.

## Comandos

| Tarefa | Comando | Nota |
|---|---|---|
| Verificação completa | `pnpm verify` | lint + typecheck + testes + build. **Não roda e2e.** |
| E2E | `pnpm test:e2e` | Obrigatório antes de merge; CI roda os dois |
| Typecheck confiável | `rm -f tsconfig.tsbuildinfo && pnpm typecheck` | O cache velho **esconde erro de tipo** — já mentiu uma vez |
| Um arquivo de teste | `npx vitest run <caminho>` | `pnpm test` não checa tipos; não confie nele sozinho |
| Dev | `pnpm dev` | Playwright usa `localhost`, nunca `127.0.0.1` (não hidrata) |

## Convenções

- (enforced) Tipos: inglês derivado do pt-BR — `typeof breadPtBR`. Chave nova em
  português não compila até ser traduzida. Nunca `as const` num dicionário.
- (enforced) `assertCitation`: obra com `locator: 'page'` cita página; `'chapter'`
  cita seção. Teste em `citations.test.ts`.
- (enforced) Meta title ≤ 60 chars com sufixo, description ≤ 160 (`seo.test.ts`).
- (observed) Todo motor em `src/lib/` é função pura testada contra uma receita
  real do livro como caso-verdade — nunca contra número inventado.
- (observed) Todo valor vindo de URL/localStorage passa por guarda
  `Record<Chave, true>` + `Object.hasOwn` (`parse…State` é fronteira de segurança).
- (observed) Branch `feature/...` → merge `--no-ff` local na `main` → `pnpm verify`
  **e** e2e verdes na main já mesclada → push. Merge na main publica em produção.
- (owner) Commits: Conventional Commits em inglês, corpo narrativo dizendo o
  porquê. Comentários de código em pt-BR explicando decisões, não mecânica.
- (owner) Toda tarefa que muda código fecha com relatório em
  `docs/quality/AAAA-MM-DD-<slug>.md` + entrada em LEARNINGS se houve erro novo.

## Erros prováveis aqui — e a regra que evita cada um

| Erro provável | Regra |
|---|---|
| Publicar número sem fonte | Proporção entra primeiro em `docs/research/` com obra + página/seção; só então em `src/data/`. Sem exceção — foi o que segurou esferificação, kubaneh e araçá até haver fonte. |
| Confiar na camada de texto de um PDF | `pdfinfo` + `pdffonts` antes de extrair. `Creator: ABBYY` ou fonte única `GlyphLessFont` = OCR: todo número sai da **imagem renderizada** (`pdftoppm`), nunca do texto. |
| Citar página sem conferir o deslocamento | Conferir PDF↔impresso em ≥3 pontos distantes. Não constante? Teste razão 2:1 (página dupla) antes de rebaixar para `locator: 'chapter'`. |
| Transcrever receita sem caso-verdade | Somar ingredientes contra rendimento declarado; regra contra receita da mesma página. Foi isso que pegou a manteiga do malawach e a segunda água da ciabatta. |
| Alisar divergência entre fontes | Divergência vira conteúdo na tela com as duas citações — nunca média, nunca escolha silenciosa. Dentro da mesma obra = suspeita de erro de edição: reter até segunda fonte. |
| Mexer em número de segurança alimentar | `MIN_SAFE_SALINITY`, `TARGET_PH`, teto de nitrito: só mudam com norma legal ou fonte oficial de segurança, nunca manual técnico. `ranges.test.ts` do picles trava isso de propósito. |
| Esquecer registro ao criar calculadora | Usar a skill `nova-calculadora`. Três listas de teste são manuais e não derivam de `CALCULATORS`: `ALL_KEYS` (routes.test), `GLOSSARIES` (glossary.test), `PAGES` (e2e/seo.spec). |
| Desfazer experimento com `git checkout <arq>` | Já destruiu 2h de trabalho não commitado. Desfazer com a mesma ferramenta que fez (editar de volta) ou `git stash`. |
| Dar tarefa por pronta com `pnpm test` verde | `pnpm verify` + `pnpm test:e2e`, com `tsconfig.tsbuildinfo` apagado se o typecheck importa. |
| Investigar e2e de OG que falhou | Rodar a suíte de novo primeiro: as imagens OG disputam o dev server e falham por tempo. Só é regressão se repetir. |
| Texto duplicado quebra e2e em silêncio | A folha de impressão repete a receita no DOM. `getByText` sempre com `exact: true`, `.first()` comentado, ou escopo `#conteudo`. |

## Barra de qualidade

Uma **calculadora/feature** está pronta quando: pesquisa em `docs/research/`
precede os dados; `pnpm verify` e `pnpm test:e2e` verdes; as duas línguas no ar
juntas (rota só entra em `PUBLISHED_ROUTES` completa); relatório em
`docs/quality/` commitado junto.
Um **bugfix** está pronto quando: existe teste de regressão que falha no código
antigo; a causa-raiz está no corpo do commit.
Uma **fonte nova** está pronta quando: triagem (`pdfinfo`/`pdffonts`) registrada
na pesquisa; paginação conferida ou rebaixada a `chapter` com motivo; entrada em
`src/data/books.ts` com `kind` honesto (`course` não vira `book`).

## Zonas de perigo

- `src/data/books.ts` — maior churn do repo depois do LEARNINGS. Toda mudança de
  `locator` quebra citações existentes; rode `npx vitest run src/data` após tocar.
- Dicionários `*-pt-BR.ts` / `*-en.ts` — mudam sempre em par, no mesmo commit.
- `references/` e `calculadora gelato/` — **nunca** entram em commit (direito
  autoral; gitignored). Confira `git status` antes de `git add -A`.

## Em dúvida

**Decida sozinho** (padrão de desempate): estrutura de arquivo → copiar a
calculadora mais recente que toca o mesmo subsistema; nomenclatura → o que o
registro vizinho já usa; tolerância de teste → a menor que passa, com o motivo
em comentário ao lado.
**Pergunte antes** (formato: opções → recomendação → o que já tentei):
dependência nova; publicar de fonte única sem autoconferência; usar material
pago/de curso como fonte; qualquer mudança em número de segurança alimentar.
**Nunca sem permissão explícita**: push com verificação vermelha; commit de
`references/`; editar `.env*`; `git push --force`; mudar `locator` de obra já
citada; deletar `CLAUDE.md.bak`.

## Leituras profundas

- `docs/quality/LEARNINGS.md` — **antes de toda tarefa**; catálogo de erros reais.
- `docs/research/<tema>.md` — antes de mexer nos dados da calculadora correspondente.
- `docs/prd/prd-calculadoras-culinarias.md` — escopo e trade-offs; ler antes de propor feature.
- `README.md` — arquitetura geral e decisões de stack.
