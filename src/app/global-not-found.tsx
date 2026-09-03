import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';

import { RootHtml } from '@/components/root-html';
import { getDictionary } from '@/i18n';
import { pathFor } from '@/i18n/routes';

/**
 * 404 global. Resolvido no nível de roteamento, então não depende de nenhum
 * root layout, o que importa aqui, já que o site tem um por idioma.
 * Responde no idioma canônico do domínio (pt-BR).
 */
const LOCALE = 'pt-BR' as const;
const dict = getDictionary(LOCALE);

export const metadata: Metadata = {
  title: `${dict.notFound.title} · ${dict.site.name}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootHtml locale={LOCALE}>
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center px-5 py-20 sm:px-8">
        <p className="label-caps text-brand-deep">404</p>
        <h1 className="mt-4 text-title">{dict.notFound.title}</h1>
        <p className="mt-4 max-w-prose text-lead text-ink-soft">
          {dict.notFound.body}
        </p>
        <p className="mt-8">
          <Link
            href={pathFor('home', LOCALE)}
            className="font-semibold text-brand-deep underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-brand"
          >
            {dict.notFound.back}
          </Link>
        </p>
      </main>
    </RootHtml>
  );
}
