# Densidade de líquidos — converter mililitro em grama

Pesquisa que precede a calculadora de densidade. Autorizou o motor v1
(`src/data/density/`, `src/lib/density/`): água e etanol pela OIML R 22, calda
de sacarose pelo NBS 457. O modelo composicional **não** entrou — ver Parte V.

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
respondeu** em cada caso. No motor v1 entraram a 2 e a 3; a 1 espera fonte
aberta (Parte V).

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

## Parte V — O que ficou decidido

- **A calculadora é de líquidos, e recusa sólidos.** Não é escopo tímido: é onde
  o modelo tem 1% de erro em vez de 10%.
- **Temperatura é entrada onde a fonte a publica.** Álcool de 0 a 40 °C
  (OIML), calda de 10 a 30 °C (NBS). Fora disso, o motor devolve nulo em vez de
  estender a fonte.
- **A tela diz qual régua respondeu.** Modelo composicional, tabela alcoométrica
  e curva de Brix têm autoridades diferentes, como a geleia já faz com receita
  citada / receita fresca / norma.
- **O ASHRAE não vai para a estante — e por isso o modelo composicional ficou
  fora do motor.** Os coeficientes do Choi & Okos só foram lidos no handbook,
  que é obra comercial. Procurou-se reprodução aberta e citável: o capítulo da
  EOLSS é *sample chapter* e corta exatamente na seção "Theoretical Density
  Models"; o artigo de Becker & Fricke auto-arquivado na UMKC devolve 404; o
  Internet Archive estava fora do ar. Citar o artigo original de 1986 sem tê-lo
  lido seria localizador inventado. **O motor v1 tem duas réguas, não três:**
  OIML para água e etanol, NBS para calda de sacarose. Leite, creme, óleo e mel
  esperam decisão sobre a fonte (ver pendências).

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
- [ ] **Fonte do modelo composicional** (leite, creme, óleo, mel). Opções: (a)
      citar o ASHRAE, obra paga — pede decisão do dono; (b) tentar de novo o
      auto-arquivo de Becker & Fricke quando o Internet Archive voltar; (c)
      deixar esses líquidos fora. Recomendação: (b), com (c) como padrão enquanto
      não houver fonte aberta.
- [ ] Peso de porção do USDA não serve como densidade sem conferência item a
      item (Parte II): se o catálogo usar, cada entrada precisa de uma segunda
      forma de conferir.
- [ ] Ler Phinney et al. (2017) por inteiro — só o resumo foi lido; o paper está
      atrás de paywall na Wiley.

## Fontes

- ASHRAE. *2022 ASHRAE Handbook—Refrigeration (SI)*, cap. 19, "Thermal
  Properties of Foods". Obra comercial; usada como mapa, não citada no site.
- Choi, Y. & Okos, M. R. (1986). "Effects of temperature and composition on the
  thermal properties of foods". Em *Food Engineering and Process Applications,
  Vol. 1: Transport Phenomena*, pp. 93–101. Elsevier.
- Phinney, D. M. et al. (2017). "Composition-Based Prediction of
  Temperature-Dependent Thermophysical Food Properties: Reevaluating Component
  Groups and Prediction Models". *Journal of Food Science*.
- USDA. *FoodData Central, SR Legacy*. Domínio público (CC0).
- OIV. *Compendium of International Methods of Analysis*, OIV-MA-AS312-02.
- OIML. *R 22 — Alcoholometry: International alcoholometric tables*. Primeira
  edição 1973; arquivo na tradução inglesa do BIML.
- Snyder, C. F. & Hammond, L. D. (1946). *Weights per United States gallon and
  weights per cubic foot of sugar solutions*. NBS Circular 457. Domínio público.
