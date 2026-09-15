import { cite } from '../citations';
import type { RangeRule } from '../ranges';

/**
 * Faixas recomendadas da calculadora de pães.
 *
 * `min`/`max` são a faixa recomendada: fora dela a calculadora sinaliza, mas
 * não impede: receita boa às vezes mora na borda. `hardMin`/`hardMax` marcam o
 * ponto em que o resultado deixa de ser questão de gosto e passa a ser
 * problema (massa que não fecha, fermentação que não anda).
 *
 * A forma da regra e as duas funções de comparação moram em `../ranges`; aqui
 * ficam só os números e as obras que os sustentam.
 *
 * Consolidação em docs/research/paes.md, seções 2.5 e 3.
 */

export { isBeyondHardLimit, statusFor } from '../ranges';
export type { RangeRule, RangeStatus } from '../ranges';

export type RangeKey =
  | 'hydration'
  | 'salt'
  | 'yeast-fresh'
  | 'yeast-active-dry'
  | 'yeast-instant'
  | 'levain-liquid'
  | 'poolish'
  | 'fermented-dough'
  | 'sugar'
  | 'fat';

export const RANGES: Record<RangeKey, RangeRule> = {
  // A faixa de 60–70% é de **massa magra**, e é onde Kayser e Camargo
  // trabalham. Não há piso duro: massa enriquecida desce muito abaixo disso com
  // respaldo publicado, porque o líquido vem de ovo, manteiga e leite em vez de
  // água. O brioche do Kayser não tem água nenhuma (p. 242) e o challah do
  // Scheft tem 40% (p. 27) — um piso de 50% acusaria os dois de erro.
  // O teto fica: 80% da ciabatta do Scheft é o mais molhado que a estante
  // publica, e 90% já é fora de qualquer fonte.
  hydration: {
    min: 60,
    max: 70,
    hardMax: 90,
    citations: [
      cite('camargo', 'cap. 1, "Dúvidas frequentes"'),
      cite('kayser', 20),
      cite('kayser', 242),
      cite('scheft', 27),
      cite('scheft', 180),
    ],
    noteKey: 'hydration',
  },

  // A faixa recomendada continua sendo a europeia de Kayser e Camargo. O teto
  // duro subiu de 2,5% para 3% porque há receita publicada exatamente ali: o
  // bagel de Jerusalém do Scheft (p. 176). O pão do Levante continua
  // sinalizando "acima do usual" — que é verdade, e é informação — mas deixa de
  // ser tratado como erro.
  salt: {
    min: 1.5,
    max: 2.2,
    hardMin: 1,
    hardMax: 3,
    citations: [
      cite('kayser', 48),
      cite('camargo', 'cap. 4, "Massa de pizza ao estilo napoletano"'),
      cite('scheft', 176),
    ],
    noteKey: 'salt',
  },

  // Teto explícito do Camargo: nunca mais de 1% de seco instantâneo sobre a
  // farinha. Menos fermento e mais tempo dá pão melhor.
  'yeast-instant': {
    min: 0.3,
    max: 1,
    hardMin: 0.02,
    hardMax: 1,
    citations: [
      cite('camargo', 'cap. 1, "Sobre o fermento"'),
      cite('camargo', 'cap. 4, "Massa de pizza ao estilo napoletano"'),
    ],
    noteKey: 'instantYeast',
  },

  'yeast-active-dry': {
    min: 0.5,
    max: 1.5,
    hardMax: 2,
    citations: [cite('kayser', 16)],
    noteKey: 'dryYeast',
  },

  // Teto duro em 5%: é a dose do bagel de Jerusalém (Scheft, p. 176), pão de
  // padaria que entra e sai no mesmo dia.
  'yeast-fresh': {
    min: 0.4,
    max: 1.4,
    hardMax: 5,
    citations: [cite('kayser', 48), cite('kayser', 242), cite('scheft', 176)],
    noteKey: 'freshYeast',
  },

  'levain-liquid': {
    min: 20,
    max: 50,
    citations: [cite('kayser', 24)],
    noteKey: 'levain',
  },

  poolish: {
    min: 20,
    max: 50,
    citations: [cite('kayser', 26)],
    noteKey: 'poolish',
  },

  'fermented-dough': {
    min: 15,
    max: 30,
    citations: [cite('kayser', 26)],
    noteKey: 'fermentedDough',
  },

  sugar: {
    min: 0,
    max: 12,
    hardMax: 20,
    citations: [cite('camargo', 'cap. 3, "Pão de leite"'), cite('kayser', 260)],
    noteKey: 'sugar',
  },

  fat: {
    min: 0,
    max: 15,
    hardMax: 55,
    citations: [cite('camargo', 'cap. 3, "Pão de hot-dog"'), cite('kayser', 242)],
    noteKey: 'fat',
  },
};

export function ruleFor(key: string): RangeRule | undefined {
  return key in RANGES ? RANGES[key as RangeKey] : undefined;
}
