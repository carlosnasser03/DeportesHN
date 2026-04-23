import React from "react";

interface DashboardHeaderProps {
  lastUpdated?: Date;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
}) => {
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleString("es-HN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Actualizando...";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Análisis
          </h1>
          <p className="text-gray-600 mt-2">
            Métricas y estadísticas de comentarios
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Última actualización: {formattedTime}
      </div>
    </div>
  );
};
