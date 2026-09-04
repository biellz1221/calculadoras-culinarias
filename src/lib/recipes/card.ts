/**
 * A receita calculada, no formato que serve às três saídas: texto para
 * compartilhar, folha para imprimir e prévia da receita salva.
 *
 * Cada calculadora monta um destes a partir do próprio resultado, com os
 * números já formatados na precisão em que a pessoa vai pesar. Centralizar a
 * *forma* e deixar o *conteúdo* com quem sabe calcular é o que impede as três
 * saídas de divergirem — o caso clássico é o aviso de segurança aparecer na
 * tela e sumir no papel.
 */

export interface RecipeCardLine {
  readonly label: string;
  readonly value: string;
  /** Linha que carrega o resultado principal do bloco. */
  readonly strong?: boolean;
}

export interface RecipeCardGroup {
  readonly heading?: string;
  readonly lines: readonly RecipeCardLine[];
}

export interface RecipeCard {
  readonly title: string;
  readonly subtitle?: string;
  readonly groups: readonly RecipeCardGroup[];
  /**
   * Avisos que acompanham o resultado onde quer que ele vá.
   *
   * É aqui que entra o aviso de sal ou de acidez abaixo do mínimo seguro. A
   * regra do projeto é que ele acompanha o resultado inclusive na impressão —
   * quem leva o papel para a bancada é justamente quem não vai reabrir a tela.
   */
  readonly notices: readonly string[];
  readonly sources: readonly string[];
}

export interface RecipeCardTextLabels {
  readonly sources: string;
}

/**
 * Rótulo de dicionário por chave que veio de fora.
 *
 * `dicionario[chave]` parece inofensivo e não é: em JavaScript,
 * `objeto['__proto__']` devolve o `Object.prototype`, não `undefined`. Um
 * rótulo que deveria ser texto vira objeto, e o React derruba a página ao
 * receber isso como filho.
 *
 * A validação de catálogo em cada `parse…State` já impede que chave inventada
 * chegue aqui. Isto é a segunda tranca: a primeira depende de alguém lembrar de
 * validar na calculadora seguinte, esta não.
 */
export function labelFor(labels: Readonly<Record<string, string>>, key: string): string {
  return Object.hasOwn(labels, key) ? labels[key] ?? '' : '';
}

/**
 * Versão em texto puro, para colar em conversa.
 *
 * Sem tabela, sem alinhamento por espaços e sem caractere de caixa: o destino
 * é um aplicativo de mensagem com fonte proporcional, onde tudo isso vira
 * sujeira. `Rótulo: valor`, uma linha por ingrediente, é o que sobrevive.
 */
export function recipeCardText(
  card: RecipeCard,
  labels: RecipeCardTextLabels,
  url?: string,
): string {
  const blocks: string[] = [];

  blocks.push(card.subtitle ? `${card.title}\n${card.subtitle}` : card.title);

  for (const group of card.groups) {
    const lines = group.lines.map((line) => `${line.label}: ${line.value}`);
    if (lines.length === 0) continue;

    blocks.push(group.heading ? [group.heading, ...lines].join('\n') : lines.join('\n'));
  }

  for (const notice of card.notices) blocks.push(`⚠ ${notice}`);

  if (card.sources.length > 0) {
    blocks.push(`${labels.sources}: ${card.sources.join(' · ')}`);
  }

  if (url) blocks.push(url);

  return blocks.join('\n\n');
}
