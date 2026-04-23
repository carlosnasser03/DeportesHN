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
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
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
      const isDev = process.env.NODE_ENV === 'development';
      res.status(404).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
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
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
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
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
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
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }
}

export default new CategoryController();
