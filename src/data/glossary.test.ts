import { describe, expect, it } from 'vitest';

import { GLOSSARY, glossaryAnchor } from './glossary';
import { assertCitation } from './citations';
import { CALCULATORS } from './calculators';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import { getPastaDictionary } from '@/i18n/dictionaries/pasta';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import { LOCALES, type Locale } from '@/i18n/locales';
import type { CalculatorId } from './calculators';

const GLOSSARIES: Record<
  CalculatorId,
  (locale: Locale) => { glossary: { terms: Record<string, unknown> } }
> = {
  bread: getBreadDictionary,
  pickles: getPicklesDictionary,
  pasta: getPastaDictionary,
  gelato: getGelatoDictionary,
};

const cases = CALCULATORS.flatMap((calculator) =>
  LOCALES.map((locale) => ({ id: calculator.id, locale })),
);

describe('glossário', () => {
  it.each(cases)('$id/$locale tem exatamente os verbetes do registro', ({ id, locale }) => {
    // O registro em `data` manda na ordem e na procedência; o dicionário, no
    // texto. Um sair do lugar sem o outro é verbete órfão numa das duas pontas.
    const written = Object.keys(GLOSSARIES[id](locale).glossary.terms).sort();
    const registered = GLOSSARY[id].map((entry) => entry.id).sort();

    expect(written).toEqual(registered);
  });

  it.each(CALCULATORS)('$id cita obra e localizador válidos', (calculator) => {
    for (const entry of GLOSSARY[calculator.id]) {
      for (const citation of entry.citations) {
        // Página de EPUB e capítulo de livro impresso não passam daqui.
        expect(() => assertCitation(citation), entry.id).not.toThrow();
      }
    }
  });

  it('não repete id dentro da mesma calculadora', () => {
    for (const calculator of CALCULATORS) {
      const ids = GLOSSARY[calculator.id].map((entry) => entry.id);
      expect(new Set(ids).size, calculator.id).toBe(ids.length);
    }
  });

  it('gera âncora legível e estável', () => {
    expect(glossaryAnchor('autolyse')).toBe('glossario-autolyse');
  });

  it('só admite verbete sem fonte onde a ausência foi apurada', () => {
    // Hoje são dois, os dois de gelato: `overrun` e a densidade da calda não
    // aparecem na planilha do curso, e não há outra obra na estante que fale
    // dos dois. Verbete novo sem citação precisa passar por aqui de propósito.
    const semFonte = CALCULATORS.flatMap((calculator) =>
      GLOSSARY[calculator.id]
        .filter((entry) => entry.citations.length === 0)
        .map((entry) => `${calculator.id}/${entry.id}`),
    );

    expect(semFonte.sort()).toEqual(['gelato/overrun', 'gelato/syrup-density']);
  });
});
