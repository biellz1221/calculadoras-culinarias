import { describe, expect, it } from 'vitest';

import { GLOSSARY, glossaryAnchor } from './glossary';
import { assertCitation } from './citations';
import { CALCULATORS } from './calculators';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import { getBrineDictionary } from '@/i18n/dictionaries/brine';
import { getCuringDictionary } from '@/i18n/dictionaries/curing';
import { getGanacheDictionary } from '@/i18n/dictionaries/ganache';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import { getJamDictionary } from '@/i18n/dictionaries/jam';
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
  curing: getCuringDictionary,
  jam: getJamDictionary,
  brine: getBrineDictionary,
  ganache: getGanacheDictionary,
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

  it('todo verbete do site tem fonte', () => {
    // Já foram dois sem fonte, os dois de gelato: `overrun` e a densidade da
    // calda não aparecem na planilha do curso. Em 2026-09-14 ganharam livro —
    // Corvitto e Clarke — e a lista zerou.
    //
    // A asserção continua sendo a lista, e não um `toHaveLength(0)`, porque se
    // um verbete novo entrar sem citação o teste tem de **dizer qual**. Se a
    // ausência for legítima, o id entra aqui de propósito, com o motivo escrito.
    const semFonte = CALCULATORS.flatMap((calculator) =>
      GLOSSARY[calculator.id]
        .filter((entry) => entry.citations.length === 0)
        .map((entry) => `${calculator.id}/${entry.id}`),
    );

    expect(semFonte.sort()).toEqual([]);
  });
});
