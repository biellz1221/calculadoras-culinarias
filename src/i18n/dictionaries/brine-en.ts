import type { BrineDictionary } from './brine';

export const brineEn: BrineDictionary = {
  meta: {
    title: 'Brining and salting: salt in grams',
    description:
      'How much salt per kilo of chicken, meat or fish, in grams — not in teaspoons of an American brand. Dry salting, equilibrium brine and covering brine.',
    keywords: [
      'brine calculator',
      'how much salt per pound of meat',
      'dry brine chicken',
      'dry brine in grams',
      'equilibrium brine',
      'fish brine',
      'turkey brine',
      'kosher salt in grams',
    ],
    imageAlt:
      'Card for the brine calculator, with the title and the works the doses rest on.',
  },

  faq: {
    title: 'Common questions',
    items: [
      {
        question: 'How much salt per kilo of chicken?',
        answer:
          'For the Food Lab’s dry salting, 6.3 g per kilo — that is "1 teaspoon of Diamond Crystal kosher salt per pound" converted to weight. For the injected equilibrium brine in Modernist Cuisine at Home, 6 g per kilo plus 100 g of water. The two numbers are practically the same; what separates the methods is the water, not the salt.',
      },
      {
        question: 'Brine or dry salt?',
        answer:
          'The Food Lab measured both across twelve chicken breasts roasted together. The brine holds one extra percentage point of moisture — 89.6% of the starting weight against 88.6%. But that point is tap water, and the flavour comes out diluted. His conclusion: "salting and resting your meat is superior in every way to brining".',
      },
      {
        question: 'Why does the American recipe not work here?',
        answer:
          'Because the dose comes in teaspoons of one specific brand. A teaspoon of Diamond Crystal weighs 2.8 g; the same teaspoon of Morton weighs 4.7 g. Following the recipe with the wrong salt nearly doubles the dose. In grams that cannot happen.',
      },
      {
        question: 'How long should it sit?',
        answer:
          'It depends on the method. With dry salting and equilibrium brining the time only has to be enough: 24 to 48 hours for a bird, up to three days for a steak. With a covering brine the clock is part of the recipe and going past it oversalts — the Modernist fish comes out between 5 and 12 hours.',
      },
      {
        question: 'Can the meat sit out of the fridge while it brines?',
        answer:
          'No. Both sources require refrigeration throughout, without exception. And brined, drained meat keeps at most 24 hours refrigerated before it has to be cooked.',
      },
    ],
  },

  eyebrow: 'Brine calculator',
  title: 'The salt dose in grams, not in teaspoons',
  lead: 'The two best sources on brining publish their doses in teaspoons of an American salt brand and in a buried table column. Here they become grams per kilo of your own piece, with the method and the time each one declares.',

  input: {
    label: 'Your piece',
    protein: 'Weight of the protein (g)',
    proteinHint: 'The meat, bird or fish, trimmed. Stuffing and seasoning stay out of the calculation.',
    method: 'Method',
  },

  methods: {
    'dry-salting': 'Dry salting',
    'equilibrium-poultry': 'Equilibrium, poultry',
    'sweet-meat': 'Sweet equilibrium, meat',
    'immersion-fish': 'Covering brine, fish',
    'cure-fish': 'Quick cure, fish',
  },

  methodNotes: {
    'dry-salting':
      'Salt straight onto the piece, no water at all. The salt pulls juice out, dissolves in it and returns as a brine made of the meat itself. Under the skin on a bird; both sides on a steak. Fridge, uncovered, on a rack.',
    'equilibrium-poultry':
      'The Modernist whole-bird brine, injected with a syringe at dozens of points. Since the whole dose goes in, there is no risk of oversalting by waiting: the percentage against the bird is the final concentration.',
    'sweet-meat':
      'Milk and apple juice replace part of the water, bringing natural phosphates that tenderise. Injected, then the piece rests in whatever is left. For pieces no thicker than 3.5 cm.',
    'immersion-fish':
      'Plain immersion, no syringe. It is the only one here where the clock is in charge: 5 hours for delicate seasoning, up to 12 for a firmer result.',
    'cure-fish':
      'A quick dry cure: coat the fish in salt and sugar, 45 minutes in the fridge, then rinse, pat dry and cook. Some of the salt leaves with the rinse.',
  },

  result: {
    title: 'What to weigh',
    salt: 'Salt',
    liquid: 'Water or liquid',
    sugar: 'Sugar',
    brine: 'Finished brine',
    strength: 'Salt in the brine',
    ratio: 'Salt against the protein',
    time: 'Time',
    hours: 'h',
    minutes: 'min',
    fridge: 'refrigerated',
    teaspoons: 'The same dose in teaspoons',
    teaspoonsHint:
      'Only to check against a recipe written in English. The answer is the gram: the same teaspoon nearly doubles the dose when the brand changes.',
    diamondCrystal: 'Diamond Crystal kosher',
    mortonKosher: 'Morton kosher',
    injected: 'Injected with a syringe',
    injectedHint:
      'Without a syringe the dose never reaches the centre and the method becomes something else. Puncturing also pushes surface contamination inward, so the piece has to be cooked through.',
    rinsed: 'Rinse at the end',
    rinsedHint:
      'Some of the salt leaves with the rinse, which is why this dose is deliberately higher than an equilibrium one.',
  },

  equilibrium: {
    title: 'Equilibrium or clock',
    lead: 'The difference that decides whether you can forget the piece in the fridge or have to set a timer.',
    yes: 'Equilibrium',
    no: 'Timed',
    yesBody:
      'The whole dose ends up inside the piece, so the time only has to be long enough. Going past it does not add salt: there is no more salt to come from. This is what Modernist means by eliminating the risk of oversalting.',
    noBody:
      'The piece sits in a solution far stronger than what you want in the finished food, and comes out before it equilibrates. Here the clock is an ingredient: past the time it oversalts, with no way back.',
  },

  trial: {
    title: 'The measurement that settles the argument',
    lead: 'Twelve identical chicken breasts, one 275 °F oven, all cooked to 150 °F in the centre. What was left of the starting weight after roasting.',
    treatment: 'Treatment',
    afterSoak: 'After soaking',
    afterCooking: 'After roasting',
    rows: {
      plain: 'Untreated',
      brined: '6% brine',
      salted: 'Dry salted',
      water: 'Water only',
    },
    verdict:
      'The brine wins by one percentage point. The Food Lab does not recommend it anyway, and the reason lies in what that point is made of: "much of the juice it’s now holding on to is nothing more than tap water". Plain water on its own comes out worse than doing nothing — which shows the work belongs to the salt, not to the soaking.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'Everything here is a proportion of the weight of the protein. The Modernist Cuisine at Home recipes already publish it that way, in a column called SCALING: the basic poultry brine is 10% water and 0.6% salt against the weight of the bird. The calculator stores the recipe’s own weights — 200 g of water and 12 g of salt for 2 kg of chicken — and derives the proportion from them, because the book’s column is rounded and the weight is not.',
      'The Food Lab dose needed a bridge. He writes "about 1 teaspoon of Diamond Crystal kosher salt per pound of meat", which no kitchen scale can act on. The conversion comes from another book on the shelf: Ruhlman and Polcyn publish that a cup of Diamond Crystal weighs 4.8 ounces and a cup of Morton almost 8. A cup holds 48 teaspoons, so a teaspoon of Diamond Crystal weighs 2.835 g and the dose is 0.625% of the weight of the meat.',
      'The conversion checks itself against the other source. The Food Lab describes his 6% brine as "half a cup of Diamond Crystal per quart of water"; half a cup, at Ruhlman’s weight, is 68 g, and in 946 g of water that comes to 7.2% — his "about". Two independent sources, one density.',
      'For the record, this research corrected the site’s own bibliography document, which said the disagreement was 0.5% against 0.85%. Read at the source, the numbers are 0.6% and 0.625%: a difference of under 0.3 g in a kilo of meat, smaller than the error in a spoonful. The two agree about the salt. They disagree about the water.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'And, on this topic, where they agree — which is the rarer part.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'How much salt',
        sources:
          'Modernist aims at 0.5% final concentration and uses 0.6% in the injected bird. The Food Lab uses 1 teaspoon of Diamond Crystal per pound, which works out to 0.625%.',
        decision:
          'Says they agree. That is as useful as a disagreement, and this site rarely gets to deliver that news.',
      },
      {
        topic: 'Water, or none',
        sources:
          'Modernist injects 10% of the weight in water and gains juiciness. The Food Lab uses no water at all and measures one percentage point less moisture retained.',
        decision:
          'Gives both in grams, and shows the table from the experiment. The source that measured both chose dry salting; the choice still belongs to whoever is cooking.',
      },
      {
        topic: 'Plain covering brine',
        sources:
          'Modernist: the conventional approach gives "an oversalted exterior and an undersalted interior". Food Lab: wet-sponge texture and washed-out flavour.',
        decision:
          'Offers it only for fish, which is where Modernist publishes it, and marks it as timed rather than equilibrium.',
      },
      {
        topic: 'A stronger brine',
        sources:
          'The Food Lab tested a saturated 35% brine and it retained as much moisture as the 6% one, "despite turning the turkey inedibly salty".',
        decision:
          'No option above what the sources publish. Past 6% you buy nothing but salt.',
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
      'equilibrium-brine': {
        term: 'Equilibrium brine',
        definition:
          'A brine dosed against the weight of the meat rather than the water, at the concentration you want in the finished food. Since no salt is left to enter once everything evens out, time stops being critical.',
      },
      'dry-brining': {
        term: 'Dry salting',
        definition:
          'Salting the piece and letting it rest refrigerated, with no added water. The salt draws juice out by osmosis, dissolves in it and forms a concentrated brine of the meat’s own making, which goes back in.',
      },
      'covering-brine': {
        term: 'Covering brine',
        definition:
          'The piece submerged in a solution stronger than what you want in it, pulled out before it equilibrates. It leaves a gradient: the edge saltier than the centre.',
      },
      'kosher-salt': {
        term: 'Kosher salt',
        definition:
          'Coarse, irregular, un-iodised salt made to be picked up with the fingers. Its weight is not standardised: a cup of Diamond Crystal weighs 4.8 ounces and a cup of Morton almost 8, which is why every serious recipe gives the dose by weight.',
      },
      injection: {
        term: 'Injection',
        definition:
          'Pushing the brine into the piece with a syringe, at dozens of points. It doubles or triples the rate at which salt diffuses, and it is what makes an equilibrium brine viable in 24 hours.',
      },
      'salting-out': {
        term: 'Salting out',
        definition:
          'The effect that explains why brining in stock adds no more flavour than brining in water. Water molecules bind to the salt ions, leaving the stock’s proteins to clump together, far too large to cross the cell. The salt goes in; the stock’s flavour stays out.',
      },
    },
  },


  audit: {
    title: 'Check the brine you already use',
    lead: 'Weigh the protein and what went into the brine, pick the method, and see how your recipe compares with the source’s. The comparison is against a published recipe, not a range: differing from it is not being wrong, it is being a different recipe.',

    methodLabel: 'Method you used',
    protein: 'Weight of the protein',
    salt: 'Salt in your brine',
    liquid: 'Liquid in your brine',
    sugar: 'Sugar in your brine',

    saltRatio: 'Salt against the protein',
    liquidRatio: 'Liquid against the protein',
    sugarRatio: 'Sugar against the protein',
    saltSubject: 'the salt',
    liquidSubject: 'the liquid',
    sugarSubject: 'the sugar',
  },
  sources: {
    title: 'Sources for this calculator',
    lead: 'Two books that measured the subject and a third that enters for one reason only: it is the only one on the shelf that publishes what a cup of kosher salt weighs, which is what makes the Food Lab dose expressible in grams.',
    page: 'p.',
    section: 'section',
  },
};
