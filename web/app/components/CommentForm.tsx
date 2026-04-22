"use client";

import { useState } from "react";

interface CommentFormProps {
  categoryId: string;
  matchId?: string;
  onCommentCreated: (comment: any) => void;
  isLoading: boolean;
  error: string | null;
}

export function CommentForm({
  categoryId,
  matchId,
  onCommentCreated,
  isLoading,
  error,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    onCommentCreated({
      categoryId,
      content,
      matchId,
    });

    // Limpiar formulario
    setContent("");
    setCharCount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comparte tu opinión
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={handleChange}
          placeholder="¿Qué te pareció del partido? Cuéntanos sobre el clima, el arbitraje, los resultados o tu experiencia..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          disabled={isLoading}
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {charCount} / {maxChars} caracteres
          </span>
          {charCount > maxChars * 0.8 && (
            <span className="text-xs text-amber-600">
              Acercándose al límite
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setContent("");
            setCharCount(0);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!content.trim() || charCount < 3 || isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Enviando..." : "Enviar comentario"}
        </button>
      </div>
    </form>
  );
}
