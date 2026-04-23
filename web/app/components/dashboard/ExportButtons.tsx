"use client";

import React from "react";
import { useReportExport } from "@/app/hooks/useReportExport";

interface ExportButtonsProps {
  stats: any;
  pending: any[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ stats, pending }) => {
  const { exportToPDF, exportToCSV, loading } = useReportExport();

  const handleExportStats = async (format: string) => {
    const data = {
      title: "Reporte de Estadísticas - DeportesHN",
      date: new Date().toLocaleDateString("es-HN"),
      ...stats,
    };
    if (format === "pdf") {
      await exportToPDF(data, "reporte-estadisticas");
    } else {
      await exportToCSV([data], "reporte-estadisticas");
    }
  };

  const handleExportPending = async (format: string) => {
    if (format === "csv") {
      await exportToCSV(pending, "comentarios-pendientes");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExportStats("pdf")}
        disabled={loading}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        📄 PDF
      </button>
      <button
        onClick={() => handleExportStats("csv")}
        disabled={loading}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        📊 CSV
      </button>
      {pending.length > 0 && (
        <button
          onClick={() => handleExportPending("csv")}
          disabled={loading}
          className="px-4 py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
        >
          ⏳ Pendientes
        </button>
      )}
    </div>
  );
};
