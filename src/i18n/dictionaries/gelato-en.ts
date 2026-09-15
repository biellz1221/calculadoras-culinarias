import type { gelatoPtBR } from './gelato-pt-BR';

/**
 * Tradução da calculadora de gelato. O tipo vem do português, então uma chave
 * nova lá quebra a compilação aqui até ser traduzida.
 *
 * Os ids dos ingredientes continuam sendo os slugs em português, que são a chave
 * estrangeira do dado da planilha. O que muda é só o rótulo.
 */
export const gelatoEn: typeof gelatoPtBR = {
  meta: {
    title: 'Gelato calculator',
    description:
      'Build the base in grams and see sugars, fat, solids, POD and PAC against the range for your gelato type. Batch sizing in litres and 164 ingredients.',
    keywords: [
      'gelato calculator',
      'gelato balancing',
      'POD and PAC',
      'gelato total solids',
      'sorbet recipe',
      'gelato base',
      'homemade gelato',
      'ice cream antifreeze',
    ],
    imageAlt:
      'Card for the gelato calculator, with its title and where the balancing parameters come from.',
  },

  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'How much air should my gelato have?',
        answer:
          'Between 30% and 40% overrun, with 35% as the target — that is the band Angelo Corvitto sets for maximum-quality gelato. Industrial ice cream plays much higher: Clarke measures 20% to 100%, and a hundred per cent means one litre of mix becoming two litres of ice cream. To measure yours, weigh the same glass filled with mix and then filled with gelato, and divide one by the other: the two decimal places are the overrun.',
      },
      {
        question: 'Why is the default density 1.10 g/mL?',
        answer:
          'Because that is the weight of a litre of mix in Chris Clarke’s The Science of Ice Cream. Corvitto works with 1.00 without saying so, and the gap is not small: at 35% overrun a litre of gelato would weigh 815 g by Clarke’s figure and 740 g by Corvitto’s. Neither publishes the composition of the mix he is talking about, so the calculator shows both and leaves the field editable.',
      },
      {
        question: 'What are POD and PAC?',
        answer:
          'POD is sweetening power and PAC is antifreezing power, both measured per kilo of mix. They explain why two recipes carrying the same amount of sugar can taste and scoop very differently: each sugar sweetens and lowers the freezing point at its own rate.',
      },
      {
        question: 'How much sugar goes into gelato?',
        answer:
          'Between 14 and 22% of the mix in a milk gelato, and between 23 and 32% in a sorbet. Sorbet needs more because it has no fat and no milk solids holding the water: there, sugar does the job alone.',
      },
      {
        question: 'Why does my gelato freeze rock hard?',
        answer:
          'Almost always a low PAC. In a milk gelato the range runs from 220 to 300 per kilo of mix; below that there is free water left to freeze and the scoop turns to stone. The calculator flags whichever metric falls out of range and says what to change.',
      },
      {
        question: 'What are total solids for?',
        answer:
          'They are everything in the recipe that is not water, 34 to 42% in a milk gelato. Too few solids and the gelato turns watery and full of ice crystals; too many and the texture goes heavy and rubbery.',
      },
    ],
  },

  eyebrow: 'Gelato calculator',
  title: 'Gelato balanced before it goes into the machine',
  lead: 'Build the recipe in grams and the calculator shows, line by line, what it does to the sugars, the fat, the solids and the freezing point. Every metric is compared with the range for your base type, and when one falls outside, the screen says what to do about it.',

  presetLabel: 'Starting recipe',

  presets: {
    'fior-di-latte': 'Fior di latte',
    'morango-ao-leite': 'Strawberry milk gelato',
    'sorbet-morango': 'Strawberry sorbet',
    'chocolate-agua': 'Water-based chocolate',
    'coco-vegano': 'Coconut and cashew (vegan)',
  },

  baseLabel: 'Base type',

  bases: {
    'gelato-leite': {
      name: 'Milk gelato',
      description: 'The classic white base, no fruit.',
    },
    'gelato-leite-fruta': {
      name: 'Milk gelato with fruit',
      description: 'Milk base with purée or fresh fruit.',
    },
    sorbet: {
      name: 'Sorbet',
      description: 'Water and fruit, no dairy.',
    },
    'chocolate-agua': {
      name: 'Chocolate on a water base',
      description: 'Dairy-free chocolate, structured by cocoa.',
    },
    'base-vegana': {
      name: 'Vegan base',
      description: 'Plant milks and fats standing in for dairy.',
    },
  },

  batch: {
    title: 'Batch size',
    liters: 'Batch volume',
    litersUnit: 'L',
    shortcuts: 'Volume shortcuts',
    density: 'Mix density',
    densityUnit: 'g/mL',
    densityHint:
      'The default is 1.10 g/mL, the weight of a litre of mix in Clarke. The syrup mass comes from litres × 1000 × density. Corvitto works with 1.00 — if your mix is lighter, change it here.',
    mass: 'Mix mass',
    rescaleHint:
      'Changing the volume or the density rescales the whole recipe, keeping the proportions.',
    driftAbove: 'The recipe is over the batch target by',
    driftBelow: 'The recipe is under the batch target by',
    scaleToBatch: 'Scale to batch',
  },

  aeration: {
    title: 'The air, and what a litre weighs',
    lead: 'Balancing is what goes into the pan. What comes out of the machine also depends on how much air went in — and no balancing spreadsheet gives you that, because it belongs to the machine and the process. You can measure it on the bench with a scale and a glass.',

    targetTitle: 'How much air gelato wants',
    targetBody:
      'Corvitto sets the quality band between 30% and 40% overrun, and picks 35%. It is not a machine limit, it is a choice. Too little air leaves gelato heavy; too much strips its body, and it "loses freshness and flavour, looking like mousse and leaving an empty taste in one’s mouth".',
    industrialBody:
      'Industrial ice cream plays a different game. Clarke measures samples from 17% to 50% air by volume — 20% to 100% overrun — and says the structure still holds up to around 120%. A hundred per cent overrun is one litre of mix becoming two litres of ice cream. That is why gelato weighs more than a supermarket tub, and the difference is a maker’s choice, not a limitation of whoever lacks the machine.',
    sorbetNote:
      'With no fat and no protein, as in sorbetto, going past 60% is hard even if you want to — so says Clarke. That is a technical ceiling, not a target: neither book publishes a separate quality target for sorbetto, and this page does not invent one.',

    measureTitle: 'How to measure yours, with a glass and a scale',
    measureBody:
      'The arithmetic is Corvitto’s and fits on one line: divide the weight of the mix by the weight of the gelato, in the same container. The two decimal places are the overrun. Weigh the empty glass for its tare, fill it to the brim with mix and note the weight; fill the same glass with finished gelato, leaving no bubbles, and note that. Two hundred and seventy grams of mix to two hundred of gelato gives 1.35, which is 35%.',
    sameEquation:
      'Clarke arrives at the same place through density, and it is the same equation: weighing the same glass twice is measuring density with the volume cancelling out. Two books that do not cite each other, writing one calculation two ways.',
    cupNote:
      'For hardened gelato the glass will not do — forcing hard ice cream into it would change the volume. Clarke uses a displacement chamber: weigh the portion and measure the water it displaces.',

    densityLabel: 'Your syrup density',
    targetLabel: 'Overrun you want',
    resultLabel: 'A litre of your gelato should weigh',
    resultHint:
      'Worked out from the syrup density in the batch field. If your litre weighs more than this, less air went in than you wanted; if it weighs less, more did.',
    mixLabel: 'Glass with mix',
    gelatoLabel: 'Glass with gelato',
    measuredLabel: 'Measured overrun',
    measuredHint: 'Both weights with the glass tare already removed, same container.',
    inRange: 'Inside Corvitto’s band',
    aboveRange: 'Above Corvitto’s band',
    belowRange: 'Below Corvitto’s band',

    iceTitle: 'The 105% caveat',
    iceBody:
      'Water grows about 8% when it turns to ice, so part of the volume the calculation reads as air is not air. Clarke shows the case: 100% nominal overrun is really 105%. He says himself the effect "is often ignored", and this page ignores it too — correcting for it would require the recipe’s ice content at serving temperature, which the course spreadsheet does not supply. It stays a caveat, not a calculation.',

    divergenceTitle: 'Where the two books disagree',
    divergenceBody:
      'Clarke writes that a litre of typical mix weighs 1.1 kg. Corvitto never states a density, but his arithmetic assumes 1.0: he starts from 1,000 g of mix to conclude that a litre of gelato at 35% weighs 740 g. With Clarke’s figure the same litre would weigh 815 g. That is 75 g per litre, nearly 400 g in a five-litre tub.',
    divergenceDecision:
      'The calculator does not break the tie. The default is 1.10 with Clarke’s page beside it, the field stays editable, and both numbers stay in view. Neither author publishes the composition of the mix he describes, and without that there is no telling which one matches your syrup — which is exactly why the glass matters: whoever weighs does not have to believe either of them.',
  },

  picker: {
    label: 'Search ingredients',
    placeholder: 'Type part of the name',
    hint: '164 ingredients from the spreadsheet, grouped by category. Arrow keys to move, Enter to add.',
    empty: 'No ingredient by that name.',
    truncated: 'Showing the first matches. Narrow the search to see the rest.',
    listLabel: 'Matching ingredients',
  },

  categories: {
    custom: 'My ingredients',
    base: 'Bases',
    liquido: 'Liquids',
    laticinio: 'Dairy and eggs',
    acucar: 'Sugars and sweeteners',
    fruta: 'Fruit',
    chocolate: 'Chocolate and cocoa',
    pasta: 'Nut pastes',
    vegetal: 'Vegetables and plant bases',
    estabilizante: 'Stabilisers and fibres',
    aroma: 'Flavourings and spices',
    confeitaria: 'Confectionery and biscuits',
    alcool: 'Spirits and liqueurs',
  },

  table: {
    caption: 'Recipe ingredients, with editable amounts',
    ingredient: 'Ingredient',
    amount: 'Amount',
    share: '% of batch',
    solids: 'Solids',
    remove: 'Remove',
    total: 'Total',
    empty: 'The recipe is empty.',
    emptyHint: 'Pick a starting recipe above, or search for an ingredient.',
    editHint:
      'Every amount is editable and the balance updates as you type. Up to 2 L values show in grams; above that, in kilos.',
    unknown: 'Ingredient not in the catalogue',
    flagged: 'Inconsistent composition in the spreadsheet',
  },

  balance: {
    title: 'Base balance',
    balanced: 'Balanced',
    outOfRangeOne: 'metric out of range',
    outOfRangeMany: 'metrics out of range',
    empty: 'No ingredients',
    recommended: 'Range for this base type',
    perKg: 'per kg of mix',
    ofMass: '% of mass',

    correction:
      'To land in the range for this {total} batch: {subject} between {min} and {max}.',
    status: {
      below: 'Below range',
      in: 'In range',
      above: 'Above range',
    },
    servingTemp: 'Average serving temperature',
    servingTempHint:
      'Estimated as PAC ÷ 25. It is the temperature at which the base usually scoops well in the cabinet.',
    totalMass: 'Total mass',
    protein: 'Protein',
    autoBalance: 'Balance automatically',
    autoBalanceHint:
      'The optimiser adjusts the other lines and aims total mass at the batch target. Each line may only move between a quarter and four times its current amount. Without that floor it would zero the stabiliser, which barely moves the metrics and therefore looks disposable.',
    keptFixed: 'Holding the line you edited last:',
    solved: 'Done: all eight metrics are back inside the range for this base type.',
    partial: 'Adjusted what could be adjusted. Still out of range:',
    unchanged:
      'There is no way to balance this by touching only the other lines: they are already at the limit the optimiser may move. Swap an ingredient or change the base type.',
  },

  metrics: {
    sugars: {
      label: 'Sugars',
      help: 'Sucrose and equivalents. They pull sweetness, body and freezing point all at once.',
    },
    fats: {
      label: 'Fat',
      help: 'Total fat, whether from dairy, egg, chocolate or nuts. This is what makes it creamy.',
    },
    msnf: {
      label: 'MSNF',
      help: 'Milk solids non-fat: protein, lactose and minerals. They give structure and hold water.',
    },
    otherSolids: {
      label: 'Other solids',
      help: 'Solids that are neither sugar, fat nor MSNF: fibres, cocoa, stabiliser, fruit pulp.',
    },
    totalSolids: {
      label: 'Total solids',
      help: 'Everything that is not water. Sets the yield and the resistance to melting.',
    },
    water: {
      label: 'Water',
      help: 'Free water in the mix. Whatever is not bound by sugar or solids turns into ice crystals.',
    },
    pod: {
      label: 'POD',
      help: 'Sweetening power per kg of mix, measured against sucrose.',
    },
    pac: {
      label: 'PAC',
      help: 'Anti-freezing power per kg of mix. This is what decides how hard it sits in the cabinet.',
    },
  },

  hints: {
    sugars: {
      below: 'Add sucrose or dextrose.',
      above: 'Cut the sugars back, or add more liquid.',
    },
    fats: {
      below: 'Add cream, egg yolk or nut paste.',
      above: 'Swap part of the cream for milk.',
    },
    msnf: {
      below: 'Add skimmed milk powder.',
      above: 'Cut the milk powder: too much turns the texture sandy.',
    },
    otherSolids: {
      below: 'Add fibre, cocoa or stabiliser.',
      above: 'Cut fibre, cocoa or concentrated purée.',
    },
    totalSolids: {
      below: 'Raise the solids: milk powder, sugar or fibre.',
      above: 'Add water, or cut the powders.',
    },
    water: {
      below: 'Add water or milk.',
      above: 'Cut the liquids, or raise the solids.',
    },
    pod: {
      below: 'Swap part of the dextrose for sucrose or fructose.',
      above: 'Swap part of the sucrose for glucose powder or maltodextrin.',
    },
    pac: {
      below: 'Raise the dextrose or the invert sugar.',
      above: 'Swap dextrose for sucrose or glucose powder.',
    },
  },

  flaws: {
    title: 'Ingredients with an inconsistent composition in the spreadsheet',
    lead: 'In 14 of the 164 ingredients the composition declared in the source spreadsheet does not add up. The data has not been corrected here: the provenance is the spreadsheet, and quietly changing a source number is exactly what this site does not do. The warning exists so you know where the result is less trustworthy.',
    severity: {
      severe: 'Changes the result',
      mild: 'Spreadsheet drift',
    },
    issues: {
      'no-composition':
        'Solids and water add up to zero: the ingredient enters as pure mass and dilutes every metric without showing up in any of them.',
      'solids-contradicted':
        'The parts declare solids, but the total solids figure is zero: a solid recorded as 100% water. The engine reads the total, so the real composition never enters the calculation.',
      closure: 'Solids plus water do not add up to 100% of the ingredient mass.',
      parts:
        'Sugars, fat, MSNF and other solids do not add up to the declared total solids.',
    },
  },

  nutrition: {
    title: 'Nutrition estimate',
    lead: 'Derived from the composition in the spreadsheet, not from lab analysis. It is guidance for whoever is building the recipe, not a label, and no substitute for a report.',
    nutrient: 'Nutrient',
    portion: 'Portion of',
    portionHint: 'a small scoop',
    per100: '100 g',
    per100Hint: 'reference',
    batch: 'Whole batch',
    energy: 'Energy',
    carbs: 'Carbohydrate',
    ofWhichSugars: 'of which sugars',
    fats: 'Fat',
    protein: 'Protein',
    method:
      'Carbohydrate comes out by difference (total solids minus fat and protein), the way labelling does it, and therefore includes fibre and polyols. Energy uses Atwater: 4 kcal/g for carbohydrate and protein, 9 for fat.',
    adjusted:
      'Using their own energy factor instead of Atwater (polyol, fibre or alcohol):',
  },

  method: {
    title: 'How the balancing works',
    body: [
      'Every ingredient in the spreadsheet is described as the composition of one gram of it: how much is sugar, how much is fat, how much is milk solids, how much is other solids, how much is water. The whole recipe is those fractions multiplied by the grams on each line, and nothing else. That is why swapping 50 g of milk for 50 g of cream moves four metrics at once.',
      'Six of the eight metrics are fractions of total mass, so they read as a percentage of the mix. POD and PAC are different: they are normalised per kilo of mix, because they measure intensity rather than quantity. Two recipes with the same amount of sugar can be very differently sweet depending on which sugar it is.',
      'The range for each metric changes with the base type. A sorbet works with more sugar and more PAC than a milk gelato precisely because it has no fat and no milk solids holding the water: without that support, the antifreeze has to do the job alone. Changing the base type does not touch the recipe, only the ruler it is measured with.',
      'The batch is sized in litres and turned into mass by an adjustable density. The 1.10 g/mL default was a declared working value until September 2026, when it gained a source: it is the weight of a litre of mix in Clarke. Changing the volume rescales every line in the same proportion — the recipe stays the same, just bigger. If you edit a line by hand and the total drifts off target, the scale-to-batch button appears.',
      'One thing this calculator still does not do, and now says why better: the air. Balancing is what goes into the pan; how much air goes in depends on the machine, the draw temperature and the recipe. What can be done, and what the page now does, is hand you the bench ruler — the weight a litre of your gelato should reach for the overrun you want, and the division that measures what you got.',
    ],
  },

  podPac: {
    title: 'Why POD and PAC matter',
    body: [
      'POD (potere dolcificante) measures how sweet the recipe tastes, not how much sugar it holds. Sucrose is the ruler, at POD 1. Dextrose is less sweet (0.74), fructose much sweeter (1.45), maltodextrin barely sweet at all (0.02). POD is what explains how you can take sweetness out of a cloying gelato without losing body: swap part of the sucrose for maltodextrin or glucose powder and the solids stay exactly where they were.',
      'PAC (potere anticongelante) measures how far the sugars push the freezing point down. Sucrose is the ruler again, but the order changes: dextrose 1.8, invert sugar 1.9, maltodextrin 0.25. Salt and alcohol weigh heavily here, which is why a spoonful of liqueur can wreck the texture of a whole batch.',
      'The two travel together but not in the same direction, and that is what balancing lives on. Dextrose is the classic lever for softening without over-sweetening, because it raises PAC a lot and POD a little. Fructose and invert sugar raise both. Maltodextrin adds body without touching either. Too little PAC and it is a rock in the cabinet; too much and it melts before it reaches the table.',
    ],
  },

  glossary: {
    title: 'Glossary',
    full: 'See in the glossary',
    noSource: 'No source in our bibliography: the definition describes common practice, and no work on the shelf backs it.',
    anchor: 'Link to this entry',
    terms: {
      'pod': {
        term: 'POD',
        definition:
          'Potere dolcificante, or sweetening power. How sweet the recipe tastes relative to sucrose, per kilo of mix. Sucrose = 1; dextrose = 0.74; fructose = 1.45.',
      },
      'pac': {
        term: 'PAC',
        definition:
          'Potere anticongelante, or anti-freezing power. How far the sugars push the freezing point of the mix down, per kilo, again measured against sucrose. It is what sets the hardness in the cabinet.',
      },
      'msnf': {
        term: 'MSNF',
        definition:
          'Milk solids non-fat: the protein, lactose and minerals left once fat and water are taken out. They give structure and bind free water. In excess, the lactose crystallises and the texture turns sandy.',
      },
      'total-solids': {
        term: 'Total solids',
        definition:
          'Everything that is not water, adding up sugars, fat, MSNF and other solids. The more solids, the better the gelato resists melting, and the less free water is left to become ice crystals.',
      },
      'overrun': {
        term: 'Overrun',
        definition:
          'The air whipped in, measured as increase in volume: 100% overrun is one litre of mix becoming two litres of ice cream. Corvitto puts the gelato quality band between 30% and 40% and settles on 35%; Clarke, writing about industrial ice cream, measures 20% to 100%. It does not enter the balancing — it belongs to the machine and the process — but it can be measured with a glass and a scale.',
      },
      'neutro': {
        term: 'Stabiliser blend',
        definition:
          'A ready-made mix of stabilisers and emulsifiers, sold in Brazil as "neutro". It counts as other solids and barely moves the metrics, but it is what stops the water organising itself into large crystals in storage.',
      },
      'serving-temperature': {
        term: 'Serving temperature',
        definition:
          'Estimated here as PAC ÷ 25, with a negative sign. It is the temperature at which the base scoops: colder and it hardens, warmer and it melts.',
      },
      'syrup-density': {
        term: 'Mix density',
        definition:
          'How many grams fit in a millilitre of mix before churning, which turns a batch in litres into a mass in grams. The 1.10 g/mL default is the weight of a litre of mix in Clarke. Corvitto’s arithmetic assumes 1.00 without saying so — both numbers are on the page, and the field stays editable.',
      },
    },
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'The balancing in this calculator does not rest on a published work: the 164 ingredients, the POD and PAC coefficients and the bands for the five base types come from the balancing spreadsheet of the Gelato Direto ao Ponto course, by Luis Paulo dos Santos Barros, known as Lulo Fouet. It is teaching material rather than bibliography — no page, no chapter — so the citation points at the spreadsheet tab instead of dressing up as a book. The air and the weight of a litre, which the spreadsheet does not cover, come from two books: Clarke for the chemistry of ice cream and Corvitto for gelato on the bench.',
    page: 'p.',
    section: 'section',
  },

  ingredients: {
    abacate: 'Avocado',
    abacaxi: 'Pineapple',
    acerola: 'Acerola cherry',
    'acucar-dextrose': 'Sugar (dextrose)',
    'acucar-frutose': 'Sugar (fructose)',
    'acucar-glucose-em-po': 'Sugar (glucose powder)',
    'acucar-glucose-liquida': 'Sugar (liquid glucose)',
    'acucar-lactose': 'Sugar (lactose)',
    'acucar-maltodextrina': 'Sugar (maltodextrin)',
    'acucar-de-maca-66-acucar': 'Apple sugar (66% sugar)',
    'acucar-invertido': 'Invert sugar',
    'acucar-sacarose': 'Sucrose',
    agua: 'Water',
    'alcool-96': 'Alcohol 96°',
    'ameixa-vermelha': 'Red plum',
    'amendoim-torrado': 'Roasted peanuts',
    amora: 'Blackberry',
    atemoia: 'Atemoya',
    banana: 'Banana',
    'base-de-agua': 'Water base',
    'base-de-leite': 'Milk base',
    'base-de-leite-creme-de-leite-17-uht': 'Milk base (17% UHT cream)',
    'base-de-leite-fior-di-latte': 'Milk base (fior di latte)',
    'batata-doce-roxa': 'Purple sweet potato',
    biscoff: 'Biscoff',
    'biscoito-champanhe': 'Ladyfinger biscuit',
    'biscoito-chocolate': 'Chocolate biscuit',
    brigadeiro: 'Brigadeiro',
    'cacau-em-po-11-gordura': 'Cocoa powder, 11% fat',
    'cacau-em-po-22-gordura': 'Cocoa powder, 22% fat',
    cachaca: 'Cachaça',
    'cafe-expresso': 'Espresso',
    'cafe-soluvel': 'Instant coffee',
    caqui: 'Persimmon',
    cenoura: 'Carrot',
    cereja: 'Cherry',
    'cereja-em-calda': 'Cherries in syrup',
    'chocolate-amargo-60': 'Dark chocolate 60%',
    'chocolate-amargo-70': 'Dark chocolate 70%',
    'chocolate-amargo-90': 'Dark chocolate 90%',
    'chocolate-ao-leite-33-7': 'Milk chocolate 33.7%',
    'chocolate-ao-leite-40': 'Milk chocolate 40%',
    'chocolate-branco': 'White chocolate',
    'chocolate-em-po-50': 'Drinking chocolate 50%',
    'clara-de-ovo': 'Egg white',
    coco: 'Coconut',
    'coco-ralado-seco': 'Desiccated coconut',
    cointreau: 'Cointreau',
    'cream-cheese': 'Cream cheese',
    'creme-de-leite-de-castanha-20': 'Cashew cream 20%',
    'creme-de-leite-fresco-35': 'Fresh cream 35%',
    'creme-de-leite-fresco-38': 'Fresh cream 38%',
    'creme-de-leite-uht-17-piracanjuba': 'UHT cream 17% (Piracanjuba)',
    'creme-de-leite-uht-25': 'UHT cream 25%',
    croissant: 'Croissant',
    damasco: 'Apricot',
    'doce-de-leite-lata': 'Dulce de leche (tinned)',
    'doce-de-leite-rocca': 'Dulce de leche Rocca',
    'dpo-165-premium-aroma-italia': 'DPO 165 Premium (Aroma Italia)',
    eritritol: 'Erythritol',
    'ervilha-cozida': 'Cooked peas',
    'ervilha-seca': 'Dried peas',
    'extrato-de-baunilha': 'Vanilla extract',
    'farinha-de-semente-de-alfarroba': 'Locust bean gum flour',
    'farinha-de-semente-de-guar': 'Guar gum flour',
    'farinha-de-semente-de-tara': 'Tara gum flour',
    'farinha-de-trigo': 'Wheat flour',
    'fava-de-baunilha': 'Vanilla bean',
    figo: 'Fig',
    framboesa: 'Raspberry',
    'fruta-groselha': 'Redcurrant',
    'fruta-nativa-araca': 'Araçá (Brazilian guava)',
    'fruta-nativa-bergamota': 'Bergamot orange',
    'fruta-nativa-butia': 'Butiá palm fruit',
    'fruta-nativa-guabiroba': 'Guabiroba',
    'frutas-vermelhas': 'Mixed red berries',
    'gema-do-ovo': 'Egg yolk',
    'gema-do-ovo-pasteurizada': 'Pasteurised egg yolk',
    goiaba: 'Guava',
    goiabada: 'Guava paste',
    'goma-xantana': 'Xanthan gum',
    hortela: 'Mint',
    'imo-900-taumatina-moonsugar': 'IMO 900 + thaumatin (moonsugar)',
    'inulina-fibra-vegetal': 'Inulin (plant fibre)',
    'iogurte-desnatado': 'Skimmed yoghurt',
    'iogurte-grego': 'Greek yoghurt',
    'iogurte-integral': 'Whole-milk yoghurt',
    'iogurte-semidesnatado': 'Semi-skimmed yoghurt',
    kiwi: 'Kiwi',
    'laranja-suco': 'Orange juice',
    'leite-condensado': 'Condensed milk',
    'leite-condensado-desnatado': 'Skimmed condensed milk',
    'leite-condensado-vegetal': 'Plant-based condensed milk',
    'leite-de-castanha': 'Cashew milk',
    'leite-de-coco': 'Coconut milk',
    'leite-de-coco-em-po-io': 'Coconut milk powder (IO)',
    'leite-de-coco-sococo': 'Coconut milk, Sococo',
    'leite-desnatado': 'Skimmed milk',
    'leite-em-po-desnatado': 'Skimmed milk powder',
    'leite-em-po-integral': 'Whole milk powder',
    'leite-integral': 'Whole milk',
    'leite-semidesnatado': 'Semi-skimmed milk',
    lichia: 'Lychee',
    'licor-amaretto': 'Amaretto liqueur',
    'lima-limao-taiti': 'Tahiti lime',
    'limao-siciliano': 'Lemon',
    'limao-suco': 'Lime, juicing fruit',
    maca: 'Apple',
    maltitol: 'Maltitol',
    mamao: 'Papaya',
    manga: 'Mango',
    manteiga: 'Butter',
    'manteiga-de-cacau': 'Cocoa butter',
    'manteiga-de-garrafa': 'Clarified butter (manteiga de garrafa)',
    maracuja: 'Passion fruit',
    mascarpone: 'Mascarpone',
    mel: 'Honey',
    melancia: 'Watermelon',
    melao: 'Melon',
    mexerica: 'Mandarin',
    mirtilo: 'Blueberry',
    morango: 'Strawberry',
    'nata-45': 'Double cream 45%',
    'nata-48': 'Double cream 48%',
    neutro: 'Stabiliser blend',
    nutella: 'Nutella',
    'oleo-de-coco': 'Coconut oil',
    'oleo-de-girassol': 'Sunflower oil',
    'ovo-galinha': 'Whole egg',
    pacoca: 'Paçoca (peanut fudge)',
    parmesao: 'Parmesan',
    'pasta-baunilha-vanilla-brasil': 'Vanilla paste (Vanilla Brasil)',
    'pasta-de-amendoas-s-acucar': 'Almond paste, unsweetened',
    'pasta-de-amendoim-c-acucar': 'Peanut butter, sweetened',
    'pasta-de-amendoim-100': 'Peanut butter 100%',
    'pasta-de-avela-s-acucar': 'Hazelnut paste, unsweetened',
    'pasta-de-cacau': 'Cocoa mass',
    'pasta-de-cacau-pre-fabricada': 'Ready-made cocoa paste',
    'pasta-de-castanha-de-caju-100': 'Cashew paste 100%',
    'pasta-de-castanha-do-para-100': 'Brazil nut paste 100%',
    'pasta-de-nozes-100': 'Walnut paste 100%',
    'pasta-de-pistache-100': 'Pistachio paste 100%',
    pera: 'Pear',
    pessego: 'Peach',
    pitaya: 'Dragon fruit',
    'polidextrose-fibra': 'Polydextrose (fibre)',
    'polpa-de-acai-10-14': 'Açaí pulp (10 to 14%)',
    pudim: 'Crème caramel',
    'raspa-de-limao-casca': 'Lemon zest (peel)',
    'ricota-de-ovelha': "Sheep's ricotta",
    'ricota-de-vaca': "Cow's ricotta",
    roma: 'Pomegranate',
    rum: 'Rum',
    sal: 'Salt',
    'stevia-em-po': 'Stevia powder',
    'suco-de-limao': 'Lime juice',
    sucralose: 'Sucralose',
    'tamara-seca': 'Dried dates',
    tomate: 'Tomato',
    torrone: 'Torrone nougat',
    uva: 'Grape',
    'whey-protein-80': 'Whey protein 80%',
    'xarope-monin': 'Monin syrup',
    xylitol: 'Xylitol',
  },
};
