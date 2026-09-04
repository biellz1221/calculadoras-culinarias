import { describe, expect, it } from 'vitest';

import { recipeCardText, type RecipeCard } from './card';

const LABELS = { sources: 'Fontes' };

const CARD: RecipeCard = {
  title: 'Pão branco rústico (boule)',
  subtitle: 'Farinha: 500 g',
  groups: [
    {
      lines: [
        { label: 'Farinha de trigo branca', value: '500,0 g' },
        { label: 'Água', value: '350,0 g' },
        { label: 'Sal', value: '10,0 g' },
      ],
    },
    {
      heading: 'Balanço da massa',
      lines: [{ label: 'Hidratação', value: '70%', strong: true }],
    },
  ],
  notices: ['Abaixo do mínimo seguro.'],
  sources: ['Kayser, p. 20'],
};

describe('texto da receita', () => {
  it('sai legível para colar numa conversa', () => {
    const text = recipeCardText(CARD, LABELS, 'https://exemplo.test/paes?r=abc');

    expect(text).toBe(
      [
        'Pão branco rústico (boule)\nFarinha: 500 g',
        'Farinha de trigo branca: 500,0 g\nÁgua: 350,0 g\nSal: 10,0 g',
        'Balanço da massa\nHidratação: 70%',
        '⚠ Abaixo do mínimo seguro.',
        'Fontes: Kayser, p. 20',
        'https://exemplo.test/paes?r=abc',
      ].join('\n\n'),
    );
  });

  it('leva o aviso junto, sempre', () => {
    // O aviso de segurança não é decoração do painel: ele viaja com a receita
    // para onde ela for, inclusive para uma conversa sem o site do lado.
    const text = recipeCardText(CARD, LABELS);

    expect(text).toContain('⚠ Abaixo do mínimo seguro.');
  });

  it('funciona sem link, sem aviso e sem fonte', () => {
    const bare: RecipeCard = {
      title: 'Sem nada',
      groups: [{ lines: [{ label: 'Água', value: '100 g' }] }],
      notices: [],
      sources: [],
    };

    expect(recipeCardText(bare, LABELS)).toBe('Sem nada\n\nÁgua: 100 g');
  });

  it('pula grupo vazio em vez de deixar linha em branco', () => {
    const card: RecipeCard = { ...CARD, groups: [...CARD.groups, { lines: [] }] };

    expect(recipeCardText(card, LABELS)).not.toMatch(/\n{3}/);
  });
});
