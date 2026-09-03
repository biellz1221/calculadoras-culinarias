import { describe, expect, it } from 'vitest';

import { matchesQuery, normalize } from '@/lib/gelato/search';

describe('busca de ingredientes', () => {
  it('ignora acento e caixa', () => {
    expect(normalize('Açúcar - Dextrose')).toBe('acucar - dextrose');
    expect(matchesQuery('Açúcar - Dextrose', 'acucar')).toBe(true);
    expect(matchesQuery('Leite Em Pó Desnatado', 'PO')).toBe(true);
  });

  it('aceita termos soltos em qualquer ordem', () => {
    expect(matchesQuery('Açúcar - Dextrose', 'dext acucar')).toBe(true);
    expect(matchesQuery('Açúcar - Dextrose', 'acucar frutose')).toBe(false);
  });

  it('sem consulta, tudo passa', () => {
    expect(matchesQuery('Morango', '')).toBe(true);
    expect(matchesQuery('Morango', '   ')).toBe(true);
  });

  it('funciona com o rótulo em inglês', () => {
    expect(matchesQuery('Whole milk', 'milk')).toBe(true);
    expect(matchesQuery('Skimmed milk powder', 'milk powder')).toBe(true);
  });
});
