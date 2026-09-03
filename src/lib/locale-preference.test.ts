import { afterEach, describe, expect, it, vi } from 'vitest';

import { detectLocale, preferredLocale, readStoredLocale, storeLocale } from './locale-preference';

function mockLanguages(languages: string[]): void {
  vi.stubGlobal('navigator', { languages, language: languages[0] ?? 'en' });
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('detecção pelo navegador', () => {
  it('manda qualquer variante de português para o português', () => {
    for (const tag of ['pt-BR', 'pt-PT', 'pt', 'PT-br']) {
      mockLanguages([tag]);
      expect(detectLocale(), tag).toBe('pt-BR');
    }
  });

  it('manda o resto para o inglês', () => {
    for (const tag of ['en-US', 'es-ES', 'fr-FR', 'de', 'ja']) {
      mockLanguages([tag]);
      expect(detectLocale(), tag).toBe('en');
    }
  });

  it('respeita a ordem de preferência do navegador', () => {
    mockLanguages(['es-ES', 'pt-BR', 'en-US']);
    // Espanhol não é atendido, então vale o próximo que o site fala.
    expect(detectLocale()).toBe('pt-BR');
  });

  it('cai no inglês quando o navegador não diz nada de útil', () => {
    mockLanguages([]);
    expect(detectLocale()).toBe('en');
  });
});

describe('escolha guardada', () => {
  it('grava e lê a escolha explícita', () => {
    storeLocale('en');
    expect(readStoredLocale()).toBe('en');
  });

  it('ignora valor inválido no storage', () => {
    window.localStorage.setItem('cc:locale', 'klingon');
    expect(readStoredLocale()).toBeNull();
  });

  it('a escolha explícita vence a detecção', () => {
    mockLanguages(['en-US']);
    storeLocale('pt-BR');

    expect(preferredLocale()).toBe('pt-BR');
  });

  it('sem escolha guardada, vale o navegador', () => {
    mockLanguages(['fr-FR']);
    expect(preferredLocale()).toBe('en');
  });
});
