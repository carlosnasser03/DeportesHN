"use client";

import { useAnalytics } from "@/app/hooks/useAnalytics";
import { UI_CONFIG } from "@/lib/config";

interface Match {
  id: string;
  homeTeam: {
    id: string;
    organization: { name: string; logo?: string };
  };
  awayTeam: {
    id: string;
    organization: { name: string; logo?: string };
  };
  homeScore?: number;
  awayScore?: number;
  status: string;
  date: string;
  category: { id: string; label: string };
}

interface HeroProps {
  match: Match | null;
  isLoading?: boolean;
}

export function Hero({ match, isLoading = false }: HeroProps) {
  const { trackClick, trackMatchView } = useAnalytics();

  const handleMatchClick = () => {
    if (match) {
      trackClick("hero-match", "home");
      trackMatchView(match.id, match.category.id || "");
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"
        style={{ backgroundColor: `${UI_CONFIG.COLORS.primary}20` }}
      />
    );
  }

  if (!match) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No hay partidos destacados</p>
      </div>
    );
  }

  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  return (
    <div
      onClick={handleMatchClick}
      className="w-full rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      style={{ backgroundColor: UI_CONFIG.COLORS.primary }}
    >
      <div className="p-8 md:p-12 text-white">
        {/* Badge de estado */}
        <div className="mb-4 inline-block">
          <span
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: isLive
                ? UI_CONFIG.COLORS.danger
                : isFinished
                ? UI_CONFIG.COLORS.neutral
                : UI_CONFIG.COLORS.warning,
            }}
          >
            {isLive ? "EN VIVO" : isFinished ? "FINALIZADO" : "PRÓXIMO"}
          </span>
        </div>

        {/* Categoría */}
        <p className="text-blue-100 text-sm mb-4">{match.category.label}</p>

        {/* Partido */}
        <div className="flex items-center justify-between gap-6">
          {/* Equipo local */}
          <div className="flex-1">
            <p className="text-sm text-blue-100 mb-2">LOCAL</p>
            <h3 className="text-2xl md:text-4xl font-bold">
              {match.homeTeam.organization.name}
            </h3>
          </div>

          {/* Marcador */}
          <div className="text-center">
            {isFinished || isLive ? (
              <div className="flex gap-3 items-center">
                <span className="text-5xl md:text-6xl font-bold">
                  {match.homeScore ?? 0}
                </span>
                <span className="text-2xl">-</span>
                <span className="text-5xl md:text-6xl font-bold">
                  {match.awayScore ?? 0}
                </span>
              </div>
            ) : (
              <p className="text-sm text-blue-100">
                {new Date(match.date).toLocaleDateString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* Equipo visitante */}
          <div className="flex-1 text-right">
            <p className="text-sm text-blue-100 mb-2">VISITANTE</p>
            <h3 className="text-2xl md:text-4xl font-bold">
              {match.awayTeam.organization.name}
            </h3>
          </div>
        </div>

        {/* Footer del hero */}
        <div className="mt-8 pt-6 border-t border-blue-400 flex justify-between items-center">
          <p className="text-blue-100 text-sm">
            {isFinished && "Resultado final"}
            {isLive && "Tiempo: En directo"}
            {!isFinished && !isLive && "Próximo partido"}
          </p>
          <button
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            onClick={handleMatchClick}
          >
            Ver detalles →
          </button>
        </div>
      </div>
    </div>
  );
}
