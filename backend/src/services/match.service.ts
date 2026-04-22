/**
 * Match Service - Lógica de negocio para partidos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MatchService {
  /**
   * Obtener todos los partidos
   */
  async getAllMatches() {
    try {
      const matches = await prisma.match.findMany({
        include: {
          category: true,
          homeTeam: {
            include: {
              organization: true,
            },
          },
          awayTeam: {
            include: {
              organization: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      return matches;
    } catch (error) {
      console.error('Error en getAllMatches:', error);
      throw error;
    }
  }

  /**
   * Obtener partidos por equipo (home y away)
   */
  async getMatchesByTeam(teamId: string) {
    try {
      const matches = await prisma.match.findMany({
        where: {
          OR: [
            { homeTeamId: teamId },
            { awayTeamId: teamId },
          ],
        },
        include: {
          category: true,
          homeTeam: {
            include: {
              organization: true,
            },
          },
          awayTeam: {
            include: {
              organization: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      return matches;
    } catch (error) {
      console.error('Error en getMatchesByTeam:', error);
      throw error;
    }
  }

  /**
   * Obtener partidos por categoría
   */
  async getMatchesByCategory(categoryId: string) {
    try {
      const matches = await prisma.match.findMany({
        where: { categoryId },
        include: {
          category: true,
          homeTeam: {
            include: {
              organization: true,
            },
          },
          awayTeam: {
            include: {
              organization: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      return matches;
    } catch (error) {
      console.error('Error en getMatchesByCategory:', error);
      throw error;
    }
  }

  /**
   * Obtener partido por ID
   */
  async getMatchById(id: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          category: true,
          homeTeam: {
            include: {
              organization: true,
            },
          },
          awayTeam: {
            include: {
              organization: true,
            },
          },
        },
      });

      if (!match) {
        throw new Error(`Partido no encontrado: ${id}`);
      }

      return match;
    } catch (error) {
      console.error('Error en getMatchById:', error);
      throw error;
    }
  }

  /**
   * Obtener partidos próximos (scheduled o live)
   */
  async getUpcomingMatches(limit: number = 50) {
    try {
      const matches = await prisma.match.findMany({
        where: {
          status: {
            in: ['scheduled', 'live'],
          },
          date: {
            gte: new Date(),
          },
        },
        include: {
          category: true,
          homeTeam: {
            include: {
              organization: true,
            },
          },
          awayTeam: {
            include: {
              organization: true,
            },
          },
        },
        orderBy: { date: 'asc' },
        take: limit,
      });

      return matches;
    } catch (error) {
      console.error('Error en getUpcomingMatches:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo partido
   */
  async createMatch(data: {
    categoryId: string;
    homeTeamId: string;
    awayTeamId: string;
    date: Date;
    location: string;
  }) {
    try {
      if (data.homeTeamId === data.awayTeamId) {
        throw new Error('Un equipo no puede jugar contra sí mismo');
      }

      const match = await prisma.match.create({
        data: {
          categoryId: data.categoryId,
          homeTeamId: data.homeTeamId,
          awayTeamId: data.awayTeamId,
          date: new Date(data.date),
          location: data.location.trim(),
          status: 'scheduled',
        },
      });

      return match;
    } catch (error) {
      console.error('Error en createMatch:', error);
      throw error;
    }
  }

  /**
   * Actualizar partido (resultado, estado)
   */
  async updateMatch(id: string, data: Partial<{
    date: Date;
    location: string;
    status: string;
    homeScore: number;
    awayScore: number;
  }>) {
    try {
      const match = await prisma.match.update({
        where: { id },
        data: {
          date: data.date ? new Date(data.date) : undefined,
          location: data.location?.trim(),
          status: data.status,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
        },
      });

      return match;
    } catch (error) {
      console.error('Error en updateMatch:', error);
      throw error;
    }
  }

  /**
   * Finalizar partido con resultado
   */
  async finishMatch(id: string, homeScore: number, awayScore: number) {
    try {
      const match = await prisma.match.update({
        where: { id },
        data: {
          status: 'finished',
          homeScore,
          awayScore,
        },
      });

      return match;
    } catch (error) {
      console.error('Error en finishMatch:', error);
      throw error;
    }
  }

  /**
   * Actualizar estadísticas de jugador en un partido
   */
  async updatePlayerStats(matchId: string, data: {
    playerId: string;
    goalsScored?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
  }) {
    try {
      // Verificar que el partido existe
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error(`Partido no encontrado: ${matchId}`);
      }

      // Verificar que el jugador existe
      const player = await prisma.player.findUnique({
        where: { id: data.playerId },
      });

      if (!player) {
        throw new Error(`Jugador no encontrado: ${data.playerId}`);
      }

      // Buscar si ya existe stat para este jugador+partido
      const existingStat = await prisma.playerStat.findUnique({
        where: {
          playerId_matchId: {
            playerId: data.playerId,
            matchId: matchId,
          },
        },
      });

      let stat;

      if (existingStat) {
        // Actualizar stat existente
        stat = await prisma.playerStat.update({
          where: { id: existingStat.id },
          data: {
            goalsScored: data.goalsScored !== undefined ? data.goalsScored : existingStat.goalsScored,
            assists: data.assists !== undefined ? data.assists : existingStat.assists,
            yellowCards: data.yellowCards !== undefined ? data.yellowCards : existingStat.yellowCards,
            redCards: data.redCards !== undefined ? data.redCards : existingStat.redCards,
          },
        });
      } else {
        // Crear nueva stat
        stat = await prisma.playerStat.create({
          data: {
            playerId: data.playerId,
            matchId: matchId,
            goalsScored: data.goalsScored || 0,
            assists: data.assists || 0,
            yellowCards: data.yellowCards || 0,
            redCards: data.redCards || 0,
          },
          include: {
            player: true,
            match: true,
          },
        });
      }

      return stat;
    } catch (error) {
      console.error('Error en updatePlayerStats:', error);
      throw error;
    }
  }

  /**
   * Eliminar partido
   */
  async deleteMatch(id: string) {
    try {
      const match = await prisma.match.delete({
        where: { id },
      });

      return match;
    } catch (error) {
      console.error('Error en deleteMatch:', error);
      throw error;
    }
  }
}

export default new MatchService();
