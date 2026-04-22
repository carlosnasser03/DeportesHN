/**
 * Team Service - Lógica de negocio para equipos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TeamService {
  /**
   * Obtener todos los equipos
   */
  async getAllTeams() {
    try {
      const teams = await prisma.team.findMany({
        include: {
          category: true,
          _count: {
            select: {
              homeMatches: true,
              awayMatches: true,
              favoritedBy: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return teams;
    } catch (error) {
      console.error('Error en getAllTeams:', error);
      throw error;
    }
  }

  /**
   * Obtener equipos por categoría
   */
  async getTeamsByCategory(categoryId: string) {
    try {
      const teams = await prisma.team.findMany({
        where: { categoryId },
        include: {
          category: true,
          _count: {
            select: {
              homeMatches: true,
              awayMatches: true,
              favoritedBy: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return teams;
    } catch (error) {
      console.error('Error en getTeamsByCategory:', error);
      throw error;
    }
  }

  /**
   * Obtener equipo por ID
   */
  async getTeamById(id: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id },
        include: {
          category: true,
          homeMatches: {
            include: { awayTeam: true },
            orderBy: { date: 'desc' },
          },
          awayMatches: {
            include: { homeTeam: true },
            orderBy: { date: 'desc' },
          },
          _count: {
            select: {
              homeMatches: true,
              awayMatches: true,
              favoritedBy: true,
            },
          },
        },
      });

      if (!team) {
        throw new Error(`Equipo no encontrado: ${id}`);
      }

      return team;
    } catch (error) {
      console.error('Error en getTeamById:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo equipo
   */
  async createTeam(data: {
    name: string;
    categoryId: string;
    town: string;
    coach?: string;
    logo?: string;
  }) {
    try {
      // Verificar que categoría existe
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new Error(`Categoría no existe: ${data.categoryId}`);
      }

      // Verificar que no exceda máximo de equipos
      const teamCount = await prisma.team.count({
        where: { categoryId: data.categoryId },
      });

      if (teamCount >= category.maxTeams) {
        throw new Error(`Categoría ${category.name} alcanzó máximo de ${category.maxTeams} equipos`);
      }

      const team = await prisma.team.create({
        data: {
          name: data.name.trim(),
          categoryId: data.categoryId,
          town: data.town.trim(),
          coach: data.coach?.trim(),
          logo: data.logo,
        },
      });

      return team;
    } catch (error) {
      console.error('Error en createTeam:', error);
      throw error;
    }
  }

  /**
   * Actualizar equipo
   */
  async updateTeam(id: string, data: Partial<{
    name: string;
    town: string;
    coach: string;
    logo: string;
  }>) {
    try {
      const team = await prisma.team.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          town: data.town?.trim(),
          coach: data.coach?.trim(),
          logo: data.logo,
        },
      });

      return team;
    } catch (error) {
      console.error('Error en updateTeam:', error);
      throw error;
    }
  }

  /**
   * Eliminar equipo
   */
  async deleteTeam(id: string) {
    try {
      const team = await prisma.team.delete({
        where: { id },
      });

      return team;
    } catch (error) {
      console.error('Error en deleteTeam:', error);
      throw error;
    }
  }
}

export default new TeamService();
