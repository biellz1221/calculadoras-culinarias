# Bibliografia candidata: gelato e pães orientais

Levantamento de 2026-09-03. Não é extração: nenhum número deste documento entrou
no código. É a lista do que vale ler antes de escrever a próxima calculadora, e
o que cada obra resolveria.

## Critério

Uma fonte serve a este site quando cumpre as três:

1. **Publica proporção, não só receita.** Livro que diz "1 xícara de farinha"
   sem peso não sustenta calculadora.
2. **Tem endereço citável.** Página, capítulo ou seção. É o que
   `src/data/citations.ts` exige na construção do dado.
3. **É verificável por quem lê.** Obra publicada ou literatura técnica. Material
   de curso entra só declarado como tal, e hoje há exatamente um caso, a
   planilha do Lulo Fouet na calculadora de gelato.

Marcação de confiança: **[conferido]** = editora, edição e ISBN checados nesta
rodada. **[a conferir]** = indicação de memória, confirmar antes de comprar.

---

## Parte 1: gelato

### O buraco que existe hoje

A planilha do curso [Gelato Direto ao Ponto](https://lulofouet.com/gelatodiretoaoponto/),
de Luis Paulo dos Santos Barros (Lulo Fouet), dá os 164 ingredientes, os
coeficientes de POD e PAC e as faixas dos cinco tipos de base. É material
didático, e é a única calculadora do site que não se apoia em obra publicada.

Faltam três coisas que nenhuma delas é receita:

- **De onde saem os coeficientes de PAC e POD de cada açúcar.** Hoje o site usa
  os números da planilha sem uma fonte publicada por trás deles.
- **Por que PAC prediz a textura.** É depressão crioscópica, e isso tem
  literatura.
- **Uma segunda régua para as faixas de base.** Com uma fonte só, divergência não
  existe, e divergência explicada é o diferencial editorial do site.

### Prioridade 1: fecham o buraco

| Obra | Por que |
| --- | --- |
| **Angelo Corvitto, _Los secretos del helado_** (Grupo Vilbo, 392 p.) **[conferido]** | É a obra que **publica** as tabelas de poder anticongelante e poder edulcorante por açúcar, além de 125 fórmulas balanceadas. É a fonte impressa mais próxima do que a planilha faz, e a única que permitiria citar PAC e POD com autor e página. Existe em espanhol e em inglês (_The Secrets of Ice Cream_). **A compra mais óbvia da lista.** |
| **Luca Caviezel, _Scienza e tecnologia del gelato artigianale_** (Chiriotti, 2016, 686 p., ISBN 978-88-96027-27-1) **[conferido]** | A "bíblia" italiana do setor, primeira edição em 1986 e revisada pelo autor em 2016. Cobre matérias-primas, funções, balanceamento, defeitos. Dá a **segunda régua** que hoje não existe: onde as faixas dele divergirem das da planilha, vira conteúdo. Só em italiano. |
| **H. D. Goff, R. W. Hartel & S. A. Rankin, _Ice Cream_, 8ª ed.** (Springer, 2025, 950 p., ISBN 978-3-031-77871-1) **[conferido]** | O livro-texto científico da área, com capítulo dedicado a cálculo de misturas e depressão do ponto de congelamento. É o que sustenta **por que** PAC funciona, e o que permitiria a calculadora dizer a temperatura de serviço com fonte, em vez da regra prática PAC ÷ 25. |

### Prioridade 2: bons, não decisivos

| Obra | Por que |
| --- | --- |
| **Chris Clarke, _The Science of Ice Cream_, 2ª ed.** (RSC, 2012, ISBN 978-1-84973-127-0) **[conferido]** | Físico da Unilever escrevendo para quem não é da área. Mais curto e mais legível que o Goff, ótimo para o texto explicativo da página. Menos útil para número. |
| **Francisco Migoya / CIA, _Frozen Desserts_** (Wiley, 2008, ISBN 978-0-470-11866-5) **[conferido]** | Formulação de confeitaria profissional, com teoria de ingredientes e estabilizantes. Bom complemento; a régua dele é de restaurante, não de gelateria. |
| **Dana Cree, _Hello, My Name Is Ice Cream_** (Clarkson Potter, 2017) **[conferido]** | Publica cada receita em **três colunas: porcentagem, gramas e xícaras**. A coluna de porcentagem é exatamente o formato que o site usa. Em inglês, acessível, barato. |
| **Torrance Kopfer, _Sorvetes artesanais: gelatos e sorbets_** (Senac SP, 2015, 176 p.) **[conferido]** | A opção em português, mesma editora do Camargo que já está na estante. 45 receitas. **Ressalva honesta: é livro de receita, não de balanceamento** — provavelmente não fecha nenhum dos três buracos acima. |

---

## Parte 2: pães orientais

Você pediu os três recortes. Antes da lista, o que importa para o código:

> **Os pães asiáticos quebram duas premissas da calculadora atual.** A primeira
> é o forno: mantou e baozi são cozidos no vapor, e boa parte dos pães chatos
> vai na chapa ou na parede do forno de barro. A segunda é a base de farinha
> 100%: no **tangzhong** e no **yudane** parte da farinha é pré-gelatinizada com
> água quente antes de entrar na massa, o que muda a hidratação real.
>
> A boa notícia é que **o motor já sabe fazer isso**. É o mesmo problema do
> pré-fermento, que `src/lib/bread/calculate.ts` já resolve separando a farinha e
> a água que entram dentro do levain. Um tangzhong é um pré-fermento sem
> fermento: entra com a sua própria proporção de farinha e água, e a hidratação
> declarada difere da real. A conta existe; falta a fonte.

### Leste asiático

| Obra | Por que |
| --- | --- |
| **Sidi Huang & Diane Miskelly, _Steamed Breads: Ingredients, Processing and Quality_** (Woodhead/Elsevier, 2017, ISBN 978-0-08-100715-0) **[conferido]** | Uma monografia técnica inteira sobre mantou e baozi: classificação dos tipos, exigência de qualidade da farinha, ingredientes, métodos tradicionais e industriais, defeitos. **Cerca de 50% de toda a farinha consumida na China vira pão no vapor**, e este é o único livro sério sobre isso em inglês. Se for fazer pão asiático com rigor, é esta a fonte. Caro, de editora científica. |
| **Yvonne Chen (陳郁菁), _65°C 湯種麵包 / Bread Doctor_** (Taiwan, 2004) **[conferido no WorldCat]** | **A origem do método tangzhong** como fenômeno moderno: é este livro que popularizou o roux de 1 parte de farinha para 5 de água a 65 °C. Citar a técnica sem citá-lo seria como falar de porcentagem de padeiro sem citar ninguém. Ressalva: em chinês, e a edição em inglês é difícil de achar. |
| **Kristina Cho, _Mooncakes and Milk Bread_** (Harper Horizon, 2021, ISBN 978-0-7852-3899-7) **[conferido]** | James Beard 2022 em duas categorias, e **o primeiro livro dedicado só a padaria e café chineses**. Pão de leite, pães recheados assados e no vapor, massas. Em inglês, fácil de comprar, receitas em peso. A porta de entrada mais prática do bloco. |
| **Andrea Nguyen, _Asian Dumplings_** (Ten Speed) **[a conferir]** | Massas de bao e mantou com rigor de proporção incomum no gênero; ela testa e publica variações. |
| Artigos sobre **gelatinização de amido em tangzhong/yudane** **[a conferir]** | Existe literatura recente medindo efeito na retenção de água e no envelhecimento do miolo. É o que daria lastro técnico à explicação, em vez de repetir o que os blogs dizem. |

### Oriente Médio e Norte da África

| Obra | Por que |
| --- | --- |
| **Jeffrey Alford & Naomi Duguid, _Flatbreads & Flavors: A Baker's Atlas_** (Morrow, 1995, ISBN 0-688-11411-3; reedição 978-0-06-167326-9) **[conferido]** | James Beard. Mais de 60 pães chatos **do mundo inteiro**: pita do Oriente Médio, naan do Afeganistão, chapati da Índia, tortilla do México. Uma compra só cobre pedaços dos três recortes que você pediu. **O melhor custo-benefício da lista de pães.** |
| **Anissa Helou, _Feast: Food of the Islamic World_** (Ecco, 2018, ISBN 978-0-06-236303-9) **[conferido]** | James Beard, e um capítulo de pães que vai do Marrocos à Indonésia. Helou é a autoridade da área e escreve com precisão de técnica, não de turista. Cobre a faixa geográfica mais ampla com uma voz só. |
| **Uri Scheft, _Breaking Breads_** (Artisan, 2016, ISBN 978-1-57965-682-9) **[conferido]** | Padeiro da Lehamim (Tel Aviv) e da Breads Bakery (NY). Pães diários do Oriente Médio como kubaneh e jachnun, além de challah e babka. É livro **de padeiro**, com massas-mãe e processo, não coletânea de receitas. |
| **Naomi Duguid, _Taste of Persia_** (Artisan, 2016) **[conferido]** | Barbari e sangak com processo. Cobre Irã, Armênia, Azerbaijão, Geórgia e Curdistão, que os outros dois mal tocam. |
| **Jalal Qarooni, _Flat Bread Technology_** (Springer/Chapman & Hall, 1996, 222 p.) **[conferido]** | Monografia técnica sobre o pão mais consumido do mundo: formulações, produção, equipamento, avaliação de qualidade, vida de prateleira. É onde estaria a faixa de hidratação com lastro, em vez de receita a receita. Antigo, mas é o que existe. |
| **Claudia Roden, _A Book of Middle Eastern Food_** / **Reem Kassis, _The Arabesque Table_** **[a conferir]** | Canônicas para contexto e nomenclatura. Menos úteis para proporção. |

### Índia e Sul da Ásia

| Obra | Por que |
| --- | --- |
| **Julie Sahni, _Classic Indian Cooking_** (Morrow, 1980, ISBN 978-0-688-03721-5) **[conferido]** | Referência há quatro décadas, com instruções ilustradas passo a passo para os pães, à mão e no processador. Sahni é a mais metódica do gênero. **Ressalva conferida: ela não traz naan neste livro**, por escolha editorial. |
| **Jeffrey Alford & Naomi Duguid, _Mangoes & Curry Leaves_** (Artisan, 2005) **[conferido]** | Índia, Paquistão, Bangladesh, Nepal e Sri Lanka. Pega os pães regionais de milhete e sorgo que os livros de cozinha indiana "de restaurante" ignoram. |
| **Madhur Jaffrey**, obra geral **[a conferir]** | Canônica para o repertório. Proporção em medida caseira, o que exige conversão e, portanto, decisão nossa: cuidado com a regra de não inventar número. |
| **Nik Sharma, _The Flavor Equation_** **[a conferir]** | Autor com formação científica; útil para a parte explicativa, não para as proporções. |

### Técnico transversal

| Obra | Por que |
| --- | --- |
| **S. P. Cauvain & L. S. Young, _Technology of Breadmaking_, 3ª ed.** (Springer, ISBN 978-3-319-14686-7) **[conferido]** | O livro-texto de tecnologia de panificação. Serve às quatro calculadoras de pão, não só às orientais. |
| **W. Zhou & Y. H. Hui (eds.), _Bakery Products Science and Technology_, 2ª ed.** (Wiley, ISBN 978-1-119-96715-6) **[conferido]** | Tem capítulo próprio de **_Steamed Bread_** e outro de **_Bakery Products of China_**. Se o Huang & Miskelly for caro demais, é o atalho: um capítulo em vez de um livro. |

---

## Recomendação, se for comprar pouco

1. **Corvitto** — é o único que resolve a citação de PAC e POD, que é o buraco
   mais feio do site hoje.
2. **Alford & Duguid, _Flatbreads & Flavors_** — cobre pedaço dos três recortes
   de pão com um livro só.
3. **Kristina Cho** — a porta de entrada prática do leste asiático, e barata.
4. **Zhou & Hui** (capítulo de steamed bread) ou **Huang & Miskelly**, conforme
   quanto rigor você quiser no pão no vapor.

O **Goff & Hartel** e o **Caviezel** são investimento de outra ordem: valem se a
calculadora de gelato virar o carro-chefe do site, não antes.

## Antes de escrever qualquer código

Vale lembrar a regra que já vale para as outras quatro: a proporção entra
primeiro aqui em `docs/research/`, com obra e página, e só depois no código. Um
pão no vapor ou um pão chato provavelmente vai pedir mudança de modelo (sem
forno, sem fermento, farinha pré-gelatinizada), então o caminho é extrair
primeiro e decidir o modelo com o dado na mão.
