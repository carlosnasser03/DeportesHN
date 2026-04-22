/**
 * Rutas de usuarios y favoritos
 * GET    /api/users/favorites           - Obtener favoritos del usuario
 * POST   /api/users/favorites           - Agregar equipo a favoritos
 * DELETE /api/users/favorites/:teamId   - Quitar equipo de favoritos
 * POST   /api/users/fcm-token          - Registrar token FCM
 * PUT    /api/users/preferences         - Actualizar preferencias
 */

import { Router } from 'express';
import userController from '@/controllers/user.controller';

const router = Router();

router.get('/favorites', userController.getFavorites.bind(userController));
router.post('/favorites', userController.addFavorite.bind(userController));
router.delete('/favorites/:teamId', userController.removeFavorite.bind(userController));
router.post('/fcm-token', userController.registerFCMToken.bind(userController));
router.put('/preferences', userController.updatePreferences.bind(userController));

export default router;
