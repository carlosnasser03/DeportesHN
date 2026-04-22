"use client";

import { useEffect, useState } from "react";
import { standingsAPI } from "@/lib/api";
import { UI_CONFIG, CONTENT_CONFIG } from "@/lib/config";

interface StandingsEntry {
  position: number;
  teamId: string;
  teamName: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface StandingsWidgetProps {
  categoryId?: string;
}

export function StandingsWidget({ categoryId }: StandingsWidgetProps) {
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    fetchStandings();
  }, [categoryId]);

  const fetchStandings = async () => {
    if (!categoryId) return;
    try {
      const response = await standingsAPI.getTable(categoryId);
      if (response.data.success) {
        setStandings(response.data.data.slice(0, CONTENT_CONFIG.STANDINGS.ITEMS_TO_SHOW));
      }
    } catch (err) {
      console.error("Error fetching standings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-gray-200 animate-pulse rounded-lg h-96" />;
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4" style={{ backgroundColor: UI_CONFIG.COLORS.primary }}>
        <h3 className="text-white font-bold text-lg">Tabla de Posiciones</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">#</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Equipo</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700">Pts</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700">PJ</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700">GF</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700">GC</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, idx) => (
              <tr key={entry.teamId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-gray-700">{entry.position}</td>
                <td className="px-3 py-2 text-gray-900 font-semibold">{entry.teamName}</td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: UI_CONFIG.COLORS.primary }}>
                  {entry.points}
                </td>
                <td className="px-3 py-2 text-center text-gray-600">{entry.played}</td>
                <td className="px-3 py-2 text-center text-green-600 font-semibold">{entry.goalsFor}</td>
                <td className="px-3 py-2 text-center text-red-600 font-semibold">{entry.goalsAgainst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
