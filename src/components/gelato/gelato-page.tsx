import { GelatoCalculator } from './gelato-calculator';
import {
  CalculatorLayout,
  CalculatorSection,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { GELATO_CITATIONS } from '@/data/gelato/source';
import type { Citation } from '@/data/citations';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';

/**
 * Tudo que sustenta a tela vem da mesma planilha de curso — por isso a lista é
 * curta e a chamada da seção diz, sem rodeio, que aqui não há obra publicada.
 */
function collectCitations(): Citation[] {
  return Object.values(GELATO_CITATIONS);
}

export function GelatoPage({ locale }: { locale: Locale }) {
  const dict = getGelatoDictionary(locale);

  return (
    <CalculatorLayout eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
      <GelatoCalculator dict={dict} locale={locale} />

      <CalculatorSection label={dict.method.title}>
        <Prose paragraphs={dict.method.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.podPac.title}>
        <Prose paragraphs={dict.podPac.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.glossary.title}>
        <GlossaryList terms={dict.glossary.terms} />
      </CalculatorSection>

      <SourceList
        citations={collectCitations()}
        labels={dict.sources}
        title={dict.sources.title}
        lead={dict.sources.lead}
      />
    </CalculatorLayout>
  );
}
