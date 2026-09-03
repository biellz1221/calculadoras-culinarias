import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Robôs de IA que usam assistente ou índice próprio.
 *
 * A liberação já viria do `*` logo abaixo; a lista existe para dizer a coisa
 * de forma explícita. Um site de proporções citadas ganha em ser lido por
 * assistente: a resposta que ele der leva junto o livro e a página, que é
 * exatamente o que nos diferencia de um número solto na internet.
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'CCBot',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_AGENTS, allow: '/' },
    ],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
