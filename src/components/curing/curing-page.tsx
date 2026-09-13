import { CuringCalculator } from './curing-calculator';
import {
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import { CURE_SALTS, METHOD_CITATIONS, MIN_INGOING_CITATIONS, RESIDUAL_LIMITS } from '@/data/curing/cures';
import type { Citation } from '@/data/citations';
import { getCuringDictionary } from '@/i18n/dictionaries/curing';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...CURE_SALTS.flatMap((cure) => cure.citations),
    ...MIN_INGOING_CITATIONS,
    ...METHOD_CITATIONS,
    ...RESIDUAL_LIMITS.br.citations,
    ...RESIDUAL_LIMITS.us.citations,
  ];
}

export function CuringPage({ locale }: { locale: Locale }) {
  const dict = getCuringDictionary(locale);

  return (
    <CalculatorLayout
      locale={locale}
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={dict.lead}
    >
      <CuringCalculator dict={dict} locale={locale} />

      {/* Não é `educational`: a diferença entre entrada e resíduo é a razão de
          ser desta página, e some junto com o resto na interface simplificada
          seria esconder justamente o que ninguém mais explica. */}
      <CalculatorSection label={dict.limits.title} lead={dict.limits.lead}>
        <div className="mt-8 grid gap-8 border-t border-rule pt-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.limits.ingoingTitle}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {dict.limits.ingoingBody}
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-ink">
              {dict.limits.residualTitle}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {dict.limits.residualBody}
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-prose rounded-card bg-warn-tint px-4 py-3 leading-relaxed text-warn">
          {dict.limits.honesty}
        </p>
      </CalculatorSection>

      <CalculatorSection label={dict.method.title} educational>
        <Prose paragraphs={dict.method.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.faq.title} educational>
        <FaqList items={dict.faq.items} />
      </CalculatorSection>

      <CalculatorSection
        label={dict.divergence.title}
        educational
        lead={dict.divergence.lead}
      >
        <DivergenceTable columns={dict.divergence.columns} items={dict.divergence.items} />
      </CalculatorSection>

      <CalculatorSection label={dict.glossary.title} educational>
        <GlossaryList
          calculator="curing"
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
