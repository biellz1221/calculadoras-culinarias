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

  sugarLevels: {
    source: 'A da receita',
    ferber: 'Ferber (80%)',
    custom: 'Escolher',
    sourceNote:
      'A proporção que o Blue Chair Jam Cookbook publica para esta fruta, sobre o peso da fruta preparada. Cada fruta tem a sua, e é isso que uma média esconderia.',
    ferberNote:
      'A proporção da casa de Christine Ferber: 800 g de açúcar por quilo de fruta. É o valor de 93 das 218 receitas do livro dela, o mais frequente de longe.',
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

  status: {
    source: 'A proporção da fonte',
    aboveSource: 'Acima da fonte',
    belowSource: 'Abaixo da fonte',
    sourceLabel: 'Receita citada',
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
      'A água a evaporar é a única estimativa da página, e ela combina dois números de Ferber: os 65% de açúcar do produto conservado e os 10% a 15% que a fruta já traz. Sai como faixa porque o segundo número é faixa. Serve para uma coisa só, mas importante: mostrar por que geleia de pouco açúcar cozinha muito mais tempo. Com menos açúcar, mais água precisa sair para chegar aos mesmos 65% — e é aí que a fruta se desfaz.',
    ],
  },

  divergence: {
    title: 'Quando as fontes divergem',
    lead: 'Três livros, uma agência oficial, e quatro desacordos que valem conhecer.',
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
        topic: 'Pectina da goiaba',
        sources:
          'NCHFP põe a goiaba no grupo III, "always needs added acid, pectin or both". McGee diz que os espanhóis exploraram a alta pectina dela para fazer marmelada do Novo Mundo.',
        decision:
          'Não entrega goiaba. O grupo III é "ácido, pectina ou ambos", e nenhuma fonte separa os dois casos — a leitura provável é que falte ácido, não pectina, mas provável não vira número na tela.',
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
          'A classificação oficial das frutas em três grupos, conforme tenham pectina e ácido próprios (I), possam precisar de um dos dois (II) ou sempre precisem de ácido, pectina ou ambos (III).',
      },
      'apple-jelly': {
        term: 'Gelatina de maçã',
        definition:
          'Pectina emprestada de outra fruta em vez de comprada em pó. Ferber usa 200 g por quilo nas frutas que não gelificam sozinhas — pera, cereja e ginja, entre outras — e em geleias de fruta vermelha aceita gelatina de groselha no lugar.',
      },
      syneresis: {
        term: 'Sinérese',
        definition:
          'A geleia soltar líquido no pote depois de pronta. As causas que o NCHFP lista são ácido em excesso, que deixa a pectina instável, e armazenamento quente ou com temperatura oscilando.',
      },
      marmalade: {
        term: 'Marmelada e marmalade',
        definition:
          'Duas coisas diferentes com a mesma origem. A palavra é portuguesa e nomeava a pasta de marmelo; em inglês, marmalade virou a geleia translúcida com casca de cítrico em suspensão, depois que a laranja-amarga substituiu o marmelo no século XVIII.',
      },
    },
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Dois livros de conserva, uma agência oficial e um McGee. As proporções saem das receitas pesadas de Saunders e da proporção da casa de Ferber; a classificação das frutas, a temperatura por altitude e as regras de conservação saem do NCHFP.',
    page: 'p.',
    section: 'seção',
  },
};
