/**
 * Tipos globales TypeScript
 */

import type { CategoryKey } from '@/constants/categories';

export interface Team {
  id: string;
  name: string;
  category: CategoryKey;
  town: string;
  coach?: string;
  logo?: string;
  createdAt: string;
}

export interface Match {
  id: string;
  teamId: string;
  opponentId: string;
  category: CategoryKey;
  date: string;
  time: string;
  location: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  createdAt: string;
}

export interface User {
  id: string;
  favoriteTeams: string[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: 'es' | 'en';
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
