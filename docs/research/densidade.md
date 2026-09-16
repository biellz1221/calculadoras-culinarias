# Densidade de líquidos — converter mililitro em grama

Pesquisa que precede a calculadora de densidade. **Nenhum número daqui entrou em
`src/data/` ainda**; este documento é o que autoriza isso a acontecer.

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

### Caso-verdade: o modelo contra valores que já sabemos

| | modelo a 20 °C | valor aceito | erro |
| --- | --- | --- | --- |
| óleo (100% gordura) | 0,917 | 0,915–0,920 | dentro |
| mel (17,1% água) | 1,450 | 1,42–1,45 | topo da faixa |
| clara de ovo | 1,031 | 1,035–1,040 | −0,5% |
| leite integral | 1,025 | 1,030–1,033 | −0,6% |
| creme 35% | 0,981 | 0,994 | −1,3% |
| água pura | 0,996 | 1,000 | −0,4% |

Erra **sempre para baixo**, entre 0,4% e 1,3%: o modelo soma volumes e ignora a
contração que acontece em solução. Para cozinha é irrelevante — numa xícara de
leite dá 2 g.

**Mas isso vale para líquido.** Phinney et al. (2017) reaplicaram o modelo à
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

| | destilado (36% álcool) | vinho tinto (10,6%) |
| --- | --- | --- |
| álcool tratado como água | 0,996 → **erro 5,1%** | 1,007 → **erro 1,8%** |
| mistura linear com etanol | 0,910 → erro 4,0% | 0,980 → erro 1,0% |
| tabela OIML | **0,948** | **0,990** |

A mistura linear erra para o outro lado, e erra quase tanto: água e etanol
**contraem** ao se misturar, e é exatamente por isso que as tabelas
alcoométricas existem. Não há atalho aritmético.

**Consequência para o site hoje:** o catálogo do gelato registra `cachaca`,
`cointreau` e `rum` com `water: 1` — álcool contado como água. Para PAC e POD a
simplificação se defende (e `pac: 2` reconhece o efeito anticongelante), mas
qualquer uso desses ingredientes em conta de densidade herdaria os 5%.

---

## Parte IV — As três réguas

Nenhuma delas cobre o que as outras cobrem. A calculadora precisa das três, e
precisa **declarar qual respondeu** em cada caso.

### 1. Líquido comum → modelo composicional

Composição do **USDA SR Legacy** (domínio público, CC0) no modelo do Choi &
Okos. Cobre leite, cremes, ovos, sucos, mel, xaropes, óleos, vinagre, melaço.

O USDA é a escolha certa e não só por ser livre: a Tabela 3 do próprio ASHRAE
declara "*Composition data from USDA (1996)*". Ir ao USDA é ir à fonte primária
do handbook, com mais cobertura e sem obra paga no caminho. Conferido: o mel dá
17,1% de água nos dois.

### 2. Qualquer coisa com álcool → tabela alcoométrica

**OIV-MA-AS312-02** (texto nativo, confiável) traz densidade de misturas
etanol-água por **% em volume** e por temperatura, de 0 a ~31%. Cobre vinho,
cerveja, licor.

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

**A tabela não é a fonte: a fórmula é.** O documento diz, em 19.5 §4, que
"*Tables I and IIIa are calculated directly from the general formula*". Ou seja,
usar a fórmula não é aproximar a tabela — é usar o que gerou a tabela. Não há
diferença a declarar na página.

Forma geral (p. 5):

    ρ = A₁ + Σ(k=2..12) A_k·p^(k−1) + Σ(k=1..6) B_k·(t−20)^k
          + Σ(i=1..5) Σ(k) C_i,k·p^k·(t−20)^i

`p` é **fração mássica** de etanol, `t` em °C. Faixa de validade: −20 a +40 °C.

Os 44 coeficientes estão na p. 13 e foram **transcritos da imagem renderizada**,
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

### Conferência — quatro casos-verdade, dois deles independentes

| Prova | Resultado |
| --- | --- |
| Tabela I do próprio OIML, água de 0 a 10 °C (11 pontos, lidos na imagem) | pior diferença **0,005 kg/m³** |
| Tabela I do **OIV**, 0 a 11% vol a 20 °C (documento diferente, outra grandeza, texto nativo) | pior diferença **0,008 kg/m³** |
| Etanol puro a 20 °C — errata impressa na capa diz 789,24 | fórmula dá **789,239** |
| Máximo de densidade da água (fenômeno físico, ~3,98 °C) | fórmula põe em **4 °C** |

As diferenças são o arredondamento das tabelas, que têm duas casas. O único
ponto acima de 0,01 é o de 2% vol, onde o OIV imprime `995.2` com uma casa só —
defeito de composição da tabela, não da fórmula.

Os dois últimos casos são **independentes das tabelas**: se algum dos 44
coeficientes tivesse um dígito errado, nenhum dos quatro fecharia. A transcrição
está correta.

### 3. Calda de açúcar → Brix

**NBS Circular 457** dá 0 a 95 °Brix de 0,1 em 0,1 a 20 °C (a base é a tabela
109 da Circular 440). É OCR: todo número que virar código sai da imagem
renderizada, nunca da camada de texto.

---

## Parte V — O que ficou decidido

- **A calculadora é de líquidos, e recusa sólidos.** Não é escopo tímido: é onde
  o modelo tem 1% de erro em vez de 10%.
- **Temperatura é entrada, não detalhe.** Todas as três réguas são função de
  temperatura, e mel a 20 °C não é mel a 40 °C. É o que nenhuma tabela de
  cozinha oferece.
- **A tela diz qual régua respondeu.** Modelo composicional, tabela alcoométrica
  e curva de Brix têm autoridades diferentes, como a geleia já faz com receita
  citada / receita fresca / norma.
- **O ASHRAE não vai para a estante.** Ele foi o mapa — o modelo, a validação e
  a pista do USDA saíram dele. Mas é obra comercial, e as fontes 1, 2 e 3 acima
  cobrem tudo o que ele daria, todas abertas. Citamos Choi & Okos (1986) pelo
  modelo, USDA pela composição, OIV/OIML pelo álcool e NBS pelo Brix.

## Pendências antes de escrever código

- [x] ~~Achar a fórmula analítica da OIML R 22 e conferi-la contra ≥3 pontos da
      tabela impressa.~~ Feito na Parte IV-A: quatro casos-verdade, pior
      diferença 0,008 kg/m³. Os coeficientes não estão em fonte secundária
      nenhuma — saíram da imagem da p. 13 do documento oficial.
- [ ] Decidir o recorte de ingredientes: o SR Legacy tem 7793 alimentos com
      composição, e a calculadora precisa de algumas dezenas de líquidos.
      **Decisão de produto, não técnica.**
- [ ] Conferir na imagem os pontos do NBS 457 que virarem código.
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
- OIML. *R 22 — International Alcoholometric Tables* (1975, tradução BIML).
- NBS. *Circular 457 — Weights per United States gallon and weights per cubic
  foot of sugar solutions*. Domínio público.
