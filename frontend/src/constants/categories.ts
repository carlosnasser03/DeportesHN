/**
 * Categorías de fútbol infantil
 * Variables independientes para máxima escalabilidad
 */

export const FOOTBALL_CATEGORIES = {
  U7: {
    id: 'u7',
    name: 'U7',
    label: 'Sub-7',
    maxTeams: 30,
    color: '#FF6B6B',
    ageRange: '5-7 años',
  },
  U9: {
    id: 'u9',
    name: 'U9',
    label: 'Sub-9',
    maxTeams: 30,
    color: '#4ECDC4',
    ageRange: '7-9 años',
  },
  U11: {
    id: 'u11',
    name: 'U11',
    label: 'Sub-11',
    maxTeams: 30,
    color: '#45B7D1',
    ageRange: '9-11 años',
  },
  U13: {
    id: 'u13',
    name: 'U13',
    label: 'Sub-13',
    maxTeams: 30,
    color: '#96CEB4',
    ageRange: '11-13 años',
  },
  U15: {
    id: 'u15',
    name: 'U15',
    label: 'Sub-15',
    maxTeams: 30,
    color: '#FFEAA7',
    ageRange: '13-15 años',
  },
  U17: {
    id: 'u17',
    name: 'U17',
    label: 'Sub-17',
    maxTeams: 30,
    color: '#DFE6E9',
    ageRange: '15-17 años',
  },
} as const;

export const CATEGORIES_ARRAY = Object.values(FOOTBALL_CATEGORIES);

export type CategoryKey = keyof typeof FOOTBALL_CATEGORIES;
export type Category = (typeof FOOTBALL_CATEGORIES)[CategoryKey];
