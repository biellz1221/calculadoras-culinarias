import { cite } from '../citations';
import type { CureSalt, CuringMethod } from './types';

/**
 * Os sais de cura e os limites, todos lidos na fonte primária.
 *
 * Consolidação em docs/research/cura-carnes.md. Nenhum número aqui saiu de
 * blog, fórum ou memória: são RDC, CFR e livro na estante, com localizador.
 */

export const CURE_SALTS: readonly CureSalt[] = [
  {
    // "Cure #1 is a mixture of 1 oz of sodium nitrite (6.25%) to 1 lb of salt."
    id: 'cure-1',
    nitrite: 0.0625,
    nitrate: 0,
    citations: [
      cite('marianski', 'cap. "Curing and Nitrates"'),
      cite('ruhlman-charcuterie', 'cap. 2, "Salt" — sais de cura'),
    ],
  },
  {
    // "Cure #2 is a mixture of 1 oz of sodium nitrite (6.25%) along with
    // 0.64 oz of sodium Nitrate (4%) to 1 lb of salt."
    id: 'cure-2',
    nitrite: 0.0625,
    nitrate: 0.04,
    citations: [cite('marianski', 'cap. "Curing and Nitrates"')],
  },
  {
    // A régua europeia, e a que mais se parece com a brasileira: o próprio
    // Marianski tabela o Peklosol contra um teto de 150 ppm, não de 156.
    id: 'peklosol',
    nitrite: 0.006,
    nitrate: 0,
    citations: [cite('marianski', 'cap. "Curing and Nitrates"')],
  },
];

export function getCure(id: string): CureSalt | undefined {
  return CURE_SALTS.find((cure) => cure.id === id);
}

export const DEFAULT_CURE_ID = 'cure-1';

/**
 * Piso de nitrito de entrada, em ppm.
 *
 * Política do FSIS: mínimo de 120 ppm de nitrito de entrada em todo produto
 * curado "Keep Refrigerated", a menos que a segurança venha de outro processo
 * (tratamento térmico, pH, controle de umidade). É o número que separa curado
 * de carne salgada com cor bonita, e por isso vira aviso destacado, não
 * sinalização de faixa.
 */
export const MIN_INGOING_PPM = 120;

export const MIN_INGOING_CITATIONS = [
  cite('marianski', 'cap. "Curing and Nitrates" — política de 120 ppm do FSIS'),
];

/**
 * Teto de nitrito de entrada por método, em ppm.
 *
 * Convertidos de 9 CFR 424.21(c): ¼ oz por 100 lb de carne moída dá 156,25 ppm
 * exatos, e 1 oz por 100 lb na cura seca dá 625. Guardamos 156, arredondado
 * para baixo: em calculadora de segurança o arredondamento vai para o lado
 * restritivo, sempre.
 *
 * O teto da cura seca é alto porque ali o sal fica na superfície e boa parte
 * nunca entra na peça — não é licença para dosar mais em massa moída.
 */
export const METHOD_CEILING_PPM: Record<CuringMethod, number> = {
  comminuted: 156,
  dry: 625,
};

export const METHOD_CITATIONS = [cite('fsis-424', '424.21(c), curing agents')];

/**
 * Resíduo máximo, em ppm, expresso como nitrito de sódio.
 *
 * Os dois números que a calculadora mostra lado a lado — e que **não** são
 * comparáveis com os de entrada acima. Resíduo é o que sobra no produto
 * pronto; entrada é o que se pesa. Ver docs/research/cura-carnes.md §4.
 */
export const RESIDUAL_LIMITS = {
  /** Soma de nitrito e nitrato, como nitrito de sódio. IN 211/2023, Anexo. */
  br: {
    ppm: 150,
    citations: [cite('anvisa-in211', 'Anexo, categoria 08.2 — conservadores INS 249 a 252')],
  },
  /** Só nitrito, como nitrito de sódio. */
  us: { ppm: 200, citations: [cite('fsis-424', '424.21(c)')] },
} as const;

/**
 * Como se soma nitrato a nitrito, na moeda da norma brasileira.
 *
 * "O valor de nitrato (NaNO3) obtido dever ser dividido por 1,231 para ter o
 * valor expresso em nitrito (NaNO2). Este valor deve ser somado ao resultado de
 * nitrito […]" — Ofício Circular DIPOA 15/2009, p. 5.
 *
 * O ofício publica as próprias massas molares na linha seguinte, o que deixa
 * conferi-lo contra ele mesmo: 84,99 ÷ 69,00 dá 1,23174, que é o publicado
 * truncado. O fator do potássio não fecha igual — 101,10 ÷ 69,00 dá 1,46522
 * contra os 1,4637 impressos —, e o site usa **o publicado**, não o
 * recalculado. Citar norma é reproduzir o que ela manda fazer; corrigir a
 * aritmética dela seria assinar uma régua que não é a dela. A diferença é de
 * um milésimo e cai para o lado restritivo.
 */
export const NITRATE_TO_NITRITE = {
  /** Nitrato de sódio, o do sal de cura #2. */
  sodium: 1.231,
  /** Nitrato de potássio, o salitre. Entra como referência, não como conta. */
  potassium: 1.4637,
} as const;

/** As massas molares que o próprio ofício imprime, para o teste conferir. */
export const MOLAR_MASSES = {
  sodiumNitrite: 69.0,
  sodiumNitrate: 84.99,
  potassiumNitrate: 101.1,
} as const;

export const CONVERSION_CITATIONS = [
  cite('dipoa-of15', 5),
];

/**
 * Nitrato sozinho tem teto próprio, e ele é o dobro.
 *
 * "[…] ou ainda, 300 ppm de nitrato (de sódio ou de potássio) […]" — mesmo
 * ofício, p. 2. São três tetos e não um: 150 para nitrito, 150 para a
 * combinação, 300 para nitrato sozinho. Todos de **resíduo**.
 */
export const NITRATE_ONLY_RESIDUAL_PPM = 300;

export const NITRATE_ONLY_CITATIONS = [cite('dipoa-of15', 2)];

/**
 * Nitrito de entrada mais nitrato convertido, expresso como nitrito de sódio.
 *
 * **Isto é entrada, e o teto de 150 é de resíduo.** A própria seção do ofício se
 * chama "Cálculo do nitrito residual". O número serve para mostrar em que moeda
 * a norma mede, e não para dizer se um produto está conforme — conformidade só
 * se verifica com análise do produto pronto. A tela diz isso ao lado do número.
 */
export function combinedAsSodiumNitrite(
  nitritePpm: number,
  nitratePpm: number,
): number {
  return nitritePpm + nitratePpm / NITRATE_TO_NITRITE.sodium;
}
