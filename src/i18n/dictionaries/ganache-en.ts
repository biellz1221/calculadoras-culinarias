import type { GanacheDictionary } from './ganache';

export const ganacheEn: GanacheDictionary = {
  meta: {
    title: 'Ganache: the ratio by texture',
    description:
      'How much chocolate and butter for the cream you have, by the texture you want — and the shelf life almost no ganache recipe ever prints.',
    keywords: [
      'ganache calculator',
      'ganache ratio cream chocolate',
      'ganache for truffles',
      'ganache for moulded pralines',
      'ganache shelf life',
      'ganache water activity',
      'white chocolate ganache',
      'how much cream for ganache',
    ],
    imageAlt:
      'Card for the ganache calculator, with the title and the work the ratios rest on.',
  },

  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'What is the ratio for ganache?',
        answer:
          'There is not one: there is one per texture. For 100 g of cream, Wybauw uses 110 g of chocolate in a truffle ganache, 120 g plus 14 g of butter in a moulded praline, 120 g plus 25 g of butter for piping, and 130 to 180 g plus 24 to 30 g of butter for cut pralines. The "1 to 1" you find online is one of the four, not the rule.',
      },
      {
        question: 'How long does ganache keep?',
        answer:
          'Three weeks. Wybauw is blunt about it: products with a water activity between 0.85 and 1, "such as many ganache recipes", have a shelf life of only three weeks. And freezing does not extend it — a praline with three weeks left, frozen for eight months, still has three weeks once thawed.',
      },
      {
        question: 'Does white chocolate change anything?',
        answer:
          'It does: white needs about 2% extra cocoa butter over the recipe to reach the same texture, because its fat is 8% milk fat inside the 36% total. The chocolate proportion itself does not change.',
      },
      {
        question: 'Does this work for any chocolate?',
        answer:
          'The table was written for dark couverture with 36 to 38% cocoa butter and milk couverture with 36 to 37% total fat. The author himself warns that couverture far outside that range gives "a completely different result", and publishes no correction. Chocolate at 70% cocoa solids or more carries too much cocoa butter and needs less chocolate — how much less, he does not say.',
      },
      {
        question: 'Why did my ganache split?',
        answer:
          'Because the balance between water, fat and dry substance left its range. Ganache is an emulsion of water in fat, and the two do not bind on their own: the sugars and dry cocoa are the bridge. With too little or too much of any of the three, the mixture curdles, turns grainy, or comes out too firm or too liquid.',
      },
    ],
  },

  eyebrow: 'Ganache calculator',
  title: 'The ratio changes with the texture you want',
  lead: 'Tell it how much cream you have and what the ganache is for. You get the chocolate and butter from Wybauw’s table, the water the recipe carries, and the shelf life — the number almost no ganache recipe ever prints.',

  input: {
    label: 'Your recipe',
    soft: 'Cream (g)',
    softHint:
      'The table’s base of 100 is "soft substances": cream, milk, liqueur, invert sugar, glucose. The water figure assumes cream.',
    texture: 'What it is for',
    chocolate: 'Chocolate',
  },

  textures: {
    truffle: 'Truffle balls',
    moulded: 'Moulded praline',
    piped: 'Piped, then enrobed',
    cut: 'Cut praline',
  },

  textureNotes: {
    truffle:
      'The softest of the four and the only one without butter: 110 of chocolate to 100 of cream. Made to be rolled and dusted in cocoa.',
    moulded:
      'The soft ganache that goes inside a chocolate shell. The shell holds the shape, so the filling can stay soft.',
    piped:
      'Firm enough to hold the shape off the nozzle and then take the coating. Nearly twice the butter of the moulded one.',
    cut: 'The firmest: it has to survive being cut into squares without slumping. It is the only one where the book gives a range, and a wide one.',
  },

  chocolates: {
    dark: 'Dark',
    milk: 'Milk',
    white: 'White',
    darkNote: 'The table was written for dark couverture with 36 to 38% cocoa butter.',
    milkNote:
      'For milk couverture with 36 to 37% total fat, of which roughly 6% is milk fat.',
    whiteNote:
      'White carries around 8% milk fat inside its 36% total fat, which is why it needs extra cocoa butter to reach the same texture.',
  },

  result: {
    title: 'What to weigh',
    chocolate: 'Chocolate',
    butter: 'Butter',
    extra: 'Extra cocoa butter',
    extraHint:
      'Two per cent of the recipe, white chocolate only, to offset the milk fat and reach the same texture.',
    total: 'Finished ganache',
    water: 'Water in the recipe',
    waterHint:
      'Summed from the published contents: 60% of the cream and 17% of the butter. It is the quantity that decides shelf life, and the lever the book tells you to pull to extend it.',
    waterShare: 'Water against the total',
    ratio: 'Chocolate against cream',
    none: 'This texture takes none',
  },

  shelf: {
    title: 'Three weeks, and freezing does not change that',
    readout: 'Shelf life of this ganache',
    lead: 'The figure almost no ganache recipe prints, and what makes it a figure rather than a guess.',
    weeks: 'weeks',
    body: 'Wybauw translates water activity into time: products between 0.85 and 1 Aw, "such as many ganache recipes", last three weeks. Between 0.6 and 0.85, like buttercream, they reach about three months. Below 0.6 nothing grows at all.',
    freezing:
      'And the trap: "Freezing never extends shelf life." The example is the book’s own — a praline with three weeks left, frozen for eight months, still has three weeks once thawed. The freezer stops the clock; it does not wind it back.',
    awTitle: 'What grows in each band',
    awRows: [
      { range: 'above 0.9', body: 'bacteria, including salmonella and listeria' },
      { range: 'above 0.8', body: 'fungi thrive' },
      { range: 'above 0.75', body: 'yeasts grow' },
      { range: 'above 0.6', body: 'osmophilic yeasts and moulds' },
      { range: 'below 0.6', body: 'nothing lives; microbiological spoilage is excluded' },
    ],
    honesty:
      'This calculator does not work out the Aw of your recipe, and that is deliberate. Water activity is not an average of the ingredients’ Aw: it depends on what is dissolved in the free water, on the molecular weight of those substances, on temperature and on packaging — the book lists those factors itself. What can honestly be summed is the water, and that is what the page does.',
    ingredients: 'Measured water activity, by ingredient',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'Ganache is an emulsion of water in fat, and the two do not bind on their own. The bridge is dry substance: the sugars and cocoa powder in the chocolate. Three quantities in balance, not two — which is why changing the brand of chocolate changes the result without the ratio changing, and why "1 to 1" describes nothing on its own.',
      'Wybauw’s table resolves that by destination: each texture has its own proportion, measured against 100 of soft substance. The calculator stores the published ratio and multiplies by the cream you have. Nothing more — the arithmetic is short, and what it is worth lives in the table, not in the sums.',
      'The book prints the same table twice, as ratios and as percentages, and that is what makes a transcription from a noisy PDF trustworthy: the four percentage rows sum to exactly 100 and land within a point and a half of the ratios. We keep the ratios, because the percentages were adjusted to close at 100 — on the piping row, 100:120:25 gives 40.8 / 49.0 / 10.2 and the book prints 40 / 50 / 10.',
      'The water comes from two published figures: cream is 60% water and butter is 17%. Adding them gives the quantity that decides shelf life. The Aw does not: it is measured, not deduced, and the measured table sits on the page whole rather than becoming an estimate of ours.',
    ],
  },

  divergence: {
    title: 'One source, and why',
    lead: 'This is the only calculator on the site resting on a single book. On a site whose argument is showing disagreement, that has to be written down.',
    columns: {
      topic: 'Topic',
      sources: 'What we have',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'Ratio by texture',
        sources:
          'Wybauw only. The natural counterweight would be Greweling, and the copy we have is an image scan: 200 pages with no text layer.',
        decision:
          'Gives Wybauw’s table and says it comes from one author. When Greweling becomes verified text, the disagreement lands here.',
      },
      {
        topic: 'The cut-praline range',
        sources:
          'The book itself gives 130 to 180 of chocolate and 24 to 30 of butter — a wide range, and the percentage it prints alongside matches the bottom of it.',
        decision:
          'Shows the whole range rather than a midpoint. Averaging a range the source left open would be our invention.',
      },
      {
        topic: 'Couverture outside the range',
        sources:
          'Wybauw states his own — 36 to 38% cocoa butter — and warns that outside it the result changes completely. He publishes no correction.',
        decision:
          'States the range and states that we do not have the correction. Estimating it is exactly what this site does not do.',
      },
      {
        topic: 'Water activity',
        sources:
          'The book’s table is measured, ingredient by ingredient. There is no published formula for deducing a recipe’s Aw from it.',
        decision:
          'Shows the measured table and sums the water, which is summable. Does not compute Aw.',
      },
    ],
  },

  glossary: {
    title: 'Glossary',
    full: 'See in the glossary',
    noSource:
      'No source in our bibliography: the definition describes current practice, and nothing on the shelf backs it.',
    anchor: 'Address of this entry',
    terms: {
      ganache: {
        term: 'Ganache',
        definition:
          'A filling based on water and fat, in which the two only stay together because of the dry substance — sugars and cocoa powder — bridging them.',
      },
      'soft-substances': {
        term: 'Soft substances',
        definition:
          'The base of 100 in the proportion table: cream, milk, liqueur, invert sugar, glucose. Not a synonym for cream, even if cream is the usual case.',
      },
      couverture: {
        term: 'Couverture',
        definition:
          'Chocolate with enough cocoa butter to run thin when melted. The proportions on this page were written for couverture at 36 to 38% cocoa butter.',
      },
      'water-activity': {
        term: 'Water activity (Aw)',
        definition:
          'The fraction of a food’s water that is free rather than bound to sugars, salts or proteins. Micro-organisms use the free water, which is why Aw predicts spoilage better than total water content.',
      },
      precrystallising: {
        term: 'Pre-crystallising',
        definition:
          'Bringing the cocoa butter in the ganache to its stable crystal form before it sets. A ganache that is not pre-crystallised has a shorter shelf life, dries out faster, loses its aromas sooner and may turn grainy.',
      },
      syneresis: {
        term: 'Fat bloom',
        definition:
          'The whitish film that appears on chocolate when fat migrates and recrystallises. Wybauw lists non-pre-crystallised ganache among the reasons it shows up sooner.',
      },
    },
  },


  audit: {
    title: 'Check the ganache you already make',
    lead: 'Weigh what went into your ganache and see how it compares with Wybauw’s table. Three of the four textures are a single published ratio, and one is a range — the screen says which of the two is answering.',

    textureLabel: 'Texture you were after',
    soft: 'Soft substances',
    softHint: 'Cream, milk, liqueur, glucose, invert sugar: everything soft adds up here. It is the table’s base of 100, and adding only the cream gets the ratio wrong.',
    chocolate: 'Chocolate in your ganache',
    butter: 'Butter in your ganache',

    chocolateRatio: 'Chocolate per gram of base',
    butterRatio: 'Butter per gram of base',
    chocolateSubject: 'the chocolate',
    butterSubject: 'the butter',
  },
  sources: {
    title: 'Source for this calculator',
    lead: 'One book, and the page says so rather than disguising it. Wybauw is the technical reference on filled chocolates, and both the proportion table and the water-activity data — which nothing else on the shelf carries — are his.',
    page: 'p.',
    section: 'section',
  },
};
