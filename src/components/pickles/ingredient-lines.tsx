'use client';

import { LineEditor, type LineRoleOption } from '@/components/audit/line-editor';
import type { IngredientLine, IngredientRole } from '@/data/pickles/types';
import type { PicklesDictionary } from '@/i18n/dictionaries/pickles';
import type { Locale } from '@/i18n/locales';

interface IngredientLinesProps {
  lines: readonly IngredientLine[];
  onChange: (lines: readonly IngredientLine[]) => void;
  dict: PicklesDictionary;
  locale: Locale;
  /** Salga direta não leva água, então o papel some da tela. */
  allowLiquid?: boolean;
}

/**
 * Lista livre do que vai para o pote.
 *
 * Cada linha declara se é sólido ou líquido, e é só isso que a conta precisa
 * saber: sólidos somam o peso dos vegetais, líquidos somam a água. O motor não
 * muda, muda só de onde os dois pesos vêm.
 *
 * O desenho da lista mora em `LineEditor`, compartilhado com as outras telas de
 * "confira a sua receita". Aqui fica o que é do picles: os dois papéis e como
 * eles se chamam.
 */
export function IngredientLines({
  lines,
  onChange,
  dict,
  locale,
  allowLiquid = true,
}: IngredientLinesProps) {
  const copy = dict.ingredients;

  const roles: readonly LineRoleOption<IngredientRole>[] = allowLiquid
    ? [
        { value: 'solid', label: copy.solid, totalLabel: copy.totalSolids },
        { value: 'liquid', label: copy.liquid, totalLabel: copy.totalLiquids },
      ]
    : [{ value: 'solid', label: copy.solid, totalLabel: copy.totalSolids }];

  return (
    <LineEditor
      lines={lines}
      onChange={onChange}
      roles={roles}
      locale={locale}
      labels={{
        name: copy.name,
        namePlaceholder: copy.namePlaceholder,
        amount: copy.amount,
        role: copy.role,
        add: copy.add,
        remove: copy.remove,
        empty: copy.empty,
        roleHint: copy.roleHint,
      }}
    />
  );
}
