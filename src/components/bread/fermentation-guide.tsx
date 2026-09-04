'use client';

import { useState } from 'react';

import { CitationRef } from '@/components/citation';
import { NumberField, Segmented } from '@/components/field';
import {
  closestPoint,
  COLD_RETARD,
  FERMENTATION_POINTS,
  TYPICAL_FIRST_RISE,
  type RiseStage,
} from '@/data/bread/fermentation';
import type { BreadDictionary } from '@/i18n/dictionaries/bread';
import type { Locale } from '@/i18n/locales';
import {
  BASE_TEMPERATURE,
  BASE_TEMPERATURE_CITATION,
  RISE_TIME_CITATION,
  riseTimeFactor,
  waterTemperature,
} from '@/lib/bread/yeast';
import { useFormatters } from '@/lib/use-formatters';

type Crumb = keyof typeof BASE_TEMPERATURE;

/**
 * Fermento, tempo e temperatura (FR-014).
 *
 * Duas contas que as fontes publicam e que ninguém faz de cabeça: quanto tempo
 * uma dose de fermento pede, e a que temperatura a água precisa sair da
 * torneira para a massa terminar a sova no ponto.
 *
 * A estimativa de tempo é orientação de planejamento, e o texto diz isso. A
 * regra do Camargo — metade do fermento, dobro do tempo — vale entre pontos
 * próximos; extrapolar de 1% para 0,04% daria um número com cara de precisão e
 * nenhuma. Por isso a conta parte sempre do ponto de calibração mais próximo,
 * e a receita de onde ele saiu aparece junto.
 */
export function FermentationGuide({
  dict,
  locale,
}: {
  dict: BreadDictionary;
  locale: Locale;
}) {
  const fmt = useFormatters(locale);
  const copy = dict.fermentation;

  const [yeastPercent, setYeastPercent] = useState(1);
  const [stage, setStage] = useState<RiseStage>('first');

  const [crumb, setCrumb] = useState<Crumb>('white');
  const [room, setRoom] = useState(22);
  const [flour, setFlour] = useState(22);

  const anchor = closestPoint(yeastPercent, stage);
  const factor = anchor ? riseTimeFactor(anchor.yeastPercent, yeastPercent) : 1;

  const window = anchor
    ? (anchor.minutes.map((value) => value * factor) as [number, number])
    : [...TYPICAL_FIRST_RISE.minutes];

  const [baseMin, baseMax] = BASE_TEMPERATURE[crumb];
  const water = {
    min: waterTemperature(baseMin, room, flour),
    max: waterTemperature(baseMax, room, flour),
  };

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      <section>
        <h3 className="label-caps text-accent-deep">{copy.timeTitle}</h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
          {copy.timeLead}
        </p>

        <div className="mt-4">
          <Segmented
            legend={copy.stageLabel}
            value={stage}
            onChange={setStage}
            options={[
              { value: 'first' as const, label: dict.process.firstRise },
              { value: 'second' as const, label: dict.process.secondRise },
            ]}
          />
        </div>

        <div className="mt-4">
          <NumberField
            label={copy.yeastLabel}
            value={yeastPercent}
            onChange={setYeastPercent}
            suffix="%"
            step={0.02}
            hint={copy.yeastHint}
          />
        </div>

        <p aria-live="polite" className="mt-5">
          <span className="label-caps block text-ink-muted">{copy.estimate}</span>
          <span data-numeric className="font-display text-2xl font-semibold text-ink">
            {formatWindow(window as [number, number], dict, fmt)}
          </span>
        </p>

        {anchor ? (
          <>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
              {`${copy.from} ${copy.recipes[anchor.recipeKey as keyof typeof copy.recipes]} — ${fmt.percent(anchor.yeastPercent, 2)} ${copy.andWindow} ${formatWindow([...anchor.minutes], dict, fmt)}.`}
            </p>
            <CitationRef
              citations={[...anchor.citations, RISE_TIME_CITATION]}
              labels={dict.sources}
              className="mt-2 block"
            />
          </>
        ) : (
          <CitationRef
            citations={[...TYPICAL_FIRST_RISE.citations]}
            labels={dict.sources}
            className="mt-2 block"
          />
        )}

        <p className="mt-4 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
          {copy.estimateWarning}
        </p>

        <table className="mt-6 w-full border-collapse text-left text-sm">
          <caption className="label-caps pb-2 text-left text-ink-muted">
            {copy.pointsTitle}
          </caption>
          <tbody>
            {FERMENTATION_POINTS.map((point) => (
              <tr key={point.recipeKey} className="border-t border-rule">
                <th scope="row" className="py-2 pr-4 text-left font-normal text-ink">
                  {copy.recipes[point.recipeKey as keyof typeof copy.recipes]}
                </th>
                <td data-numeric className="py-2 pr-4 tabular-nums text-ink-soft">
                  {fmt.percent(point.yeastPercent, 2)}
                </td>
                <td className="py-2 text-ink-muted">
                  {`${dict.process[point.stage === 'first' ? 'firstRise' : 'secondRise']}: ${formatWindow([...point.minutes], dict, fmt)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="label-caps text-accent-deep">{copy.waterTitle}</h3>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
          {copy.waterLead}
        </p>

        <div className="mt-4">
          <Segmented
            legend={copy.crumbLabel}
            value={crumb}
            onChange={setCrumb}
            options={[
              { value: 'white' as const, label: copy.white },
              { value: 'dark' as const, label: copy.dark },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-5">
          <NumberField
            label={copy.roomLabel}
            value={room}
            onChange={setRoom}
            suffix="°C"
          />
          <NumberField
            label={copy.flourLabel}
            value={flour}
            onChange={setFlour}
            suffix="°C"
            hint={copy.flourHint}
          />
        </div>

        <p aria-live="polite" className="mt-5">
          <span className="label-caps block text-ink-muted">{copy.waterResult}</span>
          <span data-numeric className="font-display text-2xl font-semibold text-ink">
            {water.min === water.max
              ? fmt.temperature(water.min)
              : `${fmt.temperature(water.min)} – ${fmt.temperature(water.max)}`}
          </span>
        </p>

        {water.max < 0 && (
          <p className="mt-3 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
            {copy.tooCold}
          </p>
        )}

        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {`${copy.baseIs} ${fmt.temperature(baseMin)} – ${fmt.temperature(baseMax)}.`}
        </p>

        <CitationRef
          citations={[BASE_TEMPERATURE_CITATION]}
          labels={dict.sources}
          className="mt-2 block"
        />

        <div className="mt-6 border-t border-rule pt-4">
          <h4 className="font-display text-base font-semibold text-ink">
            {copy.retardTitle}
          </h4>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-muted">
            {`${copy.retardBody} ${fmt.temperature(COLD_RETARD.celsius)}: ${fmt.number(COLD_RETARD.hours[0])}–${fmt.number(COLD_RETARD.hours[1])} ${copy.hours}.`}
          </p>
          <CitationRef
            citations={[...COLD_RETARD.citations]}
            labels={dict.sources}
            className="mt-2 block"
          />
        </div>
      </section>
    </div>
  );
}

/** Minutos viram horas quando passam de duas: "5–8 h" lê melhor que "300–480 min". */
function formatWindow(
  [min, max]: [number, number],
  dict: BreadDictionary,
  fmt: ReturnType<typeof useFormatters>,
): string {
  const asHours = min >= 120;
  const unit = asHours ? dict.fermentation.hours : dict.process.minutes;
  const scale = asHours ? 60 : 1;
  const digits = asHours ? 1 : 0;

  const value = (raw: number) =>
    fmt.number(Math.round((raw / scale) * 10 ** digits) / 10 ** digits, {
      maximumFractionDigits: digits,
    });

  return min === max ? `${value(min)} ${unit}` : `${value(min)}–${value(max)} ${unit}`;
}
