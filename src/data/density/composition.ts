import { cite } from '../citations';

/**
 * Densidade de um alimento a partir da composição: o modelo de Choi & Okos
 * (1986), como o capítulo 19 do ASHRAE o publica.
 *
 * Cada constituinte tem densidade própria, função da temperatura, e a mistura
 * soma volumes: `ρ = (1 − ε) ÷ Σ (xᵢ ÷ ρᵢ)`, com porosidade `ε` zero fora de
 * grão a granel — equação (6). As equações foram conferidas na imagem das duas
 * fontes que as reproduzem, ASHRAE (Tabelas 1 e 2) e Fricke & Becker (p. 312),
 * e coincidem em coeficiente, expoente e sinal.
 *
 * O que o modelo não faz, medido em docs/research/densidade.md:
 *
 * - **Não tem etanol.** Álcool contado como água erra 5,6% num destilado.
 *   Bebida alcoólica vai pela OIML, não por aqui.
 * - **A água dele é leve**: de 0,09% a 0,29% abaixo da OIML entre 0 e 40 °C.
 * - **Não sabe que açúcar dissolvido contrai.** Contra as caldas do NBS 457,
 *   medidas de 10 a 30 °C, erra de −0,62% a +0,43% até 70 °Brix e superestima
 *   até 2,05% a 95 °Brix (medido só a 15 e 20 °C) — é a faixa do mel. O erro
 *   cresce com o calor: a 70 °Brix vai de −0,005% a 10 °C para +0,43% a 30 °C.
 *   O motor responde de 0 a 100 °C; fora de 10–30 °C, ninguém mediu.
 *
 * Unidades da fonte: kg/m³, °C, fração mássica.
 */

export type Constituent = 'water' | 'protein' | 'fat' | 'carbohydrate' | 'fiber' | 'ash';

/** Ordem de leitura. O motor percorre esta lista, nunca as chaves da entrada. */
export const CONSTITUENTS: readonly Constituent[] = [
  'water',
  'protein',
  'fat',
  'carbohydrate',
  'fiber',
  'ash',
];

/**
 * `ρ = c₀ + c₁·t + c₂·t²`, em kg/m³. Só a água tem termo quadrático.
 *
 * Fonte: ASHRAE, cap. 19, Tabela 1 (proteína, gordura, carboidrato, fibra,
 * cinza) e Tabela 2 (água); Fricke & Becker, p. 312, as mesmas duas tabelas.
 */
export const CONSTITUENT_DENSITY: Record<Constituent, readonly [number, number, number]> = {
  water: [997.18, 3.1439e-3, -3.7574e-3],
  protein: [1329.9, -0.5184, 0],
  fat: [925.59, -0.41757, 0],
  // Carboidrato: travado pelas caldas do NBS. Com os limites dos testes, a
  // inclinação só passa entre −0,3105 e −0,3090 — um dígito errado na segunda ou
  // na terceira casa derruba teste. Conferido também na imagem das duas fontes.
  carbohydrate: [1599.1, -0.31046, 0],
  // A fibra é o único coeficiente sem caso-verdade: carne (o exemplo do ASHRAE)
  // e calda (o NBS) não têm fibra. Está conferida só na imagem das duas fontes.
  // Medido: trocar 1311,5 por 1131,5 não derruba teste nenhum — e move o suco
  // de ameixa (1% de fibra) em 0,13%, dentro do erro do próprio modelo.
  fiber: [1311.5, -0.36589, 0],
  ash: [2423.8, -0.28063, 0],
};

/** Faixa das equações por constituinte: "(–40 ≤ t ≤ 150°C)", nas duas tabelas. */
export const CONSTITUENT_MIN_CELSIUS = -40;
export const CONSTITUENT_MAX_CELSIUS = 150;

/**
 * Faixa em que o motor responde sobre um **líquido**.
 *
 * Abaixo de zero o alimento começa a congelar, e o modelo precisaria da fração
 * de gelo, que depende do ponto de congelamento de cada um. Acima de 100 °C a
 * água ferve. As equações valem além disso; o líquido, não.
 */
export const LIQUID_MIN_CELSIUS = 0;
export const LIQUID_MAX_CELSIUS = 100;

/**
 * Quanto a soma das frações pode se afastar de 1.
 *
 * Composição publicada fecha em 100 g com o arredondamento de cada componente:
 * a do próprio exemplo resolvido do ASHRAE (carne de porco, cap. 19, Example 4)
 * soma 1,0034, e a fonte usa as frações assim, sem normalizar. O motor faz o
 * mesmo. Um grama em cem cobre esse arredondamento.
 *
 * Esta trava **não** protege contra fibra contada duas vezes: medido nas
 * bebidas da Tabela 3 do ASHRAE, a fibra somada de novo só tira a ameixa da
 * tolerância, e por 0,0001. Quem protege disso é o contrato de `Composition`,
 * que recebe o carboidrato total e a fibra como a tabela publica.
 */
export const COMPOSITION_SUM_TOLERANCE = 0.01;

export const CONSTITUENT_DENSITY_CITATIONS = [
  cite('ashrae-refrigeration', 'cap. 19, pp. 19.1–19.2, Tabelas 1 e 2'),
  cite('fricke-becker-2001', 312),
];

export const MIXTURE_CITATIONS = [
  cite('ashrae-refrigeration', 'cap. 19, p. 19.6, equação (6); p. 19.11, Example 4'),
];
