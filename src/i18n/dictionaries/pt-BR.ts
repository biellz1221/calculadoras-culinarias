import type { CalculatorId } from '@/data/calculators';

/**
 * Dicionário canônico do site. O tipo `Dictionary` é derivado deste arquivo,
 * então acrescentar uma chave aqui quebra a compilação do inglês até que ela
 * seja traduzida. É o que garante que os dois idiomas andem juntos (FR-002).
 */
export const ptBR = {
  site: {
    name: 'Calculadoras Culinárias',
    homeTitle: 'Calculadoras Culinárias: pão, picles, massa e gelato',
    description:
      'Calculadoras de cozinha em gramas para pão, picles, massa fresca e gelato. Cada proporção vem de um livro de referência, citada com autor e página.',
    /** Uma frase para quem vai ler só uma: card de compartilhamento e llms.txt. */
    tagline: 'Proporções de cozinha em gramas, cada uma com a fonte citada.',
    keywords: [
      'calculadora culinária',
      'calculadora de cozinha',
      'receita em gramas',
      'proporções de cozinha',
      'porcentagem de padeiro',
      'salmoura para fermentação',
      'massa fresca',
      'balanceamento de gelato',
    ],
    imageAlt:
      'Cartão do site Calculadoras Culinárias, com o título e as quatro calculadoras disponíveis.',
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
    lead: 'Pão, picles, massa fresca e gelato calculados em gramas, na quantidade que você precisa. Cada número vem de um livro, com autor e página.',

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

    /**
     * Perguntas frequentes da home.
     *
     * Cada resposta começa pela resposta: quem chega de busca ou por um
     * assistente de IA precisa do número na primeira frase, não no terceiro
     * parágrafo. O contexto vem depois.
     */
    faq: {
      title: 'Perguntas frequentes',
      items: [
        {
          question: 'As calculadoras são gratuitas?',
          answer:
            'São. Não há cadastro, assinatura nem limite de uso. Todo cálculo roda no seu navegador e nada é enviado para servidor nenhum.',
        },
        {
          question: 'De onde vêm as proporções?',
          answer:
            'De livros de referência de cozinha. Cada número exibido aparece com a citação da obra, com autor e página, ou capítulo quando o livro é digital e não tem paginação fixa.',
        },
        {
          question: 'E quando dois livros discordam?',
          answer:
            'A divergência vira conteúdo. Cada calculadora tem uma tabela que mostra o que cada fonte diz e explica por que o padrão adotado é o que é, em vez de escolher em silêncio.',
        },
        {
          question: 'Preciso de balança de cozinha?',
          answer:
            'Precisa, e isso é proposital. Tudo aqui é em gramas: xícara e colher variam com o ingrediente e com a mão de quem enche, e é o que faz a mesma receita sair diferente a cada vez. Quem prefere onças e libras troca nas configurações, mas continua pesando.',
        },
      ],
    },
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
