/**
 * App Store - Estado global con Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  userId: string;
  favoriteTeams: string[];
  notifications: boolean;
  theme: 'light' | 'dark';
  language: 'es' | 'en';

  // Actions
  setUserId: (id: string) => void;
  addFavorite: (teamId: string) => void;
  removeFavorite: (teamId: string) => void;
  setNotifications: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'es' | 'en') => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  userId: 'anonymous',
  favoriteTeams: [],
  notifications: true,
  theme: 'light',
  language: 'es',

  setUserId: (id: string) => {
    set({ userId: id });
    get().saveToStorage();
  },

  addFavorite: (teamId: string) => {
    set((state) => ({
      favoriteTeams: [...state.favoriteTeams, teamId],
    }));
    get().saveToStorage();
  },

  removeFavorite: (teamId: string) => {
    set((state) => ({
      favoriteTeams: state.favoriteTeams.filter(id => id !== teamId),
    }));
    get().saveToStorage();
  },

  setNotifications: (enabled: boolean) => {
    set({ notifications: enabled });
    get().saveToStorage();
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    get().saveToStorage();
  },

  setLanguage: (lang: 'es' | 'en') => {
    set({ language: lang });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('app_state');
      if (data) {
        const state = JSON.parse(data);
        set(state);
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('app_state', JSON.stringify({
        userId: state.userId,
        favoriteTeams: state.favoriteTeams,
        notifications: state.notifications,
        theme: state.theme,
        language: state.language,
      }));
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },
}));
