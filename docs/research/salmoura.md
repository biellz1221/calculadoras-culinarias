# Pesquisa — Salmoura e salga de proteína

Levantamento para a calculadora de salmoura. Última revisão: 2026-09-13.

Vale a regra do projeto: nenhum número entra no código antes de estar aqui, com
obra e localizador.

**Esta pesquisa corrigiu a própria bibliografia do projeto.** O documento
`bibliografia-candidata.md` §2 dizia que a divergência era "equilíbrio do
Modernist mirando cerca de 0,5% de sal final na carne, enquanto a salga seca do
Food Lab parte de 0,85% sobre o peso da proteína". Lidas as duas fontes, os
números são **0,6%** e **0,625%** — praticamente o mesmo. Os dois não discordam
sobre quanto sal. Discordam sobre a água (§4).

---

## 1. Fontes consultadas

| # | Obra | Edição consultada | Como citar |
|---|---|---|---|
| 1 | **Modernist Cuisine at Home** — Nathan Myhrvold e Maxime Bilet | PDF en, The Cooking Lab. Capítulo "Brines and Marinades". Sem paginação confiável na camada de texto — citamos por capítulo. | *Modernist at Home, cap. "..."* |
| 2 | **The Food Lab** — J. Kenji López-Alt | EPUB en, W. W. Norton, 2015. Paginação do impresso marcada no arquivo. | *López-Alt, p. X* |
| 3 | **Charcuterie** — Michael Ruhlman e Brian Polcyn | PDF en, W. W. Norton, 2005. Entra por um motivo só: é a única obra da estante que publica o **peso** de um volume de sal kosher. | *Ruhlman & Polcyn, cap. 2, "Salt"* |

Seções lidas: Modernist at Home — "Brines and Marinades" completo, com as
quatro receitas de salmoura e a de cura de peixe; Food Lab — "Brining Meat: The
Big Trade-Off" (pp. 359–360), "What About Brining?" e "How to Dry-Brine a Bird"
(pp. 574–580), e a resposta sobre salgar bife com antecedência (p. 291);
Ruhlman & Polcyn — cap. 2, "Salt", parágrafos sobre tipos e pesos de sal.

---

## 2. O problema que a calculadora resolve

As duas fontes principais dão a dose em unidades que não servem numa cozinha
brasileira:

> "rub about 1 teaspoon of Diamond Crystal kosher salt per pound of meat all
> over its body, under its skin"
> — López-Alt, p. 579

Uma colher de chá de uma marca americana específica, por libra. Colher de chá de
sal grosso, de sal refinado e de flor de sal têm pesos diferentes, e libra não é
unidade de balança de cozinha. **Sem conversão, a instrução não é executável
aqui.** É exatamente o caso que este site existe para resolver.

A conversão vem de uma obra da estante:

> "Morton's Kosher Salt; a cup weighs almost 8 ounces. Brian uses Diamond
> Crystal kosher salt; a cup of this salt weighs 4.8 ounces."
> — Ruhlman & Polcyn, cap. 2, "Salt"

Uma xícara tem 48 colheres de chá, e a onça avoirdupois tem 28,349523125 g
exatos. Logo:

| Sal | 1 xícara | 1 colher de chá | 1 c. chá por libra de carne |
|---|---|---|---|
| Diamond Crystal kosher | 136,1 g | **2,835 g** | **0,625% do peso da carne** |
| Morton kosher | 226,8 g | 4,72 g | 1,04% |

**A conversão se confere sozinha na outra fonte.** Food Lab descreve a salmoura
de 6% como "about ½ cup Diamond Crystal kosher salt, or ¼ cup table salt, per
quart of water" (p. 359). Meia xícara de Diamond Crystal, pelo peso do Ruhlman,
são 68 g; num quarto de galão de água (946 g) isso dá 7,2% — "about 6 percent",
como ele escreve. Duas fontes independentes, mesma densidade.

Note também o tamanho do erro que a marca causa: a **mesma** colher de chá, se
for Morton em vez de Diamond Crystal, dobra a dose de 0,625% para 1,04%. É por
isso que a saída desta calculadora é em gramas e nada mais.

---

## 3. As doses, fonte por fonte

### 3.1 Modernist Cuisine at Home — salmoura de equilíbrio, injetada

A tese, ao pé da letra:

> "The subtler effect of brining is more widely useful. Brining is the technique
> of soaking meat in a dilute salt solution until the dissolved salt permeates
> the muscle tissue. **You're shooting for a final concentration of about 0.5%
> salt throughout the meat** — weak compared to curing."
>
> "Modernist brining, akin to cooking sous vide, soaks the meat for long periods
> (up to 24 hours) in a solution having a salt concentration only slightly
> higher than that target of 0.5%. The risk of oversalting is eliminated."
> — Modernist at Home, cap. "Brines and Marinades"

As receitas trazem uma coluna **SCALING**, que é a porcentagem sobre o peso da
proteína. É esse número que a calculadora usa:

| Receita | Água/líquido | Sal | Açúcar | Tempo | Método |
|---|---|---|---|---|---|
| **Basic Brine for Whole Poultry** | 200 g de água = **10%** | 12 g = **0,6%** | — | 24 h na geladeira, descoberto | Injetada, para 2 kg de frango |
| **Sweet Brine for Meats** | 75 g de leite = 10% e 75 g de suco de maçã = 10% | 10 g = **1,3%** | 9 g = 1,2% | 12 h na geladeira | Injetada, depois imersa no que sobrar; carne de até 3,5 cm, 750 g |
| **Fish Brine** | 1 kg de água = **167%** | 50 g = **8%** | 40 g = 7% | 5 h (leve) a 12 h (firme) | Imersão, para 600 g de peixe em porções |
| **Fish Cure** | — | **3,5%** (35 g/kg) | 2,5% (25 g/kg) | 45 min, depois enxaguar | Cura seca |

Duas leituras importantes:

- **As duas primeiras são de equilíbrio e injetadas**, então todo o sal entra e a
  porcentagem sobre a carne é a concentração final. O frango a 0,6% cai em cima
  do alvo declarado de 0,5%.
- **A de peixe não é de equilíbrio.** São 8% sobre o peixe diluídos em 167% de
  água, o que dá uma salmoura de cerca de 4,6% na água, e o peixe fica nela
  por tempo contado. Sair na hora é parte da receita. Por isso ela **não** pode
  ser tratada como as outras na calculadora.

### 3.2 The Food Lab — salga seca, sem água nenhuma

A dose, convertida na §2: **1 c. chá de Diamond Crystal por libra = 0,625% do
peso da proteína**.

Tempos que o livro dá:

| Corte | Tempo | Onde |
|---|---|---|
| Ave inteira, sal sob a pele | 24 a 48 h na geladeira, descoberta | p. 579 |
| Bife | até 3 dias, descoberto sobre grade | p. 291 |

E o experimento que sustenta a posição dele — doze peitos de frango idênticos,
assados juntos a 275 °F até 150 °F no centro (pp. 359–360):

| Tratamento | Peso inicial | Depois de molhar | Depois de assar |
|---|---|---|---|
| Sem nada | 100% | 99,1% | 82,9% |
| Salmoura 6% | 100% | 111,6% | **89,6%** |
| Salgado (salga seca) | 100% | 99,4% | **88,6%** |
| Só água | 100% | 103,2% | 81,7% |

> "So, which method is better: brining or extended salting? From the chart
> alone, you'd guess brining; the meat retains an entire extra percentage point
> of moisture. But is this all good news? … while your meat may end up juicier,
> remember that much of the juice it's now holding on to is nothing more than
> tap water."
>
> "I've repeated this test numerous times with everything from turkey to pork
> chops and always come to the same conclusion: **salting and resting your meat
> is superior in every way to brining**."
> — López-Alt, p. 360

---

## 4. A divergência de verdade

**Não é sobre quanto sal.** Modernist mira 0,5% e usa 0,6% na ave; Food Lab usa
0,625%. A diferença entre os dois é menor que o erro de uma colher.

**É sobre a água.** Um ponto percentual de umidade retida, medido pelo próprio
Food Lab, e o que ele custa:

| | Modernist at Home | The Food Lab |
|---|---|---|
| Sal | 0,6% da proteína | 0,625% da proteína |
| Água | +10% do peso, injetada | nenhuma |
| Tempo | 24 h | 24 a 48 h (ave), até 3 dias (bife) |
| Ganho | menos perda no cozimento; risco de excesso de sal eliminado | menos perda também, e um ponto abaixo da salmoura |
| Custo | "much of the juice it's now holding on to is nothing more than tap water" | um ponto percentual a mais de perda |
| Exige | seringa de injeção | nada |

**O que a calculadora faz:** entrega os dois, lado a lado, com o número em
gramas, e diz que a escolha é entre um ponto percentual de umidade e a diluição
do sabor. Não escolhe por ninguém — mas registra que a fonte que **mediu os
dois** ficou com a salga seca.

Vale dizer também o que os dois concordam em condenar: **salmoura de imersão
comum, sem injeção**. Modernist chama de "the conventional approach" e diz que
ela produz "an oversalted exterior and an undersalted interior"; Food Lab
descreve o "wet-sponge syndrome" e o sabor lavado. A calculadora oferece a
salmoura de imersão de 6% porque é a que a maioria das receitas em português
pede e porque o Food Lab a mediu — mas com o aviso de que ela é **contada por
tempo**, não de equilíbrio.

Uma observação que fecha a discussão sobre concentração: Food Lab testou uma
salmoura saturada de 35% e ela reteve tanta umidade quanto a de 6%, "despite
turning the turkey inedibly salty" (p. 576). Ou seja, passar de 6% não compra
nada além de sal.

---

## 5. Segurança

Aqui não há penhasco como no nitrito ou no açúcar da geleia, mas há três regras
que as duas fontes repetem e que acompanham o resultado:

- **Salmoura e salga acontecem na geladeira.** Modernist manda refrigerar as 12 h
  e as 24 h; Food Lab manda deixar a ave descoberta na geladeira por 24 a 48 h.
  Nenhum dos dois admite bancada.
- **Furar a carne leva contaminação de superfície para dentro.** "Poking,
  perforating, or otherwise puncturing pieces of meat can contaminate it. If you
  are inserting a temperature probe, injecting brines or marinades, or
  tenderizing meat with a Jaccard, you will push any pathogens on the surface of
  the meat into the interior. This slightly increases the risk of foodborne
  illness." A própria fonte relativiza na frase seguinte — "Adhering to safe
  cooking times and temperatures, however, will mitigate the risk" — e sugere
  escaldar a superfície antes de furar: "Water at 76 °C / 170 °F sanitizes the
  surface in one second." (Modernist at Home, quadro "The Hazards of
  Puncturing"). Consequência prática para a calculadora: quem injeta perde a
  liberdade de servir o centro malpassado que uma peça inteira e intacta dá.
- **Prazo depois da salmoura.** Modernist: a salmoura em si guarda até 3 dias
  refrigerada; a carne salmourada e escorrida guarda até 24 h refrigerada "but
  must then be cooked". O peixe salmourado, cozinhar imediatamente.

---

## 6. O que a calculadora calcula

1. **Sal**, em gramas = peso da proteína × a proporção do método escolhido.
2. **Água ou líquido**, em gramas, nos métodos que levam — 10% na ave injetada,
   20% na carne, 167% na imersão de peixe.
3. **Açúcar**, onde a receita citada tem.
4. **Tempo**, o que a fonte declara para aquele método.
5. **Equivalência em colheres**, para conferência: quantas colheres de chá de
   Diamond Crystal e de Morton aquele peso de sal representa, pelos pesos do
   Ruhlman & Polcyn. É a ponte entre a receita em inglês e a balança.

O aviso destacado não é de segurança alimentar: é o de **método**. Salmoura de
imersão não é de equilíbrio, e o resultado depende de tirar a peça na hora.

---

## 7. O que ficou de fora, e por quê

- **Peso de sal brasileiro.** Sal refinado e sal grosso de cozinha não têm
  densidade publicada em nenhuma obra da estante. A tabela de colheres fica só
  nas duas marcas americanas que o Ruhlman pesou, declarado como tal. Enquanto
  isso, a saída em gramas resolve.
- **Salmoura por espessura e por tempo.** Nenhuma das duas fontes publica uma
  tabela de tempo por espessura de peça para salmoura de imersão; dão exemplos
  soltos. Sem tabela, não há cálculo.
- **Aves "enhanced" / temperadas de fábrica**, que já vêm com solução salina
  injetada. Food Lab avisa que os testes dele usaram aves "nonkosher,
  nonenhanced". Salgar por cima de uma ave já injetada soma sal, e a
  calculadora não tem como saber quanto — vira aviso de texto, não conta.
- **Camarão, molusco e vegetal.** Sem dose pesada nas fontes lidas.

---

## 8. Decisões de projeto que esta pesquisa fixa

1. A entrada é **peso da proteína** em gramas, e a saída também. Colher só como
   equivalência de conferência, nunca como resposta.
2. **A divergência é sobre a água, não sobre o sal**, e é assim que a página
   conta. Repetir o "0,5% contra 0,85%" da bibliografia seria propagar um erro
   nosso.
3. A salmoura de imersão entra, mas **marcada como não sendo de equilíbrio** —
   é o único método dos três em que passar do tempo estraga.
4. Onde as duas fontes concordam (a dose de sal), a página diz que concordam. É
   informação tão útil quanto a divergência, e mais rara.
