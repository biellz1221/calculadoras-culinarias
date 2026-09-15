import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { LineEditor, sumRole, type AuditLine } from './line-editor';

type Role = 'flour' | 'water';

const LABELS = {
  name: 'Ingrediente',
  namePlaceholder: 'Farinha de trigo',
  amount: 'Peso',
  role: 'Papel',
  add: 'Adicionar ingrediente',
  remove: 'Apagar',
  empty: 'Nenhum ingrediente ainda.',
  roleHint: 'O papel é o que a conta usa.',
};

const ROLES = [
  { value: 'flour' as const, label: 'Farinha', totalLabel: 'Total de farinha' },
  { value: 'water' as const, label: 'Água' },
];

function Harness({ initial = [] }: { initial?: readonly AuditLine<Role>[] }) {
  const [lines, setLines] = useState<readonly AuditLine<Role>[]>(initial);

  return (
    <LineEditor
      lines={lines}
      onChange={setLines}
      roles={ROLES}
      labels={LABELS}
      locale="pt-BR"
    />
  );
}

const LINE: AuditLine<Role> = {
  id: 'a',
  name: 'Farinha',
  grams: 500,
  role: 'flour',
};

describe('LineEditor', () => {
  it('começa vazio e acrescenta linha pelo botão', () => {
    render(<Harness />);
    expect(screen.getByText(LABELS.empty)).toBeInTheDocument();

    fireEvent.click(screen.getByText(`+ ${LABELS.add}`));

    expect(screen.getByLabelText(`${LABELS.name} 1`)).toBeInTheDocument();
    expect(screen.queryByText(LABELS.empty)).not.toBeInTheDocument();
  });

  it('guarda nome, peso e papel do que foi digitado', () => {
    render(<Harness initial={[LINE]} />);

    fireEvent.change(screen.getByLabelText(`${LABELS.name} 1`), {
      target: { value: 'Farinha de centeio' },
    });
    fireEvent.change(screen.getByLabelText(LABELS.amount), {
      target: { value: '750' },
    });

    expect(screen.getByLabelText(`${LABELS.name} 1`)).toHaveValue(
      'Farinha de centeio',
    );
    expect(screen.getByLabelText(LABELS.amount)).toHaveValue(750);
  });

  it('apaga a linha pelo nome que ela tem na tela', () => {
    render(<Harness initial={[LINE, { ...LINE, id: 'b', name: 'Água' }]} />);

    fireEvent.click(screen.getByLabelText(`${LABELS.remove}: Água`));

    // Sobra uma linha só, e é a que não foi apagada. O campo de nome é quem
    // responde: "Farinha" também é o rótulo de um papel no seletor.
    expect(screen.getByLabelText(`${LABELS.name} 1`)).toHaveValue('Farinha');
    expect(screen.queryByLabelText(`${LABELS.name} 2`)).not.toBeInTheDocument();
  });

  it('soma só os papéis que pedem total', () => {
    render(
      <Harness
        initial={[LINE, { id: 'b', name: 'Água', grams: 325, role: 'water' }]}
      />,
    );

    expect(screen.getByText('Total de farinha')).toBeInTheDocument();
    expect(screen.getByText('500,0 g')).toBeInTheDocument();
    // A água não declarou rótulo de total, então não aparece somada.
    expect(screen.queryByText('325,0 g')).not.toBeInTheDocument();
  });

  it('esconde o seletor quando só existe um papel possível', () => {
    render(
      <LineEditor
        lines={[LINE]}
        onChange={() => {}}
        roles={[{ value: 'flour', label: 'Farinha' }]}
        labels={LABELS}
        locale="pt-BR"
      />,
    );

    expect(screen.queryByLabelText(LABELS.role)).not.toBeInTheDocument();
    // A dica de papel some junto: não há papel a escolher.
    expect(screen.queryByText(LABELS.roleHint)).not.toBeInTheDocument();
  });

  it('dá id novo a cada linha, mesmo com peso repetido', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText(`+ ${LABELS.add}`));
    fireEvent.click(screen.getByText(`+ ${LABELS.add}`));

    // Duas linhas com o mesmo peso zerado: se o id viesse do conteúdo, a
    // segunda reusaria a chave da primeira e o React perderia o campo.
    expect(screen.getByLabelText(`${LABELS.name} 1`)).toBeInTheDocument();
    expect(screen.getByLabelText(`${LABELS.name} 2`)).toBeInTheDocument();
  });
});

describe('sumRole', () => {
  it('ignora peso que não é número em vez de somar NaN', () => {
    const lines: AuditLine<Role>[] = [
      LINE,
      { id: 'b', name: 'quebrada', grams: Number.NaN, role: 'flour' },
    ];

    expect(sumRole(lines, 'flour')).toBe(500);
  });
});
