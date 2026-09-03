# Fontes da imagem de compartilhamento

Estes dois arquivos existem só para gerar as imagens de Open Graph em
`src/app/og/`. O site em si carrega as mesmas fontes por `next/font/google`,
que entrega WOFF2 — formato que o gerador de imagem (Satori) não lê. Daí a
cópia em TTF aqui, já no subconjunto latino.

| Arquivo                             | Família              | Licença |
| ----------------------------------- | -------------------- | ------- |
| `Fraunces-SemiBold.ttf`             | Fraunces 600         | SIL OFL 1.1 |
| `AtkinsonHyperlegible-Regular.ttf`  | Atkinson Hyperlegible 400 | SIL OFL 1.1 |

As duas são OFL, que permite uso e redistribuição embutida. Origem: Google
Fonts (`fonts.gstatic.com`), instância estática do subconjunto `latin`.

Para trocar de peso ou de família, baixe o TTF correspondente e ajuste
`src/app/og/[slug]/image.png/route.tsx`. O gerador tem teto de 500 KB somando
JSX, CSS e fontes, então prefira instâncias estáticas a fontes variáveis.
