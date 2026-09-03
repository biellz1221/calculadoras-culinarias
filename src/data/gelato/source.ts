/**
 * Procedência dos dados de gelato.
 *
 * Diferente das demais calculadoras do site, os números daqui **não vêm de um
 * livro da estante**: vêm da planilha de um curso de gelato. Por isso não têm
 * `BookId` nem localizador de página/capítulo — a citação precisa dizer que a
 * fonte é uma planilha de curso, e não uma obra publicada.
 *
 * O que a planilha fornece:
 * - aba "Tabela de ingredientes": composição, POD, PAC, proteína e custo/kg dos
 *   164 ingredientes (→ ./ingredients.ts);
 * - bloco S4:AA22 da mesma aba: faixas de tolerância dos 5 tipos de base
 *   (→ ./recipe-types.ts).
 *
 * Fora de escopo: a aba "Conversor Custo K|G" (markup, taxa de cartão, rateio de
 * custo fixo) é precificação, não balanceamento, e não foi portada.
 */

import { cite, type Citation } from '@/data/citations';

export const GELATO_SOURCE = {
  kind: 'course-spreadsheet',
  title: 'Planilha gelato do Curso 4.0',
  file: 'Planilha gelato do Curso - 4.0 (2).xlsx',
  sheet: 'Tabela de ingredientes',
  note: 'Composição, POD, PAC, proteína e custo dos 164 ingredientes e as faixas dos 5 tipos de base.',
} as const;

/**
 * Citações da calculadora, endereçadas por aba/bloco da planilha.
 *
 * A obra está cadastrada com `locator: 'chapter'` justamente porque planilha
 * não tem página: o localizador honesto aqui é o nome da aba.
 */
export const GELATO_CITATIONS = {
  ingredients: cite('gelato-course', 'Tabela de ingredientes'),
  ranges: cite('gelato-course', 'Parâmetros de tolerância (bloco S4:AA22)'),
  reference: cite('gelato-course', 'Gelato de Leite (receita de conferência)'),
} as const satisfies Record<string, Citation>;
