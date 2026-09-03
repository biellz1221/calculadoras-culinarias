# Aprendizados recorrentes

Consultar antes de começar tarefa neste projeto. Cada item nasceu de um erro que
já custou tempo aqui; a ideia é não pagar duas vezes.

## Next 16 com `output: 'export'`

- **Route handler sem `export const dynamic = 'force-static'` quebra o build.**
  A mensagem fala de `revalidate` e não diz qual arquivo. Vale para
  `/llms.txt`, para as imagens de OG, para `robots.ts` e `sitemap.ts`.
- **A convenção `opengraph-image` grava arquivo sem extensão.** Servidor de
  arquivo estático decide `Content-Type` pela extensão, então o card chega ao
  Facebook como binário genérico e não aparece. A saída foi gerar a imagem por
  route handler num caminho que termina em `.png` de verdade.
- **`openGraph` não se funde entre layout e página.** Quem declarar por último
  substitui o bloco inteiro. Uma página que declarasse só `openGraph.title`
  perderia `siteName` e `locale` sem aviso. Por isso existe `pageMetadata`.
- **O Next normaliza o `canonical` da raiz para sem barra final**, mesmo com URL
  absoluta. Como é o campo que não dá para mudar, ele dita a grafia do resto:
  sitemap, `og:url` e JSON-LD seguem `absoluteUrl`.
- **`NODE_ENV=development` exportado no shell** derruba o `next build` com erro
  de `useContext`. O script já força `production`.

## Fontes e tipografia

- **Satori não lê WOFF2**, que é o que o `next/font` entrega. Para gerar imagem
  no build é preciso TTF ou OTF em `assets/fonts/`.
- **Google Fonts serve formato pelo `User-Agent`.** Com UA de MSIE vem EOT, e o
  erro que aparece é `Unsupported OpenType signature`. Sem UA (ou com
  `Mozilla/5.0` puro) vem TTF.
- **Eixo de fonte variável que ninguém usa é peso puro.** A Fraunces vinha com o
  eixo `SOFT` declarado e nenhum `font-variation-settings` no CSS: 25,5 KB a
  mais no caminho crítico, para renderizar o valor padrão.

## Dados e conteúdo

- **Nome de instituição não tem sobrenome.** Cortar a última palavra
  transformava "University of Georgia" em "Georgia". Autor institucional declara
  `authorKind: 'organization'`.
- **Calculadora nova precisa entrar em todo lugar que fala do catálogo.** O
  gelato ficou publicado por semanas fora do título e da descrição da home. O
  registro `PUBLISHED_ROUTES` acende o link e o sitemap, mas texto de marketing
  não se atualiza sozinho.
- **Descrição de página tem teto de 160 caracteres.** O que passa disso é
  cortado, e o corte come justamente o fim da frase, onde costuma estar o
  argumento. Há teste que falha por isso.

## Interface

- **`sr-only` dentro de `overflow-x-auto` alarga a página.** Ele é
  `position: absolute` e se ancora fora do container de rolagem. Para rótulo de
  campo em tabela rolável, use `aria-label` no input.
- **Sufixo de unidade dentro do `<label>`** entra no nome acessível ("Peso da
  massa g") e quebra `getByLabel`. Fica fora, com `aria-hidden`.
- **Animação com deslocamento lateral alarga a página enquanto roda.** A casca
  do site usa `overflow-x-clip` por causa disso.

## Testes

- **Playwright em `127.0.0.1` não hidrata**: o dev server do Next bloqueia
  `/_next` de outra origem. A página carrega e todo teste de interação falha
  parecendo bug de estado. O `baseURL` usa `localhost`.
- **`fill()` em `input[type=number]` é sempre com ponto**, mesmo o site exibindo
  vírgula. Nos testes, `'0.8'`.
- **O navegador do teste precisa declarar `locale: 'pt-BR'`**, senão a
  autodetecção manda tudo para `/en`.
