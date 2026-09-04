import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ServiceWorkerBridge } from './service-worker';
import { getDictionary } from '@/i18n';

const copy = getDictionary('pt-BR').pwa;

/**
 * O aviso de versão nova é a parte da qual ninguém descobre o defeito olhando:
 * ele só aparece quando existe uma versão esperando, e isso não acontece na
 * navegação normal de quem está desenvolvendo. Aqui o registro é falsificado
 * para o caminho inteiro ficar visível.
 */

type Listener = (event?: unknown) => void;

/** Um worker de mentira, com o mínimo do contrato que o componente usa. */
function fakeWorker() {
  const listeners = new Map<string, Listener[]>();

  return {
    state: 'installing' as ServiceWorker['state'],
    postMessage: vi.fn(),
    addEventListener: (type: string, listener: Listener) => {
      listeners.set(type, [...(listeners.get(type) ?? []), listener]);
    },
    emit(type: string) {
      for (const listener of listeners.get(type) ?? []) listener();
    },
  };
}

function install({
  waiting = null,
  controller = {},
}: {
  waiting?: ReturnType<typeof fakeWorker> | null;
  controller?: unknown;
} = {}) {
  const registrationListeners = new Map<string, Listener[]>();

  const registration = {
    waiting,
    installing: null as ReturnType<typeof fakeWorker> | null,
    addEventListener: (type: string, listener: Listener) => {
      registrationListeners.set(type, [
        ...(registrationListeners.get(type) ?? []),
        listener,
      ]);
    },
    emit(type: string) {
      for (const listener of registrationListeners.get(type) ?? []) listener();
    },
  };

  const containerListeners = new Map<string, Listener[]>();

  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {
      controller,
      register: vi.fn().mockResolvedValue(registration),
      addEventListener: (type: string, listener: Listener) => {
        containerListeners.set(type, [
          ...(containerListeners.get(type) ?? []),
          listener,
        ]);
      },
    },
  });

  return { registration, containerListeners };
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'serviceWorker');
  vi.restoreAllMocks();
});

describe('ponte com o service worker', () => {
  it('não avisa nada quando não há versão esperando', async () => {
    install();

    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
        scope: '/',
      });
    });
    expect(screen.queryByText(copy.updateReady)).toBeNull();
  });

  it('avisa quando uma versão nova termina de instalar', async () => {
    const { registration } = install();
    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    await waitFor(() => expect(navigator.serviceWorker.register).toHaveBeenCalled());

    const incoming = fakeWorker();
    registration.installing = incoming;
    registration.emit('updatefound');

    incoming.state = 'installed';
    incoming.emit('statechange');

    expect(await screen.findByText(copy.updateReady)).toBeInTheDocument();
  });

  it('cala a boca na primeira instalação do site', async () => {
    // Sem `controller`, este é o primeiro worker: não há versão anterior, e
    // portanto nada a anunciar. Avisar aqui seria assustar sem motivo.
    const { registration } = install({ controller: null });
    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    await waitFor(() => expect(navigator.serviceWorker.register).toHaveBeenCalled());

    const incoming = fakeWorker();
    registration.installing = incoming;
    registration.emit('updatefound');
    incoming.state = 'installed';
    incoming.emit('statechange');

    expect(screen.queryByText(copy.updateReady)).toBeNull();
  });

  it('manda o worker assumir só quando a pessoa pede', async () => {
    const waiting = fakeWorker();
    install({ waiting });

    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    const button = await screen.findByRole('button', { name: copy.update });
    expect(waiting.postMessage).not.toHaveBeenCalled();

    button.click();

    // Trocar o worker embaixo de uma página aberta faz o JavaScript já
    // carregado pedir pacotes de outra versão. Quem escolhe a hora é a pessoa.
    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });

  it('deixa adiar o aviso', async () => {
    install({ waiting: fakeWorker() });
    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    (await screen.findByRole('button', { name: copy.later })).click();

    await waitFor(() => expect(screen.queryByText(copy.updateReady)).toBeNull());
  });

  it('segue em frente quando o registro falha', async () => {
    install();
    vi.mocked(navigator.serviceWorker.register).mockRejectedValue(
      new Error('bloqueado'),
    );

    render(<ServiceWorkerBridge locale="pt-BR" enabled />);

    // O service worker é melhoria, não requisito: o site continua inteiro.
    await waitFor(() => expect(navigator.serviceWorker.register).toHaveBeenCalled());
    expect(screen.queryByText(copy.updateReady)).toBeNull();
  });
});
