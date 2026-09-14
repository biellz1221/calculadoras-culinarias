# Fontes públicas brasileiras — varredura de 2026-09-14

Levantamento dos órgãos públicos brasileiros que publicam material técnico
utilizável por este site: Embrapa (repositório Infoteca-e), ANVISA e MAPA/DIPOA.

**Por que isso importa mais do que parece.** A estante do site é quase toda
estrangeira, e a régua estrangeira nem sempre é a que vale aqui — nem a que
descreve a matéria-prima daqui. Estas fontes são gratuitas, institucionais, em
português, e três delas já mudaram decisão de projeto: a tabela de frutas
brasileiras (2026-09-13), a revogação da norma de nitrito (§2) e o fator de
conversão de nitrato (§2.1).

Arquivos baixados ficam em `references/`, que **nunca é versionada**. Ao
contrário do resto dela, estes são de acesso público: pode baixar, guardar e
citar à vontade.

---

## 1. O que a varredura achou, por prioridade

| Achado | Estado | O que muda |
|---|---|---|
| **RDC 272/2019 foi revogada** | **Corrigido e no ar** | A calculadora de cura citava norma morta. §2 |
| **Fator de conversão de nitrato para nitrito** | **Pronto para implementar** | Fecha a conta que a página de cura hoje só descreve. §2.1 |
| **Tabela de frutas brasileiras** (Embrapa Doc 29) | Pesquisa feita, código pendente | Fruta brasileira nas geleias. Ver `bibliografia-candidata.md` §4.13 |
| **pH 4,5 como limiar de segurança** | Segunda fonte disponível | Corrobora o picles com fonte brasileira. §3 |
| **Salmoura fraca 1,5 a 2% de sal** | Segunda fonte disponível | Corrobora a faixa de salga do picles. §3 |
| **Sorvete: overrun e densidade** | **Procurado e não achado** | A lacuna do gelato continua. §4 |
| **Pão sem glúten: dose de hidrocoloide** | **Procurado e não achado** | A calculadora continua travada. §5 |

---

## 2. ANVISA — a norma de aditivos mudou de número

A calculadora de cura citava a **RDC nº 272, de 14/03/2019**, lida no texto
oficial e transcrita corretamente. Ela foi **revogada**:

> "Art. 13. Ficam revogados: … **LVI - a Resolução de Diretoria Colegiada - RDC
> nº 272, de 14 de março de 2019**;"
> — RDC nº 778, de 1º de março de 2023

A RDC 778/2023 consolidou a legislação de aditivos e revogou 67 instrumentos de
uma vez. O que vale hoje é a **Instrução Normativa nº 211, de 1º de março de
2023**, que a acompanha.

**O número não mudou.** A IN 211, no Anexo, categoria 08.2:

> "Limite para os aditivos INS 250 e 251 sozinhos ou combinados. A soma dos
> nitritos e nitratos, determinados como quantidade máxima residual, não deve
> superar **150 mg/kg**, expressa como nitrito de sódio."

A mesma nota aparece pareando INS 249 e 250, os dois nitritos. É exatamente o que
o site já publicava.

As subcategorias que admitem nitrito são sete — 08.2.1.1 a 08.2.3.2 — e em
**08.1.1, carne in natura, "não são autorizados aditivos alimentares"**.

Arquivo: `references/charcuterie/normas/ANVISA-IN-211-2023_Aditivos_limites_maximos.pdf`
(1.966 páginas). Corrigido no código em 2026-09-14.

### 2.1 MAPA/DIPOA — o fator de conversão que faltava

O **Ofício Circular DIPOA nº 15/2009** publica a aritmética que a nossa página
descreve mas não mostra:

> "O valor de nitrato (NaNO3) obtido deve ser dividido por **1,231** para ter o
> valor expresso em nitrito (NaNO2). Este valor deve ser somado ao resultado de
> nitrito para se obter o valor total que deverá ser de no máximo **150 ppm ou
> 0,015%**. Em casos de análise de nitrato de potássio, dividir o resultado desta
> análise por **1,4637** para expressão dos resultados em nitrito de sódio."

**Os fatores conferem pela química.** Massa molar do NaNO₃ é 85,00 e a do NaNO₂ é
69,00: a razão é 1,2319, e o ofício diz 1,231. Para o KNO₃, 101,10 ÷ 69,00 dá
1,4652 contra os 1,4637 publicados. Diferença de arredondamento, sentido certo.

**O que isso destrava.** A calculadora de cura, com o sal de cura #2, hoje mostra
nitrito e nitrato em ppm separados e diz que a norma brasileira conta os dois
juntos. Com este fator ela pode **fazer a soma**: nitrato ÷ 1,231 + nitrito ≤ 150.
Continua sendo entrada e não resíduo — a ressalva de que resíduo só se mede em
laboratório permanece inteira —, mas passa a mostrar como a soma é feita em vez
de só afirmar que existe.

O ofício também aponta a **IN nº 51/2006** como a norma do MAPA para os limites
residuais, que era a peça que faltava desde a pesquisa de cura.

Arquivos em `references/charcuterie/normas/`: o ofício, a IN 21/2000
(regulamento técnico de produtos cárneos) e a IN 92/2020 (charque e carne
salgada, com a definição legal de agentes de cura).

**Como chegar lá sem tomar 403.** `gov.br` bloqueia robô; `wikisda.agricultura.gov.br`
serve os PDFs da base legal do DIPOA direto, e a CIDASC de Santa Catarina
espelha vários. Foi assim que a norma do MAPA, dada como inacessível na pesquisa
de cura, entrou.

---

## 3. Embrapa — conservas vegetais e picles

Três documentos, todos com camada de texto, que servem de **segunda fonte
brasileira** para o que a calculadora de picles já publica a partir de Katz, Noma
e BWF:

| Documento | O que traz |
|---|---|
| `Embrapa-2006_Processamento_de_hortalicas_em_pequena_escala.pdf` (18 mil palavras) | O mais completo. Seção 4.1.1 sobre pH e seção 10.3 sobre cloreto de sódio: "o principal uso desse conservante é no preparo de salmouras fracas na preparação de produtos enlatados, com uma concentração de **1,5 a 2% de sal**" — a mesma faixa que Katz dá para salga direta. |
| `Embrapa_Hortalicas_em_conserva.pdf` | Classificação por acidez: "alimentos de baixa acidez: pH > 4,5"; "alimentos ácidos: pH entre 4,0 e 4,5". E uma especificação de processo: "o pH final da salmoura deve ser de 2,75". |
| `Embrapa-CT72_Pepinos_em_conserva.pdf` | Pepino especificamente, e a razão do limiar: "esterilização, como exigido para alimentos com pH acima de 4,5". |

O **pH 4,5** é o mesmo limiar que o NCHFP usa e que a calculadora de picles já
trata como fronteira de segurança. Ter fonte brasileira para ele é ganho de
robustez, não de número novo.

Também entrou `Embrapa-Doc41-2000_Recomendacoes_tecnicas_conservas_de_frutas.pdf`,
sobre frutas em calda, que trata do mesmo limiar do lado das frutas.

---

## 4. Sorvete — procurado, não achado

Os dois números sem fonte do gelato são o **overrun** e a **densidade da calda**
(ver `numeros-sem-fonte-no-gelato` na memória do projeto). A varredura procurou
na Embrapa Gado de Leite, na Embrapa Agroindústria de Alimentos e no ITAL.

**Não há publicação técnica de tecnologia de sorvete nesses repositórios** com
faixa de overrun ou densidade. O que existe é artigo de pesquisa sobre
formulação específica — um sorvete de morango probiótico com "overrun de 12,5% e
densidade aparente de 900 g/L".

**Esse número foi achado e recusado**, de propósito. É uma medição de uma
formulação experimental, não uma faixa de referência: usá-lo como se fosse régua
de gelato seria pior que a ausência honesta que está na tela hoje. A lacuna
continua aberta e continua dependendo do Goff, Hartel & Rankin ou do Caviezel.

---

## 5. Pão sem glúten — procurado, não achado o que trava

A Embrapa publica bastante sobre farinhas sem glúten, mas no registro errado
para o nosso uso:

- `Embrapa-CircTec272_Sorgo_em_alimentos_sem_gluten.pdf` — Circular Técnica 272,
  sorgo em alimentos sem glúten. Guardado, tem texto.
- *Orientações e receitas para uma alimentação com soja e livre de glúten* —
  receituário.
- Uma formulação de pão de mandioca isento de glúten: mandioca cozida e farinha
  de arroz em proporção 4:1, óleo de girassol 6%, chia 4%, farinha de soja preta
  4%, fermento 2%, sal 2%.

**O que falta é o que sempre faltou: a dose de hidrocoloide** — goma xantana,
HPMC — por tipo de farinha e por resultado. É isso que a calculadora precisaria
e é isso que o Arendt & Dal Bello tem. A formulação de pão de mandioca acima é
uma receita, não uma régua: não diz o que muda se a proporção mudar.

**A calculadora de pão sem glúten continua travada.** A conclusão não mudou; o
que mudou é que agora está testada contra o repositório brasileiro, e não só
suposta.

---

## 6. Como repetir esta varredura

- **Infoteca-e** (`infoteca.cnptia.embrapa.br`) é o repositório de transferência
  de tecnologia: manual, cartilha, circular técnica, documento. É onde está o
  material com número utilizável.
- **Alice** (`alice.cnptia.embrapa.br`) é o repositório de produção científica:
  artigo e resumo de congresso. Serve para saber o estado da arte, raramente
  para extrair régua.
- **AINFO** (`ainfo.cnptia.embrapa.br`) espelha os dois.
- **wikisda.agricultura.gov.br** serve a base legal do DIPOA sem bloqueio.
- **CIDASC/SC** (`cidasc.sc.gov.br/inspecao/files/`) espelha normas federais e
  costuma responder quando o `gov.br` devolve 403.
- **bvsms.saude.gov.br** hospeda as RDCs antigas da ANVISA.

**Duas regras aprendidas aqui.** Primeira: conferir a **camada de texto** antes
de comemorar — o CT 31 de geleia de maracujá e o Greweling são digitalização em
imagem e não servem sem OCR conferido. Segunda: conferir a **vigência** de toda
norma citada; a RDC 272 estava corretamente transcrita e mesmo assim morta.

---

## 7. O que fazer com isso, em ordem

1. **Somar nitrato ao nitrito na calculadora de cura**, com o fator 1,231 do
   Ofício DIPOA 15/2009. Muda uma página de segurança alimentar, então merece
   passe próprio.
2. **Fruta brasileira nas geleias**, com a Tabela 1 do Embrapa Doc 29 e a régua
   da legislação. Pede mudança de modelo (duas classificações convivendo, receita
   opcional, açúcar vindo da norma).
3. **Segunda fonte brasileira no picles**, para o pH 4,5 e para a faixa de sal.
   É acréscimo de citação, barato.
4. Gelato e pão sem glúten continuam dependendo de livro estrangeiro.
