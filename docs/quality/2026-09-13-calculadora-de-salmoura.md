# QA — Calculadora de salmoura

Data: 2026-09-13 · Branch: `feature/glossary-sources`
Pesquisa: `docs/research/salmoura.md`

## Escopo

Sétima calculadora do site. Entrada: peso da proteína e método. Saída: sal,
líquido e açúcar em gramas, tempo, força da salmoura pronta, e a mesma dose
convertida em colher de chá das duas marcas de sal kosher — como conferência,
nunca como resposta.

Cinco métodos: salga seca (Food Lab), salmoura de equilíbrio injetada para ave e
salmoura doce para carne (Modernist at Home), salmoura de imersão para peixe e
cura rápida de peixe (Modernist at Home).

## Verificação

| Etapa | Resultado |
|---|---|
| `pnpm lint` | limpo |
| `pnpm typecheck` | limpo (com `tsconfig.tsbuildinfo` apagado antes) |
| `pnpm test` | 650 testes, todos passando |
| `pnpm build` | gera `/salmoura`, `/en/brine` e os cards `og/brine-pt` e `og/brine-en` |
| `playwright test` | 270 testes, todos passando |

Sabotagem: trocando 48 por 16 colheres de chá por xícara em `salt.ts`, cinco
testes falham — inclusive o que confere a densidade contra a segunda fonte. A
conversão que sustenta a calculadora inteira está coberta.

## Apontamentos

### 1. A bibliografia do projeto estava errada — **média** — corrigido

`docs/research/bibliografia-candidata.md` §2 afirmava que a divergência era
"equilíbrio do Modernist mirando cerca de 0,5% de sal final na carne, enquanto a
salga seca do Food Lab parte de 0,85% sobre o peso da proteína", e concluía:
"números diferentes que descrevem produtos diferentes".

Lidas as duas fontes, os números são **0,6%** e **0,625%** — uma diferença de
menos de 0,3 g num quilo de carne. **As duas fontes concordam sobre o sal.** A
divergência real é sobre a água: Modernist injeta 10% do peso, Food Lab não usa
nenhuma. Documentado em `salmoura.md` §4, corrigido na bibliografia, e virou
conteúdo da página — dizer que duas fontes concordam é raro aqui e vale tanto
quanto apontar onde brigam.

De onde saía o 0,85%? Não consegui rastrear. Nenhuma das duas obras publica esse
número; a hipótese mais provável é que tenha vindo de memória ou de uma fonte
terceira não registrada. É exatamente o motivo de a regra do projeto exigir
pesquisa antes de código.

### 2. Página do Food Lab errada numa citação de glossário — **baixa** — corrigido

O verbete `kosher-salt` citava `foodlab, p. 34` para a discussão sobre tipos de
sal. Conferido no arquivo, o trecho está na **p. 81**. As outras cinco páginas
citadas do mesmo livro (291, 360, 577, 578, 579) foram conferidas uma a uma
contra os marcadores de página do EPUB e estão certas.

### 3. Precisão de tabela arredondada — **baixa** — evitado por desenho

A coluna "SCALING" do Modernist arredonda: 10 g de sal em 750 g de carne são
1,333% e o livro imprime 1,3%. Usar a porcentagem impressa daria 9,75 g em vez
dos 10 g da receita. Os métodos guardam **os pesos publicados** e derivam a
proporção deles, como os presets de geleia guardam as onças de Saunders. O teste
reproduz cada uma das quatro receitas ao grama.

## Segurança

Revisão feita à mão. Nada aberto ao fim.

- **Entrada não confiável**: `parseBrineState` confere o `methodId` contra o
  catálogo e o peso contra faixa finita. Teste cobre `__proto__`, `constructor`,
  string no lugar de número, `NaN`, `Infinity`, negativo e campo faltando.
  Trocar um id por outro num link não é inócuo: a salmoura de peixe tem treze
  vezes o sal da de ave.
- **Rótulo por chave de fora**: o texto compartilhado e a folha impressa leem o
  nome do método por `labelFor`, com `Object.hasOwn`.
- **Divisão por zero**: `saltInLiquid` só divide quando há líquido, e devolve
  zero quando não há — mais honesto que devolver 100%. O subtítulo do cartão
  divide por `Math.max(1, proteinGrams)`.
- **ReDoS**: não há expressão regular no caminho da calculadora.

## O que ficou pendente

- **Peso do sal brasileiro.** Sal refinado e sal grosso não têm densidade
  publicada em nenhuma obra da estante. A tabela de colheres fica só nas duas
  marcas americanas que Ruhlman & Polcyn pesaram, declarado como tal. A saída em
  gramas resolve na prática.
- **Tempo por espessura.** Nenhuma das duas fontes publica tabela de tempo por
  espessura de peça para salmoura de imersão. Sem tabela, não há cálculo.
- **Aves e carnes já injetadas de fábrica**, que chegam com solução salina. Food
  Lab avisa que os testes dele usaram peças "nonenhanced". Salgar por cima soma
  sal, e a calculadora não tem como saber quanto — fica como aviso de texto.
- **Camarão, molusco e vegetal**: sem dose pesada nas fontes lidas.
