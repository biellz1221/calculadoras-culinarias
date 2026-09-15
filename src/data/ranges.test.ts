import { describe, expect, it } from 'vitest';

import { RANGES as BREAD_RANGES } from './bread/ranges';
import { GANACHE_TEXTURES } from './ganache/textures';
import { AGENTS } from './gelling/agents';
import { PASTA_RANGES } from './pasta/ranges';
import { RANGES as PICKLE_RANGES } from './pickles/ranges';
import { isBeyondHardLimit, statusFor, type RangeRule } from './ranges';

/**
 * As faixas publicadas conferidas como faixas.
 *
 * Nada aqui olha para o valor de um número — isso é trabalho da pesquisa e dos
 * testes de motor, contra a receita do livro. O que se confere aqui é a forma:
 * uma faixa com `min` acima de `max` não descreve nada, e nenhum teste de motor
 * pegaria, porque `statusFor` responderia "acima" para todo valor e "abaixo"
 * para nenhum. Uma troca de dois números numa edição futura passaria calada.
 */

const PUBLISHED: readonly { name: string; rule: Pick<RangeRule, 'min' | 'max'> }[] = [
  ...Object.entries(BREAD_RANGES).map(([key, rule]) => ({ name: `pão/${key}`, rule })),
  ...Object.entries(PASTA_RANGES).map(([key, rule]) => ({ name: `massa/${key}`, rule })),
  ...Object.entries(PICKLE_RANGES).map(([key, rule]) => ({ name: `picles/${key}`, rule })),
  ...GANACHE_TEXTURES.flatMap((texture) => [
    { name: `ganache/${texture.id}/chocolate`, rule: texture.chocolate },
    { name: `ganache/${texture.id}/manteiga`, rule: texture.butter },
  ]),
  ...AGENTS.flatMap((agent) =>
    Object.entries(agent.doses).map(([textureId, dose]) => ({
      name: `gelificante/${agent.id}/${textureId}`,
      rule: dose,
    })),
  ),
];

describe('toda faixa publicada', () => {
  it('cobre pelo menos as cinco famílias de dados', () => {
    // Senão os testes abaixo passariam sobre uma lista que encolheu sem aviso.
    expect(PUBLISHED.length).toBeGreaterThan(40);
  });

  it.each(PUBLISHED)('$name tem mínimo não maior que o máximo', ({ rule }) => {
    expect(rule.min).toBeLessThanOrEqual(rule.max);
  });

  it.each(PUBLISHED)('$name é feita de números', ({ rule }) => {
    expect(Number.isFinite(rule.min)).toBe(true);
    expect(Number.isFinite(rule.max)).toBe(true);
  });

  it.each(PUBLISHED)('$name não tem ponta negativa', ({ rule }) => {
    // Proporção negativa não existe: nem dose, nem hidratação, nem razão.
    expect(rule.min).toBeGreaterThanOrEqual(0);
  });
});

describe('limite duro', () => {
  const WITH_HARD = [
    ...Object.entries(BREAD_RANGES),
    ...Object.entries(PASTA_RANGES),
    ...Object.entries(PICKLE_RANGES),
  ].filter(
    ([, rule]) => rule.hardMin !== undefined || rule.hardMax !== undefined,
  );

  it.each(WITH_HARD)('%s fica fora da faixa recomendada, nunca dentro', (_key, rule) => {
    // O limite duro é o ponto em que a fonte deixa de dar respaldo: ele está
    // sempre por fora da faixa recomendada. Um `hardMax` menor que `max`
    // marcaria como "sem respaldo" um valor que a própria faixa recomenda.
    if (rule.hardMin !== undefined) expect(rule.hardMin).toBeLessThanOrEqual(rule.min);
    if (rule.hardMax !== undefined) expect(rule.hardMax).toBeGreaterThanOrEqual(rule.max);
  });
});

describe('statusFor e isBeyondHardLimit', () => {
  const rule: RangeRule = {
    min: 2,
    max: 3,
    hardMin: 1.5,
    hardMax: 8,
    citations: [],
    noteKey: 'x',
  };

  it('trata as pontas da faixa como dentro dela', () => {
    expect(statusFor(2, rule)).toBe('in');
    expect(statusFor(3, rule)).toBe('in');
  });

  it('trata as pontas do limite duro como ainda respaldadas', () => {
    // Estar no limite não é estar além dele — é o que deixa o bagel do Scheft,
    // com 3% de sal exatos, ser receita publicada e não erro.
    expect(isBeyondHardLimit(1.5, rule)).toBe(false);
    expect(isBeyondHardLimit(8, rule)).toBe(false);
    expect(isBeyondHardLimit(1.49, rule)).toBe(true);
    expect(isBeyondHardLimit(8.01, rule)).toBe(true);
  });
});
