export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Perguntas frequentes.
 *
 * Marcação deliberadamente simples: um título de pergunta e um parágrafo de
 * resposta, sem acordeão. Conteúdo dobrado atrás de JavaScript é conteúdo que
 * um buscador ou um assistente de IA pode não ler, e a resposta curta em texto
 * corrido é justamente o formato que eles citam. Quem quer só a ferramenta
 * recolhe a seção inteira pelo botão de simplificar.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mt-8 grid gap-x-10 gap-y-8 border-t border-rule pt-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.question}>
          <h3 className="font-display text-base leading-snug font-semibold text-ink">
            {item.question}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
