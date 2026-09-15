export const jamPtBR = {
  meta: {
    title: 'Geleia: açúcar, limão e o ponto',
    description:
      'Quanto açúcar e limão por quilo de fruta, e a que temperatura a geleia dá o ponto onde você mora. Toda proporção vem de uma receita publicada, citada.',
    keywords: [
      'calculadora de geleia',
      'quanto açúcar para geleia',
      'ponto da geleia temperatura',
      'geleia sem pectina',
      'proporção fruta açúcar geleia',
      'geleia em altitude',
      'conserva de fruta caseira',
      'suco de limão na geleia',
      'geleia de goiaba',
      'geleia de jabuticaba',
      'quanto de pectina na geleia',
      'pH da geleia',
      'geleia extra e comum legislação',
    ],
    imageAlt:
      'Cartão da calculadora de geleias, com o título e as obras que sustentam as proporções.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quanto açúcar para 1 kg de fruta?',
        answer:
          'Depende da fruta, e essa é a resposta honesta. No Blue Chair Jam Cookbook vai de 417 g por quilo no damasco a 1 kg por quilo na framboesa. Christine Ferber usa 800 g por quilo em quase todo o livro dela. A calculadora entrega a proporção da receita citada para a fruta que você escolheu, e mostra a de Ferber ao lado.',
      },
      {
        question: 'A que temperatura a geleia dá o ponto?',
        answer:
          'Oito graus Fahrenheit acima de onde a água ferve no lugar em que você cozinha — 104,4 °C no nível do mar, cerca de 100 °C em Brasília. Os 105 °C que os livros franceses citam valem para a Europa perto do nível do mar. Informe a altitude e a calculadora dá o número da sua cozinha.',
      },
      {
        question: 'Posso fazer geleia com menos açúcar?',
        answer:
          'Pode, mas o produto muda de categoria. O NCHFP é direto: açúcar é o conservante, e "too little sugar prevents gelling and may allow yeasts and molds to grow". Com pouco açúcar você tem um doce de geladeira, para consumir em até um mês, e não uma conserva de prateleira.',
      },
      {
        question: 'Preciso de pectina comprada?',
        answer:
          'Nas frutas do grupo I do NCHFP, não: elas têm pectina e ácido de sobra. No grupo III, sempre falta ácido, pectina ou os dois. A calculadora sugere a saída de Ferber, que é emprestar pectina de 200 g de gelatina de maçã por quilo de fruta, em vez de pectina em pó.',
      },
      {
        question: 'Para que serve o suco de limão?',
        answer:
          'Para duas coisas ao mesmo tempo: "Acid is needed both for gel formation and flavor", diz o NCHFP. Sem ácido suficiente a pectina não forma rede e a geleia não pega. Com ácido demais a rede fica instável e a geleia solta líquido depois de pronta.',
      },
      {
        question: 'Dá para fazer geleia de goiaba, jabuticaba ou maracujá?',
        answer:
          'Dá, e desde setembro de 2026 a calculadora entrega essas frutas. O que muda é de onde vem o número: nenhum dos livros da estante publica receita pesada de goiaba, então a classificação vem da Tabela 1 da Embrapa — goiaba vermelha é rica em pectina e média em acidez — e a proporção vem da definição legal brasileira de geleia. O que a Embrapa não publica, como rendimento em potes e validade, não aparece.',
      },
      {
        question: 'Quanta pectina em pó eu uso?',
        answer:
          'De 0,5% a 1,5% do açúcar, não da fruta. A base é o que mais se erra: numa geleia com 1 kg de açúcar isso são 5 a 15 g de pectina. A Embrapa publica a faixa e as próprias formulações do documento obedecem a ela. Onde cair dentro da faixa depende da pectina própria da fruta, e é por isso que a calculadora mostra a classificação ao lado da dose em vez de cravar um número.',
      },
      {
        question: 'Qual é o pH certo para a geleia pegar?',
        answer:
          'O gel se forma em torno de pH 3, e acima de 3,4 não se forma; na geleia pronta o alvo é 3,0 a 3,2. Tem uma regra de bancada que vale mais que qualquer dose de limão: meça a polpa antes de começar e, se ela já estiver entre 3,0 e 3,3, não acidifique. Quanto de ácido acrescentar quando está fora da faixa é o que nenhuma fonte publica, e por isso a calculadora não diz.',
      },
      {
        question: 'Por que a receita pede fruta preparada?',
        answer:
          'Porque é sobre esse peso que a proporção foi escrita. Saunders é explícita: "always base the amount of sugar on the total weight of raw prepared fruit being used". Pese depois de descascar, tirar caroço e cortar — não a sacola do mercado.',
      },
    ],
  },

  eyebrow: 'Calculadora de geleias',
  title: 'A geleia dá o ponto na altitude em que você cozinha',
  lead: 'Diga a fruta, o peso já preparado e a altitude da sua cidade. A calculadora entrega o açúcar e o limão da receita publicada para aquela fruta, e a temperatura em que a geleia dá o ponto aí onde você está — que não são os 105 °C dos livros franceses se você mora no planalto.',

  input: {
    label: 'A sua panela',
    fruit: 'Fruta',
    weighedGroup: 'Com receita pesada (Blue Chair)',
    classifiedGroup: 'Tabela da Embrapa (sem receita)',
    nativeGroup: 'Receituário do MMA (geleia fresca)',
    fruitGrams: 'Fruta preparada (g)',
    fruitHint: 'Já descascada, sem caroço e cortada. É sobre este peso que as proporções foram escritas.',
    altitude: 'Altitude (m)',
    altitudeHint: 'Da cidade onde você vai cozinhar. Muda o ponto da geleia e o tempo de banho-maria.',
    sugar: 'Quanto açúcar',
    custom: 'Açúcar sobre a fruta (%)',
    customHint: 'Abaixo do que a receita publica, o aviso aparece — e explica o que muda.',
  },

  fruits: {
    strawberry: 'Morango',
    raspberry: 'Framboesa',
    blackberry: 'Amora-preta',
    apricot: 'Damasco',
    peach: 'Pêssego',
    plum: 'Ameixa',
    fig: 'Figo',
    blueberry: 'Mirtilo',
    grape: 'Uva',

    // As linhas restantes da Tabela 1 do Embrapa Doc 29. O nome carrega a
    // variedade quando a fonte carrega: "figo maduro" e "figo verde e de vez"
    // são linhas diferentes porque têm pectina diferente, e apagar isso seria
    // apagar o que a tabela tem de melhor.
    //
    // `fig-ripe` e `peach-ripe` não estão no seletor — as receitas de Saunders
    // as absorveram —, mas continuam sendo duas linhas da tabela na página, e
    // por isso precisam de nome. Há teste para isso, e ele já pegou a falha.
    pineapple: 'Abacaxi',
    acerola: 'Acerola',
    'japanese-plum': 'Ameixa-do-japão',
    araca: 'Araçá roxo',
    banana: 'Banana (d’água ou nanica)',
    'caja-manga': 'Cajá-manga',
    'cashew-apple': 'Caju',
    persimmon: 'Caqui',
    'starfruit-sour': 'Carambola ácida',
    'starfruit-sweet': 'Carambola doce',
    'fig-ripe': 'Figo maduro',
    'peach-ripe': 'Pêssego amarelo maduro',
    'fig-unripe': 'Figo verde e de vez',
    'sugar-apple': 'Fruta-do-conde',
    guava: 'Goiaba vermelha',
    currant: 'Groselha',
    'jaboticaba-common': 'Jabuticaba comum',
    'jaboticaba-ponhema': 'Jabuticaba ponhema',
    'jaboticaba-sabara-skin': 'Jabuticaba sabará com casca',
    'jaboticaba-sabara-peeled': 'Jabuticaba sabará sem casca',
    orange: 'Laranja, fruta inteira',
    lemon: 'Limão',
    'apple-tart': 'Maçã ácida',
    'apple-sweet': 'Maçã doce',
    papaya: 'Mamão',
    'mango-espada': 'Manga espada',
    'mango-espadao': 'Manga espadão',
    passionfruit: 'Maracujá, suco',
    quince: 'Marmelo',
    loquat: 'Nêspera',
    'pear-ripe': 'Pêra d’água madura',
    'peach-green': 'Pêssego verde',
    pitanga: 'Pitanga',
    pomegranate: 'Romã',
    'grape-american': 'Uva ananás, catawba e empire state',
    'grape-isabel': 'Uva isabel e niágara',
    uvaia: 'Uvaia',
    'umbu': 'Umbu',
    'passionfruit-cerrado': 'Maracujá-do-cerrado',
    'passionfruit-mato': 'Maracujá-do-mato',
    'pera-do-cerrado': 'Pera-do-cerrado',
    'jaboticaba-seedless': 'Jabuticaba sem caroço',
  },

  /** O grupo é a classificação do NCHFP, e decide se o limão é obrigatório. */
  groups: {
    i: 'Grupo I — pectina e ácido próprios',
    ii: 'Grupo II — pode faltar ácido ou pectina',
    iii: 'Grupo III — sempre falta ácido, pectina ou os dois',
    iHint:
      'Segundo o NCHFP, esta fruta tem pectina e ácido suficientes para gelificar só com açúcar, desde que não esteja passada.',
    iiHint:
      'Segundo o NCHFP, esta fruta é baixa em ácido ou em pectina, e pode precisar de um dos dois. A receita citada já traz o limão que a autora usou.',
    iiiHint:
      'Segundo o NCHFP, esta fruta sempre precisa de ácido, pectina ou os dois. O limão da receita não é tempero: é o que faz a geleia pegar.',
  },

  /** Os dois eixos da Tabela 1 do Embrapa Doc 29. */
  embrapa: {
    label: 'Tabela da Embrapa',
    pectin: 'Pectina',
    acidity: 'Acidez',
    pectinLevels: { rich: 'rica', medium: 'média', poor: 'pobre' },
    acidityLevels: { high: 'alta', medium: 'média', low: 'baixa' },
    hint: 'Classificação da Embrapa para esta fruta, em dois eixos separados — ao contrário do grupo americano, que junta os dois numa coisa só.',
    viaJackix: 'Linha reproduzida de Jackix (1988) pela Embrapa. Citação de terceira mão.',
    ownRow: 'Linha da própria Embrapa, sem intermediário.',
    noRecipe:
      'Nenhuma obra da estante publica receita pesada desta fruta. A proporção abaixo vem da definição legal brasileira de geleia, e o rendimento e a validade ficam de fora porque a fonte não os declara.',
    bothSources:
      'Esta fruta está nas duas classificações, a americana e a brasileira, e as duas concordam.',
  },

  sugarLevels: {
    source: 'A da receita',
    fresh: 'A do receituário',
    ferber: 'Ferber (80%)',
    extra: 'Extra (50:50)',
    common: 'Comum (40:60)',
    custom: 'Escolher',
    sourceNote:
      'A proporção que o Blue Chair Jam Cookbook publica para esta fruta, sobre o peso da fruta preparada. Cada fruta tem a sua, e é isso que uma média esconderia.',
    freshNote:
      'A proporção que o receituário de biodiversidade do Ministério do Meio Ambiente publica para esta fruta. É geleia de prato, para comer no dia — cozinha a 65–70 °C, não vai a pote nem a banho-maria, e o livro não declara validade.',
    ferberNote:
      'A proporção da casa de Christine Ferber: 800 g de açúcar por quilo de fruta. É o valor de 93 das 218 receitas do livro dela, o mais frequente de longe.',
    extraNote:
      'A geleia extra da legislação brasileira: cinquenta partes de fruta para cinquenta de açúcar, um para um. É a menor proporção que a norma admite chamar de geleia, e ainda assim iguala ou passa todas as nove receitas do Blue Chair — oito ficam abaixo dela, e a framboesa empata.',
    commonNote:
      'A geleia comum da legislação brasileira: quarenta partes de fruta para sessenta de açúcar. Marmelo, laranja e maçã podem ir a trinta e cinco por sessenta e cinco, e a própria norma abre essa exceção.',
    customNote:
      'Sua escolha. Abaixo do que a fonte publica para esta fruta, a página avisa o que muda na conservação.',
  },

  result: {
    title: 'O que pesar',
    sugar: 'Açúcar cristal',
    lemon: 'Suco de limão coado',
    lemonNone: 'A receita não leva limão',
    appleJelly: 'Gelatina de maçã',
    appleJellyHint:
      'A saída de Ferber para fruta que não gelifica sozinha: pectina emprestada da maçã, 200 g por quilo, em vez de pectina em pó.',
    pectin: 'Pectina em pó, se usar',
    pectinHint:
      'De 0,5% a 1,5% do açúcar — não da fruta, e não do produto pronto. A Embrapa é quem declara a base, e errar a base aqui erraria a dose pela metade. Onde cair dentro da faixa depende da pectina própria da fruta, e a fonte não converte isso em número.',
    lemonUnknown: 'A fonte classifica a acidez, não publica a dose',
    lemonUnknownHint:
      'A Embrapa diz se a fruta é alta, média ou baixa em acidez, e não diz quanto de ácido acrescentar. O que dá para seguir é o alvo: pH entre 3,0 e 3,2 na geleia pronta, medido. Acima de 3,4 não gelifica.',
    ph: 'pH alvo da geleia',
    phHint:
      'Meça a polpa antes de começar: entre 3,0 e 3,3 o Doc 138 dispensa acidificar. O gel se forma em torno de pH 3, e acima de 3,4 não se forma.',
    ratio: 'Açúcar sobre a fruta',
    jars: 'Rende, mais ou menos',
    jarsUnit: 'potes de 240 ml',
    jarsHint: 'Escalado do rendimento que a própria receita declara. Fica em potes porque é a unidade do livro.',
    shelf: 'Validade que o livro declara',
    months: 'meses',
    year: '1 ano',
    evaporation: 'Água a evaporar',
    evaporationHint:
      'Estimativa: quanto precisa sair da panela para o doce chegar aos 65% de açúcar que Ferber aponta como o ponto de conservação. É a única conta desta página que combina duas fontes.',
  },

  point: {
    title: 'O ponto, na sua altitude',
    resultTitle: 'Onde parar de cozinhar',
    lead: 'Ferber manda cozinhar a 105 °C e Saunders a 220 °F. É o mesmo ponto, e os dois são números de nível do mar. O NCHFP é o único que escreve a regra do jeito que sobrevive à mudança de lugar.',
    setting: 'Ponto de gelificação',
    boiling: 'Água ferve a',
    processing: 'Banho-maria',
    minutes: 'min',
    settingHint:
      'Oito graus Fahrenheit acima da fervura. Passar disso, avisa Saunders, dá uma geleia "irrevocably tough, leathery" — e não tem volta.',
    processingHint:
      'Potes de até 500 ml, geleia sem pectina adicionada. Tabela 2 do NCHFP, que sobe o tempo justamente porque a água ferve mais frio lá em cima.',
    seaLevel: 'No nível do mar seriam',
    honesty:
      'Duas ressalvas honestas. A tabela do NCHFP é americana e o banho-maria é o método dela: Saunders esteriliza no forno e Ferber fecha o pote quente e vira — os três funcionam, e o NCHFP não endossa a inversão. E o ponto de gelificação depende de a mistura ter açúcar suficiente para chegar lá; com pouco açúcar, o termômetro sobe só depois de a fruta já ter cozinhado demais.',
  },

  brazil: {
    title: 'O que as fontes brasileiras acrescentam',
    lead: 'Duas publicações gratuitas da Embrapa fecharam três lacunas que esta pesquisa carregava declaradas: fruta de quintal brasileiro, dose de pectina em pó e janela de pH.',

    legalTitle: 'A régua da legislação',
    legalLead: 'A definição brasileira de geleia não fala de receita: fala de proporção entre partes de fruta e partes de açúcar, e de quanto sólido solúvel o produto tem de ter. É régua de rótulo industrial, e por isso pede mais açúcar do que qualquer receita de casa da estante.',
    legalColumns: {
      kind: 'Classe',
      parts: 'Fruta : açúcar',
      ratio: 'Açúcar sobre a fruta',
      solids: 'Sólidos solúveis, mínimo',
    },
    legalExtra: 'Extra',
    legalCommon: 'Comum',
    legalException: 'Comum de marmelo, laranja e maçã',
    legalNote:
      'Repare no encontro: os 65% de sólidos solúveis da geleia extra são exatamente os 65% de açúcar que Christine Ferber dá como ponto de conservação, e as duas fontes não se conhecem. É a segunda fonte independente que a conta de água a evaporar não tinha.',

    pectinTitle: 'A dose de pectina em pó',
    pectinBody:
      'De 0,5% a 1,5% em relação ao açúcar da formulação — a base é o açúcar, e é o detalhe que some numa leitura apressada. O documento se confere sozinho: das onze formulações pesadas que ele publica, dez caem dentro da própria faixa e a décima primeira erra por cinco centésimos de ponto. Onde cair dentro dela depende da pectina própria da fruta, e é para isso que a tabela abaixo serve.',

    phTitle: 'A janela de pH',
    phBody:
      'O gel se forma em torno de pH 3, e acima de pH 3,4 não se forma. Na geleia pronta o alvo é entre 3,0 e 3,2. Para quem tem fitinha ou peagâmetro há uma regra de bancada melhor que qualquer dose: meça a polpa antes de começar, e se ela já estiver entre 3,0 e 3,3 não acidifique. A dose de ácido por fruta continua sem fonte, e por isso continua fora da tela.',
    acidityBody:
      'A acidez total da geleia pronta deve ficar entre 0,5% e 0,8%. Acima de 1% ocorre sinérese, que é a geleia soltar líquido no pote — o mesmo defeito que o NCHFP já atribuía a ácido em excesso, agora com o limiar.',

    tableTitle: 'A Tabela 1, inteira',
    tableLead: 'Trinta e oito frutas classificadas em dois eixos. Está aqui na íntegra porque uma tabela recortada é uma tabela editada por nós, e porque a variedade importa: figo maduro e figo verde não estão na mesma linha, e não têm a mesma pectina.',
    tableColumns: {
      fruit: 'Fruta',
      pectin: 'Pectina',
      acidity: 'Acidez',
      origin: 'Origem da linha',
    },
    jackix: 'Jackix (1988)',
    torrezan: 'Embrapa',
    tableNote:
      'Trinta das trinta e oito linhas são de Jackix (1988) e a Embrapa as reproduz; a coluna de origem diz quais. Enquanto o livro de Jackix não chegar à estante, a citação dessas linhas é de terceira mão, e a tabela declara isso em vez de disfarçar.',

    brixTitle: 'A segunda tabela do ponto, esta em metros',
    brixLead: 'A Embrapa converte temperatura de ebulição em °Brix por altitude, em metros e em Celsius. Não é a mesma grandeza que a tabela americana — uma diz onde o gel se forma, a outra diz quando a calda chega a tal concentração —, e é justamente por isso que elas caírem tão perto uma da outra vale alguma coisa.',
    brixNote:
      'A 65 °Brix, interpolando entre as linhas de 64 e 66, a diferença para o que esta calculadora entrega fica abaixo de sete décimos de grau em toda a faixa. Reescrita como quanto o ponto fica acima da fervura ao nível do mar: NCHFP, 4,44 °C; Embrapa, 4,85 °C; Ferber, 5,00 °C. A tabela brasileira para nos 2.000 m, e acima disso a página mostra só a americana — extrapolar tabela alheia não é citar, é inventar.',
    brixHeader: '°Brix',
    thirdHand:
      'A própria Embrapa credita esta tabela a terceiro: "extraído de Curso de processamento de frutas".',
  },

  fresh: {
    notice: 'Geleia de uso imediato. O receituário do MMA cozinha esta a 65–70 °C, o suficiente para dissolver a pectina e bem longe do ponto de gelificação; não enche pote, não passa por banho-maria e não declara validade. Guarde na geladeira e coma nos próximos dias — nenhuma proporção desta página transforma isto em conserva de prateleira.',
    title: 'A geleia fresca, e por que ela não é conserva',
    body: 'O receituário de biodiversidade do Ministério do Meio Ambiente publica geleia pesada de fruta que nenhum livro de conserva da estante cobre: umbu, pitanga, maracujá-do-cerrado, maracujá-do-mato, pera-do-cerrado, jabuticaba e caju. São quantidades em grama, de publicação oficial e gratuita, e é o que faltava para essas frutas saírem da régua genérica da norma.',
    body2: 'O que elas não são é conserva. O modo de preparo para nos 65–70 °C, que é onde a pectina se dissolve — o ponto de gelificação fica trinta e cinco graus acima. Não há pote, não há banho-maria, e o livro não declara prazo. É componente de prato, e a página diz isso toda vez que uma dessas frutas é escolhida.',
    pectinNote: 'As quatro doses de pectina do receituário — 1,33%, 1,33%, 1,00% e 0,50% sobre o açúcar — caem todas dentro da faixa que a Embrapa publica. Terceira instituição, terceiro tipo de publicação, quatro em quatro.',
  },

  status: {
    source: 'A proporção da fonte',
    aboveSource: 'Acima da fonte',
    belowSource: 'Abaixo da fonte',
    sourceLabel: 'Receita citada',
    freshLabel: 'Receita do MMA',
    freshAboveBody: 'Mais açúcar do que o receituário pede para esta fruta. Conserva um pouco melhor na geladeira e gelifica mais fácil; continua não sendo conserva de prateleira, porque o que define isso aqui não é a proporção — é o processo, que não tem pote nem banho-maria.',
    freshBelowBody: 'Menos açúcar do que o receituário pede para esta fruta. Numa geleia de uso imediato isso não é risco de prateleira, porque prateleira não há: é textura e sabor, e a geleia vai ficar mais mole e menos doce. Continua valendo o mesmo: geladeira, e comer nos próximos dias.',
    normLabel: 'Geleia extra da norma',
    normSource: 'A proporção da norma',
    normAbove: 'Acima da norma',
    normBelow: 'Abaixo da norma',
    normAboveBody:
      'Mais açúcar do que a geleia extra da norma, o que é onde a maior parte da geleia industrial brasileira fica — a classe comum pede 60 partes de açúcar para 40 de fruta. Conserva mais e gelifica mais fácil; em compensação, açúcar demais é a causa que o NCHFP lista para cristais no pote.',
    normBelowBody:
      'Abaixo de um para um, que é a menor proporção que a legislação brasileira admite chamar de geleia. Não é aviso de segurança: é de categoria. O que muda de fato é a conservação — a norma fixa 62% de sólidos solúveis na geleia comum e 65% na extra, e Ferber chega ao mesmo 65% por outro caminho. Abaixo disso, trate como doce de geladeira: refrigerado, consumido em semanas.',
    aboveBody:
      'Mais açúcar do que a receita citada pede. Conserva melhor e gelifica mais fácil, mas o NCHFP lista o excesso de açúcar como causa de cristais, e Saunders avisa que "too much will mask the fruit flavor". Se a intenção é seguir Ferber, o número está certo — a régua dela é outra.',
    belowBody:
      'Menos açúcar do que a receita citada publica para esta fruta. O NCHFP é direto sobre isso: "Do not try to reduce the amount of sugar in traditional recipes. Too little sugar prevents gelling and may allow yeasts and molds to grow." Na prática, o que sai daqui é doce de geladeira: guarde refrigerado e consuma em até um mês, como o próprio NCHFP orienta para doces de açúcar reduzido. Não é conserva de prateleira, mesmo processado.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'A conta do açúcar é uma regra de três sobre o peso da fruta preparada, que é a base que Saunders manda usar. O que a calculadora tem de seu não é a álgebra: é de onde vem a proporção. Cada fruta carrega a receita publicada para ela, com página, e a proporção sai dessa receita — damasco a 0,42, morango a 0,65, framboesa a 1,00. Uma média dessas nove não seria fonte de ninguém.',
      'As receitas de Saunders estão em libras e onças, e nenhuma precisou ser convertida. Razão entre duas massas não tem unidade: 40 onças de açúcar para 62 de fruta são os mesmos 0,6452 em grama, em onça ou em arroba. Por isso o teste da calculadora consegue reproduzir a receita do livro linha a linha, sem nenhum fator de conversão no meio do caminho.',
      'O ponto de gelificação é a parte que não sai de nenhum livro pronta. O NCHFP publica uma tabela de temperatura por altitude, em pés e Fahrenheit, e a calculadora interpola essa tabela para a altitude que você informar. Curiosidade da fonte: o texto do NCHFP resume tudo como "subtract 2 degrees F" por mil pés, mas a tabela da mesma página cai só um grau entre 4.000 e 5.000 pés e fica um grau acima da regra daí para cima. A tabela é que está certa — a fervura da água não cai em linha reta com a altitude. Até 1.219 m as duas coincidem, o que cobre quase toda cidade brasileira grande.',
      'Essa divergência do NCHFP consigo mesmo incomodava, e desde setembro de 2026 há uma segunda fonte para resolvê-la. O Modernist Cuisine, vol. 1, escreve a mesma regra por outro caminho — 1 °C a cada 300 m — e a tabela americana fica a menos de meio grau dela em toda a faixa dos oito mil pés, inclusive onde o NCHFP discorda do próprio resumo. São um serviço de extensão agrícola e um livro de física de cozinha chegando à mesma curva: a diferença interna do NCHFP é de arredondamento, não de física, e interpolar a tabela continua sendo o certo.',
      'O mesmo livro ainda dá dois pontos medidos que servem de conferência. Denver, a 1.600 m, ferve entre 93 e 95 °C, e é onde a nossa curva cai. O cume do Everest ferve a 69 °C — quatro vezes acima do fim da tabela do NCHFP, onde o cálculo passa a estender a inclinação do último trecho, e ainda assim erra por menos de um grau. Não serve para fazer geleia; serve para saber que a extrapolação não é invenção.',
      'E ele explica o que o NCHFP só afirma: por que a geleia dá o ponto acima da fervura da água. Soluto dissolvido baixa a atividade de água, menos moléculas escapam e o ponto de ebulição sobe — é a elevação do ponto de ebulição. Água do mar, com 3,5% de sal, ferve a 103 °C; calda de bala, com 95% de açúcar, a 135–145 °C. Os 104,4 °C da geleia caem exatamente onde uma calda a 65% de sólidos deveria cair entre os dois.',
      'Fruta brasileira entra por outro caminho, e o caminho está dito na tela. Goiaba, jabuticaba e maracujá não têm receita pesada em nenhuma obra da estante — o que existe é a Tabela 1 da Embrapa, que classifica 38 frutas por pectina e acidez em dois eixos separados, e a definição legal brasileira, que fixa a proporção em partes de fruta para partes de açúcar. Então a classificação vem de uma fonte e a proporção de outra, e a página nomeia as duas. O que a Embrapa não publica — rendimento em potes, validade, dose de limão — simplesmente não aparece para essas frutas, em vez de ser emprestado de uma fruta que nada tem a ver.',
      'A água a evaporar é a única estimativa da página, e ela combina dois números de Ferber: os 65% de açúcar do produto conservado e os 10% a 15% que a fruta já traz. Sai como faixa porque o segundo número é faixa. Serve para uma coisa só, mas importante: mostrar por que geleia de pouco açúcar cozinha muito mais tempo. Com menos açúcar, mais água precisa sair para chegar aos mesmos 65% — e é aí que a fruta se desfaz. Desde setembro de 2026 esse 65% deixou de ser número de fonte única: é também o mínimo de sólidos solúveis que a legislação brasileira exige da geleia extra, escrito em 1988 sem conhecer Ferber.',
    ],
  },

  divergence: {
    title: 'Quando as fontes divergem',
    lead: 'Três livros, duas agências oficiais, e sete desacordos que valem conhecer.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Temperatura do ponto',
        sources:
          'Ferber: 105 °C. Saunders: 220 °F, que são 104,4 °C. NCHFP: 8 °F acima de onde a água ferve, com tabela por altitude.',
        decision:
          'Calcula pela altitude, sempre. Os dois primeiros são o mesmo ponto medido no nível do mar; só o terceiro se muda de cidade junto com você.',
      },
      {
        topic: 'Quanto açúcar',
        sources:
          'Ferber escreve "un poids de sucre plus ou moins égal à celui du fruit", mas 93 das 218 receitas dela usam 800 g por quilo. Saunders varia de 0,42 a 1,00 conforme a fruta.',
        decision:
          'Usa a receita citada para aquela fruta, e oferece os 0,80 medidos de Ferber ao lado. A prosa dela e a bancada dela não batem, e isso está dito.',
      },
      {
        topic: 'Como fechar o pote',
        sources:
          'NCHFP: banho-maria, 5 a 15 min conforme a altitude. Saunders: forno a 250 °F. Ferber: enche até a borda, fecha quente e vira o pote.',
        decision:
          'Informa o tempo do NCHFP, que é o único com tabela por altitude, e diz que os outros dois métodos são dos autores citados. O NCHFP não endossa a inversão.',
      },
      {
        topic: 'Geleia de livro de prato e geleia de conserva',
        sources:
          'O receituário do MMA publica geleias entre 0,40 e 0,77 de açúcar sobre a fruta. A legislação brasileira exige no mínimo 1,00 para chamar o produto de geleia extra, e Saunders trabalha entre 0,42 e 1,00 em receitas que vão a pote.',
        decision:
          'Mostra as três réguas e diz que medem produtos diferentes. Um livro do Ministério do Meio Ambiente publica como geleia o que a norma de rótulo não deixaria — e está certo, porque a dele se come no dia. A calculadora entrega a proporção da fonte que cobre aquela fruta, com o aviso que aquela fonte justifica.',
      },
      {
        topic: 'Quanto açúcar, de novo: receita ou norma',
        sources:
          'Saunders vai de 0,42 a 1,00 de açúcar sobre a fruta. Ferber usa 0,80. A legislação brasileira exige no mínimo 1,00 para chamar o produto de geleia extra, e 1,50 na geleia comum.',
        decision:
          'Mostra as duas réguas e diz que medem coisas diferentes. A norma classifica produto industrial rotulado; Saunders e Ferber escrevem receita de casa. Nenhuma das duas está errada, e o site não escolhe uma calada.',
      },
      {
        topic: 'Onde o gel se forma, em metro e em Celsius',
        sources:
          'NCHFP: 8 °F acima da fervura, com tabela em pés e Fahrenheit. Embrapa: tabela de ebulição por °Brix, em metros e Celsius, até 2.000 m. Ferber: 105 °C.',
        decision:
          'Calcula pela tabela do NCHFP, que é a que vai mais alto, e publica a tabela brasileira ao lado como conferência. As duas caem a menos de sete décimos de grau uma da outra em toda a faixa comum, sem uma conhecer a outra.',
      },
      {
        topic: 'Duas classificações de fruta',
        sources:
          'NCHFP: três grupos num eixo só, que mistura falta de ácido com falta de pectina ("acid, pectin or both"). Embrapa: dois eixos separados, pectina e acidez, em três níveis cada.',
        decision:
          'Mostra a que a fonte daquela fruta publica, e as duas quando existem as duas. Traduzir uma na outra seria inventar equivalência que nenhuma das duas afirma. Nas três frutas em que elas se encontram — morango, pêssego maduro e figo maduro — concordam.',
      },
      {
        topic: 'Pectina da goiaba',
        sources:
          'NCHFP põe a goiaba no grupo III, "always needs added acid, pectin or both". McGee diz que os espanhóis exploraram a alta pectina dela para fazer marmelada do Novo Mundo.',
        decision:
          'Entrega goiaba desde setembro de 2026, e entrega porque a Embrapa desempatou: "goiaba vermelha, madura e de vez — pectina rica, acidez média". O grupo III do NCHFP é "ácido, pectina ou ambos", e a leitura de que falta ácido e não pectina deixou de ser suposição.',
      },
    ],
  },

  glossary: {
    title: 'Glossário',
    full: 'Ver no glossário',
    noSource:
      'Sem fonte na nossa bibliografia: a definição descreve a prática corrente, e nenhuma obra da estante a sustenta.',
    anchor: 'Endereço deste verbete',
    terms: {
      'prepared-fruit': {
        term: 'Fruta preparada',
        definition:
          'O peso que vale para a conta: a fruta já descascada, sem caroço e cortada, com o suco que soltou. Não é o peso da compra, e a diferença é grande — a receita de pêssego de Saunders parte de 6,5 libras na feira para chegar a 5,5 preparadas.',
      },
      'setting-point': {
        term: 'Ponto de gelificação',
        definition:
          'A temperatura em que a mistura, deixada esfriar sem mexer, forma gel. Não é um número fixo: são cerca de 4,4 °C acima de onde a água ferve no lugar onde se cozinha, o que muda com a altitude.',
      },
      nappe: {
        term: 'Nappé',
        definition:
          'O nome francês do mesmo ponto, testado sem termômetro: a calda cobre as costas da colher com uma película que não escorre. "Vérifiez la nappe", escreve Ferber ao fim de quase toda receita.',
      },
      sheeting: {
        term: 'Teste da folha',
        definition:
          'Mergulha-se uma colher de metal fria e observa-se como a calda cai. Enquanto pinga em gotas separadas, falta; quando duas gotas se juntam e escorrem como uma folha pela borda, chegou.',
      },
      'freezer-test': {
        term: 'Teste do congelador',
        definition:
          'Colheres de metal esperam no congelador desde antes do fogo. Põe-se meia colherada da geleia numa delas, volta ao congelador por três ou quatro minutos e inclina-se: se não corre, está pronta.',
      },
      pectin: {
        term: 'Pectina',
        definition:
          'A substância da parede celular da fruta que forma a rede do gel. Precisa de açúcar e de ácido para funcionar, e está no auge na fruta no ponto — a verde e a passada não gelificam.',
      },
      'pectin-group': {
        term: 'Grupo de pectina',
        definition:
          'A classificação oficial das frutas em três grupos, conforme tenham pectina e ácido próprios (I), possam precisar de um dos dois (II) ou sempre precisem de ácido, pectina ou ambos (III). É a régua americana, e tem um eixo só: o grupo III não diz o que falta. A brasileira separa os dois eixos.',
      },
      'embrapa-table': {
        term: 'Tabela 1 da Embrapa',
        definition:
          'A classificação brasileira: 38 frutas em dois eixos independentes, pectina (rica, média, pobre) e acidez (alta, média, baixa). É o que permite dizer da goiaba que sobra pectina e falta ácido, coisa que o grupo III americano não distingue. Trinta das linhas são reproduzidas de Jackix (1988).',
      },
      'legal-jam': {
        term: 'Geleia comum e geleia extra',
        definition:
          'As duas classes da legislação brasileira de alimentos, definidas por proporção: extra é cinquenta partes de fruta para cinquenta de açúcar, comum é quarenta para sessenta. Marmelo, laranja e maçã podem ir a trinta e cinco por sessenta e cinco. É régua de rótulo industrial, não de receita de casa — e por isso pede mais açúcar que os livros.',
      },
      'soluble-solids': {
        term: 'Sólidos solúveis',
        definition:
          'Quanto do produto pronto é matéria dissolvida, quase toda açúcar, medida em grau Brix com um refratômetro. A norma brasileira exige no mínimo 62% na geleia comum e 65% na extra; Ferber chega aos mesmos 65% chamando de "teor de açúcar". É o número que decide se a geleia se conserva fora da geladeira.',
      },
      'apple-jelly': {
        term: 'Gelatina de maçã',
        definition:
          'Pectina emprestada de outra fruta em vez de comprada em pó. Ferber usa 200 g por quilo nas frutas que não gelificam sozinhas — pera, cereja e ginja, entre outras — e em geleias de fruta vermelha aceita gelatina de groselha no lugar.',
      },
      syneresis: {
        term: 'Sinérese',
        definition:
          'A geleia soltar líquido no pote depois de pronta. As causas que o NCHFP lista são ácido em excesso, que deixa a pectina instável, e armazenamento quente ou com temperatura oscilando. A Embrapa dá o limiar que faltava: acima de 1% de acidez total na geleia pronta, a sinérese ocorre.',
      },
      marmalade: {
        term: 'Marmelada e marmalade',
        definition:
          'Duas coisas diferentes com a mesma origem. A palavra é portuguesa e nomeava a pasta de marmelo; em inglês, marmalade virou a geleia translúcida com casca de cítrico em suspensão, depois que a laranja-amarga substituiu o marmelo no século XVIII.',
      },
    },
  },


  audit: {
    title: 'Confira a geleia que você já faz',
    lead: 'Escolha a fruta, pese o que foi para a panela e veja como a sua proporção se compara com a que a fonte publica para aquela fruta. Cada fruta tem a sua régua, e a tela diz qual delas respondeu.',

    fruitLabel: 'Fruta da sua geleia',
    fruit: 'Fruta preparada',
    fruitHint: 'Já descascada, sem caroço e cortada: é o peso que entra na panela.',
    sugar: 'Açúcar que você usou',
    pectin: 'Pectina em pó',
    pectinHint: 'Deixe em zero se a sua geleia não leva pectina em pó.',

    sugarRatio: 'Açúcar por grama de fruta',
    pectinPercent: 'Pectina sobre o açúcar',
    sugarSubject: 'o açúcar',
    pectinSubject: 'a pectina',

    basis: {
      recipe: 'A comparação é com a receita pesada que a fonte publica para esta fruta.',
      fresh: 'Esta fruta não tem receita de conserva em nenhuma obra da estante: a comparação é com a receita fresca do receituário do MMA, que é doce de consumo imediato, não conserva de prateleira.',
      norm: 'Nenhuma obra da estante publica receita pesada para esta fruta. A comparação é com o mínimo legal de geleia extra — régua de rótulo, não receita testada.',
    },
  },
  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Dois livros de conserva, um McGee, uma agência americana e duas publicações da Embrapa. As proporções saem das receitas pesadas de Saunders e da proporção da casa de Ferber; a temperatura por altitude e as regras de conservação, do NCHFP; a fruta brasileira, a régua legal, a dose de pectina e a janela de pH, da Embrapa.',
    page: 'p.',
    section: 'seção',
  },
};
