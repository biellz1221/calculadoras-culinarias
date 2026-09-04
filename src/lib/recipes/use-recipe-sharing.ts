'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { decodeSnapshot, encodeSnapshot, SHARE_PARAM } from './snapshot';
import type { CalculatorId } from '@/data/calculators';

/**
 * O lado do link: abrir um recebido e montar um novo.
 *
 * A leitura acontece depois da hidratação, e não durante o render, porque o
 * HTML é gerado no build e é igual para todo mundo. Um estado inicial que
 * dependesse da query quebraria a hidratação — o servidor não tem como saber o
 * que vem depois do `?`.
 */

export type LinkStatus =
  /** Ninguém chegou por link compartilhado. */
  | 'none'
  | 'restored'
  /** Link de uma versão do formato que esta build não sabe ler. */
  | 'outdated'
  /** Ilegível: truncado no aplicativo de mensagem, editado à mão, corrompido. */
  | 'invalid';

export interface RecipeSharing {
  readonly status: LinkStatus;
  /** Endereço da página com o estado atual embutido. */
  buildLink: () => string;
  dismiss: () => void;
}

export function useRecipeSharing<S>({
  calculator,
  state,
  parse,
  onRestore,
}: {
  calculator: CalculatorId;
  state: S;
  parse: (value: unknown) => S | null;
  onRestore: (state: S) => void;
}): RecipeSharing {
  const [status, setStatus] = useState<LinkStatus>('none');
  const restored = useRef<S | null>(null);
  /**
   * O estado restaurado já chegou à calculadora.
   *
   * Sem esta trava, o efeito de limpeza rodava no mesmo commit da restauração —
   * quando `state` ainda é o inicial e portanto já difere do restaurado — e
   * apagava o `?r=` da barra antes de a receita compartilhada aparecer.
   */
  const applied = useRef(false);

  // Refs para o efeito de montagem não depender da identidade das funções, que
  // muda a cada render da calculadora. Sincronizados num efeito declarado
  // antes, que por isso roda antes.
  const parseRef = useRef(parse);
  const restoreRef = useRef(onRestore);

  useEffect(() => {
    parseRef.current = parse;
    restoreRef.current = onRestore;
  });

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (!encoded) return;

    const result = decodeSnapshot(encoded, calculator, parseRef.current);

    if (result.status === 'ok') {
      restored.current = result.state;
      restoreRef.current(result.state);
      setStatus('restored');
      return;
    }

    setStatus(result.status === 'outdated' ? 'outdated' : 'invalid');
  }, [calculator]);

  /**
   * Endereço não pode mentir.
   *
   * Quem abriu um link e mexeu nos campos tem outra receita na tela; deixar o
   * `?r=` antigo na barra faria a próxima pessoa receber o cálculo errado por
   * ter copiado o endereço em vez de usar o botão. `replaceState` limpa sem
   * empilhar histórico, então o botão de voltar continua fazendo o esperado.
   */
  useEffect(() => {
    if (restored.current === null) return;

    if (state === restored.current) {
      applied.current = true;
      return;
    }

    if (!applied.current) return;

    restored.current = null;
    applied.current = false;
    setStatus('none');

    const url = new URL(window.location.href);
    if (!url.searchParams.has(SHARE_PARAM)) return;

    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [state]);

  const buildLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set(SHARE_PARAM, encodeSnapshot(calculator, state));

    return url.toString();
  }, [calculator, state]);

  const dismiss = useCallback(() => setStatus('none'), []);

  return { status, buildLink, dismiss };
}
