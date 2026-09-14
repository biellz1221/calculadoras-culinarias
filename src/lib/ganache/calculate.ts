import {
  WATER_CONTENT,
  WHITE_EXTRA_COCOA_BUTTER,
  getTexture,
} from '@/data/ganache/textures';
import type { GanacheInput, GanacheResult, Range } from '@/data/ganache/types';

/**
 * Motor da calculadora de ganache.
 *
 * A conta é a tabela do Wybauw aplicada ao peso das substâncias moles. O que a
 * calculadora acrescenta à multiplicação é a **água**: os teores do creme (60 %)
 * e da manteiga (17 %) são publicados, e somá-los dá a grandeza que decide a
 * validade — a única alavanca que o livro manda mexer para prolongá-la.
 *
 * O Aw **não** é calculado. Não é média ponderada, e estimá-lo a partir da
 * receita seria inventar precisão que a fonte não dá.
 *
 * Tudo em número puro, sem arredondar. Arredondamento é apresentação.
 */

const ZERO: Range = { min: 0, max: 0 };

const scale = (range: Range, grams: number): Range => ({
  min: range.min * grams,
  max: range.max * grams,
});

const midpoint = (range: Range): number => (range.min + range.max) / 2;

export function calculateGanache(input: GanacheInput): GanacheResult {
  const texture = getTexture(input.textureId);
  const softGrams = Math.max(0, input.softGrams);

  if (!texture) {
    return {
      chocolateGrams: ZERO,
      butterGrams: ZERO,
      extraCocoaButterGrams: 0,
      totalGrams: ZERO,
      waterGrams: ZERO,
      waterShare: 0,
    };
  }

  const chocolateGrams = scale(texture.chocolate, softGrams);
  const butterGrams = scale(texture.butter, softGrams);

  // Antes da manteiga de cacau extra, que o livro define como 2 % "of the
  // recipe" — logo, do que já existe.
  const base: Range = {
    min: softGrams + chocolateGrams.min + butterGrams.min,
    max: softGrams + chocolateGrams.max + butterGrams.max,
  };

  const extraCocoaButterGrams =
    input.chocolate === 'white' ? midpoint(base) * WHITE_EXTRA_COCOA_BUTTER : 0;

  const totalGrams: Range = {
    min: base.min + extraCocoaButterGrams,
    max: base.max + extraCocoaButterGrams,
  };

  // A substância mole entra como creme: é o caso da tabela e o único cujo teor
  // de água o livro publica. Licor e calda mudariam isto, e a página avisa.
  const waterGrams: Range = {
    min: softGrams * WATER_CONTENT.cream + butterGrams.min * WATER_CONTENT.butter,
    max: softGrams * WATER_CONTENT.cream + butterGrams.max * WATER_CONTENT.butter,
  };

  const totalMid = midpoint(totalGrams);

  return {
    chocolateGrams,
    butterGrams,
    extraCocoaButterGrams,
    totalGrams,
    waterGrams,
    waterShare: totalMid > 0 ? midpoint(waterGrams) / totalMid : 0,
  };
}

/**
 * As porcentagens que o livro publica ao lado da tabela de razões.
 *
 * Existem para o teste conferir a transcrição contra a segunda forma da mesma
 * tabela, que é o que dá confiança na leitura de um PDF com ruído.
 */
export function shareOfTotal(textureId: string): {
  soft: number;
  chocolate: number;
  butter: number;
} | null {
  const texture = getTexture(textureId);
  if (!texture) return null;

  const soft = 1;
  const chocolate = texture.chocolate.min;
  const butter = texture.butter.min;
  const total = soft + chocolate + butter;

  return { soft: soft / total, chocolate: chocolate / total, butter: butter / total };
}
