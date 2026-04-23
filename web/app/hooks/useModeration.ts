"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

interface PendingComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    label: string;
  };
  match?: {
    id: string;
    homeTeam: {
      organization: {
        name: string;
      };
    };
    awayTeam: {
      organization: {
        name: string;
      };
    };
    date: string;
  };
}

interface ModerationResponse {
  comments: PendingComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useModeration = () => {
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchPendingComments = useCallback(
    async (token: string, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/comments/moderation/pending?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const data: ModerationResponse = response.data.data;
          setComments(data.comments);
          setPagination(data.pagination);
          return data;
        } else {
          throw new Error("Error al obtener comentarios pendientes");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error al obtener comentarios";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveComment = useCallback(
    async (token: string, commentId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.put(
          `/comments/${commentId}/approval`,
          { isApproved: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setComments(comments.filter((c) => c.id !== commentId));
          return true;
        } else {
          setError("Error al aprobar comentario");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error al aprobar comentario";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [comments]
  );

  const rejectComment = useCallback(
    async (token: string, commentId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.put(
          `/comments/${commentId}/approval`,
          { isApproved: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setComments(comments.filter((c) => c.id !== commentId));
          return true;
        } else {
          setError("Error al rechazar comentario");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error al rechazar comentario";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [comments]
  );

  return {
    comments,
    loading,
    error,
    pagination,
    fetchPendingComments,
    approveComment,
    rejectComment,
  };
};
