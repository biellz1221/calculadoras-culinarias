import type { breadPtBR } from './bread-pt-BR';

export const breadEn: typeof breadPtBR = {
  meta: {
    title: "Bread calculator: baker's percentage",
    description:
      "Work out bread in grams from the flour you have: 16 presets, editable baker's percentages, safe ranges and yeast conversion. Every number cited with book and page.",
  },

  eyebrow: 'Bread calculator',
  title: 'Bread scaled to the flour you actually have',
  lead: "Pick the bread, say how much flour you're using, and the recipe comes out in grams. Change the percentages freely: the calculator flags anything outside the range the sources give, and tells you what happens if you push past it.",

  presetLabel: 'Type of bread',

  presets: {
    boule: 'Rustic white loaf (boule)',
    baguette: 'Baguette',
    'pao-frances': 'Brazilian pão francês',
    integral: 'Wholewheat loaf',
    centeio: 'Rye bread',
    focaccia: 'Focaccia',
    ciabatta: 'Ciabatta with poolish',
    'pizza-napoletana': 'Neapolitan pizza',
    'pizza-caseira': 'Home-oven pizza',
    'pao-de-forma': 'Pullman sandwich loaf',
    'pao-sanduiche': 'Soft sandwich loaf',
    'pao-hamburguer': 'Burger buns',
    'pao-hot-dog': 'Hot dog rolls',
    'pao-de-leite': 'Milk rolls',
    brioche: 'Brioche',
    broa: 'Portuguese corn bread',
  },

  ingredients: {
    'flour-white': 'White wheat flour',
    'flour-wholewheat': 'Wholewheat flour',
    'flour-rye': 'Rye flour',
    'flour-semolina': 'Semolina',
    'flour-corn': 'Corn flour',
    'flour-bran': 'Wheat bran',
    'flour-rice': 'Rice flour',
    water: 'Water',
    milk: 'Milk',
    salt: 'Salt',
    sugar: 'Sugar',
    butter: 'Butter',
    'olive-oil': 'Olive oil',
    lard: 'Lard',
    egg: 'Egg',
    'milk-powder': 'Milk powder',
    'creme-fraiche': 'Crème fraîche',
    xanthan: 'Xanthan gum',
    'yeast-fresh': 'Fresh yeast',
    'yeast-active-dry': 'Active dry yeast',
    'yeast-instant': 'Instant yeast',
    'levain-liquid': 'Liquid levain',
    poolish: 'Poolish',
    'fermented-dough': 'Old dough',
  },

  target: {
    label: 'How much you are making',
    flour: 'By flour',
    dough: 'By dough weight',
    units: 'By units',
    flourHint: 'Grams of flour you have',
    doughHint: 'Total weight of raw dough',
    unitsCount: 'Units',
    unitWeight: 'Weight of each (g)',
  },

  table: {
    caption: 'Calculated recipe',
    ingredient: 'Ingredient',
    amount: 'Amount',
    percent: "Baker's %",
    flourTotal: 'Total flour',
    doughTotal: 'Total dough',
    editHint:
      'Percentages are editable and the recipe updates as you type. Flour is not: it is the 100% the rest is measured against, so change the batch by weight, above.',
  },

  balance: {
    title: 'Dough balance',
    hydration: 'Hydration',
    effectiveHydration: 'True hydration',
    salt: 'Salt',
    effectiveSalt: 'Salt over total flour',
    recommended: 'Recommended range',
    withPreFerment: 'Counting the flour and water carried inside the pre-ferment.',
    status: {
      below: 'Below range',
      in: 'In range',
      above: 'Above range',
    },
    hardLimit: 'Outside what the sources support',
  },

  notes: {
    hydration:
      'More water gives a more open crumb and a dough that is harder to handle. Below 50% you are into tight, machine-kneaded bakery dough; above 80% it is high hydration and asks for folds rather than kneading.',
    salt: 'Salt also slows fermentation down. Below 1% the bread tastes flat and the dough runs away from you; above 2.5% the yeast starts to struggle.',
    instantYeast:
      'The practical ceiling is 1% of the flour weight: more than that speeds fermentation up without adding flavour. Less yeast and more time is almost always the better trade.',
    dryYeast: 'Active dry yeast has to be dissolved in warm water before it goes into the dough.',
    freshYeast:
      'Lean doughs run on very little fresh yeast when a levain is doing the work. Enriched doughs need far more, because sugar and fat get in the yeast’s way.',
    levain:
      'The usual dose of liquid levain is 20 to 50% of the flour weight. Since it is half flour and half water, it counts towards the true hydration.',
    poolish:
      'A liquid pre-ferment of equal parts flour and water with a trace of yeast, no salt and no kneading.',
    fermentedDough: 'A piece of yesterday’s dough folded into today’s.',
    sugar:
      'Up to around 12% sugar feeds fermentation and browns the crust. Past that it competes with the yeast for water and the dough needs more yeast to compensate.',
    fat: 'Fat softens the crumb and keeps the bread fresh longer. In large amounts, as in brioche, it gets in the way of gluten and the dough needs more time and more yeast.',
  },

  process: {
    title: 'Method, as the source gives it',
    firstRise: 'First rise',
    secondRise: 'Second rise',
    oven: 'Oven',
    bake: 'Bake time',
    minutes: 'min',
    yieldLabel: 'Yield in the source',
    yieldValue: 'units of',
    notes: {
      steam: 'Steam the oven when loading: about 50 g of water into a preheated tray.',
      autolyse: 'One hour of autolyse before kneading: a more elastic dough for less work.',
      folds: 'Twenty minutes of autolyse and two sets of folds during the first rise.',
      ryeWatch: 'Rye overproofs quickly: do not let the second rise run long.',
      poolishAhead:
        'The poolish is made four hours ahead, with part of the yeast, and goes into the dough whole.',
      napoletana:
        'The long second rise is the point: 0.04% yeast working for five to eight hours.',
      pizzaHydration:
        'The recipe as printed uses 52% hydration, which contradicts the conversion table in the same book (p. 301, 68%). We use 62%, inside the range Camargo gives.',
      brioche:
        'After the first rise, an hour in the fridge so the butter firms up before shaping.',
      scald: 'The corn flour is scalded with boiling water before it joins the dough.',
    },
  },

  yeastTool: {
    title: 'Yeast converter',
    lead: 'Got fresh yeast and a recipe asking for dry? Convert it here.',
    amount: 'Amount',
    from: 'You have',
    to: 'The recipe wants',
    result: 'Use',
    timeHint: 'Yeast and time pull in opposite directions',
    timeBody:
      'Halving the yeast doubles the first rise. Treat it as planning guidance: kitchen temperature and flour strength both move the result.',
    levainTitle: 'Switching to levain',
    levainBody:
      'There is no conversion factor between commercial yeast and levain: levain works as a dose of the flour weight, 20 to 50%. Since it is half flour and half water, take both out of the recipe.',
    flourLabel: 'Flour in the recipe (g)',
    levainUse: 'Liquid levain',
    levainFlour: 'Subtract from flour',
    levainWater: 'Subtract from water',
    dried: 'If your levain is dried',
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'Every preset and every range above comes from one of these works, at the page or chapter given.',
    page: 'p.',
    section: 'ch.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      "The whole calculator runs on baker's percentage: flour is 100% and every other ingredient is a percentage of its weight. That is why the same recipe serves 300 g or 3 kg of flour. The proportions hold, only the scale changes.",
      'When a pre-ferment is involved the arithmetic gains a wrinkle. Liquid levain is half flour and half water, so 20% levain adds ten points of flour and ten of water to the totals. Ignoring that understates the hydration: Kayser’s boule declares 70% water, but the dough actually works at 73%. The calculator shows both numbers.',
      'The same goes for salt. Ciabatta’s 2% is measured against the dough’s flour; count the flour that arrived inside the poolish and the real figure is 1.7%. The first number is what you weigh, the second is what explains the fermentation.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'The three sources behind this calculator do not agree on everything, which is normal. Wherever a choice had to be made, it is spelled out here.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'White bread hydration',
        sources:
          'Kayser works at 70% in the boule; Camargo uses 60% for pão francês; the course notes record about 50%.',
        decision:
          'A 60–70% range, with 65% as the reference. The 50% figure describes machine-kneaded bakery dough with a tight crumb: a legitimate lower bound, not a default. Kayser works with levain and a steamed oven, which supports the 70%.',
      },
      {
        topic: 'Fresh to dry yeast',
        sources: 'Kayser says divide by 2; Camargo says divide by 3.',
        decision:
          'Both, because they are different yeasts: active dry is half the fresh weight, instant is a third. It is not a contradiction, it is vocabulary.',
      },
      {
        topic: 'Pizza hydration',
        sources:
          'Kayser’s home recipe prints 52%, but the conversion table in the same book (p. 301) gives 68%. Camargo uses 65%, with a 59–70% range.',
        decision:
          'The preset sits at 62%. The 52% is out of step with everything, including the rest of that same book, so we treat it as an editing slip.',
      },
      {
        topic: 'How much yeast',
        sources:
          'Kayser uses 0.4–1.4% fresh yeast alongside a levain; Camargo puts a 1% ceiling on instant yeast.',
        decision:
          'The range follows the yeast you pick, and the 1% instant ceiling becomes a warning. Kayser’s figures are not directly comparable: in his method the levain is the engine.',
      },
    ],
  },

  glossary: {
    title: 'Glossary',
    terms: [
      {
        term: "Baker's percentage",
        definition:
          'A system where flour is 100% and every ingredient is expressed as a percentage of its weight. It lets you rescale a recipe without redoing the arithmetic.',
      },
      { term: 'Hydration', definition: 'The ratio of water to flour in a recipe.' },
      {
        term: 'Autolyse',
        definition:
          'A rest between mixing and kneading that lets the flour absorb the water and the gluten start forming on its own. More elastic dough, less work.',
      },
      {
        term: 'Levain',
        definition:
          'Natural starter: a culture of wild yeasts and lactic bacteria. The liquid kind runs at 100% hydration (equal parts flour and water); the firm kind at about 60%.',
      },
      {
        term: 'Poolish',
        definition:
          'A liquid pre-ferment of equal parts flour and water with a trace of yeast, no salt and no kneading. It builds flavour before the dough exists.',
      },
      { term: 'Biga', definition: 'A pre-ferment with the same job as poolish, but firm.' },
      {
        term: 'Old dough',
        definition:
          'A piece of finished dough from the day before folded into the new one, at 15 to 30% of the flour weight.',
      },
      {
        term: 'Pointage and apprêt',
        definition:
          'The two fermentations: the first in bulk, straight after kneading; the second after shaping, up to the oven.',
      },
      {
        term: 'Base temperature',
        definition:
          'The sum of the room, flour and water temperatures, used to work out how warm the water should be. For white bread it sits between 54 and 56 °C, aiming at dough at 24–25 °C off the mixer.',
      },
      {
        term: 'Flour strength',
        definition:
          'Strong flour has more protein, absorbs more water and stands up to long fermentation. Protein quality matters more than the headline percentage.',
      },
    ],
  },
};
