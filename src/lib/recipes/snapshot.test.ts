import { describe, expect, it } from 'vitest';

import { decodeSnapshot, encodeSnapshot, SNAPSHOT_VERSION } from './snapshot';

/** Aceita qualquer objeto: os testes de campo ficam com cada calculadora. */
const anyObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

describe('snapshot de receita', () => {
  it('leva e traz o estado sem perder nada', () => {
    const state = { presetId: 'boule', flourGrams: 500, nested: { a: [1, 2, 3] } };
    const result = decodeSnapshot(encodeSnapshot('bread', state), 'bread', anyObject);

    expect(result).toEqual({ status: 'ok', state });
  });

  it('sobrevive a acento e emoji', () => {
    // O texto passa por base64, que é binário: sem UTF-8 explícito, "pão"
    // volta quebrado, e o nome do ingrediente é campo livre.
    const state = { name: 'Pão de açúcar 🥖', role: 'sólido' };
    const result = decodeSnapshot(encodeSnapshot('bread', state), 'bread', anyObject);

    expect(result).toEqual({ status: 'ok', state });
  });

  it('produz texto que passa intacto por uma URL', () => {
    const encoded = encodeSnapshot('pickles', { saltPercent: 2, lines: ['a', 'b'] });

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(new URLSearchParams({ r: encoded }).get('r')).toBe(encoded);
  });

  it('recusa link de outra calculadora', () => {
    const encoded = encodeSnapshot('pickles', { saltPercent: 2 });

    expect(decodeSnapshot(encoded, 'bread', anyObject)).toEqual({ status: 'invalid' });
  });

  it('distingue versão futura de link quebrado', () => {
    // A diferença importa para a interface: um caso é "este link é de amanhã",
    // o outro é "este link chegou pela metade", e a pessoa faz coisas
    // diferentes em cada um.
    const future = base64url(
      JSON.stringify({ v: SNAPSHOT_VERSION + 1, c: 'bread', s: {} }),
    );

    expect(decodeSnapshot(future, 'bread', anyObject)).toEqual({ status: 'outdated' });
    expect(decodeSnapshot('não é base64!', 'bread', anyObject)).toEqual({
      status: 'invalid',
    });
  });

  it('recusa carga grande demais sem tentar decodificar', () => {
    expect(decodeSnapshot('A'.repeat(9000), 'bread', anyObject)).toEqual({
      status: 'invalid',
    });
  });

  it.each([
    ['vazio', ''],
    ['base64 de texto que não é JSON', base64url('isto não é json')],
    ['JSON que não é objeto', base64url('42')],
    ['objeto sem envelope', base64url('{"foo":1}')],
  ])('recusa %s', (_label, encoded) => {
    expect(decodeSnapshot(encoded, 'bread', anyObject)).toEqual({ status: 'invalid' });
  });

  it('deixa a última palavra com o parse da calculadora', () => {
    const encoded = encodeSnapshot('bread', { presetId: 'preset-que-não-existe' });

    expect(decodeSnapshot(encoded, 'bread', () => null)).toEqual({ status: 'invalid' });
  });
});

function base64url(value: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
