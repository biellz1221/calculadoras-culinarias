import { BrineAuditPanel } from './brine-audit-panel';
import { BrineCalculator } from './brine-calculator';
import {
  CalculatorTool,
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import {
  BRINE_METHODS,
  FOODLAB_TRIAL,
  PUNCTURE_CITATIONS,
  TARGET_CITATIONS,
  TRIAL_CITATIONS,
} from '@/data/brine/methods';
import { SALT_WEIGHT_CITATIONS } from '@/data/brine/salt';
import type { Citation } from '@/data/citations';
import { getBrineDictionary } from '@/i18n/dictionaries/brine';
import { formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...BRINE_METHODS.flatMap((method) => method.citations),
    ...TARGET_CITATIONS,
    ...TRIAL_CITATIONS,
    ...PUNCTURE_CITATIONS,
    ...SALT_WEIGHT_CITATIONS,
  ];
}

export function BrinePage({ locale }: { locale: Locale }) {
  const dict = getBrineDictionary(locale);
  const percent = (value: number) => formatPercent(value * 100, locale, 1);

  return (
    <CalculatorLayout
      locale={locale}
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={dict.lead}
    >
      <CalculatorTool label={dict.eyebrow}>
        <BrineCalculator dict={dict} locale={locale} />
      </CalculatorTool>

      {/* Não é `educational`: é a medição que sustenta a escolha entre os dois
          métodos, e some junto com o resto na interface simplificada seria
          esconder a razão de a página oferecer os dois. */}
      <CalculatorSection label={dict.audit.title}>
        <BrineAuditPanel dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.trial.title} lead={dict.trial.lead}>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  {dict.trial.treatment}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold text-ink">
                  {dict.trial.afterSoak}
                </th>
                <th scope="col" className="py-2 text-right font-semibold text-ink">
                  {dict.trial.afterCooking}
                </th>
              </tr>
            </thead>
            <tbody>
              {FOODLAB_TRIAL.map((row) => (
                <tr key={row.id} className="border-b border-rule/70 last:border-b-0">
                  <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-soft">
                    {dict.trial.rows[row.id]}
                  </th>
                  <td
                    data-numeric
                    className="py-2 pr-4 text-right tabular-nums text-ink-muted"
                  >
                    {percent(row.afterSoak)}
                  </td>
                  <td
                    data-numeric
                    className="py-2 text-right font-semibold tabular-nums text-ink"
                  >
                    {percent(row.afterCooking)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">
          {dict.trial.verdict}
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
          calculator="brine"
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
