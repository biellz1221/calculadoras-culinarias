'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import type { RecipeCard } from '@/lib/recipes/card';

/** Nada muda depois da hidratação, então a inscrição não precisa notificar. */
const noSubscription = () => () => {};

/**
 * A receita como ela sai na impressora.
 *
 * É uma folha à parte, e não a página escondendo controles com CSS. Esconder
 * peça por peça envelhece mal: cada campo novo nasce visível no papel até
 * alguém lembrar de escondê-lo, e o resultado é uma folha com botão de
 * "Salvar" impresso. Aqui a tela e o papel são duas saídas do mesmo
 * `RecipeCard`, então o que aparece na folha é exatamente o que a calculadora
 * declarou como receita — avisos de segurança incluídos.
 *
 * Vai para o `body` por portal porque o CSS de impressão esconde a aplicação
 * inteira: `display: none` num ancestral não se desfaz num descendente, então
 * a folha precisa ser irmã da aplicação, não filha dela.
 */
export function PrintSheet({ card, footer }: { card: RecipeCard; footer: string }) {
  // `document` não existe no build estático; a folha só passa a existir depois
  // da hidratação. Quem imprime com Ctrl+P já está numa página hidratada.
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <article className="print-sheet" aria-hidden="true">
      <header className="print-head">
        <h1>{card.title}</h1>
        {card.subtitle && <p className="print-subtitle">{card.subtitle}</p>}
      </header>

      {card.groups.map((group, index) => (
        <section key={group.heading ?? index} className="print-group">
          {group.heading && <h2>{group.heading}</h2>}
          <dl>
            {group.lines.map((line) => (
              <div
                key={`${line.label}-${line.value}`}
                className={line.strong ? 'print-line print-line-strong' : 'print-line'}
              >
                <dt>{line.label}</dt>
                <dd>{line.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {card.notices.map((notice) => (
        <p key={notice} className="print-notice">
          {notice}
        </p>
      ))}

      <footer className="print-foot">
        {card.sources.length > 0 && <p>{card.sources.join(' · ')}</p>}
        <p>{footer}</p>
      </footer>
    </article>,
    document.body,
  );
}
