# Pesquisa — Gelificantes e espessantes

O pedido era gastronomia molecular: hidrocoloides, gomas, gelificantes e as
proporções de alginato e cálcio da esferificação. A estante responde metade
disso, e a metade que ela responde é melhor do que parecia.

**O que dá para publicar:** dose de gelatina, ágar, goma xantana, carragena
(iota e kappa) e amido Wondra, todas por peso de líquido, todas de uma obra que
pesa em grama — mais a **conversão de Bloom**, que é a conta que o livro publica
como fórmula e confirma com os próprios exemplos.

**O que não dá:** esferificação. Alginato e cálcio não têm uma única dose em
nenhuma obra da estante. Ver §6.

---

## 1. A fonte, e um susto pelo caminho

Tudo o que vira número aqui sai de **Myhrvold & Bilet, *Modernist Cuisine at
Home*** — obra que já estava na estante, citada pela calculadora de salmoura.

Ao abrir o livro para os hidrocoloides, o `pdfinfo` respondeu:

```
Creator: ABBYY FineReader Express (Mac edition)
```

**O PDF é digitalização com OCR.** As fontes embutidas são Helvetica e Times
genéricas, e o texto extraído carrega a assinatura: `S00 mL` no lugar de
`500 mL`, `offish` por "of fish", `ft/a` por `n/a`.

Isso é grave por dois motivos. O primeiro é óbvio: nenhum número novo pode sair
daí sem conferência visual. O segundo é que **a calculadora de salmoura já está
no ar com quatro receitas deste livro**.

### 1.1 Conferência do que já estava publicado

As quatro receitas foram reabertas como imagem, em 150 ppi, e comparadas com
`src/data/brine/methods.ts`:

| Receita | No código | Na página |
| --- | --- | --- |
| Basic Brine for Whole Poultry | 2 kg frango · 200 g água · 12 g sal | **confere** (p. 133) |
| Fish Brine | 600 g peixe · 1 kg água · 50 g sal · 40 g açúcar · 5–12 h | **confere** (p. 133) |
| Fish Cure | 1 kg peixe · 35 g sal · 25 g açúcar · 45 min | **confere** (p. 133) |
| Sweet Brine for Meats | 750 g carne · 150 g líquido · 10 g sal · 9 g açúcar | **confere** (p. 132) |

Nada para corrigir. A transcrição original foi feita à mão, contra a página, e
sobreviveu. Mas a conferência tinha de ser feita, e agora está registrada.

### 1.2 O livro tem paginação, e ela é constante

O rodapé impresso aparece na camada de texto. Conferido em cinco pontos — PDF
123→95, 126→98, 161→133, 394→366, 403→375 — **o deslocamento é 28 em todos**.

A obra está registrada com `locator: 'chapter'` desde a calculadora de salmoura,
e as citações existentes usam seção. Não se mexe nisso agora: trocar o
localizador quebraria todas as citações em vigor, e capítulo endereça bem. Fica
anotado que, se algum dia valer a pena, o deslocamento está conferido.

---

## 2. Gelatina

### 2.1 A dose

> "If you scale the recipe, use **0.8 g of Knox brand powdered gelatin for every
> 100 g of liquid**." — p. 366

**Caso-verdade da própria página.** A panna cotta de framboesa dessa mesma página
leva leite 30 g + creme 300 g + purê de framboesa 200 g = **530 g de líquido**, e
a tabela imprime **4,3 g de gelatina**. A regra dá 530 × 0,008 = **4,24 g** — o
livro arredonda a receita para cima. Concordam a 1,4%.

Não é identidade, e o teste diz isso com a tolerância escrita. Mas é o bastante
para fixar o que o livro conta como "líquido": só com leite, creme e purê a
conta chega perto. Com o açúcar dentro (605 g) daria 4,84 g, e só com os lácteos
(330 g) daria 2,64 g — as duas alternativas erram por muito mais do que qualquer
arredondamento explica.

Para creme de confeiteiro firme o livro trabalha bem mais leve — "1 g de gelatina
Knox para cada 500 g de creme" (p. 375), **0,2%**. Não é contradição: é outra
textura-alvo. Custard que se come de colher não é gel desenformável.

### 2.2 Bloom, e a fórmula que o livro publica

> "If you know both the weight MA and the Bloom strength BA of gelatin A, you can
> calculate the equivalent weight MB of gelatin B having a Bloom strength of BB by
> using the formula **MB = MA × BA ÷ BB**." — p. 366

| Nome | Bloom | Gramas por folha |
| --- | --- | ---: |
| bronze | 125–155 | 3,3 |
| prata | 160 | 2,5 |
| ouro | 190–220 | 2,0 |
| Knox (pó) | 225 | — |
| platina | 235–265 | 1,7 |

**A fórmula se confirma três vezes na mesma página:**

1. O exemplo impresso: 2,6 g de Knox → 2,6 × 225 ÷ 160 = **3,7 g** de prata. Dá
   3,656, que arredonda para 3,7. ✓ (este é exato)
2. A substituição impressa para prata: 0,8 × 225 ÷ 160 = 1,125 → o livro escreve
   **1,1 g por 100 g de líquido**. ✓
3. A substituição impressa para bronze, usando o meio da faixa (140): 0,8 × 225 ÷
   140 = 1,286 → o livro escreve **1,3 g**. ✓

Fonte que obedece à própria fórmula é o melhor caso-verdade que existe, e é o
mesmo padrão que validou o Wybauw na ganache e o Corvitto no gelato.

**Uma folga do livro consigo mesmo:** ele também diz que "ouro ou platina podem
substituir a Knox diretamente". Pela fórmula, ouro (meio 205) daria 0,88 g e
platina (meio 250) daria 0,72 g, contra os 0,8 g da Knox — 10% para cada lado. É
atalho de cozinha, não erro; a calculadora usa a fórmula e diz isso.

**Observação lida da tabela, não escrita no livro:** Bloom × gramas por folha dá
462, 400, 410 e 425 do bronze à platina. As folhas são fabricadas para ter
aproximadamente o mesmo poder de gelificação, independentemente do grau — que é
por que receita em "número de folhas" funciona. Está marcado como leitura nossa
da tabela, não como afirmação da obra.

### 2.3 O que mexe na firmeza — McGee

*On Food and Cooking*, cap. "Jelly Consistency", sem número mas com direção, e é
disso que a tela precisa:

- **Sal** enfraquece o gel (atrapalha a ligação entre moléculas de gelatina).
- **Açúcar** (menos frutose) fortalece — puxa água para longe da gelatina.
- **Leite** fortalece.
- **Álcool** fortalece, **até chegar a 30–50% do gel**, quando a gelatina
  precipita em grumos.
- **Ácido abaixo de pH 4** — vinagre, suco de fruta, vinho — enfraquece.
- Sal e ácido se compensam com mais gelatina.
- Tanino de chá e vinho tinto turva a geleia, precipitando a gelatina.

McGee também dá o teto: gelatina comercial é 60–70% de moléculas inteiras, e o
resto são pedaços que espessam mal — é por isso que Bloom existe.

### 2.4 Temperatura

Gelatina derrete a **37 °C** (p. 366) — temperatura do corpo, que é o motivo de
ela derreter na boca e o motivo de não servir para nada que vá ao calor.

---

## 3. Ágar

> "Use **0,25 g de ágar para cada 100 g de líquido** para um caldo fino; **0,4–0,5 g
> por 100 g** para um molho moderadamente espesso; ou **0,9–1,1 g por 100 g** para
> uma consistência de purê." — p. 98 (tradução nossa)

E o livro obedece: o **Onion Fluid Gel** (p. 101) leva 3,5 g de ágar para 500 g
de leite de cebola — **0,7%** —, e a coluna SCALING imprime exatamente 0,7%. Fica
entre o molho espesso e o purê, que é onde um gel fluido mora.

Dois fatos que separam ágar de gelatina, e que valem mais que a dose:

- **Ágar aguenta 85 °C** (p. 101); gelatina derrete a 37 °C. Molho quente que
  precisa segurar é ágar.
- **Ágar precisa ferver para hidratar** (p. 98), o que o desqualifica para
  preparo cru ou sopa fria.

**Gel fluido:** deixe firmar e bata no liquidificador. Ou, com pressa, bata com
mixer enquanto esfria em banho de gelo, até passar de **30 °C** (p. 98).

McGee corrobora a ordem de grandeza por outro caminho: ágar "forma gel em
concentrações ainda menores que a gelatina, abaixo de 1% do peso", e em doces
japoneses "a partir de 0,1% da mistura".

---

## 4. Goma xantana

> "Para um molho fino, use **0,1–0,15 g de goma xantana para cada 100 g de
> líquido**. Use **0,2–0,3 g por 100 g** para um molho com espessura mais próxima
> de molho de salada ou ketchup." — p. 95 (tradução nossa)

O **Home Jus Gras** (p. 93) chega a **0,4%** — 0,8 g para 200 g de jus —, e a
coluna SCALING imprime 0,4%.

Xantana **espessa e não gelifica**: ela dá corpo sem deixar o líquido firmar, e
funciona a frio, sem ferver. É o oposto do ágar em quase tudo.

O livro avisa na própria página: "xanthan gum is very potent, so weigh it
carefully. If the liquid becomes very sticky, you added too much."

---

## 5. Carragena e amido

**Carragena**, como substituição vegetariana da gelatina na panna cotta (p. 366):
0,65 g de iota + 0,5 g de kappa no lugar de 4,3 g de gelatina — sobre os 530 g de
líquido, **0,123% de iota e 0,094% de kappa**.

O livro descreve os dois tipos no glossário: **iota faz gel macio e elástico;
kappa faz gel firme e quebradiço.** A mistura existe para ficar no meio.

A mesma variação oferece o caminho do ágar: 0,8 g de ágar + 0,65 g de xantana,
que dão 0,151% e 0,123%. Repare que 0,151% de ágar é **abaixo** dos 0,25% que a
página 98 chama de "caldo fino" — a xantana faz parte do trabalho, e a base é
creme, não água. Está publicado como está, e a calculadora trata esse par como
receita de panna cotta, não como dose geral.

**Amido Wondra:** 4–5 g por 100 g de líquido (p. 95). Uma ordem de grandeza
inteira acima dos hidrocoloides, que é exatamente o argumento deles.

---

## 6. Esferificação fica de fora

Alginato de sódio e cloreto de cálcio **não têm uma única dose em nenhuma obra da
estante**. A varredura:

| Obra | Alginato | O que tem |
| --- | --- | --- |
| *Modernist Cuisine* vol. 1 | 12 menções | só cita; toda dose remete ao vol. 4 (`[4·42]`, `[4·175]`) |
| *Modernist Cuisine at Home* | **zero** | o volume para casa não cobre esferificação |
| McGee, *On Food and Cooking* | 5 menções | o mecanismo, sem número |
| McGee, *Keys to Good Cooking* | zero | — |

McGee descreve o mecanismo melhor do que ninguém, e isso vira verbete de
glossário sem virar número:

> "Alginates come from a number of brown seaweeds, and **form gels only in the
> presence of calcium**. Inventive cooks have taken advantage of this to make
> small flavored spheres and threads: they prepare a calcium-free alginate
> solution of the desired flavor and color, and then drip or inject it into a
> calcium solution, where it immediately gels."

O que falta é **Modernist Cuisine vol. 4, *Ingredients and Preparations***, que é
onde o próprio vol. 1 manda procurar. Sem ele, esferificação não entra — pela
mesma regra que segurou o kubaneh e a araçá.

---

## 7. O que a calculadora faz

Uma pergunta: **quanto líquido você tem, e que textura você quer.**

| Agente | Doses publicadas | Gelifica? | Calor |
| --- | --- | --- | --- |
| Gelatina (Knox 225) | 0,8% gel · 0,2% creme firme | sim | derrete a 37 °C |
| Ágar | 0,25% · 0,4–0,5% · 0,7% · 0,9–1,1% | sim | aguenta 85 °C, precisa ferver |
| Goma xantana | 0,1–0,15% · 0,2–0,3% · 0,4% | **não** | trabalha a frio |
| Iota + kappa | 0,123% + 0,094% | sim | — |
| Amido Wondra | 4–5% | não | ferve junto |

Mais o **conversor de Bloom**, que é a parte que ninguém acerta em casa: a
receita pede pó Knox, a pessoa tem folha ouro, e a conversão certa é a fórmula
do livro — não "uma folha = uma colher".

---

## 7.1 Uma pista para depois: lecitina

Uma varredura tardia achou lecitina de soja líquida em duas receitas do mesmo
livro — 1,6 g no *Home Jus Gras* e 2 g numa vinagrete. **Não entrou na
calculadora e não deve entrar nesta**: lecitina emulsiona, não gelifica nem
engrossa, e o assunto é outra página.

Fica registrado com duas ressalvas que terão de ser resolvidas antes de virar
número:

1. **Não foi conferida na imagem da página.** Saiu da camada de texto, que nesta
   obra é OCR. Vale como pista, não como dado.
2. **As bases são diferentes.** No jus a coluna de escala é sobre o jus (0,8%);
   na vinagrete é sobre o azeite (2%). Chamar as duas de "dose de lecitina"
   seria somar grandezas diferentes — exatamente o erro que a calculadora de
   picles existe para não cometer com sal sobre água contra sal sobre peso total.

A estante tem dois livros de molho do Peterson em `references/emulsions/` que
nunca foram abertos. Se emulsão virar página, é por aí que ela começa.

## 8. Pendências

- **Modernist Cuisine vol. 4** — destrava esferificação (alginato/cálcio),
  gellan, metilcelulose e as faixas completas de hidrocoloide. É a compra de
  maior retorno da lista inteira.
- Segunda fonte para qualquer uma destas doses. Hoje a calculadora é de fonte
  única, como a ganache era antes do Wybauw.
- Manuais gratuitos de fabricante (CP Kelco para xantana e gellan) — mesma
  pendência que já existe para pectina em `geleias.md`.
