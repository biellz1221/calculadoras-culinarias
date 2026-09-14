# Pesquisa — Gelato: ar, densidade e os dois números que estavam sem fonte

Consolidação de 2026-09-14. Esta é a pesquisa que a calculadora de gelato não
tinha: ela nasceu de uma planilha de curso, e é a única do site cujos números
não vêm de obra publicada. Duas coisas na tela estavam piores que isso —
estavam **sem fonte nenhuma**, e a tela dizia.

## 1. O que estava aberto, e por quê

O levantamento de 2026-09-13, ao dar citação a cada verbete do glossário, achou
os dois únicos casos do site inteiro sem procedência:

| Número | O que foi feito na época |
|---|---|
| **Overrun** — a página afirmava "gelato artesanal fica entre 20 e 35%" | O número foi **removido**. Ficou só a definição. |
| **Densidade da calda, 1,10 g/mL** | Ficou, declarado na tela como **valor de trabalho**, não número de fonte. |

Procurei os dois na planilha do curso — overrun, aeração, litro, volume, ml,
densidade — e não existem lá. A temperatura de serviço, de que eu também
desconfiava, está: célula C24, `PAC/25`.

**Os dois livros que resolvem isso estavam em `references/gelato/` desde
2026-09-12, e ninguém tinha aberto.**

## 2. As duas obras

| Sigla aqui | Obra |
|---|---|
| **Clarke** | CLARKE, Chris. *The Science of Ice Cream*. Cambridge: Royal Society of Chemistry, 2004. 187 p. |
| **Corvitto** | CORVITTO, Angelo. *Los secretos del helado / I segreti del gelato*. Barcelona: Grupo Vilbo. Edição bilíngue italiano–inglês. |

**As duas se citam por página, e a paginação foi conferida.**

- **Clarke**: o PDF tem deslocamento constante de 18 — página impressa =
  página do PDF menos 18. Conferido em seis pontos (PDF 98→80, 99→81, 100→82,
  170→152, 171→153, 172→154), com o número impresso no cabeçalho de cada página.
- **Corvitto**: deslocamento constante de 2 no sentido inverso — impressa =
  PDF mais 2. Conferido em seis pontos (PDF 40→42, 41→43, 42→44, 46→48, 47→49,
  48→50). O livro imprime o italiano e o inglês em blocos consecutivos, e o
  mesmo assunto aparece duas vezes com páginas diferentes: o overrun está na
  **p. 42–43 em italiano e na p. 44 em inglês**. As citações do site apontam
  para a página inglesa, que é a que a maior parte de quem lê consegue conferir.

Nota de licença: o rodapé de toda página do Corvitto diz "*You may not use or
modify the total or partial contents of this book for commercial purposes*". O
site é gratuito e cita com atribuição, que é uso corrente de citação — mas
**reprodução de tabela dele está fora**, e nada aqui reproduz tabela. O que
entra são dois números e uma fórmula, com página.

## 3. Overrun: o que cada um diz

### 3.1 A definição, e ela é a mesma

> "The overrun is the ratio of the volume of gas to the volume of liquid,
> expressed as a percentage […] a foam that has twice the volume of the liquid
> from which it is made has 100% overrun."
> — Clarke, p. 18

> "L'aumento di volume di un mix di gelato, determinato dall'aria incorporata,
> viene definito overrun."
> — Corvitto, p. 42

Mesma grandeza, mesma definição. A divergência não é sobre o que é; é sobre
quanto.

### 3.2 A faixa, e aqui eles divergem — porque falam de produtos diferentes

> "In order to obtain a maximum quality ice-cream, the best overrun percentage
> is **between 30 and 40%. We place it around 35%**."
> — Corvitto, p. 44

> "[…] four ice cream samples that are identical except that they contain
> different volume fractions of air, **from 17 to 50%, i.e. 20% to 100%
> overrun**. […] increasing the overrun makes the ice cream softer."
> — Clarke, p. 153

> "In a standard ice cream formulation, sufficient partial coalescence occurs to
> enable a stable air cell structure to be maintained at overruns **up to about
> 120%**. It can be difficult to obtain overruns of more than **about 60% in
> products where fat and protein are not present**, or only present in small
> quantities, such as **sorbets**."
> — Clarke, p. 73

**Não é contradição, e a diferença é o argumento.** Clarke descreve sorvete
industrial, onde 100% de overrun — um litro de mistura virando dois de sorvete —
é rotina e o limite técnico fica perto de 120%. Corvitto descreve gelato
artesanal, e fixa 35% **por escolha de qualidade**, não por limite de máquina:
diz que ar demais deixa o gelato "sem corpo, perdendo frescor e sabor, com
aspecto de mousse e sensação de vazio na boca".

É por isso que gelato é mais denso que sorvete de pote de supermercado, e é a
coisa mais útil que estas duas páginas têm juntas.

**E corrige o que o site dizia.** A afirmação removida era "entre 20 e 35%". O
piso estava errado: Corvitto diz 30 a 40. Removê-la foi certo, e agora dá para
pôr a certa no lugar.

### 3.3 A conta, e aqui eles concordam sem se conhecer

Corvitto dá a receita de bancada:

> "A simple operation for calculating the overrun is to divide the weight of the
> mix by the weight of the ice-cream. From the result obtained, the two decimal
> figures will be the percentage of air incorporated."
> — Corvitto, p. 44

Com o exemplo: mesmo copo, 270 g de mix e 200 g de gelato → 1,35 → 35%.

Clarke chega pela densidade:

> "Since the density is the mass divided by the volume […] the overrun can be
> calculated from the densities of the ice cream and the unaerated mix."
> — Clarke, p. 80

**São a mesma equação.** Pesar o mesmo recipiente duas vezes é medir densidade
com o volume cancelando:

```
overrun = (ρ_mix − ρ_gelato) / ρ_gelato = (peso_mix / peso_gelato) − 1
```

Um livro de química da Royal Society e um gelatiere catalão, com vinte anos e um
Mediterrâneo entre eles, escrevendo a mesma conta de dois jeitos. Isso vira caso
de teste: a fórmula tem de fechar pelas duas formas, ou alguém transcreveu
errado.

Clarke também descreve o instrumento — o *overrun cup*, um copo de volume
conhecido, cheio sem bolhas e rasado com faca (p. 77) — e, para gelato já
endurecido, a câmara de deslocamento (p. 80), porque forçar gelato duro dentro
de um copo mudaria o volume.

## 4. Densidade: o número que estava certo, e a divergência que ele revela

> "For example, **one litre of a typical ice cream mix weighs 1.1 kg**, and
> contains 55% ice (i.e. 600 g) at −18 °C."
> — Clarke, p. 81

**O valor de trabalho do site era 1,10 g/mL.** Estava certo, e agora tem fonte.
É o desfecho mais tranquilo possível para uma pendência: o palpite declarado
bateu com o livro.

**Mas o Corvitto trabalha com outro número, e nunca o diz.** A conta dele é:

> "mix weight = 1000 g / ice-cream weight = 740 g […] the weight of a liter of
> ice-cream will be 740 grams."
> — Corvitto, p. 44

O salto de "1000 g de mix" para "um litro de gelato pesa 740 g" só fecha se um
litro de mix pesar 1000 g, ou seja, **densidade 1,00 g/mL**. Ele nunca escreve
isso; é pressuposto da aritmética.

Com os dois números juntos a diferença aparece:

| | Densidade do mix | Um litro de gelato a 35% de overrun |
|---|---|---|
| Corvitto (implícito) | 1,00 g/mL | **740 g** — o número que ele publica |
| Clarke (explícito) | 1,10 g/mL | **815 g** |

**O exemplo dele arredonda dos dois lados, e o teste diz isso.** 1000 ÷ 1,35 dá
740,7 e ele imprime 740; 1000 ÷ 740 dá 1,3514 e ele lê "35%" das duas casas
decimais. Nada disso muda o argumento — é um grama por litro —, mas a tolerância
do teste é de um grama **com o motivo escrito**, e não por conveniência.

Setenta e cinco gramas por litro, que numa cuba de 5 L são quase 400 g. **A
calculadora não escolhe por conta própria**: o campo de densidade continua
editável, o padrão continua 1,10 com a página de Clarke ao lado, e a divergência
vai para a tela com os dois valores.

**Por que 1,00 é plausível também.** Corvitto trabalha com base de gelato, que
tem menos gordura e mais açúcar que a mistura industrial que Clarke descreve;
nenhum dos dois publica a composição da mistura de que fala. Sem composição, não
dá para decidir qual está certo para a calda de quem está lendo — e é
exatamente por isso que o campo é editável e a régua de bancada do Corvitto
importa: **quem pesa o próprio copo não precisa acreditar em nenhum dos dois.**

## 5. A sutileza dos 105%

> "[…] one litre of a typical ice cream mix […] If the ice cream is aerated with
> 1 l of air (i.e. nominally 100% overrun), the volume of the ice cream is
> 1 l mix + 1 l air + 0.05 l due to change of volume of water on freezing.
> Therefore the overrun is actually **(2.05 − 1) / 1 × 100 = 105%, not 100%**.
> This is a relatively small effect for ice cream, and is often ignored."
> — Clarke, p. 81

A água cresce cerca de 8% ao virar gelo, então parte do "ar" medido não é ar. O
próprio Clarke diz que o efeito costuma ser ignorado. Entra na página como nota,
não como correção na conta: corrigir por isso exigiria saber o teor de gelo da
receita na temperatura de serviço, e aí seria conta nossa com cara de fonte.

## 6. O que a calculadora passa a fazer

1. **A densidade ganha fonte.** O padrão de 1,10 g/mL deixa de ser "valor de
   trabalho declarado" e passa a citar Clarke, p. 81. O campo continua editável.
2. **O overrun ganha faixa e alvo**, de Corvitto: 30% a 40%, com 35% como o
   valor que ele fixa. Com a faixa industrial de Clarke ao lado, para dizer por
   que gelato não é sorvete de pote.
3. **Entra a régua de bancada**, que é o que nenhuma calculadora de gelato em
   português tem: dado o peso do mesmo recipiente cheio de mix e cheio de
   gelato, o overrun sai da divisão. E o caminho inverso — a que peso um litro
   do seu gelato deveria chegar para bater no overrun que você quer.
4. **A divergência de densidade vai para a tabela de divergências**, com os
   740 g de Corvitto e os 815 g que o número de Clarke implicaria.

## 7. O que continua de fora

- **Sorbetto e base de fruta.** Clarke diz que acima de 60% é difícil sem
  gordura e proteína (p. 73), mas isso é teto técnico, não alvo de qualidade, e
  Corvitto não publica alvo separado para sorbetto. O site não inventa um.
- **Correção do overrun pelo teor de gelo** (a nota dos 105%). Exigiria o teor
  de gelo na temperatura de serviço, que a planilha do curso não dá.
- **Composição da mistura de referência de cada autor.** Nenhum dos dois
  publica, e é o que decidiria a divergência de densidade.
- **Migoya, _The Elements of Dessert_**, que está em `references/chocolate/` e
  ainda não foi lido. Pode ter um terceiro valor de densidade.
