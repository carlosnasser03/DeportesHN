"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoriesAPI } from "@/lib/api";
import { useComments } from "@/app/hooks/useComments";
import { CommentForm } from "@/app/components/CommentForm";
import { CommentsList } from "@/app/components/CommentsList";

interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
}

export default function CommentsPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const {
    comments,
    loading: commentsLoading,
    error,
    pagination,
    fetchCommentsByCategory,
    createComment,
    updateComment,
    deleteComment,
  } = useComments();

  // Cargar categoría
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoriesAPI.getById(categoryId);
        if (response.data.success) {
          setCategory(response.data.data);
        }
      } catch (err) {
        console.error("Error al cargar categoría:", err);
      } finally {
        setCategoryLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // Cargar comentarios
  useEffect(() => {
    if (categoryId) {
      fetchCommentsByCategory(categoryId);
    }
  }, [categoryId, fetchCommentsByCategory]);

  const handleCreateComment = async (data: {
    categoryId: string;
    content: string;
    matchId?: string;
  }) => {
    const comment = await createComment(
      data.categoryId,
      data.content,
      data.matchId
    );

    if (comment) {
      // Comentario creado exitosamente, el hook ya actualiza la lista
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    const result = await updateComment(commentId, content);
    return result !== null;
  };

  const handleDeleteComment = async (commentId: string): Promise<boolean> => {
    if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      const result = await deleteComment(commentId);
      return result;
    }
    return false;
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchCommentsByCategory(
        categoryId,
        pagination.page + 1,
        pagination.limit
      );
    }
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Categoría no encontrada</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
          <p className="text-blue-100 mt-1">Gestión de torneos de fútbol infantil</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </a>
          {" / "}
          <span className="text-gray-900 font-medium">{category.label}</span>
        </nav>

        {/* Título */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Comentarios - {category.label}
            </h1>
          </div>
          <p className="text-gray-600">
            Comparte tus opiniones sobre los partidos de {category.label}.
            Cuéntanos sobre el clima, el arbitraje, los resultados o tu
            experiencia.
          </p>
        </div>

        {/* Formulario de comentarios */}
        <CommentForm
          categoryId={categoryId}
          onCommentCreated={handleCreateComment}
          isLoading={commentsLoading}
          error={error}
        />

        {/* Estadísticas */}
        <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Total de comentarios:{" "}
            <span className="font-semibold text-gray-900">
              {pagination.total}
            </span>
          </p>
        </div>

        {/* Lista de comentarios */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comentarios Recientes
          </h2>
          <CommentsList
            comments={comments}
            loading={commentsLoading}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>

        {/* Botón cargar más */}
        {pagination.page < pagination.pages && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={commentsLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {commentsLoading ? "Cargando..." : "Cargar más comentarios"}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 DeportesHN. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
