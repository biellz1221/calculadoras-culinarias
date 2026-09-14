import { cite } from '../citations';
import type { ChocolateKind, GanacheTexture } from './types';

/**
 * As quatro texturas do Wybauw, e o que sustenta a leitura delas.
 *
 * O livro publica a mesma tabela duas vezes, em razão e em porcentagem, e as
 * duas se conferem: cada linha de porcentagem soma 100 exatos e reproduz a razão
 * correspondente. Num PDF com ruído de extração, essa redundância é o que dá
 * confiança na transcrição — está documentada em docs/research/ganache.md §3.
 *
 * Guardamos a **razão**, não a porcentagem: a porcentagem publicada é
 * arredondada (100:110 são 47,6 % e o livro imprime 47) e a razão não.
 */

const W = (section: string) => cite('wybauw', section);
const TABLE = W('"Balancing ganache recipes" — tabela de proporções médias');

const one = (value: number) => ({ min: value, max: value });

export const GANACHE_TEXTURES: readonly GanacheTexture[] = [
  // "Viscous ganache (truffle balls): 100 / 110". Única sem manteiga.
  {
    id: 'truffle',
    chocolate: one(1.1),
    butter: one(0),
    citations: [TABLE],
  },
  // "Soft (in moulded pralines): 100 / 120 / 14".
  {
    id: 'moulded',
    chocolate: one(1.2),
    butter: one(0.14),
    citations: [TABLE],
  },
  // "Pipe (subsequently cover): 100 / 120 / 25".
  {
    id: 'piped',
    chocolate: one(1.2),
    butter: one(0.25),
    citations: [TABLE],
  },
  // "Cut pralines: 100 / 130 to 180 / 24 to 30". A faixa é da fonte, e a
  // porcentagem que ela publica ao lado corresponde ao pé dela.
  {
    id: 'cut',
    chocolate: { min: 1.3, max: 1.8 },
    butter: { min: 0.24, max: 0.3 },
    citations: [TABLE],
  },
];

export function getTexture(id: string): GanacheTexture | undefined {
  return GANACHE_TEXTURES.find((texture) => texture.id === id);
}

export const DEFAULT_TEXTURE_ID = 'moulded';

export const CHOCOLATE_KINDS: readonly ChocolateKind[] = ['dark', 'milk', 'white'];

/**
 * Manteiga de cacau extra no chocolate branco.
 *
 * "In white chocolate, which contains approximately 8% milk fat of 36% total fat
 * content, typically 2% extra cocoa butter must be added to the recipe for the
 * same texture."
 */
export const WHITE_EXTRA_COCOA_BUTTER = 0.02;

export const WHITE_CITATIONS = [W('"Balancing ganache recipes"')];

/**
 * A faixa de couverture a que a tabela se refere.
 *
 * Amargo com 36 a 38 % de manteiga de cacau, ao leite com 36 a 37 % de gordura
 * total. Fora disso, o próprio autor avisa: "a completely different result will
 * be reached". A página diz isso; não há correção publicada para aplicar.
 */
export const COUVERTURE_RANGE = { min: 0.36, max: 0.38 };

/**
 * Teor de água dos ingredientes, publicado no livro.
 *
 * É o que permite somar a água da receita sem inventar nada — e água é a
 * alavanca que o próprio Wybauw indica para melhorar a validade.
 */
export const WATER_CONTENT = { cream: 0.6, butter: 0.17 };

export const WATER_CITATIONS = [W('"Improved shelf life in practice"')];

/**
 * Atividade de água medida, por ingrediente.
 *
 * A tabela entra na página como está publicada. O Aw da receita **não é
 * calculado**: não é média ponderada, e o próprio livro lista os fatores que
 * entram nele. Ver docs/research/ganache.md §4.
 */
export const WATER_ACTIVITY = [
  { id: 'cream', aw: 1.0 },
  { id: 'butter', aw: 0.985 },
  { id: 'condensed-milk', aw: 0.99 },
  { id: 'sweetened-condensed-milk', aw: 0.84 },
  { id: 'fondant', aw: 0.8 },
  { id: 'marzipan', aw: 0.72 },
  { id: 'chocolate', aw: 0.35 },
] as const;

export const AW_CITATIONS = [
  W('"Improved shelf life in practice" — Average water activity for frequently used ingredients'),
];

/**
 * O que cresce em cada faixa de Aw, e o prazo que o livro declara.
 *
 * "products with high Aw values (0.85 => 1), such as many ganache recipes, have
 * a shelf life of only 3 weeks."
 */
export const SHELF_LIFE_WEEKS = 3;

export const SHELF_LIFE_CITATIONS = [W('"Improved shelf life in practice"')];

/** "Freezing never extends shelf life." */
export const FREEZING_CITATIONS = [W('"Freezing correctly"')];
