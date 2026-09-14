import { describe, expect, it } from 'vitest';

import { breadEn } from '@/i18n/dictionaries/bread-en';
import { breadPtBR } from '@/i18n/dictionaries/bread-pt-BR';
import { calculateRecipe, effectiveHydration } from '@/lib/bread/calculate';
import { BREAD_PRESETS, getPreset } from './presets';
import { RANGES, isBeyondHardLimit, ruleFor } from './ranges';
import { PRE_FERMENT_HYDRATION, type IngredientKey } from './types';

/**
 * Os pães do Levante — Uri Scheft, *Breaking Breads* — e a tangzhong da Cho.
 *
 * Toda a pesquisa está em docs/research/paes-regionais.md. O que este arquivo
 * trava é o que mais custou a descobrir: **o peso da massa que o próprio livro
 * declara é o caso-verdade da transcrição**. Somar a lista de ingredientes e
 * comparar com esse número pegou dois erros reais — a manteiga do malawach, que
 * lamina e não entra na massa, e a segunda água da ciabatta.
 *
 * Sem esse confronto o malawach teria entrado no site com 27% de gordura.
 */

/** A receita como está impressa, em grama. Nada aqui é conta minha. */
const AS_PRINTED: Record<
  string,
  {
    page: number;
    flour: number;
    lines: Partial<Record<IngredientKey, number>>;
    /** Peso de massa que o livro publica, quando publica. */
    declaredDough?: number;
    /** Gordura que a receita lista mas que lamina, em vez de entrar na massa. */
    laminatingButter?: number;
  }
> = {
  pita: {
    page: 116,
    flour: 550,
    lines: { water: 335, 'yeast-fresh': 20, sugar: 20, salt: 15 },
    declaredDough: 900,
  },
  challah: {
    page: 27,
    flour: 1000,
    // 2 ovos grandes. Scheft nunca pesa o ovo inteiro, mas pesa os separados:
    // 6 gemas = 120 g e 4 claras = 120 g, o que fecha o ovo em 50 g.
    lines: {
      water: 400,
      'yeast-fresh': 40,
      egg: 100,
      sugar: 100,
      'neutral-oil': 75,
      salt: 15,
    },
    declaredDough: 1750,
  },
  'jerusalem-bagel': {
    page: 176,
    flour: 500,
    lines: {
      water: 280,
      'yeast-fresh': 25,
      'milk-powder': 60,
      sugar: 50,
      'olive-oil': 20,
      salt: 15,
    },
  },
  malawach: {
    page: 145,
    flour: 1000,
    lines: { water: 630, sugar: 50, salt: 20, 'baking-powder': 4 },
    declaredDough: 1700,
    laminatingButter: 270,
  },
  jachnun: {
    page: 149,
    flour: 1000,
    lines: { water: 675, sugar: 50, honey: 35, salt: 20, 'baking-powder': 2 },
    laminatingButter: 200,
  },
};

describe('os pães do Levante são a receita impressa', () => {
  it.each(Object.entries(AS_PRINTED))(
    '%s reproduz as gramas da fonte quando escalado para a farinha do livro',
    (id, printed) => {
      const preset = getPreset(id);
      expect(preset, id).toBeDefined();

      const recipe = calculateRecipe(preset!.formula, {
        kind: 'flour',
        grams: printed.flour,
      });

      for (const [key, grams] of Object.entries(printed.lines)) {
        const line = recipe.lines.find((item) => item.key === key);
        expect(line, `${id} → ${key}`).toBeDefined();
        // Tolerância de meio grama: as porcentagens são arredondadas na segunda
        // casa, e 2,73% de 550 g não é exatamente 15 g.
        expect(line!.grams, `${id} → ${key}`).toBeCloseTo(grams, 0);
      }
    },
  );

  it.each(
    Object.entries(AS_PRINTED).filter(([, printed]) => printed.declaredDough),
  )('%s bate com o peso de massa que o próprio livro declara', (id, printed) => {
    const preset = getPreset(id)!;
    const recipe = calculateRecipe(preset.formula, {
      kind: 'flour',
      grams: printed.flour,
    });

    // Scheft arredonda o rendimento para baixo (a pita soma 940 g e ele escreve
    // 900 g), então a régua é de 10%. É larga de propósito: ela não existe para
    // conferir gramatura, existe para pegar ingrediente sobrando ou faltando —
    // e os 270 g de manteiga do malawach estouram qualquer tolerância razoável.
    const declared = printed.declaredDough!;
    expect(Math.abs(recipe.doughGrams - declared) / declared, id).toBeLessThan(0.1);
  });

  it('a manteiga do malawach lamina, e é o rendimento declarado que prova', () => {
    const printed = AS_PRINTED.malawach!;
    const semManteiga = Object.values(printed.lines).reduce(
      (total, grams) => total + grams,
      printed.flour,
    );

    // 1.704 g contra 1.700 g impressos: bate na casa da grama.
    expect(semManteiga).toBe(1704);
    expect(Math.abs(semManteiga - printed.declaredDough!)).toBeLessThanOrEqual(5);

    // Com a manteiga dentro, a mesma conta erra por 274 g. Foi assim que o erro
    // apareceu, e é por isso que a manteiga não está na fórmula.
    const comManteiga = semManteiga + printed.laminatingButter!;
    expect(Math.abs(comManteiga - printed.declaredDough!)).toBeGreaterThan(250);

    const keys = getPreset('malawach')!.formula.lines.map((line) => line.key);
    expect(keys).not.toContain('butter');
  });

  it('o jachnun também deixa a manteiga fora', () => {
    const keys = getPreset('jachnun')!.formula.lines.map((line) => line.key);
    expect(keys).not.toContain('butter');
    expect(AS_PRINTED.jachnun!.laminatingButter).toBe(200);
  });

  it('laffa e pita são a mesma massa, porque o livro manda seguir a mesma receita', () => {
    const pita = getPreset('pita')!;
    const laffa = getPreset('laffa')!;

    expect(laffa.formula).toEqual(pita.formula);

    // O que muda é o forno, e o preset precisa dizer isso.
    expect(pita.process.ovenCelsius).toBeUndefined();
    expect(laffa.process.ovenCelsius).toBe(274);

    // A laffa cita as duas páginas: a dela e a da massa que ela empresta.
    const pages = laffa.citations.map((citation) => citation.page);
    expect(pages).toContain(121);
    expect(pages).toContain(116);
  });

  it('malawach e jachnun não levam fermento biológico', () => {
    for (const id of ['malawach', 'jachnun']) {
      const keys = getPreset(id)!.formula.lines.map((line) => line.key);
      expect(keys.some((key) => key.startsWith('yeast-')), id).toBe(false);
      expect(keys, id).toContain('baking-powder');
    }
  });
});

describe('as faixas europeias não governam o pão do Levante', () => {
  it('a pita e o bagel de Jerusalém salgam acima da faixa recomendada — e isso aparece', () => {
    const pita = getPreset('pita')!.formula.lines.find((l) => l.key === 'salt')!;
    const bagel = getPreset('jerusalem-bagel')!.formula.lines.find(
      (l) => l.key === 'salt',
    )!;

    expect(pita.percent).toBeCloseTo(2.73, 2);
    expect(bagel.percent).toBe(3);

    // Acima do usual: o selo continua sinalizando, que é o certo.
    expect(pita.percent).toBeGreaterThan(RANGES.salt.max);
    expect(bagel.percent).toBeGreaterThan(RANGES.salt.max);
  });

  /**
   * Divergência dentro de uma fonte só, achada por este teste.
   *
   * Camargo escreve que o seco instantâneo nunca deve passar de 1% da farinha
   * (cap. 1, "Sobre o fermento") e publica uma broa com 5 g de fermento para
   * 450 g de farinha, que dá 1,11% (cap. 3, "Broa à portuguesa"). O autor
   * contraria a própria regra por um décimo.
   *
   * O teto fica onde está: é regra enunciada, e o site cita essa regra. A broa
   * fica como está: é receita publicada, e o site a transcreve. Quem abrir a
   * broa vê o selo de "acima do limite" com a nota explicando de onde vem o
   * teto — que é exatamente o que uma divergência deve fazer nesta calculadora.
   */
  const DIVERGENCIA_CONHECIDA = { preset: 'broa', key: 'yeast-instant', percent: 1.1 };

  it('a broa do Camargo contraria o teto que o próprio Camargo enuncia', () => {
    const linha = getPreset(DIVERGENCIA_CONHECIDA.preset)!.formula.lines.find(
      (line) => line.key === DIVERGENCIA_CONHECIDA.key,
    )!;

    expect(linha.percent).toBe(DIVERGENCIA_CONHECIDA.percent);
    expect(RANGES['yeast-instant'].hardMax).toBe(1);
    expect(isBeyondHardLimit(linha.percent, RANGES['yeast-instant'])).toBe(true);
  });

  it('e é a única: nenhum outro preset estoura limite duro de nada', () => {
    // O limite duro diz "aqui as fontes param de dar respaldo". Um preset é uma
    // receita publicada: ele é o respaldo. Se este teste cair, ou a faixa está
    // errada ou o preset está errado — nunca os dois ao mesmo tempo.
    for (const preset of BREAD_PRESETS) {
      const recipe = calculateRecipe(preset.formula, { kind: 'flour', grams: 1000 });

      expect(
        isBeyondHardLimit(recipe.hydration, RANGES.hydration),
        `${preset.id} → hidratação ${recipe.hydration}`,
      ).toBe(false);

      for (const line of recipe.lines) {
        const rule = ruleFor(line.key);
        if (!rule) continue;
        if (
          preset.id === DIVERGENCIA_CONHECIDA.preset &&
          line.key === DIVERGENCIA_CONHECIDA.key
        ) {
          continue;
        }
        expect(
          isBeyondHardLimit(line.percent, rule),
          `${preset.id} → ${line.key} ${line.percent}`,
        ).toBe(false);
      }

      expect(
        isBeyondHardLimit(recipe.salt, RANGES.salt),
        `${preset.id} → sal ${recipe.salt}`,
      ).toBe(false);
    }
  });

  it('o teto duro do sal e do fermento fresco é a receita que os empurrou', () => {
    expect(RANGES.salt.hardMax).toBe(3);
    expect(RANGES['yeast-fresh'].hardMax).toBe(5);

    // Os dois vieram da mesma página, e ela tem de estar citada.
    for (const key of ['salt', 'yeast-fresh'] as const) {
      const pages = RANGES[key].citations
        .filter((citation) => citation.book === 'scheft')
        .map((citation) => citation.page);
      expect(pages, key).toContain(176);
    }
  });

  it('a hidratação não tem piso duro, porque massa enriquecida desce abaixo de qualquer piso', () => {
    expect(RANGES.hydration.hardMin).toBeUndefined();
    expect(RANGES.hydration.hardMax).toBe(90);

    // O brioche do Kayser é a prova de que o piso de 50% estava errado desde
    // sempre: ele está publicado no site e não tem uma gota de água.
    const brioche = calculateRecipe(getPreset('brioche')!.formula, {
      kind: 'flour',
      grams: 1000,
    });
    expect(brioche.hydration).toBe(0);
    expect(isBeyondHardLimit(brioche.hydration, RANGES.hydration)).toBe(false);

    // A chalá chega ao mesmo lugar por outro caminho: 40% de água mais ovo.
    const challah = calculateRecipe(getPreset('challah')!.formula, {
      kind: 'flour',
      grams: 1000,
    });
    expect(challah.hydration).toBe(40);
    expect(challah.hydration).toBeLessThan(RANGES.hydration.min);
  });
});

describe('tangzhong', () => {
  it('é 1 de farinha para 5 de leite, como a Cho publica', () => {
    expect(PRE_FERMENT_HYDRATION.tangzhong).toBe(500);
  });

  it('a própria receita da autora confirma a proporção que ela enuncia', () => {
    // "Mother of All Milk Bread": 20 g de farinha para 100 g de leite. Fonte que
    // obedece a si mesma é o melhor caso-verdade que existe.
    const flour = 20;
    const milk = 100;
    expect(milk / flour).toBe(5);
    expect((milk / flour) * 100).toBe(PRE_FERMENT_HYDRATION.tangzhong);
  });

  it('carrega farinha e líquido escondidos para dentro da hidratação real', () => {
    // Uma massa a 50% de água com 36% de tangzhong: a farinha da tangzhong
    // engorda a base e o leite dela engorda o líquido.
    const formula = {
      flours: [{ key: 'flour-white' as const, percent: 100 }],
      lines: [
        { key: 'water' as const, percent: 50 },
        { key: 'tangzhong' as const, percent: 36 },
        { key: 'salt' as const, percent: 2 },
      ],
    };

    // Dos 36 pontos, 6 são farinha e 30 são leite (1:5).
    const real = effectiveHydration(formula);
    expect(real).toBeCloseTo((80 / 106) * 100, 6);

    // E é maior que a declarada: ignorar a tangzhong subestimaria a massa.
    expect(real).toBeGreaterThan(50);
  });
});

describe('os dois idiomas andam juntos', () => {
  it.each(BREAD_PRESETS.map((preset) => preset.id))('%s tem nome nos dois', (id) => {
    expect(Object.hasOwn(breadPtBR.presets, id), `pt-BR: ${id}`).toBe(true);
    expect(Object.hasOwn(breadEn.presets, id), `en: ${id}`).toBe(true);
  });

  it.each(
    [...new Set(BREAD_PRESETS.flatMap((p) => p.process.noteKey).filter(Boolean))] as string[],
  )('a nota de processo "%s" existe nos dois', (noteKey) => {
    expect(Object.hasOwn(breadPtBR.process.notes, noteKey), `pt-BR: ${noteKey}`).toBe(true);
    expect(Object.hasOwn(breadEn.process.notes, noteKey), `en: ${noteKey}`).toBe(true);
  });
});
