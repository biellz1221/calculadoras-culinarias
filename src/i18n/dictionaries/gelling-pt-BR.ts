export const gellingPtBR = {
  meta: {
    title: 'Calculadora de gelatina e ágar',
    description:
      'Quanto de gelatina, ágar, xantana ou carragena para o líquido que você tem, na textura que você quer — com a conversão entre folha e pó pelo Bloom.',
    keywords: [
      'calculadora de gelatina',
      'quantas folhas de gelatina',
      'ágar-ágar quantidade',
      'goma xantana quanto usar',
      'conversão bloom gelatina',
      'gel fluido',
      'carragena iota kappa',
    ],
    imageAlt: 'Calculadora de gelificantes e espessantes',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quantas folhas de gelatina valem um envelope de pó?',
        answer:
          'Depende do grau da folha, e é por isso que a conta existe. A fórmula da fonte é peso × Bloom da que você tem ÷ Bloom da que a receita pede. Uma folha ouro (190–220 Bloom) tem 2 g; uma bronze (125–155) tem 3,3 g — e as duas gelificam quase igual, porque a folha mais fraca vem mais pesada de propósito.',
      },
      {
        question: 'Posso trocar gelatina por ágar na mesma quantidade?',
        answer:
          'Não. São doses diferentes e comportamentos diferentes: o ágar precisa ferver para hidratar, gelifica mais firme e aguenta 85 °C; a gelatina derrete a 37 °C, que é o que a faz desmanchar na boca. Para um gel desenformável a fonte usa 0,8% de gelatina; para a mesma panna cotta em versão vegetariana, 0,15% de ágar com 0,12% de xantana.',
      },
      {
        question: 'Goma xantana gelifica?',
        answer:
          'Não. Ela engrossa: dá corpo ao líquido sem deixar ele firmar, e trabalha a frio, sem ferver. Se você quer um gel que desenforma, é gelatina, ágar ou carragena.',
      },
      {
        question: 'Por que não tem esferificação aqui?',
        answer:
          'Porque nenhuma obra da nossa estante publica a dose de alginato e de cloreto de cálcio. O mecanismo está descrito pelo McGee e o verbete está no glossário, mas número sem fonte não vai para a tela — e esse número está no volume 4 do Modernist Cuisine, que ainda não temos.',
      },
      {
        question: 'O que conta como "líquido"?',
        answer:
          'O que a fonte conta. Na panna cotta dela são o leite, o creme e o purê de fruta — 530 g ao todo —, e ficam de fora o açúcar e o sal. A regra de 0,8% aplicada a esses 530 g devolve exatamente as 4,3 g de gelatina que a receita imprime.',
      },
    ],
  },

  eyebrow: 'Calculadora de gelificantes',
  title: 'Gelatina, ágar e xantana no peso do seu líquido',
  lead: 'Diga quanto líquido você tem e que textura quer: a dose sai em gramas, com a página de onde ela veio. A conversão entre folha e pó, que é onde quase toda receita erra, sai junto.',

  input: {
    label: 'O que você tem',
    liquid: 'Líquido',
    liquidHint: 'Tudo o que vira gel: caldo, creme, suco, leite. Açúcar e sal ficam de fora.',
    texture: 'Textura que você quer',
  },

  textures: {
    thin: 'Caldo encorpado',
    sauce: 'Molho',
    puree: 'Consistência de purê',
    'fluid-gel': 'Gel fluido',
    'soft-set': 'Gel macio, de colher',
    set: 'Gel desenformável',
    'hard-set': 'Gel duro, de cortar',
  },

  textureNotes: {
    thin: 'Um caldo que ganha corpo sem deixar de ser caldo — ainda corre na colher.',
    sauce: 'Espessura de molho de salada ou ketchup: cobre as costas da colher.',
    puree: 'Tão espesso quanto um purê, e ainda assim um líquido puro por baixo.',
    'fluid-gel': 'Firma por inteiro e depois é batido no liquidificador. Fica espesso na colher e afina na boca, com textura mais cremosa que molho engrossado com amido.',
    'soft-set': 'Firma, mas treme e derrete na boca: flan, panna cotta, creme de colher.',
    set: 'Firma no molde e sai inteiro: panna cotta firme, aspic, geleia de fruta.',
    'hard-set': 'Firme o bastante para cortar em cubos, laminar ou ralar — e, em alguns agentes, para ir ao forno.',
  },

  agents: {
    gelatin: 'Gelatina',
    agar: 'Ágar-ágar',
    xanthan: 'Goma xantana',
    iota: 'Carragena iota',
    kappa: 'Carragena kappa',
    gellan: 'Goma gelana',
    methylcellulose: 'Metilcelulose',
    pectin: 'Pectina',
    wondra: 'Amido Wondra',
  },

  agentNotes: {
    gelatin: 'Derrete a 37 °C — a temperatura do corpo, que é exatamente por que ela desmancha na boca. Não serve para nada que vá ao calor.',
    agar: 'Precisa ferver para hidratar, o que a desqualifica para preparo cru ou sopa fria. Em compensação aguenta 85 °C depois de pronta — e esse número é o único da página em que duas obras independentes dizem exatamente a mesma coisa.',
    xanthan: 'Engrossa e não gelifica. Trabalha a frio, sem ferver. É potente: pese, não meça de colher — líquido pegajoso é sinal de que passou.',
    iota: 'Faz gel macio e elástico, de flan ou panna cotta. É tixotrópica: depois de firme, você pode quebrar a textura no fouet e ela se refaz descansando no frio.',
    kappa: 'Faz gel firme e quebradiço, de gelatina moldada. Gelifica rápido, a 50 °C — trabalhe quente e em movimento.',
    gellan: 'O único da lista que não derrete depois de firme. Vai ao forno, aguenta maçarico e serve de recheio de confeitaria — nenhum outro agente daqui faz isso.',
    methylcellulose: 'Funciona ao contrário de todos os outros: gelifica quando esquenta e derrete quando esfria. É o que torna gel frito possível. Dissolve no frio, a 3–4 °C, e firma a 60 °C — com só dez graus entre derreter e gelificar, a menor margem de manobra da página.',
    pectin: 'A mesma da geleia, aqui em dose de gel. As de baixa metoxilação dão gel macio; as de alta, gel firme de pâte de fruit.',
    wondra: 'Amido, não hidrocoloide — por isso a dose é dez vezes maior. Polvilhe e misture no fouet; bater no liquidificador deixa a textura emborrachada.',
  },

  result: {
    title: 'Quanto usar',
    agent: 'Agente',
    amount: 'Quantidade',
    percent: '% do líquido',
    gels: 'Gelifica',
    thickens: 'Só engrossa',
    boil: 'Ferve',
    noBoil: 'Não precisa ferver',
    holds: 'Aguenta até',
    sets: 'Gelifica a',
    irreversible: 'Não derrete depois de pronto',
    gelsWhenHot: 'Gelifica no calor',
    pairNote: 'Iota e kappa andam juntas nesta receita: a mistura fica entre o gel macio de uma e o firme da outra.',
    empty: 'A fonte não publica dose de nenhum agente para esta textura.',
  },

  bloom: {
    title: 'Folha ou pó: a conversão pelo Bloom',
    lead: 'A receita pede pó e você tem folha — ou o contrário. O grau da gelatina muda o peso, e a fonte publica a fórmula exata em vez do palpite de "uma folha por colher".',
    grade: 'A gelatina que você tem',
    formula: 'peso novo = peso original × Bloom original ÷ Bloom novo',
    reference: 'A dose publicada é em pó Knox, de 225 Bloom',
    use: 'Use',
    sheets: 'folhas',
    sheetsNote: 'A contagem sai quebrada de propósito: meia folha a mais muda o gel, e arredondar aqui esconderia isso.',
    grades: {
      bronze: 'Bronze',
      silver: 'Prata',
      gold: 'Ouro',
      knox: 'Knox (pó)',
      platinum: 'Platina',
    },
    bloomLabel: 'Bloom',
    perSheet: 'g por folha',
    powder: 'pó',
    tableCaption: 'Graus de gelatina, como a fonte publica',
    sheetInsight:
      'Repare na tabela: quanto mais fraca a folha, mais pesada ela é. Bloom vezes peso por folha dá entre 400 e 460 nos quatro graus — as folhas são fabricadas para ter mais ou menos o mesmo poder de gelificação, e é por isso que receita em "número de folhas" funciona. Essa é a nossa leitura da tabela, não uma afirmação do livro.',
    directNote:
      'O livro também diz que ouro e platina podem substituir o pó Knox diretamente. Pela fórmula dele mesmo, isso erra uns 10% para cada lado. É atalho de cozinha; aqui usamos a fórmula.',
  },

  firmness: {
    title: 'O que mexe na firmeza',
    lead: 'A dose é o começo. O que mais está no líquido muda o gel, e McGee dá a direção de cada coisa — direção, não número: quem publicasse "aumente 20%" estaria inventando.',
    stronger: 'Firma mais',
    weaker: 'Firma menos',
    modifiers: {
      salt: 'Sal — atrapalha a ligação entre as moléculas de gelatina.',
      sugar: 'Açúcar — puxa água para longe da gelatina. A frutose é a exceção.',
      milk: 'Leite.',
      alcohol: 'Álcool — até chegar a 30–50% do gel, quando a gelatina precipita em grumos e o gel se perde.',
      acid: 'Ácido abaixo de pH 4 — vinagre, suco de fruta, vinho.',
    },
    compensate:
      'Sal e ácido se compensam com mais gelatina. Tanino de chá e de vinho tinto turva a geleia, precipitando a própria gelatina.',
  },

  truth: {
    title: 'Como sabemos que a regra está certa',
    body: [
      'A fonte confirma a si mesma três vezes na mesma página, e é isso que sustenta esta calculadora.',
      'A dose: a panna cotta dela tem 530 g de líquido — leite 30 g, creme 300 g, purê de framboesa 200 g — e a tabela imprime 4,3 g de gelatina. A regra de 0,8 g por 100 g dá 4,24 g: o livro arredondou a receita para cima. O que isso fixa é o que ele conta como líquido — com o açúcar junto daria 4,84 g, e só com os lácteos, 2,64 g.',
      'A fórmula de Bloom: o exemplo impresso converte 2,6 g de Knox em 3,7 g de prata, e 2,6 × 225 ÷ 160 = 3,66. As substituições impressas para prata (1,1 g) e bronze (1,3 g) por 100 g de líquido saem da mesma conta, partindo dos 0,8 g.',
      'O gel fluido: o molho de cebola leva 3,5 g de ágar para 500 g de leite de cebola, e a coluna de escala da receita imprime 0,7% — que é onde o gel fluido cai entre o molho espesso e o purê da página de instruções.',
    ],
  },

  spherification: {
    title: 'Esferificação',
    lead: 'Quanto líquido você vai esferificar, e por qual das duas técnicas. A dose do produto e a do banho saem separadas, porque são porcentagens de coisas diferentes.',
    liquid: 'Líquido a esferificar',
    liquidHint: 'A base com sabor que vira a esfera.',
    bath: 'Água do banho',
    bathHint: 'O banho é reaproveitável: faça um volume que caiba na sua vasilha.',
    method: 'Técnica',
    methods: {
      direct: 'Direta (caviar)',
      reverse: 'Reversa',
    },
    methodNotes: {
      direct: 'O alginato vai no líquido e a esfera cai num banho de cálcio. O cálcio entra e não para: em cerca de 30 minutos a esfera gelifica até o centro e vira textura única. Caviar se come na hora.',
      reverse: 'O cálcio vai no líquido e a esfera cai num banho de alginato. O alginato é molécula grande demais para entrar, então reage só na superfície: a membrana fecha e o miolo continua líquido. É a que se guarda.',
    },
    baseTitle: 'No líquido',
    bathTitle: 'No banho',
    optional: 'opcional',
    limitsTitle: 'O que a direta não aceita',
    limits: {
      fat: 'Gordura.',
      dairy: 'Laticínio, ou qualquer coisa que já tenha cálcio — o cálcio de dentro reagiria com o alginato antes da hora. É por isso que o molho de parmesão do curso é feito pela reversa.',
      alcohol: 'Álcool puro acima de 30°.',
      acid: 'Meio ácido: o alginato precipita. O citrato de sódio da lista existe justamente para corrigir a acidez da base.',
      irreversible: 'A reação não pode ser interrompida. Lavar a esfera não adianta: o cálcio já está dentro.',
    },
    additives: {
      alginate: 'Alginato de sódio',
      'calcium-chloride': 'Cloreto de cálcio',
      gluconolactate: 'Gluconolactato',
      xanthan: 'Goma xantana',
      'sodium-citrate': 'Citrato de sódio',
    },
    truthTitle: 'As receitas do curso',
    truthBody:
      'As duas receitas de caviar do próprio curso caem em 0,489% e 0,495% de alginato — consistentes entre si e um fio abaixo do piso de 0,5% que ele declara. Não é contradição, é onde a chef trabalha de fato dentro da faixa que publica: no piso dela. E nas oito receitas de esferificação reversa, o gluconolactato e a xantana ficam dentro das faixas genéricas do curso sem uma única exceção.',
  },

  sourceNote: {
    title: 'Sobre a fonte desta parte',
    body: [
      'As doses de esferificação e dos agentes novos vêm de material de curso — dois cursos de Rais Esteve, chefe de P&D do 100%Lab, publicados pela Scoolinary. Material de curso não é bibliografia, e a página prefere dizer isso a disfarçar: não tem paginação de livro, não tem bibliografia própria e não se abre de graça. Citamos por documento e número do slide.',
      'Também não é fonte impecável, e os defeitos estão registrados porque mudam o que se deve ler. O slide das proporções da esferificação direta imprime "xantana" duas vezes na mesma linha. E o slide da metilcelulose escreve "2%, 2 gramas por litro" — 2% de um litro são 20 g, erro de uma ordem de grandeza. Que é erro e não outra convenção, o próprio curso prova: ele acerta a mesma conversão na kappa e na gelana. Usamos as porcentagens e descartamos o parêntese.',
      'O que sustenta a confiança no resto é a coerência interna: as receitas do curso obedecem às proporções que ele mesmo enuncia, nas oito que dá para conferir. É o mesmo teste que validou o Wybauw na ganache e o Corvitto no gelato.',
    ],
  },

  ocr: {
    title: 'Uma nota sobre a fonte',
    body: [
      'O exemplar que temos de *Modernist Cuisine at Home* é digitalização com reconhecimento de texto, e reconhecimento de texto acerta nome e destrói número — o nosso troca "500 mL" por "S00 mL" em alguns lugares.',
      'Por isso toda dose desta página foi conferida na imagem da página impressa, não no texto extraído. A mesma conferência foi refeita nas quatro receitas de salmoura que já usavam este livro: as quatro estavam certas.',
    ],
  },

  glossary: {
    title: 'Glossário',
    full: 'Ver no glossário',
    noSource: 'Sem fonte na nossa bibliografia: a definição descreve a prática corrente, e nenhuma obra da estante a sustenta.',
    anchor: 'Endereço deste verbete',
    terms: {
      'hydrocolloid': {
        term: 'Hidrocoloide',
        definition:
          'Molécula longa que se dispersa na água e prende o líquido numa malha, engrossando ou gelificando. Gelatina, ágar, xantana e carragena são todos hidrocoloides; amido também, por outro caminho.',
      },
      'fluid-gel': {
        term: 'Gel fluido',
        definition:
          'Gel que firma por inteiro e depois é batido até virar líquido de novo. Fica espesso na colher e afina na boca, com textura mais cremosa que a de um molho engrossado com amido ou xantana.',
      },
      'bloom-strength': {
        term: 'Bloom',
        definition:
          'Medida da força de gelificação da gelatina, do nome de Oscar Bloom, que inventou o aparelho. Quanto maior o número, mais firme o gel para a mesma quantidade. Folhas vendidas como bronze, prata, ouro e platina correspondem a faixas de Bloom crescentes.',
      },
      'spherification': {
        term: 'Esferificação',
        definition:
          'Técnica que usa alginato, extraído de algas pardas, que só gelifica na presença de cálcio. Uma solução de alginato sem cálcio é pingada ou injetada numa solução de cálcio e gelifica na hora, formando esferas ou fios com casca fina e miolo líquido.',
      },
    },
  },


  audit: {
    title: 'Confira a dose que você já usou',
    lead: 'Diga o líquido, o agente e quanto você pesou. Se a dose não bate com a textura que você queria, a página diz em que textura ela bate — porque essa costuma ser a resposta: não houve erro de conta, houve outro produto.',

    textureLabel: 'Textura que você queria',
    agentLabel: 'Agente que você usou',
    liquid: 'Líquido da sua receita',
    agentWeight: 'Agente que você pesou',

    dosePercent: 'Dose sobre o líquido',
    agentSubject: 'o agente',

    noDose: 'As fontes da estante não publicam dose deste agente para esta textura. Sem faixa publicada não há o que conferir — e inventar uma seria pior que ficar calado.',
    alsoLands: 'Com este agente, essa mesma dose cai também em:',
  },
  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Os números são todos de uma obra só, e a página diz isso. O McGee entra para o que ele faz melhor que ninguém: explicar por que sal, açúcar e ácido mudam o gel — sem publicar quanto, que é o que ele honestamente não tem.',
    page: 'p.',
    section: 'cap.',
  },
} ;
