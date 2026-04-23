"use client";

import React, { useState } from "react";

interface EditCommentFormProps {
  commentId: string;
  initialContent: string;
  onSave: (commentId: string, content: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const EditCommentForm: React.FC<EditCommentFormProps> = ({
  commentId,
  initialContent,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    if (content.length < 3) {
      setError("Mínimo 3 caracteres");
      return;
    }

    if (content.length > 500) {
      setError("Máximo 500 caracteres");
      return;
    }

    try {
      await onSave(commentId, content);
    } catch (err) {
      setError("Error al guardar el comentario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Edita tu comentario..."
        disabled={isLoading}
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {content.length}/500 caracteres
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
};
