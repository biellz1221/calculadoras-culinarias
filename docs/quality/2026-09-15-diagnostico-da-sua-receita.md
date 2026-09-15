# QA — Confira a sua receita, nas nove calculadoras

**Data:** 2026-09-15
**Branch:** `feature/diagnostico-receita`
**Escopo:** o sentido inverso do site. Até aqui toda calculadora ia de alvo para
receita; agora a pessoa traz os pesos dela e o site diz onde aquilo cai dentro
do que as fontes publicam — e, quando cai fora, quanto de **um** ingrediente
traria a receita de volta.

Nenhum número novo entrou. Toda métrica compara contra faixa ou receita que já
estava publicada, citada e na página.

---

## Resultado da verificação

| Passo | Resultado |
| --- | --- |
| `pnpm verify` | **exit 0** |
| Vitest | **1094 testes / 70 arquivos** (eram 937 / 57) |
| Playwright | **386 passando** (eram 366) |
| `npx tsc --noEmit` com cache limpo | sem erro |
| `pnpm audit` | sem vulnerabilidade conhecida |

**Sobre os agentes de QA**: o `code-reviewer` e o `security-auditor` foram
lançados e morreram no meio, os dois por limite de sessão da API. A revisão
abaixo foi feita à mão, com as mesmas perguntas que eles levavam — e uma delas
achou um bug (§7).

---

## O que entrou

**Núcleo** — `src/lib/audit/` (contrato, `solveDominant`, os dois construtores de
métrica), `src/components/audit/` (`LineEditor`, `AuditReport`), `fillTemplate`
em `src/i18n/format.ts`, bloco `audit` nos dicionários do site.

**As nove**, cada uma com motor próprio em `src/lib/<calc>/audit.ts`:

- **pão** — segundo modo de entrada, digitando ingrediente por ingrediente ao
  lado do texto colado; hidratação e sal com o peso que resolve cada faixa.
- **gelato** — a frase de correção nas oito métricas que ele já calculava.
- **picles** — confere o sal de um pote já montado, nas duas leituras.
- **massa fresca, geleia, ganache, salmoura** — painéis novos.
- **cura e gelificantes** — auditoria inversa: o que você pesou, lido de volta.

**De quebra**: a régua `RangeRule`, que estava triplicada em pão, massa e picles,
passou a morar em `src/data/ranges.ts`; cada página ganhou duas regiões
navegáveis onde não tinha nenhuma.

---

## Apontamentos

### 1. ALTO — faixa de largura zero não é faixa, e a receita publicada se acusava

Boa parte da tabela de gelificantes publica **dose única** (0,7% de ágar no gel
fluido de cebola). Comparada com `statusFor`, que não tem tolerância, a própria
receita do livro voltava como "acima da faixa": 3,5 ÷ 500 × 100 não devolve 0,7
em ponto flutuante, devolve 0,7000000000000001.

Pegou no teste de motor, na primeira rodada, com o caso-verdade da própria
fonte — que é exatamente para isso que ele existe.

**Corrigido**: onde a fonte publica ponto, a comparação é por `metricFromPoint`
com tolerância vinda da precisão da própria fonte. Vale para ganache (a tabela
do Wybauw anda de 10 em 10 por 100), salmoura (o Modernist publica gramas
inteiras) e gelificantes (uma casa decimal). A geleia reusa a tolerância que o
motor dela já tinha, agora com nome — `SUGAR_RATIO_TOLERANCE` — porque duas
tolerâncias seriam duas respostas para a mesma pergunta.

### 2. ALTO — três páginas ficaram com dois títulos iguais

O e2e pegou o que nenhum teste de unidade pegaria: `getByRole('heading')` achou
dois "Farinha por grama de ovo" na página de massas, dois "Sal sobre o pote" na
de picles, dois "Nitrito de entrada" na de cura. O painel de balanço e o de
auditoria falavam do mesmo assunto com a mesma palavra.

**Corrigido** com nome próprio para o da auditoria, que ficou melhor de ler:
"O seu sal sobre o pote" diz de quem é o sal.

### 3. MÉDIO — controle duplicado é diferente de título duplicado, e não se resolve renomeando

Dezoito e2e antigos quebraram porque "Bola de trufa", "Equilíbrio, ave" e "Cura
seca em peça inteira" passaram a existir duas vezes por página. Aqui renomear
seria pior: é o mesmo conceito, e inventar um segundo nome para a bola de trufa
confundiria quem lê.

**Corrigido** dando a cada ferramenta uma região com nome (`CalculatorTool`), e
nome acessível às seções (`aria-labelledby` em `CalculatorSection`). A página
tinha zero landmarks e passou a ter dois por ferramenta; os testes ganharam como
dizer de qual das duas estão falando.

**Erro cometido no caminho, e registrado**: a primeira tentativa usou o título da
página como `aria-label` da região. `aria-label` entra na busca por rótulo, e a
seção "Massa fresca para o número de **pessoas** à mesa" passou a responder por
`getByLabel('Pessoas')` — quebrou três testes que estavam passando. O nome da
região é curto desde então.

### 4. MÉDIO — `toPass` com ação que acumula estado

Um e2e novo clicava em "acrescentar ingrediente" dentro do laço de repetição.
Cada tentativa somava uma linha, e o teste morreu com 14. **Corrigido**: dentro
do laço só entra ação idempotente.

### 5. BAIXO — o `LineEditor` não tinha teto de linhas

Todo `parse…State` do repo limita cardinalidade (40 no pão, 50 no picles); a
lista nova não limitava nada. Não é entrada não confiável — vem de campo de
formulário, não de URL —, mas é um campo que a pessoa trava sozinha segurando a
tecla. **Corrigido**: `MAX_AUDIT_LINES = 50`, com o botão desabilitado no limite
e teste.

### 6. BAIXO — a nota da cura repetia a promessa da página

O painel novo repetia "não certifica conformidade com a norma brasileira", que a
seção dos limites já carrega. Além de quebrar o e2e por ambiguidade, é ruído.
**Corrigido**: a nota agora diz só o que é dela — que esta leitura é de
**entrada**, enquanto o limite brasileiro é de resíduo.

### 7. BAIXO — duas chaves de dicionário sem interface

A varredura de chaves `audit.*` contra o que os componentes renderizam achou
duas órfãs no bloco compartilhado: `yourValue` e `correctionLead`. O typecheck
não pega — chave a mais num dicionário é legal —, e é o mesmo bug silencioso que
deixou a gelana e a metilcelulose sem comportamento na tela.

**Corrigido**: `correctionLead` ganhou interface, e é conteúdo que faltava — diz
que a sugestão mexe num ingrediente só, uma vez por relatório em vez de em cada
linha. `yourValue` era redundante com o próprio valor exibido e saiu.

---

## Segurança

Feito à mão, com o roteiro que o `security-auditor` levava:

| Frente | Resultado |
| --- | --- |
| Acesso a objeto por chave de fora | `labelFor()` e `fillTemplate()` usam `Object.hasOwn`, os dois com teste de `__proto__` |
| ReDoS | Um regex novo: `/\{([a-zA-Z]{1,20})\}/g`. Classe simples, quantificador com teto, sem aninhamento |
| Entrada não confiável | Os nove `*AuditInput` vêm de `useState` local alimentado por campo de formulário. Nada nesta versão vem de URL nem de `localStorage` |
| DoS no cliente | Era a lacuna real: lista sem teto. Fechada em §5 |
| XSS | Nenhum `dangerouslySetInnerHTML` novo |
| Dependências | Nenhuma nova; `pnpm audit` limpo |

As três asserções `as keyof` novas (`dict.methods[item.id as keyof …]`) indexam
com id vindo de catálogo interno — `CURE_SALTS`, `BRINE_METHODS`,
`GANACHE_TEXTURES` —, não de entrada do usuário, e repetem o padrão que os
calculadores já usavam. Não é o caso do `__proto__`, que vinha de URL.

**Prova de que os testes pegam o que dizem pegar**: a proteção de `labelFor` foi
desfeita à mão para ver o teste falhar, e `solveDominant` teve o piso dividido
por dois para ver os invariantes falharem em sete calculadoras. As duas
correções foram refeitas com a mesma ferramenta que as desfez.

---

## Decisões que ficaram, com o porquê

- **A correção do gelato aponta a grandeza, não um ingrediente.** Num gelato o
  açúcar vem de três ou quatro linhas ao mesmo tempo, e acrescentar qualquer uma
  muda a massa total, que é o denominador das oito métricas. A frase diz "neste
  lote de X" porque é aí que ela é exata. Resolver o sistema inteiro continua
  sendo o `autoBalance`, intocado.
- **Açúcar e gordura ficaram fora da leitura do pão**, embora tenham faixa
  citada: o classificador de linhas não os separa de "outro", e adivinhar o papel
  daria porcentagem de algo que ninguém declarou. Ampliar `ROLE_WORDS` é tarefa
  própria — foi assim que "leite integral" virou farinha uma vez.
- **Fonte que publica receita não ganha vocabulário de faixa.** Geleia, salmoura
  e três das quatro texturas de ganache comparam com receita: a tela diz "acima
  da fonte", não "fora da faixa". Acusar de erro quem seguiu outra receita
  publicada seria mentir sobre o que a fonte diz.
- **Zero numa fonte não é alvo, é ausência.** A salga seca não tem líquido nem
  açúcar publicados, então essas leituras somem em vez de reportar qualquer
  pitada como "acima da fonte".
- **`positive()` continua duplicada nos motores.** São sete cópias de uma linha,
  e o repo já fazia isso antes desta tarefa (`src/lib/pickles/brine.ts`).
  Seguir o vizinho é a regra de desempate do manual; extrair criaria acoplamento
  entre nove motores por uma comparação trivial.
- **O estado dos painéis fica fora do link e do `localStorage`**, como o
  `ScalePanel` do pão já fazia. Diagnóstico é conferência, não receita a guardar.
  Se um dia precisar viajar, o tipo já existe e entra nos `parse…State` de forma
  aditiva — e aí nas nove de uma vez.

---

## O que ficou pendente

- **`src/components/bread/scale-panel.tsx` tem 348 linhas**, acima do teto de 300.
  Já estava em 332 antes desta tarefa. O modo de entrada digitada é candidato
  natural a componente próprio.
- **Ampliar `ROLE_WORDS`** para açúcar e gordura destravaria duas métricas já
  citadas no pão.
- **Parser de texto colado só existe no pão.** A arquitetura aceita plugar nas
  outras: o `LineEditor` entrega `AuditLine`, que é o que `parseRecipeText`
  produz.
