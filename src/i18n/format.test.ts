import { describe, expect, it } from 'vitest';

import { formatGrams, formatNumber, formatPercent } from './format';

describe('formatação numérica por idioma', () => {
  it('usa vírgula decimal em pt-BR e ponto em inglês', () => {
    expect(formatGrams(32.5, 'pt-BR')).toBe('32,5 g');
    expect(formatGrams(32.5, 'en')).toBe('32.5 g');
  });

  it('mantém a casa decimal mesmo em valor redondo', () => {
    // Quem vai pesar precisa ver a precisão real da receita.
    expect(formatGrams(10, 'pt-BR')).toBe('10,0 g');
    expect(formatGrams(10, 'en')).toBe('10.0 g');
  });

  it('permite pedir outra precisão de pesagem', () => {
    expect(formatGrams(2.25, 'pt-BR', 2)).toBe('2,25 g');
    expect(formatGrams(2.25, 'pt-BR', 0)).toBe('2 g');
  });

  it('separa milhar conforme o idioma', () => {
    expect(formatNumber(1500, 'pt-BR')).toBe('1.500');
    expect(formatNumber(1500, 'en')).toBe('1,500');
  });

  it('formata percentuais sem casa decimal desnecessária', () => {
    expect(formatPercent(65, 'pt-BR')).toBe('65%');
    expect(formatPercent(1.8, 'pt-BR')).toBe('1,8%');
    expect(formatPercent(1.8, 'en')).toBe('1.8%');
  });
});
