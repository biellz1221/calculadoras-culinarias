import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FermentationGuide } from './fermentation-guide';
import { closestPoint } from '@/data/bread/fermentation';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';

const dict = getBreadDictionary('pt-BR');
const copy = dict.fermentation;

function open() {
  render(<FermentationGuide dict={dict} locale="pt-BR" />);
}

describe('ponto de calibração mais próximo', () => {
  it('escolhe por proporção, não por diferença absoluta', () => {
    // De 0,04% para 0,08% é o mesmo salto que de 1% para 2%. Comparando
    // diferença absoluta, toda dose pequena cairia no mesmo ponto.
    expect(closestPoint(0.05, 'second')?.recipeKey).toBe('napoletana');
    expect(closestPoint(0.9, 'first')?.recipeKey).toBe('french');
    expect(closestPoint(0.5, 'first')?.recipeKey).toBe('ciabatta');
  });

  it('não mistura as duas fermentações', () => {
    // A napoletana calibra a segunda; pedir a primeira com a dose dela não
    // pode devolver um ponto da outra etapa.
    expect(closestPoint(0.04, 'first')?.stage).toBe('first');
    expect(closestPoint(1, 'second')?.stage).toBe('second');
  });

  it('não devolve ponto para dose zero', () => {
    expect(closestPoint(0, 'first')).toBeUndefined();
  });
});

describe('orientação de fermentação', () => {
  it('dobra o tempo quando o fermento cai pela metade', () => {
    open();

    const field = screen.getByLabelText(copy.yeastLabel);

    // A ciabatta calibra 0,6% em 2 h. Metade da dose, dobro do tempo.
    fireEvent.change(field, { target: { value: '0.6' } });
    expect(screen.getByText('2 h')).toBeInTheDocument();

    fireEvent.change(field, { target: { value: '0.3' } });
    expect(screen.getByText('4 h')).toBeInTheDocument();

    // E a âncora muda com a dose: 1% cai no pão francês, não na ciabatta.
    fireEvent.change(field, { target: { value: '1' } });
    expect(screen.getByText('60–90 min')).toBeInTheDocument();
  });

  it('diz de qual receita o número saiu, e cita', () => {
    open();

    // Aparece duas vezes: na frase da estimativa e na tabela de referência.
    expect(screen.getAllByText(new RegExp(copy.recipes.french)).length).toBe(2);
    expect(screen.getAllByText(/Camargo/).length).toBeGreaterThan(0);
  });

  it('avisa que é planejamento, não promessa', () => {
    open();
    expect(screen.getByText(copy.estimateWarning)).toBeInTheDocument();
  });

  it('calcula a água pela temperatura de base', () => {
    open();

    fireEvent.change(screen.getByLabelText(copy.roomLabel), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(copy.flourLabel), { target: { value: '20' } });

    // Pão branco: base 54–56, menos 20 de ambiente e 20 de farinha.
    expect(screen.getByText('14 °C – 16 °C')).toBeInTheDocument();
  });

  it('avisa quando a cozinha está quente demais para a conta fechar', () => {
    open();

    fireEvent.change(screen.getByLabelText(copy.roomLabel), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(copy.flourLabel), { target: { value: '30' } });

    // A conta pediria água abaixo de zero: dizer "-4 °C" e calar seria pior.
    expect(screen.getByText(copy.tooCold)).toBeInTheDocument();
  });
});
