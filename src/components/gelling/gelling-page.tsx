import { DoseAuditPanel } from './dose-audit-panel';
import { GellingCalculator } from './gelling-calculator';
import { SpherificationPanel } from './spherification-panel';
import {
  CalculatorLayout,
  CalculatorSection,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import type { Citation } from '@/data/citations';
import {
  AGENTS,
  BLOOM_CITATIONS,
  FIRM_CUSTARD_CITATIONS,
  GEL_MODIFIERS,
  MODIFIER_CITATIONS,
  SPHERIFICATION_CITATIONS,
  SPHERIFICATION_METHODS,
} from '@/data/gelling/agents';
import { getGellingDictionary } from '@/i18n/dictionaries/gelling';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...AGENTS.flatMap((agent) => agent.citations),
    ...BLOOM_CITATIONS,
    ...FIRM_CUSTARD_CITATIONS,
    ...MODIFIER_CITATIONS,
    ...SPHERIFICATION_CITATIONS,
    ...SPHERIFICATION_METHODS.flatMap((m) => m.citations),
  ];
}

export function GellingPage({ locale }: { locale: Locale }) {
  const dict = getGellingDictionary(locale);

  return (
    <CalculatorLayout
      locale={locale}
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={dict.lead}
    >
      <GellingCalculator dict={dict} locale={locale} />

      {/* Não é `educational`: numa página em que o gel pode simplesmente não
          firmar, saber que o sal enfraquece e o açúcar reforça é parte do
          resultado, não curiosidade. */}
      <CalculatorSection label={dict.audit.title}>
        <DoseAuditPanel dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.firmness.title} lead={dict.firmness.lead}>
        <dl className="mt-8 grid max-w-2xl gap-x-10 gap-y-4 sm:grid-cols-2">
          {GEL_MODIFIERS.map((modifier) => (
            <div key={modifier.id}>
              <dt className="label-caps text-accent-deep">
                {modifier.direction === 'stronger'
                  ? dict.firmness.stronger
                  : dict.firmness.weaker}
              </dt>
              <dd className="mt-1 leading-relaxed text-ink-soft">
                {dict.firmness.modifiers[modifier.id]}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">
          {dict.firmness.compensate}
        </p>
      </CalculatorSection>

      <CalculatorSection label={dict.truth.title} educational>
        <Prose paragraphs={dict.truth.body} />
      </CalculatorSection>

      {/* Não é `educational`: a esferificação era a lacuna declarada da página
          até 2026-09-15, e agora é metade do que ela entrega. */}
      <CalculatorSection
        label={dict.spherification.title}
        lead={dict.spherification.lead}
      >
        <SpherificationPanel dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.sourceNote.title} educational>
        <Prose paragraphs={dict.sourceNote.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.ocr.title} educational>
        <Prose paragraphs={dict.ocr.body} />
      </CalculatorSection>

      <CalculatorSection label={dict.glossary.title} educational>
        <GlossaryList
          calculator="gelling"
          terms={dict.glossary.terms}
          labels={dict.sources}
          noSourceLabel={dict.glossary.noSource}
          anchorLabel={dict.glossary.anchor}
        />
      </CalculatorSection>

      <CalculatorSection label={dict.faq.title} educational>
        <FaqList items={dict.faq.items} />
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
