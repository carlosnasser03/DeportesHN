/**
 * User Service - Lógica de negocio para usuarios y favoritos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Obtener o crear usuario por ID
   */
  async getOrCreateUser(userId: string) {
    try {
      let user = await prisma.user.findUnique({
        where: { id: userId },
        include: { favoriteTeams: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: { id: userId },
          include: { favoriteTeams: true },
        });
      }

      return user;
    } catch (error) {
      console.error('Error en getOrCreateUser:', error);
      throw error;
    }
  }

  /**
   * Obtener favoritos del usuario
   */
  async getFavorites(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          favoriteTeams: {
            include: { category: true },
          },
        },
      });

      if (!user) {
        throw new Error(`Usuario no encontrado: ${userId}`);
      }

      return user.favoriteTeams;
    } catch (error) {
      console.error('Error en getFavorites:', error);
      throw error;
    }
  }

  /**
   * Agregar equipo a favoritos
   */
  async addFavorite(userId: string, teamId: string) {
    try {
      // Verificar que usuario existe
      await this.getOrCreateUser(userId);

      // Verificar que equipo existe
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new Error(`Equipo no encontrado: ${teamId}`);
      }

      // Agregar a favoritos
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteTeams: {
            connect: { id: teamId },
          },
        },
        include: { favoriteTeams: true },
      });

      return user.favoriteTeams;
    } catch (error) {
      console.error('Error en addFavorite:', error);
      throw error;
    }
  }

  /**
   * Quitar equipo de favoritos
   */
  async removeFavorite(userId: string, teamId: string) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteTeams: {
            disconnect: { id: teamId },
          },
        },
        include: { favoriteTeams: true },
      });

      return user.favoriteTeams;
    } catch (error) {
      console.error('Error en removeFavorite:', error);
      throw error;
    }
  }

  /**
   * Registrar token FCM para notificaciones push
   */
  async registerFCMToken(userId: string, token: string) {
    try {
      await this.getOrCreateUser(userId);

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          fcmTokens: {
            push: token,
          },
        },
      });

      return { success: true, message: 'Token registrado' };
    } catch (error) {
      console.error('Error en registerFCMToken:', error);
      throw error;
    }
  }

  /**
   * Actualizar preferencias del usuario
   */
  async updatePreferences(userId: string, data: Partial<{
    notificationsEnabled: boolean;
    theme: string;
    language: string;
  }>) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          notificationsEnabled: data.notificationsEnabled,
          theme: data.theme,
          language: data.language,
        },
      });

      return user;
    } catch (error) {
      console.error('Error en updatePreferences:', error);
      throw error;
    }
  }
}

export default new UserService();
