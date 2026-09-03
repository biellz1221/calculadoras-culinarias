import { BookShelf } from '@/components/book-shelf';
import { CalculatorIndex } from '@/components/calculator-index';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';

function Section({
  label,
  intro,
  children,
}: {
  label: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-10">
        <h2 className="label-caps shrink-0 pt-1 text-brand-deep">{label}</h2>
        <p className="max-w-xl text-base leading-relaxed text-ink-soft">{intro}</p>
      </div>
      {children}
    </section>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const principles = [
    dict.home.principles.grams,
    dict.home.principles.sources,
    dict.home.principles.divergence,
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-14 sm:px-8 sm:pt-20">
      <section>
        <p
          className="animate-rise label-caps text-brand-deep"
          style={{ animationDelay: '0ms' }}
        >
          {dict.home.eyebrow}
        </p>

        <h1
          className="animate-rise mt-5 max-w-4xl text-display text-balance"
          style={{ animationDelay: '70ms' }}
        >
          {dict.home.title}
        </h1>

        <p
          className="animate-rise mt-7 max-w-2xl text-lead text-ink-soft"
          style={{ animationDelay: '150ms' }}
        >
          {dict.home.lead}
        </p>

        {/* Notas de abertura, no espírito das folhas de rosto de um livro. */}
        <ul
          className="animate-rise mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-3"
          style={{ animationDelay: '230ms' }}
        >
          {principles.map((principle) => (
            <li key={principle.title} className="border-t border-rule-strong pt-4">
              <h2 className="font-display text-base leading-snug font-semibold text-ink">
                {principle.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Section
        label={dict.home.calculatorsTitle}
        intro={dict.home.calculatorsIntro}
      >
        <CalculatorIndex locale={locale} />
      </Section>

      <Section label={dict.home.shelfTitle} intro={dict.home.shelfIntro}>
        <BookShelf />
      </Section>
    </div>
  );
}
