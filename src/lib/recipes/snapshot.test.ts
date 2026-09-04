import { describe, expect, it } from 'vitest';

import { decodeSnapshot, encodeSnapshot, SNAPSHOT_VERSION } from './snapshot';

/**
 * Um formato de mentira, com o mínimo do contrato: os testes de campo ficam
 * com cada calculadora. O ponto de partida é vazio, então a diferença é o
 * estado inteiro e o vaivém pode ser conferido campo a campo.
 */
const anyShape = {
  baselineFor: (presetId: string) => (presetId === 'nenhum' ? null : {}),
  presetOf: () => 'qualquer',
  parse: (value: unknown): Record<string, unknown> | null =>
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : null,
};

describe('snapshot de receita', () => {
  it('leva e traz o estado sem perder nada', () => {
    const state = { presetId: 'boule', flourGrams: 500, nested: { a: [1, 2, 3] } };
    const result = decodeSnapshot(encodeSnapshot('bread', state, anyShape), 'bread', anyShape);

    expect(result).toEqual({ status: 'ok', state });
  });

  it('sobrevive a acento e emoji', () => {
    // O texto passa por base64, que é binário: sem UTF-8 explícito, "pão"
    // volta quebrado, e o nome do ingrediente é campo livre.
    const state = { name: 'Pão de açúcar 🥖', role: 'sólido' };
    const result = decodeSnapshot(encodeSnapshot('bread', state, anyShape), 'bread', anyShape);

    expect(result).toEqual({ status: 'ok', state });
  });

  it('produz texto que passa intacto por uma URL', () => {
    const encoded = encodeSnapshot('pickles', { saltPercent: 2, lines: ['a', 'b'] }, anyShape);

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(new URLSearchParams({ r: encoded }).get('r')).toBe(encoded);
  });

  it('recusa link de outra calculadora', () => {
    const encoded = encodeSnapshot('pickles', { saltPercent: 2 }, anyShape);

    expect(decodeSnapshot(encoded, 'bread', anyShape)).toEqual({ status: 'invalid' });
  });

  it('distingue versão futura de link quebrado', () => {
    // A diferença importa para a interface: um caso é "este link é de amanhã",
    // o outro é "este link chegou pela metade", e a pessoa faz coisas
    // diferentes em cada um.
    const future = base64url(
      JSON.stringify({ v: SNAPSHOT_VERSION + 1, c: 'bread', s: {} }),
    );

    expect(decodeSnapshot(future, 'bread', anyShape)).toEqual({ status: 'outdated' });
    expect(decodeSnapshot('não é base64!', 'bread', anyShape)).toEqual({
      status: 'invalid',
    });
  });

  it('recusa carga grande demais sem tentar decodificar', () => {
    expect(decodeSnapshot('A'.repeat(9000), 'bread', anyShape)).toEqual({
      status: 'invalid',
    });
  });

  it.each([
    ['vazio', ''],
    ['base64 de texto que não é JSON', base64url('isto não é json')],
    ['JSON que não é objeto', base64url('42')],
    ['objeto sem envelope', base64url('{"foo":1}')],
  ])('recusa %s', (_label, encoded) => {
    expect(decodeSnapshot(encoded, 'bread', anyShape)).toEqual({ status: 'invalid' });
  });

  it('deixa a última palavra com o parse da calculadora', () => {
    const encoded = encodeSnapshot('bread', { presetId: 'preset-que-não-existe' }, anyShape);

    expect(decodeSnapshot(encoded, 'bread', { ...anyShape, parse: () => null })).toEqual({ status: 'invalid' });
  });
});

function base64url(value: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

describe('tamanho do link', () => {
  it('manda só a diferença em relação ao preset', () => {
    // O bug que originou isto: no WhatsApp o link clicável terminava antes do
    // `?r=`, e quem recebia abria a calculadora no padrão. A causa era o
    // tamanho — o estado inteiro viajava em JSON com nome de campo por extenso.
    const preset = { presetId: 'boule', formula: { lines: Array(20).fill('x') } };
    const shape = {
      baselineFor: (id: string) => (id === 'boule' ? preset : null),
      presetOf: () => 'boule',
      parse: (value: unknown) => value as typeof preset,
    };

    const intocado = encodeSnapshot('bread', preset, shape);
    const inteiro = encodeSnapshot('bread', preset, {
      ...shape,
      baselineFor: () => null,
    });

    // Receita de preset sem edição não precisa mandar uma linha da fórmula.
    expect(intocado.length).toBeLessThan(inteiro.length / 3);
  });

  it('abre o link da versão 1, que ficou em conversa de WhatsApp', () => {
    // Versão antiga levava o estado inteiro em `s`. Um link mandado ontem
    // precisa continuar abrindo hoje — é para isso que a versão existe.
    const antigo = base64url(
      JSON.stringify({ v: 1, c: 'bread', s: { presetId: 'boule', flourGrams: 500 } }),
    );

    expect(decodeSnapshot(antigo, 'bread', anyShape)).toEqual({
      status: 'ok',
      state: { presetId: 'boule', flourGrams: 500 },
    });
  });

  it('recusa link cujo preset sumiu do catálogo', () => {
    const semBase = base64url(JSON.stringify({ v: 2, c: 'bread', p: 'nenhum', d: {} }));

    expect(decodeSnapshot(semBase, 'bread', anyShape)).toEqual({ status: 'invalid' });
  });
});
