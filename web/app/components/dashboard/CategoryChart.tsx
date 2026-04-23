"use client";

import React from "react";

interface CategoryData {
  categoryId: string;
  categoryName: string;
  count: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  maxValue?: number;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  maxValue,
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.count), 1);
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-amber-500",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Comentarios por Categoría
      </h3>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.categoryId} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium text-gray-700 truncate">
              {item.categoryName}
            </div>

            <div className="flex-1">
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[index % colors.length]} transition-all duration-300`}
                  style={{
                    width: `${(item.count / max) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="w-16 text-right">
              <span className="text-sm font-bold text-gray-900">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No hay datos disponibles
        </p>
      )}
    </div>
  );
};
