import type { BookId } from './books';
import { isPublished, type RouteKey } from '@/i18n/routes';

export type CalculatorId =
  | 'bread'
  | 'pickles'
  | 'pasta'
  | 'gelato'
  | 'curing'
  | 'jam'
  | 'brine'
  | 'ganache';

/** Cor da aba de cada calculadora, no espírito das abas de um fichário. */
export type CalculatorAccent =
  | 'wheat'
  | 'sage'
  | 'terracotta'
  | 'rose'
  | 'ember'
  | 'damson'
  | 'tide'
  | 'cocoa';

export interface Calculator {
  id: CalculatorId;
  route: RouteKey;
  accent: CalculatorAccent;
  /** Obras que sustentam os números desta calculadora. */
  sources: readonly BookId[];
}

/**
 * Catálogo exibido na home (FR-001). A ordem aqui é a ordem editorial do site,
 * que segue os marcos de entrega do PRD: pães, picles, massas e — na fase 2 —
 * a migração do gelato.
 *
 * Nomes e descrições ficam nos dicionários de idioma; aqui só a estrutura.
 */
export const CALCULATORS: readonly Calculator[] = [
  {
    id: 'bread',
    route: 'bread',
    accent: 'wheat',
    sources: ['kayser', 'camargo', 'ruhlman'],
  },
  {
    id: 'pickles',
    route: 'pickles',
    accent: 'sage',
    sources: ['katz', 'noma', 'bwf'],
  },
  {
    id: 'pasta',
    route: 'pasta',
    accent: 'terracotta',
    sources: ['zielonka', 'hazan', 'ruhlman'],
  },
  {
    id: 'gelato',
    route: 'gelato',
    accent: 'rose',
    sources: [],
  },
  {
    id: 'curing',
    route: 'curing',
    accent: 'ember',
    sources: ['anvisa-rdc272', 'fsis-424', 'marianski', 'ruhlman-charcuterie'],
  },
  {
    id: 'jam',
    route: 'jam',
    accent: 'damson',
    sources: ['saunders', 'ferber', 'nchfp', 'mcgee-keys'],
  },
  {
    id: 'brine',
    route: 'brine',
    accent: 'tide',
    sources: ['modernist-home', 'foodlab', 'ruhlman-charcuterie'],
  },
  {
    id: 'ganache',
    route: 'ganache',
    accent: 'cocoa',
    sources: ['wybauw'],
  },
];

/**
 * Uma calculadora está disponível quando sua página existe de fato. Derivar do
 * registro de rotas evita a home anunciar um link que ainda dá 404 — publicar
 * a calculadora é acrescentar a rota em PUBLISHED_ROUTES.
 */
export function isAvailable(calculator: Calculator): boolean {
  return isPublished(calculator.route);
}
