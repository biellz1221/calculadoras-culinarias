'use client';

import { useMemo, useState } from 'react';

import { BalancePanel } from './balance-panel';
import { ResultPanel } from './result-panel';
import { NumberField, Segmented } from '@/components/field';
import {
  DEFAULT_PASTA_PRESET_ID,
  PASTA_PRESETS,
  getPastaPreset,
} from '@/data/pasta/presets';
import { SERVING_GRAMS } from '@/data/pasta/ranges';
import {
  REFERENCE_EGG_GRAMS,
  REFERENCE_YOLK_GRAMS,
  SERVING_STYLES,
  type PastaPreset,
  type PastaTarget,
  type ServingStyle,
} from '@/data/pasta/types';
import type { PastaDictionary } from '@/i18n/dictionaries/pasta';
import type { Locale } from '@/i18n/locales';
import { calculatePasta, presetEggUnits } from '@/lib/pasta/calculate';

interface PastaCalculatorProps {
  dict: PastaDictionary;
  locale: Locale;
}

function presetById(id: string): PastaPreset {
  const preset = getPastaPreset(id);
  if (!preset) throw new Error(`preset de massa desconhecido: ${id}`);
  return preset;
}

export function PastaCalculator({ dict, locale }: PastaCalculatorProps) {
  const [presetId, setPresetId] = useState(DEFAULT_PASTA_PRESET_ID);
  const [servings, setServings] = useState(4);
  const [style, setStyle] = useState<ServingStyle>('main');
  const [gramsPerServing, setGramsPerServing] = useState(SERVING_GRAMS.main);
  const [eggGrams, setEggGrams] = useState(REFERENCE_EGG_GRAMS);
  const [yolkGrams, setYolkGrams] = useState(REFERENCE_YOLK_GRAMS);

  const preset = presetById(presetId);
  const usesYolks = presetEggUnits(preset).yolks > 0;
  const usesEggs = presetEggUnits(preset).eggs > 0;

  const target = useMemo<PastaTarget>(
    () => ({ servings, gramsPerServing, eggGrams, yolkGrams }),
    [servings, gramsPerServing, eggGrams, yolkGrams],
  );

  const recipe = useMemo(
    () => calculatePasta(preset, target),
    [preset, target],
  );

  // O contexto da refeição preenche os gramas por pessoa, mas não prende: o
  // campo continua editável para quem sabe o tamanho da própria porção.
  function chooseStyle(next: ServingStyle) {
    setStyle(next);
    setGramsPerServing(SERVING_GRAMS[next]);
  }

  return (
    <div className="mt-10">
      <Segmented
        legend={dict.presetLabel}
        value={presetId}
        onChange={setPresetId}
        emphasis
        options={PASTA_PRESETS.map((item) => ({
          value: item.id,
          label: dict.presets[item.id as keyof PastaDictionary['presets']],
        }))}
      />

      <div className="mt-8">
        <Segmented
          legend={dict.target.styleLabel}
          value={style}
          onChange={chooseStyle}
          options={SERVING_STYLES.map((value) => ({
            value,
            label: dict.target.styles[value],
          }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-5">
        <NumberField
          label={dict.target.servings}
          value={servings}
          onChange={setServings}
          step={1}
          min={1}
        />
        <NumberField
          label={dict.target.gramsPerServing}
          value={gramsPerServing}
          onChange={setGramsPerServing}
          suffix="g"
          step={5}
        />
        {usesEggs && (
          <NumberField
            label={dict.target.eggWeight}
            value={eggGrams}
            onChange={setEggGrams}
            suffix="g"
            step={1}
            hint={dict.target.eggHint}
          />
        )}
        {usesYolks && (
          <NumberField
            label={dict.target.yolkWeight}
            value={yolkGrams}
            onChange={setYolkGrams}
            suffix="g"
            step={1}
          />
        )}
      </div>

      <ResultPanel preset={preset} recipe={recipe} dict={dict} locale={locale} />

      <BalancePanel
        preset={preset}
        recipe={recipe}
        gramsPerServing={gramsPerServing}
        dict={dict}
        locale={locale}
      />

      <section className="mt-10 border-t border-rule pt-6">
        <h2 className="label-caps text-brand-deep">{dict.process.title}</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
          {dict.process.notes[preset.noteKey as keyof PastaDictionary['process']['notes']]}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {`${dict.process.ribbons} · ${dict.process.filled}`}
        </p>
        {preset.unsuitable?.includes('filled') && (
          <p className="mt-3 max-w-prose rounded-card bg-warn-tint px-4 py-3 text-sm leading-relaxed text-warn">
            {dict.process.unsuitableFilled}
          </p>
        )}
      </section>
    </div>
  );
}
