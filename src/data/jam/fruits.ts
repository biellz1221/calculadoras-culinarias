import { EMBRAPA_TABLE, EMBRAPA_TABLE_CITATIONS, LEGAL_CITATIONS, getEmbrapaRow } from './brazil';
import { cite } from '../citations';
import type { JamFruit, SourceRecipe } from './types';

/**
 * As frutas, cada uma com uma receita pesada de verdade por trás.
 *
 * Extração e conferência em docs/research/geleias.md §4. Todas as nove são do
 * Blue Chair Jam Cookbook, que é a única das três fontes que publica geleia
 * pesada fruta a fruta — Ferber tem uma proporção de casa (§ FERBER_*) e o
 * NCHFP mede em xícaras, que sem densidade não vira grama.
 *
 * As quantidades estão em onças porque é como o livro escreve, e porque razão
 * entre massas não tem unidade: 40 ÷ 62 é a mesma proporção em qualquer
 * sistema. Isso mantém a receita conferível linha a linha contra a página
 * citada, sem nenhum fator de conversão no meio.
 */

const S = (page: number) => cite('saunders', page);

const LB = 16;

function recipe(value: SourceRecipe): SourceRecipe {
  return value;
}

/**
 * As frutas com receita pesada: as nove do Blue Chair.
 *
 * Três delas também estão na Tabela 1 da Embrapa, e o vínculo está declarado em
 * `embrapaId`. Onde as duas classificações se encontram — morango, pêssego
 * maduro e figo maduro — elas concordam: o NCHFP põe as três no grupo III e a
 * Embrapa as chama de pobres em pectina. Duas réguas construídas em continentes
 * diferentes dizendo a mesma coisa é o tipo de coincidência que vale mostrar.
 *
 * Uva e ameixa **não** ganharam vínculo. A uva de Saunders é Concord, que não
 * está entre as variedades da tabela brasileira, e a ameixa do livro não tem
 * cultivar declarada. Aproximar seria inventar.
 */
const WEIGHED_FRUITS: readonly JamFruit[] = [
  {
    // p. 178: "3 pounds 14 ounces hulled strawberries", "2½ pounds white cane
    // sugar", "4 ounces plus 2 ounces strained freshly squeezed lemon juice".
    id: 'strawberry',
    group: 'iii',
    embrapaId: 'strawberry',
    recipe: recipe({
      fruitOz: 3 * LB + 14,
      sugarOz: 2.5 * LB,
      lemonOz: 4 + 2,
      jars: [5, 6],
      shelfMonths: [6, 6],
    }),
    citations: [S(178)],
  },
  {
    // p. 234: "2 pounds plus 1 pound red or golden raspberries", "3 pounds
    // white cane sugar". Um a um exato, e a única do conjunto sem limão.
    id: 'raspberry',
    group: 'iii',
    recipe: recipe({
      fruitOz: 3 * LB,
      sugarOz: 3 * LB,
      lemonOz: 0,
      jars: [6, 7],
      shelfMonths: [12, 12],
    }),
    citations: [S(234)],
  },
  {
    // p. 268: "1 pound 6 ounces plus 2 pounds 2 ounces wild blackberries",
    // "1 ¾ pounds white cane sugar", "2 ½ to 3 ounces ... lemon juice".
    id: 'blackberry',
    group: 'ii',
    recipe: recipe({
      fruitOz: LB + 6 + (2 * LB + 2),
      sugarOz: 1.75 * LB,
      lemonOz: 2.5,
      lemonMaxOz: 3,
      jars: [5, 5],
      shelfMonths: [6, 8],
    }),
    citations: [S(268)],
  },
  {
    // p. 168: "6 pounds pitted and halved Royal Blenheim apricots", "2½ pounds
    // white cane sugar", "2½ ounces ... lemon juice". A de menos açúcar.
    id: 'apricot',
    group: 'iii',
    recipe: recipe({
      fruitOz: 6 * LB,
      sugarOz: 2.5 * LB,
      lemonOz: 2.5,
      jars: [8, 9],
      shelfMonths: [6, 8],
    }),
    citations: [S(168)],
  },
  {
    // p. 246. Atenção ao peso: a receita compra "6 ½ pounds (approximately)" e
    // manda cortar "enough ... to make 5 ½ pounds of prepared fruit and
    // juices". O que vale é o preparado.
    id: 'peach',
    group: 'iii',
    embrapaId: 'peach-ripe',
    recipe: recipe({
      fruitOz: 5.5 * LB,
      sugarOz: 3 * LB,
      lemonOz: 3.5,
      jars: [12, 12],
      shelfMonths: [8, 8],
    }),
    citations: [S(246)],
  },
  {
    // p. 197: dois lotes de fruta (2 lb 3 oz + 2 lb 5 oz) e dois de açúcar
    // (1¼ lb + ¾ lb). O limão é faixa declarada, ajustada por prova.
    id: 'plum',
    group: 'i',
    recipe: recipe({
      fruitOz: 2 * LB + 3 + (2 * LB + 5),
      sugarOz: 1.25 * LB + 0.75 * LB,
      lemonOz: 2,
      lemonMaxOz: 6,
      jars: [7, 8],
      shelfMonths: [12, 12],
    }),
    citations: [S(197)],
  },
  {
    // p. 224: "2 ½ pounds plus 3 pounds stemmed Adriatic figs", "3 pounds
    // white cane sugar", "6 ounces ... lemon juice".
    id: 'fig',
    group: 'iii',
    embrapaId: 'fig-ripe',
    recipe: recipe({
      fruitOz: 2.5 * LB + 3 * LB,
      sugarOz: 3 * LB,
      lemonOz: 6,
      jars: [11, 11],
      shelfMonths: [12, 12],
    }),
    citations: [S(224)],
  },
  {
    // p. 183: "2½ pounds small blueberries", "1 pound 14 ounces white cane
    // sugar", "6 ounces ... lemon juice". A que mais leva limão do conjunto,
    // e Saunders explica por quê: "Blueberries lack acid".
    id: 'blueberry',
    group: 'iii',
    recipe: recipe({
      fruitOz: 2.5 * LB,
      sugarOz: LB + 14,
      lemonOz: 6,
      jars: [5, 6],
      shelfMonths: [12, 12],
    }),
    citations: [S(183)],
  },
  {
    // p. 265: "4 pounds stemmed Concord grapes", "2 ½ pounds white cane
    // sugar", "3 ounces ... lemon juice".
    id: 'grape',
    group: 'i',
    recipe: recipe({
      fruitOz: 4 * LB,
      sugarOz: 2.5 * LB,
      lemonOz: 3,
      jars: [5, 6],
      shelfMonths: [12, 12],
    }),
    citations: [S(265)],
  },
];

/**
 * As frutas que entram só pela classificação brasileira.
 *
 * Toda linha da Tabela 1 vira fruta escolhível, menos as três que já têm receita
 * pesada acima. Não há curadoria: cada linha da fonte tem o mesmo direito de
 * estar aqui, e escolher um punhado seria eu decidindo qual fruta brasileira
 * importa. A proporção delas vem da norma (§13 da pesquisa), não de receita —
 * receita pesada de goiaba não existe em obra nenhuma da estante.
 *
 * `legalException` marca marmelo, laranja e maçã, as três frutas que a própria
 * definição legal autoriza a ir a 35:65 em vez de 40:60.
 */
const LEGAL_EXCEPTION_IDS = new Set(['quince', 'orange', 'apple-tart', 'apple-sweet']);

const ABSORBED_BY_RECIPE = new Set(['strawberry', 'peach-ripe', 'fig-ripe']);

const CLASSIFIED_FRUITS: readonly JamFruit[] = EMBRAPA_TABLE.filter(
  (row) => !ABSORBED_BY_RECIPE.has(row.id),
).map((row) => ({
  id: row.id,
  embrapaId: row.id,
  legalException: LEGAL_EXCEPTION_IDS.has(row.id),
  citations: [...EMBRAPA_TABLE_CITATIONS, ...LEGAL_CITATIONS],
}));

export const JAM_FRUITS: readonly JamFruit[] = [...WEIGHED_FRUITS, ...CLASSIFIED_FRUITS];

/** As duas famílias, para o seletor agrupar em vez de despejar 44 botões. */
export const WEIGHED_FRUIT_IDS: readonly string[] = WEIGHED_FRUITS.map((f) => f.id);
export const CLASSIFIED_FRUIT_IDS: readonly string[] = CLASSIFIED_FRUITS.map((f) => f.id);

export function getFruit(id: string): JamFruit | undefined {
  return JAM_FRUITS.find((fruit) => fruit.id === id);
}

export const DEFAULT_FRUIT_ID = 'strawberry';

/** Açúcar da receita citada, sobre o peso da fruta preparada. */
export function sourceSugarRatio(fruit: JamFruit): number | null {
  if (!fruit.recipe) return null;
  return fruit.recipe.sugarOz / fruit.recipe.fruitOz;
}

/**
 * Suco de limão da receita citada, sobre o peso da fruta preparada.
 *
 * `null` para fruta sem receita: a Embrapa classifica a acidez em três níveis e
 * **não publica dose**. O que entra na tela no lugar é o alvo de pH e a regra de
 * medir antes de acidificar. Alvo verificável vale mais que dose inventada.
 */
export function sourceLemonRatio(
  fruit: JamFruit,
): { min: number; max: number } | null {
  if (!fruit.recipe) return null;
  const { fruitOz, lemonOz, lemonMaxOz } = fruit.recipe;
  return { min: lemonOz / fruitOz, max: (lemonMaxOz ?? lemonOz) / fruitOz };
}

/**
 * A proporção da casa de Ferber: 800 g de açúcar por quilo de fruta.
 *
 * Contagem sobre as 218 receitas do livro: 93 pedem exatamente "800 g de sucre
 * cristallisé", e em 48 delas a fruta é exatamente 1 kg. O segundo valor mais
 * frequente é 900 g, com 18 ocorrências.
 */
export const FERBER_SUGAR_RATIO = 0.8;

export const FERBER_SUGAR_CITATIONS = [
  cite('ferber', 'cap. "Le sucre et la cuisson"'),
];

/**
 * Gelatina de maçã como pectina emprestada: 200 g por quilo de fruta.
 *
 * "La gelée de pommes apporte la pectine, indispensable à la gélification des
 * fruits qui en manquent naturellement." A dose está na receita "Griottes":
 * 1 kg de fruta líquida, 200 g de gelée de pommes vertes.
 */
export const FERBER_APPLE_JELLY_RATIO = 0.2;

export const FERBER_APPLE_JELLY_CITATIONS = [
  cite('ferber', 'cap. "Le sucre et la cuisson"'),
  cite('ferber', 'receita "Griottes"'),
];

/**
 * Açúcar no produto pronto que conserva, e o que a fruta já traz.
 *
 * "Pour obtenir la meilleure conservation, la confiture doit contenir 65 % de
 * sucre. Sachant qu'il y a déjà 10 % à 15 % de sucre dans le fruit..."
 */
export const FERBER_TARGET_SUGAR = 0.65;
export const FRUIT_OWN_SUGAR: readonly [number, number] = [0.1, 0.15];

/** A classificação por pectina e ácido é do NCHFP, não nossa. */
export const PECTIN_GROUP_CITATIONS = [
  cite('nchfp', 'Jellied Product Ingredients — Pectin and Acid Content of Common Fruits'),
];

/**
 * Se a fruta precisa de pectina emprestada.
 *
 * Duas fontes respondem, cada uma no seu vocabulário: o grupo III do NCHFP
 * ("always needs added acid, pectin or both") e a coluna "pobre" da Tabela 1. Se
 * qualquer uma das duas apontar carência, a sugestão aparece — nenhuma das duas
 * tem autoridade sobre a outra, e onde as duas falam elas concordam.
 */
export function needsAddedPectin(fruit: JamFruit): boolean {
  if (fruit.group === 'iii') return true;
  return getEmbrapaRow(fruit.embrapaId)?.pectin === 'poor';
}
