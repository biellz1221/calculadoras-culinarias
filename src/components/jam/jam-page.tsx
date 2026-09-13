import { JamCalculator } from './jam-calculator';
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
  FERBER_APPLE_JELLY_CITATIONS,
  FERBER_SUGAR_CITATIONS,
  JAM_FRUITS,
  PECTIN_GROUP_CITATIONS,
} from '@/data/jam/fruits';
import {
  ALTITUDE_CITATIONS,
  NCHFP_SETTING_TABLE,
  PROCESSING_CITATIONS,
  SETTING_POINT_CITATIONS,
} from '@/data/jam/setting-point';
import { getJamDictionary } from '@/i18n/dictionaries/jam';
import { formatNumber } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...JAM_FRUITS.flatMap((fruit) => fruit.citations),
    ...PECTIN_GROUP_CITATIONS,
    ...FERBER_SUGAR_CITATIONS,
    ...FERBER_APPLE_JELLY_CITATIONS,
    ...SETTING_POINT_CITATIONS,
    ...PROCESSING_CITATIONS,
    ...ALTITUDE_CITATIONS,
  ];
}

export function JamPage({ locale }: { locale: Locale }) {
  const dict = getJamDictionary(locale);

  return (
    <CalculatorLayout
      locale={locale}
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={dict.lead}
    >
      <JamCalculator dict={dict} locale={locale} />

      {/* Não é `educational`: a tabela por altitude é a razão de ser desta
          página, e escondê-la na interface simplificada seria esconder
          justamente o que os livros não dão. */}
      <CalculatorSection label={dict.point.title} lead={dict.point.lead}>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <caption className="sr-only">{dict.point.title}</caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  m
                </th>
                {NCHFP_SETTING_TABLE.map((row) => (
                  <th
                    key={row.feet}
                    scope="col"
                    className="py-2 pr-3 text-right font-normal tabular-nums text-ink-muted"
                  >
                    {Math.round(row.feet * 0.3048)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* A linha em °F é a da fonte, tal como publicada. A de °C é
                  conversão, e vem junto porque quem lê em português não
                  cozinha em Fahrenheit. */}
              <tr>
                <th scope="row" className="py-2 pr-4 text-left font-semibold text-ink">
                  °F
                </th>
                {NCHFP_SETTING_TABLE.map((row) => (
                  <td
                    key={row.feet}
                    data-numeric
                    className="py-2 pr-3 text-right tabular-nums text-ink-soft"
                  >
                    {row.fahrenheit}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-rule/70">
                <th scope="row" className="py-2 pr-4 text-left font-semibold text-ink">
                  °C
                </th>
                {NCHFP_SETTING_TABLE.map((row) => (
                  <td
                    key={row.feet}
                    data-numeric
                    className="py-2 pr-3 text-right tabular-nums text-ink-soft"
                  >
                    {formatNumber(((row.fahrenheit - 32) * 5) / 9, locale, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-prose rounded-card bg-warn-tint px-4 py-3 leading-relaxed text-warn">
          {dict.point.honesty}
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
          calculator="jam"
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
