# Pesquisa — Cura de carnes (nitrito e nitrato)

Levantado em 2026-09-13. **Esta é a primeira calculadora do site em que errar o
número machuca de verdade**: para baixo é botulismo, para cima é intoxicação.
Por isso a regra aqui é mais dura que a do resto do projeto — número que não foi
lido na fonte primária não entra, nem como referência.

## 1. Fontes primárias, conferidas no original

| Fonte | O que é | Como foi conferida |
| --- | --- | --- |
| **ANVISA, RDC nº 272, de 14/03/2019** — "Estabelece os aditivos alimentares autorizados para uso em carnes e produtos cárneos" (DOU nº 52, 18/03/2019) | A norma brasileira. Incorpora a Resolução GMC/MERCOSUL nº 63/18. | Texto integral lido, tabela do Anexo por categoria |
| **9 CFR 424.21(c)** — *Use of food ingredients and sources of radiation*, tabela de curing agents | A norma americana. | Lida via API do eCFR (texto vigente) |
| **Ruhlman & Polcyn, _Charcuterie_** | Composição do sal de cura e proporção de trabalho caseira. | PDF na estante, texto extraído |

Não conferido ainda, e por isso **fora do código**: o regulamento do MAPA (RIISPOA
e ISs de produtos cárneos), que pode trazer limite por categoria de produto mais
específico que o da ANVISA. Ver seção 6.

## 2. O que a norma brasileira diz, ao pé da letra

Anexo da RDC 272/2019, função **CONSERVADOR**, nas categorias de carnes e
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
Prometer conformidade com a RDC 272 a partir da entrada seria mentira.

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

- [ ] **Regulamento do MAPA** (RIISPOA e Instruções Normativas de produtos
      cárneos). A ANVISA cobre aditivo; o MAPA cobre identidade e qualidade de
      produto cárneo, e pode fixar limite por tipo (linguiça, presunto, bacon).
      Tentei baixar de `gov.br` e recebi 403.
- [ ] **Bacon**, que nos EUA tem regra própria e mais restritiva (120 ppm de
      entrada, contra 156). Confirmar no 9 CFR 424.22(b), não no 424.21.
- [ ] **Marianski**, que não veio nesta leva e é o mais explícito em conta de
      ppm para quem faz em casa.

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
