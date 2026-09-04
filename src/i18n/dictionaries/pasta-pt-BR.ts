export const pastaPtBR = {
  meta: {
    title: 'Calculadora de massa fresca',
    description:
      'Quanta farinha e quantos ovos para as pessoas à mesa: 13 massas em gramas, ajuste para ovo fora do padrão e espessura por formato, tudo citado.',
    keywords: [
      'calculadora de massa fresca',
      'quantos ovos por pessoa massa',
      'massa fresca caseira',
      'farinha 00 para massa',
      'massa de sêmola sem ovo',
      'espessura da massa por formato',
      'tagliatelle caseiro',
      'massa fresca em gramas',
    ],
    imageAlt:
      'Cartão da calculadora de massa fresca, com o título e as obras que sustentam os números.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quantos ovos por pessoa na massa fresca?',
        answer:
          'Um ovo e 100 g de farinha por pessoa, na massa clássica ao ovo. É a receita do Zielonka escalada: 300 g de farinha 00 com 3 ovos rendem 400 g de massa e servem quatro.',
      },
      {
        question: 'Quanta massa fresca por pessoa?',
        answer:
          'Cerca de 100 g de massa crua como prato principal. De entrada, 85 g; numa porção generosa, 115 g. Os três números saem das receitas do Zielonka e da Hazan, não de arredondamento.',
      },
      {
        question: 'E se o meu ovo não tem 50 g?',
        answer:
          'Informe o peso real e a farinha acompanha sozinha. O que a receita fixa é a razão entre ovo e farinha, não o número de ovos: ovo maior pede mais farinha para a massa ficar no mesmo ponto.',
      },
      {
        question: 'Dá para fazer massa fresca sem ovo?',
        answer:
          'Dá. Sêmola e água é massa tradicional do sul da Itália, e a calculadora traz também as versões veganas de espinafre e de beterraba, além de uma massa sem glúten com farinha de grão-de-bico.',
      },
    ],
  },

  eyebrow: 'Calculadora de massa fresca',
  title: 'Massa fresca para o número de pessoas à mesa',
  lead: 'Diga quantas pessoas vão comer e a receita sai em gramas de farinha e em ovos inteiros. Ovo não se corta ao meio: a calculadora sugere a combinação mais próxima e mostra quanto de farinha isso muda.',

  presetLabel: 'Tipo de massa',

  presets: {
    classica: 'Clássica ao ovo',
    'rica-em-gemas': 'Rica em gemas',
    'hazan-amarela': 'Amarela (Hazan)',
    'hazan-recheada': 'Para recheio (Hazan)',
    'hazan-verde': 'Verde de espinafre (Hazan)',
    'hazan-tortellini': 'Tortellini (Hazan)',
    'semola-vegana': 'Sêmola e água (vegana)',
    'espinafre-ovo': 'Espinafre ao ovo',
    'espinafre-vegana': 'Espinafre vegana',
    'beterraba-ovo': 'Beterraba ao ovo',
    'beterraba-vegana': 'Beterraba vegana',
    'tinta-de-lula': 'Tinta de lula',
    'sem-gluten': 'Sem glúten (grão-de-bico)',
  },

  families: {
    egg: 'Massa ao ovo',
    vegan: 'Massa de água',
    'gluten-free': 'Sem glúten',
  },

  ingredients: {
    'flour-00': 'Farinha 00',
    'flour-all-purpose': 'Farinha de trigo comum',
    'flour-semolina-fine': 'Sêmola fina',
    'flour-chickpea': 'Farinha de grão-de-bico',
    egg: 'Ovo',
    'egg-yolk': 'Gema',
    water: 'Água',
    milk: 'Leite',
    spinach: 'Espinafre branqueado e espremido',
    'spinach-liquid': 'Líquido de espinafre',
    'beetroot-juice': 'Suco de beterraba',
    'squid-ink': 'Tinta de lula',
  },

  target: {
    label: 'Quantas pessoas',
    servings: 'Pessoas',
    styleLabel: 'Contexto da refeição',
    styles: {
      starter: 'Entrada',
      main: 'Prato principal',
      generous: 'Porção generosa',
    },
    gramsPerServing: 'Massa por pessoa (g)',
    eggWeight: 'Peso de um ovo sem casca (g)',
    eggHint: 'O padrão são 50 g, o ovo médio das receitas. Pese o seu se quiser precisão.',
    yolkWeight: 'Peso de uma gema (g)',
  },

  result: {
    title: 'O que pesar',
    flour: 'Farinha',
    flourMax: 'Farinha até o ponto',
    eggs: 'Ovos',
    yolks: 'Gemas',
    units: 'un',
    yieldLabel: 'Rende',
    yieldNote:
      'O rendimento é o que a fonte publica. A soma das parcelas costuma ficar um pouco acima, porque parte da farinha fica na bancada e no polvilho.',
    servings: 'Serve',
    servingsUnit: 'pessoas',
    pieces: 'Peças recheadas',
    water: 'Água para cozinhar',
    litres: 'L',
    cookTime: 'Cozimento',
    minutes: 'min',
    adjustment: {
      ideal: 'A escala pediria',
      eggsWord: 'ovos',
      more: 'com a combinação inteira mais próxima, a farinha sobe',
      less: 'com a combinação inteira mais próxima, a farinha cai',
      exact: 'A escala fecha em ovo inteiro: nada a ajustar na farinha.',
    },
  },

  table: {
    caption: 'Receita calculada',
    ingredient: 'Ingrediente',
    amount: 'Quantidade',
    prep: 'a partir de',
    absorb: 'mais até',
    absorbHint:
      'A Hazan publica a farinha inicial e manda incorporar mais durante a sova, até a massa não grudar no polegar. O segundo número é onde isso costuma parar.',
  },

  balance: {
    title: 'Balanço da massa',
    servingSize: 'Massa por pessoa',
    flourPerEggMass: 'Farinha por grama de ovo',
    hydration: 'Hidratação',
    withAbsorb: 'Depois da farinha incorporada na sova',
    recommended: 'Faixa das fontes',
    status: { below: 'Abaixo da faixa', in: 'Na faixa', above: 'Acima da faixa' },
    hardLimit: 'Fora do limite das fontes',
    colourNote:
      'Nas massas coloridas o purê entra no lugar de parte do ovo e a própria fonte já corrigiu a farinha: 250 g na de espinafre, 320 g na de tinta de lula. Por isso a razão farinha:ovo não vale aqui.',
  },

  notes: {
    servingGrams:
      'Abaixo de 85 g por pessoa a massa é entrada; acima de 115 g é porção de domingo. As duas fontes trabalham dentro dessa faixa.',
    flourPerEggMass:
      'Menos farinha por grama de ovo dá massa mole, que gruda no cilindro e pede farinha durante a sova. É assim que a Hazan trabalha, de propósito. Mais farinha dá massa dura, que racha na hora de abrir.',
    waterHydration:
      'Massa de sêmola e água vive entre 46 e 50% de hidratação. Abaixo disso ela não fecha; acima, gruda na máquina e não segura o formato.',
  },

  process: {
    title: 'Preparo, segundo a fonte',
    ribbons: 'Fitas: pare no setting 7',
    filled: 'Recheadas: pare no setting 8',
    unsuitableFilled:
      'Esta massa não fecha raviólo: sem glúten ela esfarela na dobra. Use em fitas.',
    notes: {
      classica:
        'Sove de 8 a 10 minutos à mão. Descanse no mínimo 30 minutos na geladeira, de preferência a noite inteira, e tire 30 minutos antes de abrir.',
      'rica-em-gemas':
        'As gemas dão cor dourada e massa mais maleável na sova, um pouco mais seca na hora de abrir.',
      'hazan-amarela':
        'A farinha da lista é só o começo: incorpore mais durante a sova até a massa não grudar mais no polegar. Sove 8 minutos completos e descanse de 15 minutos a 2 horas em temperatura ambiente.',
      'hazan-recheada':
        'A meia colher de leite mantém a massa macia e pegajosa: é essa aderência que sela o raviólo. Abra uma porção por vez e não deixe secar antes de fechar.',
      'hazan-verde':
        'Espinafre cozido, espremido e picado à faca: o processador extrai umidade demais. A farinha já sobe para 1½ cup por causa da água do espinafre.',
      'hazan-tortellini':
        'Rende cerca de 200 tortellini. Conte 17 por pessoa em caldo e 24 com molho, e feche uma tira por vez, com a massa ainda macia.',
      'semola-vegana':
        'Sova de 10 a 15 minutos e cozimento de 5 a 6 minutos. Hazan desaconselha sêmola em casa: com rolo é luta quase perdida, então conte com máquina ou com braço.',
      'espinafre-ovo':
        'Branqueie o espinafre de 30 a 45 segundos, esprema bem e bata com 1 ovo: o purê precisa pesar de 100 a 110 g na balança. Ele é o líquido da massa, e o ovo já está dentro dele.',
      'espinafre-vegana':
        'Bata o espinafre branqueado com 150 g de água e coe. Pese de 140 a 150 g do líquido verde e complete com água se faltar.',
      'beterraba-ovo':
        'Bata a beterraba crua com 60 g de água e coe; pese 40 g do suco. Cozida como fita ela fica rosada. O forte dessa massa é recheada ou listrada.',
      'beterraba-vegana':
        'Bata a beterraba crua com 140 g de água, coe e pese 150 g do líquido.',
      'tinta-de-lula':
        'A tinta é líquido a mais, por isso a farinha sobe de 300 para 320 g. Hazan rejeita tinta de lula na massa; a receita é do Zielonka.',
      'sem-gluten':
        'Só para massas de fita: sem glúten a massa esfarela ao fechar um raviólo.',
    },
  },

  shapes: {
    title: 'Onde parar de abrir a massa',
    lead: 'A numeração é a da máquina do Zielonka, em que 0 é o cilindro mais aberto e 8 o mais fechado. Máquinas invertidas pedem o número contrário. Nenhum dos dois livros publica espessura em milímetros, então aqui também não há.',
    columns: { shape: 'Formato', setting: 'Abertura', use: 'Para que serve' },
    setting: 'Setting',
    or: 'ou',
    noSetting: 'Sem setting próprio',
    divergent: 'As fontes divergem',
    items: {
      tagliatelle: {
        name: 'Tagliatelle',
        thickness:
          'Duas passadas em cada nível até o 7. Hazan corta à mão em fitas de ~6 mm; o cortador largo da máquina dá fettuccine, um pouco mais estreita.',
        use: 'A fita bolonhesa clássica, para ragu e molhos encorpados.',
      },
      pappardelle: {
        name: 'Pappardelle',
        thickness:
          'Mesmo 7 das outras fitas. Zielonka corta 3 cm de largura por 15–20 cm de comprimento; Hazan faz 2,5 × 15 cm com carretilha frisada, porque a máquina não tem cortador para isso.',
        use: 'Fita larga para molhos de carne e de caça.',
      },
      chitarra: {
        name: 'Chitarra / tonnarelli',
        thickness:
          'Zielonka para no 7, ou no 6 para mais mordida. Hazan manda parar no penúltimo nível e igualar a espessura da folha à largura do cortador: o fio tem que sair quadrado.',
        use: 'Fita de seção quadrada, no cortador estreito ou na própria chitarra.',
      },
      garganelli: {
        name: 'Garganelli',
        thickness:
          'Folha no 7, macia e recém-aberta. Quadrados de 4 cm enrolados no pente sobre um bastão de ~6 mm.',
        use: 'Tubo caneludo, que segura molho por dentro e por fora.',
      },
      ravioli: {
        name: 'Ravioli e triangoli',
        thickness:
          'Setting 8, o mais fino: a massa dobra sobre si mesma e duas folhas somam o dobro da espessura.',
        use: 'Recheados quadrados; a faixa sai com o dobro da largura do raviólo.',
      },
      tortellini: {
        name: 'Tortellini e cappelletti',
        thickness:
          'Setting 8. Quadrados de ~4 cm com ¼ de colher de chá de recheio, dobrados em triângulo e fechados em anel.',
        use: 'Em caldo ou com molho; na Romagna o mesmo formato se chama cappelletti.',
      },
      lasagne: {
        name: 'Lasanha',
        thickness:
          'Zielonka para no 7 e branqueia as folhas 30 segundos antes de montar. Hazan abre o mais fino que a massa conseguir chegar, em tiras de 25 cm, e monta no mínimo 6 camadas.',
        use: 'Folhas cortadas no tamanho da forma.',
      },
      maltagliati: {
        name: 'Maltagliati',
        thickness:
          'Não tem setting próprio: são as aparas do que você já abriu, cortadas em losangos irregulares.',
        use: 'Sopas de feijão e minestrone, "mal cortados" de propósito.',
      },
    },
  },

  dishes: {
    title: 'Rendimento de prato montado',
    lead: 'Lasanha e massa recheada não seguem os gramas por pessoa da fita: uma divide a mesma folha em camadas, a outra se conta em peças.',
    columns: { dish: 'Prato', amount: 'Massa', servings: 'Porções' },
    pieces: 'peças',
    items: {
      lasagneZielonka: {
        name: 'Lasanha (Zielonka)',
        note: '1½ receita da massa clássica para uma forma de 26 × 20 cm; folhas branqueadas 30 s e resfriadas em água gelada.',
      },
      lasagneHazan: {
        name: 'Lasanha verde (Hazan)',
        note: 'Massa verde de 2 ovos numa forma de 23 × 30 cm, com no mínimo 6 camadas.',
      },
      tortelliniHazan: {
        name: 'Tortellini in brodo (Hazan)',
        note: 'Cerca de 100 tortellini com 2,5 L de caldo, ou ~17 por pessoa. Com molho, conte 24 por pessoa.',
      },
    },
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Cada preset, cada faixa e cada espessura acima sai de uma destas obras, no capítulo indicado. Os três livros são EPUB, sem paginação física.',
    page: 'p.',
    section: 'cap.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'A conta começa no ovo, não na farinha. A massa clássica do Zielonka são 300 g de farinha 00 para 3 ovos, que rendem 400 g e servem 4, ou seja, 100 g de farinha e 1 ovo por pessoa. Escolhido o número de pessoas e o contexto da refeição, a calculadora escala essa receita e devolve tudo em gramas.',
      'O problema é que ovo não se corta ao meio. Para 6 pessoas a escala pediria 4,5 ovos, então a calculadora sugere a combinação inteira mais próxima (no empate, a maior, porque sobrar massa é menos ruim do que faltar) e mostra quanto de farinha isso muda. Se o seu ovo não tem 50 g, informe o peso real: a farinha acompanha, porque o que a receita fixa é a razão entre os dois.',
      'Essa razão é o número que as fontes disputam. Zielonka nasce em 2 g de farinha por grama de ovo; o Ratio manda 1,5×; a Hazan começa em 1,4 e sobe até ~2,4 incorporando farinha durante a sova. Nas massas coloridas nada disso se aplica: ali o purê é o líquido, pesado na balança, e a fonte já corrigiu a farinha.',
    ],
  },

  divergence: {
    title: 'Quando as fontes discordam',
    lead: 'Os três livros desta calculadora não concordam em quase nada de quantidade. Onde houve escolha, ela está explicada aqui.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Farinha por ovo',
        sources:
          'Zielonka: 100 g de farinha 00 por ovo médio (300 g para 3). Ruhlman: farinha igual a 1,5× o peso dos ovos. Hazan: 1 cup para 2 ovos, mas mandando incorporar farinha até o teste do polegar sair limpo.',
        decision:
          'Padrão de 100 g por ovo. É a regra italiana clássica e a única que já nasce fechada em gramas. A da Hazan é úmida de propósito, para ser corrigida na bancada, e o rendimento que ela mesma declara (¾ lb) só fecha com bem mais farinha do que a da lista.',
      },
      {
        topic: 'Massa por pessoa',
        sources:
          'Zielonka usa 100 g em todas as receitas (400 g servem 4). Hazan tira 3 porções padrão de ¾ lb (~113 g) ou 4 de entrada (~85 g).',
        decision:
          'Prato principal em 100 g, com entrada em 85 g e porção generosa em 115 g. O número redondo do Zielonka fica no meio da faixa da Hazan, então não há o que escolher: os três valores convivem.',
      },
      {
        topic: 'Massa colorida',
        sources:
          'Zielonka dá espinafre, beterraba e tinta de lula com o líquido pesado em gramas. Hazan só aceita espinafre e chama a tinta de lula de deplorável.',
        decision:
          'Seguimos Zielonka, porque é o único que quantifica o ajuste: 40 g de suco de beterraba, 140 a 150 g de líquido de espinafre, farinha a 320 g na tinta. A objeção da Hazan é de gosto, não de técnica, e fica registrada como nota.',
      },
      {
        topic: 'Sêmola em casa',
        sources:
          'Zielonka faz massa vegana com sêmola fina e água a 46%. Hazan desaconselha: costuma vir granulosa e abrir com rolo é luta quase sem esperança. "Deixe a sêmola para as fábricas".',
        decision:
          'A massa de sêmola fica, com o aviso. A crítica dela é sobre abrir com rolo; com máquina, ou com sova longa, a receita funciona. Farinha 00 e trigo comum, essas sim, entram uma pela outra a peso igual.',
      },
      {
        topic: 'Descanso e conservação',
        sources:
          'Zielonka descansa na geladeira (30 min a uma noite) e congela por até 2 semanas. Hazan descansa em temperatura ambiente (15 min a 2 h) e seca por 24 h para guardar semanas, condenando plástico e geladeira.',
        decision:
          'Mostramos as duas. Massa fria é mais dura de esticar, então quem refrigera deve tirar 30 minutos antes de abrir; quem vai abrir logo pode deixar na bancada.',
      },
    ],
  },

  glossary: {
    title: 'Glossário',
    full: 'Ver no glossário',
    noSource: 'Sem fonte na nossa bibliografia: a definição descreve a prática corrente, e nenhuma obra da estante a sustenta.',
    anchor: 'Endereço deste verbete',
    terms: {
      'flour-00': {
        term: 'Farinha 00',
        definition:
          'Farinha italiana finíssima, moída duas vezes, quase com a textura de açúcar de confeiteiro. Dá massa lisa e maleável; troca-se por trigo comum a peso igual.',
      },
      'fine-semolina': {
        term: 'Sêmola fina',
        definition:
          'Sêmola de trigo duro em moagem fina, o equivalente da 00 no trigo duro. É a base da massa vegana com água, na Itália vendida como semola rimacinata.',
      },
      'coarse-semolina': {
        term: 'Sêmola grossa',
        definition:
          'Só para polvilhar bandeja e massa formada, evitando que grude. Peneirada, dá para reutilizar três ou quatro vezes.',
      },
      'lamination': {
        term: 'Laminação',
        definition:
          'Afinar a massa fechando um nível de cada vez. Não é só apertar: é o afinamento gradual, somado à sova, que dá corpo e estrutura à massa.',
      },
      'matterello': {
        term: 'Matterello',
        definition:
          'O rolo longo do método manual. A massa é esticada, não comprimida, e ganha superfície texturizada que suga o molho. É ofício que pede prática.',
      },
      'stuffing-dough': {
        term: 'Massa para recheio',
        definition:
          'Massa usada macia e pegajosa, recém-aberta, uma porção por vez. A aderência é o que sela o raviólo; massa seca não fecha.',
      },
      'tonnarelli': {
        term: 'Tonnarelli',
        definition:
          'Fita de seção quadrada, tão espessa quanto larga, cortada no cortador estreito ou na chitarra, o bastidor de cordas que lembra um cortador de ovos antigo.',
      },
      'maltagliati': {
        term: 'Maltagliati',
        definition:
          '"Mal cortados": as aparas de massa em losangos irregulares, guardadas para sopas de feijão e minestrone.',
      },
      'al-dente': {
        term: 'Al dente',
        definition:
          'Firme à mordida. Massa fresca nunca fica tão firme quanto a seca de fábrica, mas deve sempre oferecer alguma resistência.',
      },
      'bronze-die': {
        term: 'Trafilata al bronzo',
        definition:
          'Massa seca extrudada em matriz de bronze, de superfície áspera e porosa, que segura o molho muito melhor que a de matriz de teflon.',
      },
    },
  },
};
