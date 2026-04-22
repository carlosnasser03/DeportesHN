"use client";

// Helper para tiempo relativo
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "hace unos segundos";
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
  if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} días`;

  return date.toLocaleDateString("es-ES");
};

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

interface CommentsListProps {
  comments: Comment[];
  loading: boolean;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export function CommentsList({
  comments,
  loading,
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
        <div
          key={comment.id}
          className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          {/* Partido (si existe) */}
          {comment.match && (
            <div className="mb-2 pb-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold">
                  {comment.match.homeTeam.organization.name}
                </span>
                {" vs "}
                <span className="font-semibold">
                  {comment.match.awayTeam.organization.name}
                </span>
                {" • "}
                <span>{new Date(comment.match.date).toLocaleDateString("es-ES")}</span>
              </p>
            </div>
          )}

          {/* Contenido */}
          <p className="text-gray-800 leading-relaxed">{comment.content}</p>

          {/* Footer */}
          <div className="mt-3 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              {timeAgo(comment.createdAt)}
            </p>

            {onDeleteComment && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
