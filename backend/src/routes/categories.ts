/**
 * Rutas de categorías
 * GET    /api/categories          - Obtener todas las categorías
 * GET    /api/categories/:id      - Obtener categoría por ID
 * POST   /api/categories          - Crear categoría
 * PUT    /api/categories/:id      - Actualizar categoría
 * DELETE /api/categories/:id      - Eliminar categoría
 */

import { Router } from 'express';
import categoryController from '@/controllers/category.controller';

const router = Router();

router.get('/', categoryController.getAll.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));
router.post('/', categoryController.create.bind(categoryController));
router.put('/:id', categoryController.update.bind(categoryController));
router.delete('/:id', categoryController.delete.bind(categoryController));

export default router;
