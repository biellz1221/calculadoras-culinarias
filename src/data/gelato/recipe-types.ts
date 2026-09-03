// Faixas extraídas de "Planilha gelato do Curso - 4.0 (2).xlsx",
// bloco "Parâmetros de tolerância para cada receita" (aba "Tabela de ingredientes", S4:AA22).
// Sólidos e água em fração de 0 a 1; POD e PAC em valor absoluto por kg de mistura.
//
// `name` e `description` são texto de referência em pt-BR: a interface bilíngue
// deve buscar o rótulo no dicionário de idioma usando o `id` como chave.

import type { RecipeType } from '@/lib/gelato/types';

export const RECIPE_TYPES: readonly RecipeType[] = [
  {
    id: 'gelato-leite',
    name: 'Gelato de leite',
    description: 'Base branca clássica, sem fruta.',
    ranges: {
      sugars: { min: 0.14, max: 0.22 },
      fats: { min: 0.05, max: 0.12 },
      msnf: { min: 0.08, max: 0.12 },
      otherSolids: { min: 0, max: 0.08 },
      totalSolids: { min: 0.34, max: 0.42 },
      water: { min: 0.58, max: 0.66 },
      pod: { min: 135, max: 200 },
      pac: { min: 220, max: 300 },
    },
  },
  {
    id: 'gelato-leite-fruta',
    name: 'Gelato de leite com fruta',
    description: 'Base de leite com polpa ou fruta in natura.',
    ranges: {
      sugars: { min: 0.17, max: 0.22 },
      // A planilha traz "8%" como texto na célula U15; equivale a 0,08.
      fats: { min: 0.04, max: 0.08 },
      msnf: { min: 0.06, max: 0.1 },
      otherSolids: { min: 0.005, max: 0.08 },
      totalSolids: { min: 0.33, max: 0.42 },
      water: { min: 0.57, max: 0.67 },
      pod: { min: 140, max: 200 },
      pac: { min: 220, max: 300 },
    },
  },
  {
    id: 'sorbet',
    name: 'Sorbet',
    description: 'Base de água com fruta, sem laticínios.',
    ranges: {
      sugars: { min: 0.23, max: 0.32 },
      fats: { min: 0, max: 0.02 },
      msnf: { min: 0, max: 0.001 },
      otherSolids: { min: 0.005, max: 0.18 },
      totalSolids: { min: 0.27, max: 0.35 },
      water: { min: 0.65, max: 0.73 },
      pod: { min: 175, max: 240 },
      pac: { min: 275, max: 375 },
    },
  },
  {
    id: 'chocolate-agua',
    name: 'Chocolate — base de água',
    description: 'Chocolate sem leite, estruturado por cacau.',
    ranges: {
      sugars: { min: 0.18, max: 0.24 },
      fats: { min: 0.01, max: 0.1 },
      msnf: { min: 0, max: 0.01 },
      otherSolids: { min: 0.04, max: 0.12 },
      totalSolids: { min: 0.34, max: 0.44 },
      water: { min: 0.56, max: 0.66 },
      pod: { min: 140, max: 260 },
      pac: { min: 220, max: 300 },
    },
  },
  {
    id: 'base-vegana',
    name: 'Base vegana',
    description: 'Leites e gorduras vegetais no lugar do leite.',
    ranges: {
      sugars: { min: 0.18, max: 0.24 },
      fats: { min: 0.08, max: 0.13 },
      msnf: { min: 0, max: 0.01 },
      otherSolids: { min: 0.03, max: 0.15 },
      totalSolids: { min: 0.35, max: 0.42 },
      water: { min: 0.58, max: 0.65 },
      pod: { min: 129, max: 195 },
      pac: { min: 210, max: 300 },
    },
  },
];

export const DEFAULT_RECIPE_TYPE_ID = 'gelato-leite';
