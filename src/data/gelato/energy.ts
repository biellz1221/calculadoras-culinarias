/**
 * Fatores de energia específicos, em kcal por grama do ingrediente.
 *
 * A planilha de origem não traz dados calóricos, então a estimativa padrão usa
 * Atwater (carboidrato e proteína 4 kcal/g, gordura 9). Para polióis, fibras e
 * álcool esse cálculo erra muito — eritritol daria 4 kcal/g em vez de 0,2 — e a
 * planilha é cheia desses ingredientes. A receita-exemplo da própria planilha
 * usa eritritol, polidextrose e sucralose: com Atwater puro ela daria o dobro
 * das calorias reais — 134,1 contra 66,7 kcal/100 g (números conferidos com o
 * motor portado; o README da calculadora original arredonda o valor Atwater
 * para "~150").
 *
 * Por isso os fatores abaixo substituem Atwater linha a linha. Eles partem dos
 * valores regulatórios usuais (ANVISA/Codex: fibra 2, polidextrose 1, etanol 7)
 * e já vêm ajustados pelo teor de sólidos do ingrediente na planilha: são kcal
 * por grama do ingrediente **como ele entra na receita**, não por grama da
 * substância pura.
 *
 * A chave é o `id` do ingrediente em ./ingredients.ts.
 */
export const ENERGY_OVERRIDES: Readonly<Record<string, number>> = {
  // Polióis
  eritritol: 0.2,
  xylitol: 2.4,
  maltitol: 2.1,

  // Fibras e estabilizantes
  'polidextrose-fibra': 0.95, // 1 kcal/g × 95% de sólidos
  'inulina-fibra-vegetal': 1.9, // 2 kcal/g × 95% de sólidos
  'goma-xantana': 2,
  'farinha-de-semente-de-guar': 2,
  'farinha-de-semente-de-tara': 2,
  'farinha-de-semente-de-alfarroba': 2,
  neutro: 2,
  'imo-900-taumatina-moonsugar': 2,

  // Edulcorantes de alta intensidade e minerais
  sucralose: 0,
  'stevia-em-po': 0,
  sal: 0,

  // Álcoois: o etanol tem 7 kcal/g e não aparece nos sólidos da planilha.
  'alcool-96': 6.7,
  cachaca: 2.3,
  rum: 2.3,
  cointreau: 3.1,
  'licor-amaretto': 2.4,
};

/** Fatores de Atwater, em kcal por grama de macronutriente. */
export const ATWATER = {
  carbs: 4,
  protein: 4,
  fats: 9,
} as const;

/** Porção de referência usada na tabela nutricional. */
export const PORTION_GRAMS = 50;
