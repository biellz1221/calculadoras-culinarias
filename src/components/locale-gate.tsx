'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { preferredLocale } from '@/lib/locale-preference';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';

/**
 * Manda o visitante para a home do idioma dele.
 *
 * Age só na raiz do domínio, e é uma decisão deliberada. A raiz é a porta de
 * entrada, onde ninguém declarou idioma nenhum: ali vale o que a pessoa
 * escolheu antes ou, na falta disso, o que o navegador diz. Qualquer outro
 * endereço já carrega uma intenção. Quem abre um link de `/en` recebeu aquele
 * link em inglês, e trocar a página embaixo dele quebraria a expectativa de
 * quem mandou.
 *
 * Como o site é estático, isso roda depois da hidratação: quem já chegou no
 * idioma certo não percebe nada.
 */
export function LocaleGate({ locale }: { locale: Locale }) {
  const router = useRouter();

  useEffect(() => {
    if (locale !== DEFAULT_LOCALE) return;

    const wanted = preferredLocale();
    if (wanted !== locale) {
      router.replace(pathFor('home', wanted));
    }
  }, [locale, router]);

  return null;
}
