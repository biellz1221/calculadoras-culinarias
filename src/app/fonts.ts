import { Atkinson_Hyperlegible, Fraunces } from 'next/font/google';

/**
 * Fraunces para títulos: serifa variável, quente e levemente excêntrica — a voz
 * de um livro de receitas. O eixo SOFT arredonda os terminais.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT'],
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
