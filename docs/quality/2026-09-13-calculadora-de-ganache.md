# QA — Calculadora de ganache

Data: 2026-09-13 · Branch: `feature/glossary-sources`
Pesquisa: `docs/research/ganache.md`

## Escopo

Oitava calculadora. Entrada: peso do creme, textura desejada e tipo de
chocolate. Saída: chocolate e manteiga da tabela de Wybauw, manteiga de cacau
extra no branco, total, água da receita, e o prazo de validade.

**Destravou uma calculadora que a bibliografia dava como bloqueada.** O plano era
o Greweling, cujo PDF é digitalização em imagem — 200 páginas sem camada de
texto. O Wybauw, que estava na estante como bônus fora da lista original, tem 545
páginas com texto extraível e traz mais do que o Greweling daria: além da tabela
de proporções, atividade de água por ingrediente e prazo de validade.

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo (com `tsconfig.tsbuildinfo` apagado antes) |
| `pnpm test` | 692 testes, todos passando |
| `pnpm build` | gera `/ganache`, `/en/ganache` e os dois cards de OG |
| `playwright test` | 296 testes, todos passando |

## Apontamentos

### 1. Transcrição de PDF com ruído — **alta** — mitigada por desenho

A fonte é um PDF cuja extração troca caracteres: "TOO" por "100", "IO%" por
"10%", "Awo.81" por "Aw 0.81". Transcrever tabela daí é exatamente onde este
projeto já se queimou.

O que salvou: **o livro publica a mesma tabela duas vezes**, em razão e em
porcentagem. As quatro linhas de porcentagem somam 100 exatos e ficam a menos de
um ponto e meio das razões. Se eu tivesse lido 120 onde está 130, nada fecharia.
Há teste para as duas formas, e o comentário no teste explica por que a
redundância é o caso-verdade aqui.

### 2. As porcentagens do livro não são o arredondamento das razões — **média** — documentado

Descoberto ao escrever o teste, que falhou com tolerância de meio ponto. Na linha
"pipe", 100:120:25 dá 40,8 / 49,0 / 10,2 e o livro imprime 40 / 50 / 10 — a
primeira trunca e a segunda sobe um ponto inteiro, porque as porcentagens foram
ajustadas para fechar em 100. O próprio texto diz "in percentages this is on
average".

Consequência: a calculadora guarda **a razão**, e o teste usa tolerância de 1,5
ponto contra a porcentagem, com o motivo escrito. Tolerância frouxa sem
explicação seria teste fraco; com a explicação, é a leitura correta da fonte.

### 3. Paginação do PDF não confirmada — **média** — evitado

O offset entre página do PDF e impressa é 1 nas quatro páginas em que a margem é
legível, e não há marcação legível no fim do volume. Mesmo caso do `Charcuterie`
nesta mesma leva. `locator: 'chapter'`, citação por seção.

### 4. Asserção de e2e que passava por motivo errado — **média** — corrigido

`getByRole('term', { name: ... })` **nunca casa**: `term` não é um papel que
recebe nome acessível a partir do conteúdo. A asserção de que a linha de manteiga
de cacau extra não existia com chocolate amargo passava porque a busca não achava
nada nunca — inclusive depois de trocar para branco, que é quando o teste
finalmente falhou e denunciou os dois lados.

Correção com ganho real: a seção de resultado ganhou `aria-labelledby`. Um
`<section>` sem nome acessível não é landmark, então quem navega por regiões não
achava o resultado que a página acabava de recalcular. Agora acha, e o teste
escopa nele.

### 5. Colisão na estante da home — **baixa** — corrigido

O teste "mostra a estante inteira" quebrou: o cartão de cada calculadora nomeia
as obras em que ela se apoia, juntando os títulos com " · ". Com **uma fonte só**
— a ganache é a primeira — esse cartão vira um nó cujo texto é exatamente o
título do livro, e a busca global acha dois. O teste passou a olhar dentro da
estante, que é o que ele sempre quis dizer.

### 6. "Ganache" é a mesma palavra nos dois idiomas — **baixa** — corrigido

O teste que exige que todo texto difira entre pt-BR e en pegou
`calculators.ganache.name`. Entrou na lista de exceções, ao lado de `gelato`.

## Segurança

Revisão à mão. Nada aberto.

- **Entrada não confiável**: `parseGanacheState` confere textura contra o
  catálogo, tipo de chocolate contra a lista e o peso contra faixa finita.
  Teste cobre `__proto__`, `constructor`, string no lugar de número, `NaN`,
  `Infinity`, negativo e campo faltando. Trocar `truffle` por `cut` num link
  muda a receita de quem abre em dois terços.
- **Rótulo por chave de fora**: `labelFor` no cartão de receita.
- **Divisão por zero**: `waterShare` só divide quando o total é positivo.
- **ReDoS**: sem expressão regular no caminho.

Nota de processo: durante a extração, um `grep -o` com quantificadores abertos
travou por mais de dois minutos no arquivo de 156 mil palavras — o mesmo custo
quadrático que o `LEARNINGS.md` já registra para o leitor de receita colada. Não
afeta o site; afeta quem repetir a extração.

## O que ficou pendente

- **Greweling** continua sendo o contraponto que falta, e continua dependendo de
  OCR conferido à mão. Enquanto isso, esta é a única calculadora do site com uma
  fonte só, e a página declara isso em vez de disfarçar.
- **Correção para couverture fora de 36–38% de manteiga de cacau.** Wybauw avisa
  que muda e não publica quanto.
- **Cálculo de Aw da receita.** Não é média ponderada; a tabela medida entra, a
  estimativa não.
- **Ganaches com açúcar invertido, glicose, sorbitol e glicerol**, que são as
  alavancas do livro para baixar Aw. Efeito qualitativo publicado, dose por
  receita não.
