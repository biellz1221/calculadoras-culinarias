# Pesquisa — Cura de carnes (nitrito e nitrato)

Levantado em 2026-09-13. **Esta é a primeira calculadora do site em que errar o
número machuca de verdade**: para baixo é botulismo, para cima é intoxicação.
Por isso a regra aqui é mais dura que a do resto do projeto — número que não foi
lido na fonte primária não entra, nem como referência.

## 1. Fontes primárias, conferidas no original

| Fonte | O que é | Como foi conferida |
| --- | --- | --- |
| **ANVISA, Instrução Normativa nº 211, de 1º/03/2023** — limites máximos e condições de uso dos aditivos autorizados, com a RDC nº 778/2023 | A norma brasileira **em vigor**. | PDF oficial de 1.966 páginas baixado e lido; tabela do Anexo, categoria 08.2 |
| ~~**ANVISA, RDC nº 272, de 14/03/2019**~~ | **Revogada.** Era a norma que este documento citava até 2026-09-14. | Revogação conferida: RDC 778/2023, art. 13, inciso LVI |
| **9 CFR 424.21(c)** — *Use of food ingredients and sources of radiation*, tabela de curing agents | A norma americana. | Lida via API do eCFR (texto vigente) |
| **Ruhlman & Polcyn, _Charcuterie_** | Composição do sal de cura e proporção de trabalho caseira. | PDF na estante, texto extraído |
| **Marianski & Marianski, _Home Production of Quality Meats and Sausages_** | Composição do #1 e do #2, tabela de dose por quilo e a política de piso do FSIS. | EPUB na estante, texto extraído |

Não conferido ainda, e por isso **fora do código**: o regulamento do MAPA (RIISPOA
e ISs de produtos cárneos), que pode trazer limite por categoria de produto mais
específico que o da ANVISA. Ver seção 6.

## 1.1 O piso, que é o lado esquecido

O Marianski traz o número que faltava, e ele é do FSIS:

> "As a matter of policy, the Agency requires a minimum of **120 ppm of ingoing
> nitrite** in all cured 'Keep Refrigerated' products, unless the establishment
> can demonstrate that safety is assured by some other preservation process,
> such as thermal processing, pH or moisture control."

**Isto é piso, não faixa.** Abaixo de 120 ppm de entrada o produto não tem a
proteção que o nome "curado" promete, e a consequência é botulismo — a mesma
lógica do `MIN_SAFE_SALINITY` no picles, com custo de erro maior. Na
calculadora vira aviso destacado, e não sinalização de cor.

E a tabela de dose que ele publica, que a nossa reproduz linha por linha:

| Alvo | Cure #1 (6,25%) por kg | Peklosol (0,6%) por kg |
| --- | --- | --- |
| 75 ppm | 1,2 g | 12,5 g |
| 100 ppm | 1,6 g | 16,6 g |
| 120 ppm | 1,9 g | 20 g |
| máximo | 2,5 g (156 ppm) | 25 g (150 ppm) |

Repare na última linha: o teto que o Marianski dá ao Peklosol é **150 ppm**, não
156. É a régua europeia aparecendo no mesmo livro, e ela coincide com o número
brasileiro — embora, de novo, por caminhos diferentes.

## 2. O que a norma brasileira diz, ao pé da letra

### 2.0 Correção de 2026-09-14: a norma citada tinha sido revogada

Este documento citava a **RDC 272/2019**. Ela foi **revogada pela RDC 778/2023**,
que consolidou a legislação de aditivos e derrubou 67 normas de uma vez — a 272
é o inciso LVI do artigo 13. O que vale hoje é a **Instrução Normativa nº 211, de
1º de março de 2023**, que acompanha a RDC 778.

**O número não mudou, e a redação quase não.** A IN 211 diz, no Anexo, categoria
08.2 e subcategorias:

> "Limite para os aditivos INS 250 e 251 sozinhos ou combinados. A soma dos
> nitritos e nitratos, determinados como quantidade máxima residual, não deve
> superar **150 mg/kg**, expressa como nitrito de sódio."

A mesma nota aparece pareando INS 249 e 250 (os dois nitritos). O limite de 150
mg/kg como **soma, expressa como nitrito de sódio e medida como resíduo**, é
exatamente o que este documento já registrava e o que a calculadora já publica.

As subcategorias de produto cárneo que carregam nitrito na IN 211 são sete:
08.2.1.1 (processados frescos), 08.2.1.2 (secos), 08.2.1.3 (cozidos), 08.2.2.1
(salgados crus), 08.2.2.2 (salgados cozidos), 08.2.3.1 (conservas cárneas e
mistas) e 08.2.3.2 (semiconservas). Em 08.1.1, carne in natura, "não são
autorizados aditivos alimentares".

**A lição de processo:** número de norma envelhece mesmo quando o número da
norma não muda. Citação de texto legal precisa de conferência de vigência, e não
só de leitura no original. Registrado em `docs/quality/LEARNINGS.md`.

### 2.1 A tabela, como publicada

Anexo da IN 211/2023, função **CONSERVADOR**, nas categorias de carnes e
produtos cárneos:

| INS | Aditivo | Limite máximo (g/100 g) |
| --- | --- | --- |
| 249 | Nitrito de potássio | 0,015 |
| 250 | Nitrito de sódio | 0,015 |
| 251 | Nitrato de sódio | 0,03 |
| 252 | Nitrato de potássio | 0,03 |

E a condição, transcrita: **"A soma dos nitritos e nitratos, determinados como
resíduo máximo, não deve superar 0,015 g/100 g, expressa como nitrito de
sódio."**

Três coisas nessa frase mudam a conta:

1. **É soma, não limite separado.** Nitrato tem teto próprio de 0,03 g/100 g,
   mas nitrito e nitrato somados, expressos como nitrito de sódio, não passam de
   0,015 g/100 g. Usar os dois no teto de cada um estoura a norma.
2. **É resíduo, não entrada.** O limite vale para o produto pronto, depois de o
   nitrito ter reagido e decaído — não para o que se pesa e mistura.
3. **É no produto pronto para o consumo**, "de acordo com as instruções de
   preparo do fabricante" (Art. 3º, § 1º).

**0,015 g/100 g = 150 mg/kg = 150 ppm.**

## 3. O que a norma americana diz, ao pé da letra

9 CFR 424.21(c), coluna de quantidade:

| Aditivo | Quantidade permitida |
| --- | --- |
| Nitrito de sódio ou potássio | "2 lb to 100 gal pickle at 10 percent pump level; 1 oz to 100 lb meat or poultry product (dry cure); ¼ oz to 100 lb chopped meat, meat byproduct or poultry product" |
| Nitrato de sódio ou potássio | "7 lb to 100 gal pickle; 3½ oz to 100 lb meat or poultry product (dry cure); 2¾ oz to 100 lb chopped meat or poultry" |

E o teto de resíduo: o uso **"shall not result in more than 200 ppm of nitrite,
calculated as sodium nitrite in finished product"**.

Convertido (1 oz = 28,349523125 g; 1 lb = 453,59237 g):

| Método | Regra | ppm de **entrada** |
| --- | --- | --- |
| Moído / comminuted | ¼ oz por 100 lb | **156,2** |
| Cura seca | 1 oz por 100 lb | **625,0** |
| Salmoura de injeção, 10% de pump | 2 lb por 100 gal | **239,7** na carne |

## 4. A divergência de verdade, e por que a nossa era mal contada

> `docs/research/bibliografia-candidata.md` registrava a divergência como
> **"EUA 156 ppm contra ANVISA 150 mg/kg"**. Está errado, e o erro não é de
> arredondamento: **compara entrada com resíduo.** Os 156 ppm são o que se
> *adiciona* a carne moída; os 150 mg/kg são o que pode *sobrar* no produto
> pronto. São grandezas diferentes e não se comparam.

Na mesma base, a comparação honesta é:

| | Brasil (ANVISA) | EUA (FSIS) |
| --- | --- | --- |
| **Resíduo máximo** | **150 ppm**, e é a **soma** de nitrito + nitrato, como nitrito de sódio | **200 ppm** de nitrito, como nitrito de sódio |
| **Entrada** | não fixada por método | fixada por método: 156 / 625 / 239,7 ppm |

Ou seja: **o Brasil é mais restritivo no resíduo (150 contra 200) e não fixa a
entrada; os EUA são mais permissivos no resíduo e amarram a entrada.** Duas
filosofias de regulação, não dois números do mesmo tipo.

**Consequência para a calculadora:** ela calcula **entrada**, que é o que a
pessoa pesa. Não há como prever o resíduo sem medir o produto pronto. Então o
que a interface pode honestamente dizer é: quanto você vai adicionar, como isso
se compara ao teto de entrada americano (o único que existe), e o aviso de que o
limite brasileiro é de resíduo e só se verifica com análise no produto final.
Prometer conformidade com a norma brasileira a partir da entrada seria mentira.

## 4.1 A aritmética da soma, enfim publicada (2026-09-14)

A §4 fecha dizendo que o limite brasileiro é de **soma** de nitrito e nitrato,
como nitrito de sódio, e que a calculadora só podia afirmar que a soma existe. O
**Ofício Circular DIPOA nº 15/2009**, achado na varredura de órgãos públicos
(`fontes-publicas-br.md` §2.1), publica como ela se faz:

> "O valor de nitrato (NaNO3) obtido dever ser dividido por **1,231** para ter o
> valor expresso em nitrito (NaNO2). Este valor deve ser somado ao resultado de
> nitrito para se obter o valor total que deverá ser de no máximo **150 ppm ou
> 0,015%**. Em casos de análise de nitrato de potássio, dividir o resultado desta
> análise por **1,4637** para expressão dos resultados em nitrito de sódio,
> somando-se ao resultado a quantidade de nitrito de sódio da análise."
> — Ofício Circular 15/2009/GAB/DIPOA, p. 5, seção "Cálculo do nitrito residual"

**O ofício se confere sozinho**, porque publica as próprias massas molares na
linha seguinte:

> "PM NaNO2 = 69,00 g · PM NaNO3 = 84,99 g · PM KNO3 = 101,10 g"

| Fator | Pela massa molar do próprio ofício | Publicado | Diferença |
|---|---|---|---|
| Nitrato de sódio | 84,99 ÷ 69,00 = **1,23174** | 1,231 | truncamento, 0,006% |
| Nitrato de potássio | 101,10 ÷ 69,00 = **1,46522** | 1,4637 | **0,104%** |

O de sódio é o publicado truncado na terceira casa. O de potássio **não fecha**
com as massas do próprio documento: erra por um milésimo, e erra para o lado
seguro — divisor menor dá equivalente em nitrito maior, e portanto atinge o teto
de 150 antes. Registrado, e o site usa o número publicado, não o recalculado:
citar é reproduzir o que a norma manda fazer, não corrigir a norma.

### O outro número que estava faltando

O mesmo ofício, na p. 2, dá um teto que a nossa pesquisa não tinha:

> "[…] a empresa que utilizar níveis acima de **150 ppm para nitrito** (de sódio
> ou de potássio), ou **150 ppm para combinações** de nitrito […] com nitrato
> […], ou ainda, **300 ppm de nitrato** (de sódio ou de potássio) […] deverá
> declarar […] que no produto final […] os níveis residuais máximos […] atendem
> o previsto na IN 51/06."

Três tetos, então, e não um: 150 para nitrito sozinho, 150 para a combinação, e
**300 para nitrato sozinho**.

E aponta a peça que a §6 listava como inacessível: a norma de referência é a
**Instrução Normativa nº 51 SDA, de 29/12/2006**, que remete à Resolução
MERCOSUL GMC nº 73/97.

### O que isso muda na calculadora, e o que não muda

**Muda:** com o sal de cura #2, que leva nitrato, a página passa a mostrar a
soma na moeda da norma. A 156 ppm de nitrito, o #2 entrega 99,8 ppm de nitrato
(a razão das frações do sal, 4,00 ÷ 6,25 = 0,64), e a soma vira
156 + 99,8 ÷ 1,231 = **237 ppm expressos como nitrito de sódio**. É um número que
ninguém adivinha de cabeça, e é o que a norma mediria.

**Não muda, e é o mais importante:** isso continua sendo **entrada**, e o teto de
150 continua sendo de **resíduo**. A própria seção do ofício se chama "Cálculo do
nitrito **residual**". Pôr um sinal de aprovado ou reprovado comparando os 237
com os 150 seria cometer exatamente o erro que a §4 desta pesquisa existe para
não cometer.

Então a tela mostra a soma, mostra a conta que a produziu, e diz que a
comparação com o teto só se faz com análise do produto pronto. A decisão de
projeto nº 1 da §7 continua valendo sem uma vírgula de exceção.

## 5. Sal de cura: composição e conversão

Ruhlman & Polcyn: o sal de cura com nitrito, vendido como *pink salt*, T.C.M.,
DQ Curing Salt ou Insta Cure #1, é **"93.75 percent salt and 6.25 percent
nitrite"**. Com nitrato junto, é o #2, para curas longas.

Conversão, com `n` = fração de nitrito no sal de cura (0,0625 no #1):

```
gramas de sal de cura = ppm_alvo × massa_da_carne_em_kg / (n × 1 000 000) × 1000
                      = ppm_alvo × kg / (0,0625 × 1000)     para o #1
```

| ppm de entrada | Cura #1 por kg de carne |
| --- | --- |
| 150 | 2,400 g |
| 156 | 2,496 g |
| 200 | 3,200 g |

**Proporção de trabalho do Ruhlman**, transcrita: *"1 ounce/25 grams of pink
salt is enough for 25 pounds/11.25 kilograms of meat"* → **138,9 ppm de
entrada**, abaixo do teto americano de moído e abaixo do resíduo brasileiro.
Serve de padrão sensato da calculadora.

Ele também dá a base do dry cure: **"2 parts salt to 1 part sugar, plus 10
percent of their combined weight of pink salt"**. Atenção: essa segunda regra e
a proporção acima **não dão o mesmo ppm** — dependem de quanta cura seca se
aplica por quilo, que ele não fixa. A calculadora usa a primeira, que é
fechada.

## 6. O que ainda falta antes de escrever a calculadora

- [x] ~~**Regulamento do MAPA**~~ — parcialmente resolvido em 2026-09-14. O
      `gov.br` continua devolvendo 403, mas `wikisda.agricultura.gov.br` serve a
      base legal do DIPOA direto. Entraram o Ofício Circular 15/2009 (§4.1), a
      IN 21/2000 e a IN 92/2020. A **IN 51/2006**, que é a norma de limite
      residual que o ofício invoca, está nomeada mas ainda não foi lida no
      original — o que o site cita é o ofício, que é o que temos em mãos.
- [ ] **Bacon**, que nos EUA tem regra própria e mais restritiva (120 ppm de
      entrada, contra 156). Confirmar no 9 CFR 424.22(b), não no 424.21.
- [x] ~~**Marianski**~~ — chegou em 2026-09-13 e está incorporado: composição do
      #1 e do #2, tabela de dose por quilo e o piso de 120 ppm do FSIS.

## 7. Decisões de projeto que esta pesquisa já fixa

1. **A calculadora calcula entrada, e diz isso.** Resíduo não se calcula, se mede.
2. **O padrão é a régua brasileira**, com a americana ao lado — a mesma política
   das outras calculadoras, e aqui com peso de norma.
3. **Aviso de segurança acompanha o resultado**, inclusive impresso, como no
   picles. Abaixo do mínimo eficaz não é questão de gosto.
4. **Nitrito e nitrato somam.** Quem usa cura #2 precisa ver os dois na conta,
   porque é assim que a norma brasileira conta.
5. **Sem número de blog.** Toda linha da tabela sai de RDC, CFR ou livro na
   estante, com localizador.
