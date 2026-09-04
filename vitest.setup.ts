import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

/**
 * A folha de impressão não conta como tela.
 *
 * `PrintSheet` monta a receita uma segunda vez no `body`, escondida por CSS e
 * fora da árvore de acessibilidade, para a impressora ter o que imprimir. Sem
 * esta linha, toda busca por texto acharia dois "Sal" e falharia — e falharia
 * por um motivo que não existe para quem usa o site.
 */
configure({ defaultIgnore: 'script, style, .print-sheet, .print-sheet *' });
