"use client";

import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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

interface CommentsListProps {
  comments: Comment[];
  loading: boolean;
  onUpdateComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<boolean>;
}

export function CommentsList({
  comments,
  loading,
  onUpdateComment,
  onDeleteComment,
}: CommentsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gray-100 rounded-lg animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aún no hay comentarios. ¡Sé el primero en comentar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Partido (si existe) */}
          {comment.match && (
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">
                  {comment.match.homeTeam.organization.name}
                </span>
                {" vs "}
                <span className="font-semibold">
                  {comment.match.awayTeam.organization.name}
                </span>
                {" • "}
                <span>{new Date(comment.match.date).toLocaleDateString("es-HN")}</span>
              </p>
            </div>
          )}

          {/* Comentario */}
          <div className="p-4">
            <CommentItem
              id={comment.id}
              content={comment.content}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              onUpdate={
                onUpdateComment ||
                (async () => {
                  console.log("Update handler not provided");
                })
              }
              onDelete={
                onDeleteComment ||
                (async () => {
                  console.log("Delete handler not provided");
                  return false;
                })
              }
              isLoading={loading}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
