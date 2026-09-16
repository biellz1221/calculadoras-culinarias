import {
  ETHANOL_DENSITY_20C,
  OIML_A,
  OIML_B,
  OIML_C,
  OIML_MAX_CELSIUS,
  OIML_MIN_CELSIUS,
  OIML_REFERENCE_CELSIUS,
} from '@/data/density/ethanol';

/**
 * Densidade de mistura de água e etanol, pela fórmula da OIML R 22.
 *
 * Tudo aqui é **densidade verdadeira** em g/mL — a grandeza da fonte, e a
 * mesma que o resto do site usa. O motor não arredonda.
 */

function isFraction(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function isLiquidRange(celsius: number): boolean {
  return (
    Number.isFinite(celsius) &&
    celsius >= OIML_MIN_CELSIUS &&
    celsius <= OIML_MAX_CELSIUS
  );
}

/**
 * A fórmula geral, em kg/m³ (p. 5):
 *
 *     ρ = A₁ + Σ Aₖ·p^(k−1) + Σ Bₖ·(t−20)^k + Σᵢ Σₖ Cᵢ,ₖ·p^k·(t−20)^i
 *
 * Sem guarda: quem chama já conferiu a faixa.
 */
function oimlFormula(massFraction: number, celsius: number): number {
  const dt = celsius - OIML_REFERENCE_CELSIUS;
  let rho = OIML_A[1]!;

  for (let k = 2; k < OIML_A.length; k++) {
    rho += OIML_A[k]! * massFraction ** (k - 1);
  }
  for (let k = 1; k < OIML_B.length; k++) {
    rho += OIML_B[k]! * dt ** k;
  }
  for (let i = 1; i < OIML_C.length; i++) {
    const row = OIML_C[i]!;
    for (let k = 1; k < row.length; k++) {
      rho += row[k]! * massFraction ** k * dt ** i;
    }
  }

  return rho;
}

/**
 * Densidade da mistura em g/mL, dado o teor de etanol **em massa** (fração de
 * 0 a 1) e a temperatura.
 *
 * Nulo fora de 0–40 °C: abaixo de zero a mistura pode estar congelada, e a
 * curva de congelamento não foi transcrita.
 */
export function ethanolWaterDensity(massFraction: number, celsius: number): number | null {
  if (!isFraction(massFraction) || !isLiquidRange(celsius)) return null;
  return oimlFormula(massFraction, celsius) / 1000;
}

/**
 * Teor em volume a partir do teor em massa, pela ponte da p. 5:
 * `q = ρ₂₀(p) · p ÷ ρ₂₀(100%)`. Os dois volumes são medidos a 20 °C, que é a
 * definição de teor em volume.
 */
export function volumeFractionFromMass(massFraction: number): number | null {
  if (!isFraction(massFraction)) return null;
  const rho20 = oimlFormula(massFraction, OIML_REFERENCE_CELSIUS);
  return (rho20 * massFraction) / ETHANOL_DENSITY_20C;
}

/**
 * Teor em massa a partir do teor em volume — o que o rótulo da garrafa traz.
 *
 * A ponte não se inverte por álgebra, mas é crescente de 0 a 1, então bisseção
 * resolve. Em ponto flutuante o intervalo para de encolher por volta do passo 53
 * (~10⁻¹⁶); os sessenta passos só garantem que ele chegou lá, e isso fica muito
 * além do que a fórmula sustenta.
 */
export function massFractionFromVolume(volumeFraction: number): number | null {
  if (!isFraction(volumeFraction)) return null;

  let low = 0;
  let high = 1;
  for (let step = 0; step < 60; step++) {
    const middle = (low + high) / 2;
    const q = (oimlFormula(middle, OIML_REFERENCE_CELSIUS) * middle) / ETHANOL_DENSITY_20C;
    if (q < volumeFraction) low = middle;
    else high = middle;
  }

  return (low + high) / 2;
}
