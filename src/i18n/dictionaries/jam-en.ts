import type { JamDictionary } from './jam';

export const jamEn: JamDictionary = {
  meta: {
    title: 'Jam: sugar, lemon and the set point',
    description:
      'How much sugar and lemon per kilo of fruit, and the temperature jam sets at where you live. Every ratio comes from a published recipe, cited.',
    keywords: [
      'jam calculator',
      'how much sugar for jam',
      'jam setting point temperature',
      'jam without added pectin',
      'fruit to sugar ratio jam',
      'jam making at altitude',
      'home fruit preserves',
      'lemon juice in jam',
    ],
    imageAlt:
      'Card for the jam calculator, with the title and the works the ratios rest on.',
  },

  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'How much sugar for 1 kg of fruit?',
        answer:
          'It depends on the fruit, and that is the honest answer. In the Blue Chair Jam Cookbook it runs from 417 g per kilo for apricots to a full kilo per kilo for raspberries. Christine Ferber uses 800 g per kilo through nearly her whole book. This calculator gives you the ratio from the cited recipe for the fruit you picked, and shows Ferber alongside it.',
      },
      {
        question: 'What temperature does jam set at?',
        answer:
          'Eight degrees Fahrenheit above wherever water boils in your kitchen — 104.4 °C at sea level, about 100 °C in Brasília. The 105 °C the French books quote is a sea-level number for Europe. Enter your altitude and the calculator gives you your own.',
      },
      {
        question: 'Can I make jam with less sugar?',
        answer:
          'You can, but the product changes category. The NCHFP is blunt: sugar is the preservative, and "too little sugar prevents gelling and may allow yeasts and molds to grow". With little sugar you have a refrigerator spread to eat within a month, not a shelf-stable preserve.',
      },
      {
        question: 'Do I need store-bought pectin?',
        answer:
          'For NCHFP Group I fruits, no: they have pectin and acid to spare. Group III always needs added acid, pectin or both. The calculator offers Ferber’s way out — borrowing pectin from 200 g of apple jelly per kilo of fruit rather than reaching for the powder.',
      },
      {
        question: 'What is the lemon juice for?',
        answer:
          'Two things at once: "Acid is needed both for gel formation and flavor", says the NCHFP. Without enough acid the pectin never forms a network and the jam will not set. With too much, the network turns unstable and the jam weeps in the jar.',
      },
      {
        question: 'Why does the recipe ask for prepared fruit?',
        answer:
          'Because that is the weight the ratio was written against. Saunders is explicit: "always base the amount of sugar on the total weight of raw prepared fruit being used". Weigh after peeling, pitting and cutting — not the bag from the market.',
      },
    ],
  },

  eyebrow: 'Jam calculator',
  title: 'Jam sets at the altitude you actually cook at',
  lead: 'Give it the fruit, the prepared weight and your altitude. You get the sugar and lemon from the published recipe for that fruit, and the temperature jam sets at where you are — which is not the 105 °C in the French books if you live on a plateau.',

  input: {
    label: 'Your pan',
    fruit: 'Fruit',
    fruitGrams: 'Prepared fruit (g)',
    fruitHint: 'Peeled, pitted and cut already. This is the weight the ratios were written against.',
    altitude: 'Altitude (m)',
    altitudeHint: 'Of the place you will be cooking. It moves both the set point and the canning time.',
    sugar: 'How much sugar',
    custom: 'Sugar against fruit (%)',
    customHint: 'Go below what the recipe publishes and the notice appears, explaining what changes.',
  },

  fruits: {
    strawberry: 'Strawberry',
    raspberry: 'Raspberry',
    blackberry: 'Blackberry',
    apricot: 'Apricot',
    peach: 'Peach',
    plum: 'Plum',
    fig: 'Fig',
    blueberry: 'Blueberry',
    grape: 'Grape',
  },

  groups: {
    i: 'Group I — its own pectin and acid',
    ii: 'Group II — may lack acid or pectin',
    iii: 'Group III — always lacks acid, pectin or both',
    iHint:
      'Per the NCHFP, this fruit has enough natural pectin and acid to gel with sugar alone, as long as it is not overripe.',
    iiHint:
      'Per the NCHFP, this fruit is low in natural acid or pectin and may need one of them. The cited recipe already carries the lemon its author used.',
    iiiHint:
      'Per the NCHFP, this fruit always needs added acid, pectin or both. The lemon in the recipe is not seasoning: it is what makes the jam set.',
  },

  sugarLevels: {
    source: 'From the recipe',
    ferber: 'Ferber (80%)',
    custom: 'Choose',
    sourceNote:
      'The ratio the Blue Chair Jam Cookbook publishes for this fruit, against the weight of prepared fruit. Every fruit has its own, and that is what an average would hide.',
    ferberNote:
      'Christine Ferber’s house ratio: 800 g of sugar per kilo of fruit. It is the figure in 93 of the 218 recipes in her book, by far the most frequent.',
    customNote:
      'Your call. Below what the source publishes for this fruit, the page says what changes about keeping it.',
  },

  result: {
    title: 'What to weigh',
    sugar: 'White cane sugar',
    lemon: 'Strained lemon juice',
    lemonNone: 'This recipe takes no lemon',
    appleJelly: 'Apple jelly',
    appleJellyHint:
      'Ferber’s answer for fruit that will not gel on its own: pectin borrowed from apples, 200 g per kilo, instead of powdered pectin.',
    ratio: 'Sugar against fruit',
    jars: 'Yields, roughly',
    jarsUnit: 'jars of 240 ml',
    jarsHint: 'Scaled from the yield the recipe itself declares. Kept in jars because that is the book’s unit.',
    shelf: 'Shelf life the book declares',
    months: 'months',
    year: '1 year',
    evaporation: 'Water to boil off',
    evaporationHint:
      'An estimate: how much has to leave the pan for the jam to reach the 65% sugar Ferber names as the keeping point. It is the only figure on this page that combines two sources.',
  },

  point: {
    title: 'The set point, at your altitude',
    resultTitle: 'When to stop cooking',
    lead: 'Ferber says cook to 105 °C and Saunders says 220 °F. Same point, and both are sea-level numbers. The NCHFP is the only one that writes the rule in a form that survives moving house.',
    setting: 'Setting point',
    boiling: 'Water boils at',
    processing: 'Boiling-water canner',
    minutes: 'min',
    settingHint:
      'Eight degrees Fahrenheit above boiling. Go past it, Saunders warns, and you get an "irrevocably tough, leathery" preserve — with no way back.',
    processingHint:
      'Half-pint or pint jars, jam without added pectin. NCHFP Table 2, which raises the time precisely because water boils cooler up there.',
    seaLevel: 'At sea level it would be',
    honesty:
      'Two honest caveats. The NCHFP table is American and the boiling-water canner is its method: Saunders sterilises in the oven and Ferber fills to the brim, caps hot and inverts the jar — all three work, and the NCHFP does not endorse inverting. And reaching the setting point depends on the mixture having enough sugar to get there; with little sugar the thermometer only climbs after the fruit has already overcooked.',
  },

  status: {
    source: 'The source ratio',
    aboveSource: 'Above the source',
    belowSource: 'Below the source',
    sourceLabel: 'Cited recipe',
    aboveBody:
      'More sugar than the cited recipe calls for. It keeps better and gels more readily, but the NCHFP lists excess sugar as a cause of crystals, and Saunders warns that "too much will mask the fruit flavor". If the intention was to follow Ferber, the number is right — hers is a different ruler.',
    belowBody:
      'Less sugar than the cited recipe publishes for this fruit. The NCHFP is direct about it: "Do not try to reduce the amount of sugar in traditional recipes. Too little sugar prevents gelling and may allow yeasts and molds to grow." In practice what comes out of this pan is a refrigerator spread: keep it chilled and eat it within a month, as the NCHFP itself advises for reduced-sugar spreads. It is not a shelf-stable preserve, processed or not.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'The sugar figure is a rule of three against the weight of prepared fruit, which is the base Saunders insists on. What the calculator brings is not the arithmetic: it is where the ratio comes from. Each fruit carries the recipe published for it, with a page number, and the ratio comes out of that recipe — apricot at 0.42, strawberry at 0.65, raspberry at 1.00. An average of those nine would be nobody’s source.',
      'Saunders writes in pounds and ounces, and none of it needed converting. A ratio between two masses has no unit: 40 ounces of sugar to 62 of fruit is the same 0.6452 in grams, in ounces or in stones. That is why the calculator’s test can reproduce the book’s recipe line by line with no conversion factor anywhere in the path.',
      'The setting point is the part no book hands over ready-made. The NCHFP publishes a table of temperature against altitude, in feet and Fahrenheit, and the calculator interpolates that table for the altitude you enter. A curiosity of the source: the NCHFP text sums it all up as "subtract 2 degrees F" per thousand feet, but the table on the same page drops only one degree between 4,000 and 5,000 feet and stays a degree above the rule from there on. The table is the one that is right — water’s boiling point does not fall in a straight line with altitude. Below 1,219 m the two agree, which covers nearly every large Brazilian city.',
      'The water to boil off is the one estimate on the page, and it combines two of Ferber’s numbers: the 65% sugar of a keeping preserve and the 10% to 15% the fruit already brings. It comes out as a range because the second number is a range. It serves one purpose, but an important one: showing why low-sugar jam cooks so much longer. With less sugar, more water has to leave to reach the same 65% — and that is where the fruit falls apart.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'Three books, one official agency, and four disagreements worth knowing about.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'Setting temperature',
        sources:
          'Ferber: 105 °C. Saunders: 220 °F, which is 104.4 °C. NCHFP: 8 °F above wherever water boils, with a table by altitude.',
        decision:
          'Works it out from your altitude, always. The first two are the same point measured at sea level; only the third moves cities with you.',
      },
      {
        topic: 'How much sugar',
        sources:
          'Ferber writes "un poids de sucre plus ou moins égal à celui du fruit", yet 93 of her 218 recipes use 800 g per kilo. Saunders ranges from 0.42 to 1.00 depending on the fruit.',
        decision:
          'Uses the cited recipe for that fruit, and offers Ferber’s measured 0.80 alongside. Her prose and her bench do not agree, and we say so.',
      },
      {
        topic: 'Sealing the jar',
        sources:
          'NCHFP: boiling-water canner, 5 to 15 min by altitude. Saunders: oven at 250 °F. Ferber: fill to the brim, cap hot and invert.',
        decision:
          'Reports the NCHFP time, the only one with a table by altitude, and says the other two methods belong to the authors cited. The NCHFP does not endorse inverting.',
      },
      {
        topic: 'Pectin in guava',
        sources:
          'The NCHFP puts guava in Group III, "always needs added acid, pectin or both". McGee says the Spanish exploited its high pectin content to make a New World quince paste.',
        decision:
          'Does not offer guava. Group III is "acid, pectin or both", and no source separates the two cases — the likely reading is that acid is missing, not pectin, but likely does not become a number on screen.',
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
      'prepared-fruit': {
        term: 'Prepared fruit',
        definition:
          'The weight that counts: fruit already peeled, pitted and cut, with whatever juice it released. Not the shopping weight, and the gap is wide — Saunders’s peach jam starts at 6.5 pounds at the market to arrive at 5.5 prepared.',
      },
      'setting-point': {
        term: 'Setting point',
        definition:
          'The temperature at which the mixture, left to cool undisturbed, forms a jelly. It is not a fixed number: it is about 4.4 °C above wherever water boils in your kitchen, which moves with altitude.',
      },
      nappe: {
        term: 'Nappé',
        definition:
          'The French name for the same point, tested without a thermometer: the syrup coats the back of the spoon in a film that does not run off. "Vérifiez la nappe", Ferber writes at the end of almost every recipe.',
      },
      sheeting: {
        term: 'Sheet test',
        definition:
          'You dip a cool metal spoon and watch how the syrup falls. While it drips in separate drops, it is not ready; when two drops join and run off the edge as one sheet, it has arrived.',
      },
      'freezer-test': {
        term: 'Freezer test',
        definition:
          'Metal spoons wait in the freezer from before the pan goes on. You put half a spoonful of jam on one, return it for three or four minutes and tilt it: if it does not run, it is done.',
      },
      pectin: {
        term: 'Pectin',
        definition:
          'The cell-wall substance in fruit that forms the network of the gel. It needs sugar and acid to work, and it peaks in just-ripe fruit — underripe and overripe will not gel.',
      },
      'pectin-group': {
        term: 'Pectin group',
        definition:
          'The official classification of fruits into three groups, by whether they have their own pectin and acid (I), may need one of the two (II), or always need added acid, pectin or both (III).',
      },
      'apple-jelly': {
        term: 'Apple jelly',
        definition:
          'Pectin borrowed from another fruit instead of bought as powder. Ferber uses 200 g per kilo in fruits that will not gel alone — pears, cherries and sour cherries among them — and in red-fruit jams accepts redcurrant jelly in its place.',
      },
      syneresis: {
        term: 'Syneresis',
        definition:
          'The jam weeping liquid in the jar after it is made. The causes the NCHFP lists are excess acid, which makes the pectin unstable, and storage that is too warm or fluctuates in temperature.',
      },
      marmalade: {
        term: 'Marmalade and marmelada',
        definition:
          'Two different things with one origin. The word is Portuguese and named a quince paste; in English, marmalade became the translucent jelly with citrus peel suspended in it, after the sour orange displaced the quince in the 18th century.',
      },
    },
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'Two preserving books, one official agency and a McGee. The ratios come from Saunders’s weighed recipes and Ferber’s house proportion; the fruit classification, the temperature by altitude and the keeping rules come from the NCHFP.',
    page: 'p.',
    section: 'section',
  },
};
