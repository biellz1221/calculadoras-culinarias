import { JamCalculator } from './jam-calculator';
import {
  CalculatorLayout,
  CalculatorSection,
  DivergenceTable,
  GlossaryList,
  Prose,
} from '@/components/calculator-layout';
import { CitationRef, SourceList } from '@/components/citation';
import { FaqList } from '@/components/faq';
import type { Citation } from '@/data/citations';
import {
  EMBRAPA_BRIX_CITATIONS,
  EMBRAPA_BRIX_TABLE,
  EMBRAPA_TABLE,
  EMBRAPA_TABLE_CITATIONS,
  LEGAL_CITATIONS,
  LEGAL_PARTS,
  LEGAL_SOLUBLE_SOLIDS,
  PECTIN_DOSE_CITATIONS,
  PH_CITATIONS,
  PH_FIELD_RULE_CITATIONS,
  TOTAL_ACIDITY_CITATIONS,
  legalSugarRatio,
} from '@/data/jam/brazil';
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
import { formatNumber, formatPercent } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';
import { labelFor } from '@/lib/recipes/card';

function collectCitations(): Citation[] {
  return [
    ...JAM_FRUITS.flatMap((fruit) => fruit.citations),
    ...PECTIN_GROUP_CITATIONS,
    ...FERBER_SUGAR_CITATIONS,
    ...FERBER_APPLE_JELLY_CITATIONS,
    ...SETTING_POINT_CITATIONS,
    ...PROCESSING_CITATIONS,
    ...ALTITUDE_CITATIONS,
    ...EMBRAPA_TABLE_CITATIONS,
    ...LEGAL_CITATIONS,
    ...PECTIN_DOSE_CITATIONS,
    ...PH_CITATIONS,
    ...PH_FIELD_RULE_CITATIONS,
    ...TOTAL_ACIDITY_CITATIONS,
    ...EMBRAPA_BRIX_CITATIONS,
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

      {/* Também não é `educational`. A fruta brasileira é o que esta página
          tem que nenhuma calculadora de geleia em inglês tem, e a régua legal é
          o que explica por que o número dela é tão maior que o dos livros. */}
      <CalculatorSection label={dict.brazil.title} lead={dict.brazil.lead}>
        <h3 className="mt-8 font-display text-lg font-semibold text-ink">
          {dict.brazil.legalTitle}
        </h3>
        <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
          {dict.brazil.legalLead}
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">{dict.brazil.legalTitle}</caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  {dict.brazil.legalColumns.kind}
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  {dict.brazil.legalColumns.parts}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold text-ink">
                  {dict.brazil.legalColumns.ratio}
                </th>
                <th scope="col" className="py-2 text-right font-semibold text-ink">
                  {dict.brazil.legalColumns.solids}
                </th>
              </tr>
            </thead>
            <tbody>
              <LegalRow
                label={dict.brazil.legalExtra}
                parts={LEGAL_PARTS.extra}
                solids={LEGAL_SOLUBLE_SOLIDS.extra}
                locale={locale}
              />
              <LegalRow
                label={dict.brazil.legalCommon}
                parts={LEGAL_PARTS.common}
                solids={LEGAL_SOLUBLE_SOLIDS.common}
                locale={locale}
              />
              <LegalRow
                label={dict.brazil.legalException}
                parts={LEGAL_PARTS.commonException}
                solids={LEGAL_SOLUBLE_SOLIDS.common}
                locale={locale}
              />
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-prose rounded-card bg-accent-tint/60 px-4 py-3 text-sm leading-relaxed text-ink">
          {dict.brazil.legalNote}
        </p>
        <CitationRef
          citations={LEGAL_CITATIONS}
          labels={dict.sources}
          className="mt-2 block"
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {dict.brazil.pectinTitle}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{dict.brazil.pectinBody}</p>
            <CitationRef
              citations={PECTIN_DOSE_CITATIONS}
              labels={dict.sources}
              className="mt-2 block"
            />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {dict.brazil.phTitle}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{dict.brazil.phBody}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {dict.brazil.acidityBody}
            </p>
            <CitationRef
              citations={[...PH_CITATIONS, ...PH_FIELD_RULE_CITATIONS, ...TOTAL_ACIDITY_CITATIONS]}
              labels={dict.sources}
              className="mt-2 block"
            />
          </div>
        </div>

        <h3 className="mt-10 font-display text-lg font-semibold text-ink">
          {dict.brazil.tableTitle}
        </h3>
        <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
          {dict.brazil.tableLead}
        </p>
        <div className="mt-5 max-h-[32rem] overflow-auto rounded-card border border-rule">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <caption className="sr-only">{dict.brazil.tableTitle}</caption>
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-rule text-left">
                <th scope="col" className="px-4 py-2 font-semibold text-ink">
                  {dict.brazil.tableColumns.fruit}
                </th>
                <th scope="col" className="px-4 py-2 font-semibold text-ink">
                  {dict.brazil.tableColumns.pectin}
                </th>
                <th scope="col" className="px-4 py-2 font-semibold text-ink">
                  {dict.brazil.tableColumns.acidity}
                </th>
                <th scope="col" className="px-4 py-2 font-semibold text-ink">
                  {dict.brazil.tableColumns.origin}
                </th>
              </tr>
            </thead>
            <tbody>
              {EMBRAPA_TABLE.map((row) => (
                <tr key={row.id} className="border-b border-rule/60 last:border-b-0">
                  <th scope="row" className="px-4 py-2 text-left font-normal text-ink">
                    {labelFor(dict.fruits, row.id)}
                  </th>
                  <td className="px-4 py-2 text-ink-soft">
                    {dict.embrapa.pectinLevels[row.pectin]}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">
                    {dict.embrapa.acidityLevels[row.acidity]}
                  </td>
                  <td className="px-4 py-2 text-xs text-ink-muted">
                    {row.viaJackix ? dict.brazil.jackix : dict.brazil.torrezan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
          {dict.brazil.tableNote}
        </p>
        <CitationRef
          citations={EMBRAPA_TABLE_CITATIONS}
          labels={dict.sources}
          className="mt-2 block"
        />

        <h3 className="mt-10 font-display text-lg font-semibold text-ink">
          {dict.brazil.brixTitle}
        </h3>
        <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">
          {dict.brazil.brixLead}
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <caption className="sr-only">{dict.brazil.brixTitle}</caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  {dict.brazil.brixHeader}
                </th>
                {EMBRAPA_BRIX_TABLE.altitudes.map((metres) => (
                  <th
                    key={metres}
                    scope="col"
                    className="py-2 pr-3 text-right font-normal tabular-nums text-ink-muted"
                  >
                    {`${formatNumber(metres, locale)} m`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMBRAPA_BRIX_TABLE.rows.map((row) => (
                <tr key={row.brix} className="border-b border-rule/60 last:border-b-0">
                  <th scope="row" className="py-2 pr-4 text-left font-semibold text-ink">
                    {formatNumber(row.brix, locale)}
                  </th>
                  {row.celsius.map((value, index) => (
                    <td
                      key={EMBRAPA_BRIX_TABLE.altitudes[index]}
                      data-numeric
                      className="py-2 pr-3 text-right tabular-nums text-ink-soft"
                    >
                      {formatNumber(value, locale, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">
          {dict.brazil.brixNote}
        </p>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
          {dict.brazil.thirdHand}
        </p>
        <CitationRef
          citations={EMBRAPA_BRIX_CITATIONS}
          labels={dict.sources}
          className="mt-2 block"
        />
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

/** Uma classe da norma: partes, proporção derivada e sólidos solúveis. */
function LegalRow({
  label,
  parts,
  solids,
  locale,
}: {
  label: string;
  parts: { readonly fruit: number; readonly sugar: number };
  solids: number;
  locale: Locale;
}) {
  return (
    <tr className="border-b border-rule/60 last:border-b-0">
      <th scope="row" className="py-2 pr-4 text-left font-normal text-ink">
        {label}
      </th>
      <td data-numeric className="py-2 pr-4 tabular-nums text-ink-soft">
        {`${formatNumber(parts.fruit, locale)} : ${formatNumber(parts.sugar, locale)}`}
      </td>
      <td data-numeric className="py-2 pr-4 text-right tabular-nums text-ink-soft">
        {formatNumber(legalSugarRatio(parts), locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td data-numeric className="py-2 text-right tabular-nums text-ink-soft">
        {formatPercent(solids * 100, locale, 0)}
      </td>
    </tr>
  );
}
