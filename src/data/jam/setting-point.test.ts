import { describe, expect, it } from 'vitest';

import {
  BOILING_POINT_ELEVATION,
  MODERNIST_ALTITUDE_RULE,
  MODERNIST_ANCHORS,
  NCHFP_SETTING_TABLE,
  boilingCelsius,
  feetFromMeters,
  settingCelsius,
} from './setting-point';

/**
 * A curva de altitude ganhou uma segunda fonte.
 *
 * A calculadora de geleias sempre interpolou a tabela do NCHFP, e isso vinha
 * com um incômodo registrado no código: **a tabela contraria a regra de bolso
 * impressa na mesma página do NCHFP** a partir dos 5.000 pés. Faltava saber se
 * o problema era a tabela ou a regra.
 *
 * O Modernist Cuisine vol. 1, p. 318, publica a mesma regra por outro caminho —
 * física de cozinha, não extensão agrícola — e ainda dá dois pontos medidos,
 * Denver e o Everest. É contra eles que os testes abaixo conferem a curva.
 *
 * Pesquisa em docs/research/geleias.md.
 */

/** Onde a regra do Modernist coloca a fervura, em °C, para uma altitude. */
function modernistBoiling(meters: number): number {
  const { metersPerStep, celsiusPerStep } = MODERNIST_ALTITUDE_RULE;
  return 100 - (meters / metersPerStep) * celsiusPerStep;
}

describe('duas fontes independentes descrevem a mesma curva', () => {
  it('a regra é a mesma nos dois sistemas de unidade', () => {
    // 1 °C por 300 m e 2 °F por 1.000 pés são a mesma coisa: 300 m são 984 pés,
    // e 1 °C é 1,8 °F. A regra do Modernist é a do NCHFP, escrita em Celsius.
    const { metersPerStep, feetPerStep, celsiusPerStep, fahrenheitPerStep } =
      MODERNIST_ALTITUDE_RULE;

    // Os dois pares do livro são números redondos, não conversões exatas:
    // 300 m são 984 pés, e 1 °C são 1,8 °F. Ele escolheu o número que se
    // guarda de cabeça em cada sistema, e a diferença fica em 10% — o que é
    // aceitável numa regra de bolso e **não** seria numa dose.
    expect(feetFromMeters(metersPerStep) / feetPerStep).toBeGreaterThan(0.9);
    expect(feetFromMeters(metersPerStep) / feetPerStep).toBeLessThan(1.1);
    expect((celsiusPerStep * 1.8) / fahrenheitPerStep).toBeGreaterThan(0.85);
    expect((celsiusPerStep * 1.8) / fahrenheitPerStep).toBeLessThan(1.05);
  });

  it.each(NCHFP_SETTING_TABLE.map((row) => row.feet))(
    'aos %s pés a tabela do NCHFP e a regra do Modernist ficam a menos de meio grau',
    (feet) => {
      const meters = feet * 0.3048;
      const diff = Math.abs(boilingCelsius(meters) - modernistBoiling(meters));

      // Esta é a notícia: a tabela americana e o livro de física concordam em
      // toda a faixa, inclusive onde o NCHFP discorda de si mesmo. A divergência
      // interna dele é de arredondamento, não de física — e é por isso que
      // continuar interpolando a tabela é a decisão certa.
      expect(diff, `${feet} pés`).toBeLessThan(0.5);
    },
  );
});

describe('os pontos medidos que o Modernist publica', () => {
  it('Denver cai dentro da faixa que o livro imprime', () => {
    const denver = MODERNIST_ANCHORS.find((a) => a.id === 'denver')!;
    const ours = boilingCelsius(denver.meters);

    expect(ours).toBeGreaterThanOrEqual(denver.boilingCelsius[0]);
    expect(ours).toBeLessThanOrEqual(denver.boilingCelsius[1]);
  });

  it('o Everest confere a extrapolação acima do fim da tabela', () => {
    // A tabela do NCHFP para nos 8.000 pés; o cume tem 29.029. O código segue a
    // inclinação do último trecho, e não havia como saber se isso ainda dizia
    // algo. O Modernist mede 69 °C lá em cima.
    const everest = MODERNIST_ANCHORS.find((a) => a.id === 'everest')!;
    const ours = boilingCelsius(everest.meters);

    expect(Math.abs(ours - everest.boilingCelsius[0])).toBeLessThan(1);
  });

  it('e o Everest está muito além de qualquer cozinha brasileira', () => {
    // O ponto mais alto do país tem 2.995 m. O teste do Everest é de robustez
    // da conta, não de uso: ninguém faz geleia lá.
    const everest = MODERNIST_ANCHORS.find((a) => a.id === 'everest')!;
    expect(everest.meters).toBeGreaterThan(2995 * 2);
  });
});

describe('por que a geleia dá o ponto acima da fervura da água', () => {
  it('o soluto eleva o ponto de ebulição, e os dois extremos do livro provam', () => {
    // Água do mar a 3,5% de sal: 103 °C. Calda a 95% de açúcar: 135 a 145 °C.
    // A geleia mora entre os dois, e é por isso que o ponto dela fica acima da
    // água fervendo.
    const { seawater, candySyrup } = BOILING_POINT_ELEVATION;

    expect(seawater.celsius).toBeGreaterThan(100);
    expect(candySyrup.celsius[0]).toBeGreaterThan(seawater.celsius);
    expect(candySyrup.solutePercent).toBeGreaterThan(seawater.solutePercent);
  });

  it('o ponto da geleia ao nível do mar fica entre os dois extremos', () => {
    // 220 °F são 104,4 °C — acima da água do mar e muito abaixo da calda de
    // bala, o que é exatamente onde uma geleia a 65% de sólidos solúveis
    // deveria cair: bem mais concentrada que 3,5% de sal, bem menos que 95%
    // de açúcar. A ordem dos três números é a prova de que a régua faz sentido.
    const ponto = settingCelsius(0);
    const { seawater, candySyrup } = BOILING_POINT_ELEVATION;

    expect(ponto).toBeGreaterThan(seawater.celsius);
    expect(ponto).toBeLessThan(candySyrup.celsius[0]);
  });

  it('e a diferença entre ponto e fervura não muda com a altitude', () => {
    // É o que torna a regra do NCHFP portátil: não é uma temperatura, é uma
    // diferença. Oito graus Fahrenheit são 4,44 °C em qualquer lugar.
    for (const meters of [0, 500, 800, 1600, 2400]) {
      expect(settingCelsius(meters) - boilingCelsius(meters)).toBeCloseTo(
        (8 * 5) / 9,
        10,
      );
    }
  });
});
