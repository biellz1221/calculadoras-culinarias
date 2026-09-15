'use client';

import { useId, useRef } from 'react';

import { MassField } from '@/components/field';
import type { Locale } from '@/i18n/locales';
import { useFormatters } from '@/lib/use-formatters';

/**
 * Uma linha da receita que a pessoa está digitando.
 *
 * O papel é genérico porque o vocabulário muda de calculadora para calculadora:
 * o pão separa farinha de água e de sal, o picles separa sólido de líquido.
 * Forçar um papel único sobre as duas daria um tipo que não descreve nenhuma
 * das duas.
 */
export interface AuditLine<R extends string> {
  id: string;
  name: string;
  grams: number;
  role: R;
}

export interface LineRoleOption<R extends string> {
  value: R;
  label: string;
  /** Presente = este papel tem soma exibida no rodapé da lista. */
  totalLabel?: string;
}

export interface LineEditorLabels {
  name: string;
  namePlaceholder: string;
  amount: string;
  role: string;
  add: string;
  remove: string;
  empty: string;
  roleHint?: string;
}

interface LineEditorProps<R extends string> {
  lines: readonly AuditLine<R>[];
  onChange: (lines: readonly AuditLine<R>[]) => void;
  /** Um papel só esconde o seletor: não há escolha a oferecer. */
  roles: readonly LineRoleOption<R>[];
  labels: LineEditorLabels;
  locale: Locale;
}

/**
 * Lista livre de ingredientes: nome, peso e papel, com apagar por linha.
 *
 * Nasceu dentro da calculadora de picles e saiu de lá quando a segunda tela
 * precisou da mesma coisa. O que ela tem de específico — quais papéis existem,
 * como se chamam, quais somas interessam — virou parâmetro; o que ela tem de
 * geral é o desenho do campo: sufixo de unidade fora do rótulo, nome acessível
 * por linha, e o peso sempre em gramas por baixo da unidade escolhida.
 */
export function LineEditor<R extends string>({
  lines,
  onChange,
  roles,
  labels,
  locale,
}: LineEditorProps<R>) {
  const fmt = useFormatters(locale);
  const groupId = useId();
  /* Contador próprio em vez de derivar o id do conteúdo: duas linhas com o
     mesmo peso gerariam a mesma chave, e o React perderia o campo em foco. */
  const nextId = useRef(0);

  const defaultRole = roles[0]?.value;
  const totals = roles.filter((role) => role.totalLabel !== undefined);

  function update(id: string, patch: Partial<AuditLine<R>>) {
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function add() {
    if (defaultRole === undefined) return;
    nextId.current += 1;
    onChange([
      ...lines,
      {
        id: `${groupId}-${nextId.current}`,
        name: '',
        grams: 0,
        role: defaultRole,
      },
    ]);
  }

  return (
    <div className="mt-4">
      <ul className="flex flex-col gap-3">
        {lines.map((line, index) => (
          <li key={line.id} className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-40 flex-1 flex-col gap-1.5">
              <span className="text-sm text-ink-muted">
                {`${labels.name} ${index + 1}`}
              </span>
              <input
                type="text"
                value={line.name}
                placeholder={labels.namePlaceholder}
                onChange={(event) => update(line.id, { name: event.target.value })}
                className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>

            <MassField
              label={labels.amount}
              grams={line.grams}
              onChange={(grams) => update(line.id, { grams })}
              step={10}
              width="w-24"
            />

            {roles.length > 1 && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-ink-muted">{labels.role}</span>
                <select
                  value={line.role}
                  onChange={(event) =>
                    update(line.id, { role: event.target.value as R })
                  }
                  className="rounded-sm border border-rule bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button
              type="button"
              onClick={() => onChange(lines.filter((other) => other.id !== line.id))}
              aria-label={`${labels.remove}: ${line.name || `${labels.name} ${index + 1}`}`}
              className="rounded-full border border-rule px-3 py-2 text-sm text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              <span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
      </ul>

      {lines.length === 0 && <p className="text-sm text-ink-muted">{labels.empty}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-rule bg-surface px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent-deep"
        >
          {`+ ${labels.add}`}
        </button>

        {lines.length > 0 && totals.length > 0 && (
          <p data-numeric className="text-sm tabular-nums text-ink-muted">
            {totals.map((role, index) => (
              <span key={role.value}>
                {index > 0 && ' · '}
                <span className="label-caps mr-1.5 text-ink-muted/70">
                  {role.totalLabel}
                </span>
                <span className="font-semibold text-ink">
                  {fmt.mass(sumRole(lines, role.value))}
                </span>
              </span>
            ))}
          </p>
        )}
      </div>

      {labels.roleHint && roles.length > 1 && (
        <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
          {labels.roleHint}
        </p>
      )}
    </div>
  );
}

export function sumRole<R extends string>(
  lines: readonly AuditLine<R>[],
  role: R,
): number {
  return lines
    .filter((line) => line.role === role)
    .reduce(
      (total, line) => total + (Number.isFinite(line.grams) ? line.grams : 0),
      0,
    );
}
