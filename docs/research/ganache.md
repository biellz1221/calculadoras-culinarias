# Pesquisa — Ganache

Levantamento para a calculadora de ganache. Última revisão: 2026-09-13.

Vale a regra do projeto: nenhum número entra no código antes de estar aqui, com
obra e localizador.

**A fonte que a bibliografia previa não é a que sustenta esta calculadora.** O
plano era o Greweling, e o PDF dele é digitalização em imagem: 200 páginas sem
camada de texto, que só virariam número depois de OCR conferido à mão. O Wybauw,
que estava na estante como bônus, tem 545 páginas com texto extraível, 603
menções a ganache, a tabela de proporções por textura e — o que nenhum livro de
confeitaria costuma dar — **atividade de água e prazo de validade**.

---

## 1. Fontes consultadas

| # | Obra | Edição consultada | Como citar |
|---|---|---|---|
| 1 | **Fine Chocolates: Great Experience** — Jean-Pierre Wybauw | PDF en, Lannoo. 545 páginas com camada de texto. A paginação impressa aparece na margem em algumas páginas, mas **não se confirma em ponto distante do volume**, então citamos por seção. | *Wybauw, "..."* |

Seções lidas: "Balancing ganache recipes"; a tabela de proporções médias que a
segue; "Optimising the quality of the ganache — Emulsifying, homogenising";
"Improved shelf life in practice", com a tabela "Average water activity for
frequently used ingredients" e a de redução de Aw por aumento de chocolate;
"Freezing correctly".

**Por que não por página.** O offset entre página do PDF e página impressa é 1
nas quatro páginas em que a margem é legível, mas não há marcação legível no fim
do volume para confirmar que ele é constante. Deslocamento que não se confere de
ponta a ponta não é conversão, é chute — a mesma decisão tomada para o
`Charcuterie` (ver `docs/quality/LEARNINGS.md`, "Citar").

---

## 2. O que é uma ganache, na definição que importa para o cálculo

> "Ganaches are water/fat-based fillings. Since water does not bond with fat and
> vice versa, a bridge is required between both. Dry substances, such as sugars
> and dry cocoa, may provide a bond. The proportion of water, fats and dry
> substances must be balanced, otherwise the recipe will be disrupted. If too
> little or too much of one of these substances is present, there is a risk that
> the cream will curdle, will not be smooth, or too firm, too dry or too liquid."
> — Wybauw, "Balancing ganache recipes"

Três grandezas, e não duas: **água, gordura e matéria seca**. O que se chama de
"proporção de ganache" no jargão — 1:1, 2:1 — é um atalho para essa terceira
relação, e é por isso que trocar o chocolate muda o resultado sem que a
proporção mude.

---

## 3. A tabela de proporções

Transcrita da tabela que segue "Balancing ganache recipes". A coluna de
"substâncias moles" é definida no cabeçalho como **creme, leite, licor, açúcar
invertido, glicose etc.** — não só creme de leite.

| Resultado desejado | Substâncias moles | Chocolate | Manteiga |
|---|---|---|---|
| Ganache viscosa (bolas de trufa) | 100 | 110 | — |
| Macia (praliné moldado) | 100 | 120 | 14 |
| De bico, para cobrir depois | 100 | 120 | 25 |
| Praliné cortado | 100 | 130 a 180 | 24 a 30 |

E, em porcentagem, como o próprio livro publica logo abaixo:

| Resultado desejado | Substâncias moles | Chocolate | Manteiga |
|---|---|---|---|
| Ganache viscosa | 47% | 53% | — |
| Macia | 42% | 52% | 6% |
| De bico | 40% | 50% | 10% |
| Praliné cortado | 38% | 52% | 10% |

**As duas tabelas se conferem uma à outra**, e é isso que dá confiança na leitura
de um PDF com ruído de extração: as quatro linhas de porcentagem somam 100
exatos, e cada uma fica a menos de um ponto e meio da razão correspondente.
100:110 dá 47,6% e 52,4%, e o livro imprime 47 e 53. 100:120:14 dá 42,7%, 51,3% e
6,0%, e o livro imprime 42, 52 e 6. Se eu tivesse lido 120 onde está 130, nada
disso fecharia.

**A calculadora usa as razões, não as porcentagens** — e por um motivo mais forte
que o de costume. As porcentagens do livro **não são o arredondamento das
razões**: foram ajustadas para somar 100. Na linha "pipe", 100:120:25 dá 40,8 /
49,0 / 10,2, e o livro imprime 40 / 50 / 10 — a primeira trunca para baixo e a
segunda sobe um ponto inteiro. O próprio texto avisa: "in percentages this is on
average". A razão é o dado; a porcentagem é o resumo.

## 3.1 A qual chocolate a tabela se refere

Isto não é detalhe, e o próprio autor faz questão:

> "The majority of ganache recipes in my books are made with dark couverture with
> 36 to 38% cocoa butter and milk couverture with 36 to 37% total fat content (of
> which approximately 6% milk fat). In white chocolate, which contains
> approximately 8% milk fat of 36% total fat content, typically **2% extra cocoa
> butter must be added to the recipe for the same texture**. … Since, if the
> professional uses couverture that strongly deviates from my examples in terms
> of cocoa butter percentage, a completely different result will be reached."
> — Wybauw, "Balancing ganache recipes"

Duas consequências para a calculadora:

1. **Chocolate branco leva 2% de manteiga de cacau extra** para dar a mesma
   textura. É um número publicado, e entra.
2. A tabela vale para couverture na faixa de 36 a 38% de manteiga de cacau.
   Chocolate muito fora disso dá "a completely different result", e a página
   precisa dizer isso em vez de fingir que a proporção é universal. Wybauw
   também avisa que couverture com 70% ou mais de sólidos de cacau traz manteiga
   de cacau demais e pede menos chocolate — sem publicar quanto menos.

---

## 4. Água, e a razão de a ganache estragar

Aqui está o que separa esta calculadora de qualquer tabela de proporção que se
ache na internet. Wybauw publica os teores de água e a atividade de água (Aw):

| Ingrediente | Aw | Água |
|---|---|---|
| Creme 35% e 40% | 1,00 | 60% |
| Manteiga | 0,98–0,99 | 17% |
| Chocolate amargo, ao leite e branco | 0,35 | — |
| Leite condensado | 0,99 | — |
| Leite condensado açucarado | 0,84 | — |
| Fondant | 0,80 | — |
| Marzipã comercial | 0,72 | — |

(Aw de "Average water activity for frequently used ingredients"; os 60% de água
do creme e os 17% da manteiga do texto de "Improved shelf life in practice".)

E o que cada faixa de Aw permite crescer:

> "If the water activity > 0.9, bacteriological growth is possible of, e.g.,
> salmonella and listeria. If water activity > 0.8 fungi will thrive; > 0.75
> yeasts will grow; > 0.6 osmophilic yeasts and moulds may develop. If the water
> activity is lower than 0.6 no living organisms can flourish in the liquid and
> micro-bacteriological growth (and hence spoilage) is excluded."
> — Wybauw, "Improved shelf life in practice"

E o prazo, que é a frase que a calculadora precisa entregar:

> "Translating a product's Aw value into absolute shelf life is not that simple
> due, for example, to the varying storage conditions. Yet we are able to
> establish a large number of aspects. It is obvious that products with high Aw
> values (0.85 => 1), **such as many ganache recipes, have a shelf life of only
> 3 weeks**. Products with an intermediary Aw value (0.6 => 0.85), such as butter
> cream, have a longer shelf life, but still limited to approximately 3 months."
> — Wybauw, "Improved shelf life in practice"

E a armadilha:

> "Freezing never extends shelf life." — Wybauw, "Freezing correctly"

Com o exemplo dele: um praliné de três semanas de validade, congelado por oito
meses, continua tendo três semanas depois de descongelado.

### O que a calculadora **não** vai fazer

**Não vai calcular o Aw.** Aw não é média ponderada dos Aw dos ingredientes — é
função do que está dissolvido na água livre, do peso molecular dessas
substâncias, da temperatura e da embalagem, e o próprio Wybauw lista esses
fatores. Existe tabela medida no livro, e é essa que a página mostra; estimar um
número a partir da receita seria inventar precisão que a fonte não dá.

O que a calculadora **pode** fazer com honestidade é somar a **água** da receita,
porque os teores de água são publicados: 60% do creme e 17% da manteiga. Isso dá
a grandeza que a pessoa controla, e é a alavanca que o próprio livro indica para
melhorar a validade — "decreasing the water content", "increasing the sugar
content", "saturating the water with sugars, salts, proteins and/or fibres".

---

## 5. Divergências

Esta é a primeira calculadora do site com **uma fonte só**, e isso precisa estar
declarado na página em vez de escondido.

| Assunto | Situação |
|---|---|
| Proporção por textura | Só o Wybauw. O Greweling seria o contraponto natural e está ilegível (§7). |
| Manteiga de cacau extra no branco | Só o Wybauw, e o número é dele: 2%. |
| Aw e validade | Só o Wybauw. Nenhum outro livro da estante trata do assunto. |
| Faixa de couverture | O Wybauw declara a dele (36–38% de manteiga de cacau) e avisa que fora dela o resultado muda — mas não publica a correção. Lacuna assumida. |

Há uma divergência **interna** ao livro, e ela está registrada: a linha do
praliné cortado dá 100:130 a 180 de chocolate, e a porcentagem publicada (38/52)
corresponde ao pé da faixa. A calculadora entrega a faixa, e não a média.

---

## 6. O que a calculadora calcula

1. **Chocolate** = peso das substâncias moles × a razão da textura escolhida.
   Faixa, no praliné cortado, porque a fonte dá faixa.
2. **Manteiga** = idem, quando a textura leva.
3. **Manteiga de cacau extra** = 2% do total, só no chocolate branco.
4. **Total** da ganache pronta.
5. **Água da receita**, em grama e em porcentagem do total, a partir dos 60% do
   creme e dos 17% da manteiga.
6. **Validade**, como a fonte declara para ganache: três semanas — com o aviso de
   que congelar não estende.

O aviso destacado é o prazo. Não é faixa de segurança como o nitrito, e não é
questão de gosto como o açúcar da geleia: é o dado que quase nenhuma receita de
ganache publica e que decide se o bombom pode ser vendido na semana seguinte.

---

## 7. O que ficou de fora, e por quê

- **Greweling, _Chocolates and Confections_** — 200 páginas de imagem, sem camada
  de texto. É o contraponto que falta para esta calculadora ter divergência de
  verdade. Depende de OCR conferido à mão, e OCR de tabela erra número.
- **Cálculo de Aw.** Ver §4. A tabela medida entra; a estimativa não.
- **Correção por couverture fora de 36–38% de manteiga de cacau.** O livro avisa
  que muda e não diz quanto.
- **Ganaches com açúcar invertido, glicose, sorbitol e glicerol**, que são as
  alavancas do livro para baixar Aw. Wybauw dá o efeito qualitativo e, para o
  glicerol, um exemplo numérico na tabela de manteiga e chocolate — mas não uma
  dose por receita. Sem dose, não há cálculo.
- **Migoya, _The Elements of Dessert_**, que está na estante e tem texto: é de
  sobremesa de restaurante, não de bombom, e não publica a mesma tabela.

---

## 8. Decisões de projeto que esta pesquisa fixa

1. A entrada é o **peso das substâncias moles** — creme, leite, licor —, que é a
   base 100 da tabela do livro.
2. O tipo de chocolate muda **a manteiga de cacau extra**, não a proporção.
3. A **faixa é exibida como faixa** no praliné cortado.
4. **Aw não é calculado.** A tabela medida é mostrada; o número da receita, não.
5. A página declara que tem **uma fonte só**, e por quê. Um site cujo lema é
   mostrar divergência precisa dizer quando não tem nenhuma para mostrar.
