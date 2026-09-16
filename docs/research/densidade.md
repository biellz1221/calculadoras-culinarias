# Densidade de líquidos — converter mililitro em grama

Pesquisa que precede a calculadora de densidade. Autorizou o motor
(`src/data/density/`, `src/lib/density/`) com três réguas: água e etanol pela
OIML R 22, calda de sacarose pelo NBS 457, e os demais líquidos pela composição
(Choi & Okos, via ASHRAE e Fricke & Becker) — Parte IV-B.

O problema: receita que dá líquido em volume ("200 mL de leite", "meia xícara de
mel") não se pesa. Converter exige a densidade, que muda com o ingrediente e com
a temperatura — e que quase nenhuma fonte de cozinha publica.

---

## Parte I — Triagem das fontes

Rodada em 2026-09-16, `pdfinfo` + `pdffonts` em tudo antes de ler qualquer
conteúdo.

| Obra | Triagem | Veredito |
| --- | --- | --- |
| ASHRAE Handbook — Refrigeration 2022, cap. 19 | fontes embutidas com subset (`ECDOMJ+TimesNewRomanPSMT`, Type 1C) | **texto digital**; número pode sair da camada de texto |
| OIV-MA-AS312-02 (tabelas alcoométricas) | `Creator: Microsoft Word 2007`, Times New Roman | **texto nativo**; confiável |
| OIML R 22 | `Producer: Xerox`, **zero fontes** | **scan puro, sem camada de texto**; todo número sai da imagem |
| NBS Circular 457 | `Creator: Digitized by the Internet Archive`, fonte única `Courier` | **OCR sobre imagem**; número só vale conferido na imagem |
| USDA SR Legacy | CSV, dado estruturado | n/a |
| Fricke & Becker (2001), *HVAC&R Research* 7(4) | `Creator: FrameMaker 6.0`, Times não embutida | **texto digital**; versão diagramada da revista. Impressa = PDF + 310, conferido em 4 pontos |

Duas observações que valem para o futuro:

- **O OIML R 22 oficial é scan.** Baixado do próprio `oiml.org`, 71 páginas, e
  não tem uma letra de texto. Transcrever as tabelas inteiras à mão é inviável —
  o caminho é a fórmula analítica, conferida contra a tabela impressa (Parte IV).
- **Courier sozinha é assinatura de OCR**, como o LEARNINGS já registrava. O NBS
  457 caiu nessa triagem em dez segundos.

---

## Parte II — ASHRAE cap. 19: o método, não a tabela

O que o handbook dá não é uma lista de densidades. É um **modelo** (Choi & Okos
1986, reproduzido na Tabela 1 do capítulo):

    ρ = (1 − ε) / Σ (xᵢ / ρᵢ)

`ε` é porosidade (zero fora de granel), `xᵢ` são frações mássicas e `ρᵢ` a
densidade de cada constituinte a `t` °C:

| Constituinte | ρ (kg/m³), t em °C | a 20 °C |
| --- | --- | --- |
| água | 9,9718×10² + 3,1439×10⁻³t − 3,7574×10⁻³t² | 995,7 |
| proteína | 1,3299×10³ − 5,1840×10⁻¹t | 1319,5 |
| gordura | 9,2559×10² − 4,1757×10⁻¹t | 917,2 |
| carboidrato | 1,5991×10³ − 3,1046×10⁻¹t | 1592,9 |
| fibra | 1,3115×10³ − 3,6589×10⁻¹t | 1304,2 |
| cinza | 2,4238×10³ − 2,8063×10⁻¹t | 2418,2 |

Fonte: ASHRAE Handbook—Refrigeration 2022, cap. 19, Tabelas 1 e 2; equação (6)
em 19.6. **A paginação é por capítulo** (`19.1`, `19.6`), com deslocamento
constante conferido em quatro pontos: PDF 309 → 19.1, 312 → 19.4, 316 → 19.8,
320 → 19.12. Como o campo `page` do projeto é `number`, o ASHRAE entraria como
`locator: 'chapter'`.

### O modelo contra o que dá para conferir — e o que não dá

Uma primeira versão desta seção comparava o modelo com uma coluna de "valor
aceito" (óleo 0,915–0,920, leite 1,030–1,033…). **Aqueles números eram de
memória, sem fonte**, e foram retirados. O que existe de citável:

| | modelo a 20 °C | referência | fonte da referência |
| --- | --- | --- | --- |
| água pura | 0,9957 | **0,9982** | OIML R 22 (Parte IV-A) |
| óleo (100% gordura) | 0,917 | 0,913 | porção do USDA, fdc 171413 |
| leite integral | 1,025 | 1,031 | porção do USDA, fdc 171265 |
| mel (17,1% água) | 1,450 | 1,433 | porção do USDA, fdc 169640 |
| clara crua | 1,031 | 1,027 | porção do USDA, fdc 172183 |
| creme 36% | 0,981 | 1,008 | porção do USDA, fdc 170859 |

A água é a única referência forte, e ela já diz algo: **a água do próprio
modelo erra 0,25%** (995,7 contra 998,2 kg/m³). Parte do viés para baixo do
Choi & Okos vem do constituinte água, não da mistura.

**Porção do USDA não é densidade medida.** Nenhuma das porções acima declara
proveniência — `data_points`, ano e nota estão vazios em todas. A água passa no
teste do valor conhecido (29,6 g por fl oz → 1,0009, ou seja, o USDA tomou água
como 1,000 e arredondou). O creme não passa: 238 g por xícara, 15 g por colher e
29,8 g por fl oz dão todos ~1,006–1,014, coerentes entre si e incoerentes com a
física da própria composição — gordura pesa ~0,92, e com 36% dela a mistura fica
perto de 0,99. É a armadilha do Camargo que o LEARNINGS já registrava, mais
discreta: o valor conhecido fecha e o item de interesse, não. **Porção do USDA
serve para achar candidato, não para produzir número de tela.**

**E o modelo vale para líquido, não para alimento em geral.** Phinney et al. (2017) reaplicaram o modelo à
composição do USDA e relatam erro de densidade **chegando a 10%** no conjunto
geral dos alimentos. A explicação que se sustenta é a porosidade: em sólido
poroso `ε` não é zero e ninguém a conhece. É argumento a favor de a calculadora
ser **de líquidos** e recusar o resto, em vez de responder mal sobre tudo.

---

## Parte III — A lacuna que decide o desenho: não existe etanol no modelo

Os constituintes do Choi & Okos são água, proteína, gordura, carboidrato, fibra
e cinza. **Álcool não está na lista.** O modelo não avisa: ele trata o etanol
como ausência e devolve um número com cara de certo.

Medido, com a composição do USDA (fração em massa) e ρ do etanol puro a 20 °C =
789,24 kg/m³, que é a errata impressa na capa do OIML R 22:

| destilado do USDA: 36,0% de álcool **em massa** (= 43% vol) | g/mL | erro |
| --- | --- | --- |
| álcool tratado como água | 0,996 | **+5,6%** |
| mistura linear com etanol puro | 0,910 | −3,5% |
| fórmula da OIML | **0,943** | — |

**Correção de uma versão anterior desta tabela.** Ela dava 0,948 como "tabela
OIML (36% massa)", com erros de 5,1% e 4,0%. O número foi escrito antes de haver
fórmula, e é a densidade de **40% em volume** (= 33,3% em massa) — exatamente a
troca de grandeza que a Parte IV avisa ser erro de dez pontos. Havia também uma
coluna de vinho tinto com "real 0,990", de memória e sem fonte; saiu. Vinho tem
2–3% de extrato seco, e a fórmula da OIML só descreve água e etanol: sem
referência medida, não há o que afirmar. O teste
`src/lib/density/ethanol.test.ts` nasceu desta correção.

A mistura linear erra para o outro lado, e erra quase tanto: água e etanol
**contraem** ao se misturar, e é exatamente por isso que as tabelas
alcoométricas existem. Não há atalho aritmético.

**Consequência para o site hoje:** o catálogo do gelato registra `cachaca`,
`cointreau` e `rum` com `water: 1` — álcool contado como água. Para PAC e POD a
simplificação se defende (e `pac: 2` reconhece o efeito anticongelante), mas
qualquer uso desses ingredientes em conta de densidade herdaria os 5%.

---

## Parte IV — As três réguas

Nenhuma delas cobre o que as outras cobrem, e a tela precisa **declarar qual
respondeu** em cada caso. As três estão no motor; a 1 está detalhada na Parte
IV-B.

### 1. Líquido comum → modelo composicional

Composição do **USDA SR Legacy** (domínio público, CC0) no modelo do Choi &
Okos. Cobre leite, cremes, ovos, sucos, mel, xaropes, óleos, vinagre, melaço.

O USDA é a escolha certa e não só por ser livre: a Tabela 3 do próprio ASHRAE
declara "*Composition data from USDA (1996)*". Ir ao USDA é ir à fonte primária
do handbook, com mais cobertura e sem obra paga no caminho. Conferido: o mel dá
17,1% de água nos dois.

### 2. Qualquer coisa com álcool → tabela alcoométrica

**OIV-MA-AS312-02** (texto nativo) traz densidade de misturas etanol-água por
**% em volume** e por temperatura, de 0 a ~31%.

Ressalva, achada ao tentar usá-la como caso-verdade fora dos 20 °C: o título é
"*apparent densities … Pyrex pycnometer*", e densidade aparente em picnômetro
embute a dilatação do vidro, cujo coeficiente o documento não declara; e a
camada de texto repete a linha "30°" em duas páginas com valores diferentes.
**A OIV serve de conferência a 20 °C, onde o vidro não pesa. Fora disso, a
conferência é a Tabela I da própria OIML** (Parte IV-A).

Caso-verdade: a 20 °C e 0% de álcool a tabela dá **998,20 kg/m³** — o valor
aceito da água a 20 °C, e mais exato que os 995,7 do modelo composicional.

**OIML R 22** cobre 0 a 100% e é a norma, mas por **% em massa** — grandeza
diferente da do OIV, e confundir as duas é erro de 10 pontos. Caso-verdade lido
na imagem: p=0 dá 999,84 a 0 °C e 999,70 a 10 °C, os dois corretos.

Como o OIML é scan, o caminho é implementar a fórmula analítica que a
Recomendação publica e **conferir contra a tabela impressa** — o mesmo padrão de
"fonte que se confere sozinha" que autorizou transcrever o Wybauw. Feito na
Parte IV-A.

---

## Parte IV-A — A fórmula da OIML R 22, transcrita e conferida

**A tabela não é a fonte: a fórmula é.** O documento diz, na p. 5 (§4), que
"*Tables I and IIIa are calculated directly from the general formula*". Ou seja,
usar a fórmula não é aproximar a tabela — é usar o que gerou a tabela. Não há
diferença a declarar na página.

Forma geral (p. 5):

    ρ = A₁ + Σ(k=2..12) A_k·p^(k−1) + Σ(k=1..6) B_k·(t−20)^k
          + Σ(i=1..5) Σ(k) C_i,k·p^k·(t−20)^i

`p` é **fração mássica** de etanol, `t` em °C. Faixa de validade: −20 a +40 °C.

Os 54 coeficientes (12 A, 6 B, 36 C) estão na p. 13 e foram **transcritos da imagem renderizada**,
porque o PDF não tem camada de texto. O documento usa vírgula decimal e espaços
como separador de grupo (`9,982 012 300 · 10²` = 998,2012300).

```
A₁..A₁₂ (kg/m³)
   998.2012300      -192.9769495       389.1238958     -1668.103923
 13522.15441      -88292.78388      306287.4042      -613838.1234
747017.2998      -547846.1354      223446.0334       -39032.85426

B₁..B₆
  -0.20618513   -5.2682542e-3   3.6130013e-5   -3.8957702e-7
   7.1693540e-9  -9.9739231e-11

C₁,ₖ (k=1..11)
   0.1693443461530087   -10.46914743455169     71.96353469546523
-704.7478054272792     3924.090430035045  -12101.64659068747
22486.46550400788    -26055.62982188164   18523.73922069467
-7420.201433430137     1285.617841998974

C₂,ₖ (k=1..10)
  -0.01193013005057010   0.2517399633803461   -2.170575700536993
  13.53034988843029    -50.29988758547014   109.6355666577570
-142.2753946421155     108.0435942856230    -44.14153236817392
   7.442971530188783

C₃,ₖ (k=1..9)
  -6.802995733503803e-4   1.876837790289664e-2  -0.2002561813734156
   1.022992966719220     -2.895696483903638     4.810060584300675
  -4.672147440794683      2.458043105903461    -0.5411227621436812

C₄,ₖ (k=1..4)
   4.075376675622027e-6  -8.763058573471110e-6
   6.515031360099368e-6  -1.515784836987210e-6

C₅,ₖ (k=1..2)
  -2.788074354782409e-8   1.345612883493354e-8
```

Ponte entre as duas grandezas (p. 5), necessária porque OIML trabalha em massa e
OIV em volume — **confundir as duas é erro de dez pontos**:

    q = ρ₂₀(p) · p / ρ₂₀(100%),   com ρ₂₀(100%) = 789,24 kg/m³

### Conferência — cinco casos-verdade

| Prova | Resultado |
| --- | --- |
| Tabela I do próprio OIML, água de 0 a 10 °C (11 pontos, lidos na imagem) | pior diferença **0,005 kg/m³** |
| Tabela I do **OIV**, 0 a 11% vol a 20 °C (documento diferente, outra grandeza, texto nativo) | pior diferença **0,008 kg/m³** |
| Etanol puro a 20 °C — errata impressa na capa diz 789,24 | fórmula dá **789,239** |
| Máximo de densidade da água (fenômeno físico, ~3,98 °C) | fórmula põe em **4 °C** |
| **Tabela I, 38 células com teor e temperatura variando juntos** — 5 a 100% em massa, 0 a 40 °C, pp. 20, 21, 24 e 27, lidas na imagem girada | pior diferença **0,00497 kg/m³** |

As diferenças são o arredondamento das tabelas, que têm duas casas. O único
ponto acima de 0,01 é o de 2% vol, onde o OIV imprime `995.2` com uma casa só —
defeito de composição da tabela, não da fórmula.

**Uma versão anterior desta seção dizia que "se algum dos 44 coeficientes
tivesse um dígito errado, nenhum dos quatro fecharia". Era falso**, e só
apareceu ao corromper um coeficiente de propósito: `C₂,₄` trocado de 13,53 para
13,35 passou por todos os testes. Os quatro primeiros casos têm teor zero (água)
ou temperatura de 20 °C (OIV, etanol puro), e os 36 coeficientes `Cᵢ,ₖ`
multiplicam `p^k·(t−20)^i`, que se anula nos dois. Só a grade de 38 células
exercita os termos cruzados; com a mesma corrupção, 29 delas caem. Canto
conferido de fora: etanol puro a 40 °C dá 771,93, que é o piso de faixa que
implementações independentes da norma declaram.

### 3. Calda de açúcar → Brix (NBS Circular 457)

**Paginação:** deslocamento constante de 2 entre PDF e impresso (PDF 4 → 2,
16 → 14, 29 → 27, 30 → 28). Triagem: OCR em Courier sobre digitalização — todo
número saiu da imagem.

**A tabela usada é a 2, e não a 1.** A Tabela 1 dá 0 a 95 °Brix de 0,1 em 0,1,
mas só a 20 °C. A **Tabela 2** (p. 27) dá o peso por galão americano de 5 em 5
°Brix e a **10, 15, 20, 25 e 30 °C**, calculado das densidades de Plato — e
publica cada célula **em libra e em grama**. Essa redundância é o que autoriza a
transcrição: 99 das 100 células fecham dentro do arredondamento (±0,73 g).

**Defeito da fonte:** a 95 °Brix e 15 °C a circular imprime **12.644 lb** ao lado
de **5,744 g**. As duas não fecham (12,644 lb são 5.735 g). A grama está certa: a
coluna de gramas é lisa (segunda diferença entre 1 e 5 g em toda a tabela) e a
linha em libras pularia só 0,005 de 15 para 20 °C, onde todas as outras pulam
~0,025. O valor coerente é 12,664. Conferido a 500 dpi: é o que está impresso,
não defeito da digitalização.

**Extrapolação declarada:** de 75 a 95 °Brix a 10, 25 e 30 °C os valores são
extrapolados, "given in italics" (p. 27). A 15 °C também houve extrapolação, mas
ela coincidiu "to less than one in the last figure given" com a tabela de Plato
a 15°/15° C e sai em tipo normal. O motor segue o itálico, e marca a resposta
quando uma célula itálica pesa nela.

**Peso no ar, não densidade.** A p. 2, no parágrafo de método, declara as duas
coisas que a conversão precisa: o peso no vácuo foi convertido em peso no ar com
"density of air, 0.0012" e "for brass weights (density, 8.4)". Invertendo:
`ρ = W/V · (1 − ρ_ar/ρ_latão) + ρ_ar`. A mesma página diz que a circular usou
**453,5924 g por libra** — a libra de antes de 1959.

Uma primeira versão desta seção — e do motor — leu só o ar, que a p. 28 repete
para a Tabela 2, e afirmou que o empuxo sobre os pesos "não é declarado". É
declarado. Quem achou foi a revisão de código, ao ler a obra desde a p. 2; a
conferência com a OIML mostrava um resto sistemático de +0,01 a +0,025% que eu
atribuí ao que não estava lá.

**Duas fontes independentes para a mesma água** — Plato (1900, tabelado em 1946)
contra Wagenbreth & Blanke (adotados pela OIML em 1973):

| °C | NBS no ar | NBS convertido (p. 2) | OIML | diferença | sem conversão |
| --- | --- | --- | --- | --- | --- |
| 10 | 0,99857 | 0,99963 | 0,99970 | −0,0068% | −0,113% |
| 15 | 0,99804 | 0,99910 | 0,99910 | +0,0004% | −0,105% |
| 20 | 0,99725 | 0,99831 | 0,99820 | +0,0106% | −0,095% |
| 25 | 0,99593 | 0,99699 | 0,99704 | −0,0057% | −0,112% |
| 30 | 0,99461 | 0,99567 | 0,99565 | +0,0020% | −0,104% |

Com a conversão inteira, a diferença troca de sinal entre as temperaturas e fica
abaixo do arredondamento do grama impresso (±0,5 g em 3.765 g, 0,0133%) — que é
o que duas fontes certas devem mostrar. Sem conversão, as fontes discordariam
dez vezes mais.

**Interpolação:** linear em Brix e em temperatura. O erro no meio de um
intervalo é a segunda diferença ÷ 8; com a maior da tabela (5 g), 0,63 g por
galão — **0,014%** no pior ponto (45 °Brix, 10 °C), da ordem do arredondamento
do grama impresso, e não abaixo dele. Uma versão anterior dizia "menos que o
arredondamento": 0,63 g é maior que os 0,5 g do arredondamento.

**Fora da tabela, nulo:** calda quente (acima de 30 °C) não tem fonte aqui.

---

## Parte IV-B — O modelo composicional, citado e medido

**Fontes.** O dono do projeto autorizou citar o ASHRAE (obra comercial). A nova
tentativa pelo Internet Archive recuperou o auto-arquivo dos autores: **Fricke,
B. A. & Becker, B. R. (2001)**, *HVAC&R Research* 7(4): 311–330. A pista que eu
tinha era "Becker & Fricke, 1999" — e os dois existem: o próprio cap. 19 do
ASHRAE cita "Becker and Fricke (1999) and Fricke and Becker (2001, 2002)"
(p. 19.25). A pista misturou dois trabalhos dos mesmos autores; o arquivo
recuperado é o de 2001, conferido na folha de rosto. O artigo reproduz as seis
equações na p. 312, iguais às das Tabelas 1 e 2 do ASHRAE em coeficiente,
expoente e sinal (conferido na imagem das duas obras). É a segunda fonte que
confere a transcrição. **Não traz densidade medida.** A frase "the equations
presented in Tables 1 and 2 produce an error of 6% or less" é sobre as equações
de todas as propriedades, não sobre a densidade prevista de um alimento, e não
deve virar "o modelo erra até 6%" na tela.

Um tipo novo na estante: artigo de periódico não é livro. `kind: 'article'`
fica fora da vitrine da home, sai como `ScholarlyArticle` no JSON-LD e com
rótulo próprio no `llms.txt`.

**O caso-verdade da conta — o exemplo resolvido do ASHRAE** (cap. 19, Example
4, carne de porco a −40 °C). A página imprime a densidade de cada constituinte
(água 991,04, gelo 922,12, proteína 1350,6, gordura 942,29, cinza 2435,0 kg/m³),
a soma da equação (6) — `Σ xᵢ/ρᵢ = 1,0038 × 10⁻³` — e `ρ = 996 kg/m³`. O motor
reproduz as quatro densidades que calcula (água, proteína, gordura, cinza) e a
soma, dentro do arredondamento impresso (996,24). O gelo o motor não calcula:
entra no teste como a página imprime.

As frações do exemplo **somam 1,0034**, e a fonte usa assim, sem normalizar. O
motor faz o mesmo: normalizar "para ficar certo" discordaria do livro em 0,34%.
A composição só é recusada quando a soma se afasta de 1 mais que 0,01.

**O caso-verdade da física — as outras duas réguas do motor.**

| Comparação | Resultado |
| --- | --- |
| Água do modelo × OIML, 0 a 40 °C | **sempre abaixo**, de −0,09% (40 °C) a −0,29% (7 °C) |
| Calda do modelo (água + carboidrato) × NBS, até 70 °Brix, 10 a 30 °C | de **−0,62%** (40 °Brix, 10 °C) a **+0,43%** (70 °Brix, 30 °C) |
| Idem, de 75 a 95 °Brix (15 e 20 °C, medidos) | **sempre acima**, de +0,35% a **+2,05%** (95 °Brix, 20 °C) |

O modelo soma volumes, e açúcar dissolvido contrai: acima de 70% de sólidos ele
superestima, e é a faixa do mel. **O erro cresce com o calor**: a 70 °Brix vai
de −0,005% a 10 °C para +0,43% a 30 °C, e a célula extrapolada de 95 °Brix a
30 °C dá +2,28%. As caldas só foram medidas de 10 a 30 °C; o motor responde de
0 a 100 °C, e fora daquela janela ninguém conferiu.

**Quanto os testes travam os coeficientes.** Com os limites acima, a inclinação
do carboidrato só passa entre −0,3105 e −0,3090 — um dígito errado na segunda
ou terceira casa cai. Uma primeira versão, com limites mais frouxos, deixava
passar de −0,36 a −0,31; foi a revisão de código que mediu.

**Modelo publicado, não híbrido.** Trocar a água do Choi & Okos pela da OIML
melhora a média contra o NBS (0,30% contra 0,42%) e zera o erro da água pura.
Mas seria um modelo que nenhuma fonte publica, e quem abrir o ASHRAE não
reproduziria o número. A diferença entre os dois (0,24%) é menor que o erro do
próprio modelo. Fica o publicado, com o viés declarado.

**Fibra: o contrato impede, a soma não detecta.** Nas tabelas de composição o
carboidrato total já inclui a fibra: a amêndoa do ASHRAE (Tabela 3) fecha em
100,01% **sem** a coluna de fibra (10,90%). Uma primeira versão do motor recebia
carboidrato sem fibra e confiava na checagem da soma para recusar a fibra
contada duas vezes. A revisão mediu: nas 11 bebidas da Tabela 3, a soma só
recusava a ameixa, e por 0,0001 — as outras dez passavam errando até 0,33%.
**Agora o motor recebe `totalCarbohydrate` e `fiber`, como a tabela imprime, e
subtrai por dentro**; fibra maior que o total é recusada. O erro deixou de ser
possível em vez de depender de ser pego.

**Fibra sem caso-verdade.** Carne e calda não têm fibra, então nenhum dos casos
acima exercita esse coeficiente. Corrompido de 1311,5 para 1131,5, não derruba
teste nenhum. Medido o que isso custa: o suco de ameixa (1% de fibra) muda
0,13%, dentro do erro do próprio modelo. Declarado ao lado do número.

**Álcool recusado.** O modelo não tem etanol. O primeiro teste da recusa usava o
destilado do USDA e passava com a trava removida: sem o álcool, as frações
somavam 0,64 e a checagem da soma recusava por outro motivo. A segunda versão
usava 0,5% de álcool com o resto somando 0,995 — e ainda dependia da tolerância:
com ela apertada, voltava a passar pelo motivo errado. A versão final usa
frações que, sem o álcool, somam **exatamente 1**: nenhuma tolerância recusa, só
a trava. Chave desconhecida (`ethanol` em vez de `alcohol`) também é recusada,
senão o álcool com nome errado passaria como ausente.

**Soma e ponto flutuante.** `Math.abs(0,99 − 1)` vale 0,010000000000000009, e a
borda que a tolerância promete aceitar era recusada. O motor compara com uma
folga explícita de 10⁻⁹, e os testes fixam 0,99 e 1,01 aceitos, 0,9899 e 1,0101
recusados.

**Faixa:** as equações valem de −40 a 150 °C; o motor responde de 0 a 100 °C,
onde o alimento é líquido sem precisar de fração de gelo.

---

## Parte V — O que ficou decidido

- **A calculadora é de líquidos, e recusa sólidos.** Não é escopo tímido: é onde
  o modelo tem 1% de erro em vez de 10%.
- **Temperatura é entrada onde a fonte a publica.** Álcool de 0 a 40 °C
  (OIML), calda de 10 a 30 °C (NBS). Fora disso, o motor devolve nulo em vez de
  estender a fonte.
- **A tela diz qual régua respondeu.** Modelo composicional, tabela alcoométrica
  e curva de Brix têm autoridades diferentes, como a geleia já faz com receita
  citada / receita fresca / norma.
- **O ASHRAE entra na estante, com o Fricke & Becker ao lado.** Uma primeira
  versão desta pesquisa deixava o modelo composicional fora por falta de fonte
  aberta: o capítulo da EOLSS corta na seção de densidade, o auto-arquivo da
  UMKC devolvia 404 e o Internet Archive estava fora do ar. O dono autorizou
  citar o handbook, e a nova tentativa achou o artigo no Internet Archive.
  O artigo original de Choi & Okos (1986) segue sem leitura, e por isso não é
  citado no site: cita-se quem foi lido.

## Pendências

- [x] ~~Achar a fórmula analítica da OIML R 22 e conferi-la contra ≥3 pontos da
      tabela impressa.~~ Feito na Parte IV-A: quatro casos-verdade, pior
      diferença 0,008 kg/m³. Os coeficientes não estão em fonte secundária
      nenhuma — saíram da imagem da p. 13 do documento oficial.
- [ ] Decidir o recorte de ingredientes: o SR Legacy tem 7793 alimentos com
      composição, e a calculadora precisa de algumas dezenas de líquidos.
      **Decisão de produto, não técnica.**
- [x] ~~Conferir na imagem os pontos do NBS 457 que virarem código.~~ Tabela 2
      inteira, conferida por redundância libra × grama; um erro tipográfico da
      fonte achado e documentado.
- [x] ~~Fonte do modelo composicional.~~ ASHRAE autorizado pelo dono; Fricke &
      Becker (2001) recuperado no Internet Archive. Parte IV-B.
- [ ] Densidade **medida** de algum líquido gorduroso (óleo, creme). Nenhuma das
      fontes lidas tem: o ASHRAE só traz "0,92 g/cm³" de óleo de amêndoa
      (Wachsmuth, 1892, duas casas, sem temperatura), e o Fricke & Becker não
      mede densidade. O coeficiente da gordura hoje só se confere pela
      transcrição e pelo exemplo a −40 °C.
- [ ] Peso de porção do USDA não serve como densidade sem conferência item a
      item (Parte II): se o catálogo usar, cada entrada precisa de uma segunda
      forma de conferir.
- [ ] Ler Phinney et al. (2017) por inteiro — só o resumo foi lido; o paper está
      atrás de paywall na Wiley.

## Fontes

- ASHRAE. *2022 ASHRAE Handbook—Refrigeration (SI)*, cap. 19, "Thermal
  Properties of Foods". Obra comercial; citada por autorização do dono.
- Fricke, B. A. & Becker, B. R. (2001). "Evaluation of Thermophysical Property
  Models for Foods". *HVAC&R Research* 7(4): 311–330. Auto-arquivo dos autores,
  recuperado do Internet Archive.
- Choi, Y. & Okos, M. R. (1986). "Effects of temperature and composition on the
  thermal properties of foods". Em *Food Engineering and Process Applications,
  Vol. 1: Transport Phenomena*, pp. 93–101. Elsevier. **Não lido**; as equações
  vêm das duas reproduções acima.
- Phinney, D. M. et al. (2017). "Composition-Based Prediction of
  Temperature-Dependent Thermophysical Food Properties: Reevaluating Component
  Groups and Prediction Models". *Journal of Food Science*.
- USDA. *FoodData Central, SR Legacy*. Domínio público (CC0).
- OIV. *Compendium of International Methods of Analysis*, OIV-MA-AS312-02.
- OIML. *R 22 — Alcoholometry: International alcoholometric tables*. Primeira
  edição 1973; arquivo na tradução inglesa do BIML.
- Snyder, C. F. & Hammond, L. D. (1946). *Weights per United States gallon and
  weights per cubic foot of sugar solutions*. NBS Circular 457. Domínio público.
