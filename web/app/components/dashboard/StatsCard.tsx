import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow";
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  green: "bg-green-50 border-green-200 text-green-700",
  red: "bg-red-50 border-red-200 text-red-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

const iconColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-600",
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  color,
}) => {
  return (
    <div
      className={`border rounded-lg p-6 ${colorClasses[color]} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
        <div className={`text-3xl ${iconColorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};
