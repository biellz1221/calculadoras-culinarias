export const ganachePtBR = {
  meta: {
    title: 'Ganache: proporção por textura',
    description:
      'Quanto chocolate e manteiga para o creme que você tem, pela textura que quer — e o prazo de validade que quase nenhuma receita de ganache publica.',
    keywords: [
      'calculadora de ganache',
      'proporção ganache creme chocolate',
      'ganache para trufa',
      'ganache para bombom recheado',
      'validade da ganache',
      'atividade de água ganache',
      'ganache chocolate branco',
      'quanto creme para ganache',
    ],
    imageAlt:
      'Cartão da calculadora de ganache, com o título e a obra que sustenta as proporções.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Qual a proporção de ganache?',
        answer:
          'Não existe uma: existe uma por textura. Para 100 g de creme, Wybauw usa 110 g de chocolate na ganache de trufa, 120 g mais 14 g de manteiga no bombom moldado, 120 g mais 25 g de manteiga na de bico, e de 130 a 180 g mais 24 a 30 g de manteiga no praliné cortado. O "1 para 1" da internet é uma das quatro, não a regra.',
      },
      {
        question: 'Quanto tempo dura uma ganache?',
        answer:
          'Três semanas. Wybauw é direto: produtos com atividade de água entre 0,85 e 1, "such as many ganache recipes", têm validade de apenas três semanas. E congelar não estende — um bombom de três semanas congelado por oito meses continua tendo três semanas depois de descongelado.',
      },
      {
        question: 'Muda alguma coisa se o chocolate for branco?',
        answer:
          'Muda: o branco precisa de cerca de 2% de manteiga de cacau extra sobre a receita para dar a mesma textura, porque a gordura dele é 8% de gordura do leite dentro dos 36% totais. A proporção de chocolate em si não muda.',
      },
      {
        question: 'Serve para qualquer chocolate?',
        answer:
          'A tabela foi escrita para couverture amargo com 36 a 38% de manteiga de cacau e ao leite com 36 a 37% de gordura total. O próprio autor avisa que couverture muito fora dessa faixa dá "a completely different result", e não publica correção. Chocolate com 70% ou mais de cacau traz manteiga de cacau demais e pede menos chocolate — quanto menos, ele não diz.',
      },
      {
        question: 'Por que a minha ganache talhou?',
        answer:
          'Porque o equilíbrio entre água, gordura e matéria seca saiu da faixa. Ganache é uma emulsão de água em gordura, e as duas não se ligam sozinhas: são os açúcares e o cacau seco que fazem a ponte. Faltando ou sobrando um dos três, a mistura talha, fica granulosa, dura demais ou líquida demais.',
      },
    ],
  },

  eyebrow: 'Calculadora de ganache',
  title: 'A proporção muda com a textura que você quer',
  lead: 'Diga quanto creme tem e o que vai fazer com a ganache. A calculadora entrega o chocolate e a manteiga da tabela de Wybauw, a água que a receita carrega e o prazo de validade — que é o número que quase nenhuma receita de ganache publica.',

  input: {
    label: 'A sua receita',
    soft: 'Creme (g)',
    softHint:
      'A base 100 da tabela é "substâncias moles": creme, leite, licor, açúcar invertido, glicose. A conta de água supõe creme.',
    texture: 'O que vai fazer',
    chocolate: 'Chocolate',
  },

  textures: {
    truffle: 'Bola de trufa',
    moulded: 'Bombom moldado',
    piped: 'De bico, para banhar',
    cut: 'Praliné cortado',
  },

  textureNotes: {
    truffle:
      'A mais mole das quatro e a única sem manteiga: 110 de chocolate para 100 de creme. Feita para ser boleada e passada em cacau.',
    moulded:
      'A ganache macia que vai dentro da casquinha de chocolate. A casca sustenta, então o recheio pode ser mole.',
    piped:
      'Firme o bastante para segurar o formato do bico e depois receber o banho. Leva quase o dobro da manteiga da moldada.',
    cut: 'A mais firme: precisa aguentar ser cortada em quadrados sem se deformar. É a única em que o livro dá faixa, e uma faixa larga.',
  },

  chocolates: {
    dark: 'Amargo',
    milk: 'Ao leite',
    white: 'Branco',
    darkNote:
      'A tabela foi escrita para couverture amargo com 36 a 38% de manteiga de cacau.',
    milkNote:
      'Para couverture ao leite com 36 a 37% de gordura total, dos quais cerca de 6% de gordura do leite.',
    whiteNote:
      'O branco tem cerca de 8% de gordura do leite dentro dos 36% de gordura total, e por isso precisa de manteiga de cacau extra para chegar à mesma textura.',
  },

  result: {
    title: 'O que pesar',
    chocolate: 'Chocolate',
    butter: 'Manteiga',
    extra: 'Manteiga de cacau extra',
    extraHint:
      'Dois por cento da receita, só no branco, para compensar a gordura do leite e chegar à mesma textura.',
    total: 'Ganache pronta',
    water: 'Água na receita',
    waterHint:
      'Somada dos teores publicados: 60% do creme e 17% da manteiga. É a grandeza que decide a validade, e a alavanca que o livro manda mexer para prolongá-la.',
    waterShare: 'Água sobre o total',
    ratio: 'Chocolate sobre o creme',
    none: 'Esta textura não leva',
  },

  shelf: {
    title: 'Três semanas, e congelar não muda isso',
    lead: 'O dado que quase nenhuma receita de ganache publica, e o que faz dele um dado e não um palpite.',
    weeks: 'semanas',
    body: 'Wybauw traduz atividade de água em prazo: produtos entre 0,85 e 1 de Aw, "such as many ganache recipes", duram três semanas. Entre 0,6 e 0,85, como creme de manteiga, chegam a cerca de três meses. Abaixo de 0,6 nada cresce.',
    freezing:
      'E a armadilha: "Freezing never extends shelf life." O exemplo é do próprio livro — um bombom com três semanas de validade, congelado por oito meses, continua com três semanas depois de descongelado. O congelador para o relógio; não o atrasa.',
    awTitle: 'O que cresce em cada faixa',
    awRows: [
      { range: 'acima de 0,9', body: 'bactérias, inclusive salmonela e listeria' },
      { range: 'acima de 0,8', body: 'fungos prosperam' },
      { range: 'acima de 0,75', body: 'leveduras crescem' },
      { range: 'acima de 0,6', body: 'leveduras e bolores osmofílicos' },
      { range: 'abaixo de 0,6', body: 'nada vive; deterioração microbiológica está excluída' },
    ],
    honesty:
      'Esta calculadora não calcula o Aw da sua receita, e isso é deliberado. Atividade de água não é média dos Aw dos ingredientes: depende do que está dissolvido na água livre, do peso molecular dessas substâncias, da temperatura e da embalagem — o próprio livro lista esses fatores. O que dá para somar com honestidade é a água, e é o que a página faz.',
    ingredients: 'Atividade de água medida, por ingrediente',
  },

  method: {
    title: 'Como o cálculo funciona',
    body: [
      'Ganache é uma emulsão de água em gordura, e as duas não se ligam sozinhas. Quem faz a ponte é a matéria seca: os açúcares e o cacau em pó do chocolate. São três grandezas em equilíbrio, e não duas — é por isso que trocar a marca do chocolate muda o resultado sem que a proporção mude, e por isso que "1 para 1" não descreve nada sozinho.',
      'A tabela do Wybauw resolve isso pelo destino: cada textura tem a sua proporção, medida sobre 100 de substância mole. A calculadora guarda a razão publicada e multiplica pelo creme que você tem. Nada mais que isso — a conta é curta, e o que ela vale está na tabela, não na aritmética.',
      'O livro publica a mesma tabela duas vezes, em razão e em porcentagem, e é isso que dá confiança numa transcrição feita a partir de um PDF com ruído de leitura: as quatro linhas de porcentagem somam 100 exatos e ficam a menos de um ponto e meio das razões. Guardamos as razões, porque as porcentagens foram ajustadas para fechar em 100 — na linha do bico, 100:120:25 dá 40,8 / 49,0 / 10,2 e o livro imprime 40 / 50 / 10.',
      'A água sai de dois números publicados: creme tem 60% de água e manteiga tem 17%. Somá-los dá a grandeza que decide a validade. O Aw, não: ele é medido, não deduzido, e a tabela medida está na página inteira em vez de virar uma estimativa nossa.',
    ],
  },

  divergence: {
    title: 'Uma fonte só, e por quê',
    lead: 'Esta é a única calculadora do site sustentada por um livro apenas. Num site cujo argumento é mostrar divergência, isso precisa estar escrito.',
    columns: {
      topic: 'Assunto',
      sources: 'O que temos',
      decision: 'O que a calculadora faz',
    },
    items: [
      {
        topic: 'Proporção por textura',
        sources:
          'Só Wybauw. O contraponto natural seria Greweling, e o exemplar que temos é digitalização em imagem: 200 páginas sem camada de texto.',
        decision:
          'Entrega a tabela do Wybauw e diz que é de um autor só. Quando o Greweling virar texto conferido, a divergência entra aqui.',
      },
      {
        topic: 'Faixa do praliné cortado',
        sources:
          'O próprio livro dá 130 a 180 de chocolate e 24 a 30 de manteiga — uma faixa larga, e a porcentagem que ele publica ao lado corresponde ao pé dela.',
        decision:
          'Mostra a faixa inteira em vez da média. Média de uma faixa que a fonte deixou aberta seria invenção nossa.',
      },
      {
        topic: 'Couverture fora da faixa',
        sources:
          'Wybauw declara a dele — 36 a 38% de manteiga de cacau — e avisa que fora disso o resultado muda completamente. Não publica a correção.',
        decision:
          'Diz a faixa e diz que não tem a correção. Estimar seria exatamente o que este site não faz.',
      },
      {
        topic: 'Atividade de água',
        sources:
          'A tabela do livro é medida, ingrediente por ingrediente. Não há fórmula publicada para deduzir o Aw de uma receita a partir dela.',
        decision:
          'Mostra a tabela medida e soma a água, que é somável. Não calcula Aw.',
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
      ganache: {
        term: 'Ganache',
        definition:
          'Recheio à base de água e gordura, em que as duas só se mantêm juntas por causa da matéria seca — açúcares e cacau em pó — que faz a ponte entre elas.',
      },
      'soft-substances': {
        term: 'Substâncias moles',
        definition:
          'A base 100 da tabela de proporções: creme, leite, licor, açúcar invertido, glicose. Não é sinônimo de creme de leite, ainda que seja o caso mais comum.',
      },
      couverture: {
        term: 'Couverture',
        definition:
          'Chocolate com teor de manteiga de cacau alto o bastante para fluir fino ao ser derretido. As proporções desta página foram escritas para couverture de 36 a 38% de manteiga de cacau.',
      },
      'water-activity': {
        term: 'Atividade de água (Aw)',
        definition:
          'A fração da água de um alimento que está livre, e não presa a açúcares, sais ou proteínas. É a água livre que os micro-organismos usam, e por isso o Aw prevê a deterioração melhor que o teor de água total.',
      },
      precrystallising: {
        term: 'Pré-cristalização',
        definition:
          'Levar a manteiga de cacau da ganache à forma cristalina estável antes de ela endurecer. Ganache não pré-cristalizada tem validade menor, resseca mais rápido, perde aroma antes e pode ficar granulosa.',
      },
      syneresis: {
        term: 'Fat bloom',
        definition:
          'A camada esbranquiçada que aparece na superfície do chocolate quando a gordura migra e recristaliza. Wybauw lista a ganache não pré-cristalizada entre as causas de ele aparecer mais cedo.',
      },
    },
  },

  sources: {
    title: 'Fonte desta calculadora',
    lead: 'Um livro só, e a página diz isso em vez de disfarçar. Wybauw é a referência técnica de bombom recheado, e é dele tanto a tabela de proporções quanto os dados de atividade de água que nenhuma outra obra da estante traz.',
    page: 'p.',
    section: 'seção',
  },
};
