import { cite, type Citation } from '../citations';
import type { Agent, AgentId, GelatinGrade, TextureId } from './types';

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
    },
    gels: true,
    needsBoil: true,
    holdsToCelsius: 85,
    citations: [GELS, ONION],
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
    citations: [GRAVY],
  },
  {
    // 0,65 g de iota para os 530 g de líquido da panna cotta vegetariana.
    id: 'iota',
    doses: { set: one(0.65 / 530 * 100, [PANNA]) },
    gels: true,
    needsBoil: false,
    pairedWith: 'kappa',
    citations: [PANNA],
  },
  {
    // 0,5 g de kappa para os mesmos 530 g.
    id: 'kappa',
    doses: { set: one(0.5 / 530 * 100, [PANNA]) },
    gels: true,
    needsBoil: false,
    pairedWith: 'iota',
    citations: [PANNA],
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
  'fluid-gel',
  'puree',
  'set',
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

/** Esferificação: o mecanismo tem fonte, a dose não. Ver pesquisa §6. */
export const SPHERIFICATION_CITATIONS = [
  cite('mcgee-ofc', 'cap. 11, "Carrageenan, Alginates, Gellan"'),
];
