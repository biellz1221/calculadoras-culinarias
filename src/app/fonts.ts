import { Atkinson_Hyperlegible, Fraunces } from 'next/font/google';

/**
 * Fraunces para títulos: serifa variável, quente e levemente excêntrica, a voz
 * de um livro de receitas.
 *
 * Só o eixo de peso é baixado. O eixo SOFT já esteve aqui, mas nada no CSS
 * chega a mexer nele: o arquivo vinha carregando um eixo inteiro para
 * renderizar sempre o valor padrão. Se um dia um `font-variation-settings`
 * usar SOFT, ele volta com a conta paga por algo visível.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

/**
 * Atkinson Hyperlegible para texto e números: foi desenhada para legibilidade,
 * com 0/O e 1/l inconfundíveis. Numa receita, ler 1 como l estraga a fornada —
 * aqui isso é requisito de produto, não estilo.
 */
export const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atkinson',
  weight: ['400', '700'],
});
