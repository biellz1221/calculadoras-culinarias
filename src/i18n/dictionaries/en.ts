import type { Dictionary } from './pt-BR';

export const en: Dictionary = {
  site: {
    name: 'Culinary Calculators',
    homeTitle: 'Culinary Calculators: bread, pickles and fresh pasta in grams',
    description:
      'Kitchen calculators in grams for bread, pickles and fresh pasta, with ratios taken from reference cookbooks and cited by author and page.',
  },

  nav: {
    backToCalculators: 'All calculators',
  },

  preferences: {
    open: 'Settings',
    title: 'Settings',
    lead: 'All of it is kept in this browser, with no account and no tracking cookie.',
    close: 'Close',
    done: 'Done',

    language: 'Language',
    units: 'Units',
    metric: 'Grams and kilos',
    imperial: 'Ounces and pounds',
    unitsNote:
      'Imperial here is by weight. Cups and spoons stay out in either system: what makes a recipe repeatable is the scale.',
    temperature: 'Temperature',
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    temperatureNote:
      'This applies to the calculated numbers. The explanatory text stays in Celsius, which is how the sources write it.',

    display: 'Display',
    simplified: 'Simplified interface',
    simplifiedOn: 'Calculator only',
    simplifiedOff: 'With the explanations',
    simplifiedNote:
      'Hides the method, divergence, glossary and sources sections, leaving the page with just the tool.',
  },

  a11y: {
    skipToContent: 'Skip to content',
    languageNav: 'Language selection',
    currentLanguage: 'Current language',
  },

  home: {
    eyebrow: 'Kitchen ratios with a cited source',
    title: 'The ratios that make a recipe work',
    lead: 'Bread, pickles and fresh pasta worked out in grams, scaled to what you actually need. Every number comes from a book, with author and page.',

    principles: {
      grams: {
        title: 'Everything in grams',
        body: 'No cups, no spoons. A scale is what makes a recipe repeatable from one bake to the next.',
      },
      sources: {
        title: 'Every number has a source',
        body: 'Ratios come from reference cookbooks and are cited by author and page, so you can check them and read further.',
      },
      divergence: {
        title: 'When sources disagree, we say so',
        body: 'Kayser calls for 70% hydration in white bread; Camargo, 60%. Instead of quietly picking one, we explain the difference and why the default is what it is.',
      },
    },

    calculatorsTitle: 'The calculators',
    calculatorsIntro:
      'Each one is built the same way: the ratios from the book, the safe range for every ingredient, and the arithmetic done for the amount you have at home.',

    shelfTitle: 'The shelf',
    shelfIntro:
      'The works the calculations rest on. Every ratio shown on this site points back to one of them.',

    available: 'Available',
    comingSoon: 'Coming soon',
    openCalculator: 'Open the calculator for',
    basedOn: 'Based on',
  },

  calculators: {
    bread: {
      name: 'Bread',
      blurb:
        "Baker's percentage, presets by bread type and conversion between fresh, active dry, instant yeast and levain.",
    },
    pickles: {
      name: 'Pickles & fermentation',
      blurb:
        'Brine, dry salting and vinegar pickles, with the safe salt range for each preparation.',
    },
    pasta: {
      name: 'Fresh pasta',
      blurb:
        'Flour and eggs by number of servings, with dough types and rolling thickness for each shape.',
    },
    gelato: {
      name: 'Gelato',
      blurb:
        'Base balancing: sugars, fats, total solids, POD and PAC within the range for each style.',
    },
  },

  footer: {
    privacy:
      'Built for the kitchen: everything runs in your browser and nothing is sent to any server.',
    method:
      'Ratios come from the works cited in each calculator. Where sources diverge, the difference is explained rather than hidden.',
    repository: 'Source on GitHub',
  },

  notFound: {
    title: 'Page not found',
    body: 'The address you opened does not exist. That calculator may still be on its way.',
    back: 'Back to the home page',
  },
};
