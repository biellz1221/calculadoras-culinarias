import Link from 'next/link';

import { getBook } from '@/data/books';
import {
  CALCULATORS,
  isAvailable,
  type Calculator,
  type CalculatorAccent,
} from '@/data/calculators';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';
import { cn } from '@/lib/cn';

/* Classes escritas por extenso para o scanner do Tailwind enxergar. */
const ACCENT: Record<CalculatorAccent, { bar: string; wash: string; text: string }> = {
  wheat: { bar: 'bg-wheat', wash: 'group-hover:bg-wheat-tint', text: 'text-wheat' },
  sage: { bar: 'bg-sage', wash: 'group-hover:bg-sage-tint', text: 'text-sage' },
  terracotta: {
    bar: 'bg-terracotta',
    wash: 'group-hover:bg-terracotta-tint',
    text: 'text-terracotta',
  },
  rose: { bar: 'bg-rose', wash: 'group-hover:bg-rose-tint', text: 'text-rose' },
};

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

interface RowProps {
  calculator: Calculator;
  index: number;
  locale: Locale;
}

function Row({ calculator, index, locale }: RowProps) {
  const dict = getDictionary(locale);
  const accent = ACCENT[calculator.accent];
  const meta = dict.calculators[calculator.id];
  const available = isAvailable(calculator);

  const sources = calculator.sources
    .map((id) => getBook(id).title)
    .join(' · ');

  const body = (
    <>
      <span
        data-numeric
        className={cn(
          'col-start-1 row-start-1 self-center font-display text-sm leading-none tabular-nums',
          available ? accent.text : 'text-ink-muted/70',
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* A aba colorida do fichário, correndo por toda a altura da linha. */}
      <span
        aria-hidden="true"
        className={cn(
          'col-start-2 row-span-2 row-start-1 w-1 rounded-full transition-all duration-300',
          accent.bar,
          available ? 'opacity-100 group-hover:w-1.5' : 'opacity-35',
        )}
      />

      <h3
        className={cn(
          'col-start-3 row-start-1 self-center font-display text-xl leading-snug font-semibold sm:text-2xl',
          available ? 'text-ink' : 'text-ink-soft',
        )}
      >
        {meta.name}
      </h3>

      <div className="col-start-4 row-start-1 flex items-center justify-end self-center">
        {available ? (
          <Arrow className="size-5 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
        ) : (
          <span className="label-caps rounded-full border border-rule px-2.5 py-1 text-ink-muted/80 whitespace-nowrap">
            {dict.home.comingSoon}
          </span>
        )}
      </div>

      {/* Descrição e créditos ocupam a largura toda — em tela estreita, dividir
          espaço com o selo de status espremia o texto em cinco linhas. */}
      <div className="col-start-3 col-end-5 row-start-2 mt-2 min-w-0">
        <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
          {meta.blurb}
        </p>
        {sources.length > 0 && (
          <p className="mt-3 text-xs leading-relaxed text-ink-muted/85">
            <span className="label-caps mr-1.5 text-ink-muted/70">
              {dict.home.basedOn}
            </span>
            <span className="font-display italic">{sources}</span>
          </p>
        )}
      </div>
    </>
  );

  const layout =
    'grid grid-cols-[1.5rem_0.25rem_1fr_auto] grid-rows-[auto_auto] items-stretch gap-x-3 rounded-card px-2 py-5 sm:gap-x-5 sm:px-5';

  return (
    <li className="border-b border-rule last:border-b-0">
      {available ? (
        <Link
          href={pathFor(calculator.route, locale)}
          aria-label={`${dict.home.openCalculator} ${meta.name}`}
          className={cn(
            layout,
            'group no-underline transition-colors duration-300',
            accent.wash,
          )}
        >
          {body}
        </Link>
      ) : (
        <div className={cn(layout, 'group')}>{body}</div>
      )}
    </li>
  );
}

export function CalculatorIndex({ locale }: { locale: Locale }) {
  return (
    <ol className="mt-10 border-y border-rule">
      {CALCULATORS.map((calculator, index) => (
        <Row
          key={calculator.id}
          calculator={calculator}
          index={index}
          locale={locale}
        />
      ))}
    </ol>
  );
}
