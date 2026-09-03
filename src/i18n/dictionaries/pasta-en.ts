import type { pastaPtBR } from './pasta-pt-BR';

export const pastaEn: typeof pastaPtBR = {
  meta: {
    title: 'Fresh pasta calculator: flour, eggs and servings',
    description:
      'How much flour and how many eggs for the people at your table: 13 fresh pasta doughs in grams, an adjustment for odd-sized eggs and a thickness guide by shape. Every number cited with book and chapter.',
  },

  eyebrow: 'Fresh pasta calculator',
  title: 'Fresh pasta for the people at your table',
  lead: 'Say how many are eating and the recipe comes out in grams of flour and whole eggs. Eggs do not halve: the calculator suggests the nearest whole combination and shows how much flour that shifts.',

  presetLabel: 'Type of dough',

  presets: {
    classica: 'Classic egg dough',
    'rica-em-gemas': 'Rich egg yolk dough',
    'hazan-amarela': 'Yellow dough (Hazan)',
    'hazan-recheada': 'Dough for stuffing (Hazan)',
    'hazan-verde': 'Green spinach dough (Hazan)',
    'hazan-tortellini': 'Tortellini dough (Hazan)',
    'semola-vegana': 'Semolina and water (vegan)',
    'espinafre-ovo': 'Spinach egg dough',
    'espinafre-vegana': 'Vegan spinach dough',
    'beterraba-ovo': 'Beetroot egg dough',
    'beterraba-vegana': 'Vegan beetroot dough',
    'tinta-de-lula': 'Squid ink dough',
    'sem-gluten': 'Gluten-free (chickpea)',
  },

  families: {
    egg: 'Egg dough',
    vegan: 'Water dough',
    'gluten-free': 'Gluten-free',
  },

  ingredients: {
    'flour-00': '00 flour',
    'flour-all-purpose': 'All-purpose flour',
    'flour-semolina-fine': 'Fine semolina',
    'flour-chickpea': 'Chickpea flour',
    egg: 'Egg',
    'egg-yolk': 'Egg yolk',
    water: 'Water',
    milk: 'Milk',
    spinach: 'Blanched and squeezed spinach',
    'spinach-liquid': 'Spinach liquid',
    'beetroot-juice': 'Beetroot juice',
    'squid-ink': 'Squid ink',
  },

  target: {
    label: 'How many people',
    servings: 'People',
    styleLabel: 'What the meal is',
    styles: {
      starter: 'Starter',
      main: 'Main course',
      generous: 'Generous helping',
    },
    gramsPerServing: 'Pasta per person (g)',
    eggWeight: 'Weight of one shelled egg (g)',
    eggHint: 'The default is 50 g, the medium egg the recipes assume. Weigh yours if you want precision.',
    yolkWeight: 'Weight of one yolk (g)',
  },

  result: {
    title: 'What to weigh',
    flour: 'Flour',
    flourMax: 'Flour once kneaded',
    eggs: 'Eggs',
    yolks: 'Yolks',
    units: 'pcs',
    yieldLabel: 'Yields',
    yieldNote:
      'The yield is the one the source publishes. Adding up the parts usually lands a little higher, because some of the flour stays on the board and in the dusting.',
    servings: 'Serves',
    servingsUnit: 'people',
    pieces: 'Stuffed pieces',
    water: 'Cooking water',
    litres: 'L',
    cookTime: 'Cooking time',
    minutes: 'min',
    adjustment: {
      ideal: 'The scale would ask for',
      eggsWord: 'eggs',
      more: 'with the nearest whole combination the flour goes up by',
      less: 'with the nearest whole combination the flour goes down by',
      exact: 'The scale lands on whole eggs: no flour adjustment needed.',
    },
  },

  table: {
    caption: 'Calculated recipe',
    ingredient: 'Ingredient',
    amount: 'Amount',
    prep: 'from',
    absorb: 'up to',
    absorbHint:
      'Hazan publishes the starting flour and tells you to work in more while kneading, until the dough stops sticking to your thumb. The second number is where that usually lands.',
  },

  balance: {
    title: 'Dough balance',
    servingSize: 'Pasta per person',
    flourPerEggMass: 'Flour per gram of egg',
    hydration: 'Hydration',
    withAbsorb: 'After the flour worked in while kneading',
    recommended: 'Range across the sources',
    status: { below: 'Below range', in: 'In range', above: 'Above range' },
    hardLimit: 'Outside what the sources support',
    colourNote:
      'In coloured doughs the purée replaces part of the egg and the source has already corrected the flour: 250 g in the spinach one, 320 g in the squid ink one. That is why the flour-to-egg ratio does not apply here.',
  },

  notes: {
    servingGrams:
      'Below 85 g a head the pasta is a starter; above 115 g it is a Sunday portion. Both sources work inside that band.',
    flourPerEggMass:
      'Less flour per gram of egg gives a soft dough that sticks to the rollers and needs flour worked in while kneading, which is exactly how Hazan works, on purpose. More flour gives a stiff dough that cracks as you roll it.',
    waterHydration:
      'Semolina-and-water dough lives between 46 and 50% hydration. Below that it will not come together; above it, it sticks to the machine and loses the shape.',
  },

  process: {
    title: 'Method, as the source gives it',
    ribbons: 'Ribbons: stop at setting 7',
    filled: 'Stuffed: stop at setting 8',
    unsuitableFilled:
      'This dough will not close a raviolo: without gluten it crumbles at the fold. Keep it to ribbons.',
    notes: {
      classica:
        'Knead by hand for 8 to 10 minutes. Rest at least 30 minutes in the fridge, or overnight if you can, and take it out 30 minutes before rolling.',
      'rica-em-gemas':
        'The yolks give a golden colour and a dough that is suppler to knead and slightly drier to roll.',
      'hazan-amarela':
        'The flour in the list is only the start: work in more while kneading until the dough no longer sticks to your thumb. Knead a full 8 minutes and rest 15 minutes to 2 hours at room temperature.',
      'hazan-recheada':
        'The half spoon of milk keeps the dough soft and sticky: that tack is what seals the raviolo. Roll one piece at a time and never let it dry before closing.',
      'hazan-verde':
        'Spinach cooked, squeezed and chopped with a knife: a processor draws out too much moisture. The flour already rises to 1½ cups to take the spinach water.',
      'hazan-tortellini':
        'Yields about 200 tortellini. Count 17 a head in broth and 24 with sauce, and close one strip at a time while the dough is still soft.',
      'semola-vegana':
        'Knead 10 to 15 minutes, cook 5 to 6. Hazan advises against semolina at home: with a rolling pin it is a nearly hopeless fight, so count on a machine or on strong arms.',
      'espinafre-ovo':
        'Blanch the spinach for 30 to 45 seconds, squeeze it hard and blend it with 1 egg: the purée has to weigh 100 to 110 g on the scale. That purée is the liquid, and the egg is already inside it.',
      'espinafre-vegana':
        'Blend the blanched spinach with 150 g of water and strain. Weigh out 140 to 150 g of the green liquid, topping up with water if it falls short.',
      'beterraba-ovo':
        'Blend the raw beetroot with 60 g of water and strain; weigh 40 g of the juice. Cooked as a ribbon it turns pink. This dough is at its best stuffed or striped.',
      'beterraba-vegana':
        'Blend the raw beetroot with 140 g of water, strain and weigh out 150 g of the liquid.',
      'tinta-de-lula':
        'The ink is extra liquid, which is why the flour goes from 300 to 320 g. Hazan rejects squid ink in pasta; this recipe is Zielonka’s.',
      'sem-gluten':
        'Ribbons only: without gluten the dough crumbles when you try to close a raviolo.',
    },
  },

  shapes: {
    title: 'Where to stop rolling',
    lead: 'The numbers are those of Zielonka’s machine, where 0 is the widest setting and 8 the tightest. Machines numbered the other way round want the opposite number. Neither book publishes a thickness in millimetres, so neither does this page.',
    columns: { shape: 'Shape', setting: 'Rolling', use: 'What it is for' },
    setting: 'Setting',
    or: 'or',
    noSetting: 'No setting of its own',
    divergent: 'The sources diverge',
    items: {
      tagliatelle: {
        name: 'Tagliatelle',
        thickness:
          'Two passes at every notch up to 7. Hazan cuts by hand into ribbons about 6 mm wide; the machine’s wide cutter gives fettuccine, slightly narrower.',
        use: 'The classic Bolognese ribbon, for ragù and full-bodied sauces.',
      },
      pappardelle: {
        name: 'Pappardelle',
        thickness:
          'The same 7 as the other ribbons. Zielonka cuts 3 cm wide by 15–20 cm long; Hazan makes 2.5 × 15 cm with a fluted wheel, since the machine has no cutter for it.',
        use: 'A broad ribbon for meat and game sauces.',
      },
      chitarra: {
        name: 'Chitarra / tonnarelli',
        thickness:
          'Zielonka stops at 7, or 6 for more bite. Hazan stops at the next-to-last notch and matches the sheet thickness to the cutter width: the strand has to come out square.',
        use: 'A square-sectioned strand, off the narrow cutter or the chitarra itself.',
      },
      garganelli: {
        name: 'Garganelli',
        thickness:
          'Sheet at 7, soft and freshly rolled. Squares of 4 cm rolled over a comb on a dowel about 6 mm across.',
        use: 'A ridged tube that holds sauce inside and out.',
      },
      ravioli: {
        name: 'Ravioli and triangoli',
        thickness:
          'Setting 8, the thinnest: the sheet folds onto itself and two layers add up to twice the thickness.',
        use: 'Square stuffed pasta; the strip comes out twice the width of the raviolo.',
      },
      tortellini: {
        name: 'Tortellini and cappelletti',
        thickness:
          'Setting 8. Squares of about 4 cm with a quarter teaspoon of filling, folded into a triangle and closed into a ring.',
        use: 'In broth or with sauce; in Romagna the same shape is called cappelletti.',
      },
      lasagne: {
        name: 'Lasagne',
        thickness:
          'Zielonka stops at 7 and blanches the sheets for 30 seconds before assembling. Hazan rolls as thin as the dough will go, in 25 cm strips, and builds at least six layers.',
        use: 'Sheets cut to the size of the dish.',
      },
      maltagliati: {
        name: 'Maltagliati',
        thickness:
          'No setting of its own: these are the trimmings from whatever you have already rolled, cut into uneven diamonds.',
        use: 'Bean soups and minestrone, "badly cut" on purpose.',
      },
    },
  },

  dishes: {
    title: 'Yield of an assembled dish',
    lead: 'Lasagne and stuffed pasta do not follow the grams-per-person of a ribbon: one splits the same sheet into layers, the other is counted in pieces.',
    columns: { dish: 'Dish', amount: 'Dough', servings: 'Servings' },
    pieces: 'pieces',
    items: {
      lasagneZielonka: {
        name: 'Lasagne (Zielonka)',
        note: 'One and a half times the classic dough for a 26 × 20 cm dish; sheets blanched for 30 s and chilled in iced water.',
      },
      lasagneHazan: {
        name: 'Green lasagne (Hazan)',
        note: 'A two-egg green dough in a 23 × 30 cm dish, with at least six layers.',
      },
      tortelliniHazan: {
        name: 'Tortellini in brodo (Hazan)',
        note: 'About 100 tortellini with 2.5 L of broth, roughly 17 a head. With sauce, count 24 a head.',
      },
    },
  },

  sources: {
    title: 'Sources for this calculator',
    lead: 'Every preset, every range and every thickness above comes from one of these works, at the chapter given. All three are EPUBs, with no physical pagination.',
    page: 'p.',
    section: 'ch.',
  },

  method: {
    title: 'How the calculation works',
    body: [
      'The arithmetic starts at the egg, not the flour. Zielonka’s classic dough is 300 g of 00 flour to 3 eggs, yielding 400 g and serving four, which is 100 g of flour and one egg a head. Pick the number of people and what the meal is, and the calculator scales that recipe and hands it back in grams.',
      'The catch is that eggs do not halve. For six people the scale would ask for 4.5 eggs, so the calculator suggests the nearest whole combination (on a tie, the larger one, because leftover dough beats running short) and then shows how much flour that moves. If your eggs are not 50 g, type the real weight: the flour follows, because what the recipe fixes is the ratio between the two.',
      'That ratio is the number the sources argue about. Zielonka starts at 2 g of flour per gram of egg; Ratio says flour is 1.5× the egg weight; Hazan starts at 1.4 and climbs to about 2.4 as flour is worked in while kneading. None of it applies to coloured doughs: there the purée is the liquid, weighed on the scale, and the source has already corrected the flour.',
    ],
  },

  divergence: {
    title: 'Where the sources disagree',
    lead: 'The three books behind this calculator agree on almost no quantity. Wherever a choice had to be made, it is spelled out here.',
    columns: {
      topic: 'Topic',
      sources: 'What each source says',
      decision: 'What the calculator does',
    },
    items: [
      {
        topic: 'Flour per egg',
        sources:
          'Zielonka: 100 g of 00 flour per medium egg (300 g for three). Ruhlman: flour equal to 1.5× the weight of the eggs. Hazan: one cup to two eggs, but with instructions to work in flour until the thumb test comes away clean.',
        decision:
          'A default of 100 g per egg. It is the classic Italian rule and the only one that starts out settled in grams. Hazan’s is deliberately wet, to be corrected on the board, and the yield she herself declares (¾ lb) only adds up with far more flour than the list shows.',
      },
      {
        topic: 'Pasta per person',
        sources:
          'Zielonka uses 100 g throughout (400 g serves four). Hazan gets 3 standard servings out of ¾ lb (~113 g) or 4 starter servings (~85 g).',
        decision:
          'Main course at 100 g, starter at 85 g and a generous helping at 115 g. Zielonka’s round number sits in the middle of Hazan’s band, so there is nothing to choose between them: all three figures coexist.',
      },
      {
        topic: 'Coloured dough',
        sources:
          'Zielonka gives spinach, beetroot and squid ink with the liquid weighed in grams. Hazan accepts only spinach and calls squid ink deplorable.',
        decision:
          'We follow Zielonka, because he is the only one who quantifies the adjustment: 40 g of beetroot juice, 140 to 150 g of spinach liquid, flour up to 320 g for the ink. Hazan’s objection is a matter of taste rather than technique, and it is recorded as a note.',
      },
      {
        topic: 'Semolina at home',
        sources:
          'Zielonka makes vegan dough from fine semolina and water at 46%. Hazan advises against it: it tends to be gritty and rolling it by pin is a nearly hopeless fight. "Leave semolina to the factories".',
        decision:
          'The semolina dough stays, with the warning attached. Her criticism is about the rolling pin; with a machine, or a long knead, the recipe works. What does swap one for one, by weight, is 00 flour and all-purpose.',
      },
      {
        topic: 'Resting and keeping',
        sources:
          'Zielonka rests in the fridge (30 minutes to overnight) and freezes for up to two weeks. Hazan rests at room temperature (15 minutes to 2 hours) and dries for 24 hours to keep for weeks, condemning plastic and the fridge.',
        decision:
          'Both are shown. Cold dough is harder to stretch, so anyone refrigerating should take it out 30 minutes before rolling; anyone rolling straight away can leave it on the counter.',
      },
    ],
  },

  glossary: {
    title: 'Glossary',
    terms: [
      {
        term: '00 flour',
        definition:
          'A very fine Italian flour, milled twice, almost the texture of icing sugar. It gives a smooth, supple dough; all-purpose swaps in at the same weight.',
      },
      {
        term: 'Fine semolina',
        definition:
          'Finely milled durum wheat, the durum equivalent of 00. It is the base of vegan water dough, sold in Italy as semola rimacinata.',
      },
      {
        term: 'Coarse semolina',
        definition:
          'Only for dusting trays and shaped pasta so nothing sticks. Sieved, it can be reused three or four times.',
      },
      {
        term: 'Thinning',
        definition:
          'Rolling the dough out one notch at a time. It is not just pressure: that gradual thinning, on top of the kneading, is what gives the dough body and structure.',
      },
      {
        term: 'Matterello',
        definition:
          'The long pin of the hand method. The dough is stretched rather than compressed, ending up with a textured surface that soaks up sauce. It is a craft that takes practice.',
      },
      {
        term: 'Dough for stuffing',
        definition:
          'Dough used soft and sticky, freshly rolled, one piece at a time. That tack is what seals the raviolo; dry dough will not close.',
      },
      {
        term: 'Tonnarelli',
        definition:
          'A strand of square section, as thick as it is wide, cut on the narrow cutter or on the chitarra, the string frame that looks like an old-fashioned egg slicer.',
      },
      {
        term: 'Maltagliati',
        definition:
          '"Badly cut": the trimmings of dough in uneven diamonds, saved for bean soups and minestrone.',
      },
      {
        term: 'Al dente',
        definition:
          'Firm to the bite. Fresh pasta never gets as firm as factory-dried, but it should always offer some resistance.',
      },
      {
        term: 'Bronze extruded',
        definition:
          'Dried pasta pushed through a bronze die, with a rough, porous surface that holds sauce far better than a teflon die.',
      },
    ],
  },
};
