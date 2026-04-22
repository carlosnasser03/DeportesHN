import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Categories
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id: string) => api.get(`/categories/${id}`),
};

// Teams
export const teamsAPI = {
  getAll: () => api.get("/teams"),
  getByCategory: (categoryId: string) =>
    api.get(`/teams?categoryId=${categoryId}`),
  getById: (id: string) => api.get(`/teams/${id}`),
};

// Matches
export const matchesAPI = {
  getAll: () => api.get("/matches"),
  getById: (id: string) => api.get(`/matches/${id}`),
  getByTeam: (teamId: string) => api.get(`/matches?teamId=${teamId}`),
  getByCategory: (categoryId: string) =>
    api.get(`/matches?categoryId=${categoryId}`),
  finishMatch: (matchId: string, homeScore: number, awayScore: number) =>
    api.post(`/matches/${matchId}/finish`, { homeScore, awayScore }),
  updatePlayerStats: (
    matchId: string,
    playerId: string,
    stats: {
      goalsScored?: number;
      assists?: number;
      yellowCards?: number;
      redCards?: number;
    }
  ) =>
    api.post(`/matches/${matchId}/stats`, {
      playerId,
      ...stats,
    }),
};

// Standings
export const standingsAPI = {
  getTable: (categoryId: string) => api.get(`/standings/${categoryId}`),
  getScorers: (categoryId: string) =>
    api.get(`/standings/${categoryId}/scorers`),
};

export default api;
