import { describe, expect, it } from 'vitest';

import {
  AGENTS,
  GELATIN_GRADES,
  PANNA_COTTA,
  PANNA_COTTA_LIQUID_GRAMS,
  REFERENCE_BLOOM,
  TEXTURE_IDS,
  agentsFor,
  getAgent,
} from '@/data/gelling/agents';
import type { TextureId } from '@/data/gelling/types';
import { gellingEn } from '@/i18n/dictionaries/gelling-en';
import { gellingPtBR } from '@/i18n/dictionaries/gelling-pt-BR';
import { bloomEquivalent, dosesFor, gelatinFor, nominalBloom } from './calculate';

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

  it('a carragena sai das gramas da panna cotta vegetariana', () => {
    const iota = getAgent('iota').doses.set!.min;
    const kappa = getAgent('kappa').doses.set!.min;

    expect((PANNA_COTTA_LIQUID_GRAMS * iota) / 100).toBeCloseTo(
      PANNA_COTTA.iotaGrams,
      10,
    );
    expect((PANNA_COTTA_LIQUID_GRAMS * kappa) / 100).toBeCloseTo(
      PANNA_COTTA.kappaGrams,
      10,
    );
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
