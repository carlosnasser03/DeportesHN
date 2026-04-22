"use client";

import { useEffect, useState } from "react";
import { matchesAPI } from "@/lib/api";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { UI_CONFIG, CONTENT_CONFIG } from "@/lib/config";

interface Match {
  id: string;
  homeTeam: {
    organization: { name: string; logo?: string };
  };
  awayTeam: {
    organization: { name: string; logo?: string };
  };
  homeScore?: number;
  awayScore?: number;
  status: string;
  date: string;
  location: string;
  category: { label: string };
}

export function NewsGrid() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { trackClick, trackMatchView } = useAnalytics();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesAPI.getAll();
      if (response.data.success) {
        setMatches(response.data.data.slice(0, CONTENT_CONFIG.NEWS_GRID.ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("No se pudieron cargar los partidos");
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (match: Match) => {
    trackClick("news-grid-match", "home");
    trackMatchView(match.id, match.category.id || "");
  };

  if (loading) {
    return (
      <div
        className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${CONTENT_CONFIG.NEWS_GRID.COLS_DESKTOP}`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
        <button
          onClick={fetchMatches}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return <div className="text-center text-gray-500 py-8">No hay partidos</div>;
  }

  return (
    <div
      className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${CONTENT_CONFIG.NEWS_GRID.COLS_DESKTOP}`}
    >
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => handleMatchClick(match)}
          className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        >
          {/* Header con categoría */}
          <div
            className="px-4 py-2 text-white text-sm font-semibold"
            style={{ backgroundColor: UI_CONFIG.COLORS.primary }}
          >
            {match.category.label}
          </div>

          {/* Contenido */}
          <div className="p-4">
            {/* Equipos y marcador */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-gray-900 flex-1 truncate">
                  {match.homeTeam.organization.name}
                </span>
                <span className="text-xl font-bold text-blue-600 mx-2">
                  {match.homeScore ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900 flex-1 truncate">
                  {match.awayTeam.organization.name}
                </span>
                <span className="text-xl font-bold text-blue-600 mx-2">
                  {match.awayScore ?? "-"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-3" />

            {/* Información */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>📍 {match.location}</p>
              <p>🕐 {new Date(match.date).toLocaleDateString("es-ES")}</p>
              <p className="mt-2">
                <span
                  className="inline-block px-2 py-1 rounded text-white text-xs font-semibold"
                  style={{
                    backgroundColor:
                      match.status === "finished"
                        ? UI_CONFIG.COLORS.neutral
                        : match.status === "live"
                        ? UI_CONFIG.COLORS.danger
                        : UI_CONFIG.COLORS.warning,
                  }}
                >
                  {match.status === "finished"
                    ? "FINALIZADO"
                    : match.status === "live"
                    ? "EN VIVO"
                    : "PROGRAMADO"}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
