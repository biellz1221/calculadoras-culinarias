import { DEFAULT_TEXTURE_ID, TEXTURE_IDS } from '@/data/gelling/agents';
import type { GelatinGrade, TextureId } from '@/data/gelling/types';
import { REFERENCE_GRADE_ID } from '@/data/gelling/agents';

/** Estado da calculadora de gelificantes. */
export interface GellingState {
  readonly liquidGrams: number;
  readonly textureId: TextureId;
  readonly gradeId: GelatinGrade['id'];
}

export const initialGellingState: GellingState = {
  liquidGrams: 500,
  textureId: DEFAULT_TEXTURE_ID,
  gradeId: REFERENCE_GRADE_ID,
};

const TEXTURE_SET: Record<TextureId, true> = {
  thin: true,
  sauce: true,
  'fluid-gel': true,
  puree: true,
  set: true,
};

/** Guarda para valor vindo de fora: link compartilhado ou receita salva. */
export function isTextureId(value: unknown): value is TextureId {
  return typeof value === 'string' && Object.hasOwn(TEXTURE_SET, value);
}

const GRADE_SET: Record<GelatinGrade['id'], true> = {
  bronze: true,
  silver: true,
  gold: true,
  knox: true,
  platinum: true,
};

export function isGradeId(value: unknown): value is GelatinGrade['id'] {
  return typeof value === 'string' && Object.hasOwn(GRADE_SET, value);
}

/** O registro precisa cobrir a lista, e o tipo garante isso na compilação. */
export const ALL_TEXTURES = TEXTURE_IDS;
