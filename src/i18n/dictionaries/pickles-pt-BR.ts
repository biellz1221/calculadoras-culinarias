export const picklesPtBR = {
  meta: {
    title: 'Calculadora de sal para picles',
    description:
      'Quanto sal na salmoura, no chucrute e no picles de vinagre, com a faixa segura de cada preparo e a acidez mínima da conserva rápida. Tudo citado.',
    keywords: [
      'calculadora de salmoura',
      'quanto sal para fermentar legumes',
      'porcentagem de sal na fermentação',
      'chucrute caseiro',
      'picles de vinagre',
      'lactofermentação',
      'salmoura 2 por cento',
      'acidez do picles',
    ],
    imageAlt:
      'Cartão da calculadora de picles e fermentação, com o título e as obras que sustentam os números.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quanto sal para fermentar legumes?',
        answer:
          'Dois por cento do peso total do pote, vegetais e água somados. Num pote com 1 kg de couve-flor e 1 litro de água, são 40 g de sal. É o padrão do Noma e do Fermentação à Brasileira.',
      },
      {
        question: 'Os 2% são sobre a água ou sobre o pote todo?',
        answer:
          'As duas leituras circulam nos livros, e confundir uma com a outra dobra ou corta pela metade o sal. Katz calcula sobre a água, 5% para pepino; Noma e Fermentação à Brasileira calculam sobre o conteúdo total, 2%. A calculadora mostra sempre os dois números da mesma salmoura.',
      },
      {
        question: 'Quanta acidez precisa o picles de vinagre?',
        answer:
          'O líquido de cobertura precisa ficar em pelo menos 2,5% de ácido acético, que é o que a proporção de uma parte de vinagre de 5% para uma de água produz. Nenhum dos três livros fixa esse piso, então ele vem da orientação oficial de conservas do NCHFP.',
      },
      {
        question: 'Aquela película branca estragou o meu picles?',
        answer:
          'Provavelmente não. A levedura Kahm forma um véu branco, liso e fino, é inofensiva e se retira com uma colher. Mofo é peludo ou colorido, e aí o pote inteiro vai fora. Na dúvida, descarte: num alimento, o erro barato é jogar fora.',
      },
    ],
  },

  eyebrow: 'Calculadora de picles',
  title: 'Quanto sal o seu pote pede',
  lead: 'Diga o que vai fermentar e a calculadora devolve o sal em gramas, dentro da faixa que as fontes sustentam. Ela mostra sempre as duas leituras da mesma salmoura, sobre o pote e sobre a água, porque é aí que os livros discordam e onde mais se erra.',

  modes: {
    label: 'O que você vai fazer',
    brine: 'Salmoura',
    'dry-salt': 'Salga direta',
    vinegar: 'Picles de vinagre',
    brineHint: 'Vegetais inteiros submersos em água salgada, fermentando.',
    drySaltHint:
      'Vegetal picado e salgado, que solta a própria salmoura: chucrute, kimchi.',
    vinegarHint:
      'Conserva de geladeira por acidez adicionada. Não fermenta.',
  },

  presetLabel: 'Preparo',

  presets: {
    'couve-flor': 'Couve-flor',
    cenoura: 'Cenoura',
    aspargo: 'Aspargo branco',
    'kimchi-tropical': 'Kimchi tropical',
    'molho-pimenta': 'Molho de pimenta',
    jabuticaba: 'Jabuticaba',
    'manga-verde': 'Manga verde',
    'pepino-azedo': 'Pepino azedo (kosher dill)',
    'pepino-malossol': 'Pepino meio azedo (malossol)',
    azeitona: 'Azeitona',
    chucrute: 'Chucrute',
    'chucrute-couve': 'Chucrute de couve',
    kimchi: 'Kimchi',
    'lacto-fruta': 'Fruta lactofermentada',
    limao: 'Limão em conserva',
    boshi: 'Umeboshi (boshi)',
    'quick-pickle': 'Picles rápido',
    'flores-vinagre': 'Flores em vinagre',
  },

  ingredients: {
    add: 'Acrescentar ingrediente',
    remove: 'Remover',
    name: 'Ingrediente',
    amount: 'Peso',
    role: 'Papel',
    solid: 'Sólido',
    liquid: 'Líquido',
    namePlaceholder: 'Cenoura, alho, louro...',
    roleHint:
      'Sólidos são os vegetais e os aromáticos: alho, especiarias, folhas. Tudo isso ocupa o pote e entra na conta do peso total. Líquido é a água que você acrescenta.',
    totalSolids: 'Sólidos',
    totalLiquids: 'Líquidos',
    empty: 'Acrescente o que vai para o pote e a calculadora soma sozinha.',
  },

  input: {
    label: 'Tamanho do lote',
    byWeights: 'Pesando os dois',
    byJar: 'Pelo volume do pote',
    byIngredients: 'Lista de ingredientes',
    vegetable: 'Vegetais (g)',
    water: 'Água (g)',
    jar: 'Volume do pote (ml)',
    share: 'Quanto do pote é vegetal',
    shareHint:
      'Estimativa: o pote é considerado a 1 g/ml e repartido nessa proporção.',
    liquid: 'Líquido de cobertura (ml)',
    saltPercent: 'Sal (%)',
    sugarPercent: 'Açúcar (%)',
    acidity: 'Acidez do seu vinagre (%)',
    acidityHint: 'Vem no rótulo. O vinagre comum de mesa tem 5%.',
    vinegarParts: 'Partes de vinagre',
    waterParts: 'Partes de água',
  },

  basis: {
    label: 'Base de cálculo do sal',
    total: '% sobre o pote inteiro',
    water: '% sobre a água',
    totalHint: 'Método do Noma e do Fermentação à Brasileira.',
    waterHint: 'Método do Katz.',
    explain:
      'A mesma quantidade de sal tem dois nomes. Sobre o pote inteiro é a salinidade que o produto vai ter no equilíbrio; sobre a água é a concentração da salmoura no primeiro dia. Trocar o método aqui não muda a receita, muda só como ela é descrita.',
  },

  result: {
    title: 'O que pesar',
    salt: 'Sal',
    vegetable: 'Vegetais',
    water: 'Água',
    vinegar: 'Vinagre',
    sugar: 'Açúcar',
    total: 'Total no pote',
    ofTotal: 'sobre o pote',
    ofWater: 'sobre a água',
    ofVegetable: 'sobre o vegetal',
    acidity: 'Acidez do líquido',
    days: 'Tempo na fonte',
    daysUnit: 'dias',
    temperature: 'Temperatura',
  },

  status: {
    below: 'Abaixo da faixa',
    in: 'Na faixa',
    above: 'Acima da faixa',
    recommended: 'Faixa recomendada',
    unsafe: 'Abaixo do mínimo seguro',
  },

  notes: {
    brineTotal:
      'Dois por cento sobre o peso total do pote é o ponto em que as três fontes se encontram: salgado o bastante para as bactérias láticas dominarem, ameno o bastante para o resultado ser comestível.',
    brineWater:
      'Calculado só sobre a água, o número parece maior do que a salinidade que o produto terá: o vegetal também absorve sal e entra na conta do equilíbrio.',
    drySalt:
      'Na salga direta a salmoura sai do próprio vegetal, então a porcentagem aplicada é a salinidade final. Menos de 1,5% e o vegetal amolece antes de acidificar.',
    saltPreserve:
      'Preparos de conservação longa trabalham bem acima da faixa de fermentação: o sal aqui é o conservante principal, não o regulador.',
    vinegarAcidity:
      'A acidez do líquido pronto é a proteção do picles de vinagre. Diluir vinagre é diluir essa proteção.',
    quickSalt: 'No picles de vinagre o sal tempera e dá textura; quem conserva é o ácido.',
    quickSugar:
      'O açúcar equilibra a acidez. É questão de gosto, não de segurança.',
  },

  safety: {
    title: 'Antes de fechar o pote',
    lead: 'Fermentar é seguro quando algumas condições são respeitadas. Estas não são detalhes de acabamento.',
    ph: {
      title: 'O alvo é pH abaixo de 4,6',
      body: 'É o limite em que as bactérias perigosas param de se multiplicar. Uma fermentação que anda chega lá sozinha nos primeiros dias, ficando ácida e cheirando a picles, não a podre.',
    },
    submerged: {
      title: 'Tudo submerso, sempre',
      body: 'O que fica acima da salmoura mofa. Use peso, folha inteira ou saco com água para manter o vegetal afundado.',
    },
    mold: {
      title: 'Kahm não é mofo',
      body: 'Uma película branca, fina e lisa na superfície é levedura Kahm: inofensiva, é só retirar. Manchas peludas, coloridas ou aveludadas são mofo, e aí o lote vai fora.',
    },
    botulism: {
      title: 'Onde o risco de botulismo mora de verdade',
      body: 'Não é na fermentação, que é ácida por natureza. O risco está em conserva não fermentada e não acidificada em ambiente sem oxigênio: palmito mal processado, alho cru em azeite. Se o preparo não fermenta e não leva ácido, ele não é seguro em temperatura ambiente.',
    },
    shelf: {
      title: 'Geladeira, não prateleira',
      body: 'Esta calculadora dimensiona conserva de geladeira. Conserva de prateleira exige processamento térmico com tempo e temperatura próprios de cada alimento, que não cabem numa calculadora de proporções. Consulte a orientação oficial.',
    },
  },

  climate: {
    title: 'Temperatura e tempo',
    fast: 'Rápido, 21 a 28 °C',
    slow: 'Lento, 10 a 21 °C',
    fastBody:
      'Fermentação em poucos dias, ácido mais direto. É como o Noma trabalha, com controle de temperatura.',
    slowBody:
      'Fermentação de semanas, sabor mais complexo e mais margem de erro. É o que Katz e o Fermentação à Brasileira recomendam para casa, e o que faz sentido no calor brasileiro, buscando o ponto mais fresco da casa.',
  },

  vinegarStatus: {
    ok: 'Acidez suficiente',
    belowMinimum: 'Acidez abaixo do mínimo',
    unusable: 'Este vinagre não serve',
    belowBody:
      'Nessa diluição o líquido fica abaixo de 2,5% de ácido acético. Aumente a proporção de vinagre até o mínimo indicado.',
    unusableBody:
      'Com essa acidez, nem vinagre puro alcança 2,5% no líquido de cobertura. Não há proporção que resolva: use um vinagre mais forte.',
    minimum: 'Proporção mínima',
    minimumValue: 'partes de água para cada parte de vinagre',
    pureVinegar: 'apenas vinagre, sem água',
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'As proporções vêm das três obras abaixo. As regras de segurança e a acidez mínima do picles de vinagre usam também orientação oficial, sinalizada como tal.',
    page: 'p.',
    section: 'cap.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'Fermentar vegetal é uma disputa: as bactérias láticas precisam dominar antes que outra coisa domine. O sal é o que inclina o jogo, porque elas toleram salinidade que a concorrência não tolera. Por isso a porcentagem de sal não é tempero: é a variável de controle.',
      'A parte confusa é a base de cálculo. Um mesmo pote com 40 g de sal, 1 kg de couve-flor e 1 litro de água pode ser descrito como 2% ou como 4%, e as duas descrições estão certas: a primeira é sobre o conteúdo todo, a segunda só sobre a água. A calculadora sempre mostra as duas, porque é exatamente aí que uma receita de um livro vira o dobro ou a metade do sal quando lida com a régua do outro.',
      'Na salga direta não há água adicionada: o sal puxa o líquido do próprio vegetal, então a porcentagem aplicada já é a salinidade final. E no picles de vinagre nada disso vale, porque ele não fermenta. O que conserva ali é a acidez que você adiciona, e a conta passa a ser quanto do líquido precisa ser vinagre.',
    ],
  },

  divergence: {
    title: 'Quando as fontes discordam',
    lead: 'As três obras chegam a um produto parecido por caminhos diferentes. Onde houve escolha, ela está explicada.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Base do cálculo do sal',
        sources:
          'Katz calcula sobre o peso da água (5% para picles de pepino). Noma e Fermentação à Brasileira calculam sobre o peso total do pote, vegetais incluídos (2%).',
        decision:
          'O padrão é 2% sobre o pote inteiro, com um botão para ver e usar o método do Katz. O cálculo sobre o total é mais reprodutível porque descreve o produto no equilíbrio; o Fermentação à Brasileira demonstra na p. 199 como calcular só sobre parte do conteúdo entrega metade do sal pretendido.',
      },
      {
        topic: 'Temperatura de fermentação',
        sources:
          'Noma fermenta a 28 °C e conta os dias. Katz e o Fermentação à Brasileira preferem entre 10 e 21 °C e contam as semanas.',
        decision:
          'Os dois regimes estão disponíveis, com o tempo de cada um. Não é discordância técnica: é objetivo diferente, velocidade contra complexidade. No clima brasileiro, o regime lento pede o ponto mais fresco da casa.',
      },
      {
        topic: 'Acidez mínima do picles de vinagre',
        sources:
          'Nenhuma das três obras fixa um piso. Noma dá a proporção 1:1 com vinagre de 5%, sem dizer qual o limite.',
        decision:
          'O piso é 2,5% de ácido acético no líquido de cobertura, que é exatamente o que essa proporção 1:1 produz, apoiado na orientação oficial de conservas. Segurança alimentar não admite número sem fonte, então aqui a estante abriu exceção para uma fonte oficial.',
      },
      {
        topic: 'Película branca na superfície',
        sources:
          'Katz e Noma tratam a levedura Kahm como inofensiva, é só retirar. O Fermentação à Brasileira é mais conservador com qualquer crescimento na superfície.',
        decision:
          'Explicamos como distinguir Kahm de mofo, com a orientação de descartar quando houver dúvida. Num alimento, o erro barato é jogar fora.',
      },
    ],
  },

  glossary: {
    title: 'Glossário',
    terms: [
      {
        term: 'Lactofermentação',
        definition:
          'Fermentação conduzida por bactérias láticas, que convertem os açúcares do vegetal em ácido lático. É o ácido que conserva e dá o sabor de picles.',
      },
      {
        term: 'Salmoura',
        definition:
          'Água com sal em que o vegetal fica submerso. Sua concentração pode ser descrita sobre a água ou sobre o conteúdo total do pote.',
      },
      {
        term: 'Salga direta',
        definition:
          'Salgar o vegetal picado sem adicionar água: o sal puxa o líquido de dentro dele e forma a salmoura. É o método do chucrute e do kimchi.',
      },
      {
        term: 'Anaerobiose',
        definition:
          'Ausência de oxigênio. As bactérias láticas trabalham sem ele, e os mofos precisam dele, por isso manter tudo submerso é o que decide quem ganha.',
      },
      {
        term: 'Levedura Kahm',
        definition:
          'Película branca, lisa e fina que às vezes se forma na superfície. É inofensiva e se retira; não confundir com mofo, que é peludo ou colorido.',
      },
      {
        term: 'pH',
        definition:
          'Medida de acidez. Abaixo de 4,6 as bactérias perigosas não se multiplicam, e é aonde uma fermentação saudável chega sozinha.',
      },
      {
        term: 'Acidez do vinagre',
        definition:
          'Percentual de ácido acético declarado no rótulo. O vinagre de mesa costuma ter 5%, e é ele que a proporção de referência pressupõe.',
      },
      {
        term: 'Picles rápido',
        definition:
          'Conserva de geladeira feita com líquido ácido, sem fermentação. Fica pronta em horas e dura semanas na geladeira, não na prateleira.',
      },
    ],
  },
};
