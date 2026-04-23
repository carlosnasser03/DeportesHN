"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useModeration } from "../hooks/useModeration";
import { StatsCard } from "../components/dashboard/StatsCard";
import { CategoryChart } from "../components/dashboard/CategoryChart";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { ModerationPanel } from "../components/dashboard/ModerationPanel";

export default function DashboardPage() {
  const { getValidToken, loading: authLoading, error: authError } = useAuth();
  const { stats, loading: statsLoading, error: statsError, fetchStats } =
    useDashboardStats();
  const { comments: pendingComments, loading: modLoading, fetchPendingComments, approveComment, rejectComment } =
    useModeration();
  const [lastUpdated, setLastUpdated] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const tok = await getValidToken();
      if (tok) {
        setAuthorized(true);
        setToken(tok);
        await fetchStats(tok);
        await fetchPendingComments(tok);
        setLastUpdated(new Date());
      } else {
        setAuthorized(false);
      }
    };
    loadStats();
  }, [getValidToken, fetchStats, fetchPendingComments]);

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-700">{authError}</p>
          </div>
        </main>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">DeportesHN</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{statsError}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">DeportesHN</h1>
              <p className="text-blue-100 mt-1">Dashboard de Análisis</p>
            </div>
            <a href="/" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg">
              Volver
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <DashboardHeader lastUpdated={lastUpdated} />

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard title="Total" value={stats.totalComments} description="comentarios" icon="💬" color="blue" />
            <StatsCard title="Aprobados" value={stats.approvedComments} description="publicados" icon="✅" color="green" />
            <StatsCard title="Rechazados" value={stats.rejectedComments} description="filtrados" icon="❌" color="red" />
          </div>
        )}

        {stats && stats.statsByCategory.length > 0 && (
          <div className="mb-12">
            <CategoryChart data={stats.statsByCategory} />
          </div>
        )}

        <div className="mb-12">
          <ModerationPanel
            comments={pendingComments}
            loading={modLoading}
            onApprove={async (id) => {
              if (token) await approveComment(token, id);
            }}
            onReject={async (id) => {
              if (token) await rejectComment(token, id);
            }}
          />
        </div>

        {stats && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Aprobación</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalComments > 0 ? ((stats.approvedComments / stats.totalComments) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rechazo</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.totalComments > 0 ? ((stats.rejectedComments / stats.totalComments) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{pendingComments.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 DeportesHN Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
