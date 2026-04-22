"use client";

import { useEffect, useState } from "react";
import { categoriesAPI } from "@/lib/api";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  ageRange: string;
  _count?: {
    teams: number;
  };
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="block"
        >
          <div
            className="p-6 rounded-lg border-l-4 cursor-pointer hover:shadow-lg transition-shadow"
            style={{
              borderColor: category.color,
              backgroundColor: `${category.color}10`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-600">{category.ageRange}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {category._count?.teams || 0} equipos
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
