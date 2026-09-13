# Pesquisa — Geleias (fruta, açúcar, ácido e pectina)

Levantamento para a calculadora de geleias. Última revisão: 2026-09-13.

Vale a regra do projeto: **nenhum número entra no código antes de estar aqui,
com obra e localizador**. Onde as fontes divergem, a divergência está descrita e
a escolha do padrão tem justificativa escrita.

---

## 1. Fontes consultadas

| # | Obra | Edição consultada | Como citar |
|---|---|---|---|
| 1 | **The Blue Chair Jam Cookbook** — Rachel Saunders | EPUB en, Andrews McMeel, 2009, ISBN do EPUB 978-1-4494-0198-6. Tem paginação do impresso marcada no arquivo. | *Saunders, p. X* |
| 2 | **Mes confitures** — Christine Ferber | EPUB fr, Éditions Payot, edição de bolso 2020 (© 1997, 2000, 2002). Paginação marcada no arquivo, mas é EPUB gerado por calibre: citamos por capítulo. | *Ferber, cap. "..."* |
| 3 | **NCHFP / University of Georgia** — páginas de *Jams & Jellies* | Site oficial, lido em 2026-09-13. | *NCHFP, "..."* |
| 4 | **Keys to Good Cooking** — Harold McGee | EPUB en, Anchor Canada, ISBN 978-0-385-67130-9. Paginação do impresso marcada. | *McGee, p. X* |
| 5 | **On Food and Cooking** — Harold McGee | EPUB en, Scribner. Sem paginação no arquivo — citamos por capítulo. | *McGee, cap. "..."* |

Seções efetivamente lidas: Saunders — capítulos 1, 2 e 3 completos (definições,
fruta, processo) e as receitas simples de cada fruta nos capítulos 4 a 6;
Ferber — capítulo "Les fruits / Le sucre et la cuisson / Le matériel / Mise en
pots", e as 218 receitas indexadas para levantar a proporção da casa; NCHFP —
*Jellied Product Ingredients*, *Types of Jellied Products*, *Making Jam without
added Pectin*, *Testing Jelly without Added Pectin*, *General Information on
Canning Jams, Jellies, and Marmalades*, *Storing Home-Canned Jams and Jellies*,
*Making Reduced-Sugar Fruit Spreads*, *Causes and Possible Solutions*; McGee —
*Keys*, "Cooking at High Altitudes"; *On Food and Cooking*, cap. 7, "Citrus
Fruits".

---

## 2. O que faz uma geleia dar liga

> "For successful jellied products, a proper ratio of fruit, pectin, acid and
> sugar is needed."
> — NCHFP, *Jellied Product Ingredients*

Quatro ingredientes, e cada um com um papel que o NCHFP descreve ao pé da letra:

- **Fruta** — "furnishes at least part of the pectin and acid needed for a gel".
  A melhor pectina está na fruta **no ponto**: "The highest quality pectin is
  found in just-ripe fruit. Pectin from under-ripe or over-ripe fruit will not
  form a gel." Para conserva própria, a recomendação é ¼ da fruta um pouco verde
  e ¾ madura.
- **Pectina** — "the substance that causes the fruit to gel".
- **Ácido** — "Acid is needed both for gel formation and flavor. The acid
  content varies among fruits and is higher in under-ripe fruits. When fruits
  are low in acid, lemon juice or citric acid may be used."
- **Açúcar** — e aqui está a frase que sustenta todo o aviso de segurança desta
  calculadora: **"Sugar is the preservative for the product, preventing the
  growth of microorganisms."** Seguida de: "Never cut down on the amount of
  sugar a recipe calls for unless syrup is the desired end result."

Ferber diz a mesma coisa por outro caminho, e com número:

> "Faire des confitures, c'est avant tout conserver les fruits grâce au sucre.
> Pour obtenir la meilleure conservation, la confiture doit contenir 65 % de
> sucre. Sachant qu'il y a déjà 10 % à 15 % de sucre dans le fruit, on ajoutera
> donc dans chaque cuisson un poids de sucre plus ou moins égal à celui du
> fruit."
> — Ferber, cap. "Le sucre et la cuisson"

Ou seja: **65 % de açúcar no produto pronto** é o alvo, e a fruta já entra com
10 % a 15 % do próprio. São os dois únicos números do assunto que alguma das
fontes publica, e é com eles que a calculadora estima a água a evaporar (§7).

---

## 3. A classificação oficial das frutas — pectina e ácido

Tabela do NCHFP, *Jellied Product Ingredients*, transcrita com as definições
literais de cada grupo:

| Grupo | Definição (verbatim) | Frutas listadas |
|---|---|---|
| **I** | "If not overripe, has enough natural pectin and acid for gel formation with only added sugar." | Maçã ácida, amora-preta ácida, maçã-brava (crabapple), cranberry, groselha (currant), groselha-espinhosa, uva Concord do leste, limão, loganberry, ameixa (exceto a italiana), marmelo |
| **II** | "Low in natural acid or pectin, and may need addition of either acid or pectin." | Maçã madura, amora-preta madura, cereja ácida, chokecherry, sabugueiro, toranja, suco engarrafado de uva Concord do leste, uva da Califórnia, nêspera, laranja |
| **III** | "Always needs added acid, pectin or both." | Damasco, mirtilo, figo, uva Concord do oeste, **goiaba**, pêssego, pera, ameixa italiana, framboesa, morango |

Repare no que isso significa para a calculadora: o grupo não muda a quantidade
de açúcar, muda **se o suco de limão é obrigatório ou opcional**. Grupo III sem
ácido adicionado não gelifica — é a própria norma que diz "always".

**Divergência sobre a goiaba.** O NCHFP põe a goiaba no grupo III, "always needs
added acid, pectin or both". McGee diz o contrário sobre a pectina: os
colonizadores espanhóis "exploited their high pectin content to make a New World
version of quince paste" (*On Food and Cooking*, cap. 7, "Fruits from Warm
Climates"). Saunders, que trabalha com goiaba branca, também a trata como fruta
firme e rica em pectina. A leitura que concilia os três: a goiaba tem pectina de
sobra e **falta ácido** — e o grupo III do NCHFP é "ácido, pectina **ou ambos**".
Como não temos fonte que separe os dois casos para a goiaba, ela **não vira
preset** nesta versão. Fica registrada aqui como pendência (§9).

---

## 4. As proporções, e por que elas são adimensionais

Saunders é explícita sobre a base de cálculo:

> "When determining what quantity of sugar to use in a recipe, always base the
> amount of sugar on the total weight of raw prepared fruit being used; for
> example, 2 pounds sugar to every 4½ pounds pitted plums."
> — Saunders, p. 22

**Fruta preparada**: descascada, sem caroço, já cortada. É o peso que a
calculadora pede.

As receitas dela estão em libras e onças, e **não precisaram ser convertidas**:
a razão entre duas massas é adimensional, então 40 oz de açúcar para 62 oz de
fruta são os mesmos 0,6452 em qualquer sistema. Cada preset abaixo guarda as
quantidades da própria receita em onças, e a razão sai delas — é o que permite o
teste usar a receita do livro como caso-verdade sem que nenhum fator de
conversão entre no caminho.

| Preset | Receita | Fruta | Açúcar | Suco de limão | Açúcar/fruta | Limão/fruta | Rendimento | Validade |
|---|---|---|---|---|---|---|---|---|
| Morango | Strawberry Jam, p. 178 | 62 oz | 40 oz | 6 oz | 0,6452 | 0,0968 | 5–6 potes | 6 meses |
| Framboesa | My Raspberry Jam, p. 234 | 48 oz | 48 oz | — | 1,0000 | 0 | 6–7 potes | 1 ano |
| Amora-preta | Wild Blackberry Jam, p. 268 | 56 oz | 28 oz | 2½–3 oz | 0,5000 | 0,0446–0,0536 | 5 potes | 6–8 meses |
| Damasco | Apricot Jam, p. 168 | 96 oz | 40 oz | 2½ oz | 0,4167 | 0,0260 | 8–9 potes | 6–8 meses |
| Pêssego | End-of-Summer Yellow Peach Jam, p. 246 | 88 oz | 48 oz | 3½ oz | 0,5455 | 0,0398 | 12 potes | 8 meses |
| Ameixa | Plum Jam, p. 197 | 72 oz | 32 oz | 2–6 oz | 0,4444 | 0,0278–0,0833 | 7–8 potes | 1 ano |
| Figo | Adriatic Fig Jam, p. 224 | 88 oz | 48 oz | 6 oz | 0,5455 | 0,0682 | 11 potes | 1 ano |
| Mirtilo | Blueberry Jam, p. 183 | 40 oz | 30 oz | 6 oz | 0,7500 | 0,1500 | 5–6 potes | 1 ano |
| Uva | Concord Grape Jam, p. 265 | 64 oz | 40 oz | 3 oz | 0,6250 | 0,0469 | 5–6 potes | 1 ano |

Notas de leitura, todas conferidas à mão no texto (o parser automático errou em
quatro das nove — ver `docs/quality/LEARNINGS.md`):

- **Morango**: "3 pounds 14 ounces hulled strawberries" = 62 oz; limão em duas
  adições, "4 ounces plus 2 ounces", que somam 6 oz.
- **Framboesa**: "2 pounds plus 1 pound" = 48 oz, e 3 lb de açúcar. Um a um
  exato. Sem limão nenhum — é a única do conjunto.
- **Amora-preta**: "1 pound 6 ounces plus 2 pounds 2 ounces" = 56 oz.
- **Pêssego**: a receita começa com "6 ½ pounds ... (approximately)" mas manda
  "Cut enough of the peaches into slices about ⅓ inch thick to make 5 ½ pounds
  of prepared fruit and juices". O peso que vale é o **preparado**, 88 oz.
- **Ameixa**: dois lotes de fruta (35 + 37 oz) e dois de açúcar (20 + 12 oz).
  O limão é faixa declarada, "2 to 6 ounces", ajustada por prova.
- **Rendimento** em potes de 8 oz fluidas (meia-pinta, ≈ 240 ml). Fica na
  unidade do livro de propósito: converter potes em gramas exigiria a densidade
  da geleia, que nenhuma das fontes publica.

### A proporção da casa de Ferber

Ferber não tabela por fruta: tem uma proporção que repete. Contagem sobre as
218 receitas do arquivo: **93 pedem exatamente "800 g de sucre cristallisé"**, e
em **48 delas a fruta é exatamente 1 kg** (ou "soit 1 kg net"). É de longe o
valor mais frequente — o segundo é 900 g, com 18 ocorrências. A proporção da
casa é, portanto, **0,80 × o peso da fruta**.

Ela também dá o número da pectina emprestada: **200 g de gelée de pommes por
quilo de fruta** nas frutas que não gelificam sozinhas — "La gelée de pommes
apporte la pectine, indispensable à la gélification des fruits qui en manquent
naturellement. Comme par exemple les poires, les cerises et les griottes."
(Ferber, cap. "Le sucre et la cuisson"; a dose está na receita "Griottes").

---

## 5. Divergências

### 5.1 A central: onde parar de cozinhar

As três fontes mandam parar no **ponto de gelificação**, e as três dizem o
número de um jeito diferente:

| Fonte | O que diz | Onde |
|---|---|---|
| **Ferber** | "La confiture doit marquer 105° C au thermomètre à sucre, c'est-à-dire au nappé." | cap. "Le sucre et la cuisson" |
| **Saunders** | "A preserve 'sets' when it reaches a high enough temperature to form a jelly when left to cool undisturbed. This temperature (220°F) can only be reached in mixtures containing a high proportion of sugar to moisture." | p. 26 |
| **NCHFP** | "When done, the temperature of the jelly should be 220°F, **8°F above the boiling point of water**, if you are at sea level." | *Testing Jelly without Added Pectin* |

220 °F são 104,4 °C. Os 105 °C de Ferber e os 220 °F de Saunders são **o mesmo
ponto**, e os dois são números de nível do mar — Oakland, na Califórnia, e a
Alsácia. O NCHFP é o único que escreve a regra na forma que sobrevive à mudança
de lugar: **não é uma temperatura, é uma diferença**. Oito graus Fahrenheit
acima de onde a água ferve ali.

E o NCHFP dá a correção:

> "For each 1000 feet of elevation above sea level, subtract 2 degrees F. For
> instance, at 1,000 feet of elevation, the jelly is done at 218°F; at 2,000
> feet, 216°F, etc."

| Altitude | Ponto de gelificação |
|---|---|
| nível do mar | 220 °F |
| 1.000 pés | 218 °F |
| 2.000 pés | 216 °F |
| 3.000 pés | 214 °F |
| 4.000 pés | 212 °F |
| 5.000 pés | 211 °F |
| 6.000 pés | 209 °F |
| 7.000 pés | 207 °F |
| 8.000 pés | 205 °F |

**A tabela do NCHFP não segue a regra de bolso da mesma página.** De 4.000 para
5.000 pés a queda é de 1 °F, não de 2, e daí para cima a tabela fica um grau
inteiro acima da regra em todas as linhas:

|  | 0 | 1.000 | 2.000 | 3.000 | 4.000 | 5.000 | 6.000 | 7.000 | 8.000 |
|---|---|---|---|---|---|---|---|---|---|
| tabela | 220 | 218 | 216 | 214 | 212 | **211** | **209** | **207** | **205** |
| regra (−2 °F/mil pés) | 220 | 218 | 216 | 214 | 212 | 210 | 208 | 206 | 204 |

A tabela é que está certa: o ponto de ebulição da água **não cai em linha reta**
com a altitude — a queda desacelera. Os "2 °F por mil pés" são aproximação boa
perto do nível do mar e vão ficando conservadores.

A calculadora interpola **a tabela**, não a regra. Até 4.000 pés (1.219 m) as
duas coincidem exatamente, o que cobre São Paulo (760 m), Belo Horizonte
(852 m), Curitiba (935 m) e Brasília (1.172 m) — ou seja, quase toda cidade
brasileira grande. A divergência só aparece acima de 1.524 m, e a página conta
que ela existe.

**Por que isto importa aqui, e não importa nos livros.** McGee:

> "Many cooking methods and recipes must be adjusted at altitudes 1,000
> feet/300 meters or more above sea level. Because the air pressure is lower
> there, water boils at lower temperatures... Baked goods, custards, and fruit
> preserves require more complicated adjustments because they either won't set
> at the appropriate stage of cooking, or won't set at all."
> — McGee, *Keys to Good Cooking*, p. 104

Grande parte do Brasil urbano mora acima dos 300 m de McGee. Nessas cidades,
cozinhar até "105 °C" não é seguir Ferber — é passar longe do ponto dela, e
Saunders avisa o que acontece: "Be careful to avoid cooking any preserve to a
temperature higher than 220°F, since this will result in an irrevocably tough,
leathery preserve" (p. 26). **É a razão de esta calculadora existir em
português.**

### 5.2 Quanto açúcar

| Fonte | Regra | Observação |
|---|---|---|
| **Ferber (texto)** | "un poids de sucre plus ou moins égal à celui du fruit" | ≈ 1,00 |
| **Ferber (receitas)** | 800 g por quilo de fruta, em 93 das 218 | 0,80 |
| **Saunders** | varia por fruta, 0,42 (damasco) a 1,00 (framboesa) | "always use the minimum amount of sugar required" |
| **NCHFP** | receitas testadas, em xícaras | "Never cut down on the amount of sugar a recipe calls for" |

**A prosa de Ferber e as receitas de Ferber não batem**: o capítulo diz "mais ou
menos igual ao peso da fruta" e a bancada dela usa 80 %. Não é erro de nenhum
dos dois — 80 % de açúcar adicionado mais os 10 % a 15 % da própria fruta dão
0,90 a 0,95 de açúcar total por quilo de fruta, que é "mais ou menos igual".
A calculadora oferece os 0,80 medidos, e a página conta a diferença.

**As proporções do NCHFP não viraram número na tela.** São em xícaras — "4 cups
crushed fruit, 4 cups sugar" — e converter xícara de fruta amassada em gramas
exigiria uma densidade que eles não publicam. Inventá-la seria exatamente o que
este site não faz. O NCHFP entra aqui pelo que publica sem ambiguidade de
unidade: a classificação das frutas, a temperatura por altitude, o tempo de
processamento e as regras de conservação.

### 5.3 Como fechar o pote

| Fonte | Método |
|---|---|
| **NCHFP** | Potes esterilizados, ¼ de polegada de espaço livre, **5 minutos em banho-maria fervente**; +1 min por 1.000 pés. Se os potes não forem esterilizados antes, 10 minutos. |
| **Saunders** | Forno a 250 °F por no mínimo 30 min; enche, tampa, volta ao forno 15 min. "They will seal as they cool." (p. 42) |
| **Ferber** | Potes fervidos ou 5 min a 110 °C no forno; enche até a borda, **fecha quente e vira o pote**. (cap. "Mise en pots") |

Os três funcionam por caminhos diferentes e **o NCHFP não endossa a inversão de
Ferber**. A calculadora informa o tempo de banho-maria do NCHFP, que é o único
com tabela por altitude, e a página diz que os outros dois métodos existem e são
dos autores citados. Não escolhemos por ninguém.

Tabela 2 do NCHFP, *Making Jam without added Pectin*, geleia sem pectina
adicionada, potes de meia-pinta ou pinta:

| Altitude | Tempo |
|---|---|
| 0–1.000 pés | 5 min |
| 1.001–6.000 pés | 10 min |
| acima de 6.000 pés | 15 min |

---

## 6. Segurança

Não é sinalização de faixa: é o que decide se o pote fica na prateleira ou na
geladeira.

- **Açúcar é o conservante.** "Sugar is the preservative for the product,
  preventing the growth of microorganisms" (NCHFP, *Jellied Product
  Ingredients*).
- **Reduzir açúcar tem consequência dupla.** "Do not try to reduce the amount of
  sugar in traditional recipes. Too little sugar prevents gelling and may allow
  yeasts and molds to grow" (NCHFP, *General Information on Canning Jams,
  Jellies, and Marmalades*).
- **Doce de baixo açúcar é doce de geladeira.** Os produtos de açúcar reduzido do
  próprio NCHFP "spoil at room temperature, must be refrigerated, and should be
  eaten within 1 month"; com gelatina, "the jars of spread should not be
  processed. They should be refrigerated and used within 4 weeks" (*Making
  Reduced-Sugar Fruit Spreads*).
- **Depois de aberto, geladeira sempre.** "Opened home-canned jams and jellies
  should be kept in the refrigerator at 40°F or lower. 'Regular' — or
  pectin-added, full-sugar — cooked jams and jellies are best stored for 1 month
  in the refrigerator after opening" (*Storing Home-Canned Jams and Jellies*).
  Saunders concorda para as de pouco açúcar: "Low-sugar preserves should always
  be refrigerated once opened" (p. 42).
- **Mofo condena o pote inteiro.** "If there is any mold on a jar of jam or
  jelly, or signs of other spoilage, discard the entire contents of the jar or
  container" (NCHFP, *Storing*).
- **Prateleira**: 50–70 °F, escuro e seco, e um ano para a melhor qualidade
  (NCHFP, *Storing*).

Modos de falha, do NCHFP (*Causes and Possible Solutions for Problems with
Jellied Fruit Products*), úteis como conteúdo e como aviso:

| Problema | Causas listadas |
|---|---|
| Mole demais | Cozinhar a fruta demais na extração; água demais; proporção errada de açúcar e suco; cozimento insuficiente; **ácido de menos**; lote grande demais; mexer o pote cedo demais |
| Dura ou borrachuda | Cozimento excessivo; pectina demais na fruta; **açúcar de menos, que obriga a cozinhar demais** |
| Solta líquido (weeping) | **Ácido em excesso** deixa a pectina instável; armazenamento quente ou com temperatura oscilando |
| Cristais | Açúcar em excesso; açúcar não dissolvido grudado na parede da panela; cozimento lento ou longo demais |
| Mofo ou fermentação | Vedação imperfeita; armazenamento impróprio |

Repare que ácido de menos e ácido demais estragam de maneiras opostas. É por
isso que a calculadora entrega o limão da receita citada e não um valor único.

---

## 7. O que a calculadora calcula

1. **Açúcar** = peso da fruta preparada × proporção escolhida.
2. **Suco de limão** = peso da fruta × a proporção da receita citada. Quando a
   fonte dá faixa ("2 to 6 ounces"), a saída é faixa.
3. **Gelatina de maçã**, opcional, = 0,20 × peso da fruta (Ferber), oferecida
   quando a fruta é do grupo III do NCHFP.
4. **Ponto de gelificação na sua altitude**: interpolação da tabela do NCHFP,
   convertida para a unidade do visitante. O ponto de ebulição da água aparece
   junto, 8 °F abaixo, porque é a regra que o NCHFP escreve.
5. **Tempo de banho-maria**: tabela 2 do NCHFP, por faixa de altitude.
6. **Água a evaporar**, estimativa: com açúcar total = adicionado + 10 % a 15 %
   do peso da fruta (Ferber), a massa final a 65 % é `açúcar total ÷ 0,65`, e o
   que falta evaporar é a diferença para a massa de entrada. Sai como faixa
   porque os 10 %–15 % são faixa. **É a única conta da página que combina fontes
   em vez de reproduzir uma**, e a página diz isso.
7. **Rendimento**, em potes de 8 oz fl (≈ 240 ml), escalado do rendimento que a
   própria receita declara.
8. **Validade**, quando o açúcar é o da receita citada: a que o livro declara.
   Fora disso, a página diz que a fonte não cobre aquele caso e repete a regra
   do NCHFP.

O aviso destacado dispara quando o açúcar escolhido fica **abaixo do que a
receita citada publica para aquela fruta**. Não é um limiar inventado por nós: é
a proporção da fonte, e o texto do aviso é a frase do NCHFP sobre não reduzir
açúcar de receita testada, com a consequência prática — vira doce de geladeira,
até um mês.

---

## 8. Glossário (com citações)

| Verbete | Definição | Fonte |
|---|---|---|
| **Geleia (jam)** | "Jams are thick, sweet spreads made by cooking crushed or chopped fruits with sugar. Jams tend to hold their shape but are generally less firm than jelly." | NCHFP, *Types of Jellied Products*; Saunders, p. 6 |
| **Jelly** | Suco de fruta coado, cozido com açúcar até o ponto. "A jelly is an extracted fruit juice that has been combined with sugar, lemon juice, and (sometimes) added pectin and boiled until it sets." | Saunders, p. 6; NCHFP, *Types of Jellied Products* |
| **Marmelada × marmalade** | Em inglês, geleia de jelly com casca de cítrico em suspensão. A palavra é portuguesa e era outra coisa: "Marmalade, a sugar preserve that includes citrus peel, was originally a Portuguese fruit paste made with quince, but by the 18th century the high-pectin, readily gelled sour orange had begun to replace the quince." | McGee, *On Food and Cooking*, cap. 7, "Citrus Fruits"; NCHFP, *Types of Jellied Products* |
| **Compota (preserves)** | "Preserves are small, whole fruit or uniform size pieces in a clear, slightly gelled syrup." | NCHFP, *Types of Jellied Products* |
| **Pectina** | "Pectin is the substance that causes the fruit to gel." Melhor na fruta no ponto; a de fruta verde ou passada não gelifica. | NCHFP, *Jellied Product Ingredients* |
| **Fruta preparada** | O peso que vale para a conta: descascada, sem caroço, já cortada. "Always base the amount of sugar on the total weight of raw prepared fruit being used." | Saunders, p. 22 |
| **Ponto de gelificação** | "A preserve 'sets' when it reaches a high enough temperature to form a jelly when left to cool undisturbed." São 8 °F acima da fervura da água no lugar onde se cozinha. | Saunders, p. 26; NCHFP, *Testing Jelly without Added Pectin* |
| **Nappé** | O teste francês do mesmo ponto: a colher fica coberta por uma película que não escorre. "Vérifiez la nappe." | Ferber, cap. "Le sucre et la cuisson" |
| **Teste do congelador** | Uma colher fria no congelador; a amostra resfriada não corre ao inclinar. | Saunders, p. 34; NCHFP, *Testing Jelly without Added Pectin* |
| **Teste da folha (sheeting)** | "When the two drops form together and 'sheet' off the spoon, the jellying point has been reached." | NCHFP, *Testing Jelly without Added Pectin*; Saunders, p. 35 |
| **Sinérese (weeping)** | A geleia solta líquido. Causa: "Excess acid in juice makes pectin unstable"; ou armazenamento quente. | NCHFP, *Causes and Possible Solutions* |

---

## 9. O que ficou de fora, e por quê

- **Jelly e marmalade** (suco coado e cítrico com casca) exigem uma entrada
  diferente — volume de suco extraído, não peso de fruta — e um segundo dia de
  processo. Ficam para outra versão. A calculadora diz que é de geleia com
  pedaço de fruta, e as definições estão no glossário.
- **Goiaba, jabuticaba, maracujá, manga, caju** — a fruta brasileira. Nenhuma
  das três fontes principais publica proporção pesada para elas; a goiaba
  aparece só na classificação do NCHFP, e com a ambiguidade da §3. Isto é a
  maior lacuna desta calculadora e está registrado em
  `docs/research/bibliografia-candidata.md`.
- **Pectina comercial em pó.** Saunders manda usar "extremely sparingly and only
  if absolutely necessary", e o NCHFP manda seguir a bula do fabricante, que
  varia por marca. Sem dose citável, não entra. A pectina emprestada da gelatina
  de maçã de Ferber entra porque tem número.
- **pH.** Todas as fontes falam de ácido; nenhuma das três publica a janela de
  pH da gelificação. Os valores que circulam (2,8–3,5) vieram do documento de
  bibliografia, não de fonte lida — e por isso **não** estão na tela. Pendência.
- **Manuais de fabricante de pectina** (CP Kelco, Herbstreith & Fox), que
  publicariam grau de gelificação e janela de pH com rigor de folha de
  especificação. Continuam na lista de compras.

---

## 10. Decisões de projeto que esta pesquisa fixa

1. A entrada é **peso de fruta preparada**, em gramas. É a base explícita de
   Saunders e a única que dispensa densidade.
2. O padrão de açúcar é **a proporção da receita citada para aquela fruta**, não
   uma média. Média de nove receitas não é fonte de ninguém.
3. O ponto de gelificação é **calculado a partir da altitude**, sempre, e o
   valor de nível do mar aparece só como referência. Um número fixo de 105 °C
   estaria errado para a maior parte de quem lê em português.
4. A faixa de limão é **exibida como faixa** quando a fonte dá faixa.
5. O aviso de açúcar baixo compara com **a fonte**, não com um limiar nosso.
6. O rendimento fica em **potes**, a unidade do livro, porque converter para
   gramas exigiria densidade que ninguém publica.
