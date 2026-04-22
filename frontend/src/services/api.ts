/**
 * Servicio de API - Cliente HTTP reutilizable
 */

import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios específicos
export const categoriesService = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
};

export const teamsService = {
  getByCategory: async (categoryId: string) => {
    const response = await apiClient.get(`/teams?categoryId=${categoryId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  },
};

export const matchesService = {
  getByTeam: async (teamId: string) => {
    const response = await apiClient.get(`/matches?teamId=${teamId}`);
    return response.data;
  },
  getByCategory: async (categoryId: string) => {
    const response = await apiClient.get(`/matches?categoryId=${categoryId}`);
    return response.data;
  },
  getUpcoming: async () => {
    const response = await apiClient.get('/matches?upcoming=true');
    return response.data;
  },
};

export const usersService = {
  addFavorite: async (teamId: string, userId: string) => {
    const response = await apiClient.post('/users/favorites',
      { teamId },
      { headers: { 'X-User-ID': userId } }
    );
    return response.data;
  },
  removeFavorite: async (teamId: string, userId: string) => {
    const response = await apiClient.delete(`/users/favorites/${teamId}`, {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  },
  getFavorites: async (userId: string) => {
    const response = await apiClient.get('/users/favorites', {
      headers: { 'X-User-ID': userId }
    });
    return response.data;
  },
};

export default apiClient;
