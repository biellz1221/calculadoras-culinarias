import { withPercent } from './calculate';
import { DEFAULT_PRESET_ID, getPreset } from '@/data/bread/presets';
import {
  isFlour,
  isIngredientKey,
  type BreadFormula,
  type BreadTarget,
  type FormulaLine,
  type IngredientKey,
} from '@/data/bread/types';

/**
 * Estado da calculadora de pães, num objeto só.
 *
 * Estava espalhado em sete `useState` dentro do componente, o que funcionava
 * enquanto ninguém precisava do conjunto. Salvar, compartilhar por link e
 * imprimir precisam — as três respondem à mesma pergunta, "qual é a receita
 * agora?", e nenhuma delas tem como perguntar a sete variáveis locais.
 *
 * Módulo puro, sem React: é o que permite testar a validação de um link
 * recebido sem montar componente nenhum.
 */

export type BreadMode = BreadTarget['kind'];

export const BREAD_MODES: readonly BreadMode[] = ['flour', 'dough', 'units'];

export interface BreadState {
  readonly presetId: string;
  readonly formula: BreadFormula;
  readonly mode: BreadMode;
  readonly flourGrams: number;
  readonly doughGrams: number;
  readonly unitCount: number;
  readonly unitGrams: number;
}

/** Cópia rasa das linhas do preset: o estado é editável, o dado não. */
function presetFormula(id: string): BreadFormula {
  const preset = getPreset(id);
  if (!preset) throw new Error(`preset desconhecido: ${id}`);

  return {
    flours: preset.formula.flours.map((line) => ({ ...line })),
    lines: preset.formula.lines.map((line) => ({ ...line })),
  };
}

export function initialBreadState(): BreadState {
  return {
    presetId: DEFAULT_PRESET_ID,
    formula: presetFormula(DEFAULT_PRESET_ID),
    mode: 'flour',
    flourGrams: 500,
    doughGrams: 1000,
    unitCount: 8,
    unitGrams: 90,
  };
}

export function breadTarget(state: BreadState): BreadTarget {
  if (state.mode === 'dough') return { kind: 'dough', grams: state.doughGrams };
  if (state.mode === 'units') {
    return { kind: 'units', count: state.unitCount, unitGrams: state.unitGrams };
  }

  return { kind: 'flour', grams: state.flourGrams };
}

/**
 * A receita que não é de ninguém.
 *
 * Existe porque a estante não cobre tudo: o pão de hambúrguer com tangzhong que
 * o Gabriel trouxe não é nenhum dos dezesseis presets, e antes disto a
 * calculadora não tinha como recebê-lo. Escolher "minha receita" mantém a
 * fórmula que estiver na tela e libera acrescentar e tirar ingrediente — o
 * resto da calculadora, faixas e avisos, continua valendo igual.
 */
export const CUSTOM_PRESET_ID = 'custom';

export function isCustom(state: BreadState): boolean {
  return state.presetId === CUSTOM_PRESET_ID;
}

/** Soma das farinhas. O contrato do motor é que ela vale 100. */
export function flourPercentTotal(formula: BreadFormula): number {
  return formula.flours.reduce((total, line) => total + line.percent, 0);
}

/** Reescala as farinhas para somarem 100, preservando a proporção entre elas. */
export function normalizeFlours(state: BreadState): BreadState {
  const total = flourPercentTotal(state.formula);
  if (total <= 0) return state;

  return {
    ...state,
    formula: {
      ...state.formula,
      flours: state.formula.flours.map((line) => ({
        ...line,
        percent: (line.percent / total) * 100,
      })),
    },
  };
}

export function addIngredient(state: BreadState, key: IngredientKey): BreadState {
  const present = [...state.formula.flours, ...state.formula.lines].some(
    (line) => line.key === key,
  );
  if (present) return state;

  // Farinha entra na régua dos 100%; o resto, na lista que se mede contra ela.
  const line = { key, percent: 0 };

  return {
    ...state,
    presetId: CUSTOM_PRESET_ID,
    formula: isFlour(key)
      ? { ...state.formula, flours: [...state.formula.flours, line] }
      : { ...state.formula, lines: [...state.formula.lines, line] },
  };
}

export function removeIngredient(state: BreadState, key: IngredientKey): BreadState {
  return {
    ...state,
    presetId: CUSTOM_PRESET_ID,
    formula: {
      flours: state.formula.flours.filter((line) => line.key !== key),
      lines: state.formula.lines.filter((line) => line.key !== key),
    },
  };
}

export function choosePreset(state: BreadState, presetId: string): BreadState {
  // "Minha receita" parte do que já está na tela: dá para pegar a boule, trocar
  // o que quiser e seguir dali, em vez de começar de uma folha em branco.
  if (presetId === CUSTOM_PRESET_ID) return { ...state, presetId };

  const preset = getPreset(presetId);
  if (!preset) return state;

  // O rendimento publicado é o melhor palpite para o modo por unidades.
  return {
    ...state,
    presetId,
    formula: presetFormula(presetId),
    unitCount: preset.yield?.count ?? state.unitCount,
    unitGrams: preset.yield?.unitGrams ?? state.unitGrams,
  };
}

export function changePercent(
  state: BreadState,
  key: IngredientKey,
  percent: number,
): BreadState {
  return { ...state, formula: withPercent(state.formula, key, percent) };
}

/**
 * Um número que veio de fora e serve para pesar farinha.
 *
 * O teto não é estético: `1e9` de farinha já passa de qualquer padaria, e sem
 * teto um link com `1e308` faz o total virar `Infinity` e a receita inteira
 * exibir `NaN`.
 */
function finiteNumber(value: unknown, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < 0 || value > max) return null;

  return value;
}

function parseLines(value: unknown): FormulaLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 40) return null;

  const lines: FormulaLine[] = [];

  for (const item of value) {
    if (typeof item !== 'object' || item === null) return null;

    const { key, percent } = item as Record<string, unknown>;
    if (!isIngredientKey(key)) return null;

    const parsed = finiteNumber(percent, 10_000);
    if (parsed === null) return null;

    lines.push({ key, percent: parsed });
  }

  return lines;
}

/**
 * Valida um estado vindo de link ou de receita guardada.
 *
 * Tudo aqui é entrada não confiável: o que está depois do `?r=` é texto que
 * qualquer pessoa escreve. O contrato é devolver `null` ao primeiro sinal de
 * problema — a calculadora abre no padrão e diz que o link não deu, que é
 * melhor do que abrir com meia receita e nenhum aviso.
 */
export function parseBreadState(value: unknown): BreadState | null {
  if (typeof value !== 'object' || value === null) return null;

  const record = value as Record<string, unknown>;

  if (typeof record.presetId !== 'string') return null;
  if (record.presetId !== CUSTOM_PRESET_ID && !getPreset(record.presetId)) return null;
  if (!BREAD_MODES.includes(record.mode as BreadMode)) return null;

  const formula = record.formula;
  if (typeof formula !== 'object' || formula === null) return null;

  const { flours, lines } = formula as Record<string, unknown>;
  const parsedFlours = parseLines(flours);
  const parsedLines = parseLines(lines);
  if (!parsedFlours || !parsedLines) return null;

  const flourGrams = finiteNumber(record.flourGrams, 1e9);
  const doughGrams = finiteNumber(record.doughGrams, 1e9);
  const unitCount = finiteNumber(record.unitCount, 10_000);
  const unitGrams = finiteNumber(record.unitGrams, 1e6);

  if (
    flourGrams === null ||
    doughGrams === null ||
    unitCount === null ||
    unitGrams === null
  ) {
    return null;
  }

  return {
    presetId: record.presetId,
    formula: { flours: parsedFlours, lines: parsedLines },
    mode: record.mode as BreadMode,
    flourGrams,
    doughGrams,
    unitCount,
    unitGrams,
  };
}

/**
 * Como um estado de pão encolhe para caber num link.
 *
 * O ponto de partida é o preset escolhido do zero: quem só mexeu no peso da
 * fornada manda o preset e três números, e a fórmula inteira — o campo mais
 * pesado de longe — não viaja.
 */
export const BREAD_SNAPSHOT = {
  baselineFor: (presetId: string): BreadState | null => {
    // Receita própria não tem ponto de partida: a fórmula inteira viaja, que é
    // o certo — ela não deriva de preset nenhum.
    if (presetId === CUSTOM_PRESET_ID) {
      return { ...initialBreadState(), presetId: CUSTOM_PRESET_ID };
    }
    return getPreset(presetId) ? choosePreset(initialBreadState(), presetId) : null;
  },
  presetOf: (state: BreadState): string => state.presetId,
  parse: parseBreadState,
};
