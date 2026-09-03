'use client';

/**
 * Barreira de erro de último recurso: entra em cena quando o próprio root
 * layout falha, então precisa trazer o seu próprio <html>/<body> e não pode
 * depender do CSS do site ter carregado — daí os estilos inline.
 *
 * O site tem um root layout por idioma; sem este arquivo, o global-error
 * padrão do Next não encontra layout algum para renderizar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fbf6ee',
          color: '#2a2521',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '32rem' }}>
          <h1
            style={{
              fontFamily: 'ui-serif, Georgia, serif',
              fontSize: '1.75rem',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Alguma coisa quebrou por aqui
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6, color: '#574d43' }}>
            O erro foi inesperado e nenhum dado seu foi perdido — tudo o que você
            calcula fica no seu navegador.
          </p>
          {error.digest ? (
            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6f6558' }}>
              Código do erro: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.75rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#2a2521',
              color: '#fbf6ee',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
