import { useState, useCallback } from "react";
import { commentsAPI } from "@/lib/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
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
    status: string;
  };
}

interface CommentsResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchCommentsByCategory = useCallback(
    async (categoryId: string, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);

      try {
        const response = await commentsAPI.getByCategory(categoryId, page, limit);

        if (response.data.success) {
          const data: CommentsResponse = response.data.data;
          setComments(data.comments);
          setPagination(data.pagination);
          return data;
        } else {
          setError("Error al obtener comentarios");
          return null;
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

  const fetchCommentsByMatch = useCallback(
    async (matchId: string, page = 1, limit = 20) => {
      setLoading(true);
      setError(null);

      try {
        const response = await commentsAPI.getByMatch(matchId, page, limit);

        if (response.data.success) {
          const data: CommentsResponse = response.data.data;
          setComments(data.comments);
          setPagination(data.pagination);
          return data;
        } else {
          setError("Error al obtener comentarios");
          return null;
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

  const createComment = useCallback(
    async (categoryId: string, content: string, matchId?: string) => {
      setLoading(true);
      setError(null);

      try {
        if (!content.trim()) {
          setError("El comentario no puede estar vacío");
          setLoading(false);
          return null;
        }

        if (content.trim().length < 3) {
          setError("El comentario debe tener al menos 3 caracteres");
          setLoading(false);
          return null;
        }

        if (content.length > 500) {
          setError("El comentario es demasiado largo (máximo 500 caracteres)");
          setLoading(false);
          return null;
        }

        const response = await commentsAPI.create(categoryId, content, matchId);

        if (response.data.success) {
          const newComment: Comment = response.data.data;
          // Agregar nuevo comentario al inicio de la lista
          setComments([newComment, ...comments]);
          return newComment;
        } else {
          setError(response.data.error || "Error al crear comentario");
          return null;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error al crear comentario";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [comments]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const response = await commentsAPI.delete(commentId);

        if (response.data.success) {
          setComments(comments.filter((c) => c.id !== commentId));
          return true;
        } else {
          setError("Error al eliminar comentario");
          return false;
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error al eliminar comentario";
        setError(errorMessage);
        return false;
      }
    },
    [comments]
  );

  return {
    comments,
    loading,
    error,
    pagination,
    fetchCommentsByCategory,
    fetchCommentsByMatch,
    createComment,
    deleteComment,
  };
};
