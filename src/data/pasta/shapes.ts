import { cite, type Citation } from '../citations';
import type { PastaShape } from './types';

/**
 * Guia de formatos: onde parar de abrir a massa e para que serve cada corte
 * (docs/research/massas.md, seção 2.4).
 *
 * O `setting` é o da máquina do Zielonka, em que 0 é o cilindro mais aberto e
 * 8 o mais fechado; ele mesmo avisa que máquinas com numeração invertida pedem
 * o número contrário. **Nenhuma das duas fontes publica espessura em
 * milímetros** — por isso a coluna de espessura é descritiva. Inventar "0,8 mm"
 * aqui seria dar ao leitor uma precisão que o livro não tem.
 *
 * `divergent` marca os dois formatos em que os autores não param no mesmo
 * ponto: a lasanha e a chitarra/tonnarelli.
 */

const Z = (section: string): Citation => cite('zielonka', section);
const H = (section: string): Citation => cite('hazan', section);

const ROLLING = '"Rolling & Shaping Pasta"';
const PASTA = '"Pasta"';

export const PASTA_SHAPES: readonly PastaShape[] = [
  {
    id: 'tagliatelle',
    kind: 'ribbon',
    setting: 7,
    citations: [
      Z(`${ROLLING} — Rolling Out Pasta Dough`),
      H(`${PASTA} — Special Noodle Cuts, Tagliatelle`),
    ],
  },
  {
    id: 'pappardelle',
    kind: 'ribbon',
    setting: 7,
    citations: [
      Z('"Pappardelle"'),
      H(`${PASTA} — Special Noodle Cuts, Pappardelle`),
    ],
  },
  {
    id: 'chitarra',
    kind: 'ribbon',
    setting: 7,
    altSetting: 6,
    divergent: true,
    citations: [Z('"Chitarra"'), H(`${PASTA} — Special Noodle Cuts, Tonnarelli`)],
  },
  {
    id: 'garganelli',
    kind: 'ribbon',
    setting: 7,
    citations: [
      Z(`${ROLLING} — Rolling Out Pasta Dough`),
      H(`${PASTA} — Stuffed and Shaped Pasta, Garganelli`),
    ],
  },
  {
    id: 'ravioli',
    kind: 'filled',
    setting: 8,
    citations: [
      Z('"Ravioli"'),
      H(`${PASTA} — Stuffed and Shaped Pasta, Tortelloni, Tortelli, Ravioli`),
    ],
  },
  {
    id: 'tortellini',
    kind: 'filled',
    setting: 8,
    citations: [
      Z('"Tortellini"'),
      H(`${PASTA} — Stuffed and Shaped Pasta, Tortellini`),
    ],
  },
  {
    id: 'lasagne',
    kind: 'sheet',
    setting: 7,
    divergent: true,
    citations: [Z('"Lasagne"'), H(`${PASTA} — Lasagne`)],
  },
  {
    id: 'maltagliati',
    kind: 'offcut',
    citations: [Z('"Maltagliati"'), H(`${PASTA} — Soup Pasta, Maltagliati`)],
  },
];

export function getPastaShape(id: string): PastaShape | undefined {
  return PASTA_SHAPES.find((shape) => shape.id === id);
}

/** Formatos em que Zielonka e Hazan param a laminação em pontos diferentes. */
export const DIVERGENT_SHAPES: readonly PastaShape[] = PASTA_SHAPES.filter(
  (shape) => shape.divergent === true,
);
