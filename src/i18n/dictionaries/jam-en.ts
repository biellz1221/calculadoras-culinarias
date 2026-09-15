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
      'guava jam',
      'jaboticaba jam',
      'how much pectin in jam',
      'jam pH',
      'extra and standard jam legal definition',
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
        question: 'Can I make guava, jaboticaba or passion fruit jam?',
        answer:
          'You can, and as of September 2026 the calculator handles those fruits. What changes is where the number comes from: no book on this shelf publishes a weighed guava recipe, so the classification comes from Table 1 of Embrapa, Brazil’s public agricultural research agency — red guava is rich in pectin and medium in acidity — and the ratio comes from the Brazilian legal definition of jam. What Embrapa does not publish, such as yield in jars and shelf life, simply does not appear.',
      },
      {
        question: 'How much powdered pectin do I use?',
        answer:
          'From 0.5% to 1.5% of the sugar, not of the fruit. The base is what people get wrong: in a jam with 1 kg of sugar that is 5 to 15 g of pectin. Embrapa publishes the band and the formulations in the same document obey it. Where you land inside the band depends on the fruit’s own pectin, which is why the calculator shows the classification beside the dose instead of naming one figure.',
      },
      {
        question: 'What pH does jam need to set?',
        answer:
          'The gel forms around pH 3, and above 3.4 it does not form; in the finished jam the target is 3.0 to 3.2. There is a bench rule worth more than any lemon dose: measure the pulp before you start, and if it already sits between 3.0 and 3.3, do not acidify. How much acid to add when it sits outside is what no source publishes, so the calculator does not say.',
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
    weighedGroup: 'With a weighed recipe (Blue Chair)',
    classifiedGroup: 'Embrapa table (no recipe)',
    nativeGroup: 'MMA cookbook (fresh jam)',
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

    // The remaining 35 rows of Table 1 in Embrapa Doc 29. The name carries the
    // variety wherever the source carries it: "ripe fig" and "green and
    // half-ripe fig" are separate rows because they hold different pectin, and
    // flattening that would throw away the best thing the table has.
    pineapple: 'Pineapple',
    acerola: 'Acerola',
    'japanese-plum': 'Japanese plum',
    araca: 'Araçá (purple guava)',
    banana: 'Banana (d’água or nanica)',
    'caja-manga': 'Cajá-manga (ambarella)',
    'cashew-apple': 'Cashew apple',
    persimmon: 'Persimmon',
    'starfruit-sour': 'Sour starfruit',
    'starfruit-sweet': 'Sweet starfruit',
    'fig-ripe': 'Ripe fig',
    'peach-ripe': 'Ripe yellow peach',
    'fig-unripe': 'Green and half-ripe fig',
    'sugar-apple': 'Sugar apple',
    guava: 'Red guava',
    currant: 'Currant',
    'jaboticaba-common': 'Jaboticaba, common',
    'jaboticaba-ponhema': 'Jaboticaba, ponhema',
    'jaboticaba-sabara-skin': 'Jaboticaba sabará, skin on',
    'jaboticaba-sabara-peeled': 'Jaboticaba sabará, peeled',
    orange: 'Orange, whole fruit',
    lemon: 'Lemon',
    'apple-tart': 'Tart apple',
    'apple-sweet': 'Sweet apple',
    papaya: 'Papaya',
    'mango-espada': 'Mango, espada',
    'mango-espadao': 'Mango, espadão',
    passionfruit: 'Passion fruit, juice',
    quince: 'Quince',
    loquat: 'Loquat',
    'pear-ripe': 'Ripe water pear',
    'peach-green': 'Green peach',
    pitanga: 'Pitanga (Suriname cherry)',
    pomegranate: 'Pomegranate',
    'grape-american': 'Grape: ananás, catawba, empire state',
    'grape-isabel': 'Grape: isabel and niágara',
    uvaia: 'Uvaia',
    'umbu': 'Umbu',
    'passionfruit-cerrado': 'Cerrado passion fruit',
    'passionfruit-mato': 'Wild passion fruit',
    'pera-do-cerrado': 'Cerrado pear',
    'jaboticaba-seedless': 'Jaboticaba, pitted',
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

  /** The two axes of Table 1 in Embrapa Doc 29. */
  embrapa: {
    label: 'Embrapa table',
    pectin: 'Pectin',
    acidity: 'Acidity',
    pectinLevels: { rich: 'rich', medium: 'medium', poor: 'poor' },
    acidityLevels: { high: 'high', medium: 'medium', low: 'low' },
    hint: 'How Brazil’s agricultural research agency classifies this fruit, on two separate axes — unlike the American grouping, which folds both into one.',
    viaJackix: 'Row reproduced from Jackix (1988) by Embrapa. Third-hand citation.',
    ownRow: 'Embrapa’s own row, with no intermediary.',
    noRecipe:
      'No book on this shelf publishes a weighed recipe for this fruit. The ratio below comes from the Brazilian legal definition of jam, and yield and shelf life are left out because the source does not state them.',
    bothSources:
      'This fruit appears in both classifications, the American and the Brazilian, and the two agree.',
  },

  sugarLevels: {
    source: 'From the recipe',
    fresh: 'From the MMA book',
    ferber: 'Ferber (80%)',
    extra: 'Extra (50:50)',
    common: 'Standard (40:60)',
    custom: 'Choose',
    sourceNote:
      'The ratio the Blue Chair Jam Cookbook publishes for this fruit, against the weight of prepared fruit. Every fruit has its own, and that is what an average would hide.',
    freshNote:
      'The ratio Brazil’s environment ministry publishes for this fruit in its biodiversity cookbook. It is a plated jam, to be eaten the same day — cooked at 65–70 °C, never jarred or water-bathed, and the book declares no shelf life.',
    ferberNote:
      'Christine Ferber’s house ratio: 800 g of sugar per kilo of fruit. It is the figure in 93 of the 218 recipes in her book, by far the most frequent.',
    extraNote:
      'Brazil’s legal “extra” jam: fifty parts fruit to fifty parts sugar, one to one. It is the lowest ratio the norm will still call jam, and it still matches or beats all nine Blue Chair recipes — eight sit below it, and raspberry ties.',
    commonNote:
      'Brazil’s legal “standard” jam: forty parts fruit to sixty parts sugar. Quince, orange and apple may go to thirty-five by sixty-five, an exception written into the definition itself.',
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
    pectin: 'Powdered pectin, if you use it',
    pectinHint:
      'From 0.5% to 1.5% of the sugar — not of the fruit, and not of the finished jam. Embrapa is the source that states the base, and getting the base wrong here would halve or double the dose. Where you land inside the band depends on the fruit’s own pectin, and the source does not turn that into a number.',
    lemonUnknown: 'The source classifies acidity, it does not publish a dose',
    lemonUnknownHint:
      'Embrapa says whether a fruit is high, medium or low in acidity, and does not say how much acid to add. What you can follow is the target: pH 3.0 to 3.2 in the finished jam, measured. Above 3.4 it will not gel at all.',
    ph: 'Target pH',
    phHint:
      'Measure the pulp before you start: between 3.0 and 3.3, Doc 138 says skip the acid. The gel forms around pH 3, and above 3.4 it does not form.',
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

  brazil: {
    title: 'What the Brazilian sources add',
    lead: 'Two free publications from Embrapa, Brazil’s public agricultural research agency, closed three gaps this research had been carrying in the open: fruit that grows here, the dose for powdered pectin, and the pH window.',

    legalTitle: 'The legal ruler',
    legalLead: 'Brazil’s definition of jam does not talk about recipes. It talks about parts of fruit to parts of sugar, and about how much soluble solid the product must hold. It is a ruler for industrial labelling, which is why it asks for more sugar than any home recipe on this shelf.',
    legalColumns: {
      kind: 'Class',
      parts: 'Fruit : sugar',
      ratio: 'Sugar against fruit',
      solids: 'Soluble solids, minimum',
    },
    legalExtra: 'Extra',
    legalCommon: 'Standard',
    legalException: 'Standard quince, orange and apple',
    legalNote:
      'Notice where they meet: the 65% soluble solids of extra jam are exactly the 65% sugar Christine Ferber names as the keeping point, and neither source knows the other. That is the second, independent source the water-to-boil-off estimate never had.',

    pectinTitle: 'The dose for powdered pectin',
    pectinBody:
      'From 0.5% to 1.5% against the sugar in the formulation — the base is the sugar, and that is the detail a hurried reading loses. The document checks itself: of the eleven weighed formulations it publishes, ten land inside its own band and the eleventh misses by five hundredths of a point. Where you land inside the band depends on the fruit’s own pectin, and that is what the table below is for.',

    phTitle: 'The pH window',
    phBody:
      'The gel forms around pH 3, and above pH 3.4 it does not form at all. In the finished jam the target is 3.0 to 3.2. For anyone with strips or a meter there is a bench rule worth more than any dose: measure the pulp before you start, and if it already sits between 3.0 and 3.3, do not acidify. How much acid to add when it sits outside remains unpublished, and so it stays off the screen.',
    acidityBody:
      'Total acidity in the finished jam should sit between 0.5% and 0.8%. Above 1% you get syneresis — the jam weeping liquid in the jar — the same fault the NCHFP already blamed on excess acid, now with a threshold attached.',

    tableTitle: 'Table 1, in full',
    tableLead: 'Thirty-eight fruits classified on two axes. It is here whole because a trimmed table is a table we edited, and because variety matters: ripe fig and green fig are not the same row, and do not hold the same pectin.',
    tableColumns: {
      fruit: 'Fruit',
      pectin: 'Pectin',
      acidity: 'Acidity',
      origin: 'Row comes from',
    },
    jackix: 'Jackix (1988)',
    torrezan: 'Embrapa',
    tableNote:
      'Thirty of the thirty-eight rows are Jackix’s (1988), reproduced by Embrapa; the origin column says which. Until that book reaches the shelf, the citation for those rows is third-hand, and the table says so rather than hiding it.',

    brixTitle: 'A second table for the setting point, this one in metres',
    brixLead: 'Embrapa converts boiling temperature into °Brix by altitude, in metres and in Celsius. It is not the same quantity as the American table — one says where the gel forms, the other says when the syrup reaches a given concentration — and that is precisely why their landing so close together is worth something.',
    brixNote:
      'At 65 °Brix, interpolating between the 64 and 66 rows, the gap against what this calculator returns stays under seven tenths of a degree across the whole range. Rewritten as how far the setting point sits above boiling at sea level: NCHFP, 4.44 °C; Embrapa, 4.85 °C; Ferber, 5.00 °C. The Brazilian table stops at 2,000 m, and above that the page shows only the American one — extrapolating someone else’s table is not citing, it is inventing.',
    brixHeader: '°Brix',
    thirdHand:
      'Embrapa credits this table onward itself: "taken from a fruit processing course".',
  },

  fresh: {
    notice: 'A jam for immediate use. The MMA cookbook cooks this one at 65–70 °C, enough to dissolve the pectin and well short of the setting point; it fills no jars, takes no water bath and declares no shelf life. Keep it refrigerated and eat it within days — no ratio on this page turns it into a shelf-stable preserve.',
    title: 'The fresh jam, and why it is not a preserve',
    body: 'The biodiversity cookbook from Brazil’s environment ministry publishes weighed jams for fruit no preserving book on this shelf covers: umbu, pitanga, cerrado and wild passion fruit, cerrado pear, jaboticaba and cashew apple. Quantities in grams, from a free official publication, and it is what those fruits needed to step off the norm’s generic ruler.',
    body2: 'What they are not is preserves. The method stops at 65–70 °C, where pectin dissolves — the setting point is thirty-five degrees above that. No jars, no water bath, no shelf life declared. It is a plated component, and the page says so every time one of those fruits is chosen.',
    pectinNote: 'The four pectin doses in the cookbook — 1.33%, 1.33%, 1.00% and 0.50% against the sugar — all land inside the band Embrapa publishes. A third institution, a third kind of publication, four out of four.',
  },

  status: {
    source: 'The source ratio',
    aboveSource: 'Above the source',
    belowSource: 'Below the source',
    sourceLabel: 'Cited recipe',
    freshLabel: 'MMA recipe',
    freshAboveBody: 'More sugar than the cookbook calls for with this fruit. It keeps slightly better in the fridge and sets more readily; it still is not a shelf-stable preserve, because what decides that here is not the ratio — it is the process, which has no jars and no water bath.',
    freshBelowBody: 'Less sugar than the cookbook calls for with this fruit. In a jam for immediate use that is not a shelf-stability risk, because there is no shelf: it is texture and sweetness, and the jam will be looser and less sweet. The same rule holds — refrigerated, eaten within days.',
    normLabel: 'Legal “extra” jam',
    normSource: 'The ratio in the norm',
    normAbove: 'Above the norm',
    normBelow: 'Below the norm',
    normAboveBody:
      'More sugar than the legal “extra” jam, which is where most Brazilian commercial jam sits — the standard class calls for 60 parts sugar to 40 of fruit. It keeps longer and gels more readily; in exchange, too much sugar is the cause the NCHFP lists for crystals in the jar.',
    normBelowBody:
      'Below one to one, the lowest ratio Brazilian law will call jam. This is not a safety warning — it is a category one. What does change is keeping: the norm sets 62% soluble solids for standard jam and 65% for extra, and Ferber arrives at the same 65% by another road. Below that, treat it as a refrigerator spread: chilled, eaten within weeks.',
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
      'That internal disagreement in the NCHFP was a nuisance, and since September 2026 there is a second source that settles it. Modernist Cuisine, vol. 1 states the same rule from another direction — 1 °C every 300 m — and the American table sits within half a degree of it across the full eight thousand feet, including where the NCHFP contradicts its own summary. An agricultural extension service and a book of kitchen physics arriving at the same curve: the NCHFP’s internal gap is rounding, not physics, and interpolating the table remains the right call.',
      'The same book gives two measured points to check against. Denver, at 1,600 m, boils between 93 and 95 °C, which is where our curve lands. The summit of Everest boils at 69 °C — four times beyond the end of the NCHFP table, where the calculation starts extending the slope of the last segment, and it is still off by less than a degree. No use for making jam; useful for knowing the extrapolation is not invention.',
      'And it explains what the NCHFP merely asserts: why jam sets above the boiling point of water. Dissolved solutes lower water activity, fewer molecules escape, and the boiling point rises — this is boiling point elevation. Seawater, at 3.5% salt, boils at 103 °C; candy syrup, at 95% sugar, at 135–145 °C. Jam’s 104.4 °C falls exactly where a 65%-solids syrup should sit between the two.',
      'Brazilian fruit comes in by another road, and the road is stated on screen. Guava, jaboticaba and passion fruit have no weighed recipe in any book on this shelf — what exists is Table 1 from Embrapa, which classifies 38 fruits by pectin and acidity on two separate axes, and the Brazilian legal definition, which fixes the ratio in parts of fruit to parts of sugar. So the classification comes from one source and the ratio from another, and the page names both. What Embrapa does not publish — yield in jars, shelf life, a lemon dose — simply does not appear for those fruits, rather than being borrowed from a fruit that has nothing to do with them.',
      'The water to boil off is the one estimate on the page, and it combines two of Ferber’s numbers: the 65% sugar of a keeping preserve and the 10% to 15% the fruit already brings. It comes out as a range because the second number is a range. It serves one purpose, but an important one: showing why low-sugar jam cooks so much longer. With less sugar, more water has to leave to reach the same 65% — and that is where the fruit falls apart. Since September 2026 that 65% is no longer a single-source figure: it is also the minimum soluble solids Brazilian law demands of extra jam, written in 1988 with no knowledge of Ferber.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'Three books, two official agencies, and seven disagreements worth knowing about.',
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
        topic: 'Jam from a plating book and jam from a preserving book',
        sources:
          'The MMA cookbook publishes jams between 0.40 and 0.77 sugar against fruit. Brazilian law requires at least 1.00 before the product may be called extra jam, and Saunders works between 0.42 and 1.00 in recipes that go into jars.',
        decision:
          'Shows all three rulers and says they measure different products. An environment ministry cookbook prints as jam what the labelling norm would not allow — and it is right, because its jam is eaten the same day. The calculator gives the ratio from whichever source covers that fruit, with the warning that source justifies.',
      },
      {
        topic: 'How much sugar, again: recipe or norm',
        sources:
          'Saunders ranges from 0.42 to 1.00 sugar against fruit. Ferber uses 0.80. Brazilian law requires at least 1.00 before the product may be called extra jam, and 1.50 for standard jam.',
        decision:
          'Shows both rulers and says they measure different things. The norm classifies a labelled industrial product; Saunders and Ferber write home recipes. Neither is wrong, and the site does not quietly pick one.',
      },
      {
        topic: 'Where the gel forms, in metres and Celsius',
        sources:
          'NCHFP: 8 °F above boiling, tabled in feet and Fahrenheit. Embrapa: boiling temperature by °Brix, in metres and Celsius, up to 2,000 m. Ferber: 105 °C.',
        decision:
          'Computes from the NCHFP table, which reaches higher, and publishes the Brazilian one alongside as a check. The two land within seven tenths of a degree of each other across the shared range, with neither knowing the other exists.',
      },
      {
        topic: 'Two classifications of fruit',
        sources:
          'NCHFP: three groups on one axis, folding missing acid together with missing pectin ("acid, pectin or both"). Embrapa: two separate axes, pectin and acidity, three levels each.',
        decision:
          'Shows whichever one the source for that fruit publishes, and both where both exist. Translating one into the other would invent an equivalence neither claims. On the three fruits where they meet — strawberry, ripe peach, ripe fig — they agree.',
      },
      {
        topic: 'Pectin in guava',
        sources:
          'The NCHFP puts guava in Group III, "always needs added acid, pectin or both". McGee says the Spanish exploited its high pectin content to make a New World quince paste.',
        decision:
          'Offers guava as of September 2026, and offers it because Embrapa broke the tie: "red guava, ripe and half-ripe — pectin rich, acidity medium". The NCHFP’s group III is "acid, pectin or both", and the reading that acid is what is missing stopped being a guess.',
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
          'The official grouping of fruit into three classes, by whether they hold their own pectin and acid (I), may need one of the two (II), or always need added acid, pectin or both (III). It is the American ruler, and it has a single axis: group III does not say which one is missing. The Brazilian one separates them.',
      },
      'embrapa-table': {
        term: 'Embrapa Table 1',
        definition:
          'The Brazilian classification: 38 fruits on two independent axes, pectin (rich, medium, poor) and acidity (high, medium, low). It is what lets you say of guava that pectin is plentiful and acid is short, something the American group III cannot distinguish. Thirty of the rows are reproduced from Jackix (1988).',
      },
      'legal-jam': {
        term: 'Extra and standard jam',
        definition:
          'The two classes in Brazilian food law, defined by ratio: extra is fifty parts fruit to fifty parts sugar, standard is forty to sixty. Quince, orange and apple may go to thirty-five by sixty-five. It is a ruler for industrial labelling, not for a home recipe — which is why it asks for more sugar than the books do.',
      },
      'soluble-solids': {
        term: 'Soluble solids',
        definition:
          'How much of the finished product is dissolved matter, nearly all of it sugar, read in degrees Brix on a refractometer. The Brazilian norm requires at least 62% in standard jam and 65% in extra; Ferber arrives at the same 65% calling it sugar content. It is the number that decides whether the jam keeps outside the fridge.',
      },
      'apple-jelly': {
        term: 'Apple jelly',
        definition:
          'Pectin borrowed from another fruit instead of bought as powder. Ferber uses 200 g per kilo in fruits that will not gel alone — pears, cherries and sour cherries among them — and in red-fruit jams accepts redcurrant jelly in its place.',
      },
      syneresis: {
        term: 'Syneresis',
        definition:
          'The jam weeping liquid in the jar after it is made. The causes the NCHFP lists are excess acid, which makes the pectin unstable, and storage that is too warm or fluctuates in temperature. Embrapa supplies the threshold that was missing: above 1% total acidity in the finished jam, syneresis follows.',
      },
      marmalade: {
        term: 'Marmalade and marmelada',
        definition:
          'Two different things with one origin. The word is Portuguese and named a quince paste; in English, marmalade became the translucent jelly with citrus peel suspended in it, after the sour orange displaced the quince in the 18th century.',
      },
    },
  },


  audit: {
    title: 'Check the jam you already make',
    lead: 'Pick the fruit, weigh what went into the pan, and see how your ratio compares with the one the source publishes for that fruit. Each fruit has its own ruler, and the screen says which one answered.',

    fruitLabel: 'Fruit in your jam',
    fruit: 'Prepared fruit',
    fruitHint: 'Already peeled, pitted and cut: the weight that goes into the pan.',
    sugar: 'Sugar you used',
    pectin: 'Powdered pectin',
    pectinHint: 'Leave it at zero if your jam takes no powdered pectin.',

    sugarRatio: 'Sugar per gram of fruit',
    pectinPercent: 'Pectin against the sugar',
    sugarSubject: 'the sugar',
    pectinSubject: 'the pectin',

    basis: {
      recipe: 'The comparison is against the weighed recipe the source publishes for this fruit.',
      fresh: 'No preserving book on the shelf covers this fruit: the comparison is against the fresh recipe from the MMA collection, which is a jam for immediate eating, not a shelf-stable preserve.',
      norm: 'No book on the shelf publishes a weighed recipe for this fruit. The comparison is against the legal minimum for extra jam — a labelling ruler, not a tested recipe.',
    },
  },
  sources: {
    title: 'Sources for this calculator',
    lead: 'Two preserving books, a McGee, an American agency and two Embrapa publications. The ratios come from Saunders’s weighed recipes and Ferber’s house proportion; the temperature by altitude and the keeping rules from the NCHFP; the Brazilian fruit, the legal ruler, the pectin dose and the pH window from Embrapa.',
    page: 'p.',
    section: 'section',
  },
};
