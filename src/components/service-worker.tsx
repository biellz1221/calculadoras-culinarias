'use client';

import { useCallback, useEffect, useState } from 'react';

import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';

/**
 * Registra o service worker e avisa quando há versão nova (FR-043).
 *
 * O aviso existe porque a alternativa é pior. Trocar o worker sozinho, com a
 * página aberta, faz o JavaScript já carregado pedir pacotes de uma versão que
 * não é mais a dele — a página quebra no meio de um cálculo, sem explicação. A
 * versão nova espera, a pessoa é avisada e recarrega quando quiser.
 *
 * Em desenvolvimento não registra nada: guardar em cache os pacotes do
 * `next dev`, que trocam a cada salvamento, transforma qualquer edição num
 * mistério.
 */
export function ServiceWorkerBridge({
  locale,
  /**
   * Existe como propriedade, e não como constante lida do ambiente, porque o
   * Vitest entrega `NODE_ENV === 'development'` ao código que transforma. Uma
   * guarda lida direto dali deixaria o aviso de versão nova sem teste nenhum —
   * e ele é justamente a parte cujo defeito ninguém descobre olhando.
   */
  enabled = process.env.NODE_ENV !== 'development',
}: {
  locale: Locale;
  enabled?: boolean;
}) {
  const copy = getDictionary(locale).pwa;
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;

    const watch = (registration: ServiceWorkerRegistration) => {
      // Uma versão pode já estar esperando de uma visita anterior. O
      // `controller` é o que distingue "atualização" de "primeira instalação":
      // sem ele, este é o primeiro worker do site e não há o que avisar.
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaiting(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(installing);
          }
        });
      });
    };

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (!cancelled) watch(registration);
      })
      .catch(() => {
        // Sem service worker o site continua inteiro: ele é melhoria, não
        // requisito. Não há o que dizer à pessoa aqui.
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const update = useCallback(() => {
    if (!waiting) return;

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => window.location.reload(),
      { once: true },
    );
    waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [waiting]);

  if (!waiting || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-card border border-rule bg-surface px-4 py-3 shadow-lift sm:inset-x-auto sm:right-4"
    >
      <p className="text-sm text-ink-soft">{copy.updateReady}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={update}
          className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          {copy.update}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="label-caps rounded-full border border-rule px-3 py-1.5 text-ink-muted transition-colors hover:border-accent hover:text-accent-deep"
        >
          {copy.later}
        </button>
      </div>
    </div>
  );
}
