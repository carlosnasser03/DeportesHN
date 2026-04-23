import { useState } from "react";

export const useReportExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = async (data: any, filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.pdf`;
        a.click();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async (data: any, filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data: any) => {
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(","),
      ...data.map((row: any) =>
        headers.map((h) => `"${row[h] || ""}"`.replace(/"/g, '""')).join(",")
      ),
    ].join("\n");
    return csv;
  };

  return { exportToPDF, exportToCSV, loading, error };
};
