import { cite, type Citation } from '@/data/citations';
import type { YeastKey } from '@/data/bread/types';

/**
 * Conversão entre fermentos.
 *
 * As duas fontes parecem discordar — Kayser divide o fresco por 2, Camargo por
 * 3 — mas não discordam: falam de fermentos diferentes. Kayser trata do seco
 * ativo (que precisa ser hidratado antes) e Camargo do seco instantâneo (que
 * vai direto na farinha). Por isso a tabela tem os dois fatores, por tipo, em
 * vez de escolher um "vencedor".
 */
const POWER_RELATIVE_TO_FRESH: Record<YeastKey, number> = {
  'yeast-fresh': 1,
  'yeast-active-dry': 1 / 2,
  'yeast-instant': 1 / 3,
};

export const YEAST_CITATIONS: Record<YeastKey, Citation[]> = {
  'yeast-fresh': [cite('kayser', 16)],
  'yeast-active-dry': [cite('kayser', 16)],
  'yeast-instant': [cite('camargo', 'cap. 1, "Sobre o fermento"')],
};

export function convertYeast(grams: number, from: YeastKey, to: YeastKey): number {
  if (grams <= 0) return 0;

  const fromFactor = POWER_RELATIVE_TO_FRESH[from];
  const toFactor = POWER_RELATIVE_TO_FRESH[to];

  return (grams * toFactor) / fromFactor;
}

/** Levain líquido ↔ levain desidratado: 4 para 1 (Kayser, p. 48 e p. 242). */
export const DRIED_LEVAIN_RATIO = 4;

export function driedLevainFor(liquidLevainGrams: number): number {
  return Math.max(0, liquidLevainGrams) / DRIED_LEVAIN_RATIO;
}

export interface LevainSubstitution {
  /** Levain líquido a usar, em gramas. */
  levainGrams: number;
  /** Farinha a descontar da receita (metade do levain, que é 100% hidratado). */
  flourAdjustment: number;
  /** Água a descontar da receita. */
  waterAdjustment: number;
}

/**
 * Troca de fermento biológico por levain líquido.
 *
 * Não existe fator de conversão entre os dois: o levain trabalha por dose sobre
 * a farinha — 20 a 50%, sendo 20% o padrão das massas magras (Kayser, p. 24).
 * Como o levain é metade farinha e metade água, entrar com ele sem descontar
 * essas partes muda a hidratação da massa; daí os dois ajustes devolvidos aqui.
 */
export function levainSubstitution(
  flourGrams: number,
  levainPercentOfFlour = 20,
): LevainSubstitution {
  const levainGrams = (Math.max(0, flourGrams) * Math.max(0, levainPercentOfFlour)) / 100;
  const half = levainGrams / 2;

  return {
    levainGrams,
    flourAdjustment: half,
    waterAdjustment: half,
  };
}

/**
 * Quanto o tempo da primeira fermentação muda ao alterar a dose de fermento.
 *
 * Regra prática do Camargo: cortar o fermento pela metade dobra o tempo — ou
 * seja, tempo é inversamente proporcional à dose. É orientação de planejamento,
 * não promessa: temperatura ambiente e força da farinha mexem no resultado.
 */
export function riseTimeFactor(fromPercent: number, toPercent: number): number {
  if (toPercent <= 0 || fromPercent <= 0) return 1;
  return fromPercent / toPercent;
}

export const RISE_TIME_CITATION = cite(
  'camargo',
  'cap. 1, "Planejando as fornadas"',
);

/**
 * Temperatura da água pela temperatura de base (Kayser, p. 20).
 *
 * A soma das temperaturas do ambiente, da farinha e da água deve dar a
 * temperatura de base do tipo de pão, para a massa sair a 24–25 °C da sova.
 */
export function waterTemperature(
  baseTemperature: number,
  roomTemperature: number,
  flourTemperature: number,
): number {
  return baseTemperature - roomTemperature - flourTemperature;
}

/** Faixas de temperatura de base: pão branco e pães escuros (Kayser, p. 20). */
export const BASE_TEMPERATURE = {
  white: [54, 56] as const,
  dark: [58, 65] as const,
};

export const BASE_TEMPERATURE_CITATION = cite('kayser', 20);
