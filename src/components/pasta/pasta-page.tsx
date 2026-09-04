import { PastaCalculator } from './pasta-calculator';
import { DishTable, ShapeGuide } from './shape-guide';
import {
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import type { Citation } from '@/data/citations';
import {
  PASTA_DISHES,
  TORTELLINI_CITATIONS,
} from '@/data/pasta/dishes';
import {
  COOKING_WATER_CITATIONS,
  COOK_MINUTES,
  PASTA_PRESETS,
} from '@/data/pasta/presets';
import { PASTA_RANGES, SERVING_CITATIONS } from '@/data/pasta/ranges';
import { PASTA_SHAPES } from '@/data/pasta/shapes';
import { getPastaDictionary } from '@/i18n/dictionaries/pasta';
import type { Locale } from '@/i18n/locales';

/**
 * Todas as citações que sustentam a tela (presets, faixas, formatos, pratos e
 * cozimento) para a seção "Fontes" listar exatamente o que está em uso, sem
 * sobrar nem faltar obra.
 */
function collectCitations(): Citation[] {
  return [
    ...PASTA_PRESETS.flatMap((preset) => preset.citations),
    ...Object.values(PASTA_RANGES).flatMap((rule) => rule.citations),
    ...Object.values(SERVING_CITATIONS).flat(),
    ...PASTA_SHAPES.flatMap((shape) => shape.citations),
    ...PASTA_DISHES.flatMap((dish) => dish.citations),
    ...Object.values(COOK_MINUTES).flatMap((rule) => rule.citations),
    ...COOKING_WATER_CITATIONS,
    ...TORTELLINI_CITATIONS,
  ];
}

export function PastaPage({ locale }: { locale: Locale }) {
  const dict = getPastaDictionary(locale);

  return (
    <CalculatorLayout locale={locale} eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
      <PastaCalculator dict={dict} locale={locale} />

      <CalculatorSection label={dict.shapes.title} lead={dict.shapes.lead}>
        <ShapeGuide dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.dishes.title} lead={dict.dishes.lead}>
        <DishTable dict={dict} locale={locale} />
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
        <GlossaryList
          calculator="pasta"
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
