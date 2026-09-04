import { DEFAULT_PRESETS, getPreset } from '@/data/pickles/presets';
import { DEFAULT_VEGETABLE_SHARE } from '@/data/pickles/ranges';
import {
  isVinegarPreset,
  type BrineInput,
  type IngredientLine,
  type PickleMode,
  type PicklePreset,
  type SaltBasis,
} from '@/data/pickles/types';

/**
 * Estado da calculadora de picles.
 *
 * Aqui a consolidação foi a mais funda das quatro: os campos moravam dentro de
 * `BrinePanel` e `VinegarPanel`, e a troca de preset era feita remontando o
 * painel com `key={preset.id}`. Funcionava para a tela e para mais nada — nem
 * a página nem um botão de salvar tinham como enxergar o que estava lá dentro.
 *
 * Os dois ramos convivem no mesmo objeto de propósito. Trocar de salmoura para
 * vinagre e voltar não deveria perder o lote que a pessoa já tinha pesado.
 */

export interface BrineState {
  readonly inputKind: BrineInput['kind'];
  readonly vegetableGrams: number;
  readonly waterGrams: number;
  readonly jarMilliliters: number;
  readonly vegetableShare: number;
  readonly saltPercent: number;
  readonly basis: SaltBasis;
  readonly lines: readonly IngredientLine[];
}

export interface VinegarState {
  readonly liquidGrams: number;
  readonly vinegarAcidity: number;
  readonly vinegarParts: number;
  readonly waterParts: number;
  readonly saltPercent: number;
  readonly sugarPercent: number;
}

export interface PicklesState {
  readonly mode: PickleMode;
  readonly presetId: string;
  /** Vale para salmoura e para salga direta: a diferença é só a água. */
  readonly brine: BrineState;
  readonly vinegar: VinegarState;
}

const MODES: readonly PickleMode[] = ['brine', 'dry-salt', 'vinegar'];

const INPUT_KINDS: readonly BrineInput['kind'][] = ['weights', 'jar', 'ingredients'];

/**
 * A lista livre começa com o mesmo lote dos campos de peso, para a troca de
 * modo não zerar o resultado que a pessoa estava vendo.
 */
export function startingLines(isBrine: boolean): IngredientLine[] {
  const solid: IngredientLine = { id: 'solid-1', name: '', grams: 1000, role: 'solid' };

  if (!isBrine) return [solid];

  return [solid, { id: 'liquid-1', name: '', grams: 1000, role: 'liquid' }];
}

function defaultBrine(isBrine: boolean): BrineState {
  return {
    inputKind: 'weights',
    vegetableGrams: 1000,
    waterGrams: 1000,
    jarMilliliters: 1000,
    vegetableShare: DEFAULT_VEGETABLE_SHARE,
    saltPercent: 2,
    basis: 'total',
    lines: startingLines(isBrine),
  };
}

function brineFromPreset(preset: PicklePreset, current?: BrineState): BrineState {
  // Preset de vinagre não tem o que dizer sobre a salmoura: o ramo fica como
  // estava, para ir e voltar entre os métodos não apagar o lote já pesado.
  if (isVinegarPreset(preset)) return current ?? defaultBrine(true);

  const isBrine = preset.mode === 'brine';

  return {
    // O tamanho do lote é da pessoa; o que o preset dita é a proporção.
    inputKind: current?.inputKind ?? 'weights',
    vegetableGrams: current?.vegetableGrams ?? 1000,
    waterGrams: current?.waterGrams ?? 1000,
    jarMilliliters: current?.jarMilliliters ?? 1000,
    lines: current?.lines ?? startingLines(isBrine),

    vegetableShare: isBrine ? preset.vegetableShare : DEFAULT_VEGETABLE_SHARE,
    saltPercent: preset.saltPercent,
    basis: isBrine ? preset.basis : 'total',
  };
}

function vinegarFromPreset(preset: PicklePreset, current?: VinegarState): VinegarState {
  if (!isVinegarPreset(preset)) {
    return (
      current ?? {
        liquidGrams: 500,
        vinegarAcidity: 5,
        vinegarParts: 1,
        waterParts: 1,
        saltPercent: 1,
        sugarPercent: 3,
      }
    );
  }

  return {
    liquidGrams: current?.liquidGrams ?? 500,
    vinegarAcidity: preset.acidity,
    vinegarParts: preset.vinegarParts,
    waterParts: preset.waterParts,
    saltPercent: preset.saltPercent,
    sugarPercent: preset.sugarPercent,
  };
}

function fromPreset(
  mode: PickleMode,
  presetId: string,
  current?: PicklesState,
): PicklesState {
  const preset = getPreset(presetId);
  if (!preset) return current ?? initialPicklesState();

  return {
    mode,
    presetId,
    brine: brineFromPreset(preset, current?.brine),
    vinegar: vinegarFromPreset(preset, current?.vinegar),
  };
}

export function initialPicklesState(): PicklesState {
  const presetId = DEFAULT_PRESETS.brine;
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`preset de picles desconhecido: ${presetId}`);

  return {
    mode: 'brine',
    presetId,
    brine: brineFromPreset(preset),
    vinegar: vinegarFromPreset(preset),
  };
}

/** Trocar de método leva ao preset padrão dele, como antes da consolidação. */
export function choosePickleMode(state: PicklesState, mode: PickleMode): PicklesState {
  const next = fromPreset(mode, DEFAULT_PRESETS[mode], state);

  // A lista livre ganha ou perde a linha de líquido conforme o método: salga
  // direta não leva água, e uma linha de água invisível falsearia o total.
  const isBrine = mode === 'brine';
  const hasLiquid = next.brine.lines.some((line) => line.role === 'liquid');

  if (isBrine === hasLiquid) return next;

  return {
    ...next,
    brine: { ...next.brine, lines: startingLines(isBrine) },
  };
}

export function choosePicklePreset(state: PicklesState, presetId: string): PicklesState {
  return fromPreset(state.mode, presetId, state);
}

export function brineInput(state: BrineState): BrineInput {
  if (state.inputKind === 'ingredients') {
    return { kind: 'ingredients', lines: state.lines };
  }

  if (state.inputKind === 'jar') {
    return {
      kind: 'jar',
      jarMilliliters: state.jarMilliliters,
      vegetableShare: state.vegetableShare,
    };
  }

  return {
    kind: 'weights',
    vegetableGrams: state.vegetableGrams,
    waterGrams: state.waterGrams,
  };
}

function finiteNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;

  return value;
}

function parseLines(value: unknown): IngredientLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;

  const lines: IngredientLine[] = [];

  for (const item of value) {
    if (typeof item !== 'object' || item === null) return null;

    const { id, name, grams, role } = item as Record<string, unknown>;
    const parsedGrams = finiteNumber(grams, 0, 1e7);

    if (typeof id !== 'string' || id.length === 0 || id.length > 64) return null;
    // O nome é texto livre e vai para a tela; o teto de tamanho é o que impede
    // um link de despejar um romance dentro do rótulo de um ingrediente.
    if (typeof name !== 'string' || name.length > 120) return null;
    if (parsedGrams === null) return null;
    if (role !== 'solid' && role !== 'liquid') return null;

    lines.push({ id, name, grams: parsedGrams, role });
  }

  // `id` duplicado quebraria a chave de render do React e a remoção de linha.
  const ids = new Set(lines.map((line) => line.id));
  if (ids.size !== lines.length) return null;

  return lines;
}

function parseBrine(value: unknown): BrineState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (!INPUT_KINDS.includes(record.inputKind as BrineInput['kind'])) return null;
  if (record.basis !== 'total' && record.basis !== 'water') return null;

  const vegetableGrams = finiteNumber(record.vegetableGrams, 0, 1e7);
  const waterGrams = finiteNumber(record.waterGrams, 0, 1e7);
  const jarMilliliters = finiteNumber(record.jarMilliliters, 0, 1e7);
  const vegetableShare = finiteNumber(record.vegetableShare, 0, 1);
  const saltPercent = finiteNumber(record.saltPercent, 0, 100);
  const lines = parseLines(record.lines);

  if (
    vegetableGrams === null ||
    waterGrams === null ||
    jarMilliliters === null ||
    vegetableShare === null ||
    saltPercent === null ||
    lines === null
  ) {
    return null;
  }

  return {
    inputKind: record.inputKind as BrineInput['kind'],
    vegetableGrams,
    waterGrams,
    jarMilliliters,
    vegetableShare,
    saltPercent,
    basis: record.basis,
    lines,
  };
}

function parseVinegar(value: unknown): VinegarState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  const liquidGrams = finiteNumber(record.liquidGrams, 0, 1e7);
  const vinegarAcidity = finiteNumber(record.vinegarAcidity, 0, 100);
  const vinegarParts = finiteNumber(record.vinegarParts, 0, 1000);
  const waterParts = finiteNumber(record.waterParts, 0, 1000);
  const saltPercent = finiteNumber(record.saltPercent, 0, 100);
  const sugarPercent = finiteNumber(record.sugarPercent, 0, 100);

  if (
    liquidGrams === null ||
    vinegarAcidity === null ||
    vinegarParts === null ||
    waterParts === null ||
    saltPercent === null ||
    sugarPercent === null
  ) {
    return null;
  }

  return {
    liquidGrams,
    vinegarAcidity,
    vinegarParts,
    waterParts,
    saltPercent,
    sugarPercent,
  };
}

/**
 * Valida estado vindo de link compartilhado ou de receita guardada.
 *
 * Além dos tipos, confere a coerência entre modo e preset: um link que diga
 * "modo salmoura, preset chucrute" renderizaria a tela errada para a conta
 * certa, e nesta calculadora isso passa por cima de um aviso de segurança.
 */
export function parsePicklesState(value: unknown): PicklesState | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;

  if (!MODES.includes(record.mode as PickleMode)) return null;
  if (typeof record.presetId !== 'string') return null;

  const preset = getPreset(record.presetId);
  if (!preset || preset.mode !== record.mode) return null;

  const brine = parseBrine(record.brine);
  const vinegar = parseVinegar(record.vinegar);
  if (!brine || !vinegar) return null;

  return { mode: record.mode as PickleMode, presetId: record.presetId, brine, vinegar };
}
