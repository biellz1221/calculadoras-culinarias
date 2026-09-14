import { describe, expect, it } from 'vitest';

import {
  CORVITTO_LITRE_GRAMS,
  CORVITTO_MIX_DENSITY,
  GELATO_OVERRUN,
  ICE_EXPANSION,
  INDUSTRIAL_OVERRUN,
  LOW_FAT_OVERRUN_CEILING,
  MIX_DENSITY,
  litreGramsForOverrun,
  overrunFromDensities,
  overrunFromWeights,
} from './aeration';
import { DEFAULT_DENSITY, litersToGrams } from '@/lib/gelato/calc';

/**
 * Os casos-verdade são os exemplos que os próprios livros publicam.
 *
 * Extração e conferência em docs/research/gelato.md. O teste central é o da
 * §3.3: Corvitto escreve a conta por pesagem e Clarke pela densidade, e as duas
 * têm de dar o mesmo número. Se divergirem, alguém transcreveu errado.
 */

describe('a conta do overrun, pelas duas formas', () => {
  it('reproduz o exemplo de bancada de Corvitto', () => {
    // p. 44: "270 g de mix e 200 g de gelato no mesmo copo" → 1,35 → 35%.
    expect(overrunFromWeights(270, 200)).toBeCloseTo(0.35, 10);

    // E o exemplo em quilo da mesma página: 1000 g de mix, 740 g de gelato.
    expect(overrunFromWeights(1000, CORVITTO_LITRE_GRAMS)).toBeCloseTo(0.3514, 4);
  });

  it('pesar o mesmo copo duas vezes é medir densidade: as duas formas batem', () => {
    // O volume se cancela. É a mesma equação que Clarke escreve na p. 80, e a
    // coincidência entre um livro da Royal Society e um gelatiere catalão é o
    // que autoriza publicar a fórmula sem hesitar.
    for (const [mix, gelato] of [
      [270, 200],
      [1000, 740],
      [1100, 815],
      [1.1, 0.55],
    ] as const) {
      expect(overrunFromWeights(mix, gelato)).toBeCloseTo(
        overrunFromDensities(mix, gelato),
        12,
      );
    }
  });

  it('o caminho inverso desfaz o de ida', () => {
    for (const overrun of [0, 0.2, 0.35, 0.4, 1]) {
      const litre = litreGramsForOverrun(MIX_DENSITY, overrun);
      expect(overrunFromWeights(MIX_DENSITY * 1000, litre)).toBeCloseTo(overrun, 10);
    }
  });

  it('não divide por zero quando o gelato pesa zero', () => {
    expect(overrunFromWeights(1000, 0)).toBe(0);
    expect(overrunFromDensities(1.1, 0)).toBe(0);
    expect(overrunFromWeights(1000, -5)).toBe(0);
  });

  it('100% de overrun é dobrar o volume, como Clarke define', () => {
    // p. 18: "a foam that has twice the volume of the liquid from which it is
    // made has 100% overrun". Dobrar o volume é metade do peso por litro.
    expect(litreGramsForOverrun(MIX_DENSITY, 1)).toBeCloseTo(
      (MIX_DENSITY * 1000) / 2,
      10,
    );
  });
});

describe('as faixas, como cada obra publica', () => {
  it('guarda o alvo de Corvitto, e 35% fica dentro dele', () => {
    // p. 44: "between 30 and 40%. We place it around 35%."
    expect(GELATO_OVERRUN.min).toBe(0.3);
    expect(GELATO_OVERRUN.max).toBe(0.4);
    expect(GELATO_OVERRUN.target).toBeGreaterThanOrEqual(GELATO_OVERRUN.min);
    expect(GELATO_OVERRUN.target).toBeLessThanOrEqual(GELATO_OVERRUN.max);
  });

  it('a faixa industrial de Clarke engloba a de gelato e vai muito além', () => {
    // p. 153: 17% a 50% de ar em volume, "i.e. 20% to 100% overrun".
    expect(INDUSTRIAL_OVERRUN.min).toBe(0.2);
    expect(INDUSTRIAL_OVERRUN.max).toBe(1);
    expect(INDUSTRIAL_OVERRUN.technicalMax).toBe(1.2);

    // O alvo do gelato cabe dentro, e é bem abaixo do topo. É a frase que a
    // página faz: gelato é mais pesado por escolha, não por limitação.
    expect(GELATO_OVERRUN.target).toBeGreaterThan(INDUSTRIAL_OVERRUN.min);
    expect(GELATO_OVERRUN.max).toBeLessThan(INDUSTRIAL_OVERRUN.max);
  });

  it('converte a fração de ar em overrun como Clarke faz', () => {
    // 17% de ar em volume dá 20% de overrun; 50% dá 100%. O overrun é sobre o
    // volume de líquido, não sobre o total — é onde se erra a conta.
    const fromAirFraction = (air: number) => air / (1 - air);
    expect(fromAirFraction(0.17)).toBeCloseTo(0.2, 2);
    expect(fromAirFraction(0.5)).toBeCloseTo(1, 10);
  });

  it('o teto do sorbetto é teto, não alvo', () => {
    // p. 73: sem gordura e proteína, passar de 60% é difícil. Fica acima do
    // alvo de gelato, e por isso não serve como faixa de qualidade.
    expect(LOW_FAT_OVERRUN_CEILING).toBeGreaterThan(GELATO_OVERRUN.max);
  });
});

describe('a divergência de densidade', () => {
  it('o padrão da calculadora é o número de Clarke', () => {
    // p. 81: "one litre of a typical ice cream mix weighs 1.1 kg". Era valor de
    // trabalho declarado, e bateu com o livro.
    expect(MIX_DENSITY).toBe(1.1);
    expect(DEFAULT_DENSITY).toBe(MIX_DENSITY);
    expect(litersToGrams(1)).toBe(1100);
  });

  it('a aritmética de Corvitto só fecha com a densidade que ele não declara', () => {
    // Ele publica 740 g por litro a 35% de overrun. Isso exige mix a 1,00 g/mL,
    // e é assim que a densidade implícita dele foi apurada.
    //
    // A tolerância é de um grama, e o motivo está na própria fonte: o exemplo
    // dele arredonda dos dois lados. 1000 ÷ 1,35 dá 740,7 e ele imprime 740;
    // 1000 ÷ 740 dá 1,3514 e ele lê "35%" das duas casas decimais. Apertar a
    // tolerância seria exigir da fonte uma precisão que ela não reivindica.
    expect(
      litreGramsForOverrun(CORVITTO_MIX_DENSITY, GELATO_OVERRUN.target),
    ).toBeCloseTo(CORVITTO_LITRE_GRAMS, -0.5);

    // O arredondamento, explicitado: o 740 dele é 740,7 truncado, e a divisão
    // que ele manda fazer devolve 35,1% e não 35%.
    expect(litreGramsForOverrun(CORVITTO_MIX_DENSITY, 0.35)).toBeCloseTo(740.7, 1);
    expect(overrunFromWeights(1000, 740) * 100).toBeCloseTo(35.1, 1);

    // Com a densidade de Clarke, o mesmo litro pesaria 75 g a mais.
    const withClarke = litreGramsForOverrun(MIX_DENSITY, GELATO_OVERRUN.target);
    expect(withClarke).toBeCloseTo(815, 0);
    expect(withClarke - CORVITTO_LITRE_GRAMS).toBeGreaterThan(70);
  });
});

describe('a ressalva dos 105%', () => {
  it('reproduz o cálculo de Clarke e mostra por que ele é ignorável', () => {
    // p. 81: 1 L de mix com 600 g de gelo; o gelo ocupa 8% a mais que a água,
    // ou seja 48 cm³ (o livro arredonda para 50). Com 1 L de ar, o volume final
    // é 2,05 L e o overrun real é 105%, não 100%.
    const extraVolume = ICE_EXPANSION * 600;
    expect(extraVolume).toBeCloseTo(48, 0);

    const finalLitres = 1 + 1 + 0.05;
    expect((finalLitres - 1) / 1).toBeCloseTo(1.05, 10);

    // Cinco pontos percentuais em cem: é o que o próprio Clarke chama de
    // "relatively small effect", e o motivo de a página não corrigir por isso.
    expect(1.05 - 1).toBeCloseTo(0.05, 10);
  });
});
