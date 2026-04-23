import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

/**
 * Rutas de autenticación
 * POST /api/auth/token - Generar JWT con admin_key
 */

router.post('/token', authController.generateToken.bind(authController));

export default router;
