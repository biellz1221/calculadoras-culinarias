# QA — Pães do Levante e a tangzhong

**Data:** 2026-09-14
**Branch:** `feature/levant-breads`
**Escopo:** pesquisa dos nove livros de `references/bread/regional/`, seis presets
novos na calculadora de pães, a tangzhong como técnica, e três limites de faixa
corrigidos.

Pesquisa em [`docs/research/paes-regionais.md`](../research/paes-regionais.md).

---

## Resultado da verificação

| Passo | Resultado |
| --- | --- |
| `pnpm verify` (lint + typecheck + testes + build) | **exit 0** |
| Vitest | **814 testes / 52 arquivos** (eram 757 / 51) |
| Playwright | **332 passando** (eram 328) |
| `npx tsc --noEmit` com cache limpo | sem erro |

---

## O que entrou

Seis pães de Uri Scheft, *Breaking Breads*: **pita de frigideira, laffa, chalá,
bagel de Jerusalém, malawach e jachnun**. Três ingredientes novos no modelo (mel,
fermento químico, óleo neutro), a **tangzhong** como pré-fermento a 500% de
hidratação, e verbete de glossário para ela.

---

## Apontamentos

### 1. ALTO — a manteiga do malawach quase entrou na massa

**Achado por:** confronto entre a soma dos ingredientes e o peso de massa que o
próprio livro declara.

A lista de ingredientes do malawach traz 270 g de manteiga. Somando tudo dava
1.974 g contra os 1.700 g impressos — 274 g sobrando, exatamente a manteiga. Ela
lamina em cima da bancada e nunca entra na massa. Sem a manteiga a soma dá
**1.704 g**, e bate na casa da grama.

O site teria publicado um pão de 27% de gordura que não existe em lugar nenhum.

**Corrigido.** A manteiga saiu da fórmula do malawach e do jachnun e virou nota
de processo. Travado em `levant.test.ts` com os dois lados da conta: sem
manteiga bate, com manteiga erra por mais de 250 g.

### 2. ALTO — receita atribuída ao livro errado dentro do mesmo livro

A tabela de ingredientes que aparece logo depois da variação "Traditional
Overnight Kubaneh" **não é do kubaneh** — é do *Light Brioche*, três páginas
adiante. A extração por proximidade de título teria dado ao kubaneh 150 g de
água e 135 g de manteiga que não são dele.

**Corrigido** antes de virar código, pelo sumário do capítulo. Em livro
ilustrado, a tabela mais próxima do título nem sempre é a tabela do título.

### 3. ALTO — três limites duros acusavam receita publicada de erro

Metade dos pães do Levante caía fora dos limites duros da calculadora, que foram
calibrados em pão europeu magro. O limite duro significa, no texto da tela,
"aqui as fontes param de dar respaldo" — e uma receita de padeiro profissional
**é** respaldo.

| Medida | Antes | Agora | Quem empurrou |
| --- | --- | --- | --- |
| Sal, teto duro | 2,5% | **3%** | bagel de Jerusalém, Scheft p. 176 |
| Fermento fresco, teto duro | 4% | **5%** | mesma página |
| Hidratação, piso duro | 50% | **não há** | brioche do Kayser (0% de água) e chalá do Scheft (40%) |

A faixa **recomendada** não se mexeu em nenhuma das três: a pita continua
sinalizando "acima do usual", o que é verdade e é informação. Só deixou de ser
tratada como erro.

O piso da hidratação era defeito **já publicado**: o brioche do Kayser está no ar
desde o começo, não leva uma gota de água e dispara o alarme de limite duro. Água
sozinha não mede massa enriquecida.

### 4. MÉDIO — Camargo contraria o próprio teto, e ninguém tinha visto

O teste novo "nenhum preset estoura limite duro" derrubou um preset antigo.
Camargo enuncia o teto do fermento seco instantâneo em 1% da farinha e publica
uma broa com **1,11%**.

**Não corrigido, de propósito.** O teto fica porque é regra enunciada; a broa
fica porque é receita publicada. Quem abrir a broa vê o selo de "acima do limite"
com a nota explicando de onde vem o teto — que é o que uma divergência deve fazer
nesta calculadora. Registrado no dicionário nos dois idiomas, na pesquisa §6.1 e
travado em `levant.test.ts` como exceção nomeada, não como teste frouxo.

### 5. MÉDIO — o kubaneh ficou de fora

O kubaneh de Scheft (p. 160) pede **20 g de sal para 500 g de farinha: 4%**. O
livro é internamente coerente (1 colher de sopa de sal fino = 15 g em toda a
obra), mas é o dobro do que o mesmo autor usa no challah e acima de tudo o que
ele usa em qualquer outro pão. Não é divergência entre fontes — é ponto fora da
curva dentro de uma fonte, que é o padrão de um erro de edição.

**Retido** até segunda fonte. Está extraído e documentado na pesquisa §3.

### 6. BAIXO — `selectOption` não é `click` num grupo de botões

O primeiro e2e usou `getByLabel('Tipo de pão').selectOption(...)` e falhou por
timeout com a tabela ainda mostrando o pão francês: o seletor de preset é uma
fileira de botões com `aria-pressed`, não um `<select>`.

**Corrigido.** O auxiliar `escolhePao` clica o botão e espera o `aria-pressed`
virar `true` antes de seguir — o teste passa a falhar por motivo certo se o
controle mudar de forma outra vez.

---

## Segurança

Revisão da superfície de ataque da mudança, que é de dados:

- **Chaves de ingrediente novas** (`neutral-oil`, `honey`, `baking-powder`,
  `tangzhong`) entraram no `INGREDIENT_KEY_SET`, que é o registro que
  `isIngredientKey` consulta com `Object.hasOwn`. Link compartilhado com chave
  fora do registro continua sendo rejeitado (`state.ts:185`).
- **Ids de preset novos** passam pela mesma trava: `parseBreadState` rejeita
  qualquer `presetId` que `getPreset` não resolva (`state.ts:210`).
- **Nenhuma entrada nova de usuário, nenhuma rede, nenhum `dangerouslySetInnerHTML`.**
  O site continua estático, sem rota de API.
- **Busca no dicionário por chave dinâmica** (`dict.process.notes[noteKey]`)
  degrada para vazio, não para erro, e há teste cobrindo toda chave de nota e
  todo id de preset nos dois idiomas.

Sem apontamento.

---

## Pendências abertas

- Segunda fonte para o sal do kubaneh.
- Tabela de conversão do *Feast* (Helou): destravaria vinte pães do mundo
  islâmico de uma vez.
- Densidade de sal fino e de sal grosso, com fonte — destravaria Helou, Cho e a
  pendência do sal brasileiro que já vinha das geleias.
