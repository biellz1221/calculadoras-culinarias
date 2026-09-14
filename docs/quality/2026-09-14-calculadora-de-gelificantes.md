# QA — Calculadora de gelificantes, e uma conferência atrasada

**Data:** 2026-09-14
**Branch:** `feature/gelling-agents`
**Escopo:** pesquisa de gastronomia molecular na estante, calculadora nova em
`/gelificantes` e `/en/gelling`, e a reconferência das quatro receitas de
salmoura que já estavam no ar.

Pesquisa em [`docs/research/gelificantes.md`](../research/gelificantes.md).

---

## Resultado da verificação

| Passo | Resultado |
| --- | --- |
| `pnpm verify` | **exit 0** |
| Vitest | **864 testes / 53 arquivos** (eram 814 / 52) |
| Playwright | **356 passando** (eram 332) |
| `npx tsc --noEmit` com cache limpo | sem erro |

---

## Apontamentos

### 1. CRÍTICO — o livro que já estava no ar é digitalização com OCR

**Achado ao abrir a obra para um tema novo, não por suspeita.**

`pdfinfo` respondeu `Creator: ABBYY FineReader Express`. O nosso exemplar de
*Modernist Cuisine at Home* é scan com reconhecimento de texto, e a camada de
texto carrega a assinatura: `S00 mL` por `500 mL`, `ft/a` por `n/a`.

**A calculadora de salmoura está publicada com quatro receitas deste livro
desde a sua criação.** Números de salga, num site de cozinha.

**Ação:** as quatro receitas foram reabertas como imagem renderizada a 150 ppi e
comparadas linha a linha com `src/data/brine/methods.ts`.

| Receita | Página | Resultado |
| --- | ---: | --- |
| Basic Brine for Whole Poultry | 133 | confere |
| Fish Brine | 133 | confere |
| Fish Cure | 133 | confere |
| Sweet Brine for Meats | 132 | confere |

**Nada para corrigir.** A transcrição original tinha sido feita à mão contra a
página e sobreviveu. Mas a conferência precisava existir, e agora existe —
inclusive na tela, numa seção da calculadora nova que declara a natureza da
fonte.

Toda dose da calculadora nova foi extraída do mesmo jeito: imagem da página, não
camada de texto.

### 2. MÉDIO — o pedido não cabia inteiro na estante

O pedido incluía "ratios de cálcio/alginato". Varredura completa:

| Obra | Alginato |
| --- | --- |
| *Modernist Cuisine* vol. 1 | 12 menções, nenhuma dose — remete ao vol. 4 |
| *Modernist Cuisine at Home* | zero |
| McGee, *On Food and Cooking* | 5 menções: o mecanismo, sem número |
| McGee, *Keys to Good Cooking* | zero |

**Esferificação não entrou.** O mecanismo virou verbete de glossário com citação
do McGee, e a página tem uma seção que diz em voz alta que a dose não existe na
nossa bibliografia e qual livro a traria. É a mesma decisão do kubaneh na semana
passada e da araçá antes dele.

### 3. MÉDIO — a regra não reproduz a receita, aproxima

Primeira versão do teste afirmava que 0,8% de 530 g de líquido devolve as 4,3 g
de gelatina que a fonte imprime. **Devolve 4,24 g.** O teste caiu, e estava
certo em cair: eu tinha escrito a afirmação forte antes de fazer a conta.

O que sobrevive é mais fraco e mais verdadeiro: as duas concordam a 1,4%, o
livro arredondou a própria receita para cima, e o que a conta realmente fixa é
**o que o livro conta como líquido**. Há um teste para isso também — com o
açúcar dentro a distância quadruplica, e só com os lácteos ela decuplica.

Corrigido na pesquisa, nos dois dicionários e no teste, com a tolerância e o
motivo escritos ao lado.

### 4. BAIXO — título de busca estourou o limite nos dois idiomas

`Calculadora de gelatina, ágar e goma xantana · Calculadoras Culinárias` tem 70
caracteres; o teto do buscador é 60. O teste de SEO pegou antes do commit.
Encurtado para "Calculadora de gelatina e ágar" / "Gelatin and agar calculator".

### 5. BAIXO — três citações idênticas empilhadas na mesma tabela

A revisão visual (captura da página renderizada) mostrou a mesma citação longa
repetida em três linhas seguidas, porque gelatina e as duas carragenas vinham da
mesma seção.

Corrigido separando o que é de fato de lugares diferentes: a **dose** da
gelatina está no texto de abertura da panna cotta, e o **quadro do Bloom** é
outra coisa na mesma página. Cada um cita o seu. De quebra, a coluna de
quantidade ganhou largura fixa — o cabeçalho "QUANTIDADE" e "% DO LÍQUIDO"
estavam colados.

---

## Segurança

- **Nenhuma entrada nova de rede, nenhum `dangerouslySetInnerHTML`, nenhuma rota
  de API.** O site continua estático.
- **Guardas de valor externo** em `src/lib/gelling/state.ts`: `isTextureId` e
  `isGradeId` consultam registros `Record<..., true>` com `Object.hasOwn`, o
  mesmo padrão já usado em pães e geleias. A calculadora ainda não serializa
  estado em URL, mas as guardas já existem para quando serializar.
- **Busca por chave dinâmica no dicionário** (`dict.agents[id]`,
  `dict.textures[id]`, `dict.bloom.grades[id]`) é tipada pelo próprio registro,
  e há teste cobrindo agente, textura e grau nos dois idiomas.
- **Nada de segurança alimentar nesta página.** Gelificante em excesso estraga a
  sobremesa; não adoece ninguém. Por isso não há faixa de perigo aqui — inventar
  uma seria sinalizar risco onde não há, que é o inverso do erro que a
  calculadora de picles existe para não cometer.

Sem apontamento.

---

## Pendências abertas

- **Modernist Cuisine vol. 4** — destrava esferificação, gellan e
  metilcelulose. É a compra de maior retorno da lista.
- **Segunda fonte para qualquer dose desta página.** Hoje é fonte única, como a
  ganache antes do Wybauw.
- Manuais gratuitos de fabricante (CP Kelco) — mesma pendência já aberta para
  pectina.
