import { auditGellingDose, texturesForDose, type GellingAuditInput } from './audit';
import { describe, expect, it } from 'vitest';

function audit(input: Partial<GellingAuditInput> = {}) {
  const result = auditGellingDose({
    liquidGrams: 500,
    agentId: 'agar',
    agentGrams: 3.5,
    textureId: 'fluid-gel',
    ...input,
  });

  return result.metrics[0];
}

describe('auditGellingDose', () => {
  it('reconhece a dose do gel fluido de cebola', () => {
    // 3,5 g de ágar para 500 g de leite de cebola: a coluna SCALING da própria
    // receita imprime 0,7%.
    expect(audit()?.value).toBeCloseTo(0.7, 10);
    expect(audit()?.status).toBe('in');
  });

  it('diz quanto agente a faixa pede quando a dose está fraca', () => {
    const metric = audit({ agentGrams: 1, textureId: 'puree' });

    // Purê de ágar: 0,9% a 1,1% de 500 g.
    expect(metric?.status).toBe('below');
    expect(metric?.correction?.targetGrams).toEqual({ min: 4.5, max: 5.5 });
  });

  it('não responde onde a fonte não publica', () => {
    // A tabela não cobre todo agente em toda textura, e preencher o vazio
    // seria inventar faixa.
    expect(audit({ agentId: 'wondra', textureId: 'hard-set' })).toBeUndefined();
  });

  it('não mede nada sem líquido', () => {
    expect(auditGellingDose({
      liquidGrams: 0,
      agentId: 'agar',
      agentGrams: 3.5,
      textureId: 'fluid-gel',
    }).metrics).toEqual([]);
  });

  it('carrega a citação da própria linha da tabela', () => {
    expect(audit()?.citations.length).toBeGreaterThan(0);
  });
});

describe('texturesForDose', () => {
  it('diz em que textura a dose cai, que é a pergunta de quem já dosou', () => {
    // 0,7% de ágar é o gel fluido publicado.
    expect(texturesForDose('agar', 0.7)).toContain('fluid-gel');
  });

  it('devolve todas as texturas cuja faixa contém a dose', () => {
    // 1% de ágar é o topo do purê e o pé do gel duro: as duas são verdade.
    const textures = texturesForDose('agar', 1);

    expect(textures).toContain('puree');
    expect(textures).toContain('hard-set');
  });

  it('devolve vazio para dose que nenhuma faixa cobre', () => {
    expect(texturesForDose('agar', 99)).toEqual([]);
    expect(texturesForDose('agar', Number.NaN)).toEqual([]);
  });
});
