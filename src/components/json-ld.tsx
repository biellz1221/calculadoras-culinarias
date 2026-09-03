/**
 * Bloco JSON-LD.
 *
 * O conteúdo sai dos nossos dicionários, nunca de entrada de usuário, mas o
 * `<` vai escapado mesmo assim: um texto que contivesse `</script` fecharia a
 * tag antes da hora e derrubaria o resto da página. É uma linha de código
 * contra uma classe inteira de bug.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
