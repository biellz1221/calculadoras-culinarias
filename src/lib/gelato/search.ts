/**
 * Busca do seletor de ingredientes.
 *
 * São 164 ingredientes: sem busca, a lista é inutilizável. E como os rótulos
 * são traduzidos, quem busca digita no idioma da tela — por isso o que entra
 * aqui é o rótulo exibido, não o `name` em pt-BR da planilha.
 */

/** Minúsculas, sem acento e sem espaço nas pontas — "açúcar" acha por "acucar". */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Termos soltos, em qualquer ordem: "acucar dext" acha "Açúcar - Dextrose".
 * Todos os termos precisam aparecer.
 */
export function matchesQuery(text: string, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = normalize(text);
  return terms.every((term) => haystack.includes(term));
}
