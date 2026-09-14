export const brinePtBR = {
  meta: {
    title: 'Salmoura e salga: sal em gramas',
    description:
      'Quanto sal por quilo de frango, carne ou peixe, em gramas — e não em colher de uma marca americana. Salga seca, salmoura de equilíbrio e de imersão.',
    keywords: [
      'calculadora de salmoura',
      'quanto sal por quilo de carne',
      'salga seca frango',
      'dry brine em gramas',
      'salmoura de equilíbrio',
      'salmoura para peixe',
      'salmoura para peru',
      'sal kosher em gramas',
    ],
    imageAlt:
      'Cartão da calculadora de salmoura, com o título e as obras que sustentam as doses.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quanto sal por quilo de frango?',
        answer:
          'Na salga seca do Food Lab, 6,3 g por quilo — a conversão de "1 colher de chá de sal kosher Diamond Crystal por libra" para grama. Na salmoura de equilíbrio injetada do Modernist Cuisine at Home, 6 g por quilo, mais 100 g de água. Os dois números são praticamente o mesmo; a diferença entre os métodos é a água, não o sal.',
      },
      {
        question: 'Salmoura ou salga seca?',
        answer:
          'O Food Lab mediu os dois em doze peitos de frango assados juntos. A salmoura retém um ponto percentual a mais de umidade — 89,6% do peso inicial contra 88,6%. Mas esse ponto é água de torneira, e o sabor sai diluído. A conclusão dele: "salting and resting your meat is superior in every way to brining".',
      },
      {
        question: 'Por que a receita americana não funciona aqui?',
        answer:
          'Porque a dose vem em colher de chá de uma marca específica. Uma colher de chá de Diamond Crystal pesa 2,8 g; a mesma colher de Morton pesa 4,7 g. Seguir a receita com o sal errado quase dobra a dose. Em grama isso não acontece.',
      },
      {
        question: 'Quanto tempo deixar na salmoura?',
        answer:
          'Depende do método. Na salga seca e na salmoura de equilíbrio, o tempo só precisa ser suficiente: 24 a 48 h para uma ave, até três dias para um bife. Na salmoura de imersão, o tempo é parte da receita e passar dele salga demais — o peixe do Modernist sai entre 5 e 12 horas.',
      },
      {
        question: 'Posso deixar a carne salmourando fora da geladeira?',
        answer:
          'Não. As duas fontes mandam refrigerar durante todo o processo, sem exceção. E a carne salmourada e escorrida guarda no máximo 24 h na geladeira antes de precisar ir ao fogo.',
      },
    ],
  },

  eyebrow: 'Calculadora de salmoura',
  title: 'A dose de sal em gramas, não em colher de chá',
  lead: 'As duas melhores fontes sobre salmoura publicam a dose em colher de uma marca de sal americana e numa coluna escondida de tabela. Aqui elas viram gramas por quilo da sua peça, com o método e o tempo que cada uma declara.',

  input: {
    label: 'A sua peça',
    protein: 'Peso da proteína (g)',
    proteinHint: 'A carne, a ave ou o peixe, limpos. Recheio e tempero não entram na conta.',
    method: 'Método',
  },

  methods: {
    'dry-salting': 'Salga seca',
    'equilibrium-poultry': 'Equilíbrio, ave',
    'sweet-meat': 'Equilíbrio doce, carne',
    'immersion-fish': 'Imersão, peixe',
    'cure-fish': 'Cura rápida, peixe',
  },

  methodNotes: {
    'dry-salting':
      'Sal direto na peça, sem água nenhuma. O sal puxa o suco, dissolve nele e volta para dentro como uma salmoura da própria carne. Na ave, sob a pele; no bife, dos dois lados. Geladeira, descoberto, sobre uma grade.',
    'equilibrium-poultry':
      'A salmoura da ave inteira do Modernist, injetada com seringa em dezenas de pontos. Como toda a dose entra, não há risco de salgar demais esperando: a porcentagem sobre a ave é a concentração final.',
    'sweet-meat':
      'Leite e suco de maçã no lugar de parte da água, que trazem fosfatos naturais e amaciam. Injetada, e depois a peça descansa no que sobrou. Para peça de até 3,5 cm de espessura.',
    'immersion-fish':
      'Imersão simples, sem seringa. É a única aqui em que o relógio manda: 5 horas para tempero delicado, até 12 para textura mais firme.',
    'cure-fish':
      'Cura seca rápida: cobre-se o peixe com sal e açúcar, 45 minutos na geladeira, e então enxagua, seca e cozinha. Parte do sal sai no enxágue.',
  },

  result: {
    title: 'O que pesar',
    salt: 'Sal',
    liquid: 'Água ou líquido',
    sugar: 'Açúcar',
    brine: 'Salmoura pronta',
    strength: 'Sal na salmoura',
    ratio: 'Sal sobre a proteína',
    time: 'Tempo',
    hours: 'h',
    minutes: 'min',
    fridge: 'na geladeira',
    teaspoons: 'A mesma dose em colher de chá',
    teaspoonsHint:
      'Só para conferir contra receita escrita em inglês. A resposta é a grama: a mesma colher quase dobra a dose se a marca do sal muda.',
    diamondCrystal: 'Diamond Crystal kosher',
    mortonKosher: 'Morton kosher',
    injected: 'Injetada com seringa',
    injectedHint:
      'Sem seringa, a dose não chega ao centro e o método vira outra coisa. Furar a peça também empurra contaminação da superfície para dentro, então ela precisa ser cozida por inteiro.',
    rinsed: 'Enxaguar ao fim',
    rinsedHint:
      'Parte do sal sai no enxágue, então esta dose é maior que a de equilíbrio de propósito.',
  },

  equilibrium: {
    title: 'Equilíbrio ou relógio',
    lead: 'A diferença que decide se dá para esquecer a peça na geladeira ou se é preciso marcar o tempo.',
    yes: 'De equilíbrio',
    no: 'Contada por tempo',
    yesBody:
      'Toda a dose acaba dentro da peça, então o tempo só precisa ser suficiente. Passar dele não salga mais: não há de onde vir mais sal. É o que o Modernist chama de eliminar o risco de salgar demais.',
    noBody:
      'A peça fica numa solução muito mais forte do que se quer no produto final, e sai antes de equilibrar. Aqui o relógio é ingrediente: passar do tempo salga demais, e não tem volta.',
  },

  trial: {
    title: 'A medição que decide a discussão',
    lead: 'Doze peitos de frango idênticos, mesmo forno a 275 °F, todos até 150 °F no centro. O que sobrou do peso inicial depois de assar.',
    treatment: 'Tratamento',
    afterSoak: 'Depois de molhar',
    afterCooking: 'Depois de assar',
    rows: {
      plain: 'Sem nada',
      brined: 'Salmoura de 6%',
      salted: 'Salga seca',
      water: 'Só água',
    },
    verdict:
      'A salmoura ganha por um ponto percentual. O Food Lab não recomenda ela mesmo assim, e a razão está na natureza desse ponto: "much of the juice it’s now holding on to is nothing more than tap water". A água pura, sozinha, sai pior que não fazer nada — o que mostra que o trabalho é do sal, não do encharcamento.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'Tudo aqui é proporção sobre o peso da proteína. As receitas do Modernist Cuisine at Home já publicam assim, numa coluna chamada SCALING: a salmoura básica de ave é 10% de água e 0,6% de sal sobre o peso do bicho. A calculadora guarda os pesos da receita — 200 g de água e 12 g de sal para 2 kg de frango — e deriva a proporção deles, porque a coluna do livro é arredondada e o peso não é.',
      'A dose do Food Lab precisou de uma ponte. Ele escreve "cerca de 1 colher de chá de sal kosher Diamond Crystal por libra de carne", que não é executável com uma balança brasileira. A conversão vem de outra obra da estante: Ruhlman e Polcyn publicam que uma xícara de Diamond Crystal pesa 4,8 onças e uma de Morton, quase 8. Uma xícara tem 48 colheres de chá, então a colher de Diamond Crystal pesa 2,835 g e a dose é 0,625% do peso da carne.',
      'A conversão se confere sozinha na outra fonte. O Food Lab descreve a salmoura de 6% como "meia xícara de Diamond Crystal por quarto de galão de água"; meia xícara, pelo peso do Ruhlman, são 68 g, e em 946 g de água isso dá 7,2% — o "cerca de" dele. Duas fontes independentes, mesma densidade.',
      'Fica registrado que esta pesquisa corrigiu o próprio documento de bibliografia do site, que dizia que a divergência era 0,5% contra 0,85%. Lidas as duas fontes, são 0,6% e 0,625%: uma diferença de menos de 0,3 g num quilo de carne, menor que o erro de uma colher. As duas concordam sobre o sal. Discordam sobre a água.',
    ],
  },

  divergence: {
    title: 'Quando as fontes divergem',
    lead: 'E, neste tema, onde elas concordam — que é a parte mais rara.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Quanto sal',
        sources:
          'Modernist mira 0,5% de concentração final e usa 0,6% na ave injetada. Food Lab usa 1 colher de chá de Diamond Crystal por libra, que dá 0,625%.',
        decision:
          'Diz que concordam. É informação tão útil quanto a divergência, e este site raramente pode dar essa notícia.',
      },
      {
        topic: 'Água, sim ou não',
        sources:
          'Modernist injeta 10% do peso em água e ganha suculência. Food Lab não usa água nenhuma e mede um ponto percentual a menos de umidade retida.',
        decision:
          'Entrega os dois com o número em gramas, e mostra a tabela do experimento. A fonte que mediu os dois ficou com a salga seca; a escolha continua sendo de quem cozinha.',
      },
      {
        topic: 'Salmoura de imersão comum',
        sources:
          'Modernist: a abordagem convencional dá "an oversalted exterior and an undersalted interior". Food Lab: textura de esponja molhada e sabor lavado.',
        decision:
          'Oferece só para peixe, que é onde o Modernist a publica, e marca como contada por tempo em vez de equilíbrio.',
      },
      {
        topic: 'Salmoura mais forte',
        sources:
          'Food Lab testou uma salmoura saturada de 35% e ela reteve tanta umidade quanto a de 6%, "despite turning the turkey inedibly salty".',
        decision:
          'Nenhuma opção acima do que as fontes publicam. Passar de 6% não compra nada além de sal.',
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
      'equilibrium-brine': {
        term: 'Salmoura de equilíbrio',
        definition:
          'Salmoura dosada sobre o peso da carne, e não sobre o da água, numa concentração igual à que se quer no produto final. Como não há mais sal para entrar depois que tudo equilibra, o tempo deixa de ser crítico.',
      },
      'dry-brining': {
        term: 'Salga seca',
        definition:
          'Salgar a peça e deixá-la descansar refrigerada, sem adicionar água. O sal puxa o suco por osmose, dissolve nele e forma uma salmoura concentrada da própria carne, que volta para dentro.',
      },
      'covering-brine': {
        term: 'Salmoura de imersão',
        definition:
          'A peça submersa numa solução mais forte do que se quer nela, retirada antes de equilibrar. Rende gradiente: a borda mais salgada que o centro.',
      },
      'kosher-salt': {
        term: 'Sal kosher',
        definition:
          'Sal de cristal grosso e irregular, sem iodo, feito para ser pego com os dedos. Não tem peso padronizado: uma xícara de Diamond Crystal pesa 4,8 onças e uma de Morton quase 8, o que é a razão de toda receita séria dar a dose em peso.',
      },
      injection: {
        term: 'Injeção',
        definition:
          'Empurrar a salmoura para dentro da peça com seringa, em dezenas de pontos. Multiplica por dois ou três a velocidade de difusão do sal e é o que torna a salmoura de equilíbrio viável em 24 horas.',
      },
      'salting-out': {
        term: 'Salting out',
        definition:
          'O efeito que explica por que salmourar em caldo não dá mais sabor que salmourar em água. Moléculas de água se ligam aos íons de sal e deixam as proteínas do caldo se agrupando entre si, grandes demais para atravessar a célula. O sal entra; o sabor do caldo fica de fora.',
      },
    },
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Dois livros que mediram o assunto e um terceiro que entra por um motivo só: é o único da estante que publica quanto pesa uma xícara de sal kosher, o que torna a dose do Food Lab executável em gramas.',
    page: 'p.',
    section: 'seção',
  },
};
