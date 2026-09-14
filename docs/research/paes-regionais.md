# Pesquisa — Pães regionais

Complemento de [`paes.md`](paes.md). Ali a calculadora nasceu com dezessete
presets de duas obras — Kayser (França) e Camargo (Brasil). Este documento
responde a uma pergunta diferente: **o que os nove livros de pães regionais da
estante conseguem colocar na tela**, sob a regra de que número sem fonte não
entra.

A resposta curta é desconfortável: **de nove livros, um serve inteiro.**

---

## 1. A triagem, e por que ela veio antes de qualquer receita

A calculadora de pães é porcentagem de padeiro: farinha = 100, todo o resto em
relação a ela. Para transcrever uma receita é preciso que a fonte **pese** pelo
menos farinha, líquido, sal e fermento. Uma receita em xícaras não vira preset —
ela viraria uma conversão minha, e conversão minha não é fonte.

Foi por isso que a triagem mediu duas coisas em cada obra, antes de ler receita
nenhuma: se o PDF tem texto de verdade ou OCR de scan, e se o autor pesa.

| Obra | Formato | Camada de texto | Pesa? | Veredito |
| --- | --- | --- | --- | --- |
| Scheft, *Breaking Breads* | PDF | **fontes embutidas** | **sim, grama primeiro** | **usado** |
| Cho, *Mooncakes and Milk Bread* | EPUB | texto | parcial — 249 pesagens, **sal nunca** | usado só para o tangzhong |
| Helou, *Feast: Food of the Islamic World* | EPUB | texto | parcial — 1.104 pesagens, **sal e fermento nunca** | recusado (§4.1) |
| Alford & Duguid, *Flatbreads & Flavors* | PDF | `GlyphLessFont` (OCR) | **não** — 9 "gram" em 484 páginas | recusado |
| Sahni, *Classic Indian Cooking* | PDF | Courier não embutida (OCR) | **não** | recusado |
| Kassis, *The Arabesque Table* | PDF | `GlyphLessFont` (OCR) | parcial, e o OCR quebra | recusado |
| Nguyen, *Asian Dumplings* | EPUB | texto | **não** | recusado |
| Alford & Duguid, *Mangoes & Curry Leaves* | EPUB | texto | **não** | recusado |
| Duguid, *Taste of Persia* | EPUB | texto | **não** — as 16 gramas são a tabela de conversão do apêndice | recusado |

### 1.1 Como se reconhece um scan com OCR

`pdffonts` responde antes de abrir o livro. Quando a única fonte é
`GlyphLessFont`, o PDF é imagem com uma camada invisível gerada por Tesseract: o
que se lê não é o que a editora compôs, é o que o reconhecedor achou.

O estrago aparece exatamente onde dói. Em Kassis, `Makes 8-l0 flatbreads` (letra
`l` no lugar do algarismo `1`), `alarge bowl`, e toda fração `½` virando `%`. A
lição é a mesma do Foodpairing e do gelato, e já está no
[LEARNINGS](../quality/LEARNINGS.md): **OCR acerta nome e destrói número.** Nome
errado se percebe lendo; número errado atravessa a revisão inteira parecendo um
número.

### 1.2 O livro que mais decepcionou

*Flatbreads & Flavors* tem o subtítulo "a baker's atlas", 484 páginas e 184
receitas de pão achatado do mundo inteiro — é, na aparência, exatamente a fonte
que esta pesquisa procurava. Ele não pesa nada. Nove ocorrências da palavra
"gram" no livro todo, nenhuma numa receita.

Não é defeito da obra: é um livro de 1995 escrito para a cozinha americana, em
xícaras. Só não serve **aqui**.

---

## 2. Uri Scheft, *Breaking Breads* (Artisan, 2016)

Padeiro do Lehamim, em Tel Aviv, e do Breads Bakery, em Nova York. O livro é
gramatura profissional em tabela de duas colunas — `Fine salt / 15 grams
(1 tablespoon)` — e chega a declarar o teor de proteína da farinha
(`All-purpose flour (sifted, 11.7%)`).

### 2.1 Paginação conferida

O PDF traz a marca de composição `56077txt.indd N` no rodapé, e `N` é a página
impressa. Conferido em seis pontos: PDF 25→24, 100→99, 175→174, 250→249,
320→319, e o fólio impresso "176" aparece na página 177 do PDF. **Deslocamento
constante: impressa = PDF − 1.** Batido ainda contra o sumário (PDF 24 abre o
capítulo "CHALLAH", que o sumário põe na página 23; PDF 114 abre "FLATBREADS",
anunciado na 113). `locator: 'page'` está liberado para esta obra.

### 2.2 O peso do ovo, pelos números do próprio livro

Scheft nunca pesa um ovo inteiro, mas pesa os separados: `Large egg yolks /
120 grams (6 yolks)` dá 20 g de gema, e `Large egg whites / 4 (120 grams)`
mais `Large egg whites / 5 (150 grams)` dão 30 g de clara, duas vezes. **Ovo
grande = 50 g, pela aritmética da própria obra.** É a mesma política já adotada
com Kayser, que trabalha com ovo de ~45 g (`paes.md` §4.6): cada livro é
transcrito com o ovo que ele mesmo usa.

### 2.3 O caso de verdade: o rendimento declarado

Quase toda receita publica o peso da massa pronta ("Makes 8 pita breads /
900 grams of dough"). Somar a lista de ingredientes e comparar com esse número é
um teste de transcrição que a fonte oferece de graça — e ele pegou um erro real.

| Pão | Soma dos ingredientes | Livro declara | |
| --- | --- | --- | --- |
| Pan Pita | 940 g | 900 g | ok (Scheft arredonda) |
| Challah | 1.730 g | 1,75 kg | ok |
| **Malawach** | **1.974 g** | **1,7 kg** | **274 g sobrando** |
| Pain de Mie | 787 g | 800 g | ok |
| Focaccia sem sova | 1.560 g | 1,5 kg | ok |
| **Ciabatta** | **1.008 g** | **1,1 kg** | **92 g faltando** |

Os dois desvios eram transcrição errada, e cada um ensinou uma coisa:

- **Malawach.** Os 270 g de manteiga da lista não vão na massa: laminam. Tirando
  a manteiga, a soma dá **1.704 g contra 1.700 g declarados** — bate na casa da
  grama. O método confirma ("Lightly butter your work surface", "butter the top
  of the fold"). O mesmo vale para o jachnun e para o kubaneh, cuja manteiga
  também é de laminação/forma.
- **Ciabatta.** Faltavam os 100 g de água da segunda adição (bassinage), que
  entram depois da mistura. Hidratação real 480/600 = **80%**, não 63%.

Sem esse confronto, o malawach teria entrado no site com 27% de gordura na massa
— um número que não existe em lugar nenhum.

### 2.4 Formulário extraído (porcentagem de padeiro)

Farinha = 100. Fermento é o fresco, como o livro escreve primeiro.

| Pão | Página | Hidratação | Sal | Ferm. fresco | Açúcar | Gordura | Ovo | Outros |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| **Pan Pita** | 116 | 60,9% | **2,73%** | 3,64% | 3,6% | — | — | — |
| **Laffa** | 121 | \=pita | \=pita | \=pita | \=pita | — | — | mesma massa, forno a 274 °C |
| **Challah** | 27 | 40% | 1,5% | 4% | 10% | óleo 7,5% | 10% | — |
| **Bagel de Jerusalém** | 176 | 56% | **3%** | **5%** | 10% | azeite 4% | — | leite em pó 12% |
| **Malawach** | 145 | 63% | 2% | — | 5% | — (lamina) | — | fermento químico 0,4% |
| **Jachnun** | 149 | 67,5% | 2% | — | 5% | — (lamina) | — | mel 3,5%, ferm. químico 0,2% |
| Kubaneh | 160 | 58% | **4%** | 4% | 12% | — (lamina) | — | **retido, ver §3** |
| Pain de Mie | 186 | 40% | 1,56% | 3,33% | 16,7% | manteiga 10% | — | leite em pó 3,3% |
| Ciabatta | 180 | 80% | 1,67% | 3% | — | — | — | — |
| Focaccia sem sova | 125 | 80% | 1,18% | 1,18% | 1,2% | azeite a gosto | — | — |
| Light Brioche | 165 | 30% | 2% | 4% | 10% | manteiga 27% | 10% | — |
| Dill Bread | 190 | 21,4% | 1,79% | 4,17% | 6% | manteiga 8,9% | — | iogurte 21,4% |
| Spelt and Muesli | 194 | 46% | 2% | 4% | 10% | azeite 9% | 10% | 50% espelta |

Entram no site os seis primeiros. Os de baixo ficam registrados porque a
extração já foi feita e conferida — ciabatta, focaccia, pain de mie e brioche já
têm equivalente vindo de Kayser e Camargo, e repetir família não acrescenta.

### 2.5 Um erro de identificação que o sumário pegou

A tabela de ingredientes que aparece logo depois da variação "Traditional
Overnight Kubaneh" **não é do kubaneh** — é do *Light Brioche*, p. 165. Extração
por proximidade de título atribuiria ao kubaneh uma receita com 150 g de água e
135 g de manteiga que não é dele. O sumário do capítulo (PDF 158) e a ordem das
páginas desfizeram. Fica como regra: **em livro ilustrado, a tabela mais próxima
do título nem sempre é a tabela do título.**

---

## 3. O kubaneh fica de fora, e por quê

O kubaneh (p. 160) é o pão iemenita que Scheft descreve como "a cross between a
brioche and a flatbread". A receita está limpa, a soma bate com o rendimento
declarado (890 g contra 860 g), e ela diz **20 g de sal para 500 g de farinha —
4%**.

O livro é internamente coerente: em toda a obra 1 colher de sopa de sal fino são
15 g, e "1 tablespoon plus 1 teaspoon" são exatamente os 20 g impressos. Não é
erro de digitação nem de extração.

Mas 4% é o dobro do que o **mesmo autor** usa no challah (1,5%), e acima de tudo
o que ele usa em qualquer outro pão do livro (2% a 3%). Não é divergência entre
fontes — é ponto fora da curva **dentro de uma fonte**, que é o padrão de um
erro de edição, não de uma escolha.

O precedente do projeto é o pH da Embrapa (`picles-fermentacao.md`, Parte II):
quando uma lista se contradiz, usa-se a parte coerente e registra-se o defeito.
Aqui não há parte coerente para salvar — o número é o único que existe.

**Decisão:** o kubaneh não vira preset enquanto não houver segunda fonte. Quem
seguisse 4% faria um pão que fermenta mal e é intragável, e a calculadora teria
dado a ele um selo de procedência. Fica na lista de compras junto com os manuais
de pectina.

---

## 4. As obras recusadas, e o que exatamente faltou

### 4.1 Helou, *Feast: Food of the Islamic World* (Phaidon, 2018)

É a recusa que custa. São 311 receitas, 1.104 pesagens, EPUB com texto perfeito
e pão de todo o mundo islâmico — pita levantina, aysh baladi egípcia, khobz
marroquino, chila somali, naan. A anotação é grama entre parênteses ao lado da
xícara: `Just over 4 cups (500 g) unbleached all-purpose flour`. Água em
mililitro, que para pão é grama.

E o sal é sempre `2 teaspoons fine sea salt`. O fermento é sempre `1 heaping
teaspoon instant (fast-acting) yeast`. **Sem exceção, e sem tabela de conversão
no livro.** Fica meia fórmula: hidratação, gordura e açúcar pesados; os dois
ingredientes que decidem fermentação, em colher.

Converter colher em grama aqui seria repetir o erro que a densidade do sal do
Livro da Biodiversidade quase produziu (`geleias.md`, Parte III): o número
sairia do meu braço, não do livro. E sal fino de mar em colher varia demais —
colher rasa e colher cheia não são o mesmo pão.

A pita do Helou (p. 98 do EPUB) e a do Scheft são o mesmo pão de duas mãos
diferentes; só uma delas pode ser transcrita. Se aparecer uma edição do *Feast*
com quadro de conversão, esta seção é a lista de compras pronta.

### 4.2 Cho, *Mooncakes and Milk Bread* (Harper Horizon, 2021)

Mesmo desenho: 249 pesagens, e o sal em `½ teaspoon coarse salt` — sal **grosso**
em colher, que é ainda pior que o fino, porque a densidade depende do grão.

O livro entra por outra porta, em §5.

---

## 5. Tangzhong — a técnica que veio de fora do formulário

> "Tangzhong is a type of roux, made with a **1:5 ratio of flour to milk**."
> — Cho, *Mooncakes and Milk Bread*, cap. "Ingredients"

É proporção declarada, não receita: não precisa de sal nem de fermento para ser
verdadeira. E a própria autora a confirma na receita "Mother of All Milk Bread",
cuja tangzhong são **20 g de farinha para 100 g de leite** — exatamente 1:5.
Fonte que obedece a si mesma é o caso de verdade que este projeto já usou com a
Embrapa (11 formulações dentro da própria faixa de pectina) e com Corvitto.

Na calculadora, a tangzhong se comporta como pré-fermento: carrega farinha e
líquido para dentro da massa, e ignorar isso subestima a hidratação real. Em
`PRE_FERMENT_HYDRATION` ela é **500%** — cinco partes de leite por uma de
farinha.

Não vem preset com ela. O pão de leite do livro tem o sal em colher, e pão sem
sal não é preset de pão. O que entra é a técnica, aplicável a qualquer massa
enriquecida que a pessoa já tenha na tela.

---

## 6. O que estes pães fazem com as faixas da calculadora

É o achado mais útil da pesquisa, e não estava previsto. As faixas de
`src/data/bread/ranges.ts` foram calibradas em Kayser e Camargo — pão francês,
europeu, magro. Metade dos pães do Levante cai fora delas:

| Medida | Faixa hoje | Limite duro hoje | Quem estoura |
| --- | --- | --- | --- |
| Sal | 1,5–2,2% | máx. 2,5% | pita **2,73%**, bagel de Jerusalém **3%** |
| Fermento fresco | 0,4–1,4% | máx. 4% | bagel de Jerusalém **5%** |
| Hidratação | 60–70% | **mín. 50%** | challah **40%** |
| Gordura | 0–15% | máx. 55% | (só sinaliza, e está certo) |

O limite duro significa, no código e no texto da tela, "aqui as fontes param de
dar respaldo". Uma receita publicada por padeiro profissional **é** respaldo.
Então o limite duro está errado, não o pão.

Três mudanças, cada uma com a receita que a sustenta:

1. **Sal, limite duro 2,5% → 3%** — bagel de Jerusalém, Scheft p. 176. A faixa
   recomendada (1,5–2,2%) não se mexe: o pão do Levante continua sinalizando
   "acima do usual europeu", o que é verdade e é informação.
2. **Fermento fresco, limite duro 4% → 5%** — mesma página. Dose alta para pão
   de padaria que vai ao forno no mesmo dia.
3. **Hidratação, o limite duro mínimo sai.** Este é um defeito que já estava no
   ar: o brioche do Kayser, preset publicado desde o começo, tem **0% de água** —
   o líquido todo vem de ovo e manteiga — e dispara o alarme de limite duro hoje.
   O challah de Scheft (40%) e o light brioche (30%) chegam pelo mesmo caminho.
   Água sozinha não mede massa enriquecida, e não existe piso defensável: as
   fontes respaldam até zero. Sai o piso, fica o aviso de faixa, e a nota passa a
   dizer que a banda de 60–70% é de massa magra, citando as duas obras.

O teto de 90% fica: ciabatta a 80% (Scheft p. 180) é o mais molhado que qualquer
fonte da estante publica.

### 6.1 De brinde: uma divergência do Camargo com ele mesmo

O teste que trava "nenhum preset estoura limite duro" derrubou um preset que
está no ar desde o começo — e não era nenhum dos novos.

Camargo enuncia o teto do fermento seco instantâneo em 1% da farinha (cap. 1,
"Sobre o fermento"), e a broa à portuguesa do mesmo livro leva 5 g de fermento
para 450 g de farinha: **1,11%** (cap. 3). O autor passa da própria regra por um
décimo.

Nada muda. O teto continua em 1% porque é regra enunciada, e a broa continua com
1,1% porque é receita publicada; quem abrir a broa vê o selo de "acima do
limite" e a nota dizendo de onde vem o teto. É o comportamento que se quer de uma
calculadora que promete mostrar a fonte: a contradição fica visível em vez de ser
alisada por um arredondamento. Travado em `levant.test.ts`.

---

## 7. Presets que entram

Seis, todos de Scheft, todos conferidos contra o rendimento declarado quando
existe.

| id | Pão | Página | Origem |
| --- | --- | ---: | --- |
| `pita` | Pan Pita | 116 | Levante — feito na frigideira, não no forno |
| `laffa` | Laffa | 121 | mesma massa da pita, forno a 274 °C, sem bolso |
| `challah` | Challah | 27 | pão judaico de trança |
| `jerusalem-bagel` | Bagel de Jerusalém | 176 | Jerusalém — nada a ver com o bagel americano |
| `malawach` | Malawach | 145 | iemenita, laminado com manteiga, frigideira |
| `jachnun` | Jachnun | 149 | iemenita, 12 h a 107 °C |

Ingredientes novos no modelo: **mel**, **fermento químico** e **óleo neutro** (o
challah pede girassol ou canola, com manteiga como alternativa — não é azeite e
não é banha).

Processos que o modelo ainda não tinha: **frigideira** (pita, malawach) e
**forno baixo por muitas horas** (jachnun). Ambos entram como nota de processo,
que é o campo que já existe para isso.

---

## 8. Pendências

- **Segunda fonte para o kubaneh** (§3). Sem ela o pão não entra.
- **Tabela de conversão do *Feast*** (§4.1). Com ela, vinte pães do mundo
  islâmico entram de uma vez.
- **Densidade de sal fino e de sal grosso**, com fonte. Destravaria Helou, Cho e
  a pendência que já existe do sal brasileiro em `geleias.md` Parte III.
- Pão no vapor (Huang & Miskelly) e pão sem glúten (Arendt & Dal Bello) seguem
  sem obra na estante — ver a memória `bibliografia-a-atualizar`.
