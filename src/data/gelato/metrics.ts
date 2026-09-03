// Metadados das 8 métricas e das categorias do seletor de ingredientes.
//
// Os textos aqui são referência em pt-BR, herdada da calculadora original: a
// interface bilíngue deve buscar rótulo e ajuda no dicionário de idioma usando a
// MetricKey (ou o slug de categoria) como chave. O que é estrutural e não muda
// com o idioma é a ORDEM — METRIC_KEYS em lib/gelato/calc.ts e CATEGORY_ORDER
// aqui embaixo.

import type { IngredientCategory, MetricKey } from '@/lib/gelato/types';

interface MetricMeta {
  readonly label: string;
  readonly short: string;
  readonly help: string;
}

export const METRIC_META: Readonly<Record<MetricKey, MetricMeta>> = {
  sugars: {
    label: 'Açúcares',
    short: 'AÇÚC',
    help: 'Sacarose e equivalentes. Puxa doçura, corpo e ponto de congelamento.',
  },
  fats: {
    label: 'Gorduras',
    short: 'GORD',
    help: 'Gordura total. Responsável por cremosidade e sensação na boca.',
  },
  msnf: {
    label: 'SNGL',
    short: 'SNGL',
    help: 'Sólidos não gordurosos do leite (proteína + lactose + minerais). Dá estrutura.',
  },
  otherSolids: {
    label: 'Outros sólidos',
    short: 'OS',
    help: 'Sólidos que não são açúcar, gordura nem SNGL: fibras, cacau, neutro, polpa.',
  },
  totalSolids: {
    label: 'Sólidos totais',
    short: 'ST',
    help: 'Tudo que não é água. Define o rendimento e a resistência ao derretimento.',
  },
  water: {
    label: 'Água',
    short: 'ÁGUA',
    help: 'Água livre da mistura. Água demais vira cristal de gelo.',
  },
  pod: {
    label: 'POD',
    short: 'POD',
    help: 'Poder de doçura relativo à sacarose, por kg de mistura.',
  },
  pac: {
    label: 'PAC',
    short: 'PAC',
    help: 'Poder anticongelante por kg. Define a dureza na vitrine.',
  },
};

/**
 * Grupo do seletor: as categorias da planilha mais `custom`, que não é uma
 * categoria de ingrediente e sim o balde dos ingredientes criados pelo usuário.
 */
export type IngredientGroup = IngredientCategory | 'custom';

export const CATEGORY_LABELS: Readonly<Record<IngredientGroup, string>> = {
  base: 'Bases',
  liquido: 'Líquidos',
  laticinio: 'Laticínios e ovos',
  acucar: 'Açúcares e adoçantes',
  fruta: 'Frutas',
  chocolate: 'Chocolate e cacau',
  pasta: 'Pastas e oleaginosas',
  vegetal: 'Vegetais e bases vegetais',
  estabilizante: 'Estabilizantes e fibras',
  aroma: 'Aromas e temperos',
  confeitaria: 'Confeitaria e biscoitos',
  alcool: 'Álcoois e licores',
  custom: 'Meus ingredientes',
};

/** Ordem em que as categorias aparecem no seletor. */
export const CATEGORY_ORDER: readonly IngredientGroup[] = [
  'custom',
  'base',
  'liquido',
  'laticinio',
  'acucar',
  'fruta',
  'chocolate',
  'pasta',
  'vegetal',
  'estabilizante',
  'aroma',
  'confeitaria',
  'alcool',
];
