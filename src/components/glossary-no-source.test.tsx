import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * A afirmação de ausência continua testada mesmo sem ausência no site.
 *
 * Até 2026-09-14 dois verbetes de gelato não tinham fonte, e o e2e cobria esta
 * tela por acidente: bastava abrir `#glossario-overrun`. Os dois ganharam
 * livro, a lista zerou — e o ramo do componente que **diz** "sem fonte" ficaria
 * sem teste nenhum, esperando apodrecer até a próxima vez que fosse preciso.
 *
 * "Vazio quer dizer vazio" é promessa de projeto, não detalhe de layout. Então
 * a lacuna entra por um registro falso, e o teste passa a valer para sempre.
 */
vi.mock('@/data/glossary', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/glossary')>();
  return {
    ...actual,
    GLOSSARY: {
      ...actual.GLOSSARY,
      gelato: [
        { id: 'com-fonte', citations: [{ book: 'clarke' as const, page: 81 }] },
        { id: 'sem-fonte', citations: [] },
      ],
    },
  };
});

const { GlossaryList } = await import('./calculator-layout');

const TERMS = {
  'com-fonte': { term: 'Com fonte', definition: 'Este tem de onde sair.' },
  'sem-fonte': { term: 'Sem fonte', definition: 'Este não tem, e a tela diz.' },
};

const LABELS = { page: 'p.', section: 'seção' };

describe('verbete sem fonte', () => {
  it('declara a ausência em vez de omitir a linha', () => {
    render(
      <GlossaryList
        calculator="gelato"
        terms={TERMS}
        labels={LABELS}
        noSourceLabel="Sem fonte na nossa bibliografia"
        anchorLabel="Endereço deste verbete"
      />,
    );

    // O verbete existe, com definição.
    expect(screen.getByText('Este não tem, e a tela diz.')).toBeDefined();
    // E diz que não tem, em vez de ficar calado.
    expect(screen.getByText('Sem fonte na nossa bibliografia')).toBeDefined();
  });

  it('não põe o aviso onde há citação', () => {
    render(
      <GlossaryList
        calculator="gelato"
        terms={TERMS}
        labels={LABELS}
        noSourceLabel="Sem fonte na nossa bibliografia"
        anchorLabel="Endereço deste verbete"
      />,
    );

    // Uma ocorrência só, a do verbete sem citação — e não duas.
    expect(screen.getAllByText('Sem fonte na nossa bibliografia')).toHaveLength(1);
  });
});
