"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { commentsAPI } from "@/lib/api";
import { categoriesAPI } from "@/lib/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  match?: {
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

interface Category {
  id: string;
  label: string;
  color: string;
}

export function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesRes = await categoriesAPI.getAll();
        if (categoriesRes.data.success) {
          const categoriesMap: Record<string, Category> = {};
          categoriesRes.data.data.forEach((cat: Category) => {
            categoriesMap[cat.id] = cat;
          });
          setCategories(categoriesMap);

          // Obtener comentarios de la primera categoría
          if (categoriesRes.data.data.length > 0) {
            const firstCat = categoriesRes.data.data[0];
            const commentsRes = await commentsAPI.getByCategory(
              firstCat.id,
              1,
              5
            );
            if (commentsRes.data.success) {
              setComments(commentsRes.data.data.comments);
            }
          }
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">💬 Comentarios</h3>
        <p className="text-sm text-gray-600 mt-1">
          Lo que dicen los aficionados
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No hay comentarios aún
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-700 line-clamp-2">
                {comment.content}
              </p>

              {comment.match && (
                <p className="text-xs text-gray-500 mt-2">
                  {comment.match.homeTeam.organization.name} vs{" "}
                  {comment.match.awayTeam.organization.name}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          href={Object.keys(categories).length > 0 ? `/comments/${Object.keys(categories)[0]}` : "#"}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos los comentarios →
        </Link>
      </div>
    </div>
  );
}
