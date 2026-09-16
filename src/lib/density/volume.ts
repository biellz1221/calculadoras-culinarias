/**
 * Mililitro para grama, e de volta, dada uma densidade em g/mL.
 *
 * A conta é a mais simples do motor; o que ela exige é a densidade certa, e
 * essa vem de `ethanol.ts` e `sucrose.ts`. Volume negativo ou densidade que não
 * é número positivo devolvem zero, como os outros motores do site fazem com
 * entrada que não descreve nada.
 */

function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function gramsFromMilliliters(milliliters: number, density: number): number {
  if (!isPositive(milliliters) || !isPositive(density)) return 0;
  return milliliters * density;
}

export function millilitersFromGrams(grams: number, density: number): number {
  if (!isPositive(grams) || !isPositive(density)) return 0;
  return grams / density;
}
