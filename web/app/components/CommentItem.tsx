"use client";

import React, { useState, useMemo } from "react";
import { EditCommentForm } from "./EditCommentForm";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<boolean>;
  isLoading: boolean;
}

const getRelativeTime = (date: string): string => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffMs = now.getTime() - commentDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "hace unos segundos";
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  
  return commentDate.toLocaleDateString("es-HN");
};

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  createdAt,
  updatedAt,
  onUpdate,
  onDelete,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEdited = new Date(updatedAt).getTime() > new Date(createdAt).getTime() + 1000;
  const relativeTime = useMemo(() => getRelativeTime(createdAt), [createdAt]);
  const editedTime = useMemo(() => {
    if (!isEdited) return null;
    return getRelativeTime(updatedAt);
  }, [updatedAt, isEdited]);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    const success = await onDelete(id);
    if (!success) setIsDeleting(false);
  };

  const handleSave = async (commentId: string, newContent: string) => {
    await onUpdate(commentId, newContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <EditCommentForm
          commentId={id}
          initialContent={content}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-gray-800">{content}</p>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{relativeTime}</span>
            {isEdited && (
              <>
                <span>•</span>
                <span className="italic">Editado {editedTime}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isLoading || isDeleting}
          className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Editar
        </button>
        <span className="text-gray-300">•</span>
        <button
          onClick={handleDelete}
          disabled={isLoading || isDeleting}
          className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};
