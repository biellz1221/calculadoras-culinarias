import {
  DEFAULT_BATH_GRAMS,
  DEFAULT_TEXTURE_ID,
  TEXTURE_IDS,
} from '@/data/gelling/agents';
import type {
  GelatinGrade,
  SpherificationId,
  TextureId,
} from '@/data/gelling/types';
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

/** Estado da parte de esferificação, que é a outra pergunta da página. */
export interface SpherificationState {
  readonly liquidGrams: number;
  readonly bathGrams: number;
  readonly methodId: SpherificationId;
}

export const initialSpherificationState: SpherificationState = {
  liquidGrams: 500,
  bathGrams: DEFAULT_BATH_GRAMS,
  methodId: 'direct',
};

const METHOD_SET: Record<SpherificationId, true> = { direct: true, reverse: true };

export function isSpherificationId(value: unknown): value is SpherificationId {
  return typeof value === 'string' && Object.hasOwn(METHOD_SET, value);
}

const TEXTURE_SET: Record<TextureId, true> = {
  thin: true,
  sauce: true,
  puree: true,
  'fluid-gel': true,
  'soft-set': true,
  set: true,
  'hard-set': true,
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
