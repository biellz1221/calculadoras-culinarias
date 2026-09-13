import type { curingPtBR } from './curing-pt-BR';

export const curingEn: typeof curingPtBR = {
  meta: {
    title: 'Curing calculator: nitrite in ppm',
    description:
      'How much curing salt to weigh per kilo of meat, in ppm of nitrite, with the Brazilian and US rules side by side — and the difference between them explained.',
    keywords: [
      'curing calculator',
      'curing salt ppm',
      'how much cure per pound',
      'sodium nitrite limit',
      'cure 1 cure 2',
      'home charcuterie',
      'prague powder calculator',
      'botulism cured meat',
    ],
    imageAlt:
      'Card for the curing calculator, with its title and the regulations the numbers rest on.',
  },

  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'How much cure #1 per kilo of meat?',
        answer:
          'For 150 ppm of ingoing nitrite, 2.4 g of cure #1 per kilo. Cure #1 is 6.25% sodium nitrite, so the sum is ppm × kilos ÷ 62.5. At 120 ppm it is 1.9 g, and at 156 ppm — the US ceiling for comminuted meat — it is 2.5 g.',
      },
      {
        question: 'What is the nitrite limit in Brazil?',
        answer:
          'ANVISA’s RDC 272/2019 sets 0.015 g/100 g, which is 150 mg/kg, as the maximum residual — and it counts nitrite and nitrate together, expressed as sodium nitrite. Note that this is residual in the finished product, not what you weigh: different quantities.',
      },
      {
        question: 'Why do some say 150 and others 156?',
        answer:
          'Because they are comparing different things. The US 156 ppm is an ingoing limit for comminuted meat, what you add. The Brazilian 150 mg/kg is residual, what may remain in the finished product. On the same basis, maximum residual is 150 in Brazil and 200 in the United States.',
      },
      {
        question: 'Can I use less nitrite to be safer?',
        answer:
          'No. Too little nitrite is the dangerous side: it is what stops Clostridium botulinum producing toxin in a cured product. FSIS requires a minimum of 120 ppm ingoing in cured products kept refrigerated. Below that you have salted meat with a nice colour, not cured meat.',
      },
      {
        question: 'What is the difference between cure #1 and cure #2?',
        answer:
          'The #1 is nitrite only, 6.25%, and suits anything that will be cooked, cold smoked or eaten soon. The #2 adds 4% sodium nitrate, which converts to nitrite slowly, and is for cuts air-cured over weeks or months. In the United States nitrate is banned in bacon.',
      },
    ],
  },

  eyebrow: 'Curing calculator',
  title: 'Nitrite in ppm, under the rule that applies here',
  lead: 'Give the weight of the meat and the target in ppm; the calculator gives the curing salt to weigh. This is the one page on the site where getting the number wrong does not spoil dinner — it causes botulism. Every limit here comes from a regulation, with the legal text cited.',

  danger: {
    title: 'Before anything else',
    body: 'Curing is not seasoning. Nitrite exists to stop Clostridium botulinum producing toxin in an oxygen-free environment, which is exactly what the inside of a sausage is. Too little does not protect; too much is toxic. Weigh on a precision scale, never with a spoon, and never improvise the dose because the cut "is small".',
  },

  input: {
    label: 'Your cut',
    meat: 'Weight of the meat (g)',
    meatHint: 'Meat and fat only. Seasoning and liquid do not count towards ppm.',
    cure: 'Curing salt',
    method: 'How you will cure it',
    target: 'Ingoing nitrite (ppm)',
    targetHint: 'The default is 150, within what both regulations support.',
  },

  cures: {
    'cure-1': 'Cure #1 (6.25% nitrite)',
    'cure-2': 'Cure #2 (6.25% nitrite + 4% nitrate)',
    peklosol: 'Peklosol (0.6% nitrite)',
  },

  cureNotes: {
    'cure-1':
      'Nitrite only, no nitrate. For anything that will be cooked, cold smoked or eaten within days.',
    'cure-2':
      'Carries nitrate too, which turns into nitrite slowly over weeks. For air-cured cuts such as salami and dry ham. Banned in bacon in the United States.',
    peklosol:
      'The European ruler: a far more dilute curing salt, made to replace the recipe’s ordinary salt rather than go in by the pinch. Note the jump in the amount to weigh.',
  },

  methods: {
    comminuted: 'Ground meat or sausage',
    dry: 'Dry cure on a whole cut',
    comminutedHint:
      'The dose goes into the whole mass and stays there. This is the tighter case: a 156 ppm ceiling.',
    dryHint:
      'The salt sits on the surface and much of it never reaches the centre, so the US rule allows far more at application — 625 ppm. That is not licence to dose that way in a ground mix.',
  },

  result: {
    title: 'What to weigh',
    cure: 'Curing salt',
    salt: 'Ordinary salt that comes with it',
    saltHint:
      'Curing salt is almost all ordinary salt. Subtract this from your recipe’s salt, or the product comes out too salty.',
    nitrite: 'Ingoing nitrite',
    nitrate: 'Ingoing nitrate',
    perKilo: 'per kilo of meat',
  },

  status: {
    ok: 'In range',
    belowMinimum: 'Below the safe minimum',
    aboveLimit: 'Above the ceiling for this method',
    minimum: 'Minimum ingoing',
    ceiling: 'Ceiling for this method',
    belowBody:
      'Below 120 ppm ingoing, curing does not do the job that justifies it: holding off botulism. FSIS treats that floor as policy for refrigerated cured products, not as a suggestion. Raise the dose, or secure safety another way — cooking, acidity or moisture control — and then do not call it cured.',
    aboveBody:
      'This is past what the US rule allows you to add by this method. There is no ingoing ceiling in the Brazilian rule, but going over the US one will almost certainly break the residual limit here, which is the lower of the two.',
  },

  limits: {
    title: 'The two limits, and why they do not compare',
    lead: 'This is the most consequential divergence on the whole site, and nearly every English-language charcuterie calculator walks straight past it.',
    ingoingTitle: 'Ingoing — what you weigh',
    ingoingBody:
      'The United States caps how much may be added, and the figure changes with the method: 156 ppm in comminuted meat, 625 ppm in a dry cure. That is what this calculator computes, because it is what you have in your hand.',
    residualTitle: 'Residual — what remains in the finished product',
    residualBody:
      'Brazil regulates here instead: at most 150 mg/kg, counting nitrite and nitrate together and expressed as sodium nitrite. The United States allows 200 ppm residual. Residual cannot be computed from ingoing — nitrite reacts and decays during curing, and only analysis of the finished product measures what is left.',
    honesty:
      'The honest consequence: this calculator does not certify compliance with RDC 272. It gives the ingoing figure, compares it against the US ceiling — the only ingoing one that exists — and makes clear that the Brazilian number is a different kind of thing. Anyone producing for sale needs laboratory analysis, not a calculator.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'Curing salt is ordinary salt with a small fraction of sodium nitrite in it. Cure #1 is 6.25% nitrite; European Peklosol, 0.6%. What the calculator does is cross-multiplication over that fraction: to reach 150 ppm of nitrite in a kilo of meat you need 0.15 g of nitrite, and to get 0.15 g of nitrite at 6.25% you weigh 2.4 g of cure #1.',
      'What justifies the tool is not the algebra, it is the rest: the fraction changes with the product, the legal ceiling changes with the method, there is a floor below which curing does not protect, and the Brazilian limit is a different quantity from the American one. Four things that are easy to get wrong, with a serious consequence.',
      'Every dose comes out in grams to one decimal place because that is how it gets weighed: a 0.1 g precision scale costs little and is the only acceptable instrument here. A teaspoon of curing salt runs from 5 to 7 g depending on the hand, which on a 1 kg cut is the difference between 130 and 180 ppm.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'Two regulations, two books, and three disagreements worth knowing.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'Legal limit',
        sources:
          'ANVISA: 150 mg/kg residual, counting nitrite and nitrate together. FSIS: 156 ppm ingoing in comminuted, 200 ppm residual.',
        decision:
          'Shows both and says they are different quantities. Computes ingoing, which is what gets weighed, and promises nothing about residual compliance.',
      },
      {
        topic: 'Working dose',
        sources:
          'Marianski tabulates up to 156 ppm and calls it the maximum. Ruhlman uses 25 g of cure #1 for 11.25 kg, which is 139 ppm.',
        decision:
          'The default is 150 ppm, which sits between the two and fits both regulations. Both figures appear, cited.',
      },
      {
        topic: 'Nitrate in long curing',
        sources:
          'Marianski: cure #2 for anything air-cured without cooking. ANVISA adds nitrate to nitrite under the same residual ceiling.',
        decision:
          'With the #2, shows both in ppm separately, because that is how the Brazilian rule counts the total.',
      },
    ],
  },

  glossary: {
    title: 'Glossary',
    full: 'See in the glossary',
    noSource:
      'No source in our bibliography: the definition describes common practice, and no work on the shelf backs it.',
    anchor: 'Link to this entry',
    terms: {
      ppm: {
        term: 'ppm',
        definition:
          'Parts per million. One ppm is one milligram per kilo. A hundred and fifty ppm of nitrite in 1 kg of meat is 0.15 g of nitrite — hence the need to dilute it in salt before it goes anywhere near a kitchen scale.',
      },
      ingoing: {
        term: 'Ingoing',
        definition:
          'How much nitrite is added to the meat, measured against its weight. It is what the calculator computes and what the US rule caps by method.',
      },
      residual: {
        term: 'Residual',
        definition:
          'How much nitrite remains in the finished product after reacting with the meat and decaying. It is what the Brazilian rule caps, and it is known only by laboratory analysis.',
      },
      'cure-1': {
        term: 'Cure #1',
        definition:
          'Curing salt with 6.25% sodium nitrite and the rest ordinary salt, dyed pink so it cannot be mistaken for table salt. Also sold as Prague Powder #1, Insta Cure #1 or fast curing salt.',
      },
      'cure-2': {
        term: 'Cure #2',
        definition:
          'The same 6.25% nitrite plus 4% sodium nitrate. The nitrate works as a reserve: bacteria convert it to nitrite over weeks, which sustains protection in a cut that air-cures for months.',
      },
      botulism: {
        term: 'Clostridium botulinum',
        definition:
          'The bacterium curing exists to hold off. It grows without oxygen, exactly the condition inside a sausage, and produces one of the most potent toxins known. It changes neither the smell nor the look of the product.',
      },
    },
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'Two regulations and two books. The limits come from the regulations, read in the original text; the books supply the composition of the curing salts and the working doses.',
    page: 'p.',
    section: 'section',
  },
};
