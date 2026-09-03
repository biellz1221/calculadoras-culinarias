import { cn } from '@/lib/cn';

export type RangeStatus = 'below' | 'in' | 'above';

const STATUS_STYLE: Record<RangeStatus, string> = {
  below: 'bg-warn-tint text-warn',
  in: 'bg-ok-tint text-ok',
  above: 'bg-warn-tint text-warn',
};

const HARD_STYLE = 'bg-danger-tint text-danger';

/* Cor nunca é o único sinal: cada estado tem também um símbolo e o texto
   escrito por extenso, para quem não distingue as cores (NFR-002). */
const STATUS_MARK: Record<RangeStatus, string> = {
  below: '↓',
  in: '✓',
  above: '↑',
};

interface RangeBadgeProps {
  status: RangeStatus;
  label: string;
  /** Passou do limite em que a fonte deixa de dar respaldo. */
  beyondHardLimit?: boolean;
  className?: string;
}

export function RangeBadge({
  status,
  label,
  beyondHardLimit = false,
  className,
}: RangeBadgeProps) {
  return (
    <span
      className={cn(
        'label-caps inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
        beyondHardLimit ? HARD_STYLE : STATUS_STYLE[status],
        className,
      )}
    >
      <span aria-hidden="true">{beyondHardLimit ? '!' : STATUS_MARK[status]}</span>
      {label}
    </span>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  status?: RangeStatus;
  statusLabel?: string;
  beyondHardLimit?: boolean;
  /** Faixa recomendada, já formatada. */
  range?: string;
  note?: string;
  children?: React.ReactNode;
}

/** Uma métrica do painel de balanço: valor, faixa, estado e o porquê. */
export function MetricRow({
  label,
  value,
  status,
  statusLabel,
  beyondHardLimit,
  range,
  note,
  children,
}: MetricRowProps) {
  return (
    <div className="border-t border-rule py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="font-display text-base font-semibold text-ink">{label}</h3>
        <div className="flex items-center gap-3">
          <span data-numeric className="text-lg font-bold tabular-nums text-ink">
            {value}
          </span>
          {status && statusLabel && (
            <RangeBadge
              status={status}
              label={statusLabel}
              beyondHardLimit={beyondHardLimit}
            />
          )}
        </div>
      </div>

      {range && <p className="mt-1 text-xs text-ink-muted">{range}</p>}
      {note && (
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">{note}</p>
      )}
      {children}
    </div>
  );
}
