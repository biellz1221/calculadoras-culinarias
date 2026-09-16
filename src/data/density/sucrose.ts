import { cite } from '../citations';

/**
 * Peso de calda de sacarose por galão americano: NBS Circular 457, Tabela 2.
 *
 * "Weights per United States gallon of sugar (sucrose) solutions at different
 * temperatures", calculada das densidades de Plato (p. 27). Cada célula é
 * publicada duas vezes, em libra e em grama, e as duas formas ficam aqui porque
 * é a redundância que confere a transcrição: o PDF é digitalização com OCR, e
 * todo número saiu da imagem.
 *
 * O peso é **no ar**, como numa balança. Para voltar à densidade verdadeira a
 * circular declara o ar que usou (ver `NBS_AIR_DENSITY`).
 */

/** Temperaturas das colunas, em °C. */
export const SUCROSE_CELSIUS = [10, 15, 20, 25, 30] as const;

/** Teores das linhas, em °Brix (sacarose por massa, %). */
export const SUCROSE_BRIX = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
] as const;

/** `[libras, gramas]` por galão, no ar. Linha = Brix, coluna = temperatura. */
export const SUCROSE_WEIGHTS: readonly (readonly (readonly [number, number])[])[] = [
  [[8.334, 3780], [8.329, 3778], [8.322, 3775], [8.312, 3770], [8.301, 3765]],
  [[8.5, 3856], [8.494, 3853], [8.485, 3849], [8.475, 3844], [8.463, 3839]],
  [[8.672, 3933], [8.664, 3930], [8.655, 3926], [8.644, 3921], [8.631, 3915]],
  [[8.849, 4014], [8.841, 4010], [8.83, 4005], [8.818, 4000], [8.805, 3994]],
  [[9.034, 4098], [9.023, 4093], [9.012, 4088], [8.999, 4082], [8.985, 4075]],
  [[9.225, 4184], [9.213, 4179], [9.201, 4173], [9.187, 4167], [9.171, 4160]],
  [[9.423, 4274], [9.41, 4268], [9.396, 4262], [9.381, 4255], [9.365, 4248]],
  [[9.628, 4367], [9.614, 4361], [9.599, 4354], [9.583, 4347], [9.566, 4339]],
  [[9.84, 4464], [9.825, 4457], [9.809, 4449], [9.792, 4442], [9.774, 4433]],
  [[10.06, 4563], [10.044, 4556], [10.027, 4548], [10.009, 4540], [9.99, 4531]],
  [[10.288, 4667], [10.271, 4659], [10.252, 4650], [10.234, 4642], [10.214, 4633]],
  [[10.523, 4773], [10.505, 4765], [10.486, 4756], [10.466, 4747], [10.446, 4738]],
  [[10.767, 4884], [10.747, 4875], [10.727, 4866], [10.707, 4856], [10.685, 4847]],
  [[11.018, 4998], [10.997, 4988], [10.977, 4979], [10.955, 4969], [10.933, 4959]],
  [[11.277, 5115], [11.256, 5105], [11.234, 5096], [11.212, 5086], [11.189, 5075]],
  [[11.544, 5236], [11.522, 5226], [11.499, 5216], [11.477, 5206], [11.453, 5195]],
  [[11.818, 5361], [11.796, 5351], [11.773, 5340], [11.749, 5329], [11.725, 5319]],
  [[12.101, 5489], [12.078, 5478], [12.054, 5467], [12.03, 5457], [12.005, 5445]],
  [[12.391, 5620], [12.367, 5610], [12.342, 5598], [12.318, 5587], [12.293, 5576]],
  // A 15 °C a circular imprime 12.644 lb ao lado de 5,744 g. As duas não
  // fecham (12,644 lb são 5.735 g), e é a libra que está errada: a coluna de
  // gramas é lisa, e a linha em libras pularia só 0,005 de 15 para 20 °C, onde
  // todas as outras pulam ~0,025. Conferido a 500 dpi: é o que está impresso,
  // não defeito da digitalização. O motor usa a grama; a libra fica como a fonte
  // publicou, e o teste da redundância nomeia esta célula como exceção.
  [[12.688, 5755], [12.644, 5744], [12.639, 5733], [12.613, 5721], [12.587, 5709]],
];

/**
 * Células impressas em itálico, que a circular declara extrapoladas: Plato só
 * mediu acima de 70% a 15 e a 20 °C, "and the values obtained by extrapolation
 * are given in italics" (p. 27). A 10, 25 e 30 °C, de 75 a 95 °Brix.
 */
export function isExtrapolatedCell(brix: number, celsius: number): boolean {
  return brix >= 75 && (celsius === 10 || celsius === 25 || celsius === 30);
}

/**
 * Densidade do ar usada no cálculo das tabelas, em g/mL: "the density of air
 * (at 20° C, and barometer reading 760 mm of mercury) was taken as 0.0012"
 * (p. 28).
 *
 * Somada ao peso no ar por mililitro, devolve a densidade verdadeira. Fica de
 * fora o empuxo sobre os pesos da balança, que a circular não declara: é da
 * ordem de 0,014%, abaixo do arredondamento do grama impresso.
 */
export const NBS_AIR_DENSITY = 0.0012;

export const SUCROSE_TABLE_CITATIONS = [cite('nbs-457', 27)];
export const SUCROSE_AIR_CITATIONS = [cite('nbs-457', 28)];
