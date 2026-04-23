"use client";

import React from "react";

interface PendingComment {
  id: string;
  content: string;
  createdAt: string;
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
  };
}

interface ModerationPanelProps {
  comments: PendingComment[];
  loading: boolean;
  onApprove: (commentId: string) => Promise<void>;
  onReject: (commentId: string) => Promise<void>;
}

const getRelativeTime = (date: string): string => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffMins = Math.floor(
    (now.getTime() - commentDate.getTime()) / 60000
  );

  if (diffMins < 1) return "hace unos segundos";
  if (diffMins < 60) return `hace ${diffMins}m`;
  return `hace ${Math.floor(diffMins / 60)}h`;
};

export const ModerationPanel: React.FC<ModerationPanelProps> = ({
  comments,
  loading,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Cola de Moderación
        </h3>
        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
          {comments.length}
        </span>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">✅ No hay comentarios pendientes</p>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-amber-200 bg-amber-50 rounded-lg p-4"
            >
              <div className="mb-3">
                <p className="text-sm font-medium text-amber-900">
                  {comment.category.label}
                  {comment.match && (
                    <>
                      {" • "}
                      <span className="text-xs">
                        {comment.match.homeTeam.organization.name} vs{" "}
                        {comment.match.awayTeam.organization.name}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <p className="text-gray-800 mb-3">{comment.content}</p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {getRelativeTime(comment.createdAt)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(comment.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    onClick={() => onReject(comment.id)}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ✕ Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
