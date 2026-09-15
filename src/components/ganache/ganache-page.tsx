import { GanacheAuditPanel } from './ganache-audit-panel';
import { GanacheCalculator } from './ganache-calculator';
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
import type { Citation } from '@/data/citations';
import {
  AW_CITATIONS,
  FREEZING_CITATIONS,
  GANACHE_TEXTURES,
  SHELF_LIFE_CITATIONS,
  WATER_ACTIVITY,
  WATER_CITATIONS,
  WHITE_CITATIONS,
} from '@/data/ganache/textures';
import { getGanacheDictionary } from '@/i18n/dictionaries/ganache';
import { formatNumber } from '@/i18n/format';
import type { Locale } from '@/i18n/locales';

function collectCitations(): Citation[] {
  return [
    ...GANACHE_TEXTURES.flatMap((texture) => texture.citations),
    ...WHITE_CITATIONS,
    ...WATER_CITATIONS,
    ...AW_CITATIONS,
    ...SHELF_LIFE_CITATIONS,
    ...FREEZING_CITATIONS,
  ];
}

/** Rótulos dos ingredientes da tabela de Aw. Nome próprio de ingrediente. */
const AW_LABELS: Record<string, { 'pt-BR': string; en: string }> = {
  cream: { 'pt-BR': 'Creme 35% e 40%', en: 'Cream 35% and 40%' },
  butter: { 'pt-BR': 'Manteiga', en: 'Butter' },
  'condensed-milk': { 'pt-BR': 'Leite condensado', en: 'Condensed milk' },
  'sweetened-condensed-milk': {
    'pt-BR': 'Leite condensado açucarado',
    en: 'Sweetened condensed milk',
  },
  fondant: { 'pt-BR': 'Fondant', en: 'Fondant sugar' },
  marzipan: { 'pt-BR': 'Marzipã comercial', en: 'Commercial marzipan' },
  chocolate: {
    'pt-BR': 'Chocolate amargo, ao leite e branco',
    en: 'Dark, milk and white chocolate',
  },
};

export function GanachePage({ locale }: { locale: Locale }) {
  const dict = getGanacheDictionary(locale);

  return (
    <CalculatorLayout
      locale={locale}
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={dict.lead}
    >
      <CalculatorTool label={dict.eyebrow}>
        <GanacheCalculator dict={dict} locale={locale} />
      </CalculatorTool>

      {/* Não é `educational`: a validade é a razão de ser desta página, e o que
          a sustenta é a tabela de Aw. Some junto com o resto na interface
          simplificada seria esconder o argumento. */}
      <CalculatorSection label={dict.audit.title}>
        <GanacheAuditPanel dict={dict} locale={locale} />
      </CalculatorSection>

      <CalculatorSection label={dict.shelf.title} lead={dict.shelf.lead}>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="label-caps text-ink-muted">{dict.shelf.awTitle}</h3>
            <dl className="mt-3">
              {dict.shelf.awRows.map((row) => (
                <div
                  key={row.range}
                  className="border-b border-rule/70 py-2 last:border-b-0"
                >
                  <dt data-numeric className="text-sm font-semibold text-ink">
                    {row.range}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-soft">{row.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="label-caps text-ink-muted">{dict.shelf.ingredients}</h3>
            <dl className="mt-3">
              {WATER_ACTIVITY.map((row) => (
                <div
                  key={row.id}
                  className="flex items-baseline justify-between gap-4 border-b border-rule/70 py-2 last:border-b-0"
                >
                  <dt className="text-sm text-ink-soft">{AW_LABELS[row.id]?.[locale]}</dt>
                  <dd
                    data-numeric
                    className="text-sm font-semibold tabular-nums text-ink"
                  >
                    {formatNumber(row.aw, locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="mt-6 max-w-prose rounded-card bg-warn-tint px-4 py-3 leading-relaxed text-warn">
          {dict.shelf.honesty}
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
          calculator="ganache"
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
