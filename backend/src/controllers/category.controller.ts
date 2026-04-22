/**
 * Category Controller - Maneja requests HTTP para categorías
 */

import { Request, Response } from 'express';
import categoryService from '@/services/category.service';

export class CategoryController {
  /**
   * GET /api/categories
   */
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías',
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /api/categories/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(404).json({
        success: false,
        error: 'Categoría no encontrada',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/categories
   */
  async create(req: Request, res: Response) {
    try {
      const { name, label, color, ageRange, maxTeams } = req.body;

      if (!name || !label || !color || !ageRange) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos',
        });
      }

      const category = await categoryService.createCategory({
        name,
        label,
        color,
        ageRange,
        maxTeams,
      });

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría',
        message: (error as Error).message,
      });
    }
  }

  /**
   * PUT /api/categories/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, label, color, ageRange, maxTeams } = req.body;

      const category = await categoryService.updateCategory(id, {
        name,
        label,
        color,
        ageRange,
        maxTeams,
      });

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar categoría',
        message: (error as Error).message,
      });
    }
  }

  /**
   * DELETE /api/categories/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.deleteCategory(id);
      res.json({
        success: true,
        message: 'Categoría eliminada',
        data: category,
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar categoría',
        message: (error as Error).message,
      });
    }
  }
}

export default new CategoryController();
