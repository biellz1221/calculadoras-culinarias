import { cite, type Citation } from '../citations';
import type {
  Agent,
  AgentId,
  GelatinGrade,
  SpherificationId,
  SpherificationMethod,
  TextureId,
} from './types';

/**
 * As doses, todas de *Modernist Cuisine at Home*.
 *
 * O PDF da obra é digitalização com OCR (ABBYY FineReader), e OCR acerta nome e
 * destrói número. **Todos os valores abaixo foram conferidos na página
 * renderizada como imagem**, não na camada de texto — inclusive as quatro
 * receitas de salmoura que já estavam no ar. Registro em
 * docs/research/gelificantes.md §1.
 */

const MC = (section: string): Citation => cite('modernist-home', section);

/**
 * O material do Scoolinary, de Rais Esteve.
 *
 * `kind: 'course'` na estante: é material de curso, não bibliografia, e a
 * página diz isso. Não tem paginação de livro — são slides —, então a citação
 * nomeia o documento e o número do slide.
 *
 * Toda dose abaixo foi conferida na imagem do slide. Não por desconfiança do
 * PDF (é texto digital), mas porque **a fonte tem erros de composição
 * conhecidos**: a xantana aparece duas vezes no slide 8 e a metilcelulose diz
 * "2%, 2 gramas por litro" quando 2% de um litro são 20 g. Ver
 * docs/research/gelificantes.md §11.
 */
const GEL = (slide: number): Citation =>
  cite('scoolinary-gelation', `Additional material, slide ${slide}`);
const SPH = (slide: number): Citation =>
  cite('scoolinary-spherification', `Basic — Additional material, slide ${slide}`);

/** A página que enuncia as doses de gel e gel fluido (p. 98 impressa). */
const GELS = MC('cap. "Sauces" — "How to Make Gels and Fluid Gels"');
/** A página do molho de frigideira, que dá xantana e amido (p. 95 impressa). */
const GRAVY = MC('cap. "Sauces" — "How to Make Full-Flavored Pan Gravy"');
/** O quadro "Working with Gelatin", na p. 366 impressa. */
const GELATIN = MC('cap. "Custards and Pies" — "Working with Gelatin"');
/** A panna cotta, na mesma página — é dela que saem as gramas da carragena. */
const PANNA = MC('cap. "Custards and Pies" — "Raspberry Panna Cotta"');
/** O gel fluido de cebola (p. 101 impressa). */
const ONION = MC('cap. "Sauces" — "Onion Fluid Gel"');

const one = (value: number, citations: readonly Citation[]) => ({
  min: value,
  max: value,
  citations,
});

export const AGENTS: readonly Agent[] = [
  {
    // A regra está no texto de abertura da panna cotta — "use 0.8 g of Knox
    // brand powdered gelatin for every 100 g of liquid" — e é a receita logo
    // abaixo que a confirma: 530 g de líquido (leite 30 + creme 300 + purê 200)
    // e 4,3 g impressos, contra os 4,24 g da conta. O quadro do Bloom, na mesma
    // página, é citado à parte, porque trata de outra coisa.
    id: 'gelatin',
    doses: { set: one(0.8, [PANNA]) },
    gels: true,
    needsBoil: false,
    holdsToCelsius: 37,
    citations: [PANNA],
  },
  {
    id: 'agar',
    doses: {
      thin: one(0.25, [GELS]),
      sauce: { min: 0.4, max: 0.5, citations: [GELS] },
      // O gel fluido de cebola: 3,5 g de ágar para 500 g de leite de cebola, e
      // a coluna SCALING da própria receita imprime 0,7%.
      'fluid-gel': one(0.7, [ONION, GELS]),
      puree: { min: 0.9, max: 1.1, citations: [GELS] },
      // As três faixas de firmeza do Scoolinary, slide 34.
      'soft-set': { min: 0.3, max: 0.5, citations: [GEL(34)] },
      set: { min: 0.5, max: 1, citations: [GEL(34)] },
      // A faixa alta serve também para base ácida ou alcoólica, que pedem mais.
      'hard-set': { min: 1, max: 1.5, citations: [GEL(34)] },
    },
    gels: true,
    needsBoil: true,
    // **Os dois livros dizem 85 °C.** Obras independentes, número idêntico — é
    // o que tirou o ágar da condição de fonte única.
    holdsToCelsius: 85,
    setsAtCelsius: 35,
    citations: [GELS, ONION, GEL(34)],
  },
  {
    id: 'xanthan',
    doses: {
      thin: { min: 0.1, max: 0.15, citations: [GRAVY] },
      sauce: { min: 0.2, max: 0.3, citations: [GRAVY] },
    },
    // Xantana engrossa e **não** gelifica: dá corpo sem deixar o líquido firmar.
    gels: false,
    needsBoil: false,
    // O Scoolinary trabalha com 0–0,3% nas bases de esferificação, faixa que
    // cobre a do Modernist por caminho independente.
    citations: [GRAVY, SPH(8)],
  },
  {
    id: 'iota',
    doses: {
      // O Scoolinary dá a faixa de referência no slide dedicado; a panna cotta
      // do Modernist usa 0,12%, que cai dentro do recorte macio da mesma obra
      // (0,1–0,6%, slide 66) e logo abaixo desta faixa.
      'soft-set': { min: 0.2, max: 1.5, citations: [GEL(50), PANNA] },
    },
    gels: true,
    needsBoil: true,
    setsAtCelsius: 36,
    holdsToCelsius: 65,
    pairedWith: 'kappa',
    citations: [GEL(50), PANNA],
  },
  {
    id: 'kappa',
    doses: {
      // 0,1–1% no slide 43. Os 0,094% da panna cotta do Modernist ficam um fio
      // abaixo do piso — diferença de arredondamento, registrada e não alisada.
      set: { min: 0.1, max: 1, citations: [GEL(43), PANNA] },
    },
    gels: true,
    needsBoil: true,
    setsAtCelsius: 50,
    holdsToCelsius: 70,
    pairedWith: 'iota',
    citations: [GEL(43), PANNA],
  },
  {
    // O único gel da estante que não derrete depois de formado: vai ao forno,
    // aguenta maçarico, serve de recheio de confeitaria.
    id: 'gellan',
    doses: { set: { min: 0.7, max: 2, citations: [GEL(39)] } },
    gels: true,
    needsBoil: true,
    setsAtCelsius: 70,
    irreversible: true,
    citations: [GEL(39)],
  },
  {
    // O contrário de todos os outros: gelifica esquentando e derrete esfriando.
    // É o que torna gel frito possível.
    //
    // O slide 55 escreve "2%, 2 gramas por litro" — 2% de um litro são 20 g. O
    // parêntese está errado por uma ordem de grandeza, e o próprio curso acerta
    // a mesma conversão na kappa e no gellan. Usamos as porcentagens.
    id: 'methylcellulose',
    doses: {
      set: { min: 2, max: 2.5, citations: [GEL(55)] },
      'hard-set': one(3, [GEL(55)]),
    },
    gels: true,
    needsBoil: false,
    setsAtCelsius: 60,
    gelsWhenHot: true,
    citations: [GEL(55)],
  },
  {
    id: 'pectin',
    doses: { set: { min: 1, max: 2, citations: [GEL(21)] } },
    gels: true,
    needsBoil: true,
    citations: [GEL(21)],
  },
  {
    id: 'wondra',
    doses: { sauce: { min: 4, max: 5, citations: [GRAVY] } },
    gels: false,
    needsBoil: true,
    citations: [GRAVY],
  },
];

export const TEXTURE_IDS: readonly TextureId[] = [
  'thin',
  'sauce',
  'puree',
  'fluid-gel',
  'soft-set',
  'set',
  'hard-set',
];

export const DEFAULT_TEXTURE_ID: TextureId = 'set';

export function getAgent(id: AgentId): Agent {
  const agent = AGENTS.find((item) => item.id === id);
  if (!agent) throw new Error(`Agente desconhecido: ${id}`);
  return agent;
}

/** Os agentes que a fonte cobre para uma textura, na ordem do registro. */
export function agentsFor(textureId: TextureId): readonly Agent[] {
  return AGENTS.filter((agent) => agent.doses[textureId] !== undefined);
}

/* -------------------------------------------------------------------------- */
/* Gelatina e o sistema de Bloom                                              */
/* -------------------------------------------------------------------------- */

/**
 * Os graus, como a tabela "Kinds of Gelatin" publica.
 *
 * Bronze, ouro e platina são vendidos por faixa de Bloom; prata e Knox, por
 * valor único. A Knox é pó e não tem peso por folha — o livro imprime "n/a", e
 * inventar um número aqui seria pior que deixar vazio.
 */
export const GELATIN_GRADES: readonly GelatinGrade[] = [
  { id: 'bronze', bloom: [125, 155], gramsPerSheet: 3.3 },
  { id: 'silver', bloom: [160, 160], gramsPerSheet: 2.5 },
  { id: 'gold', bloom: [190, 220], gramsPerSheet: 2.0 },
  { id: 'knox', bloom: [225, 225] },
  { id: 'platinum', bloom: [235, 265], gramsPerSheet: 1.7 },
];

/** A gelatina de referência da dose de 0,8%: o pó Knox, de 225 Bloom. */
export const REFERENCE_GRADE_ID = 'knox';
export const REFERENCE_BLOOM = 225;

export const BLOOM_CITATIONS = [GELATIN];

/**
 * Creme de confeiteiro firme: 1 g de gelatina Knox para cada 500 g de creme.
 *
 * Não contradiz os 0,8%: é outra textura-alvo. Custard que se come de colher
 * não é gel desenformável.
 */
export const FIRM_CUSTARD_PERCENT = 0.2;
export const FIRM_CUSTARD_CITATIONS = [
  MC('cap. "Custards and Pies" — "Firm Pastry Cream"'),
];

/**
 * Quanto do líquido a panna cotta da fonte é creme e purê — só para o texto
 * explicar o que ela conta como líquido.
 */
export const PANNA_COTTA = {
  milkGrams: 30,
  creamGrams: 300,
  pureeGrams: 200,
  gelatinGrams: 4.3,
  iotaGrams: 0.65,
  kappaGrams: 0.5,
  agarGrams: 0.8,
  xanthanGrams: 0.65,
  citations: [PANNA],
} as const;

export const PANNA_COTTA_LIQUID_GRAMS =
  PANNA_COTTA.milkGrams + PANNA_COTTA.creamGrams + PANNA_COTTA.pureeGrams;

/** Abaixo de 30 °C o gel fluido firma; é onde o batimento em banho de gelo para. */
export const FLUID_GEL_SET_CELSIUS = 30;

/**
 * O que mexe na firmeza de um gel de gelatina, segundo McGee.
 *
 * Sem número, e de propósito: a fonte dá direção, não dose. Publicar "aumente
 * 20%" seria inventar o que ela não diz.
 */
export const GEL_MODIFIERS = [
  { id: 'salt', direction: 'weaker' },
  { id: 'sugar', direction: 'stronger' },
  { id: 'milk', direction: 'stronger' },
  { id: 'alcohol', direction: 'stronger' },
  { id: 'acid', direction: 'weaker' },
] as const;

export const MODIFIER_CITATIONS = [
  cite('mcgee-ofc', 'cap. 11, "Jelly Consistency"'),
];

/**
 * Esferificação, as duas técnicas.
 *
 * Foi lacuna declarada na página até 2026-09-15, quando o material do
 * Scoolinary chegou. O mecanismo continua tendo a explicação do McGee; a dose
 * agora tem fonte.
 *
 * As porcentagens do produto são sobre o líquido que vira esfera; as do banho,
 * sobre a água do banho. São bases diferentes, e misturá-las é exatamente o
 * erro que a calculadora de picles existe para não cometer.
 *
 * Consolidação em docs/research/gelificantes.md, Parte IV.
 */
export const SPHERIFICATION_METHODS: readonly SpherificationMethod[] = [
  {
    id: 'direct',
    base: [
      { key: 'alginate', percent: { min: 0.5, max: 1, citations: [SPH(8)] }, optional: false },
      { key: 'sodium-citrate', percent: { min: 0.1, max: 0.2, citations: [SPH(8)] }, optional: true },
      { key: 'xanthan', percent: { min: 0, max: 0.3, citations: [SPH(8)] }, optional: true },
    ],
    bath: [
      { key: 'calcium-chloride', percent: one(0.5, [SPH(8)]), optional: false },
    ],
    // A direta não aceita nada disso, e por isso o molho de parmesão do próprio
    // curso é feito pela reversa: leite e queijo são cálcio puro.
    limitKeys: ['fat', 'dairy', 'alcohol', 'acid', 'irreversible'],
    citations: [SPH(8)],
  },
  {
    id: 'reverse',
    base: [
      { key: 'gluconolactate', percent: { min: 1, max: 3, citations: [SPH(10)] }, optional: false },
      { key: 'xanthan', percent: { min: 0, max: 0.3, citations: [SPH(10)] }, optional: true },
    ],
    bath: [
      { key: 'alginate', percent: { min: 0.4, max: 0.5, citations: [SPH(10)] }, optional: false },
    ],
    limitKeys: [],
    citations: [SPH(10)],
  },
];

export function getSpherification(id: SpherificationId): SpherificationMethod {
  const method = SPHERIFICATION_METHODS.find((item) => item.id === id);
  if (!method) throw new Error(`Técnica desconhecida: ${id}`);
  return method;
}

/** Volume de banho que a tela assume por padrão. */
export const DEFAULT_BATH_GRAMS = 1000;

/**
 * Quanto tempo a esfera de esferificação direta leva para gelificar até o
 * centro. Não é prazo de validade: é o fim da janela em que ela ainda tem
 * miolo líquido.
 */
export const DIRECT_SETS_THROUGH_MINUTES = 30;

/** Teto de álcool da esferificação direta, em graus. */
export const DIRECT_ALCOHOL_LIMIT = 30;

/** O mecanismo, que continua sendo do McGee. */
export const SPHERIFICATION_CITATIONS = [
  cite('mcgee-ofc', 'cap. 11, "Carrageenan, Alginates, Gellan"'),
  SPH(8),
  SPH(10),
];

/**
 * As duas receitas de caviar do curso, que servem de caso-verdade do alginato.
 * Caem em 0,489% e 0,495% — um fio abaixo do piso de 0,5% que o próprio curso
 * declara, o que mostra onde a chef trabalha dentro da faixa que publica.
 */
export const CAVIAR_RECIPES = [
  { id: 'apple', baseGrams: 450, alginateGrams: 2.2 },
  { id: 'raspberry', baseGrams: 465, alginateGrams: 2.3 },
] as const;

export const CAVIAR_CITATIONS = [
  cite('scoolinary-spherification', 'Basic — Recipe book, slides 6 e 7'),
];
