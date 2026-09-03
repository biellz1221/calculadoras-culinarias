'use client';

import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { usePreferences } from '@/lib/preferences';

/**
 * Escolha de unidades e de escala de temperatura.
 *
 * Vale para os números que as calculadoras produzem. O texto explicativo das
 * páginas segue em métrico, porque é o que está escrito nas fontes e converter
 * uma citação seria reescrevê-la.
 */
export function PreferencesBar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { units, temperature, setUnits, setTemperature } = usePreferences();

  return (
    <div className="flex items-center gap-4">
      <Toggle
        legend={dict.preferences.units}
        options={[
          {
            value: 'metric' as const,
            label: 'g',
            name: dict.preferences.metric,
            title: dict.preferences.metricTitle,
          },
          {
            value: 'imperial' as const,
            label: 'oz',
            name: dict.preferences.imperial,
            title: dict.preferences.imperialTitle,
          },
        ]}
        value={units}
        onChange={setUnits}
      />

      <Toggle
        legend={dict.preferences.temperature}
        options={[
          { value: 'celsius' as const, label: '°C', name: dict.preferences.celsius },
          {
            value: 'fahrenheit' as const,
            label: '°F',
            name: dict.preferences.fahrenheit,
          },
        ]}
        value={temperature}
        onChange={setTemperature}
      />
    </div>
  );
}

interface ToggleProps<T extends string> {
  legend: string;
  options: readonly { value: T; label: string; name: string; title?: string }[];
  value: T;
  onChange: (value: T) => void;
}

function Toggle<T extends string>({
  legend,
  options,
  value,
  onChange,
}: ToggleProps<T>) {
  return (
    <fieldset className="flex items-center gap-1.5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            aria-label={`${legend}: ${option.name}`}
            title={option.title ?? option.name}
            className={cn(
              'rounded-full px-2 py-1 text-xs font-bold tabular-nums transition-colors',
              selected
                ? 'bg-ink text-paper'
                : 'text-ink-muted hover:bg-brand-tint hover:text-brand-deep',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
