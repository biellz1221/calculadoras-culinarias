import { cite } from '@/data/citations';

/**
 * Ar e densidade: os dois números que a calculadora exibia sem fonte.
 *
 * Consolidação em docs/research/gelato.md. Até 2026-09-14 este era o único
 * canto do site com número sem procedência — a densidade ia para a tela
 * declarada como "valor de trabalho", e a faixa de overrun tinha sido apagada
 * por não ter de onde sair. Os dois livros que resolvem isso estavam na pasta
 * de referências desde 12 de setembro.
 *
 * Eles não dizem a mesma coisa, e é isso que vale: Clarke descreve sorvete
 * industrial e Corvitto descreve gelato artesanal. A página mostra os dois.
 */

const C = (page: number) => cite('clarke', page);
const V = (page: number) => cite('corvitto', page);

/**
 * O alvo de Corvitto: 30% a 40%, com 35% como o valor que ele fixa.
 *
 * "In order to obtain a maximum quality ice-cream, the best overrun percentage
 * is between 30 and 40%. We place it around 35%."
 *
 * Não é limite de máquina, é escolha de qualidade: ar demais, diz ele, deixa o
 * gelato com aspecto de mousse e "sensação de vazio na boca".
 */
export const GELATO_OVERRUN = { min: 0.3, max: 0.4, target: 0.35 } as const;

export const GELATO_OVERRUN_CITATIONS = [V(44)];

/**
 * A faixa industrial de Clarke, para contraste.
 *
 * "Four ice cream samples that are identical except that they contain different
 * volume fractions of air, from 17 to 50%, i.e. 20% to 100% overrun."
 *
 * `technicalMax` é outro tipo de número: o limite em que a estrutura ainda se
 * sustenta, não um alvo. "Overruns up to about 120%."
 */
export const INDUSTRIAL_OVERRUN = { min: 0.2, max: 1.0, technicalMax: 1.2 } as const;

/** Sem gordura e proteína — sorbetto — passar de 60% é difícil. Teto, não alvo. */
export const LOW_FAT_OVERRUN_CEILING = 0.6;

export const INDUSTRIAL_OVERRUN_CITATIONS = [C(153), C(73)];

/**
 * Densidade da calda: 1,10 g/mL, de Clarke, p. 81.
 *
 * "One litre of a typical ice cream mix weighs 1.1 kg."
 *
 * Era o valor de trabalho que a calculadora já usava. Bateu com o livro — o
 * palpite declarado estava certo, e agora tem página.
 */
export const MIX_DENSITY = 1.1;

export const MIX_DENSITY_CITATIONS = [C(81)];

/**
 * A densidade que o Corvitto usa sem declarar.
 *
 * Ele publica "mix weight = 1000 g, ice-cream weight = 740 g" e conclui que um
 * litro de gelato pesa 740 g. O salto só fecha com um litro de mix a 1000 g.
 * Guardado aqui porque é o outro lado da divergência, e porque o peso de 740 g
 * por litro é afirmação dele, essa sim explícita.
 */
export const CORVITTO_MIX_DENSITY = 1.0;
export const CORVITTO_LITRE_GRAMS = 740;

export const CORVITTO_LITRE_CITATIONS = [V(44)];

/**
 * A água cresce cerca de 8% ao congelar, então parte do "ar" medido não é ar.
 *
 * Clarke, p. 81: 100% de overrun nominal dá 105% real. O próprio livro diz que
 * o efeito "is often ignored". Fica como nota na tela e **não** entra na conta:
 * corrigir por isso exigiria o teor de gelo da receita na temperatura de
 * serviço, que a planilha do curso não dá.
 */
export const ICE_EXPANSION = 0.08;
export const ICE_EXPANSION_CITATIONS = [C(81)];

/**
 * O overrun a partir de duas pesagens do mesmo recipiente.
 *
 * "Divide the weight of the mix by the weight of the ice-cream. The two decimal
 * figures will be the overrun." — Corvitto, p. 44
 *
 * É a mesma equação que Clarke escreve pelas densidades (p. 80): pesar o mesmo
 * copo duas vezes é medir densidade com o volume cancelando. Há teste que
 * confere as duas formas uma contra a outra.
 */
export function overrunFromWeights(mixGrams: number, gelatoGrams: number): number {
  if (gelatoGrams <= 0) return 0;
  return mixGrams / gelatoGrams - 1;
}

/** A mesma conta pelo lado de Clarke, a partir das densidades. */
export function overrunFromDensities(mix: number, gelato: number): number {
  if (gelato <= 0) return 0;
  return (mix - gelato) / gelato;
}

/**
 * O caminho inverso, que é o que serve na bancada: a que peso um litro do seu
 * gelato tem de chegar para bater no overrun que você quer.
 */
export function litreGramsForOverrun(density: number, overrun: number): number {
  return (density * 1000) / (1 + overrun);
}

export const OVERRUN_METHOD_CITATIONS = [V(44), C(80), C(77)];
