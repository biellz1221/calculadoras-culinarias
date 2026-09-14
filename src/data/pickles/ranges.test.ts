import { describe, expect, it } from 'vitest';

import {
  EMBRAPA_PH_THRESHOLD,
  MIN_SAFE_SALINITY,
  SAFETY_CITATIONS,
  TARGET_PH,
  ruleFor,
} from './ranges';

/**
 * As faixas do picles vinham de três obras estrangeiras. A varredura de órgãos
 * públicos brasileiros (docs/research/picles-fermentacao.md, Parte II) trouxe
 * duas publicações da Embrapa que tocam dois números daqui: uma corrobora a
 * faixa de salga sem mexer nela, e a outra **diverge** no limiar de pH.
 *
 * O teste da divergência é o que importa: ele trava a decisão de **não** trocar
 * a régua de segurança por um décimo vindo de manual técnico.
 */


describe('as fontes brasileiras da Parte II', () => {
  it('a Embrapa corrobora a faixa de salga seca, sem mudar número', () => {
    // Machado, p. 78: "salmouras fracas [...] com uma concentração de 1,5 a 2%
    // de sal". É exatamente a faixa que já vinha do Katz, por outro caminho.
    const rule = ruleFor('dry-salt');
    expect(rule.min).toBe(1.5);
    expect(rule.max).toBe(2);

    const books = rule.citations.map((citation) => citation.book);
    expect(books).toContain('katz');
    expect(books).toContain('embrapa-processamento');
  });

  it('o piso de sal seguro continua sendo o menor valor das fontes', () => {
    expect(MIN_SAFE_SALINITY).toBe(ruleFor('dry-salt').min);
  });

  it('as duas réguas de pH divergem em um décimo, e a brasileira é a estrita', () => {
    // NCHFP: 4,6. Embrapa, Hortaliças em conserva, p. 23: 4,5.
    expect(TARGET_PH).toBe(4.6);
    expect(EMBRAPA_PH_THRESHOLD).toBe(4.5);
    expect(TARGET_PH - EMBRAPA_PH_THRESHOLD).toBeCloseTo(0.1, 10);

    // A brasileira é mais restritiva: quem mira nela satisfaz as duas.
    expect(EMBRAPA_PH_THRESHOLD).toBeLessThan(TARGET_PH);
  });

  it('a calculadora não trocou de régua por causa do décimo', () => {
    // A trava: mexer no número que decide segurança pediria a norma legal
    // brasileira, e o que temos é manual técnico de extensão. Se alguém
    // apontar `TARGET_PH` para 4,5 sem essa leitura, este teste cai.
    expect(TARGET_PH).not.toBe(EMBRAPA_PH_THRESHOLD);
    expect(SAFETY_CITATIONS.phOfficial.map((c) => c.book)).toEqual([
      'nchfp',
      'embrapa-hortalicas',
    ]);
  });
});
