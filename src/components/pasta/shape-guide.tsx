'use client';

import { CitationRef } from '@/components/citation';
import { PASTA_DISHES } from '@/data/pasta/dishes';
import { PASTA_SHAPES } from '@/data/pasta/shapes';
import type { PastaShape } from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import { useFormatters, type Formatters } from '@/lib/use-formatters';
import type { Locale } from '@/i18n/locales';

interface GuideProps {
  dict: PastaDictionary;
  locale: Locale;
}

/**
 * Guia de formatos (FR-032): onde parar de abrir e para que serve cada corte.
 *
 * A coluna de abertura traz o setting da máquina e a descrição em palavras.
 * Nenhum dos dois livros publica milímetros, e inventar um número aqui seria
 * dar precisão que a fonte não tem. Onde os autores param em pontos
 * diferentes, a linha diz isso por escrito, não só por cor.
 */
export function ShapeGuide({ dict, locale }: GuideProps) {
  const fmt = useFormatters(locale);

  return (
    <div className="relative mt-8 overflow-x-auto border-t border-rule">
      <table className="w-full min-w-2xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rule">
            {[
              dict.shapes.columns.shape,
              dict.shapes.columns.setting,
              dict.shapes.columns.use,
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="label-caps py-3 pr-6 align-bottom text-ink-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {PASTA_SHAPES.map((shape) => {
            const copy =
              dict.shapes.items[shape.id as keyof PastaDictionary['shapes']['items']];

            return (
              <tr key={shape.id} className="border-b border-rule last:border-b-0">
                <th
                  scope="row"
                  className="w-40 py-4 pr-6 align-top font-display text-base font-semibold text-ink"
                >
                  {copy.name}
                </th>
                <td className="w-2/5 py-4 pr-6 align-top leading-relaxed text-ink-muted">
                  <span
                    data-numeric
                    className="label-caps block text-accent-deep tabular-nums"
                  >
                    {settingText(shape, dict, fmt)}
                  </span>
                  <span className="mt-1 block">{copy.thickness}</span>
                  {shape.divergent && (
                    <span className="label-caps mt-2 inline-flex items-center gap-1.5 rounded-full bg-warn-tint px-2.5 py-1 text-warn">
                      <span aria-hidden="true">↔</span>
                      {dict.shapes.divergent}
                    </span>
                  )}
                </td>
                <td className="py-4 align-top leading-relaxed text-ink-soft">
                  {copy.use}
                  <CitationRef
                    citations={shape.citations}
                    labels={dict.sources}
                    className="mt-2 block"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function settingText(
  shape: PastaShape,
  dict: PastaDictionary,
  fmt: Formatters,
): string {
  if (shape.setting === undefined) return dict.shapes.noSetting;

  const base = `${dict.shapes.setting} ${fmt.number(shape.setting)}`;
  if (shape.altSetting === undefined) return base;

  return `${base} ${dict.shapes.or} ${fmt.number(shape.altSetting)}`;
}

/** Rendimento dos pratos montados, que não seguem os gramas por pessoa. */
export function DishTable({ dict, locale }: GuideProps) {
  const fmt = useFormatters(locale);

  return (
    <div className="relative mt-8 overflow-x-auto border-t border-rule">
      <table className="w-full min-w-xl border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rule">
            {[
              dict.dishes.columns.dish,
              dict.dishes.columns.amount,
              dict.dishes.columns.servings,
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="label-caps py-3 pr-6 align-bottom text-ink-muted"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {PASTA_DISHES.map((dish) => {
            const copy =
              dict.dishes.items[dish.noteKey as keyof PastaDictionary['dishes']['items']];
            const [least, most] = dish.servings;

            return (
              <tr key={dish.id} className="border-b border-rule last:border-b-0">
                <th
                  scope="row"
                  className="w-48 py-4 pr-6 align-top font-display text-base font-semibold text-ink"
                >
                  {copy.name}
                  <span className="mt-1 block text-sm font-normal text-ink-muted">
                    {copy.note}
                  </span>
                </th>
                <td
                  data-numeric
                  className="py-4 pr-6 align-top font-semibold tabular-nums text-ink"
                >
                  {dish.doughGrams === undefined
                    ? `${fmt.number(dish.pieces ?? 0)} ${dict.dishes.pieces}`
                    : fmt.mass(dish.doughGrams, 0)}
                </td>
                <td className="py-4 align-top text-ink-soft">
                  <span data-numeric className="tabular-nums">
                    {least === most
                      ? fmt.number(least)
                      : `${fmt.number(least)}–${fmt.number(most)}`}
                  </span>
                  <CitationRef
                    citations={dish.citations}
                    labels={dict.sources}
                    className="mt-2 block"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
