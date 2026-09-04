import type { Dictionary } from './pt-BR';

export const en: Dictionary = {
  site: {
    name: 'Culinary Calculators',
    shortName: 'Calculators',
    homeTitle: 'Culinary Calculators: bread, pickles, pasta, gelato',
    description:
      'Kitchen calculators in grams for bread, pickles, fresh pasta and gelato. Every ratio comes from a reference cookbook, cited by author and page.',
    tagline: 'Kitchen ratios in grams, every one of them with a cited source.',
    keywords: [
      'kitchen calculator',
      'cooking calculator',
      'recipe in grams',
      'cooking ratios',
      "baker's percentage",
      'fermentation brine calculator',
      'fresh pasta',
      'gelato balancing',
    ],
    imageAlt:
      'Card for the Culinary Calculators site, with the title and the four available calculators.',
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

  pwa: {
    updateReady: 'A new version of the site is ready.',
    update: 'Refresh',
    later: 'Not now',
  },

  recipe: {
    actionsLabel: 'What to do with this recipe',

    save: 'Save',
    nameLabel: 'Recipe name',
    confirm: 'Keep it',
    cancel: 'Never mind',
    saved: 'Recipe kept in this browser.',
    replaced: 'The recipe under that name was replaced.',
    full: "That's 20 recipes kept in this calculator, which is the limit. Delete one to keep another.",
    blocked:
      'This browser is not storing site data, so saving does not work here. Sharing and printing still do.',

    mine: 'My recipes',
    empty: 'Nothing kept in this calculator yet.',
    load: 'Open',
    remove: 'Delete',
    loaded: 'Recipe loaded.',
    brokenEntry:
      'This recipe was kept by an earlier version of the calculator and can no longer be opened.',

    share: 'Share',
    copyLink: 'Copy link',
    linkCopied: 'Link copied. Whoever opens it sees this exact recipe.',
    textCopied: 'Recipe copied as text.',
    copyManually: 'The browser would not copy on its own. The text is below, ready to select.',
    manualLabel: 'Text to copy',

    print: 'Print',
    sources: 'Sources',

    linkOutdated:
      'This link was made by an earlier version of the calculator and could not be opened. The values below are the defaults.',
    linkInvalid:
      'This link arrived incomplete or altered and could not be opened. The values below are the defaults.',
    dismiss: 'Got it',
  },

  home: {
    eyebrow: 'Kitchen ratios with a cited source',
    title: 'The ratios that make a recipe work',
    lead: 'Bread, pickles, fresh pasta and gelato worked out in grams, scaled to what you actually need. Every number comes from a book, with author and page.',

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

    faq: {
      title: 'Common questions',
      items: [
        {
          question: 'Are the calculators free?',
          answer:
            'They are. No sign-up, no subscription, no usage limit. Every calculation runs in your browser and nothing is sent to any server.',
        },
        {
          question: 'Where do the ratios come from?',
          answer:
            'From reference cookbooks. Every number on screen carries its citation, with author and page, or chapter when the book is digital and has no fixed pagination.',
        },
        {
          question: 'What happens when two books disagree?',
          answer:
            'The disagreement becomes content. Each calculator has a table showing what every source says and explaining why the default is what it is, rather than picking one quietly.',
        },
        {
          question: 'Do I need a kitchen scale?',
          answer:
            'You do, and that is deliberate. Everything here is in grams: cups and spoons shift with the ingredient and with the hand that fills them, which is what makes the same recipe come out differently each time. Ounces and pounds are a setting away, but you still weigh.',
        },
      ],
    },
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
