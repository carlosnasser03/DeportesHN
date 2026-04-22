/**
 * Rutas de Standings (Tabla de Liga)
 * GET /api/standings/:categoryId         - Tabla de liga por categoría
 * GET /api/standings/:categoryId/scorers - Máximo goleador por categoría
 */

import { Router } from 'express';
import standingsController from '@/controllers/standings.controller';

const router = Router();

router.get('/:categoryId', standingsController.getStandings.bind(standingsController));
router.get('/:categoryId/scorers', standingsController.getScorers.bind(standingsController));

export default router;
