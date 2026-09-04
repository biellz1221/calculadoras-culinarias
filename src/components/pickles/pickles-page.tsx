import { PicklesCalculator } from './pickles-calculator';
import { SafetyPanel } from './safety-panel';
import {
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import { PICKLE_PRESETS } from '@/data/pickles/presets';
import { CLIMATES, RANGES, SAFETY_CITATIONS } from '@/data/pickles/ranges';
import type { Citation } from '@/data/citations';
import { getPicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...PICKLE_PRESETS.flatMap((preset) => preset.citations),
    ...Object.values(RANGES).flatMap((rule) => rule.citations),
    ...Object.values(CLIMATES).flatMap((climate) => climate.citations),
    ...Object.values(SAFETY_CITATIONS).flat(),
  ];
}

export function PicklesPage({ locale }: { locale: Locale }) {
  const dict = getPicklesDictionary(locale);

  return (
    <CalculatorLayout locale={locale} eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead}>
      <PicklesCalculator dict={dict} locale={locale} />

      {/* Segurança vem logo depois do resultado, não no fim da página. */}
      <SafetyPanel dict={dict} />

      <CalculatorSection label={dict.climate.title} educational>
        <div className="mt-8 grid gap-8 border-t border-rule pt-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.climate.fast}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {dict.climate.fastBody}
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.climate.slow}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {dict.climate.slowBody}
            </p>
          </div>
        </div>
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
          calculator="pickles"
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
