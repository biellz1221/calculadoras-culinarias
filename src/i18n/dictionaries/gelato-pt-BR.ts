/**
 * Dicionário canônico da calculadora de gelato.
 *
 * As chaves de `ingredients` são os 164 ids da planilha de origem, que são
 * slugs em português porque a planilha é brasileira. O id é dado; o rótulo é
 * texto de interface e existe nos dois idiomas.
 *
 * O arquivo passa de 300 linhas por causa dessa tabela de rótulos. É tabela de
 * tradução, não lógica: quebrar em dois arquivos só esconderia o tamanho e
 * ainda tiraria a garantia de compilação que `typeof gelatoPtBR` dá ao inglês.
 */
export const gelatoPtBR = {
  meta: {
    title: 'Calculadora de gelato',
    description:
      'Monte a base em gramas e veja açúcares, gordura, sólidos, POD e PAC contra a faixa do seu tipo de gelato. Lote em litros e 164 ingredientes.',
    keywords: [
      'calculadora de gelato',
      'balanceamento de gelato',
      'POD e PAC',
      'sólidos totais gelato',
      'receita de sorbet',
      'base de gelato',
      'gelato caseiro',
      'anticongelante do sorvete',
    ],
    imageAlt:
      'Cartão da calculadora de gelato, com o título e a origem dos parâmetros de balanceamento.',
  },

  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'O que são POD e PAC?',
        answer:
          'POD é o poder de doçura e PAC o poder anticongelante, os dois medidos por quilo de mistura. São eles que explicam por que duas receitas com a mesma quantidade de açúcar podem ter doçura e textura bem diferentes: cada açúcar adoça e abaixa o ponto de congelamento no seu ritmo.',
      },
      {
        question: 'Quanto açúcar leva um gelato?',
        answer:
          'De 14 a 22% da mistura num gelato de leite, e de 23 a 32% num sorbet. O sorbet pede mais porque não tem gordura nem sólidos do leite segurando a água: ali o açúcar faz o trabalho sozinho.',
      },
      {
        question: 'Por que o gelato fica duro na geladeira?',
        answer:
          'Quase sempre é PAC baixo. Num gelato de leite a faixa vai de 220 a 300 por quilo de mistura; abaixo disso sobra água livre para congelar e a bola vira pedra. A calculadora aponta a métrica fora da faixa e diz o que mexer.',
      },
      {
        question: 'Para que servem os sólidos totais?',
        answer:
          'São tudo o que não é água na receita, de 34 a 42% num gelato de leite. Sólido de menos deixa o gelato aguado e cheio de cristal; sólido demais deixa a textura pesada e emborrachada.',
      },
    ],
  },

  eyebrow: 'Calculadora de gelato',
  title: 'Gelato equilibrado antes de ir para a máquina',
  lead: 'Monte a receita em gramas e a calculadora mostra, linha a linha, o que ela faz com os açúcares, a gordura, os sólidos e o ponto de congelamento. Cada métrica é comparada com a faixa do tipo de base, e quando alguma sai da faixa, a tela diz o que fazer.',

  presetLabel: 'Receita de partida',

  presets: {
    'fior-di-latte': 'Fior di latte',
    'morango-ao-leite': 'Morango ao leite',
    'sorbet-morango': 'Sorbet de morango',
    'chocolate-agua': 'Chocolate na água',
    'coco-vegano': 'Coco e caju (vegano)',
  },

  baseLabel: 'Tipo de base',

  bases: {
    'gelato-leite': {
      name: 'Gelato de leite',
      description: 'Base branca clássica, sem fruta.',
    },
    'gelato-leite-fruta': {
      name: 'Gelato de leite com fruta',
      description: 'Base de leite com polpa ou fruta in natura.',
    },
    sorbet: {
      name: 'Sorbet',
      description: 'Base de água com fruta, sem laticínios.',
    },
    'chocolate-agua': {
      name: 'Chocolate em base de água',
      description: 'Chocolate sem leite, estruturado por cacau.',
    },
    'base-vegana': {
      name: 'Base vegana',
      description: 'Leites e gorduras vegetais no lugar do leite.',
    },
  },

  batch: {
    title: 'Tamanho do lote',
    liters: 'Volume do lote',
    litersUnit: 'L',
    shortcuts: 'Atalhos de volume',
    density: 'Densidade da calda',
    densityUnit: 'g/mL',
    densityHint:
      'O padrão é 1,10 g/mL. A massa da calda sai de litros × 1000 × densidade.',
    mass: 'Massa da calda',
    rescaleHint:
      'Mudar o volume ou a densidade reescala a receita inteira, preservando as proporções.',
    driftAbove: 'A receita está acima da meta do lote em',
    driftBelow: 'A receita está abaixo da meta do lote em',
    scaleToBatch: 'Ajustar ao lote',
  },

  picker: {
    label: 'Buscar ingrediente',
    placeholder: 'Digite parte do nome',
    hint: 'São 164 ingredientes da planilha, agrupados por categoria. Setas para navegar, Enter para adicionar.',
    empty: 'Nenhum ingrediente com esse nome.',
    truncated: 'Mostrando os primeiros resultados. Refine a busca para ver o resto.',
    listLabel: 'Ingredientes encontrados',
  },

  categories: {
    custom: 'Meus ingredientes',
    base: 'Bases',
    liquido: 'Líquidos',
    laticinio: 'Laticínios e ovos',
    acucar: 'Açúcares e adoçantes',
    fruta: 'Frutas',
    chocolate: 'Chocolate e cacau',
    pasta: 'Pastas e oleaginosas',
    vegetal: 'Vegetais e bases vegetais',
    estabilizante: 'Estabilizantes e fibras',
    aroma: 'Aromas e temperos',
    confeitaria: 'Confeitaria e biscoitos',
    alcool: 'Álcoois e licores',
  },

  table: {
    caption: 'Ingredientes da receita, com a quantidade editável',
    ingredient: 'Ingrediente',
    amount: 'Quantidade',
    share: '% do lote',
    solids: 'Sólidos',
    remove: 'Remover',
    total: 'Total',
    empty: 'A receita está vazia.',
    emptyHint: 'Escolha uma receita de partida acima ou busque um ingrediente.',
    editHint:
      'Toda quantidade é editável e o balanço recalcula na hora. Até 2 L os valores aparecem em gramas; acima disso, em quilos.',
    unknown: 'Ingrediente fora do catálogo',
    flagged: 'Composição inconsistente na planilha',
  },

  balance: {
    title: 'Balanço da base',
    balanced: 'Equilibrada',
    outOfRangeOne: 'métrica fora da faixa',
    outOfRangeMany: 'métricas fora da faixa',
    empty: 'Sem ingredientes',
    recommended: 'Faixa do tipo de base',
    perKg: 'por kg de calda',
    ofMass: '% da massa',
    status: {
      below: 'Abaixo da faixa',
      in: 'Na faixa',
      above: 'Acima da faixa',
    },
    servingTemp: 'Temperatura média de serviço',
    servingTempHint:
      'Estimada como PAC ÷ 25. É a temperatura em que a base costuma ficar boleável na vitrine.',
    totalMass: 'Massa total',
    protein: 'Proteína',
    autoBalance: 'Equilibrar automaticamente',
    autoBalanceHint:
      'O otimizador ajusta as outras linhas e mira a massa total na meta do lote. Cada linha só pode variar de um quarto a quatro vezes a quantidade atual. Sem esse piso ele zeraria o estabilizante, que quase não mexe nas métricas e por isso parece descartável.',
    keptFixed: 'Mantendo fixa a linha que você editou por último:',
    solved: 'Pronto: as oito métricas voltaram para a faixa do tipo de base.',
    partial: 'Ajustei o que deu. Continuam fora da faixa:',
    unchanged:
      'Não dá para equilibrar mexendo só nas outras linhas: elas já estão no limite que o otimizador pode mexer. Troque um ingrediente ou mude o tipo de base.',
  },

  metrics: {
    sugars: {
      label: 'Açúcares',
      help: 'Sacarose e equivalentes. Puxam doçura, corpo e ponto de congelamento ao mesmo tempo.',
    },
    fats: {
      label: 'Gorduras',
      help: 'Gordura total, venha do leite, do ovo, do chocolate ou da oleaginosa. É o que dá cremosidade.',
    },
    msnf: {
      label: 'SNGL',
      help: 'Sólidos não gordurosos do leite: proteína, lactose e minerais. Dão estrutura e seguram a água.',
    },
    otherSolids: {
      label: 'Outros sólidos',
      help: 'Sólidos que não são açúcar, gordura nem SNGL: fibras, cacau, neutro, polpa de fruta.',
    },
    totalSolids: {
      label: 'Sólidos totais',
      help: 'Tudo que não é água. Define o rendimento e a resistência ao derretimento.',
    },
    water: {
      label: 'Água',
      help: 'Água livre da mistura. O que não estiver preso por açúcar ou sólido vira cristal de gelo.',
    },
    pod: {
      label: 'POD',
      help: 'Poder de doçura por kg de calda, com a sacarose como régua.',
    },
    pac: {
      label: 'PAC',
      help: 'Poder anticongelante por kg de calda. É ele que decide a dureza na vitrine.',
    },
  },

  hints: {
    sugars: {
      below: 'Aumente sacarose ou dextrose.',
      above: 'Reduza os açúcares ou aumente a parte líquida.',
    },
    fats: {
      below: 'Aumente creme de leite, gema ou pasta de oleaginosa.',
      above: 'Troque parte do creme por leite.',
    },
    msnf: {
      below: 'Acrescente leite em pó desnatado.',
      above: 'Reduza o leite em pó: o excesso deixa a textura arenosa.',
    },
    otherSolids: {
      below: 'Acrescente fibra, cacau ou neutro.',
      above: 'Reduza fibras, cacau ou polpa concentrada.',
    },
    totalSolids: {
      below: 'Aumente os sólidos: leite em pó, açúcar ou fibra.',
      above: 'Aumente a água ou reduza os pós.',
    },
    water: {
      below: 'Acrescente água ou leite.',
      above: 'Reduza os líquidos ou aumente os sólidos.',
    },
    pod: {
      below: 'Troque parte da dextrose por sacarose ou frutose.',
      above: 'Troque parte da sacarose por glucose em pó ou maltodextrina.',
    },
    pac: {
      below: 'Aumente a dextrose ou o açúcar invertido.',
      above: 'Troque dextrose por sacarose ou glucose em pó.',
    },
  },

  flaws: {
    title: 'Ingredientes com composição inconsistente na planilha',
    lead: 'Em 14 dos 164 ingredientes a composição declarada na planilha de origem não fecha. O dado não foi corrigido aqui: a procedência é a planilha, e mudar número de fonte em silêncio é justamente o que este site não faz. O aviso existe para você saber onde o resultado fica menos confiável.',
    severity: {
      severe: 'Muda o resultado',
      mild: 'Desvio de planilha',
    },
    issues: {
      'no-composition':
        'Sólidos e água somam zero: o ingrediente entra como massa pura e dilui todas as métricas sem aparecer em nenhuma delas.',
      'solids-contradicted':
        'As parcelas declaram sólidos, mas o total de sólidos está zerado: é um sólido cadastrado como 100% água. O motor lê o total, então a composição real não entra na conta.',
      closure: 'Sólidos mais água não somam 100% da massa do ingrediente.',
      parts:
        'Açúcares, gorduras, SNGL e outros sólidos não somam o total de sólidos declarado.',
    },
  },

  nutrition: {
    title: 'Estimativa nutricional',
    lead: 'Derivada da composição da planilha, não de análise laboratorial. Serve para orientar quem monta a receita, mas não é rotulagem e não substitui laudo.',
    nutrient: 'Nutriente',
    portion: 'Porção de',
    portionHint: 'uma bola pequena',
    per100: '100 g',
    per100Hint: 'referência',
    batch: 'Lote inteiro',
    energy: 'Energia',
    carbs: 'Carboidratos',
    ofWhichSugars: 'dos quais açúcares',
    fats: 'Gorduras',
    protein: 'Proteínas',
    method:
      'Carboidratos saem por diferença (sólidos totais menos gordura e proteína), como se faz em rotulagem, e por isso incluem fibras e polióis. A energia usa Atwater: 4 kcal/g para carboidrato e proteína, 9 para gordura.',
    adjusted:
      'Com fator de energia próprio, em vez de Atwater (poliol, fibra ou álcool):',
  },

  method: {
    title: 'Como o balanceamento funciona',
    body: [
      'Cada ingrediente da planilha é descrito como a composição de 1 grama dele: quanto é açúcar, quanto é gordura, quanto é sólido do leite, quanto é outro sólido, quanto é água. A receita inteira é a soma dessas frações vezes os gramas de cada linha, nada além disso. É por isso que trocar 50 g de leite por 50 g de creme mexe em quatro métricas ao mesmo tempo.',
      'Seis das oito métricas são frações da massa total, então elas se leem como porcentagem da calda. POD e PAC são diferentes: são normalizados por quilo de mistura, porque medem intensidade, não quantidade. Duas receitas com a mesma quantidade de açúcar podem ter doçuras bem diferentes conforme o açúcar usado.',
      'A faixa de cada métrica muda com o tipo de base. Um sorbet trabalha com mais açúcar e mais PAC que um gelato de leite justamente porque não tem gordura nem sólidos do leite segurando a água: sem esse reforço, o anticongelante precisa fazer o trabalho sozinho. Trocar o tipo de base não mexe na receita, só na régua com que ela é medida.',
      'O lote é dimensionado em litros e convertido em massa por uma densidade ajustável, com padrão de 1,10 g/mL. Mexer no volume reescala todas as linhas na mesma proporção: a receita continua a mesma, só maior. Se você editar uma linha à mão e a massa total sair da meta, aparece o botão de ajustar ao lote.',
    ],
  },

  podPac: {
    title: 'Por que POD e PAC importam',
    body: [
      'POD (potere dolcificante) mede o quanto a receita adoça, e não quanto açúcar ela tem. A sacarose é a régua, com POD 1. A dextrose adoça menos (0,74), a frutose bem mais (1,45), a maltodextrina quase nada (0,02). É o POD que explica por que dá para tirar doçura de um gelato enjoativo sem perder corpo: troque parte da sacarose por maltodextrina ou glucose em pó e os sólidos ficam onde estavam.',
      'PAC (potere anticongelante) mede o quanto os açúcares abaixam o ponto de congelamento. A sacarose também é a régua, mas a ordem muda: dextrose 1,8, açúcar invertido 1,9, maltodextrina 0,25. Sal e álcool pesam muito aqui, o que é a razão de uma colher de licor estragar a textura de um lote inteiro.',
      'Os dois andam juntos mas não na mesma direção, e é disso que vive o balanceamento. A dextrose é a alavanca clássica para amaciar sem adoçar demais, porque sobe muito o PAC e pouco o POD. Frutose e açúcar invertido sobem os dois. Maltodextrina dá corpo sem mexer em nenhum. PAC baixo demais vira pedra na vitrine; alto demais derrete antes de chegar à mesa.',
    ],
  },

  glossary: {
    title: 'Glossário',
    terms: [
      {
        term: 'POD',
        definition:
          'Potere dolcificante, ou poder de doçura. Mede quanto a receita adoça em relação à sacarose, por quilo de calda. Sacarose = 1; dextrose = 0,74; frutose = 1,45.',
      },
      {
        term: 'PAC',
        definition:
          'Potere anticongelante. Mede quanto os açúcares abaixam o ponto de congelamento da calda, por quilo, também com a sacarose como referência. É o que define a dureza na vitrine.',
      },
      {
        term: 'SNGL',
        definition:
          'Sólidos não gordurosos do leite: proteína, lactose e minerais que sobram quando se tira a gordura e a água. Dão estrutura e seguram água livre. Em excesso, a lactose cristaliza e a textura fica arenosa.',
      },
      {
        term: 'Sólidos totais',
        definition:
          'Tudo que não é água, somando açúcares, gorduras, SNGL e outros sólidos. Quanto mais sólidos, mais o gelato resiste ao derretimento, e menos água sobra livre para virar cristal de gelo.',
      },
      {
        term: 'Overrun',
        definition:
          'O ar incorporado durante o batimento, medido como aumento de volume. Gelato artesanal fica entre 20 e 35%, bem abaixo do sorvete industrial. Esta calculadora balanceia a calda; o overrun é da máquina e do processo.',
      },
      {
        term: 'Neutro',
        definition:
          'Mistura pronta de estabilizantes e emulsificantes. Entra como outros sólidos e quase não mexe nas métricas, mas é o que impede a água de se organizar em cristais grandes durante a conservação.',
      },
      {
        term: 'Temperatura de serviço',
        definition:
          'Estimada aqui como PAC ÷ 25, com sinal negativo. É a temperatura em que a base fica boleável: mais fria e ela endurece, mais quente e derrete.',
      },
      {
        term: 'Densidade da calda',
        definition:
          'Quantos gramas cabem em um mililitro de mistura antes de bater. O padrão de 1,10 g/mL converte o lote em litros para a massa em gramas, que é a unidade em que a receita realmente se pesa.',
      },
    ],
  },

  sources: {
    title: 'Fontes desta calculadora',
    lead: 'Esta é a única calculadora do site que não se apoia em obra publicada. Os 164 ingredientes, os coeficientes de POD e PAC e as faixas dos cinco tipos de base vêm de uma planilha de curso de gelato, que é material didático e não bibliografia, sem página ou capítulo para citar. Está declarado como tal em vez de ganhar ares de livro.',
    page: 'p.',
    section: 'seção',
  },

  ingredients: {
    abacate: 'Abacate',
    abacaxi: 'Abacaxi',
    acerola: 'Acerola',
    'acucar-dextrose': 'Açúcar (dextrose)',
    'acucar-frutose': 'Açúcar (frutose)',
    'acucar-glucose-em-po': 'Açúcar (glucose em pó)',
    'acucar-glucose-liquida': 'Açúcar (glucose líquida)',
    'acucar-lactose': 'Açúcar (lactose)',
    'acucar-maltodextrina': 'Açúcar (maltodextrina)',
    'acucar-de-maca-66-acucar': 'Açúcar de maçã (66% açúcar)',
    'acucar-invertido': 'Açúcar invertido',
    'acucar-sacarose': 'Açúcar sacarose',
    agua: 'Água',
    'alcool-96': 'Álcool 96°',
    'ameixa-vermelha': 'Ameixa vermelha',
    'amendoim-torrado': 'Amendoim torrado',
    amora: 'Amora',
    atemoia: 'Atemoia',
    banana: 'Banana',
    'base-de-agua': 'Base de água',
    'base-de-leite': 'Base de leite',
    'base-de-leite-creme-de-leite-17-uht': 'Base de leite (creme de leite 17% UHT)',
    'base-de-leite-fior-di-latte': 'Base de leite (fior di latte)',
    'batata-doce-roxa': 'Batata-doce roxa',
    biscoff: 'Biscoff',
    'biscoito-champanhe': 'Biscoito champanhe',
    'biscoito-chocolate': 'Biscoito de chocolate',
    brigadeiro: 'Brigadeiro',
    'cacau-em-po-11-gordura': 'Cacau em pó 11% gordura',
    'cacau-em-po-22-gordura': 'Cacau em pó 22% gordura',
    cachaca: 'Cachaça',
    'cafe-expresso': 'Café expresso',
    'cafe-soluvel': 'Café solúvel',
    caqui: 'Caqui',
    cenoura: 'Cenoura',
    cereja: 'Cereja',
    'cereja-em-calda': 'Cereja em calda',
    'chocolate-amargo-60': 'Chocolate amargo 60%',
    'chocolate-amargo-70': 'Chocolate amargo 70%',
    'chocolate-amargo-90': 'Chocolate amargo 90%',
    'chocolate-ao-leite-33-7': 'Chocolate ao leite 33,7%',
    'chocolate-ao-leite-40': 'Chocolate ao leite 40%',
    'chocolate-branco': 'Chocolate branco',
    'chocolate-em-po-50': 'Chocolate em pó 50%',
    'clara-de-ovo': 'Clara de ovo',
    coco: 'Coco',
    'coco-ralado-seco': 'Coco ralado seco',
    cointreau: 'Cointreau',
    'cream-cheese': 'Cream cheese',
    'creme-de-leite-de-castanha-20': 'Creme de leite de castanha 20%',
    'creme-de-leite-fresco-35': 'Creme de leite fresco 35%',
    'creme-de-leite-fresco-38': 'Creme de leite fresco 38%',
    'creme-de-leite-uht-17-piracanjuba': 'Creme de leite UHT 17% (Piracanjuba)',
    'creme-de-leite-uht-25': 'Creme de leite UHT 25%',
    croissant: 'Croissant',
    damasco: 'Damasco',
    'doce-de-leite-lata': 'Doce de leite (lata)',
    'doce-de-leite-rocca': 'Doce de leite Rocca',
    'dpo-165-premium-aroma-italia': 'DPO 165 Premium (Aroma Italia)',
    eritritol: 'Eritritol',
    'ervilha-cozida': 'Ervilha cozida',
    'ervilha-seca': 'Ervilha seca',
    'extrato-de-baunilha': 'Extrato de baunilha',
    'farinha-de-semente-de-alfarroba': 'Farinha de semente de alfarroba',
    'farinha-de-semente-de-guar': 'Farinha de semente de guar',
    'farinha-de-semente-de-tara': 'Farinha de semente de tara',
    'farinha-de-trigo': 'Farinha de trigo',
    'fava-de-baunilha': 'Fava de baunilha',
    figo: 'Figo',
    framboesa: 'Framboesa',
    'fruta-groselha': 'Groselha',
    'fruta-nativa-araca': 'Araçá',
    'fruta-nativa-bergamota': 'Bergamota',
    'fruta-nativa-butia': 'Butiá',
    'fruta-nativa-guabiroba': 'Guabiroba',
    'frutas-vermelhas': 'Frutas vermelhas',
    'gema-do-ovo': 'Gema de ovo',
    'gema-do-ovo-pasteurizada': 'Gema de ovo pasteurizada',
    goiaba: 'Goiaba',
    goiabada: 'Goiabada',
    'goma-xantana': 'Goma xantana',
    hortela: 'Hortelã',
    'imo-900-taumatina-moonsugar': 'IMO 900 + taumatina (moonsugar)',
    'inulina-fibra-vegetal': 'Inulina (fibra vegetal)',
    'iogurte-desnatado': 'Iogurte desnatado',
    'iogurte-grego': 'Iogurte grego',
    'iogurte-integral': 'Iogurte integral',
    'iogurte-semidesnatado': 'Iogurte semidesnatado',
    kiwi: 'Kiwi',
    'laranja-suco': 'Suco de laranja',
    'leite-condensado': 'Leite condensado',
    'leite-condensado-desnatado': 'Leite condensado desnatado',
    'leite-condensado-vegetal': 'Leite condensado vegetal',
    'leite-de-castanha': 'Leite de castanha',
    'leite-de-coco': 'Leite de coco',
    'leite-de-coco-em-po-io': 'Leite de coco em pó (IO)',
    'leite-de-coco-sococo': 'Leite de coco Sococo',
    'leite-desnatado': 'Leite desnatado',
    'leite-em-po-desnatado': 'Leite em pó desnatado',
    'leite-em-po-integral': 'Leite em pó integral',
    'leite-integral': 'Leite integral',
    'leite-semidesnatado': 'Leite semidesnatado',
    lichia: 'Lichia',
    'licor-amaretto': 'Licor amaretto',
    'lima-limao-taiti': 'Lima taiti',
    'limao-siciliano': 'Limão-siciliano',
    'limao-suco': 'Suco de limão (fruta)',
    maca: 'Maçã',
    maltitol: 'Maltitol',
    mamao: 'Mamão',
    manga: 'Manga',
    manteiga: 'Manteiga',
    'manteiga-de-cacau': 'Manteiga de cacau',
    'manteiga-de-garrafa': 'Manteiga de garrafa',
    maracuja: 'Maracujá',
    mascarpone: 'Mascarpone',
    mel: 'Mel',
    melancia: 'Melancia',
    melao: 'Melão',
    mexerica: 'Mexerica',
    mirtilo: 'Mirtilo',
    morango: 'Morango',
    'nata-45': 'Nata 45%',
    'nata-48': 'Nata 48%',
    neutro: 'Neutro (estabilizante)',
    nutella: 'Nutella',
    'oleo-de-coco': 'Óleo de coco',
    'oleo-de-girassol': 'Óleo de girassol',
    'ovo-galinha': 'Ovo de galinha',
    pacoca: 'Paçoca',
    parmesao: 'Parmesão',
    'pasta-baunilha-vanilla-brasil': 'Pasta de baunilha (Vanilla Brasil)',
    'pasta-de-amendoas-s-acucar': 'Pasta de amêndoas sem açúcar',
    'pasta-de-amendoim-c-acucar': 'Pasta de amendoim com açúcar',
    'pasta-de-amendoim-100': 'Pasta de amendoim 100%',
    'pasta-de-avela-s-acucar': 'Pasta de avelã sem açúcar',
    'pasta-de-cacau': 'Pasta de cacau',
    'pasta-de-cacau-pre-fabricada': 'Pasta de cacau pré-fabricada',
    'pasta-de-castanha-de-caju-100': 'Pasta de castanha de caju 100%',
    'pasta-de-castanha-do-para-100': 'Pasta de castanha-do-pará 100%',
    'pasta-de-nozes-100': 'Pasta de nozes 100%',
    'pasta-de-pistache-100': 'Pasta de pistache 100%',
    pera: 'Pera',
    pessego: 'Pêssego',
    pitaya: 'Pitaya',
    'polidextrose-fibra': 'Polidextrose (fibra)',
    'polpa-de-acai-10-14': 'Polpa de açaí (10 a 14%)',
    pudim: 'Pudim',
    'raspa-de-limao-casca': 'Raspa de limão (casca)',
    'ricota-de-ovelha': 'Ricota de ovelha',
    'ricota-de-vaca': 'Ricota de vaca',
    roma: 'Romã',
    rum: 'Rum',
    sal: 'Sal',
    'stevia-em-po': 'Stévia em pó',
    'suco-de-limao': 'Suco de limão',
    sucralose: 'Sucralose',
    'tamara-seca': 'Tâmara seca',
    tomate: 'Tomate',
    torrone: 'Torrone',
    uva: 'Uva',
    'whey-protein-80': 'Whey protein 80%',
    'xarope-monin': 'Xarope Monin',
    xylitol: 'Xilitol',
  },
};
