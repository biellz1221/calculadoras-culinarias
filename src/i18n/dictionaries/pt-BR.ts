import type { CalculatorId } from '@/data/calculators';

/**
 * Dicionário canônico do site. O tipo `Dictionary` é derivado deste arquivo,
 * então acrescentar uma chave aqui quebra a compilação do inglês até que ela
 * seja traduzida. É o que garante que os dois idiomas andem juntos (FR-002).
 */
export const ptBR = {
  site: {
    name: 'Calculadoras Culinárias',
    homeTitle: 'Calculadoras Culinárias: pães, picles e massa fresca em gramas',
    description:
      'Calculadoras de cozinha em gramas para pães, picles e massa fresca, com as proporções tiradas de livros de referência e citadas com autor e página.',
  },

  nav: {
    backToCalculators: 'Todas as calculadoras',
  },

  preferences: {
    open: 'Configurações',
    title: 'Configurações',
    lead: 'Fica tudo guardado neste navegador, sem conta e sem cookie de rastreamento.',
    close: 'Fechar',
    done: 'Pronto',

    language: 'Idioma',
    units: 'Unidades',
    metric: 'Gramas e quilos',
    imperial: 'Onças e libras',
    unitsNote:
      'O modo imperial é por peso. Xícaras e colheres ficam de fora nos dois sistemas: o que torna uma receita repetível é a balança.',
    temperature: 'Temperatura',
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    temperatureNote:
      'Vale para os números calculados. O texto das explicações segue em Celsius, que é como as fontes escrevem.',

    display: 'Exibição',
    simplified: 'Interface simplificada',
    simplifiedOn: 'Só a calculadora',
    simplifiedOff: 'Com as explicações',
    simplifiedNote:
      'Esconde as seções de método, divergências, glossário e fontes, deixando a página só com a ferramenta.',
  },

  a11y: {
    skipToContent: 'Pular para o conteúdo',
    languageNav: 'Escolha de idioma',
    currentLanguage: 'Idioma atual',
  },

  home: {
    eyebrow: 'Proporções de cozinha com fonte declarada',
    title: 'As proporções que fazem a receita funcionar',
    lead: 'Pão, picles e massa fresca calculados em gramas, na quantidade que você precisa. Cada número vem de um livro, com autor e página.',

    principles: {
      grams: {
        title: 'Tudo em gramas',
        body: 'Sem xícaras nem colheres. A balança é o que torna uma receita repetível de uma vez para a outra.',
      },
      sources: {
        title: 'Cada número tem fonte',
        body: 'As proporções saem de livros de referência e aparecem citadas com autor e página. Dá para conferir e para se aprofundar.',
      },
      divergence: {
        title: 'Quando as fontes discordam, a gente mostra',
        body: 'Kayser pede 70% de hidratação no pão branco; Camargo, 60%. Em vez de escolher em silêncio, explicamos a diferença e por que o padrão é o que é.',
      },
    },

    calculatorsTitle: 'As calculadoras',
    calculatorsIntro:
      'Cada uma nasce da mesma receita: as proporções do livro, a faixa segura de cada ingrediente e a conta feita para a quantidade que você tem em casa.',

    shelfTitle: 'A estante',
    shelfIntro:
      'As obras que sustentam os cálculos. Toda proporção exibida no site aponta para uma delas.',

    available: 'Disponível',
    comingSoon: 'Em breve',
    openCalculator: 'Abrir a calculadora de',
    basedOn: 'A partir de',
  },

  calculators: {
    bread: {
      name: 'Pães',
      blurb:
        'Porcentagem de padeiro, presets por tipo de pão e conversão entre fermento fresco, seco, instantâneo e levain.',
    },
    pickles: {
      name: 'Picles e fermentação',
      blurb:
        'Salmoura, salga direta e picles de vinagre, com a faixa segura de sal de cada preparo.',
    },
    pasta: {
      name: 'Massa fresca',
      blurb:
        'Farinha e ovos pelo número de porções, com os tipos de massa e as espessuras de abertura por formato.',
    },
    gelato: {
      name: 'Gelato',
      blurb:
        'Balanceamento de base: açúcares, gorduras, sólidos totais, POD e PAC dentro da faixa de cada tipo.',
    },
  } satisfies Record<CalculatorId, { name: string; blurb: string }>,

  footer: {
    privacy:
      'Feito para uso na cozinha: tudo roda no seu navegador e nada é enviado para servidor nenhum.',
    method:
      'As proporções vêm das obras citadas em cada calculadora. Onde as fontes divergem, a diferença é explicada em vez de escondida.',
    repository: 'Código no GitHub',
  },

  notFound: {
    title: 'Página não encontrada',
    body: 'O endereço que você abriu não existe. Talvez a calculadora ainda esteja por vir.',
    back: 'Voltar para a home',
  },
};

export type Dictionary = typeof ptBR;
