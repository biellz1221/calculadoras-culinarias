import type { CalculatorId } from '@/data/calculators';

/**
 * Estado de uma calculadora empacotado para viajar numa URL.
 *
 * O site não tem servidor (TD-001), então o link **é** o banco de dados: tudo
 * o que a outra pessoa precisa para ver a mesma receita vai dentro do endereço.
 * Daí as três coisas que o envelope carrega junto com o estado:
 *
 * - `v`, a versão do formato. Um link fica em bookmark, em conversa de
 *   WhatsApp, em bloco de notas — e vai ser aberto depois de o campo ter
 *   mudado de nome. Sem versão, o jeito de descobrir isso é a calculadora
 *   abrir com números errados em silêncio.
 * - `c`, a calculadora. Impede que um link de picles seja interpretado como
 *   massa por acaso de os campos coincidirem.
 * - `s`, o estado, opaco aqui de propósito: quem sabe validar os campos é a
 *   própria calculadora, e é ela que passa o `parse`.
 *
 * O conteúdo é entrada não confiável — qualquer pessoa escreve qualquer coisa
 * depois do `?r=`. Nada daqui sai sem passar pelo `parse`.
 */

export const SHARE_PARAM = 'r';

/**
 * Versão do formato. Suba quando um campo mudar de nome ou de significado, e
 * decida no `parse` da calculadora se dá para migrar; o que não dá para ler
 * volta como `outdated` e a interface explica, em vez de fingir.
 */
export const SNAPSHOT_VERSION = 2;

/**
 * Como uma calculadora encolhe o próprio estado para caber num link.
 *
 * A versão 1 mandava o estado inteiro em JSON com nome de campo por extenso, e
 * o resultado eram endereços de até 792 caracteres — grandes o bastante para o
 * WhatsApp cortar o link antes do parâmetro, que foi como o problema apareceu.
 *
 * A ideia da versão 2: quase todo compartilhamento é de um preset com o alvo
 * mexido, então o que viaja é o preset e **só o que difere** dele. Receita
 * intocada vira um punhado de caracteres; quem editou a fórmula paga apenas
 * pelo que editou.
 */
export interface SnapshotShape<S> {
  /** Estado de partida do preset, sobre o qual a diferença é aplicada. */
  baselineFor: (presetId: string) => S | null;
  /** O preset de um estado. É o único campo que viaja sempre. */
  presetOf: (state: S) => string;
  /** A última palavra sobre o que chegou. Roda sobre o estado já remontado. */
  parse: (value: unknown) => S | null;
}

/**
 * Teto de tamanho do parâmetro.
 *
 * Decodificar é trabalho, e o parâmetro vem de fora. 8 kB é ordens de
 * magnitude acima da receita mais longa que a interface consegue montar (a de
 * gelato, com o catálogo inteiro, não passa de ~1 kB) e bem abaixo do que
 * custaria caro processar.
 */
const MAX_ENCODED_LENGTH = 8192;

interface Envelope {
  readonly v: number;
  readonly c: CalculatorId;
  /** Versão 1: o estado inteiro. */
  readonly s?: unknown;
  /** Versão 2: o preset e a diferença em relação a ele. */
  readonly p?: string;
  readonly d?: Record<string, unknown>;
}

/**
 * O que difere do ponto de partida, campo a campo do primeiro nível.
 *
 * A comparação é por JSON, e não por referência: a fórmula de um preset que
 * ninguém tocou é um objeto novo a cada render, mas o texto é idêntico, e é
 * justamente essa igualdade que apaga o campo mais pesado do link.
 */
function difference<S extends object>(state: S, baseline: S): Record<string, unknown> {
  const diff: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(state)) {
    const before = (baseline as Record<string, unknown>)[key];
    if (JSON.stringify(before) !== JSON.stringify(value)) diff[key] = value;
  }

  return diff;
}

export type SnapshotResult<S> =
  /** Estado legível e válido. */
  | { readonly status: 'ok'; readonly state: S }
  /** Envelope legível, versão que esta build não sabe ler. */
  | { readonly status: 'outdated' }
  /** Ilegível, de outra calculadora, ou com campos que não passam na validação. */
  | { readonly status: 'invalid' };

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  // Só o alfabeto base64url; qualquer outro caractere é lixo ou tentativa.
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return null;
  }
}

/** Estado da calculadora em texto seguro para URL. */
export function encodeSnapshot<S extends object>(
  calculator: CalculatorId,
  state: S,
  shape: SnapshotShape<S>,
): string {
  const presetId = shape.presetOf(state);
  const baseline = shape.baselineFor(presetId);

  // Sem ponto de partida reconhecível, manda tudo: link grande é melhor que
  // link que não abre.
  const envelope: Envelope = baseline
    ? { v: 2, c: calculator, p: presetId, d: difference(state, baseline) }
    : { v: 1, c: calculator, s: state };

  return toBase64Url(new TextEncoder().encode(JSON.stringify(envelope)));
}

/**
 * Volta de texto para estado, validando pelo caminho.
 *
 * `parse` é a última palavra: ele recebe `unknown` e devolve o estado tipado ou
 * `null`. É lá que se checa faixa de valor, preset que ainda existe e campo que
 * mudou de tipo — coisas que o formato do envelope não tem como saber.
 */
export function decodeSnapshot<S extends object>(
  encoded: string,
  calculator: CalculatorId,
  shape: SnapshotShape<S>,
): SnapshotResult<S> {
  if (!encoded || encoded.length > MAX_ENCODED_LENGTH) return { status: 'invalid' };

  const bytes = fromBase64Url(encoded);
  if (!bytes) return { status: 'invalid' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { status: 'invalid' };
  }

  if (typeof parsed !== 'object' || parsed === null) return { status: 'invalid' };
  const envelope = parsed as Record<string, unknown>;

  if (envelope.c !== calculator) return { status: 'invalid' };

  // Versão desconhecida antes de validar os campos: um envelope de amanhã pode
  // ter campos que hoje reprovariam, e dizer "inválido" mandaria a pessoa
  // procurar erro onde não tem.
  if (typeof envelope.v !== 'number' || envelope.v > SNAPSHOT_VERSION) {
    return { status: 'outdated' };
  }

  // Versão 1 continua abrindo: um link mandado por WhatsApp fica em conversa
  // por meses, e a versão no envelope existe exatamente para isto.
  if (envelope.v === 1) {
    const state = shape.parse(envelope.s);
    return state === null ? { status: 'invalid' } : { status: 'ok', state };
  }

  if (typeof envelope.p !== 'string') return { status: 'invalid' };

  const baseline = shape.baselineFor(envelope.p);
  if (!baseline) return { status: 'invalid' };

  const diff = envelope.d;
  if (diff !== undefined && (typeof diff !== 'object' || diff === null)) {
    return { status: 'invalid' };
  }

  const state = shape.parse({ ...baseline, ...diff });
  return state === null ? { status: 'invalid' } : { status: 'ok', state };
}
