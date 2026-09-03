import { cite, type Citation } from '../citations';
import type { PastaDish } from './types';

/**
 * Rendimento de prato montado (docs/research/massas.md, seção 4.2).
 *
 * Lasanha e massa recheada não seguem os gramas por pessoa da massa em fita:
 * a lasanha divide a mesma folha em camadas e o tortellini se conta em peças.
 * Por isso os pratos ficam à parte dos presets de massa, cada um com o
 * rendimento que a fonte publica.
 */

const Z = (section: string): Citation => cite('zielonka', section);
const H = (section: string): Citation => cite('hazan', section);

export const PASTA_DISHES: readonly PastaDish[] = [
  {
    id: 'lasagne-zielonka',
    presetId: 'classica',
    doughGrams: 600,
    servings: [4, 6],
    citations: [Z('"Lasagne"')],
    noteKey: 'lasagneZielonka',
  },
  {
    id: 'lasagne-hazan',
    presetId: 'hazan-verde',
    doughGrams: 450,
    servings: [6, 6],
    citations: [
      H('"Pasta" — Baked Green Lasagne with Meat Sauce, Bologna Style'),
    ],
    noteKey: 'lasagneHazan',
  },
  {
    id: 'tortellini-hazan',
    presetId: 'hazan-tortellini',
    pieces: 100,
    servings: [6, 6],
    citations: [
      H('"Pasta" — Tortellini with Meat and Cheese Filling, Recommended sauce'),
    ],
    noteKey: 'tortelliniHazan',
  },
];

/** Como a massa recheada é servida: em caldo ou com molho. */
export type TortelliniService = 'brodo' | 'sauce';

/**
 * Peças por pessoa. Em caldo são ~17 (os ~100 tortellini que a Hazan serve a
 * 6); com molho ela pede duas dúzias por pessoa.
 */
export const TORTELLINI_PIECES_PER_SERVING: Record<TortelliniService, number> = {
  brodo: 17,
  sauce: 24,
};

export const TORTELLINI_CITATIONS: readonly Citation[] = [
  H('"Pasta" — Tortellini with Meat and Cheese Filling, Recommended sauce'),
];
