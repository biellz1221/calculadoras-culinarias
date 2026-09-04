import { RANGES, type RangeRule } from '@/data/bread/ranges';

/**
 * Escalar uma receita que a pessoa já tem (FR-013).
 *
 * A calculadora principal parte de uma fórmula nossa, com fonte. Esta parte do
 * papel de alguém: a receita da avó, a do caderno, a de um blog. Não há
 * proporção a citar aqui — o que a ferramenta faz é regra de três, e a única
 * coisa que ela acrescenta de conhecimento é a leitura em porcentagem de
 * padeiro, quando dá para identificar farinha, água e sal.
 *
 * Por isso este módulo não tem citação nenhuma, e não é esquecimento: os
 * números são os que a pessoa trouxe. As faixas sinalizadas, sim, continuam
 * vindo de `data/bread/ranges.ts`, com fonte.
 */

export type LineRole = 'flour' | 'water' | 'salt' | 'other';

export interface ScaleLine {
  /** Estável dentro de uma análise: é a ordem em que a linha foi escrita. */
  readonly id: string;
  readonly name: string;
  readonly grams: number;
  readonly role: LineRole;
  /** A pessoa escreveu em ml; contamos como grama e dizemos isso na tela. */
  readonly fromMilliliters: boolean;
}

export type ScaleTarget =
  | { readonly kind: 'flour'; readonly grams: number }
  | { readonly kind: 'total'; readonly grams: number }
  | { readonly kind: 'units'; readonly count: number; readonly unitGrams: number };

export interface ScaleAnalysis {
  /** Hidratação sobre a farinha identificada, em %. */
  readonly hydration: number;
  readonly salt: number;
  readonly hydrationRule: RangeRule;
  readonly saltRule: RangeRule;
}

export interface ScaledRecipe {
  readonly lines: readonly ScaleLine[];
  readonly totalGrams: number;
  readonly flourGrams: number;
  readonly factor: number;
  /**
   * Só existe quando há farinha identificável. Sem farinha não há régua de 100%,
   * e mostrar porcentagem de outra coisa seria inventar um número.
   */
  readonly analysis?: ScaleAnalysis;
}

/* -------------------------------------------------------------------------- */
/* Leitura do que foi colado                                                   */
/* -------------------------------------------------------------------------- */

/** Sem acento e em minúscula, para "Água" e "AGUA" caírem no mesmo lugar. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Palavras que identificam o papel do ingrediente, nos dois idiomas.
 *
 * A comparação é por palavra inteira, e não por trecho: "sal" dentro de "salsa"
 * transformaria salsinha em sal e estragaria a análise inteira — e o sal é
 * justamente o número que a faixa sinaliza.
 */
const ROLE_WORDS: Record<Exclude<LineRole, 'other'>, readonly string[]> = {
  // Só palavras que sozinhas já significam farinha. "Integral" e "trigo" ficaram
  // de fora depois de "leite integral" ser classificado como farinha: são
  // adjetivos, e o substantivo que importa ("farinha") já está na lista.
  flour: [
    'farinha',
    'farinhas',
    'flour',
    'harina',
    'semola',
    'semolina',
    'centeio',
    'rye',
    'polvilho',
    'fuba',
  ],
  // Leite entra junto porque hidrata a massa como a água — é o mesmo critério
  // de `isHydrationLiquid` no motor principal.
  water: ['agua', 'water', 'leite', 'milk'],
  salt: ['sal', 'salt'],
};

export function classifyLine(name: string): LineRole {
  const words = new Set(normalize(name).split(/[^a-z0-9]+/).filter(Boolean));

  // Farinha primeiro: "farinha de trigo com sal" é farinha, não sal.
  for (const role of ['flour', 'water', 'salt'] as const) {
    if (ROLE_WORDS[role].some((word) => words.has(word))) return role;
  }

  return 'other';
}

/**
 * Número escrito por gente.
 *
 * A regra do separador: com dois presentes, o último é o decimal. Com um só,
 * ele é separador de milhar quando vêm exatamente três dígitos depois — é o que
 * faz "1.000" virar mil e "0,5" virar meio, que é como as duas coisas são
 * escritas de verdade. "1,500" é ambíguo para qualquer leitor humano também, e
 * aqui vira mil e quinhentos.
 */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, '');
  if (!/^\d[\d.,]*$/.test(cleaned)) return null;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const separator = Math.max(lastComma, lastDot);

  if (separator === -1) return Number(cleaned);

  const decimals = cleaned.length - separator - 1;
  const hasBoth = lastComma !== -1 && lastDot !== -1;

  if (!hasBoth && decimals === 3) {
    return Number(cleaned.replace(/[.,]/g, ''));
  }

  const whole = cleaned.slice(0, separator).replace(/[.,]/g, '');
  return Number(`${whole}.${cleaned.slice(separator + 1)}`);
}

/** Quantidade com unidade de massa declarada: `500 g`, `1,2 kg`, `350 ml`. */
const WITH_UNIT = /(\d[\d.,]*)\s*(kg|g|ml|l|litros?|liters?)\b/gi;

/** Quantidade sem unidade nenhuma: a linha `Farinha 500`. */
const BARE = /(\d[\d.,]*)/g;

/**
 * Unidades que aparecem em instrução, não em ingrediente.
 *
 * "Deixe descansar por 30 minutos" tem um número e não é linha de receita.
 * Sem esta lista, ela entraria como um ingrediente chamado "Deixe descansar
 * por" pesando 30 g.
 */
const NOT_A_WEIGHT =
  /^\s*(min|mins|minutos?|minutes?|h|horas?|hours?|dias?|days?|°|graus|degrees|c\b|f\b|%|x\b|un|unidades?)/i;

/** Nome de ingrediente é curto. Passou disso, é frase. */
const MAX_NAME_WORDS = 6;

/**
 * Verbos e palavras de preparo.
 *
 * "Forno a 250" e "Descanse 40" passam por tudo o mais: são curtas e o número
 * não vem seguido de unidade nenhuma. O que as denuncia é o próprio nome.
 *
 * A lista não fecha o assunto, e não precisa: a interface mostra a tabela do
 * que foi lido antes de escalar, com um botão de apagar em cada linha. O que
 * escapar daqui é visível e removível — o que não pode é entrar calado na
 * conta.
 */
const INSTRUCTION_WORDS = new Set([
  'forno',
  'oven',
  'descanse',
  'descansar',
  'rest',
  'asse',
  'assar',
  'bake',
  'misture',
  'misturar',
  'mix',
  'deixe',
  'leave',
  'sove',
  'sovar',
  'knead',
  'aqueca',
  'preheat',
  'tempo',
  'time',
  'temperatura',
  'temperature',
  'rendimento',
  'yield',
  'serve',
  'serves',
]);

function looksLikeInstruction(name: string): boolean {
  return normalize(name)
    .split(/[^a-z0-9]+/)
    .some((word) => INSTRUCTION_WORDS.has(word));
}

interface ParsedAmount {
  grams: number;
  fromMilliliters: boolean;
  start: number;
  end: number;
}

function toGrams(raw: string, unit: string): ParsedAmount | null {
  const value = parseAmount(raw);
  if (value === null || !Number.isFinite(value) || value <= 0) return null;

  const normalized = unit.toLowerCase();
  const isLitre = normalized.startsWith('l');
  const factor = normalized === 'kg' || isLitre ? 1000 : 1;

  return {
    grams: value * factor,
    fromMilliliters: normalized === 'ml' || isLitre,
    start: 0,
    end: 0,
  };
}

/**
 * A quantidade da linha.
 *
 * Prefere a que traz unidade de massa, e entre elas a última. É o que resolve
 * "Farinha de trigo tipo 1 — 1000 g": o `1` do tipo vem antes e enganaria
 * qualquer busca que pegasse o primeiro número.
 */
function findAmount(line: string): ParsedAmount | null {
  const withUnit = [...line.matchAll(WITH_UNIT)];
  const last = withUnit.at(-1);

  if (last?.index !== undefined) {
    const parsed = toGrams(last[1] ?? '', last[2] ?? '');
    if (!parsed) return null;

    return { ...parsed, start: last.index, end: last.index + last[0].length };
  }

  // Sem unidade, só aceitamos número solto em linha curta: é a diferença entre
  // "Farinha 500" e "Misture tudo e deixe descansar por 30 minutos".
  const bare = [...line.matchAll(BARE)].at(-1);
  if (bare?.index === undefined) return null;

  const after = line.slice(bare.index + bare[0].length);
  if (NOT_A_WEIGHT.test(after)) return null;

  const parsed = toGrams(bare[1] ?? '', '');
  if (!parsed) return null;

  return { ...parsed, start: bare.index, end: bare.index + bare[0].length };
}

/** Sobras de pontuação e conectivos que ficam grudados no nome. */
function cleanName(value: string): string {
  return value
    .replace(/^[\s\-–—•*·:,.]+/, '')
    .replace(/[\s\-–—•*·:,.]+$/, '')
    .replace(/^(de|do|da|of)\s+/i, '')
    .trim();
}

/**
 * Uma linha por ingrediente, no formato que a pessoa escreveu.
 *
 * Aceita o nome antes ou depois da quantidade, porque as duas formas são
 * comuns: "Farinha 500 g" e "500 g de farinha". Linha sem número nenhum é
 * descartada em silêncio — é título de seção ("Para a massa:") ou instrução, e
 * avisar sobre cada uma seria ruído.
 */
export function parseRecipeText(text: string): ScaleLine[] {
  const lines: ScaleLine[] = [];

  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line) continue;

    const amount = findAmount(line);
    if (!amount || amount.grams <= 0) continue;

    const name = cleanName(
      `${line.slice(0, amount.start)} ${line.slice(amount.end)}`.replace(/\s+/g, ' '),
    );
    if (!name) continue;

    // Nome comprido é frase de instrução que sobreviveu à checagem de unidade.
    if (name.split(/\s+/).length > MAX_NAME_WORDS) continue;
    if (looksLikeInstruction(name)) continue;

    lines.push({
      id: `line-${index}`,
      name,
      grams: amount.grams,
      role: classifyLine(name),
      fromMilliliters: amount.fromMilliliters,
    });
  }

  return lines;
}

/* -------------------------------------------------------------------------- */
/* Escala                                                                      */
/* -------------------------------------------------------------------------- */

function sumOf(lines: readonly ScaleLine[], role?: LineRole): number {
  return lines.reduce(
    (total, line) => (role === undefined || line.role === role ? total + line.grams : total),
    0,
  );
}

export function flourGramsOf(lines: readonly ScaleLine[]): number {
  return sumOf(lines, 'flour');
}

/** Quanto a receita precisa crescer ou encolher para chegar ao alvo. */
export function scaleFactor(lines: readonly ScaleLine[], target: ScaleTarget): number {
  if (lines.length === 0) return 0;

  if (target.kind === 'flour') {
    const flour = flourGramsOf(lines);
    return flour > 0 ? target.grams / flour : 0;
  }

  const total = sumOf(lines);
  if (total <= 0) return 0;

  const wanted =
    target.kind === 'total'
      ? target.grams
      : Math.max(0, target.count) * Math.max(0, target.unitGrams);

  return wanted / total;
}

export function scaleRecipe(
  lines: readonly ScaleLine[],
  target: ScaleTarget,
): ScaledRecipe {
  const factor = scaleFactor(lines, target);
  const scaled = lines.map((line) => ({ ...line, grams: line.grams * factor }));

  const flourGrams = flourGramsOf(scaled);
  const hydrationGrams = sumOf(scaled, 'water');
  const saltGrams = sumOf(scaled, 'salt');

  return {
    lines: scaled,
    totalGrams: sumOf(scaled),
    flourGrams,
    factor,
    // Sem farinha não há régua de 100%. A análise some inteira em vez de
    // aparecer com zeros, que passariam por leitura válida.
    analysis:
      flourGrams > 0
        ? {
            hydration: (hydrationGrams / flourGrams) * 100,
            salt: (saltGrams / flourGrams) * 100,
            hydrationRule: RANGES.hydration,
            saltRule: RANGES.salt,
          }
        : undefined,
  };
}
