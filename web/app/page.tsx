"use client";

import { useState, useEffect } from "react";
import { CategoriesGrid } from "./components/CategoriesGrid";
import { Hero } from "./components/Hero";
import { NewsGrid } from "./components/NewsGrid";
import { StandingsWidget } from "./components/StandingsWidget";
import { UpcomingMatches } from "./components/UpcomingMatches";
import { RecentComments } from "./components/RecentComments";
import { matchesAPI, categoriesAPI } from "@/lib/api";
import { useAnalytics } from "./hooks/useAnalytics";

interface Match {
  id: string;
  homeTeam: { organization: { name: string; logo?: string }; id: string };
  awayTeam: { organization: { name: string; logo?: string }; id: string };
  homeScore?: number;
  awayScore?: number;
  status: string;
  date: string;
  location: string;
  category: { label: string; id: string };
}

export default function Home() {
  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { trackPageView, trackCategoryView } = useAnalytics();

  useEffect(() => {
    trackPageView("home");
    fetchFeaturedMatch();
    fetchDefaultCategory();
  }, []);

  const fetchFeaturedMatch = async () => {
    try {
      const response = await matchesAPI.getAll();
      if (response.data.success && response.data.data.length > 0) {
        setFeaturedMatch(response.data.data[0]);
      }
    } catch (err) {
      console.error("Error fetching featured match:", err);
    }
  };

  const fetchDefaultCategory = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data.success && response.data.data.length > 0) {
        const firstCategory = response.data.data[0];
        setSelectedCategory(firstCategory.id);
        trackCategoryView(firstCategory.id, firstCategory.label);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">DeportesHN ⚽</h1>
          <p className="text-blue-100 mt-1">Gestión de torneos de fútbol infantil</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <section className="mb-12">
          <Hero match={featuredMatch} />
        </section>

        {/* Grid principal: NewsGrid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: NewsGrid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimos Resultados</h2>
            <NewsGrid />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Próximos partidos */}
            <UpcomingMatches />

            {/* Tabla de posiciones */}
            {selectedCategory && <StandingsWidget categoryId={selectedCategory} />}

            {/* Comentarios recientes */}
            <RecentComments />
          </div>
        </div>

        {/* Categorías */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 px-4 mb-6">Categorías</h2>
          <CategoriesGrid />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 DeportesHN. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
