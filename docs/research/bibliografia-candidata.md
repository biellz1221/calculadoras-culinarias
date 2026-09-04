# Bibliografia candidata e roadmap de calculadoras

Levantamento vivo. Última revisão: 2026-09-03.

Não é extração: **nenhum número deste documento entrou no código**. É a lista do
que vale ler, do que vale construir e por quê. Reúne o levantamento de gelato e
pães orientais com as ideias e indicações trazidas pelos colegas do curso de
gastronomia.

**Sobre os links.** Cada obra aponta para uma busca por ISBN na Amazon Brasil, e
não para uma página de produto. É de propósito: página de produto sai do ar e o
link apodrece, enquanto a busca por ISBN continua achando a edição certa, física
ou Kindle, e mostra se há vendedor no Brasil. Onde a editora vende direto, o
link dela vai junto. Para obra fora de catálogo, o caminho brasileiro é a
[Estante Virtual](https://www.estantevirtual.com.br/).

**Idioma não é critério de exclusão.** Espanhol, italiano e inglês entram; onde
existe edição em português ou espanhol, ela está indicada.

Marcação de confiança: **[conferido]** = editora, edição e ISBN checados em
pesquisa. **[a conferir]** = indicação de memória ou de terceiro, confirmar
antes de comprar.

---

# Parte 1: balizadores

Os critérios que decidem o que entra. Escritos aqui para que a decisão seja
discutível, e não uma preferência silenciosa.

## O que faz uma fonte servir

1. **Publica proporção, não só receita.** Livro que diz "1 xícara de farinha"
   sem peso não sustenta calculadora.
2. **Tem endereço citável.** Página, capítulo ou seção. É o que
   `src/data/citations.ts` exige na construção do dado, e o que quebra o build
   quando falta.
3. **É verificável por quem lê.** Obra publicada, literatura revisada por pares
   ou norma oficial. Material de curso entra só declarado como tal, e hoje há
   exatamente um caso: a planilha do Lulo Fouet na calculadora de gelato.

## O que faz uma ideia merecer uma calculadora

Quatro perguntas, nesta ordem:

1. **A conta é não trivial?** Se a resposta cabe numa regra de três de cabeça, a
   ferramenta não acrescenta nada a quem já sabe. O que justifica é conta com
   variáveis acopladas, conversão de base de cálculo, ou faixa segura a
   respeitar.
2. **Existe literatura citável?** Sem fonte publicada não há página. É a regra
   fundadora do projeto.
3. **Errar custa caro?** Quanto pior a consequência do erro, mais a calculadora
   vale a pena existir. Carne curada no topo; vinagrete no fim.
4. **As fontes divergem?** Divergência explicada é o diferencial editorial do
   site. Onde todo mundo concorda, a calculadora vira commodity e compete só por
   SEO, que é a briga que a gente não quer.

## O balizador de segurança

Herdado da calculadora de picles (TD-004) e agora explícito:

> **Quando o número separa "seguro" de "perigoso", ele não pode sair de livro de
> receita.** Precisa de norma oficial ou literatura de segurança alimentar, e o
> aviso acompanha o resultado, inclusive na impressão.

E uma consequência que só apareceu com a cura de carnes na mesa:

> **Em número regulado, a norma brasileira manda.** O domínio é `.com.br` e o
> público principal é daqui. Onde a regra dos EUA divergir da brasileira, as
> duas aparecem, e o padrão é a nossa. Não fazer isso seria dar orientação
> ilegal com sotaque de autoridade.

---

# Parte 2: as ideias de calculadora, avaliadas

| Ideia | Conta não trivial | Literatura | Custo do erro | Fontes divergem | Veredito |
| --- | --- | --- | --- | --- | --- |
| **Cura de carnes (ppm)** | Alta | Norma oficial | **Altíssimo** | **Sim, e boa** | **A mais forte da lista** |
| **Geleias: pectina, Brix e pH** | Alta | Oficial + livro | Alto | Sim | Forte |
| **Salmoura de proteína** | Alta | Livro técnico | Médio | Sim | Forte, e reaproveita motor |
| **Ganache e chocolataria** | Alta | Livro técnico | Médio | Sim | Forte |
| **Pão sem glúten** | Alta | Acadêmica | Médio | Sim | Forte, mas fonte escassa |
| **Hidratação e fermentação** | — | — | — | — | **Já existe.** Ver abaixo |
| **Emulsões e molhos** | **Baixa** | Livro | Baixo | Pouca | **Fraca como calculadora** |

## Cura de carnes: a mais forte, e a mais perigosa

A conta é de verdade: ppm de nitrito sobre o peso da peça, convertido em gramas
de sal de cura, e o fator muda entre cura 1 (nitrito) e cura 2 (nitrito mais
nitrato), entre cura rápida e cura seca longa. Errar para baixo é botulismo;
errar para cima é intoxicação.

E tem a melhor divergência que apareceu até agora:

> **Os EUA trabalham com 156 ppm de nitrito de sódio** (referência do FSIS,
> equivalente a 1 oz de cure #1 por 25 lb de carne, que é a conta que o Marianski
> ensina). **A ANVISA fixa 150 mg/kg** para produtos cárneos, e o dobro para
> nitrato. Quase toda calculadora e todo fórum de charcutaria em inglês entrega o
> número americano. **Num site `.com.br`, isso é orientação fora da norma
> local.** Mostrar os dois lados, com a nossa como padrão, é literalmente a razão
> de ser deste projeto.

Antes de construir: confirmar a norma vigente na fonte primária (RDC da ANVISA e
regulamento do MAPA). Tabela de aditivo é revisada, e o que circula em blog
costuma estar desatualizado.

## Geleias: irmã da calculadora de picles

Mesma família: conserva, faixa segura, e a orientação oficial do NCHFP já está na
estante por causa do picles de vinagre. A conta acopla três variáveis (Brix final
perto de 65%, pectina própria da fruta e acidez adicionada para cair na janela de
gelificação, pH 2,8 a 3,5), e a faixa de pH tem peso de segurança, não só de
textura.

## Salmoura: a de picles com outra régua

> **O motor de picles já resolve o problema central desta calculadora.** Ele
> mostra a mesma salmoura em duas bases, sobre o conteúdo total do pote e só
> sobre a água, porque é aí que Katz e o Noma divergem. A salmoura de proteína é
> o mesmo cálculo com outros nomes: salmoura de equilíbrio (sal sobre carne mais
> água) contra salga seca (sal sobre o peso da carne). Já sabemos fazer.

A divergência também já está mapeada: o equilíbrio do Modernist mira cerca de
0,5% de sal final na carne, enquanto a salga seca do Food Lab parte de 0,85%
sobre o peso da proteína. Números diferentes que descrevem produtos diferentes.

## Ganache: conta melhor do que parece

A razão chocolate para creme não é linear entre amargo, ao leite e branco, porque
o que importa não é o chocolate: é quanta manteiga de cacau, quanto sólido de
cacau e quanta gordura láctea ele carrega. Um mesmo "2:1" dá emulsões diferentes
com 55% e com 70%. Some a água livre, que decide a validade de um bombom.

## Hidratação e fermentação: não é calculadora nova

Já é a calculadora de pães. O que a sugestão acrescenta e ainda **não** existe:

- **Temperatura desejada da massa (DDT).** O glossário já cita a temperatura de
  base do Kayser, de 54 a 56 °C, mirando massa a 24–25 °C ao fim da sova, mas não
  há campo que calcule a temperatura da água. Conta clássica, curta, fonte já na
  estante. **Melhor relação custo-benefício do documento inteiro.**
- **Ajuste por força da farinha (valor W).** O glossário fala de força; o cálculo
  não usa. Precisa de fonte que publique faixa de W por tipo de pão.
- **Tangzhong e yudane**, tratados na Parte 4.3.

## Emulsões: conteúdo bom, calculadora fraca

Digo com todas as letras porque economiza dinheiro: **vinagrete 3:1 não precisa
de calculadora**. Nem "180 ml de óleo por gema", que é uma divisão. O assunto é
ótimo como texto explicativo e glossário, e o Peterson sustentaria isso bem, mas
não passa no critério 1. Se virar página, que seja pela emulsão que realmente
quebra: holandesa e beurre blanc, com temperatura e proporção de água.

---

# Parte 3: correções nas indicações recebidas

Conferi cada obra da lista. Quatro precisam de ajuste antes da compra, e uma é só
esclarecimento de idioma:

| O que foi indicado | O que é de verdade |
| --- | --- |
| "Japanese Cooking: A Uniformed Art", Shizuo Tsuji | **"Japanese Cooking: A Simple Art"** (Kodansha, 1980). O título com "Uniformed" não existe. |
| "The Key to Asian Cooking", Irene Chou | **"The Key to Chinese Cooking", de Irene Kuo** (Knopf, 1977). Autora e título trocados; o livro é clássico e vale, mas é de cozinha chinesa, não asiática em geral. |
| "The Korean Cookbook", Junghyun Park e **Jungyoon Han** | Os autores são **Junghyun Park e Jungyoon Choi**. |
| "Modernist Bread at Home" | Existe, e é de **2024**, não 2023. |
| "Flour Water Salt Yeast" (PT: "Harina Agua Sal Levadura") | *Harina, agua, sal, levadura* é a edição **em espanhol** (Océano/Neo-Person, ISBN 978-84-15-88763-8), não em português. Como espanhol serve, **é a via mais barata e mais fácil de achar** deste título. |

---

# Parte 4: bibliografia por tema, com onde comprar

## 4.1 Gelato

O buraco de hoje: a planilha do curso [Gelato Direto ao Ponto](https://lulofouet.com/gelatodiretoaoponto/),
de Luis Paulo dos Santos Barros (Lulo Fouet), é a única fonte, e é material
didático. Faltam a origem publicada dos coeficientes de PAC e POD, a física que
explica por que PAC prediz textura, e uma segunda régua para as faixas de base.

| Obra | Por que |
| --- | --- |
| **Angelo Corvitto, _Los secretos del helado_** · Vilbo · ES · 392 p. · ISBN 978-84-92244-33-1 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9788492244331) · [Books for Chefs](https://www.booksforchefs.com/en/professional-ice-cream-books/234-the-secrets-of-ice-cream-angelo-corvitto.html) | É a obra que **publica** as tabelas de poder anticongelante e poder edulcorante por açúcar, com 125 fórmulas balanceadas. A única que permitiria citar PAC e POD com autor e página. Há edição em inglês (_The Secrets of Ice Cream_). **A compra mais óbvia do tema.** |
| **Luca Caviezel, _Scienza e tecnologia del gelato artigianale_** · Chiriotti, 2016 · IT · 686 p. · ISBN 978-88-96027-27-1 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9788896027271) · [Chiriotti (editora)](https://shop.chiriottieditori.it/en/product/scienza-e-tecnologia-del-gelato-artigianale-2016/) | A referência italiana do setor, de 1986, revista pelo autor em 2016. Dá a **segunda régua** que hoje não existe. |
| **Goff, Hartel & Rankin, _Ice Cream_, 8ª ed.** · Springer, 2025 · EN · 950 p. · ISBN 978-3-031-77871-1 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9783031778711) · [Springer](https://link.springer.com/book/10.1007/978-3-031-77872-8) | O livro-texto científico da área, com capítulo de cálculo de misturas e depressão do ponto de congelamento. Sustentaria a temperatura de serviço com fonte, no lugar da regra prática PAC ÷ 25. |
| **Francisco Migoya / CIA, _Frozen Desserts_** · Wiley, 2008 · EN · ISBN 978-0-470-11866-5 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780470118665) · [Wiley](https://www.wiley.com/en-us/Frozen+Desserts,+1st+Edition-p-9780470118665) | *Indicado pelos colegas.* Formulação de confeitaria profissional: ingredientes, estabilização, teoria. Régua de restaurante, não de gelateria, o que o torna bom complemento e má fonte única. |
| **Chris Clarke, _The Science of Ice Cream_, 2ª ed.** · RSC, 2012 · EN · ISBN 978-1-84973-127-0 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9781849731270) · [RSC](https://books.rsc.org/books/monograph/2200/The-Science-of-Ice-Cream) | *Indicado pelos colegas.* Físico da Unilever escrevendo para quem não é da área: microestrutura, emulsão de gordura, curvas de congelamento. Ótimo para o texto explicativo, fraco para número. |
| **Dana Cree, _Hello, My Name Is Ice Cream_** · Clarkson Potter, 2017 · EN **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Hello+My+Name+Is+Ice+Cream+Dana+Cree) | Publica cada receita em **porcentagem, gramas e xícaras**. A coluna de porcentagem é exatamente o formato do site. |
| **Torrance Kopfer, _Sorvetes artesanais: gelatos e sorbets_** · Senac SP, 2015 · **PT-BR** · 176 p. **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/Sorvetes-Artesanais-Sorbets-Sobremesas-Saborosas/dp/8539608774) · [Editora Senac](https://www.editorasenacsp.com.br/livro/sorvetes-artesanais-gelatos-sorbets-1-edicao) | A opção em português, mesma editora do Camargo. **Ressalva: é livro de receita, não de balanceamento**, e provavelmente não fecha nenhum dos três buracos. |

## 4.2 Pães e massas fermentadas

| Obra | Por que |
| --- | --- |
| **Ken Forkish, _Flour Water Salt Yeast_** · Ten Speed, 2012 · EN<br>**Edição ES: _Harina, agua, sal, levadura_** · Océano/Neo-Person · ISBN 978-84-15-88763-8 **[conferido]**<br>[Amazon BR (ES)](https://www.amazon.com.br/s?k=9788415887638) · [Amazon BR (EN)](https://www.amazon.com.br/s?k=Flour+Water+Salt+Yeast+Forkish) · [Casa del Libro](https://www.casadellibro.com/libro-harina-agua-sal-levadura/9788415887638/12470596) | *Indicado pelos colegas.* Porcentagem de padeiro aplicada com rigor e, sobretudo, **poolish e biga com proporção e tempo explícitos**, que é onde a estante atual é mais fina: hoje só Kayser sustenta pré-fermento. |
| **Ken Forkish, _The Elements of Pizza_** · Ten Speed, 2016 · EN **[a conferir edição]**<br>[Amazon BR](https://www.amazon.com.br/s?k=The+Elements+of+Pizza+Forkish) | *Indicado pelos colegas.* Hidratação contra tempo de maturação, frio e ambiente, por tipo de farinha. **Resolveria diretamente a divergência da pizza que a calculadora já expõe**, onde hoje temos Kayser contra o próprio Kayser e o Camargo como desempate. |
| **Myhrvold & Migoya, _Modernist Bread at Home_** · 2024 · EN · ISBN 978-1-7379951-4-2 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9781737995142) | *Indicado pelos colegas.* A versão condensada do _Modernist Bread_. A coleção completa é investimento de outra ordem; esta traz as equações sem o preço de cinco volumes. |
| **Cauvain & Young, _Technology of Breadmaking_, 3ª ed.** · Springer · EN · ISBN 978-3-319-14686-7 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9783319146867) | O livro-texto de tecnologia de panificação. Serve a todas as calculadoras de pão, não só às orientais. |

## 4.3 Pães orientais

> **O que muda no modelo.** Os pães asiáticos quebram duas premissas: o forno
> (mantou e baozi vão no vapor, e muito pão chato vai na chapa ou na parede do
> forno de barro) e a base de farinha 100% (no **tangzhong** e no **yudane** parte
> da farinha é pré-gelatinizada com água quente antes de entrar na massa).
>
> A segunda **o motor já sabe fazer**: é o mesmo problema do pré-fermento, que
> `src/lib/bread/calculate.ts` resolve separando a farinha e a água que entram
> dentro do levain. Um tangzhong é um pré-fermento sem fermento.

### Leste asiático

| Obra | Por que |
| --- | --- |
| **Huang & Miskelly, _Steamed Breads_** · Woodhead/Elsevier, 2017 · EN · ISBN 978-0-08-100715-0 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780081007150) · [Elsevier](https://shop.elsevier.com/books/steamed-breads/huang/978-0-08-100715-0) | Monografia técnica inteira sobre mantou e baozi: tipos, exigência da farinha, produção tradicional e industrial, defeitos. Cerca de metade da farinha consumida na China vira pão no vapor, e este é o único livro sério sobre isso em inglês. Caro. |
| **Yvonne Chen (陳郁菁), _65°C 湯種麵包 / Bread Doctor_** · Taiwan, 2004 · ZH **[conferido no WorldCat]**<br>[WorldCat](https://search.worldcat.org/title/65c-tang-zhong-mian-bao-bread-doctor/oclc/780209703) · [Amazon BR](https://www.amazon.com.br/s?k=65C+Bread+Doctor+tangzhong) | **A origem do tangzhong** como fenômeno moderno: o roux de 1 parte de farinha para 5 de água a 65 °C. Citar a técnica sem citá-lo seria como falar de porcentagem de padeiro sem citar ninguém. Em chinês; edição em inglês difícil de achar. |
| **Kristina Cho, _Mooncakes and Milk Bread_** · Harper Horizon, 2021 · EN · ISBN 978-0-7852-3899-7 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780785238997) · [HarperCollins](https://www.harpercollinsfocus.com/9780785239000/mooncakes-and-milk-bread/) | James Beard 2022 em duas categorias, e o primeiro livro dedicado só a padaria e café chineses. Receitas em peso. **A porta de entrada prática do bloco.** |
| **Andrea Nguyen, _Asian Dumplings_** · Ten Speed · EN **[a conferir]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Asian+Dumplings+Andrea+Nguyen) | Massas de bao e mantou com rigor de proporção incomum no gênero. |
| **Artigos sobre gelatinização de amido em tangzhong e yudane** **[a conferir]**<br>[Google Scholar](https://scholar.google.com/scholar?q=tangzhong+yudane+starch+gelatinization+bread) | Daria lastro técnico à explicação, em vez de repetir o que os blogs dizem. Gratuito. |

### Oriente Médio e Norte da África

| Obra | Por que |
| --- | --- |
| **Alford & Duguid, _Flatbreads & Flavors: A Baker's Atlas_** · Morrow, 1995 · EN · ISBN 978-0-06-167326-9 (reedição) **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780061673269) | James Beard. Mais de 60 pães chatos do mundo inteiro: pita, naan, chapati, tortilla. **Uma compra cobre pedaço dos três recortes de pão oriental.** |
| **Anissa Helou, _Feast: Food of the Islamic World_** · Ecco, 2018 · EN · ISBN 978-0-06-236303-9 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780062363039) | James Beard, com capítulo de pães do Marrocos à Indonésia. Autoridade da área, com precisão de técnica. |
| **Uri Scheft, _Breaking Breads_** · Artisan, 2016 · EN · ISBN 978-1-57965-682-9 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9781579656829) · [Hachette](https://www.hachettebookgroup.com/titles/uri-scheft/breaking-breads/9781579657284/) | Livro **de padeiro**, com massas-mãe e processo: kubaneh, jachnun, challah, babka. |
| **Naomi Duguid, _Taste of Persia_** · Artisan, 2016 · EN **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Taste+of+Persia+Naomi+Duguid) | Barbari e sangak com processo, mais Armênia, Azerbaijão, Geórgia e Curdistão. |
| **Jalal Qarooni, _Flat Bread Technology_** · Springer/Chapman & Hall, 1996 · EN · 222 p. **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Flat+Bread+Technology+Qarooni) · [Springer](https://link.springer.com/book/10.1007/978-1-4613-1175-1) | Monografia técnica: formulação, produção, equipamento, vida de prateleira. Antigo, mas é o que existe. |
| **Claudia Roden**, obra geral · **Reem Kassis, _The Arabesque Table_** **[a conferir]**<br>[Roden](https://www.amazon.com.br/s?k=Claudia+Roden+Middle+Eastern+Food) · [Kassis](https://www.amazon.com.br/s?k=The+Arabesque+Table+Reem+Kassis) | Contexto e nomenclatura. Menos úteis para proporção. |

### Índia e Sul da Ásia

| Obra | Por que |
| --- | --- |
| **Julie Sahni, _Classic Indian Cooking_** · Morrow, 1980 · EN · ISBN 978-0-688-03721-5 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780688037215) | Referência há quatro décadas, com instruções ilustradas dos pães, à mão e no processador. **Ressalva conferida: não traz naan**, por escolha da autora. |
| **Alford & Duguid, _Mangoes & Curry Leaves_** · Artisan, 2005 · EN **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Mangoes+and+Curry+Leaves+Duguid) | Índia, Paquistão, Bangladesh, Nepal e Sri Lanka, com os pães de milhete e sorgo que os livros de cozinha indiana de restaurante ignoram. |
| **Madhur Jaffrey**, obra geral **[a conferir]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Madhur+Jaffrey+Indian+Cooking) | Canônica para repertório. Proporção em medida caseira, o que exigiria conversão nossa: cuidado com a regra de não inventar número. |

## 4.4 Farinhas sem glúten: arroz, polvilho, milho, grão-de-bico

**É a única família em que a calculadora de pão atual não serve de base**, porque
quem dá estrutura deixa de ser o glúten e passa a ser hidrocoloide mais amido
gelatinizado. A hidratação sobe para a faixa de 90 a 110% e a dose de goma vira a
variável de controle, como a porcentagem de sal é no picles.

| Obra | Por que |
| --- | --- |
| **Arendt & Dal Bello (eds.), _Gluten-Free Cereal Products and Beverages_** · Academic Press/Elsevier, 2008 · EN · ISBN 978-0-12-373739-7 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780123737397) · [ScienceDirect](https://www.sciencedirect.com/book/9780123737397/gluten-free-cereal-products-and-beverages) | O único livro que trata o sem glúten pelo prisma de ciência de alimentos: matérias-primas, hidrocoloides, farinha de arroz, formulação. Arendt é o nome acadêmico da área. |
| **Artigos revisados por pares sobre psyllium, HPMC e xantana** **[conferido]** · **gratuitos**<br>[Psyllium e vida de prateleira](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8145964/) · [HPMC contra psyllium e xantana](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7693925/) | Medem dose de hidrocoloide contra qualidade e vida de prateleira, e comparam os três. |
| **Literatura brasileira sobre polvilho azedo e expansão** **[a conferir]** · **gratuita**<br>[Embrapa](https://www.embrapa.br/busca-de-publicacoes) · [Google Scholar](https://scholar.google.com/scholar?q=polvilho+azedo+expans%C3%A3o+amido+mandioca) | O amido de mandioca fermentado expande sem fermento e sem glúten, pelos ácidos orgânicos formados na fermentação ao sol. **É o ângulo que combina com o domínio:** pão de queijo e biscoito de polvilho não têm calculadora com fonte em lugar nenhum. |

> **Buraco honesto:** procurei e **não achei livro que publique blends de farinha
> sem glúten em peso com rigor citável**. No nível de receita, o que existe é
> majoritariamente blog e xícara. A saída provável é apoiar a calculadora na
> literatura técnica e usar livro só para repertório, invertendo o padrão das
> outras quatro.

## 4.5 Salmoura e cura de carnes

| Obra | Por que |
| --- | --- |
| **ANVISA e MAPA: tabela de aditivos e regulamento de produtos cárneos** **[conferir na fonte primária]** · **gratuito**<br>[Busca de legislação ANVISA](https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao) · [Legislação MAPA](https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-animal/legislacao) | **Fonte obrigatória, não opcional.** A legislação brasileira fixa 150 mg/kg para nitrito em produtos cárneos, e o dobro para nitrato. É o número que vale aqui, e o que quase nenhuma calculadora em inglês entrega. |
| **USDA FSIS, _Processing Inspectors' Calculations Handbook_** **[conferir]** · **gratuito**<br>[Buscar o handbook](https://www.google.com/search?q=FSIS+Processing+Inspectors+Calculations+Handbook+nitrite) | O lado americano da divergência: 156 ppm de nitrito. Público. |
| **Stanley & Adam Marianski, _Home Production of Quality Meats and Sausages_** · EN · ISBN 978-0-9824267-3-9 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780982426739) | O mais explícito em conta de ppm para quem faz em casa: cure #1 a 6,25% de nitrito, 1 oz por 25 lb de carne. Ensina a matemática, não só a receita. **Atenção: parte da norma americana.** |
| **Ruhlman & Polcyn, _Charcuterie_** · EN **[a conferir]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Charcuterie+Ruhlman+Polcyn) | Ruhlman **já está na estante** por causa do _Ratio_, o que ajuda na coerência editorial. Bom para método e proporção de tempero; a parte de cura precisa ser lida contra a norma brasileira. |
| **Modernist Cuisine** (salmoura de equilíbrio) e **J. Kenji López-Alt, _The Food Lab_** (salga seca) **[a conferir]**<br>[Modernist Cuisine](https://modernistcuisine.com/books/) · [Food Lab](https://www.amazon.com.br/s?k=The+Food+Lab+Kenji+Lopez-Alt) | Os dois lados da divergência de salmoura: equilíbrio mirando cerca de 0,5% de sal final na carne, contra salga seca a 0,85% sobre o peso da proteína. |

## 4.6 Geleias, pectina e conservas de fruta

| Obra | Por que |
| --- | --- |
| **NCHFP (University of Georgia / USDA)** **[já na estante]** · **gratuito**<br>[Geleias e gelatinas](https://nchfp.uga.edu/how/make-jam-jelly/jams-jellies-general-information/general-information-on-canning-jams-jellies-and-marmalades) | Já é fonte oficial do site, por causa da acidez do picles de vinagre. Publica a relação fruta, pectina, ácido e açúcar, e a janela de pH. **Zero custo de aquisição.** |
| **Rachel Saunders, _The Blue Chair Jam Cookbook_** · Andrews McMeel, 2010 · EN · ISBN 978-0-7407-9143-7 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780740791437) · [Simon & Schuster](https://www.simonandschuster.com/books/The-Blue-Chair-Jam-Cookbook/Rachel-Saunders/9781449487638) | Mais de 100 receitas **sem pectina comercial**, com o conhecimento técnico de preservação explicado. O contraponto artesanal à régua oficial, e onde a divergência vive. |
| **Manuais técnicos de fabricante de pectina** **[a conferir]** · **gratuitos**<br>[CP Kelco](https://www.cpkelco.com/products/pectin/) · [Herbstreith & Fox](https://www.herbstreith-fox.de/en/) | Publicam grau de gelificação, dose por Brix e janela de pH com rigor de folha de especificação. Precisam ser tratados como o que são: material de fabricante. |
| **Christine Ferber, _Mes Confitures_** · EN/FR **[a conferir]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Mes+Confitures+Christine+Ferber) | Referência autoral francesa, com método próprio de maceração. Repertório e método, não número. |

## 4.7 Emulsões e molhos

| Obra | Por que |
| --- | --- |
| **James Peterson, _Sauces_, 4ª ed.** · EN · ISBN 978-0-544-81982-5 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780544819825) | James Beard, quase 500 receitas, e o livro que trata molho como sistema de proporção: mães, derivados, emulsões quentes e frias, vinagretes. **A melhor compra do tema.** |
| **David Julian McClements, _Food Emulsions_, 3ª ed.** · CRC, 2015 · EN · ISBN 978-1-4987-2668-9 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9781498726689) · [Routledge](https://www.routledge.com/Food-Emulsions-Principles-Practices-and-Techniques-Third-Edition/McClements/p/book/9781498726689) | O texto acadêmico padrão de emulsão alimentar. Sustentaria a explicação de por que uma maionese quebra, com rigor que nenhum livro de cozinha alcança. Caro e denso. |

## 4.8 Ganache e chocolataria

| Obra | Por que |
| --- | --- |
| **Peter P. Greweling / CIA, _Chocolates and Confections_, 2ª ed.** · Wiley · EN · ISBN 978-0-470-42441-4 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780470424414) · [Wiley](https://www.wiley.com/en-us/Chocolates+and+Confections:+Formula,+Theory,+and+Technique+for+the+Artisan+Confectioner,+2nd+Edition-p-x000472860) | **A referência técnica do tema.** Capítulos separados para ganache de creme e de manteiga, quase 200 fórmulas, e o tratamento de atividade de água que decide validade de bombom. É o Corvitto da chocolataria. |
| **Jean-Pierre Wybauw**, série _Fine Chocolates_ · EN **[a conferir]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Wybauw+Fine+Chocolates) | Formulação e vida de prateleira de recheio, com tabelas. Complementa o Greweling no que ele resume. |

## 4.9 Molhos orientais

| Obra | Por que |
| --- | --- |
| **Shizuo Tsuji, _Japanese Cooking: A Simple Art_** · Kodansha, 1980 · EN **[conferido; título corrigido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=Japanese+Cooking+A+Simple+Art+Tsuji) | *Indicado pelos colegas.* O livro de fundamentos da cozinha japonesa, construído sobre dashi e shoyu. É onde as razões de molho aparecem como razão mesmo (tentsuyu, donburi), e não como receita. |
| **Fuchsia Dunlop, _The Food of Sichuan_** · EN **[a conferir edição]**<br>[Amazon BR](https://www.amazon.com.br/s?k=The+Food+of+Sichuan+Fuchsia+Dunlop) | *Indicado pelos colegas.* A maior autoridade ocidental em cozinha chinesa, e o livro detalha as combinações de sabor de Sichuan como fórmulas: fish-fragrant, strange-flavour, mala. |
| **Park & Choi, _The Korean Cookbook_** · Phaidon, 2023 · EN · ISBN 978-1-83866-754-2 **[conferido; autoria corrigida]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9781838667542) · [Phaidon](https://www.phaidon.com/en-us/products/the-korean-cookbook/) | *Indicado pelos colegas.* Mais de 350 receitas, com os jang (gochujang, doenjang, ganjang) e os derivados. Choi é chefe de P&D do centro de fermentação da Sempio, o que dá lastro incomum ao capítulo de fermentados. |
| **Irene Kuo, _The Key to Chinese Cooking_** · Knopf, 1977 · EN · ISBN 978-0-394-49638-2 **[conferido; autoria e título corrigidos]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9780394496382) · [Estante Virtual](https://www.estantevirtual.com.br/busca?q=The%20Key%20to%20Chinese%20Cooking) | *Indicado pelos colegas, com o nome trocado.* Clássico de técnica chinesa, incluindo a estrutura dos molhos de salteado. **Fora de catálogo: procurar usado.** |

## 4.10 Transversais

| Obra | Por que |
| --- | --- |
| **Harold McGee, _Comida e Cozinha: Ciência e Cultura da Culinária_** · WMF Martins Fontes · **PT-BR** · 992 p. · ISBN 978-85-7827-832-8 **[conferido]**<br>[Amazon BR](https://www.amazon.com.br/s?k=9788578278328) · [Martins Fontes Paulista](https://www.martinsfontespaulista.com.br/comida---cozinha-727844/p) · [Estante Virtual](https://www.estantevirtual.com.br/busca?q=Comida%20e%20Cozinha%20McGee) | *Indicado pelos colegas.* **A compra transversal mais útil da lista inteira.** Sustenta o texto explicativo de praticamente toda calculadora: cristalização da água, açúcar e ponto de congelamento, emulsão, glúten, pectina, cura. Em português, e há edições usadas. |
| **Michael Ruhlman, _Ratio_** **[já na estante]** | Já sustenta pães e massas. Serve também de ponto de partida para geleia, ganache e emulsão. |

---

# Parte 5: lista de compras sugerida

Ordenada por quanto cada compra destrava, não por preço.

| # | Obra | Destrava |
| --- | --- | --- |
| 1 | [McGee, _Comida e Cozinha_](https://www.amazon.com.br/s?k=9788578278328) (PT-BR) | Texto explicativo de todas as calculadoras, existentes e planejadas |
| 2 | [Corvitto, _Los secretos del helado_](https://www.amazon.com.br/s?k=9788492244331) (ES) | O único buraco de procedência que o site tem hoje: PAC e POD |
| 3 | [Forkish, _Harina, agua, sal, levadura_](https://www.amazon.com.br/s?k=9788415887638) (ES) | A parte mais fina da estante de pães, que é pré-fermento |
| 4 | [Greweling, _Chocolates and Confections_](https://www.amazon.com.br/s?k=9780470424414) (EN) | A calculadora de ganache inteira, sozinho |
| 5 | [Alford & Duguid, _Flatbreads & Flavors_](https://www.amazon.com.br/s?k=9780061673269) (EN) | Pedaço dos três recortes de pão oriental, com um livro só |
| 6 | [Saunders, _Blue Chair Jam_](https://www.amazon.com.br/s?k=9780740791437) (EN) | Com o NCHFP, que é gratuito, a calculadora de geleias |
| 7 | [Cho, _Mooncakes and Milk Bread_](https://www.amazon.com.br/s?k=9780785238997) (EN) | Porta de entrada do leste asiático, e é barato |
| 8 | [Peterson, _Sauces_](https://www.amazon.com.br/s?k=9780544819825) (EN) | Se o tema de molhos virar conteúdo |

**Custo zero, e a fazer antes de qualquer compra:**
[norma da ANVISA](https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao),
[handbook do FSIS](https://www.google.com/search?q=FSIS+Processing+Inspectors+Calculations+Handbook+nitrite) e
[NCHFP sobre geleias](https://nchfp.uga.edu/how/make-jam-jelly/jams-jellies-general-information/general-information-on-canning-jams-jellies-and-marmalades).
Três fontes oficiais que sozinhas sustentam as duas calculadoras mais fortes do
documento.

**Investimento de outra ordem, só se o tema virar carro-chefe:** Goff & Hartel,
Caviezel, Huang & Miskelly, McClements, _Modernist Bread_ completo.

---

# Parte 6: o que ainda não tem fonte

## Já estava na tela (encontrado em 2026-09-04)

Levantado ao dar fonte a cada verbete do glossário. São os dois únicos casos no
site inteiro, os dois no gelato, e os dois vieram de conhecimento corrente e não
de obra nenhuma.

| Onde | O que estava escrito | O que foi feito |
| --- | --- | --- |
| Glossário, "Overrun" | "Gelato artesanal fica entre 20 e 35%" | **Número removido.** O conceito ficou; a faixa sai da tela até haver de onde citá-la. |
| Densidade da calda | 1,10 g/mL como padrão | **Fica, dito como valor de trabalho declarado**, não número de fonte — e o campo já era editável. Mesmo tratamento do `JAR_GRAMS_PER_MILLILITER` no picles. |

Procurei os dois na planilha do curso (`overrun`, `aeração`, `litro`, `volume`,
`ml`, `densidade`): não há nada. A temperatura de serviço, de que eu também
desconfiava, **está lá** — a célula C24 da aba de receita calcula `PAC/25` sob o
rótulo "Temperatura Média de Serviço", e passou a ser citada.

**O que resolve:** qualquer um dos dois livros de gelato da Parte 4, o Corvitto
ou o Migoya, cobre overrun e densidade de calda com folga. É mais um argumento
para eles virem logo depois do McGee.

## Ainda por levantar

Registrado para não virar promessa esquecida:

- **Blend de farinha sem glúten em peso**, com rigor citável. Não achei.
- **Faixa de valor W por tipo de pão.** O glossário fala de força de farinha, o
  cálculo não usa, e a estante não sustenta.
- **Polvilho azedo e expansão**, em fonte primária brasileira. Sei que existe
  literatura, mas não localizei a publicação específica.
- **Norma vigente de nitrito e nitrato**, conferida na RDC e no regulamento do
  MAPA, e não em terceiros. **Obrigatório antes de escrever uma linha da
  calculadora de cura.**

# Antes de escrever qualquer código

Vale a regra que já governa as quatro calculadoras publicadas: a proporção entra
primeiro aqui em `docs/research/`, com obra e página, e só depois no código. Nos
temas com peso de segurança, cura e geleia, some a isso o balizador da Parte 1:
número que separa seguro de perigoso sai de norma oficial, o aviso acompanha o
resultado, e a régua brasileira é a que manda.
