# Motor de densidade de líquidos — relatório de qualidade

**Data:** 2026-09-16 · **Branch:** `feature/motor-densidade` (a partir de
`docs/pesquisa-densidade`)

Motor puro, sem página: densidade de mistura de água e etanol (OIML R 22), de
calda de sacarose (NBS Circular 457) e de líquido de composição conhecida
(Choi & Okos, via ASHRAE e Fricke & Becker), mais a conversão mililitro ↔ grama.
Pesquisa em `docs/research/densidade.md`.

O relatório tem duas rodadas. A primeira entregou as duas réguas medidas; a
segunda, depois de o dono autorizar citar o ASHRAE, o modelo composicional.

## Verificação

| Etapa | Resultado |
| --- | --- |
| `pnpm verify` (lint + typecheck com cache apagado + testes + build), estado final | **exit 0** — 1360 testes em 72 arquivos |
| `pnpm test:e2e`, antes das correções da revisão | **404 de 404** |
| `pnpm test:e2e`, estado final | **sem rodada completa verde** — ver abaixo |
| Testes do motor e dos dados | 85 (`src/lib/density`, `src/data/density`) |
| Prova de que os testes pegam o erro | coeficiente da OIML corrompido → 29 falhas; grama do NBS trocada → 5; peso da interpolação ao quadrado → 1; latão removido → 3; libra errada que escapa da redundância → 1. Todos desfeitos com a mesma ferramenta que os fez |
| Processos | servidores do e2e encerrados, portas 3100/3101 livres |

**Sobre o e2e no estado final.** Duas rodadas completas depois das correções da
revisão, com a máquina a *load average* entre 67 e 95 — dezenas de `clang` do
Xcode de outra sessão compilando em paralelo. A segunda rodada perdeu 1 teste
(`a home leva à calculadora de cura`, URL não mudou em 5 s); a terceira perdeu 2
diferentes (`o caminho inverso dá o peso que um litro deveria ter`, 30 s
estourados; imagem OG de `/en/pickles`, `ECONNRESET`). **Nenhum teste falhou
duas vezes**, e os três passaram ao repetir as specs (28 e 81 passando). Nenhum
deles toca o motor, que não tem página. É o padrão de disputa de recurso que o
LEARNINGS registra para as imagens OG. Mesmo assim, não houve rodada completa
verde no estado final: fica para o CI do PR, em ambiente sem essa carga.

## Arquivos

- `src/data/density/ethanol.ts` — 54 coeficientes, faixa de temperatura, citações
- `src/data/density/sucrose.ts` — Tabela 2 do NBS em libra e grama, ar e latão da p. 2, células extrapoladas
- `src/lib/density/{ethanol,sucrose,volume}.ts` — motor
- `src/lib/units.ts` — `MILLILITERS_PER_US_GALLON`, ao lado da onça líquida
- `src/data/books.ts` — `oiml-r22` e `nbs-457`, `kind: 'official'`, `locator: 'page'`

## O que a própria tarefa achou

### 1. ALTO — os testes da OIML não testavam 36 dos 54 coeficientes

**Achado ao provar que o teste pega o bug.** Corrompi `C₂,₄` (13,53 → 13,35) e
os 15 testes passaram. Os casos-verdade eram água (teor zero) e 20 °C (OIV,
etanol puro); os coeficientes `Cᵢ,ₖ` multiplicam `p^k·(t−20)^i`, que se anula
nos dois.

A pesquisa já commitada — e empurrada, no PR de documentação — afirmava que "se
algum dos 44 coeficientes tivesse um dígito errado, nenhum dos quatro fecharia".
Era falso duas vezes: a cobertura não existia, e a conta também estava errada —
são 54 coeficientes (12 + 6 + 36), como a revisão de código contou (§R5).

**Corrigido:** 38 células da Tabela I lidas nas imagens giradas (pp. 20, 21, 24
e 27), de 5 a 100% em massa e de 0 a 40 °C. Pior diferença 0,00497 kg/m³, dentro
do arredondamento. A mesma corrupção derruba 29 delas. Canto conferido de fora:
etanol puro a 40 °C = 771,93, o piso de faixa que implementações independentes
da norma declaram. A pesquisa foi corrigida por escrito, com a frase errada
citada.

### 2. MÉDIO — número da pesquisa escrito antes da ferramenta que o produziria

A pesquisa dava "tabela OIML, 36% em massa → 0,948 g/mL". Com a fórmula: 0,948 é
40% em **volume**; 36% em massa dá **0,943**. Os percentuais de erro calculados
sobre o número errado (5,1% e 4,0%) viraram 5,6% e 3,5%. Uma linha de vinho com
"real 0,990" e uma coluna de "valor aceito" para óleo, leite, mel e creme eram de
memória. **Corrigido** na pesquisa; um teste nasce da correção (`40% em volume
são um terço em massa, e não 36%`).

### 3. MÉDIO — peso de porção do USDA não é densidade medida

Era a saída que parecia tornar o modelo composicional desnecessário. A água
passa (1,0009); o creme de leite fresco dá ~1,01 em três porções coerentes entre
si e incoerentes com a própria composição (deveria ficar perto de 0,99). Nenhuma
porção declara proveniência. **Não entrou no motor**; registrado na pesquisa como
fonte de candidato, não de número.

### 4. BAIXO — defeito na própria fonte

O NBS 457 imprime 12.644 lb ao lado de 5,744 g (95 °Brix, 15 °C). A grama fecha
com a curva; a libra coerente é 12,664. Conferido a 500 dpi: é impressão, não
scan. O motor usa a grama; o dado guarda a libra como a fonte publicou e o teste
nomeia a célula como exceção.

### 5. BAIXO — citação com numeração da obra errada

A Parte IV-A citava a OIML como "19.5 §4", numeração do ASHRAE. O trecho está na
p. 5, §4. **Corrigido.** O commit `8cdbe9c`, já empurrado, repete o erro na
mensagem; fica registrado aqui.

## Segurança

Agente `security-auditor`: **nenhum achado** em nenhuma severidade.

- Custo medido: `massFractionFromVolume` (bisseção de 60 passos) ~0,67 ms por
  chamada; um catálogo de 200 itens, ~55 ms. Sem risco por tecla.
- Toda função exportada recusa `NaN`, `±Infinity`, negativo e fora de faixa antes
  de calcular; nenhum caminho devolve `NaN`.
- Índices de array só vêm de `bracketIn` sobre grades literais; entrada externa
  não alcança índice fora do array.
- Sem dependência nova, nada de `references/` no commit, URLs novas em domínios
  oficiais (oiml.org, nist.gov).
- Nota: os arrays de dados são `readonly` só em tipo, sem `Object.freeze` — o
  mesmo padrão de todo o repo; não vira achado.

## Revisão de código

Agente `code-reviewer`. A primeira tentativa morreu por limite de sessão do
modelo; a segunda, com outro modelo, rodou inteira. Conferiu contra as imagens
dos PDFs, e não só contra a pesquisa: leu as 100 células do NBS, bateu os
coeficientes um a um com a p. 13 e mutou cada algarismo dos coeficientes ±1
(1.461 mutações) — nenhuma passa pela suíte desviando mais de 0,005 kg/m³.
Aprovou fórmula, coeficientes, bisseção, interpolação e transcrição. Achou:

### R1. ALTO — o motor ignorava os pesos de latão que a circular declara

**Conferido na imagem da p. 2:** "for brass weights (density, 8.4)". Eu tinha
lido só o ar da p. 28 e escrito, em código, teste e pesquisa, que o empuxo dos
pesos "não é declarado". O resto de +0,01 a +0,025% na conferência com a OIML
era isso. **Corrigido:** `NBS_BRASS_WEIGHT_DENSITY`, citação da p. 2, conversão
`W/V·(1 − ρ_ar/ρ_latão) + ρ_ar`. A diferença entre as fontes caiu para no máximo
0,0106%, alternando de sinal; a tolerância do teste caiu de 0,03% para o
arredondamento do grama impresso (0,0133%). A mesma página mostra que a circular
usou 453,5924 g por libra; o teste da redundância passou a usar esse número.
Prova: tirar o latão derruba o teste entre fontes.

### R2. MÉDIO — nenhum teste conferia um valor interpolado

Os pontos fora da grade eram todos pontos médios, e os testes só conferiam
ordem. Elevar o peso ao quadrado passava por todos, errando 0,5%. **Corrigido:**
51 °Brix a 12 °C contra a ponderação dos quatro cantos escrita à mão. Prova: a
mutação derruba o teste.

### R3. MÉDIO — "a interpolação erra menos que o arredondamento" era falso

0,63 g é maior que os 0,5 g do arredondamento. **Corrigido** no motor e na
pesquisa ("0,014%, da ordem do arredondamento"), e o teste foi para os dados,
com o limite que a frase afirma.

### R4. MÉDIO — autoria do NBS 457

**Conferido na folha de rosto:** "By Carl F. Snyder and Lester D. Hammond".
**Corrigido** para autores pessoais, com a instituição no nome curto, como nos
Documentos da Embrapa.

### R5. MÉDIO — 54 coeficientes, não 44

**Corrigido** em código, teste, pesquisa, relatório, LEARNINGS e memória. As
mensagens dos commits `8cdbe9c` (já empurrado), `66f28e5` e `55267fe` repetem
"44" e ficam como estão; este relatório é o registro.

### Baixos

- **Ano da OIML** divergia entre `books.ts` (1973) e pesquisa (1975). Fica 1973,
  o da Recomendação, com nota de que o arquivo é a tradução inglesa. Corrigido.
- **Pesquisa commitada depois dos dados** (`66f28e5` antes de `55267fe`). Os dois
  entram juntos no merge; fica registrado.
- **Tolerâncias mais largas que a menor que passa.** Máximo da água: de 3,8–4,2 °C
  para exatamente 4,0 (a varredura de décimo em décimo cai lá). Teor 0,43015: de
  duas casas para cinco. Corrigido.
- **Libras sem rede além da redundância.** Acrescentado teste de suavidade da
  coluna de libras (0,005–0,009). Medido: pega 115 dos 223 erros de ±0,001–0,002
  lb que escapam da redundância — rede parcial, e o comentário diz o número.
  Prova: 8,500 → 8,502 a 5 °Brix e 10 °C passa pela redundância e cai aqui.
- **Comentário da bisseção** ("erro abaixo de 10⁻¹⁸") não se sustenta em ponto
  flutuante; corrigido para "~10⁻¹⁶, por volta do passo 53".
- **Galão** foi para `src/lib/units.ts`, ao lado da onça líquida, com teste.
- **Tupla `[libras, gramas]`** ganhou nomes no tipo (`GallonWeight`) e é lida por
  desestruturação.
- **Itálico a 15 °C.** A p. 27 diz que também houve extrapolação a 15 °C, impressa
  em tipo normal porque coincidiu com a tabela de Plato a 15°/15° C. O motor
  segue o itálico; o dado ganhou a frase, para ninguém "consertar" depois.

## Decisões que ficaram, com o porquê

- **Duas réguas, não três — na primeira rodada.** O modelo composicional ficou
  fora por falta de fonte aberta alcançável. Revertido na segunda rodada (abaixo).
- **Densidade verdadeira, em g/mL.** É a grandeza da OIML e a unidade que o repo
  já usa. A balança lê peso no ar, ~0,12% abaixo — irrelevante na cozinha e
  declarado nos comentários.
- **Álcool só de 0 a 40 °C.** A fórmula vale de −20 °C, mas abaixo de zero a
  mistura pode estar congelada e a curva de congelamento não foi transcrita.
- **Calda só de 10 a 30 °C.** É o que a fonte mede. Calda quente devolve nulo.
- **As duas obras entram como `official`.** Ficam fora da estante da home, mas
  aparecem no JSON-LD e no `llms.txt`, que listam toda a estante — antes de a
  página existir. Aceito conscientemente; resolve-se quando a calculadora sair.

## Pendências

- ~~Fonte para os coeficientes do Choi & Okos~~ — resolvida na segunda rodada.
- Densidade medida de líquido gorduroso, para conferir o coeficiente da gordura.
- Recorte do catálogo de líquidos — decisão de produto.
- Página da calculadora (skill `nova-calculadora`).

---

# Segunda rodada — o modelo composicional

**Commits:** `de7ba6e` (modelo) e o seguinte (correções da revisão e da
auditoria). O dono autorizou citar o ASHRAE e pediu nova tentativa pelo
Internet Archive.

## Verificação

| Etapa | Resultado |
| --- | --- |
| `pnpm verify`, cache de tipos apagado, estado final | **exit 0** — 1389 testes em 73 arquivos |
| `pnpm test:e2e` em `de7ba6e` | **404 de 404**, rodada completa, com a máquina sem a carga externa |
| `pnpm test:e2e`, estado final | **404 de 404** |
| Testes do modelo composicional | 29 |
| Prova por mutação | carboidrato 1599,1 → 1509,1: caem os testes contra o NBS · normalizar a equação (6): cai o exemplo do ASHRAE · e cada uma das seis travas novas removida derruba exatamente o seu teste (folga de ponto flutuante, chave desconhecida, leitura pelo protótipo, fibra maior que o total, estouro da mistura, álcool) · fibra 1311,5 → 1131,5: **não cai nada** (declarado) |

## Arquivos

- `src/data/density/composition.ts`, `src/lib/density/composition.ts` (+ teste)
- `src/data/books.ts` — `ashrae-refrigeration` (`book`, `chapter`), `fricke-becker-2001` (`article`, `page`) e o `kind: 'article'`
- `src/lib/structured-data.ts` (+ teste), `src/app/llms.txt/route.ts`, `src/data/citations.test.ts`

## O que a própria rodada achou

- **Teste de recusa de álcool passava pelo motivo errado.** Com a trava removida,
  o destilado seguia recusado pela checagem da soma. Achado por mutação; a
  primeira correção ainda dependia da tolerância (ver R3).
- **Fibra sem caso-verdade.** Nenhuma fonte exercita o coeficiente; corrompê-lo
  não derruba nada. Custo medido: 0,13% no suco de ameixa. Declarado.
- **Dois artigos dos mesmos autores.** A pista "Becker & Fricke, 1999" e o
  arquivo "Fricke & Becker, 2001" são trabalhos diferentes; o cap. 19 cita os
  dois. O recuperado é o de 2001.

## Revisão de código

Agente `code-reviewer`. Conferiu os seis coeficientes nas imagens das duas
fontes (a 300 dpi), recalculou o exemplo 4, o viés da água e os erros contra o
NBS (85 células) — tudo confere. Rodou 21 mutações numa cópia fora do repo.
Achou:

### R1. ALTO — pesquisa e relatório fora do commit

Estavam na árvore de trabalho esperando a revisão. **Entram no commit das
correções.** A regra do projeto é que a pesquisa preceda os dados; neste branch
o commit do modelo veio antes do texto que o autoriza.

### R2. ALTO — "recusa fibra contada duas vezes" era falso

A checagem da soma só recusava a ameixa, e por 0,0001; as outras dez bebidas da
Tabela 3 passavam errando até 0,33%. **Corrigido pelo contrato**, não pela
detecção: o motor recebe `totalCarbohydrate` e `fiber` como a tabela imprime e
subtrai por dentro; fibra maior que o total é recusada. O erro deixou de ser
possível.

### R3. ALTO — bordas 0,99 e 1,01 recusadas por ponto flutuante

`Math.abs(0,99 − 1)` = 0,010000000000000009. **Corrigido** com folga explícita
de 10⁻⁹ e testes das quatro bordas.

### Médios e baixos, todos aplicados

- **Teste do álcool ainda dependia da tolerância**: com ela em 0,004 e a trava
  removida, passava de novo. Agora usa frações que somam exatamente 1 sem o
  álcool. Também entrou o caso do exemplo 4 (soma 1,0034) passando pelo motor,
  que é o motivo escrito da tolerância.
- **Chave desconhecida era ignorada**: `{ ethanol: 0,005 }` furava a trava do
  álcool. Recusada agora (`Record<keyof Composition, true>` + `Object.hasOwn`).
- **Bordas 100 °C e 150 °C, álcool negativo e NaN** sem teste — acrescentados.
- **Limites da calda**: `> 0,003` virou `≥ 0,0035`; o teste até 70 °Brix passou
  a fixar as duas pontas e a exigir que haja células.
- **Inclinação do carboidrato**: a revisão mediu que passava de −0,36 a −0,31.
  Com os limites apertados, remedido: −0,3105 a −0,3090. O comentário diz o
  número novo — e registrou-se no LEARNINGS que eu tinha copiado o antigo antes
  de apertar os testes.
- **Janela de temperatura validada** (10–30 °C) menor que a de resposta
  (0–100 °C), com o erro crescendo com o calor. Declarado nos dados e na
  pesquisa.
- **Afirmação sem fonte em `books.ts`** ("os autores escrevem o capítulo"): o
  cap. 19 é atribuído ao TC 10.5. Trocada pelo que se cita: o cap. 19 cita o
  artigo (p. 19.25).
- **"6% or less"** é sobre as equações das Tabelas 1 e 2, não sobre a densidade
  de um alimento. A constante que convidava a tela a dizer "erra até 6%" saiu, e
  a pesquisa diz o que a frase cobre.
- **Citações do ASHRAE com fólio**: `cap. 19, pp. 19.1–19.2, Tabelas 1 e 2` e
  `p. 19.6, equação (6); p. 19.11, Example 4`.
- **`publisher` com "nº"** em português saindo no JSON-LD: virou `HVAC&R Research 7(4)`.
- **Teste do JSON-LD reimplementava o mapeamento**: acrescentado
  `getBook('fricke-becker-2001').kind === 'article'` em `citations.test.ts`.
- **JSDoc deslocado** em `structured-data.ts`: cada comentário no seu lugar.
- **Números menores**: fibra "~0,12%" → 0,13%; "reproduz tudo" → o gelo entra
  como a página imprime, o motor não o calcula.

## Segurança

Agente `security-auditor`: 0 crítico, 0 alto, 0 médio, **2 baixos**, ambos
aplicados.

- **SEV-001** — `composition[constituent]` subia a cadeia de protótipo:
  `Object.create({ water: 1 })` respondia como água. Leitura agora só por
  propriedade própria. Teste e mutação.
- **SEV-002** — `mixtureDensity` com densidade subnormal estourava para
  `1/∞ = 0`. Agora devolve nulo. Teste e mutação.

Confirmado seguro: o JSON-LD escapa todo `<` (o `&` de "HVAC&R" é seguro ali); a
URL do Wayback é uma requisição HTTPS só, sem conteúdo misto; o link de citação
usa `rel="noreferrer"` sem `target="_blank"`; nenhuma dependência nova.

## Decisões, com o porquê

- **Modelo publicado, não híbrido.** A água da OIML melhoraria a média contra o
  NBS (0,30% contra 0,42%), mas seria um modelo que nenhuma fonte publica. O viés
  da água fica declarado e testado.
- **Sem normalizar as frações**, como o exemplo resolvido do ASHRAE.
- **Fibra pelo contrato**, não pela soma.
- **Soma dentro de 1 ± 0,01**, com folga de ponto flutuante: cobre arredondamento
  de tabela, e só isso.
- **Recusa álcool e chave desconhecida.**
- **Artigo não é livro**: `kind: 'article'`, fora da vitrine, `ScholarlyArticle`.
- **ASHRAE como `book` aparece na estante da home** antes de a página de
  densidade existir — a revisão confirmou que contraria o texto da estante
  ("toda proporção exibida aponta para uma delas"). Aceito até a página sair;
  alternativa é segurar o merge deste branch até lá.
