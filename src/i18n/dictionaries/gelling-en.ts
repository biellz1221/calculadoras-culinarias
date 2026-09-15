import type { gellingPtBR } from './gelling-pt-BR';

export const gellingEn: typeof gellingPtBR = {
  meta: {
    title: 'Gelatin and agar calculator',
    description:
      'How much gelatin, agar, xanthan or carrageenan for the liquid you have, at the texture you want — with the sheet-to-powder conversion by Bloom strength.',
    keywords: [
      'gelatin calculator',
      'how many gelatin sheets',
      'agar agar quantity',
      'how much xanthan gum',
      'bloom strength conversion',
      'fluid gel',
      'iota kappa carrageenan',
    ],
    imageAlt: 'Gelling and thickening agent calculator',
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        question: 'How many gelatin sheets equal one envelope of powder?',
        answer:
          'It depends on the grade of the sheet, which is why the conversion exists. The source’s formula is weight × the Bloom you have ÷ the Bloom the recipe calls for. A gold sheet (190–220 Bloom) weighs 2 g; a bronze one (125–155) weighs 3.3 g — and the two gel almost identically, because the weaker sheet is made heavier on purpose.',
      },
      {
        question: 'Can I swap gelatin for agar gram for gram?',
        answer:
          'No. Different doses and different behaviour: agar has to boil to hydrate, sets firmer and holds to 85 °C; gelatin melts at 37 °C, which is exactly what makes it dissolve in your mouth. For a demoulded gel the source uses 0.8% gelatin; for the vegetarian version of the same panna cotta, 0.15% agar with 0.12% xanthan.',
      },
      {
        question: 'Does xanthan gum gel?',
        answer:
          'No. It thickens: it gives the liquid body without letting it set, and it works cold, with no boiling. If you want a gel that comes out of a mould, that is gelatin, agar or carrageenan.',
      },
      {
        question: 'Why is there no spherification here?',
        answer:
          'Because no book on our shelf publishes a dose for sodium alginate or calcium chloride. McGee describes the mechanism and the glossary entry is here, but a number without a source does not go on screen — and that number lives in volume 4 of Modernist Cuisine, which we do not have.',
      },
      {
        question: 'What counts as “liquid”?',
        answer:
          'Whatever the source counts. In its panna cotta that is the milk, the cream and the fruit purée — 530 g in all — and the sugar and salt stay out. The 0.8% rule applied to those 530 g returns exactly the 4.3 g of gelatin the recipe prints.',
      },
    ],
  },

  eyebrow: 'Gelling calculator',
  title: 'Gelatin, agar and xanthan by the weight of your liquid',
  lead: 'Say how much liquid you have and what texture you want: the dose comes out in grams, with the page it came from. The sheet-to-powder conversion, which is where nearly every recipe goes wrong, comes with it.',

  input: {
    label: 'What you have',
    liquid: 'Liquid',
    liquidHint: 'Everything that becomes the gel: stock, cream, juice, milk. Sugar and salt stay out.',
    texture: 'Texture you want',
  },

  textures: {
    thin: 'Thickened broth',
    sauce: 'Sauce',
    puree: 'Purée thickness',
    'fluid-gel': 'Fluid gel',
    'soft-set': 'Soft, spoonable gel',
    set: 'Demoulded gel',
    'hard-set': 'Hard gel, cuttable',
  },

  textureNotes: {
    thin: 'A broth that gains body without ceasing to be a broth — it still runs off the spoon.',
    sauce: 'The thickness of salad dressing or ketchup: it coats the back of a spoon.',
    puree: 'As thick as a purée, and still a pure liquid underneath.',
    'fluid-gel': 'It sets solid and is then blended smooth. Thick on the spoon, thinning in the mouth, with a creamier texture than a starch-thickened sauce.',
    'soft-set': 'Set, but wobbling and melting in the mouth: flan, panna cotta, spoon creams.',
    set: 'It sets in the mould and comes out whole: firm panna cotta, aspic, fruit jelly.',
    'hard-set': 'Firm enough to cube, sheet or grate — and, with some agents, to go in the oven.',
  },

  agents: {
    gelatin: 'Gelatin',
    agar: 'Agar-agar',
    xanthan: 'Xanthan gum',
    iota: 'Iota carrageenan',
    kappa: 'Kappa carrageenan',
    gellan: 'Gellan gum',
    methylcellulose: 'Methylcellulose',
    pectin: 'Pectin',
    wondra: 'Wondra starch',
  },

  agentNotes: {
    gelatin: 'Melts at 37 °C — body temperature, which is exactly why it dissolves in your mouth. No use for anything that will be served hot.',
    agar: 'It has to boil to hydrate, which rules it out for raw preparations and cold soups. In exchange it holds to 85 °C once set — and that number is the one figure on this page where two independent works say exactly the same thing.',
    xanthan: 'Thickens, does not gel. Works cold, no boiling. It is potent: weigh it, do not measure by spoon — a sticky liquid means you overshot.',
    iota: 'Makes soft, elastic gels, of the flan or panna cotta kind. It is thixotropic: once set you can break the texture with a whisk and it rebuilds itself resting in the cold.',
    kappa: 'Makes firm, brittle gels, of the moulded-jelly kind. It sets fast, at 50 °C — work hot and keep it moving.',
    gellan: 'The only one here that does not melt once set. It goes in the oven, takes a blowtorch and works as a pastry filling — no other agent on this page does that.',
    methylcellulose: 'It works backwards from everything else: it gels when heated and melts when cooled. That is what makes fried gel possible. It dissolves cold, at 3–4 °C, and sets at 60 °C — with only ten degrees between melting and gelling, the narrowest margin on the page.',
    pectin: 'The same one from jam, here at gelling doses. Low-methoxyl pectins give soft gels; high-methoxyl ones give the firm gel of a pâte de fruit.',
    wondra: 'Starch, not a hydrocolloid — which is why the dose is ten times larger. Dust it and whisk; blending makes the texture gummy.',
  },

  result: {
    title: 'How much to use',
    agent: 'Agent',
    amount: 'Amount',
    percent: '% of liquid',
    gels: 'Gels',
    thickens: 'Thickens only',
    boil: 'Must boil',
    noBoil: 'No boiling needed',
    holds: 'Holds to',
    sets: 'Sets at',
    irreversible: 'Does not melt once set',
    gelsWhenHot: 'Sets with heat',
    pairNote: 'Iota and kappa go together in this recipe: the mixture lands between the soft gel of one and the firm gel of the other.',
    empty: 'The source publishes no dose for any agent at this texture.',
  },

  bloom: {
    title: 'Sheet or powder: converting by Bloom',
    lead: 'The recipe calls for powder and you have sheets — or the other way round. The grade changes the weight, and the source publishes the exact formula instead of the “one sheet per spoonful” guess.',
    grade: 'The gelatin you have',
    formula: 'new weight = original weight × original Bloom ÷ new Bloom',
    reference: 'The published dose is in Knox powder, 225 Bloom',
    use: 'Use',
    sheets: 'sheets',
    sheetsNote: 'The count comes out fractional on purpose: half a sheet more changes the gel, and rounding here would hide that.',
    grades: {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      knox: 'Knox (powder)',
      platinum: 'Platinum',
    },
    bloomLabel: 'Bloom',
    perSheet: 'g per sheet',
    powder: 'powder',
    tableCaption: 'Grades of gelatin, as the source publishes them',
    sheetInsight:
      'Look at the table: the weaker the sheet, the heavier it is. Bloom times grams per sheet lands between 400 and 460 across all four grades — sheets are made to carry roughly the same gelling power, which is why recipes written in “number of sheets” work at all. That reading is ours, not a claim the book makes.',
    directNote:
      'The book also says gold and platinum can replace Knox powder directly. By its own formula that is off by about 10% each way. It is a kitchen shortcut; here we use the formula.',
  },

  firmness: {
    title: 'What changes the firmness',
    lead: 'The dose is the start. Whatever else is in the liquid changes the gel, and McGee gives the direction of each — direction, not a number: anyone publishing “add 20%” would be inventing it.',
    stronger: 'Sets firmer',
    weaker: 'Sets softer',
    modifiers: {
      salt: 'Salt — it interferes with the bonds between gelatin molecules.',
      sugar: 'Sugar — it pulls water away from the gelatin. Fructose is the exception.',
      milk: 'Milk.',
      alcohol: 'Alcohol — until it reaches 30–50% of the gel, when the gelatin precipitates into grains and the gel is lost.',
      acid: 'Acid below pH 4 — vinegar, fruit juice, wine.',
    },
    compensate:
      'Salt and acid are compensated for with more gelatin. Tannins from tea and red wine cloud the jelly by precipitating the gelatin itself.',
  },

  truth: {
    title: 'How we know the rule holds',
    body: [
      'The source confirms itself three times on the same page, and that is what this calculator rests on.',
      'The dose: its panna cotta holds 530 g of liquid — 30 g milk, 300 g cream, 200 g raspberry purée — and the table prints 4.3 g of gelatin. The rule of 0.8 g per 100 g gives 4.24 g: the book rounded its recipe up. What that pins down is what it counts as liquid — with the sugar in it would be 4.84 g, and with only the dairy, 2.64 g.',
      'The Bloom formula: the printed example converts 2.6 g of Knox into 3.7 g of silver, and 2.6 × 225 ÷ 160 = 3.66. The printed substitutions for silver (1.1 g) and bronze (1.3 g) per 100 g of liquid come out of the same arithmetic, starting from the 0.8 g.',
      'The fluid gel: the onion sauce takes 3.5 g of agar for 500 g of onion milk, and the recipe’s own scaling column prints 0.7% — which is where a fluid gel falls between the thick sauce and the purée of the instruction page.',
    ],
  },

  spherification: {
    title: 'Spherification',
    lead: 'How much liquid you are spherifying, and by which of the two techniques. The product dose and the bath dose come out separately, because they are percentages of different things.',
    liquid: 'Liquid to spherify',
    liquidHint: 'The flavoured base that becomes the sphere.',
    bath: 'Bath water',
    bathHint: 'The bath is reusable: make a volume that fits your container.',
    method: 'Technique',
    methods: {
      direct: 'Direct (caviar)',
      reverse: 'Reverse',
    },
    methodNotes: {
      direct: 'The alginate goes in the liquid and the sphere drops into a calcium bath. The calcium moves in and does not stop: in about 30 minutes the sphere gels through and becomes a single texture. Caviar is eaten straight away.',
      reverse: 'The calcium goes in the liquid and the sphere drops into an alginate bath. Alginate is too large a molecule to move in, so it reacts only at the surface: the membrane closes and the centre stays liquid. This is the one that keeps.',
    },
    baseTitle: 'In the liquid',
    bathTitle: 'In the bath',
    optional: 'optional',
    limitsTitle: 'What the direct method will not take',
    limits: {
      fat: 'Fat.',
      dairy: 'Dairy, or anything that already carries calcium — the calcium inside would react with the alginate too early. This is why the course makes its Parmesan sauce by the reverse method.',
      alcohol: 'Pure alcohol above 30° proof.',
      acid: 'An acid medium: the alginate precipitates. The sodium citrate on the list is there precisely to correct the acidity of the base.',
      irreversible: 'The reaction cannot be stopped. Rinsing the sphere does not help: the calcium is already inside.',
    },
    additives: {
      alginate: 'Sodium alginate',
      'calcium-chloride': 'Calcium chloride',
      gluconolactate: 'Gluconolactate',
      xanthan: 'Xanthan gum',
      'sodium-citrate': 'Sodium citrate',
    },
    truthTitle: 'The course’s own recipes',
    truthBody:
      'The two caviar recipes in the course itself land at 0.489% and 0.495% alginate — consistent with each other and a hair below the 0.5% floor it states. Not a contradiction: it is where the chef actually works inside the band she publishes, at the bottom of it. And across the eight reverse-spherification recipes, the gluconolactate and the xanthan stay inside the course’s generic bands without a single exception.',
  },

  sourceNote: {
    title: 'About the source for this part',
    body: [
      'The spherification doses and the new agents come from course material — two courses by Rais Esteve, head of R&D at 100%Lab, published by Scoolinary. Course material is not a bibliography, and this page would rather say so than disguise it: no book pagination, no bibliography of its own, and not free to open. We cite by document and slide number.',
      'Nor is it a flawless source, and the defects are on the record because they change how it should be read. The slide giving the direct-spherification proportions prints "xanthan" twice on the same line. And the methylcellulose slide writes "2%, 2 grams per liter" — 2% of a liter is 20 g, an error of one order of magnitude. That it is an error and not another convention, the course itself proves: it gets the same conversion right for kappa and for gellan. We use the percentages and drop the parenthesis.',
      'What carries confidence in the rest is internal coherence: the course’s recipes obey the proportions it states, in all eight that can be checked. It is the same test that validated Wybauw for ganache and Corvitto for gelato.',
    ],
  },

  ocr: {
    title: 'A note about the source',
    body: [
      'Our copy of *Modernist Cuisine at Home* is a scan with optical character recognition, and OCR gets names right while destroying numbers — ours turns “500 mL” into “S00 mL” in places.',
      'So every dose on this page was checked against the image of the printed page, not the extracted text. The same check was repeated on the four brine recipes that already used this book: all four were correct.',
    ],
  },

  glossary: {
    title: 'Glossary',
    full: 'See in the glossary',
    noSource: 'No source in our bibliography: the definition describes current practice, and no book on the shelf backs it.',
    anchor: 'Link to this entry',
    terms: {
      'hydrocolloid': {
        term: 'Hydrocolloid',
        definition:
          'A long molecule that disperses in water and traps the liquid in a mesh, thickening or gelling it. Gelatin, agar, xanthan and carrageenan are all hydrocolloids; starch is one too, by a different route.',
      },
      'fluid-gel': {
        term: 'Fluid gel',
        definition:
          'A gel that sets solid and is then blended back into a liquid. Thick on the spoon and thinning in the mouth, with a creamier texture than a sauce thickened with starch or xanthan.',
      },
      'bloom-strength': {
        term: 'Bloom strength',
        definition:
          'A measure of gelatin’s gelling power, named after Oscar Bloom, who invented the device that measures it. The higher the number, the firmer the gel for the same weight. Sheets sold as bronze, silver, gold and platinum correspond to rising Bloom ranges.',
      },
      'spherification': {
        term: 'Spherification',
        definition:
          'A technique built on alginate, extracted from brown seaweeds, which gels only in the presence of calcium. A calcium-free alginate solution is dripped or injected into a calcium solution and gels on contact, forming spheres or threads with a thin skin and a liquid centre.',
      },
    },
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'Every number comes from a single book, and the page says so. McGee is here for what he does better than anyone: explaining why salt, sugar and acid change the gel — without publishing how much, which he honestly does not have.',
    page: 'p.',
    section: 'ch.',
  },
};
