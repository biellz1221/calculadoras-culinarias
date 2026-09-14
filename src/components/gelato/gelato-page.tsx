import { GelatoCalculator } from './gelato-calculator';
import { OverrunBench } from './overrun-bench';
import {
  CalculatorLayout,
  CalculatorSection,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import {
  CORVITTO_LITRE_CITATIONS,
  GELATO_OVERRUN_CITATIONS,
  ICE_EXPANSION_CITATIONS,
  INDUSTRIAL_OVERRUN_CITATIONS,
  MIX_DENSITY_CITATIONS,
  OVERRUN_METHOD_CITATIONS,
} from '@/data/gelato/aeration';
import { GELATO_CITATIONS } from '@/data/gelato/source';
import type { Citation } from '@/data/citations';
import { getGelatoDictionary } from '@/i18n/dictionaries/gelato';
import type { Locale } from '@/i18n/locales';

/**
 * O balanceamento vem da planilha do curso e não tem página para citar; o ar e
 * o peso de um litro, que a planilha não cobre, vêm de dois livros. A chamada
 * da seção diz os dois lados sem rodeio.
 */
function collectCitations(): Citation[] {
  return [
    ...Object.values(GELATO_CITATIONS),
    ...GELATO_OVERRUN_CITATIONS,
    ...INDUSTRIAL_OVERRUN_CITATIONS,
    ...MIX_DENSITY_CITATIONS,
    ...CORVITTO_LITRE_CITATIONS,
    ...OVERRUN_METHOD_CITATIONS,
    ...ICE_EXPANSION_CITATIONS,
  ];
}

export function GelatoPage({ locale }: { locale: Locale }) {
  const dict = getGelatoDictionary(locale);

  return (
    <CalculatorLayout locale={locale} eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
      <GelatoCalculator dict={dict} locale={locale} />

      {/* Não é `educational`: o ar é o que separa a calda que a calculadora
          balanceia do gelato que sai da máquina, e foi a única parte desta
          página que ficou anos sem fonte. Sumir na interface simplificada
          seria esconder justamente o que passou a ter livro. */}
      <CalculatorSection label={dict.aeration.title} lead={dict.aeration.lead}>
        <OverrunBench dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.method.title} educational>
        <Prose paragraphs={dict.method.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.faq.title} educational>
        <FaqList items={dict.faq.items} />
      </CalculatorSection>

      <CalculatorSection label={dict.podPac.title}>
        <Prose paragraphs={dict.podPac.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.glossary.title} educational>
        <GlossaryList
          calculator="gelato"
          terms={dict.glossary.terms}
          labels={dict.sources}
          noSourceLabel={dict.glossary.noSource}
          anchorLabel={dict.glossary.anchor}
        />
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
