export const curingPtBR = {
  meta: {
    title: 'Cura de carnes: nitrito em ppm',
    description:
      'Quanto sal de cura pesar por quilo de carne, em ppm de nitrito, com a norma brasileira e a americana lado a lado — e a diferença entre elas explicada.',
    keywords: [
      'calculadora de cura',
      'sal de cura ppm',
      'quanto sal de cura por quilo',
      'nitrito de sódio limite',
      'cure 1 cure 2',
      'charcutaria caseira',
      'ANVISA nitrito carne',
      'botulismo cura de carne',
    ],
    imageAlt:
      'Cartão da calculadora de cura, com o título e as normas que sustentam os números.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Quanto sal de cura #1 por quilo de carne?',
        answer:
          'Para 150 ppm de nitrito de entrada, 2,4 g de cura #1 por quilo. O cura #1 é 6,25% de nitrito de sódio, então a conta é ppm × quilos ÷ 62,5. A 120 ppm são 1,9 g e a 156 ppm, o teto americano para carne moída, são 2,5 g.',
      },
      {
        question: 'Qual o limite de nitrito no Brasil?',
        answer:
          'A norma em vigor é a Instrução Normativa 211/2023 da ANVISA, que fixa 150 mg/kg como resíduo máximo — e conta a soma de nitrito e nitrato, expressa como nitrito de sódio. Repare que é resíduo no produto pronto, não o que você pesa: são grandezas diferentes.',
      },
      {
        question: 'Por que uns dizem 150 e outros 156?',
        answer:
          'Porque comparam coisas diferentes. Os 156 ppm americanos são limite de entrada em carne moída, o que se adiciona. Os 150 mg/kg brasileiros são resíduo, o que pode sobrar no produto pronto. Na mesma base, o resíduo máximo é 150 no Brasil e 200 nos Estados Unidos.',
      },
      {
        question: 'Posso usar menos nitrito para ser mais seguro?',
        answer:
          'Não. Nitrito de menos é o lado perigoso: é ele que impede o Clostridium botulinum de produzir toxina em produto curado. O FSIS exige mínimo de 120 ppm de entrada em curados que ficam refrigerados. Abaixo disso você tem carne salgada com cor bonita, não carne curada.',
      },
      {
        question: 'Qual a diferença entre cura #1 e cura #2?',
        answer:
          'O #1 tem só nitrito, 6,25%, e serve para o que vai ser cozido, defumado a frio ou comido em pouco tempo. O #2 acrescenta 4% de nitrato, que se converte em nitrito devagar, e é para peça curada ao ar por semanas ou meses. Nos Estados Unidos o nitrato é proibido em bacon.',
      },
    ],
  },

  eyebrow: 'Calculadora de cura',
  title: 'Nitrito em ppm, na norma que vale aqui',
  lead: 'Diga o peso da carne e o alvo em ppm; a calculadora diz quanto sal de cura pesar. Esta é a única página do site em que errar o número não estraga o jantar — dá botulismo. Por isso todo limite aqui vem de norma, com o texto legal citado.',

  danger: {
    title: 'Antes de qualquer coisa',
    body: 'Cura não é tempero. O nitrito existe para impedir o Clostridium botulinum de produzir toxina em ambiente sem oxigênio, que é exatamente o que um embutido é por dentro. Pouco não protege; muito é tóxico. Pese em balança de precisão, nunca em colher, e nunca improvise a dose porque a peça "é pequena".',
  },

  input: {
    label: 'A sua peça',
    meat: 'Peso da carne (g)',
    meatHint: 'Só a carne e a gordura. Tempero e líquido não entram na conta do ppm.',
    cure: 'Sal de cura',
    method: 'Como vai curar',
    target: 'Nitrito de entrada (ppm)',
    targetHint: 'O padrão é 150, dentro do que as duas normas suportam.',
  },

  cures: {
    'cure-1': 'Cura #1 (6,25% nitrito)',
    'cure-2': 'Cura #2 (6,25% nitrito + 4% nitrato)',
    peklosol: 'Peklosol (0,6% nitrito)',
  },

  cureNotes: {
    'cure-1':
      'Nitrito puro, sem nitrato. Para o que vai ser cozido, defumado a frio ou consumido em poucos dias.',
    'cure-2':
      'Traz nitrato junto, que vira nitrito devagar ao longo de semanas. Para peça curada ao ar, tipo salame e presunto cru. Proibido em bacon nos Estados Unidos.',
    peklosol:
      'A régua europeia: sal de cura muito mais diluído, feito para substituir o sal comum da receita em vez de entrar em pitada. Repare no salto na quantidade a pesar.',
  },

  methods: {
    comminuted: 'Carne moída ou embutido',
    dry: 'Cura seca em peça inteira',
    comminutedHint:
      'A dose entra na massa inteira e fica lá. É o caso mais restrito: teto de 156 ppm.',
    dryHint:
      'O sal fica na superfície e boa parte nunca chega ao centro, então a norma americana permite bem mais na aplicação — 625 ppm. Não é licença para dosar assim em massa moída.',
  },

  result: {
    title: 'O que pesar',
    cure: 'Sal de cura',
    salt: 'Sal comum que vem junto',
    saltHint:
      'O sal de cura é quase todo sal comum. Desconte isto do sal da sua receita, ou o produto sai salgado demais.',
    nitrite: 'Nitrito de entrada',
    nitrate: 'Nitrato de entrada',
    perKilo: 'por quilo de carne',
  },

  status: {
    ok: 'Dentro da faixa',
    belowMinimum: 'Abaixo do mínimo seguro',
    aboveLimit: 'Acima do teto do método',
    minimum: 'Mínimo de entrada',
    ceiling: 'Teto do método',
    belowBody:
      'Abaixo de 120 ppm de entrada a cura não cumpre a função que a justifica: segurar o botulismo. O FSIS trata esse piso como política para curados refrigerados, e não como sugestão. Suba a dose, ou garanta a segurança por outro caminho — cozimento, acidez ou controle de umidade — e aí não chame de curado.',
    aboveBody:
      'Passou do que a norma americana permite adicionar por este método. Não há teto de entrada na norma brasileira, mas ultrapassar o americano quase certamente estoura o resíduo permitido aqui, que é mais baixo que o de lá.',
  },

  limits: {
    title: 'Os dois limites, e por que não se comparam',
    lead: 'Esta é a divergência que mais importa do site inteiro, e quase toda calculadora de charcutaria em inglês passa por cima dela.',
    ingoingTitle: 'Entrada — o que você pesa',
    ingoingBody:
      'Os Estados Unidos fixam quanto se pode adicionar, e o valor muda com o método: 156 ppm em carne moída, 625 ppm em cura seca. É o que esta calculadora computa, porque é o que você tem na mão.',
    residualTitle: 'Resíduo — o que sobra no produto pronto',
    residualBody:
      'O Brasil regula por aqui: no máximo 150 mg/kg, contando nitrito e nitrato somados e expressos como nitrito de sódio. Os Estados Unidos permitem 200 ppm de resíduo. Resíduo não se calcula a partir da entrada — o nitrito reage e decai durante a cura, e só análise no produto pronto mede quanto sobrou.',
    honesty:
      'Consequência honesta: esta calculadora não certifica conformidade com a norma brasileira. Ela dá a entrada, compara com o teto americano — o único de entrada que existe — e deixa claro que o número brasileiro é de outra natureza. Quem produz para vender precisa de análise laboratorial, não de calculadora.',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'Sal de cura é sal comum com uma fração pequena de nitrito de sódio. O cura #1 é 6,25% de nitrito; o Peklosol europeu, 0,6%. A conta que a calculadora faz é uma regra de três sobre essa fração: para chegar a 150 ppm de nitrito num quilo de carne você precisa de 0,15 g de nitrito, e para ter 0,15 g de nitrito a 6,25% você pesa 2,4 g de cura #1.',
      'O que justifica a ferramenta não é a álgebra, é o resto: a fração muda com o produto, o teto legal muda com o método, existe um piso abaixo do qual a cura não protege, e o limite brasileiro é de uma grandeza diferente da americana. São quatro coisas fáceis de errar, e a consequência do erro é séria.',
      'Toda dose sai em gramas com uma casa decimal porque é assim que se pesa: balança de precisão de 0,1 g custa pouco e é o único instrumento aceitável aqui. Colher de chá de sal de cura varia de 5 a 7 g conforme a mão, o que numa peça de 1 kg é a diferença entre 130 e 180 ppm.',
    ],
  },

  divergence: {
    title: 'Quando as fontes divergem',
    lead: 'Duas normas, dois livros, e três desacordos que valem conhecer.',
    columns: {
      topic: 'Assunto',
      sources: 'O que cada fonte diz',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Limite legal',
        sources:
          'ANVISA: 150 mg/kg de resíduo, somando nitrito e nitrato. FSIS: 156 ppm de entrada em moído, 200 ppm de resíduo.',
        decision:
          'Mostra os dois e diz que são grandezas diferentes. Calcula entrada, que é o que se pesa, e não promete conformidade com resíduo.',
      },
      {
        topic: 'Dose de trabalho',
        sources:
          'Marianski tabela até 156 ppm e chama de máximo. Ruhlman usa 25 g de cura #1 para 11,25 kg, que dá 139 ppm.',
        decision:
          'O padrão é 150 ppm, que fica entre os dois e cabe nas duas normas. Os dois valores aparecem citados.',
      },
      {
        topic: 'Nitrato em cura longa',
        sources:
          'Marianski: cura #2 para tudo que cura ao ar sem cozimento. ANVISA soma nitrato ao nitrito no mesmo teto de resíduo.',
        decision:
          'Com o #2, mostra os dois em ppm separados, porque é assim que a norma brasileira conta o total.',
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
      ppm: {
        term: 'ppm',
        definition:
          'Partes por milhão. Um ppm é um miligrama por quilo. Cento e cinquenta ppm de nitrito em 1 kg de carne são 0,15 g de nitrito — daí a necessidade de diluí-lo em sal antes de chegar perto de uma balança de cozinha.',
      },
      ingoing: {
        term: 'Entrada (ingoing)',
        definition:
          'Quanto de nitrito é adicionado à carne, medido sobre o peso dela. É o que a calculadora computa e o que a norma americana limita por método.',
      },
      residual: {
        term: 'Resíduo',
        definition:
          'Quanto de nitrito sobra no produto pronto, depois de reagir com a carne e decair. É o que a norma brasileira limita, e só se conhece por análise laboratorial.',
      },
      'cure-1': {
        term: 'Cura #1',
        definition:
          'Sal de cura com 6,25% de nitrito de sódio e o resto sal comum, tingido de rosa para não ser confundido com sal de mesa. Também chamado de Prague Powder #1, Insta Cure #1 ou sal de cura rápida.',
      },
      'cure-2': {
        term: 'Cura #2',
        definition:
          'O mesmo 6,25% de nitrito mais 4% de nitrato de sódio. O nitrato funciona como reserva: bactérias o convertem em nitrito ao longo de semanas, o que sustenta a proteção numa peça que cura ao ar por meses.',
      },
      botulism: {
        term: 'Clostridium botulinum',
        definition:
          'A bactéria que a cura existe para conter. Cresce sem oxigênio, exatamente a condição do interior de um embutido, e produz uma das toxinas mais potentes que se conhece. Não altera cheiro nem aparência do produto.',
      },
    },
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Duas normas e dois livros. Os limites saem das normas, lidas no texto original; os livros entram para a composição dos sais de cura e para as doses de trabalho.',
    page: 'p.',
    section: 'seção',
  },
};
