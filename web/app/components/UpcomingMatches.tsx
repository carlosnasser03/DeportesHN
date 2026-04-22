"use client";

import { useEffect, useState } from "react";
import { matchesAPI } from "@/lib/api";
import { CONTENT_CONFIG } from "@/lib/config";

interface Match {
  id: string;
  homeTeam: { organization: { name: string } };
  awayTeam: { organization: { name: string } };
  date: string;
  category: { label: string };
}

export function UpcomingMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const response = await matchesAPI.getAll();
      if (response.data.success) {
        const upcoming = response.data.data.filter((m: Match) => m.date > new Date().toISOString());
        setMatches(upcoming.slice(0, CONTENT_CONFIG.UPCOMING_MATCHES.ITEMS_TO_SHOW));
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-32 bg-gray-200 animate-pulse rounded" />;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4">Próximos Partidos</h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="flex gap-3 p-3 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">{match.category.label}</p>
              <p className="text-sm font-semibold text-gray-900">
                {match.homeTeam.organization.name} vs {match.awayTeam.organization.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                🕐 {new Date(match.date).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
