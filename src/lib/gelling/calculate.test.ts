import { describe, expect, it } from 'vitest';

import {
  AGENTS,
  CAVIAR_RECIPES,
  GELATIN_GRADES,
  PANNA_COTTA,
  PANNA_COTTA_LIQUID_GRAMS,
  REFERENCE_BLOOM,
  SPHERIFICATION_METHODS,
  TEXTURE_IDS,
  agentsFor,
  getAgent,
  getSpherification,
} from '@/data/gelling/agents';
import type { TextureId } from '@/data/gelling/types';
import { gellingEn } from '@/i18n/dictionaries/gelling-en';
import { gellingPtBR } from '@/i18n/dictionaries/gelling-pt-BR';
import {
  bloomEquivalent,
  dosesFor,
  gelatinFor,
  nominalBloom,
  spherificationFor,
} from './calculate';

/**
 * A calculadora de gelificantes tem fonte única — *Modernist Cuisine at Home* —,
 * e o exemplar que temos é digitalização com OCR. O que substitui a segunda
 * fonte aqui é que **a obra se confere sozinha três vezes na mesma página**, e é
 * isso que estes testes travam.
 *
 * Pesquisa em docs/research/gelificantes.md.
 */

describe('a regra da gelatina reproduz a receita da própria fonte', () => {
  it('0,8% dos 530 g de líquido chega nas 4,3 g impressas', () => {
    // O líquido da panna cotta é leite + creme + purê. Açúcar e sal ficam de
    // fora, e é a própria conta que prova isso.
    expect(PANNA_COTTA_LIQUID_GRAMS).toBe(530);

    const dose = getAgent('gelatin').doses.set!;
    const grams = (PANNA_COTTA_LIQUID_GRAMS * dose.min) / 100;

    expect(grams).toBeCloseTo(4.24, 2);

    // A tolerância é de 0,1 g, e o motivo está escrito: a regra dá 4,24 g e o
    // livro imprime 4,3 g. Ele arredonda a receita para cima — meio décimo de
    // grama de gelatina a mais não quebra uma panna cotta, e receita publicada
    // sai em número redondo. A regra e a receita concordam a 1,4%, que é o que
    // se pode pedir de uma fonte que arredonda a si mesma.
    expect(Math.abs(grams - PANNA_COTTA.gelatinGrams)).toBeLessThanOrEqual(0.1);
  });

  it('e é a soma de leite, creme e purê — nem mais, nem menos', () => {
    const dose = getAgent('gelatin').doses.set!;
    const distancia = (liquido: number) =>
      Math.abs((liquido * dose.min) / 100 - PANNA_COTTA.gelatinGrams);

    // Com o açúcar dentro (605 g) ou só com os lácteos (330 g), a conta se
    // afasta muito mais do que o arredondamento explica.
    expect(distancia(PANNA_COTTA_LIQUID_GRAMS)).toBeLessThan(0.1);
    expect(distancia(PANNA_COTTA_LIQUID_GRAMS + 75)).toBeGreaterThan(0.4);
    expect(distancia(PANNA_COTTA.milkGrams + PANNA_COTTA.creamGrams)).toBeGreaterThan(1);
  });
});

describe('a fórmula de Bloom é a do livro, e o livro a confirma', () => {
  it('reproduz o exemplo impresso: 2,6 g de Knox viram 3,7 g de prata', () => {
    const silver = bloomEquivalent(2.6, REFERENCE_BLOOM, 160);
    expect(silver).toBeCloseTo(3.656, 3);
    expect(Math.round(silver * 10) / 10).toBe(3.7);
  });

  it.each([
    ['silver', 1.1],
    ['bronze', 1.3],
  ] as const)(
    'reproduz a substituição impressa para %s: %s g por 100 g de líquido',
    (gradeId, printed) => {
      // O livro parte dos 0,8 g de Knox por 100 g de líquido e publica o
      // equivalente de cada grau. A fórmula dele devolve o número dele.
      const grade = GELATIN_GRADES.find((item) => item.id === gradeId)!;
      const grams = bloomEquivalent(0.8, REFERENCE_BLOOM, nominalBloom(grade));

      expect(Math.round(grams * 10) / 10).toBe(printed);
    },
  );

  it('gelatina mais forte pesa menos para o mesmo gel', () => {
    const forte = gelatinFor(500, 0.8, 'platinum');
    const fraca = gelatinFor(500, 0.8, 'bronze');

    expect(forte.grams).toBeLessThan(fraca.grams);
    expect(forte.referenceGrams).toBe(fraca.referenceGrams);
  });

  it('a Knox é pó e não devolve contagem de folhas', () => {
    expect(gelatinFor(500, 0.8, 'knox').sheets).toBeUndefined();
    expect(gelatinFor(500, 0.8, 'gold').sheets).toBeGreaterThan(0);
  });

  it('a folha mais fraca é a mais pesada, e isso não é coincidência', () => {
    // Leitura nossa da tabela da fonte, registrada na pesquisa: Bloom vezes
    // peso por folha fica entre 400 e 460 nos quatro graus vendidos em folha.
    // É por isso que receita em "número de folhas" funciona.
    const poderes = GELATIN_GRADES.filter((g) => g.gramsPerSheet).map(
      (g) => nominalBloom(g) * g.gramsPerSheet!,
    );

    expect(poderes).toHaveLength(4);
    for (const poder of poderes) {
      expect(poder).toBeGreaterThan(395);
      expect(poder).toBeLessThan(465);
    }
  });
});

describe('ágar', () => {
  it('o gel fluido de cebola é a dose de 0,7% que a receita imprime', () => {
    const agar = getAgent('agar');
    expect(agar.doses['fluid-gel']!.min).toBe(0.7);
    // 3,5 g de ágar para 500 g de leite de cebola.
    expect((500 * 0.7) / 100).toBeCloseTo(3.5, 10);
  });

  it('o gel fluido cai entre o molho espesso e o purê, como a fonte manda', () => {
    const agar = getAgent('agar');
    expect(agar.doses['fluid-gel']!.min).toBeGreaterThan(agar.doses.sauce!.max);
    expect(agar.doses['fluid-gel']!.min).toBeLessThan(agar.doses.puree!.min);
  });

  it('as doses crescem com a espessura pedida', () => {
    const agar = getAgent('agar');
    const ordem: TextureId[] = ['thin', 'sauce', 'fluid-gel', 'puree'];
    for (let i = 1; i < ordem.length; i += 1) {
      expect(agar.doses[ordem[i]!]!.min).toBeGreaterThan(
        agar.doses[ordem[i - 1]!]!.min,
      );
    }
  });
});

describe('o que separa um agente do outro', () => {
  it('xantana engrossa e não gelifica', () => {
    expect(getAgent('xanthan').gels).toBe(false);
    expect(getAgent('xanthan').needsBoil).toBe(false);
    expect(getAgent('xanthan').doses.set).toBeUndefined();
  });

  it('ágar aguenta muito mais calor que gelatina, e essa é a escolha', () => {
    expect(getAgent('gelatin').holdsToCelsius).toBe(37);
    expect(getAgent('agar').holdsToCelsius).toBe(85);
    expect(getAgent('agar').needsBoil).toBe(true);
  });

  it('iota e kappa só existem em dupla', () => {
    expect(getAgent('iota').pairedWith).toBe('kappa');
    expect(getAgent('kappa').pairedWith).toBe('iota');
  });

  it('a panna cotta do Modernist cai dentro da faixa que o Scoolinary publica', () => {
    // As duas obras não se conhecem. O Modernist dá um ponto — as gramas da
    // panna cotta vegetariana — e o Scoolinary dá a faixa de trabalho.
    const iotaPonto = (PANNA_COTTA.iotaGrams / PANNA_COTTA_LIQUID_GRAMS) * 100;
    const kappaPonto = (PANNA_COTTA.kappaGrams / PANNA_COTTA_LIQUID_GRAMS) * 100;

    expect(iotaPonto).toBeCloseTo(0.123, 3);
    expect(kappaPonto).toBeCloseTo(0.094, 3);

    // A kappa cai dentro da faixa do Scoolinary por muito pouco...
    const kappaFaixa = getAgent('kappa').doses.set!;
    expect(kappaPonto).toBeLessThan(kappaFaixa.min);
    // ...ou melhor: fica um fio **abaixo** do piso, e isso está registrado em
    // vez de alisado. Meio centésimo de ponto percentual.
    expect(kappaFaixa.min - kappaPonto).toBeLessThan(0.01);

    // A iota do Modernist é mais macia que a faixa de referência do Scoolinary,
    // e faz sentido: uma panna cotta é o extremo macio do que a iota faz.
    const iotaFaixa = getAgent('iota').doses['soft-set']!;
    expect(iotaPonto).toBeLessThan(iotaFaixa.min);
  });

  it('o amido pede uma ordem de grandeza a mais, que é o argumento do hidrocoloide', () => {
    const wondra = getAgent('wondra').doses.sauce!.min;
    const xanthan = getAgent('xanthan').doses.sauce!.min;
    expect(wondra / xanthan).toBeGreaterThan(10);
  });
});

describe('o motor', () => {
  it('converte porcentagem em grama pelo líquido informado', () => {
    const doses = dosesFor({ liquidGrams: 1000, textureId: 'sauce' });
    const agar = doses.find((item) => item.agent.id === 'agar')!;

    expect(agar.grams.min).toBeCloseTo(4, 10);
    expect(agar.grams.max).toBeCloseTo(5, 10);
  });

  it('não aceita líquido negativo', () => {
    const doses = dosesFor({ liquidGrams: -100, textureId: 'set' });
    for (const dose of doses) expect(dose.grams.min).toBe(0);
  });

  it('toda textura do seletor tem pelo menos um agente com dose publicada', () => {
    for (const textureId of TEXTURE_IDS) {
      expect(agentsFor(textureId).length, textureId).toBeGreaterThan(0);
    }
  });

  it('nenhum agente entra sem citação', () => {
    for (const agent of AGENTS) {
      expect(agent.citations.length, agent.id).toBeGreaterThan(0);
      for (const dose of Object.values(agent.doses)) {
        expect(dose.citations.length, agent.id).toBeGreaterThan(0);
      }
    }
  });
});

describe('os dois idiomas andam juntos', () => {
  it.each(AGENTS.map((agent) => agent.id))('%s tem nome e nota nos dois', (id) => {
    for (const dict of [gellingPtBR, gellingEn]) {
      expect(dict.agents[id]).toBeTruthy();
      expect(dict.agentNotes[id]).toBeTruthy();
    }
  });

  it.each(TEXTURE_IDS)('a textura %s tem nome e nota nos dois', (id) => {
    for (const dict of [gellingPtBR, gellingEn]) {
      expect(dict.textures[id]).toBeTruthy();
      expect(dict.textureNotes[id]).toBeTruthy();
    }
  });

  it.each(GELATIN_GRADES.map((grade) => grade.id))('o grau %s tem nome nos dois', (id) => {
    for (const dict of [gellingPtBR, gellingEn]) {
      expect(dict.bloom.grades[id]).toBeTruthy();
    }
  });
});

/* -------------------------------------------------------------------------- */
/* O material do Scoolinary (docs/research/gelificantes.md, Partes II a IV)    */
/* -------------------------------------------------------------------------- */

describe('a segunda fonte', () => {
  it('as duas obras dizem o mesmo número para o calor que o ágar aguenta', () => {
    // É a convergência que tirou o ágar da condição de fonte única: um livro de
    // cozinha científica americano e uma chef de P&D catalã, 85 °C os dois.
    const agar = getAgent('agar');
    expect(agar.holdsToCelsius).toBe(85);

    const obras = new Set(
      [...agar.citations, ...Object.values(agar.doses).flatMap((d) => d.citations)].map(
        (c) => c.book,
      ),
    );
    expect(obras.has('modernist-home')).toBe(true);
    expect(obras.has('scoolinary-gelation')).toBe(true);
  });

  it('as faixas de ágar das duas fontes se sobrepõem em vez de brigar', () => {
    const agar = getAgent('agar');
    // Modernist: 0,25% (caldo) a 1,1% (purê). Scoolinary: 0,3% a 1,5%.
    expect(agar.doses.thin!.min).toBe(0.25);
    expect(agar.doses['hard-set']!.max).toBe(1.5);
    // O piso do Scoolinary cai dentro da faixa de molho do Modernist.
    expect(agar.doses['soft-set']!.min).toBeGreaterThanOrEqual(agar.doses.thin!.min);
    expect(agar.doses['soft-set']!.min).toBeLessThanOrEqual(agar.doses.sauce!.max);
  });

  it('a xantana ganhou segunda fonte sem mudar de número', () => {
    const xanthan = getAgent('xanthan');
    const obras = new Set(xanthan.citations.map((c) => c.book));
    expect(obras.size).toBeGreaterThan(1);
    // A faixa do Scoolinary (0–0,3%) contém a do Modernist (0,1–0,3%).
    expect(xanthan.doses.sauce!.max).toBe(0.3);
  });
});

describe('os agentes novos', () => {
  it('a gelana é a única que não derrete depois de pronta', () => {
    const irreversiveis = AGENTS.filter((a) => a.irreversible).map((a) => a.id);
    expect(irreversiveis).toEqual(['gellan']);
  });

  it('a metilcelulose é a única que gelifica esquentando', () => {
    const invertidos = AGENTS.filter((a) => a.gelsWhenHot).map((a) => a.id);
    expect(invertidos).toEqual(['methylcellulose']);

    const mc = getAgent('methylcellulose');
    // Dissolve no frio e firma a 60 °C — o contrário de todos os outros.
    expect(mc.setsAtCelsius).toBe(60);
  });

  it('a dose da metilcelulose é a porcentagem, não o parêntese errado da fonte', () => {
    // O slide 55 escreve "2%, 2 gramas por litro". 2% de um litro são 20 g: o
    // parêntese erra por uma ordem de grandeza. Se alguém trocar a dose por
    // 0,2% algum dia, este teste cai e o comentário explica por quê.
    const mc = getAgent('methylcellulose');
    expect(mc.doses.set!.min).toBe(2);
    expect(mc.doses.set!.max).toBe(2.5);

    // A conversão certa, para deixar registrado: 2% de 1 kg são 20 g.
    expect((1000 * mc.doses.set!.min) / 100).toBe(20);
  });

  it('cada agente novo entrou com citação de curso, não de livro', () => {
    for (const id of ['gellan', 'methylcellulose', 'pectin'] as const) {
      const livros = getAgent(id).citations.map((c) => c.book);
      expect(livros.every((b) => b.startsWith('scoolinary')), id).toBe(true);
    }
  });

  it('a escada de textura vai do mais fino ao mais duro sem buraco', () => {
    for (const textureId of TEXTURE_IDS) {
      expect(agentsFor(textureId).length, textureId).toBeGreaterThan(0);
    }
  });
});

describe('esferificação', () => {
  it('as duas técnicas invertem quem leva o alginato e quem leva o cálcio', () => {
    const direta = getSpherification('direct');
    const reversa = getSpherification('reverse');

    // Na direta o alginato está no produto e o cálcio no banho.
    expect(direta.base.map((a) => a.key)).toContain('alginate');
    expect(direta.bath.map((a) => a.key)).toContain('calcium-chloride');

    // Na reversa é o contrário: o cálcio no produto, o alginato no banho.
    expect(reversa.base.map((a) => a.key)).toContain('gluconolactate');
    expect(reversa.bath.map((a) => a.key)).toContain('alginate');
  });

  it('só a direta carrega limites, e é ela que tem', () => {
    // A direta não aceita gordura, laticínio, ácido nem álcool alto, e a reação
    // não para. A reversa existe justamente por causa disso.
    expect(getSpherification('direct').limitKeys.length).toBeGreaterThan(0);
    expect(getSpherification('reverse').limitKeys).toEqual([]);
  });

  it('as duas receitas de caviar do curso caem no piso da faixa que ele publica', () => {
    const piso = getSpherification('direct').base.find(
      (a) => a.key === 'alginate',
    )!.percent.min;
    expect(piso).toBe(0.5);

    for (const receita of CAVIAR_RECIPES) {
      const percent = (receita.alginateGrams / receita.baseGrams) * 100;
      // Um fio abaixo do piso declarado — 0,489% e 0,495%. Registrado em vez de
      // alisado: é onde a chef trabalha de fato dentro da própria faixa.
      expect(percent, receita.id).toBeLessThan(piso);
      expect(piso - percent, receita.id).toBeLessThan(0.02);
    }
  });

  it('base e banho são porcentagens de líquidos diferentes', () => {
    const doses = spherificationFor(getSpherification('direct'), 500, 1000);

    // 0,5–1% de alginato sobre os 500 g da base.
    const alginato = doses.base.find((d) => d.additive.key === 'alginate')!;
    expect(alginato.grams.min).toBeCloseTo(2.5, 10);
    expect(alginato.grams.max).toBeCloseTo(5, 10);

    // 0,5% de cloreto sobre o litro do banho — outra base, outro número.
    const cloreto = doses.bath.find(
      (d) => d.additive.key === 'calcium-chloride',
    )!;
    expect(cloreto.grams.min).toBeCloseTo(5, 10);
  });

  it('nenhum aditivo entra sem citação', () => {
    for (const method of SPHERIFICATION_METHODS) {
      for (const additive of [...method.base, ...method.bath]) {
        expect(additive.percent.citations.length, additive.key).toBeGreaterThan(0);
      }
    }
  });
});

describe('os dois idiomas, na parte nova', () => {
  it.each(SPHERIFICATION_METHODS.map((m) => m.id))(
    'a técnica %s tem nome e nota nos dois',
    (id) => {
      for (const dict of [gellingPtBR, gellingEn]) {
        expect(dict.spherification.methods[id]).toBeTruthy();
        expect(dict.spherification.methodNotes[id]).toBeTruthy();
      }
    },
  );

  it('todo aditivo e todo limite têm rótulo nos dois', () => {
    for (const dict of [gellingPtBR, gellingEn]) {
      for (const method of SPHERIFICATION_METHODS) {
        for (const additive of [...method.base, ...method.bath]) {
          expect(dict.spherification.additives[additive.key]).toBeTruthy();
        }
        for (const key of method.limitKeys) {
          expect(
            dict.spherification.limits[key as keyof typeof dict.spherification.limits],
          ).toBeTruthy();
        }
      }
    }
  });
});
