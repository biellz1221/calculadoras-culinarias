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
export const SNAPSHOT_VERSION = 1;

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
  readonly s: unknown;
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
export function encodeSnapshot(calculator: CalculatorId, state: unknown): string {
  const envelope: Envelope = { v: SNAPSHOT_VERSION, c: calculator, s: state };
  const json = JSON.stringify(envelope);

  return toBase64Url(new TextEncoder().encode(json));
}

/**
 * Volta de texto para estado, validando pelo caminho.
 *
 * `parse` é a última palavra: ele recebe `unknown` e devolve o estado tipado ou
 * `null`. É lá que se checa faixa de valor, preset que ainda existe e campo que
 * mudou de tipo — coisas que o formato do envelope não tem como saber.
 */
export function decodeSnapshot<S>(
  encoded: string,
  calculator: CalculatorId,
  parse: (value: unknown) => S | null,
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

  const state = parse(envelope.s);
  return state === null ? { status: 'invalid' } : { status: 'ok', state };
}
