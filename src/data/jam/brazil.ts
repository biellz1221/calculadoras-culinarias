import { cite } from '../citations';
import type { EmbrapaAcidity, EmbrapaFruitRow, EmbrapaPectin } from './types';

/**
 * O que as duas obras da Embrapa trazem para a calculadora de geleias.
 *
 * Consolidação em docs/research/geleias.md, Parte II. Três coisas que o resto da
 * estante não dava:
 *
 * 1. **Fruta brasileira.** A Tabela 1 do Doc 29 classifica 38 frutas por pectina
 *    e acidez, e é o que permite goiaba, jabuticaba e maracujá entrarem sem
 *    receita pesada — porque receita pesada delas não existe em obra nenhuma
 *    daqui.
 * 2. **A régua legal.** A definição brasileira de geleia comum e extra, em
 *    partes de fruta para partes de açúcar.
 * 3. **Dose de pectina em pó e janela de pH**, as duas pendências que a §9 da
 *    pesquisa listava como sem fonte.
 *
 * As duas obras são citadas por seção: o PDF do Doc 29 diagrama duas páginas
 * impressas por página de arquivo e não traz numeração na camada de texto.
 */

const D29 = (section: string) => cite('embrapa-geleias', section);
const D138 = (section: string) => cite('embrapa-geleias-artesanal', section);

function row(
  id: string,
  pectin: EmbrapaPectin,
  acidity: EmbrapaAcidity,
  viaJackix: boolean,
): EmbrapaFruitRow {
  return { id, pectin, acidity, viaJackix };
}

/**
 * A Tabela 1, inteira, na ordem em que a fonte imprime.
 *
 * Extraída com `pdftotext -layout`, com cada marca atribuída à coluna pelo
 * deslocamento do cabeçalho — por programa, não a olho —, e depois conferida
 * contra a página renderizada como imagem, linha a linha. As duas leituras batem
 * nas 38. Duas travas ajudam: toda linha tem exatamente uma marca de pectina e
 * uma de acidez, e nenhuma ficou órfã.
 *
 * `viaJackix` é o asterisco da fonte: 30 das 38 linhas são de JACKIX (1988), e
 * a Embrapa reproduz. Citação de terceira mão se declara.
 */
export const EMBRAPA_TABLE: readonly EmbrapaFruitRow[] = [
  // Abacaxi
  row('pineapple', 'poor', 'high', true),
  // Acerola
  row('acerola', 'poor', 'medium', false),
  // Ameixa-do-japão (amarela ou vermelha)
  row('japanese-plum', 'rich', 'high', true),
  // Araçá (roxo)
  row('araca', 'rich', 'high', false),
  // Banana (d’água ou nanica)
  row('banana', 'medium', 'low', false),
  // Cajá manga
  row('caja-manga', 'poor', 'high', false),
  // Caju
  row('cashew-apple', 'poor', 'medium', true),
  // Caqui
  row('persimmon', 'poor', 'low', true),
  // Carambola (ácida)
  row('starfruit-sour', 'poor', 'medium', true),
  // Carambola (doce)
  row('starfruit-sweet', 'poor', 'low', true),
  // Figo maduro
  row('fig-ripe', 'poor', 'low', true),
  // Figo verde e de vez
  row('fig-unripe', 'rich', 'low', true),
  // Fruta-do-conde
  row('sugar-apple', 'poor', 'medium', false),
  // Goiaba (vermelha madura e de vez)
  row('guava', 'rich', 'medium', true),
  // Groselha
  row('currant', 'rich', 'high', true),
  // Jabuticaba (comum)
  row('jaboticaba-common', 'poor', 'medium', true),
  // Jabuticaba (ponhema)
  row('jaboticaba-ponhema', 'poor', 'high', true),
  // Jabuticaba(sabará),com casca
  row('jaboticaba-sabara-skin', 'medium', 'high', true),
  // Jabuticaba (sabará), sem casca
  row('jaboticaba-sabara-peeled', 'poor', 'low', true),
  // Laranja (baía e pêra) - fruta inteira
  row('orange', 'rich', 'high', true),
  // Limão (cidra e siciliano)
  row('lemon', 'rich', 'high', true),
  // Maçã (ácida, argentina)
  row('apple-tart', 'medium', 'high', true),
  // Maçã (ohio beauty e são joão - amarela, de vez e madura)
  row('apple-sweet', 'rich', 'medium', true),
  // Mamão
  row('papaya', 'poor', 'low', true),
  // Manga (espada)
  row('mango-espada', 'medium', 'high', true),
  // Manga (espadão e santa alexandrina)
  row('mango-espadao', 'rich', 'high', true),
  // Maracujá (amarelo e roxo) - suco
  row('passionfruit', 'poor', 'high', false),
  // Marmelo
  row('quince', 'rich', 'medium', true),
  // Morango
  row('strawberry', 'poor', 'medium', true),
  // Nêspera
  row('loquat', 'medium', 'high', true),
  // Pêra d’água madura
  row('pear-ripe', 'poor', 'low', true),
  // Pêssego amarelo maduro
  row('peach-ripe', 'poor', 'low', true),
  // Pêssego verde
  row('peach-green', 'rich', 'high', false),
  // Pitanga
  row('pitanga', 'medium', 'high', true),
  // Romã
  row('pomegranate', 'poor', 'medium', false),
  // Uva (ananás, catawba e empire state)
  row('grape-american', 'poor', 'high', true),
  // Uva (isabel e niágara)
  row('grape-isabel', 'medium', 'high', true),
  // Uvaia
  row('uvaia', 'poor', 'high', true),
];

export const EMBRAPA_TABLE_CITATIONS = [
  D29('Tabela 1 — classificação de algumas frutas segundo teores de pectina e acidez'),
];

/** A linha de origem, quando a fruta está na tabela. */
export function getEmbrapaRow(id: string | undefined): EmbrapaFruitRow | undefined {
  if (!id) return undefined;
  return EMBRAPA_TABLE.find((entry) => entry.id === id);
}

/**
 * A definição legal brasileira, transcrita do Doc 29, §1.
 *
 * "Comum: quando preparadas numa proporção de quarenta partes de frutas frescas
 * ou seu equivalente para sessenta partes de açúcar. As geléias de marmelo,
 * laranja e maçã poderão ser preparadas com trinta e cinco partes de frutas
 * frescas [...] e sessenta e cinco partes de açúcar. Extra: quando preparadas
 * numa proporção de cinqüenta partes de frutas frescas ou seu equivalente para
 * cinqüenta partes de açúcar."
 *
 * Guardado em partes, como a norma escreve, e não já dividido: é o mesmo motivo
 * de as receitas de Saunders ficarem em onças. A razão entre duas massas não tem
 * unidade, e o teste consegue conferir a transcrição contra o texto citado.
 */
export const LEGAL_PARTS = {
  extra: { fruit: 50, sugar: 50 },
  common: { fruit: 40, sugar: 60 },
  /** Marmelo, laranja e maçã: exceção escrita na própria definição. */
  commonException: { fruit: 35, sugar: 65 },
} as const;

export const LEGAL_CITATIONS = [D29('§1 Introdução — classificação legal de geléia comum e extra')];

/** Açúcar sobre o peso da fruta, que é a base desta calculadora. */
export function legalSugarRatio(parts: { fruit: number; sugar: number }): number {
  return parts.sugar / parts.fruit;
}

/**
 * Sólidos solúveis totais mínimos da norma: 62% na comum, 65% na extra.
 *
 * O 65% da extra é exatamente o 65% de açúcar que Ferber dá como ponto de
 * conservação, por caminho independente — norma brasileira de 1988 e confeiteira
 * alsaciana. É a segunda fonte que a conta de evaporação não tinha.
 */
export const LEGAL_SOLUBLE_SOLIDS = { common: 0.62, extra: 0.65 } as const;

/**
 * Pectina em pó: 0,5% a 1,5% **em relação ao açúcar** da formulação.
 *
 * "Normalmente, essa quantidade é calculada em 0,5% a 1,5% de pectina em relação
 * à quantidade de açúcar usado na formulação. Esse teor pode variar dependendo
 * de a fruta apresentar maior ou menor quantidade presente naturalmente."
 *
 * A base é o açúcar, e é o detalhe que some numa transcrição apressada. O
 * documento se confere sozinho: dez das onze formulações pesadas que ele publica
 * caem dentro da própria faixa, e a décima primeira erra por 0,05 ponto.
 *
 * Fica como faixa. Onde cair dentro dela depende da pectina própria da fruta, e
 * a fonte não converte isso em número — a classificação da Tabela 1 aparece ao
 * lado para a pessoa decidir, e o site não inventa o ponto do meio.
 */
export const PECTIN_DOSE_OVER_SUGAR: readonly [number, number] = [0.005, 0.015];

export const PECTIN_DOSE_CITATIONS = [
  D138('§ Pectina — quantidade a ser acrescentada'),
  D29('§1 Introdução — "geralmente 1% é suficiente para produzir uma geléia firme"'),
];

/**
 * A janela de pH da gelificação, pendência declarada até 2026-09-14.
 *
 * Doc 29: "O gel se forma apenas em pH ao redor de 3. Além de pH 3,4 não ocorre
 * geleificação" e "para se conseguir uma adequada geleificação, o pH final deve
 * estar entre 3,0 a 3,2".
 *
 * Doc 138, nas formulações de mirtilo e de amora-preta: "antes do preparo, medir
 * o pH da polpa: se estiver entre 3,0 e 3,3, não há necessidade de adicionar o
 * ácido cítrico". É regra de bancada, e é o que a tela mostra no lugar de uma
 * dose de limão que nenhuma das duas publica.
 */
export const PH_WINDOW = {
  targetMin: 3.0,
  targetMax: 3.2,
  /** Acima disto não gelifica, diz o Doc 29. */
  noGelAbove: 3.4,
  /** Faixa em que o Doc 138 dispensa acidificar. */
  noAcidMin: 3.0,
  noAcidMax: 3.3,
} as const;

export const PH_CITATIONS = [
  D29('§1 Introdução — janela de pH da geleificação'),
  D29('§2.7 Adição de acidulantes — pH final de 3,0 a 3,2'),
];

export const PH_FIELD_RULE_CITATIONS = [
  D138('§ Formulação — geleia de mirtilo e geleia de amora-preta'),
];

/**
 * Acidez total da geleia pronta, e o limiar da sinérese.
 *
 * "A acidez total da geléia deve estar ao redor de 0,5-0,8, pois, acima de 1%,
 * ocorre sinérese, ou seja, exsudação do líquido da geléia." Dá número ao
 * verbete de sinérese, que até agora só tinha a causa qualitativa do NCHFP.
 */
export const TOTAL_ACIDITY = { min: 0.005, max: 0.008, syneresisAbove: 0.01 } as const;

export const TOTAL_ACIDITY_CITATIONS = [
  D29('§1 Introdução — acidez total e sinérese'),
];

/**
 * A segunda tabela de ponto por altitude, e a única em metros.
 *
 * O Doc 138 converte temperatura de ebulição em °Brix por altitude. Não é a
 * mesma grandeza que a tabela do NCHFP — esta diz quando a calda chega a tal
 * concentração, aquela diz onde o gel se forma —, e é justamente por isso que
 * elas caírem a menos de sete décimos de grau uma da outra vale alguma coisa.
 *
 * A Embrapa credita a terceiro: "Extraído de Curso de processamento de frutas."
 * Terceira mão, e a citação diz.
 *
 * Para na casa dos 2.000 m. O site não extrapola: acima disso mostra só a tabela
 * americana, que vai mais alto.
 */
export const EMBRAPA_BRIX_TABLE = {
  altitudes: [0, 500, 1000, 1500, 2000],
  rows: [
    { brix: 50, celsius: [102.2, 100.5, 98.8, 97.1, 95.4] },
    { brix: 60, celsius: [103.7, 102.2, 100.3, 98.6, 96.9] },
    { brix: 62, celsius: [104.1, 102.4, 100.7, 99.0, 97.3] },
    { brix: 64, celsius: [104.6, 102.9, 101.2, 99.5, 97.8] },
    { brix: 66, celsius: [105.1, 103.4, 101.7, 100.0, 98.3] },
    { brix: 68, celsius: [105.7, 104.0, 102.3, 100.6, 98.9] },
    { brix: 70, celsius: [106.4, 104.7, 103.0, 101.3, 99.6] },
  ],
} as const;

export const EMBRAPA_BRIX_CITATIONS = [
  D138('§ Determinação da temperatura de ebulição — Tabela 1, conversão em °Brix'),
];

/** Grau de maior altitude que a tabela brasileira cobre. */
export const EMBRAPA_BRIX_MAX_METERS = 2000;
