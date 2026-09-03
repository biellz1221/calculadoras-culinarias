import { describe, expect, it } from 'vitest';

import { ogImagePath, pageMetadata } from './seo';

import { CALCULATORS } from '@/data/calculators';
import { getDictionary } from '@/i18n';
import { getCalculatorCopy } from '@/i18n/calculators';
import { LOCALES, type Locale } from '@/i18n/locales';
import { pathFor } from '@/i18n/routes';
import { absoluteUrl } from '@/lib/site';

/**
 * Limites de exibição do Google, medidos em caracteres.
 *
 * Não são regra de ranqueamento: são o ponto em que o buscador corta a frase
 * com reticências. Um título cortado no meio custa clique, e uma descrição
 * cortada perde justamente o fim, que é onde costuma estar o argumento.
 */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const DESCRIPTION_MIN = 110;

/** Cada calculadora e a home, nos dois idiomas. */
function pages(): { locale: Locale; label: string; title: string; description: string; keywords: readonly string[]; imageAlt: string }[] {
  return LOCALES.flatMap((locale) => {
    const dict = getDictionary(locale);
    const site = dict.site;

    return [
      {
        locale,
        label: `${locale}: home`,
        title: site.homeTitle,
        description: site.description,
        keywords: site.keywords,
        imageAlt: site.imageAlt,
      },
      ...CALCULATORS.map((calculator) => {
        const copy = getCalculatorCopy(calculator.id, locale);
        return {
          locale,
          label: `${locale}: ${calculator.id}`,
          // O que o buscador mostra é o título mais o nome do site.
          title: `${copy.meta.title} · ${site.name}`,
          description: copy.meta.description,
          keywords: copy.meta.keywords,
          imageAlt: copy.meta.imageAlt,
        };
      }),
    ];
  });
}

describe('textos de busca', () => {
  it.each(pages())('cabem na tela do buscador em $label', (page) => {
    expect(page.title.length, `título: ${page.title}`).toBeLessThanOrEqual(TITLE_MAX);
    expect(page.description.length, `descrição: ${page.description}`).toBeLessThanOrEqual(
      DESCRIPTION_MAX,
    );
    // Descrição curta demais desperdiça o espaço que o buscador dá de graça.
    expect(page.description.length, `descrição: ${page.description}`).toBeGreaterThanOrEqual(
      DESCRIPTION_MIN,
    );
  });

  it.each(pages())('declara palavras-chave e texto de imagem em $label', (page) => {
    expect(page.keywords.length).toBeGreaterThanOrEqual(5);
    expect(new Set(page.keywords).size).toBe(page.keywords.length);
    expect(page.imageAlt.trim().length).toBeGreaterThan(20);
  });
});

describe('perguntas frequentes', () => {
  it('existem nos dois idiomas, na mesma quantidade', () => {
    const counts = LOCALES.map((locale) => getDictionary(locale).home.faq.items.length);
    expect(new Set(counts).size).toBe(1);
    expect(counts[0]).toBeGreaterThanOrEqual(3);

    for (const calculator of CALCULATORS) {
      const perLocale = LOCALES.map(
        (locale) => getCalculatorCopy(calculator.id, locale).faq.items.length,
      );
      expect(new Set(perLocale).size, calculator.id).toBe(1);
      expect(perLocale[0], calculator.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('responde de verdade, não em uma linha protocolar', () => {
    // Resposta curta demais não serve nem a quem lê nem a quem cita: o que a
    // busca por IA aproveita é o parágrafo que se sustenta sozinho.
    for (const locale of LOCALES) {
      const all = [
        ...getDictionary(locale).home.faq.items,
        ...CALCULATORS.flatMap(
          (calculator) => getCalculatorCopy(calculator.id, locale).faq.items,
        ),
      ];

      for (const item of all) {
        expect(item.question.trim().endsWith('?'), item.question).toBe(true);
        expect(item.answer.length, item.question).toBeGreaterThan(80);
      }
    }
  });
});

describe('pageMetadata', () => {
  it('monta o bloco social inteiro, e não só o pedaço que mudou', () => {
    // O Next substitui `openGraph` inteiro quando a página declara o campo:
    // faltar `siteName` ou `locale` aqui significa perdê-los na página.
    const meta = pageMetadata({
      routeKey: 'bread',
      locale: 'pt-BR',
      title: 'Calculadora de pão em gramas',
      description: 'descrição',
      keywords: ['pão'],
      imageAlt: 'alt',
    });

    expect(meta.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Calculadoras Culinárias',
      locale: 'pt_BR',
      alternateLocale: ['en_US'],
      url: 'https://calculadorasculinarias.com.br/paes',
    });
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
    expect(meta.alternates?.canonical).toBe(absoluteUrl(pathFor('bread', 'pt-BR')));
  });

  it('completa o título social com o nome do site, que lá não tem template', () => {
    const meta = pageMetadata({
      routeKey: 'bread',
      locale: 'pt-BR',
      title: 'Calculadora de pão em gramas',
      description: 'descrição',
      keywords: ['pão'],
      imageAlt: 'alt',
    });

    expect(meta.openGraph?.title).toBe(
      'Calculadora de pão em gramas · Calculadoras Culinárias',
    );
  });

  it('não repete o nome do site quando o título já o traz', () => {
    const meta = pageMetadata({
      routeKey: 'home',
      locale: 'pt-BR',
      title: 'Calculadoras Culinárias: pão, picles, massa e gelato',
      description: 'descrição',
      keywords: ['x'],
      imageAlt: 'alt',
      standaloneTitle: true,
    });

    expect(meta.openGraph?.title).toBe(
      'Calculadoras Culinárias: pão, picles, massa e gelato',
    );
    expect(meta.title).toEqual({
      absolute: 'Calculadoras Culinárias: pão, picles, massa e gelato',
    });
  });

  it('aponta cada idioma para a sua própria imagem', () => {
    expect(ogImagePath('bread', 'pt-BR')).toBe('/og/bread-pt/image.png');
    expect(ogImagePath('bread', 'en')).toBe('/og/bread-en/image.png');
  });
});
