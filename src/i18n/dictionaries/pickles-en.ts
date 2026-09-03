import type { picklesPtBR } from './pickles-pt-BR';

export const picklesEn: typeof picklesPtBR = {
  meta: {
    title: 'Pickle & fermentation calculator — brine and salt',
    description:
      'How much salt for brine, sauerkraut and vinegar pickles. Safe ranges for each preparation, the two ways the books measure salt, and the minimum acidity for a quick pickle — all cited with book and page.',
  },

  eyebrow: 'Pickle calculator',
  title: 'How much salt your jar is asking for',
  lead: 'Say what you are fermenting and the calculator gives you the salt in grams, inside the range the sources support. It always shows both readings of the same brine — over the jar and over the water — because that is where the books disagree and where most of the mistakes happen.',

  modes: {
    label: 'What you are making',
    brine: 'Brine',
    'dry-salt': 'Dry salting',
    vinegar: 'Vinegar pickle',
    brineHint: 'Whole vegetables submerged in salted water, fermenting.',
    drySaltHint:
      'Chopped vegetable salted so it releases its own brine — sauerkraut, kimchi.',
    vinegarHint: 'A fridge pickle preserved by added acidity. It does not ferment.',
  },

  presetLabel: 'Preparation',

  presets: {
    'couve-flor': 'Cauliflower',
    cenoura: 'Carrot',
    aspargo: 'White asparagus',
    'kimchi-tropical': 'Tropical kimchi',
    'molho-pimenta': 'Chilli sauce',
    jabuticaba: 'Jabuticaba',
    'manga-verde': 'Green mango',
    'pepino-azedo': 'Sour cucumber (kosher dill)',
    'pepino-malossol': 'Half-sour cucumber (malossol)',
    azeitona: 'Olives',
    chucrute: 'Sauerkraut',
    'chucrute-couve': 'Collard sauerkraut',
    kimchi: 'Kimchi',
    'lacto-fruta': 'Lacto-fermented fruit',
    limao: 'Preserved lemons',
    boshi: 'Umeboshi (boshi)',
    'quick-pickle': 'Quick pickle',
    'flores-vinagre': 'Flowers in vinegar',
  },

  input: {
    label: 'Batch size',
    byWeights: 'Weighing both',
    byJar: 'By jar volume',
    vegetable: 'Vegetables (g)',
    water: 'Water (g)',
    jar: 'Jar volume (ml)',
    share: 'How much of the jar is vegetable',
    shareHint: 'An estimate: the jar is taken at 1 g/ml and split in this ratio.',
    liquid: 'Covering liquid (ml)',
    saltPercent: 'Salt (%)',
    sugarPercent: 'Sugar (%)',
    acidity: 'Your vinegar’s acidity (%)',
    acidityHint: 'It is on the label. Ordinary table vinegar is 5%.',
    vinegarParts: 'Parts vinegar',
    waterParts: 'Parts water',
  },

  basis: {
    label: 'What the salt percentage is measured against',
    total: '% of the whole jar',
    water: '% of the water',
    totalHint: 'The Noma and Brazilian Way Fermentation method.',
    waterHint: 'The Katz method.',
    explain:
      'The same amount of salt has two names. Measured against the whole jar it is the salinity the product settles at; measured against the water it is the strength of the brine on day one. Switching here does not change the recipe — only how it is described.',
  },

  result: {
    title: 'What to weigh',
    salt: 'Salt',
    vegetable: 'Vegetables',
    water: 'Water',
    vinegar: 'Vinegar',
    sugar: 'Sugar',
    total: 'Total in the jar',
    ofTotal: 'of the jar',
    ofWater: 'of the water',
    ofVegetable: 'of the vegetable',
    acidity: 'Acidity of the liquid',
    days: 'Time in the source',
    daysUnit: 'days',
    temperature: 'Temperature',
  },

  status: {
    below: 'Below range',
    in: 'In range',
    above: 'Above range',
    recommended: 'Recommended range',
    unsafe: 'Below the safe minimum',
  },

  notes: {
    brineTotal:
      'Two percent of the jar’s total weight is where all three sources meet: salty enough for lactic bacteria to take over, mild enough for the result to be worth eating.',
    brineWater:
      'Measured against the water alone, the number looks higher than the salinity the product will reach: the vegetable takes up salt too, and it counts towards the equilibrium.',
    drySalt:
      'In dry salting the brine comes out of the vegetable itself, so the percentage you apply is the final salinity. Below 1.5% the vegetable goes soft before it turns acid.',
    saltPreserve:
      'Long-keeping preparations run well above the fermentation range: here salt is the preservative, not the regulator.',
    vinegarAcidity:
      'The acidity of the finished liquid is what protects a vinegar pickle. Diluting the vinegar dilutes the protection.',
    quickSalt:
      'In a vinegar pickle salt seasons and firms the texture; the acid is what preserves.',
    quickSugar: 'Sugar balances the acidity. That is taste, not safety.',
  },

  safety: {
    title: 'Before you close the jar',
    lead: 'Fermenting is safe when a few conditions are respected. These are not finishing touches.',
    ph: {
      title: 'The target is pH below 4.6',
      body: 'That is the line where dangerous bacteria stop multiplying. A ferment that is working gets there on its own in the first few days, turning sour and smelling of pickles — not of rot.',
    },
    submerged: {
      title: 'Everything submerged, always',
      body: 'Whatever sits above the brine will mould. Use a weight, a whole leaf or a water-filled bag to keep the vegetable under.',
    },
    mold: {
      title: 'Kahm is not mould',
      body: 'A thin, smooth white film on the surface is Kahm yeast: harmless, just lift it off. Fuzzy, coloured or velvety patches are mould — that batch goes in the bin.',
    },
    botulism: {
      title: 'Where the botulism risk actually lives',
      body: 'Not in fermentation, which is acidic by nature. The risk is in preserves that neither ferment nor get acidified, sealed away from oxygen — badly processed palm hearts, raw garlic in oil. If a preparation neither ferments nor takes acid, it is not safe at room temperature.',
    },
    shelf: {
      title: 'Fridge, not pantry',
      body: 'This calculator sizes fridge preserves. Shelf-stable canning requires heat processing with times and temperatures specific to each food, which do not fit in a ratio calculator — follow official guidance for that.',
    },
  },

  climate: {
    title: 'Temperature and time',
    fast: 'Fast, 21 to 28 °C',
    slow: 'Slow, 10 to 21 °C',
    fastBody:
      'Ready in days, with a straighter acidity. It is how Noma works, with temperature control.',
    slowBody:
      'Weeks rather than days, more complex flavour and more room for error. It is what Katz and Brazilian Way Fermentation recommend at home — and in a warm climate it means hunting for the coolest spot in the house.',
  },

  vinegarStatus: {
    ok: 'Acidity is sufficient',
    belowMinimum: 'Acidity below the minimum',
    unusable: 'This vinegar will not do',
    belowBody:
      'At this dilution the liquid falls below 2.5% acetic acid. Raise the proportion of vinegar to at least the minimum shown.',
    unusableBody:
      'At this acidity, not even undiluted vinegar reaches 2.5% in the covering liquid. No proportion fixes it: use a stronger vinegar.',
    minimum: 'Minimum proportion',
    minimumValue: 'parts water to each part vinegar',
    pureVinegar: 'vinegar only, no water',
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'The ratios come from the three works below. The safety rules and the minimum acidity for vinegar pickles also draw on official guidance, flagged as such.',
    page: 'p.',
    section: 'ch.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'Fermenting a vegetable is a contest: lactic bacteria have to take over before anything else does. Salt is what tilts it, because they tolerate a salinity their competition does not. That is why the salt percentage is not seasoning — it is the control variable.',
      'The confusing part is what the percentage is measured against. One jar holding 40 g of salt, 1 kg of cauliflower and a litre of water can be described as 2% or as 4%, and both are correct: the first counts the whole contents, the second only the water. The calculator always shows both, because this is exactly where a recipe from one book becomes double or half the salt when read with the other book’s ruler.',
      'In dry salting no water is added: the salt draws liquid out of the vegetable, so the percentage you apply is already the final salinity. And in a vinegar pickle none of this applies — it does not ferment. What preserves it is the acid you add, and the question becomes how much of the liquid has to be vinegar.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'The three works arrive at a similar product by different routes. Wherever a choice had to be made, it is spelled out.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'What salt is measured against',
        sources:
          'Katz measures against the weight of the water (5% for cucumber pickles). Noma and Brazilian Way Fermentation measure against the total weight of the jar, vegetables included (2%).',
        decision:
          'The default is 2% of the whole jar, with a switch to see and use the Katz method. Measuring the total is more reproducible because it describes the product at equilibrium; Brazilian Way Fermentation shows on p. 199 how measuring only part of the contents delivers half the salt you intended.',
      },
      {
        topic: 'Fermentation temperature',
        sources:
          'Noma ferments at 28 °C and counts days. Katz and Brazilian Way Fermentation prefer 10 to 21 °C and count weeks.',
        decision:
          'Both regimes are offered, each with its own timing. This is not a technical disagreement but a different goal — speed against complexity — and in a warm climate the slow route means finding the coolest spot in the house.',
      },
      {
        topic: 'Minimum acidity for a vinegar pickle',
        sources:
          'None of the three works sets a floor. Noma gives the 1:1 ratio with 5% vinegar without saying where the limit is.',
        decision:
          'The floor is 2.5% acetic acid in the covering liquid, which is exactly what that 1:1 ratio produces, backed by official preserving guidance. Food safety does not allow a number without a source, so here the shelf makes room for an official one.',
      },
      {
        topic: 'White film on the surface',
        sources:
          'Katz and Noma treat Kahm yeast as harmless, to be lifted off. Brazilian Way Fermentation is more cautious about any surface growth.',
        decision:
          'We explain how to tell Kahm from mould, and advise discarding whenever there is doubt — with food, the cheap mistake is throwing it away.',
      },
    ],
  },

  glossary: {
    title: 'Glossary',
    terms: [
      {
        term: 'Lacto-fermentation',
        definition:
          'Fermentation driven by lactic bacteria, which turn the vegetable’s sugars into lactic acid. The acid is what preserves it and gives a pickle its taste.',
      },
      {
        term: 'Brine',
        definition:
          'Salted water the vegetable sits under. Its strength can be described against the water or against the whole contents of the jar.',
      },
      {
        term: 'Dry salting',
        definition:
          'Salting chopped vegetable without adding water: the salt draws the liquid out and forms the brine. It is the sauerkraut and kimchi method.',
      },
      {
        term: 'Anaerobic',
        definition:
          'Without oxygen. Lactic bacteria work without it and moulds need it — which is why keeping everything submerged decides who wins.',
      },
      {
        term: 'Kahm yeast',
        definition:
          'A thin, smooth white film that sometimes forms on the surface. Harmless and easily removed; not to be confused with mould, which is fuzzy or coloured.',
      },
      {
        term: 'pH',
        definition:
          'A measure of acidity. Below 4.6 dangerous bacteria do not multiply, and that is where a healthy ferment arrives on its own.',
      },
      {
        term: 'Vinegar acidity',
        definition:
          'The percentage of acetic acid printed on the label. Table vinegar is usually 5%, which is what the reference ratio assumes.',
      },
      {
        term: 'Quick pickle',
        definition:
          'A fridge preserve made with acidic liquid, without fermentation. Ready in hours and good for weeks in the fridge — not on the shelf.',
      },
    ],
  },
};
