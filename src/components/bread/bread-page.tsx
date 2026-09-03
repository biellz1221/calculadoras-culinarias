import { BreadCalculator } from './bread-calculator';
import { YeastConverter } from './yeast-converter';
import {
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import { RANGES } from '@/data/bread/ranges';
import { BREAD_PRESETS } from '@/data/bread/presets';
import type { Citation } from '@/data/citations';
import { getBreadDictionary } from '@/i18n/dictionaries/bread';
import type { Locale } from '@/i18n/locales';
import { RISE_TIME_CITATION, YEAST_CITATIONS } from '@/lib/bread/yeast';

/**
 * Reúne todas as citações que a página usa (presets, faixas e conversões) para
 * a seção "Fontes" listar exatamente o que sustenta a tela, sem sobrar nem
 * faltar obra.
 */
function collectCitations(): Citation[] {
  return [
    ...BREAD_PRESETS.flatMap((preset) => preset.citations),
    ...Object.values(RANGES).flatMap((rule) => rule.citations),
    ...Object.values(YEAST_CITATIONS).flat(),
    RISE_TIME_CITATION,
  ];
}

export function BreadPage({ locale }: { locale: Locale }) {
  const dict = getBreadDictionary(locale);

  return (
    <CalculatorLayout locale={locale} eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
      <BreadCalculator dict={dict} locale={locale} />

      <CalculatorSection label={dict.yeastTool.title} lead={dict.yeastTool.lead}>
        <YeastConverter dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.method.title} educational>
        <Prose paragraphs={dict.method.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.faq.title} educational>
        <FaqList items={dict.faq.items} />
      </CalculatorSection>

      <CalculatorSection label={dict.divergence.title} educational lead={dict.divergence.lead}>
        <DivergenceTable
          columns={dict.divergence.columns}
          items={dict.divergence.items}
        />
      </CalculatorSection>

      <CalculatorSection label={dict.glossary.title} educational>
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
