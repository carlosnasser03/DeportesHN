/**
 * User Controller - Maneja requests HTTP para usuarios y favoritos
 */

import { Request, Response } from 'express';
import userService from '@/services/user.service';

// Middleware para extraer user ID (por ahora usando header o session)
const getUserId = (req: Request): string => {
  return req.headers['x-user-id'] as string || req.query.userId as string || 'anonymous';
};

export class UserController {
  /**
   * GET /api/users/favorites
   * Obtener favoritos del usuario
   */
  async getFavorites(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const favorites = await userService.getFavorites(userId);

      res.json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      console.error('Error en getFavorites:', error);
      res.status(404).json({
        success: false,
        error: 'Error al obtener favoritos',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/users/favorites
   * Agregar equipo a favoritos
   */
  async addFavorite(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { teamId } = req.body;

      if (!teamId) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere teamId',
        });
      }

      const favorites = await userService.addFavorite(userId, teamId);

      res.status(201).json({
        success: true,
        message: 'Equipo agregado a favoritos',
        data: favorites,
      });
    } catch (error) {
      console.error('Error en addFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error al agregar favorito',
        message: (error as Error).message,
      });
    }
  }

  /**
   * DELETE /api/users/favorites/:teamId
   * Quitar equipo de favoritos
   */
  async removeFavorite(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { teamId } = req.params;

      if (!teamId) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere teamId',
        });
      }

      const favorites = await userService.removeFavorite(userId, teamId);

      res.json({
        success: true,
        message: 'Equipo removido de favoritos',
        data: favorites,
      });
    } catch (error) {
      console.error('Error en removeFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error al remover favorito',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/users/fcm-token
   * Registrar token FCM para notificaciones push
   */
  async registerFCMToken(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere token FCM',
        });
      }

      const result = await userService.registerFCMToken(userId, token);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error en registerFCMToken:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar token',
        message: (error as Error).message,
      });
    }
  }

  /**
   * PUT /api/users/preferences
   * Actualizar preferencias del usuario
   */
  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { notificationsEnabled, theme, language } = req.body;

      const user = await userService.updatePreferences(userId, {
        notificationsEnabled,
        theme,
        language,
      });

      res.json({
        success: true,
        message: 'Preferencias actualizadas',
        data: user,
      });
    } catch (error) {
      console.error('Error en updatePreferences:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar preferencias',
        message: (error as Error).message,
      });
    }
  }
}

export default new UserController();
