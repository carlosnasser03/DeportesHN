/**
 * Rutas de partidos
 * GET    /api/matches             - Obtener todos los partidos
 * GET    /api/matches/:id         - Obtener partido por ID
 * POST   /api/matches             - Crear partido
 * PUT    /api/matches/:id         - Actualizar partido
 * POST   /api/matches/:id/finish  - Finalizar partido con resultado
 * POST   /api/matches/:matchId/stats - Registrar estadísticas de jugador
 * DELETE /api/matches/:id         - Eliminar partido
 */

import { Router } from 'express';
import matchController from '@/controllers/match.controller';

const router = Router();

router.get('/', matchController.getAll.bind(matchController));
router.get('/:id', matchController.getById.bind(matchController));
router.post('/', matchController.create.bind(matchController));
router.put('/:id', matchController.update.bind(matchController));
router.post('/:id/finish', matchController.finish.bind(matchController));
router.post('/:matchId/stats', matchController.updateStats.bind(matchController));
router.delete('/:id', matchController.delete.bind(matchController));

export default router;
