export const breadPtBR = {
  meta: {
    title: 'Calculadora de pão — porcentagem de padeiro',
    description:
      'Calcule pão em gramas a partir da farinha que você tem: presets de 16 pães, porcentagem de padeiro editável, faixas seguras e conversão entre fermentos. Cada número citado com livro e página.',
  },

  eyebrow: 'Calculadora de pães',
  title: 'Pão na quantidade que você tem em casa',
  lead: 'Escolha o pão, diga quanta farinha vai usar e a receita sai em gramas. Ajuste as porcentagens à vontade: a calculadora avisa quando um valor sai da faixa das fontes — e explica o que acontece se você insistir.',

  presetLabel: 'Tipo de pão',

  presets: {
    boule: 'Pão branco rústico (boule)',
    baguette: 'Baguete',
    'pao-frances': 'Pão francês de padaria',
    integral: 'Pão integral',
    centeio: 'Pão de centeio',
    focaccia: 'Focaccia',
    ciabatta: 'Ciabatta com poolish',
    'pizza-napoletana': 'Pizza napoletana',
    'pizza-caseira': 'Pizza caseira',
    'pao-de-forma': 'Pão de forma (Pullman)',
    'pao-sanduiche': 'Pão para sanduíche',
    'pao-hamburguer': 'Pão de hambúrguer',
    'pao-hot-dog': 'Pão de hot-dog',
    'pao-de-leite': 'Pão de leite',
    brioche: 'Brioche',
    broa: 'Broa portuguesa',
  },

  ingredients: {
    'flour-white': 'Farinha de trigo branca',
    'flour-wholewheat': 'Farinha integral',
    'flour-rye': 'Farinha de centeio',
    'flour-semolina': 'Sêmola',
    'flour-corn': 'Farinha de milho',
    'flour-bran': 'Farelo de trigo',
    'flour-rice': 'Farinha de arroz',
    water: 'Água',
    milk: 'Leite',
    salt: 'Sal',
    sugar: 'Açúcar',
    butter: 'Manteiga',
    'olive-oil': 'Azeite',
    lard: 'Banha',
    egg: 'Ovo',
    'milk-powder': 'Leite em pó',
    'creme-fraiche': 'Creme de leite fresco',
    xanthan: 'Goma xantana',
    'yeast-fresh': 'Fermento fresco',
    'yeast-active-dry': 'Fermento seco ativo',
    'yeast-instant': 'Fermento seco instantâneo',
    'levain-liquid': 'Levain líquido',
    poolish: 'Poolish',
    'fermented-dough': 'Massa fermentada',
  },

  target: {
    label: 'Quanto você vai fazer',
    flour: 'Pela farinha',
    dough: 'Pelo peso da massa',
    units: 'Por unidades',
    flourHint: 'Gramas de farinha que você tem',
    doughHint: 'Peso total da massa crua',
    unitsCount: 'Unidades',
    unitWeight: 'Peso de cada uma (g)',
  },

  table: {
    caption: 'Receita calculada',
    ingredient: 'Ingrediente',
    amount: 'Quantidade',
    percent: '% do padeiro',
    flourTotal: 'Farinha total',
    doughTotal: 'Massa total',
    editHint: 'Toda porcentagem é editável — a receita recalcula na hora.',
  },

  balance: {
    title: 'Balanço da massa',
    hydration: 'Hidratação',
    effectiveHydration: 'Hidratação real',
    salt: 'Sal',
    effectiveSalt: 'Sal sobre a farinha total',
    recommended: 'Faixa recomendada',
    withPreFerment:
      'Contando a farinha e a água que entram dentro do pré-fermento.',
    status: {
      below: 'Abaixo da faixa',
      in: 'Na faixa',
      above: 'Acima da faixa',
    },
    hardLimit: 'Fora do limite das fontes',
  },

  notes: {
    hydration:
      'Mais água dá miolo mais alveolado e massa mais difícil de manusear. Abaixo de 50% a massa vira massa de cilindro, de miolo fechado; acima de 80% é alta hidratação e pede dobras em vez de sova.',
    salt: 'O sal também freia a fermentação. Abaixo de 1% o pão fica sem graça e a massa acelera demais; acima de 2,5% a levedura começa a sofrer.',
    instantYeast:
      'O teto prático é 1% sobre a farinha: mais que isso acelera a fermentação sem ganhar sabor. Menos fermento e mais tempo é quase sempre o melhor negócio.',
    dryYeast:
      'O seco ativo precisa ser dissolvido em água morna antes de entrar na massa.',
    freshYeast:
      'Massas magras trabalham com pouco fermento fresco quando há levain junto. Massas doces pedem bem mais, porque açúcar e gordura atrapalham a levedura.',
    levain:
      'A dose usual do levain líquido é 20 a 50% do peso da farinha. Como ele é metade farinha e metade água, entra na conta da hidratação real.',
    poolish:
      'Pré-fermento líquido, feito de partes iguais de farinha e água com pouquíssimo fermento, sem sal e sem sova.',
    fermentedDough:
      'Um pedaço de massa pronta da véspera, incorporado à massa nova.',
    sugar:
      'Até uns 12% o açúcar alimenta a fermentação e doura a casca. Acima disso ele começa a competir com a levedura pela água e a massa precisa de mais fermento.',
    fat: 'A gordura amacia o miolo e conserva o pão por mais tempo. Em quantidade alta, como no brioche, ela atrapalha o glúten e a massa precisa de mais tempo e mais fermento.',
  },

  process: {
    title: 'Preparo, segundo a fonte',
    firstRise: '1ª fermentação',
    secondRise: '2ª fermentação',
    oven: 'Forno',
    bake: 'Tempo de forno',
    minutes: 'min',
    yieldLabel: 'Rendimento na fonte',
    yieldValue: 'unidades de',
    notes: {
      steam: 'Vapor no forno ao enfornar: cerca de 50 g de água numa assadeira preaquecida.',
      autolyse: 'Autólise de 1 hora antes de sovar — a massa fica mais elástica com menos trabalho.',
      folds: 'Autólise de 20 minutos e duas sessões de dobras durante a primeira fermentação.',
      ryeWatch:
        'Centeio passa do ponto rápido: não deixe a segunda fermentação esticar.',
      poolishAhead:
        'A poolish é feita 4 horas antes, com parte do fermento, e vai inteira para a massa.',
      napoletana:
        'A segunda fermentação é longa de propósito — são 0,04% de fermento trabalhando de 5 a 8 horas.',
      pizzaHydration:
        'A receita impressa no livro traz 52% de hidratação, valor que destoa da tabela do próprio Kayser (p. 301, 68%). Usamos 62%, dentro da faixa que o Camargo indica.',
      brioche:
        'Depois da primeira fermentação, uma hora de geladeira para a manteiga firmar antes de modelar.',
      scald:
        'A farinha de milho é escaldada com água fervente antes de entrar na massa.',
    },
  },

  yeastTool: {
    title: 'Conversor de fermento',
    lead: 'Tem fermento fresco e a receita pede seco? Converta aqui.',
    amount: 'Quantidade',
    from: 'Você tem',
    to: 'A receita pede',
    result: 'Use',
    timeHint: 'Fermento e tempo andam em sentidos opostos',
    timeBody:
      'Cortar o fermento pela metade dobra o tempo da primeira fermentação. É orientação de planejamento: temperatura da cozinha e força da farinha mexem no resultado.',
    levainTitle: 'Trocar por levain',
    levainBody:
      'Não existe fator de conversão entre fermento biológico e levain: o levain trabalha por dose sobre a farinha, de 20 a 50%. Como ele é metade farinha e metade água, desconte as duas coisas da receita.',
    flourLabel: 'Farinha da receita (g)',
    levainUse: 'Levain líquido',
    levainFlour: 'Desconte de farinha',
    levainWater: 'Desconte de água',
    dried: 'Se o seu levain é desidratado',
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Cada preset e cada faixa acima sai de uma destas obras, na página ou capítulo indicado.',
    page: 'p.',
    section: 'cap.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'Toda a calculadora trabalha em porcentagem de padeiro: a farinha é 100% e cada ingrediente é uma porcentagem do peso dela. É por isso que a mesma receita serve para 300 g ou 3 kg de farinha — as proporções não mudam, só a escala.',
      'Quando a receita leva um pré-fermento, a conta ganha um detalhe. Um levain líquido é metade farinha e metade água, então 20% de levain acrescentam 10 pontos de farinha e 10 de água ao total. Ignorar isso subestima a hidratação: a boule do Kayser tem 70% de água declarada, mas a massa trabalha a 73%. A calculadora mostra os dois números.',
      'O mesmo vale para o sal. Os 2% da ciabatta são sobre a farinha da massa; contando a farinha que veio dentro da poolish, o sal real é 1,7%. O primeiro número serve para você pesar, o segundo para entender a fermentação.',
    ],
  },

  divergence: {
    title: 'Quando as fontes discordam',
    lead: 'As três fontes desta calculadora não concordam em tudo — e isso é normal. Onde houve escolha, ela está explicada aqui.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Hidratação do pão branco',
        sources:
          'Kayser trabalha a 70% na boule; Camargo usa 60% no pão francês; a anotação de curso registra ~50%.',
        decision:
          'Faixa de 60 a 70%, com 65% como referência. Os 50% descrevem massa de padaria sovada em cilindro, de miolo fechado — é limite inferior legítimo, não padrão. Kayser trabalha com levain e forno com vapor, o que sustenta os 70%.',
      },
      {
        topic: 'Fresco para seco',
        sources:
          'Kayser manda dividir por 2; Camargo, por 3.',
        decision:
          'As duas coisas, porque são fermentos diferentes: seco ativo é metade do fresco, instantâneo é um terço. Não é contradição, é vocabulário.',
      },
      {
        topic: 'Hidratação da pizza',
        sources:
          'A receita caseira do Kayser imprime 52%, mas a tabela de conversão do próprio livro (p. 301) traz 68%. Camargo usa 65%, com faixa de 59 a 70%.',
        decision:
          'Preset em 62%. Os 52% destoam de tudo, inclusive do próprio livro — tratamos como erro de edição.',
      },
      {
        topic: 'Quantidade de fermento',
        sources:
          'Kayser usa 0,4 a 1,4% de fresco somado a levain; Camargo põe teto de 1% no seco instantâneo.',
        decision:
          'A faixa segue o tipo de fermento escolhido, e o teto de 1% do instantâneo vira aviso. Os números do Kayser não são comparáveis direto: no método dele o motor da fermentação é o levain.',
      },
    ],
  },

  glossary: {
    title: 'Glossário',
    terms: [
      {
        term: 'Porcentagem de padeiro',
        definition:
          'Sistema em que a farinha é 100% e todo ingrediente é expresso como porcentagem do peso dela. Permite escalar a receita sem refazer conta.',
      },
      {
        term: 'Hidratação',
        definition: 'A razão entre água e farinha da receita.',
      },
      {
        term: 'Autólise',
        definition:
          'Descanso entre a mistura e a sova para a farinha absorver a água e o glúten começar a se formar sozinho. Rende massa mais elástica com menos trabalho.',
      },
      {
        term: 'Levain',
        definition:
          'Fermento natural: cultura de leveduras selvagens e bactérias láticas. O líquido tem 100% de hidratação (partes iguais de farinha e água); o firme, cerca de 60%.',
      },
      {
        term: 'Poolish',
        definition:
          'Pré-fermento líquido de partes iguais de farinha e água com pouquíssimo fermento, sem sal e sem sova. Ganha sabor antes da massa existir.',
      },
      {
        term: 'Biga',
        definition: 'Pré-fermento com a mesma função da poolish, porém firme.',
      },
      {
        term: 'Massa fermentada',
        definition:
          'Um pedaço de massa pronta da véspera incorporado à massa nova, de 15 a 30% do peso da farinha.',
      },
      {
        term: 'Pointage e apprêt',
        definition:
          'Os dois tempos de fermentação: o primeiro em bloco, logo após a sova; o segundo depois de modelar, até o forno.',
      },
      {
        term: 'Temperatura de base',
        definition:
          'Soma das temperaturas do ambiente, da farinha e da água, usada para descobrir a que temperatura a água deve entrar. Para pão branco fica entre 54 e 56 °C, mirando massa a 24–25 °C ao fim da sova.',
      },
      {
        term: 'Força da farinha',
        definition:
          'Farinha forte tem mais proteína, absorve mais água e aguenta fermentação longa. A qualidade da proteína pesa mais que o teor.',
      },
    ],
  },
};
