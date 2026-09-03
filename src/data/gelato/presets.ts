// Receitas iniciais, uma por tipo de base. Todas verificadas pelos testes:
// fecham dentro de todas as faixas de tolerância da planilha para o seu tipo.
//
// `name` é texto de referência em pt-BR; a interface bilíngue resolve o rótulo
// pelo `id`.

export interface Preset {
  readonly id: string;
  readonly name: string;
  readonly recipeTypeId: string;
  readonly items: readonly { readonly ingredientId: string; readonly grams: number }[];
}

export const PRESETS: readonly Preset[] = [
  {
    id: 'fior-di-latte',
    name: 'Fior di latte',
    recipeTypeId: 'gelato-leite',
    items: [
      { ingredientId: 'leite-integral', grams: 600 },
      { ingredientId: 'creme-de-leite-fresco-35', grams: 100 },
      { ingredientId: 'leite-em-po-desnatado', grams: 35 },
      { ingredientId: 'acucar-sacarose', grams: 120 },
      { ingredientId: 'acucar-dextrose', grams: 40 },
      { ingredientId: 'neutro', grams: 5 },
    ],
  },
  {
    id: 'morango-ao-leite',
    name: 'Morango ao leite',
    recipeTypeId: 'gelato-leite-fruta',
    items: [
      { ingredientId: 'leite-integral', grams: 415 },
      { ingredientId: 'morango', grams: 290 },
      { ingredientId: 'creme-de-leite-fresco-35', grams: 85 },
      { ingredientId: 'leite-em-po-desnatado', grams: 50 },
      { ingredientId: 'acucar-sacarose', grams: 145 },
      { ingredientId: 'acucar-dextrose', grams: 25 },
      { ingredientId: 'neutro', grams: 20 },
    ],
  },
  {
    id: 'sorbet-morango',
    name: 'Sorbet de morango',
    recipeTypeId: 'sorbet',
    items: [
      { ingredientId: 'morango', grams: 455 },
      { ingredientId: 'agua', grams: 385 },
      { ingredientId: 'acucar-sacarose', grams: 160 },
      { ingredientId: 'acucar-dextrose', grams: 75 },
      { ingredientId: 'acucar-glucose-em-po', grams: 30 },
      { ingredientId: 'neutro', grams: 30 },
    ],
  },
  {
    id: 'chocolate-agua',
    name: 'Chocolate na água',
    recipeTypeId: 'chocolate-agua',
    items: [
      { ingredientId: 'agua', grams: 650 },
      { ingredientId: 'acucar-sacarose', grams: 172 },
      { ingredientId: 'cacau-em-po-22-gordura', grams: 70 },
      { ingredientId: 'chocolate-amargo-70', grams: 65 },
      { ingredientId: 'acucar-glucose-em-po', grams: 30 },
      { ingredientId: 'acucar-dextrose', grams: 25 },
      { ingredientId: 'neutro', grams: 25 },
    ],
  },
  {
    id: 'coco-vegano',
    name: 'Coco e caju (vegano)',
    recipeTypeId: 'base-vegana',
    items: [
      { ingredientId: 'leite-de-coco', grams: 480 },
      { ingredientId: 'agua', grams: 150 },
      { ingredientId: 'pasta-de-castanha-de-caju-100', grams: 120 },
      { ingredientId: 'acucar-sacarose', grams: 65 },
      { ingredientId: 'acucar-dextrose', grams: 60 },
      { ingredientId: 'inulina-fibra-vegetal', grams: 35 },
      { ingredientId: 'neutro', grams: 20 },
    ],
  },
];
