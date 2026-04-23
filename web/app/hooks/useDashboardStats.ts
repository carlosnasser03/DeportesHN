"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export interface CommentStats {
  totalComments: number;
  approvedComments: number;
  rejectedComments: number;
  statsByCategory: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/comments/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const statsData: CommentStats = response.data.data;
        setStats(statsData);
        return statsData;
      } else {
        throw new Error("Error al obtener estadísticas");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Error al obtener estadísticas";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};
