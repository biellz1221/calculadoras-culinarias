import { ingredientLabelOrFallback } from './catalog';
import type { GelatoDictionary } from '@/i18n/dictionaries/gelato';
import { cn } from '@/lib/cn';
import type { CompositionFlaw } from '@/lib/gelato/composition';

/**
 * Aviso dos ingredientes cuja composição não fecha na planilha de origem.
 *
 * O dado NÃO é corrigido: a procedência é a planilha, e alterar número de fonte
 * em silêncio é exatamente o que este site promete não fazer. O que a interface
 * pode fazer é dizer onde o resultado ficou menos confiável — e por quê.
 */
export function FlawNotice({
  flaws,
  dict,
}: {
  flaws: readonly CompositionFlaw[];
  dict: GelatoDictionary;
}) {
  if (flaws.length === 0) return null;

  return (
    <section className="mt-8 rounded-card border border-rule bg-surface p-5 sm:p-6">
      <h2 className="label-caps text-warn">
        <span aria-hidden="true">! </span>
        {dict.flaws.title}
      </h2>

      <ul className="mt-4 space-y-4 border-t border-rule pt-4">
        {flaws.map((flaw) => (
          <li key={flaw.ingredientId}>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-base font-semibold text-ink">
                {ingredientLabelOrFallback(dict, flaw.ingredientId)}
              </span>
              <span
                className={cn(
                  'label-caps rounded-full px-2.5 py-1',
                  flaw.severity === 'severe'
                    ? 'bg-danger-tint text-danger'
                    : 'bg-warn-tint text-warn',
                )}
              >
                {dict.flaws.severity[flaw.severity]}
              </span>
            </p>
            <ul className="mt-1.5 space-y-1">
              {flaw.issues.map((issue) => (
                <li key={issue} className="max-w-prose text-sm leading-relaxed text-ink-muted">
                  {dict.flaws.issues[issue]}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-prose border-t border-rule pt-4 text-sm leading-relaxed text-ink-soft">
        {dict.flaws.lead}
      </p>
    </section>
  );
}
