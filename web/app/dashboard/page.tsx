"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatsCard } from "../components/dashboard/StatsCard";
import { CategoryChart } from "../components/dashboard/CategoryChart";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";

export default function DashboardPage() {
  const { getValidToken, loading: authLoading, error: authError } = useAuth();
  const { stats, loading: statsLoading, error: statsError, fetchStats } =
    useDashboardStats();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const token = await getValidToken();

      if (token) {
        setAuthorized(true);
        await fetchStats(token);
        setLastUpdated(new Date());
      } else {
        setAuthorized(false);
      }
    };

    loadStats();
  }, [getValidToken, fetchStats]);

  // Pantalla de carga
  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error de autenticación
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
            <p className="text-blue-100 mt-1">Dashboard de Análisis</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold text-red-800 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-red-700">
              {authError || "No autorizado para acceder a este recurso"}
            </p>
            <p className="text-sm text-red-600 mt-4">
              Asegúrate de tener configurada la admin_key correctamente en las
              variables de entorno.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Pantalla de error en estadísticas
  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
            <p className="text-blue-100 mt-1">Dashboard de Análisis</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold text-red-800 mb-2">
              Error al Cargar
            </h2>
            <p className="text-red-700">{statsError}</p>
          </div>
        </main>
      </div>
    );
  }

  // Pantalla principal del dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
              <p className="text-blue-100 mt-1">Dashboard de Análisis</p>
            </div>
            <a
              href="/"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Header del Dashboard */}
        <DashboardHeader lastUpdated={lastUpdated || undefined} />

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              title="Total de Comentarios"
              value={stats.totalComments}
              description="Comentarios publicados"
              icon="💬"
              color="blue"
            />
            <StatsCard
              title="Comentarios Aprobados"
              value={stats.approvedComments}
              description="Pasaron validaciones"
              icon="✅"
              color="green"
            />
            <StatsCard
              title="Comentarios Rechazados"
              value={stats.rejectedComments}
              description="Por filtro de contenido"
              icon="❌"
              color="red"
            />
          </div>
        )}

        {/* Chart por categoría */}
        {stats && stats.statsByCategory.length > 0 && (
          <div className="mb-12">
            <CategoryChart data={stats.statsByCategory} />
          </div>
        )}

        {/* Summary */}
        {stats && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Tasa de Aprobación
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalComments > 0
                      ? (
                          (stats.approvedComments / stats.totalComments) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    ({stats.approvedComments}/{stats.totalComments})
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Tasa de Rechazo
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-red-600">
                    {stats.totalComments > 0
                      ? (
                          (stats.rejectedComments / stats.totalComments) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    ({stats.rejectedComments}/{stats.totalComments})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 DeportesHN Dashboard. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
