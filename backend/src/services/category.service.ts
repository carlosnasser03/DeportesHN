/**
 * Category Service - Lógica de negocio para categorías
 * SOLID: Single Responsibility - solo maneja categorías
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
  /**
   * Obtener todas las categorías
   */
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { teams: true, matches: true },
          },
        },
      });

      return categories;
    } catch (error) {
      console.error('Error en getAllCategories:', error);
      throw error;
    }
  }

  /**
   * Obtener categoría por ID
   */
  async getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          teams: true,
          matches: true,
          _count: {
            select: { teams: true, matches: true },
          },
        },
      });

      if (!category) {
        throw new Error(`Categoría no encontrada: ${id}`);
      }

      return category;
    } catch (error) {
      console.error('Error en getCategoryById:', error);
      throw error;
    }
  }

  /**
   * Obtener categoría por nombre (U7, U9, etc)
   */
  async getCategoryByName(name: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { name: name.toUpperCase() },
        include: {
          teams: true,
          _count: {
            select: { teams: true, matches: true },
          },
        },
      });

      return category;
    } catch (error) {
      console.error('Error en getCategoryByName:', error);
      throw error;
    }
  }

  /**
   * Crear nueva categoría
   */
  async createCategory(data: {
    name: string;
    label: string;
    color: string;
    ageRange: string;
    maxTeams?: number;
  }) {
    try {
      const category = await prisma.category.create({
        data: {
          name: data.name.toUpperCase(),
          label: data.label,
          color: data.color,
          ageRange: data.ageRange,
          maxTeams: data.maxTeams || 30,
        },
      });

      return category;
    } catch (error) {
      console.error('Error en createCategory:', error);
      throw error;
    }
  }

  /**
   * Actualizar categoría
   */
  async updateCategory(id: string, data: Partial<{
    name: string;
    label: string;
    color: string;
    ageRange: string;
    maxTeams: number;
  }>) {
    try {
      const category = await prisma.category.update({
        where: { id },
        data: {
          ...data,
          name: data.name ? data.name.toUpperCase() : undefined,
        },
      });

      return category;
    } catch (error) {
      console.error('Error en updateCategory:', error);
      throw error;
    }
  }

  /**
   * Eliminar categoría
   */
  async deleteCategory(id: string) {
    try {
      const category = await prisma.category.delete({
        where: { id },
      });

      return category;
    } catch (error) {
      console.error('Error en deleteCategory:', error);
      throw error;
    }
  }
}

export default new CategoryService();
