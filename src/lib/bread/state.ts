import { withPercent } from './calculate';
import { DEFAULT_PRESET_ID, getPreset } from '@/data/bread/presets';
import {
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

export function choosePreset(state: BreadState, presetId: string): BreadState {
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

  if (typeof record.presetId !== 'string' || !getPreset(record.presetId)) return null;
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
