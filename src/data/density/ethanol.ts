import { cite } from '../citations';

/**
 * Densidade de mistura de água e etanol: a fórmula da OIML R 22.
 *
 * O documento imprime tabelas, mas diz de onde elas vêm — "Tables I and IIIa
 * are calculated directly from the general formula" (p. 5). Usar a fórmula,
 * então, é usar o que gerou a tabela, e não uma aproximação dela.
 *
 * Os coeficientes estão na p. 13 e foram transcritos da imagem: o PDF oficial é
 * digitalização sem camada de texto. O documento usa vírgula decimal e espaço
 * como separador de grupo (`9,982 012 300 · 10²` é 998,2012300). A transcrição
 * foi conferida contra a Tabela I do próprio documento, contra a tabela da OIV
 * (outro documento, em teor por volume) e contra dois fatos que não saem de
 * tabela nenhuma: a densidade do etanol puro e o máximo da água perto de 4 °C.
 * Detalhes em docs/research/densidade.md, Parte IV-A.
 *
 * Unidades da fonte: kg/m³, fração mássica, °C.
 */

/** `A₁…A₁₂`, em kg/m³. O índice 0 fica vazio para casar com a notação da fonte. */
export const OIML_A: readonly number[] = [
  0, 998.20123, -192.9769495, 389.1238958, -1668.103923, 13522.15441, -88292.78388,
  306287.4042, -613838.1234, 747017.2998, -547846.1354, 223446.0334, -39032.85426,
];

/** `B₁…B₆`, em kg/(m³·°Cᵏ). */
export const OIML_B: readonly number[] = [
  0, -0.20618513, -5.2682542e-3, 3.6130013e-5, -3.8957702e-7, 7.169354e-9,
  -9.9739231e-11,
];

/** `C₁,ₖ…C₅,ₖ`, em kg/(m³·°Cⁱ). Linha `i` é a potência da temperatura. */
export const OIML_C: readonly (readonly number[])[] = [
  [],
  [
    0, 0.1693443461530087, -10.46914743455169, 71.96353469546523, -704.7478054272792,
    3924.090430035045, -12101.64659068747, 22486.46550400788, -26055.62982188164,
    18523.73922069467, -7420.201433430137, 1285.617841998974,
  ],
  [
    0, -0.0119301300505701, 0.2517399633803461, -2.170575700536993, 13.53034988843029,
    -50.29988758547014, 109.635566657757, -142.2753946421155, 108.043594285623,
    -44.14153236817392, 7.442971530188783,
  ],
  [
    0, -6.802995733503803e-4, 1.876837790289664e-2, -0.2002561813734156,
    1.02299296671922, -2.895696483903638, 4.810060584300675, -4.672147440794683,
    2.458043105903461, -0.5411227621436812,
  ],
  [
    0, 4.075376675622027e-6, -8.76305857347111e-6, 6.515031360099368e-6,
    -1.51578483698721e-6,
  ],
  [0, -2.788074354782409e-8, 1.345612883493354e-8],
];

/**
 * Temperatura de referência da fórmula, e a do teor em volume: "the volume of
 * alcohol, measured at 20 °C, contained in the mixture to the total volume of
 * the mixture, measured at the same temperature" (p. 10).
 */
export const OIML_REFERENCE_CELSIUS = 20;

/**
 * Etanol puro a 20 °C, em kg/m³. É a ponte entre teor em massa e teor em
 * volume (p. 5), e a capa traz uma errata só para ele: "read: (≈ 789,24 kg/m³)".
 */
export const ETHANOL_DENSITY_20C = 789.24;

/**
 * Faixa em que o motor responde.
 *
 * A fórmula vale de −20 a +40 °C (p. 5), mas abaixo de zero a mistura pode
 * estar congelada, e o limite depende do teor: a Tabela I só imprime a partir
 * do "minimum permissible value ... corresponding to the freezing of the
 * mixture". Essa curva não foi transcrita. Em vez de responder sobre gelo como
 * se fosse líquido, o motor para em 0 °C — acima disso toda mistura é líquida.
 */
export const OIML_MIN_CELSIUS = 0;
export const OIML_MAX_CELSIUS = 40;

export const OIML_FORMULA_CITATIONS = [cite('oiml-r22', 5), cite('oiml-r22', 13)];
export const ETHANOL_DENSITY_CITATIONS = [cite('oiml-r22', 1), cite('oiml-r22', 5)];
export const ALCOHOLIC_STRENGTH_CITATIONS = [cite('oiml-r22', 5), cite('oiml-r22', 10)];
