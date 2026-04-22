/**
 * Standings Service - Calcula tabla de liga y estadísticas por categoría
 * Cálculos en tiempo real desde Matches y PlayerStats
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StandingsService {
  /**
   * Calcular tabla de liga para una categoría
   * Devuelve: Posición, Equipo, Pts, PJ, PG, PE, PP, GF, GC, DG, Tarjetas
   */
  async getCategoryStandings(categoryId: string) {
    try {
      // Obtener todos los teams de la categoría con sus jugadores
      const teams = await prisma.team.findMany({
        where: { categoryId },
        include: {
          organization: true,
          players: true,
          homeMatches: {
            where: { status: 'finished' },
            include: { playerStats: true },
          },
          awayMatches: {
            where: { status: 'finished' },
            include: { playerStats: true },
          },
        },
      });

      // Calcular estadísticas para cada team
      const standings = teams.map(team => {
        let points = 0;
        let pg = 0; // Partidos ganados
        let pe = 0; // Partidos empatados
        let pp = 0; // Partidos perdidos
        let gf = 0; // Goles a favor
        let gc = 0; // Goles en contra
        let yellowCards = 0;
        let redCards = 0;
        const playerIds = new Set(team.players.map(p => p.id));

        // Procesar partidos en casa
        for (const match of team.homeMatches) {
          gf += match.homeScore || 0;
          gc += match.awayScore || 0;

          if ((match.homeScore || 0) > (match.awayScore || 0)) {
            pg++;
            points += 3;
          } else if ((match.homeScore || 0) === (match.awayScore || 0)) {
            pe++;
            points += 1;
          } else {
            pp++;
          }

          // Contar tarjetas de jugadores locales
          for (const stat of match.playerStats) {
            if (playerIds.has(stat.playerId)) {
              yellowCards += stat.yellowCards;
              redCards += stat.redCards;
            }
          }
        }

        // Procesar partidos fuera de casa
        for (const match of team.awayMatches) {
          gf += match.awayScore || 0;
          gc += match.homeScore || 0;

          if ((match.awayScore || 0) > (match.homeScore || 0)) {
            pg++;
            points += 3;
          } else if ((match.awayScore || 0) === (match.homeScore || 0)) {
            pe++;
            points += 1;
          } else {
            pp++;
          }

          // Contar tarjetas de jugadores visitantes
          for (const stat of match.playerStats) {
            if (playerIds.has(stat.playerId)) {
              yellowCards += stat.yellowCards;
              redCards += stat.redCards;
            }
          }
        }

        const pj = pg + pe + pp; // Partidos jugados
        const dg = gf - gc; // Diferencia de goles

        return {
          team: {
            id: team.id,
            name: team.organization.name,
            logo: team.organization.logo,
            color: team.organization.color,
          },
          posicion: 0,
          pts: points,
          pj,
          pg,
          pe,
          pp,
          gf,
          gc,
          dg,
          yellowCards,
          redCards,
        };
      });

      // Ordenar por puntos (DESC), diferencia de goles (DESC), goles a favor (DESC)
      standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
      });

      // Asignar posiciones
      const finalStandings = standings.map((standing, index) => ({
        ...standing,
        posicion: index + 1,
      }));

      return finalStandings;
    } catch (error) {
      console.error('Error en getCategoryStandings:', error);
      throw error;
    }
  }

  /**
   * Obtener máximo goleador por categoría
   */
  async getCategoryScorerss(categoryId: string) {
    try {
      const scorers = await prisma.playerStat.groupBy({
        by: ['playerId'],
        where: {
          match: {
            categoryId,
            status: 'finished',
          },
        },
        _sum: {
          goalsScored: true,
          assists: true,
          yellowCards: true,
          redCards: true,
        },
        orderBy: {
          _sum: {
            goalsScored: 'desc',
          },
        },
        take: 20,
      });

      // Obtener datos del jugador
      const scorersWithDetails = await Promise.all(
        scorers.map(async (scorer) => {
          const player = await prisma.player.findUnique({
            where: { id: scorer.playerId },
            include: {
              team: {
                include: {
                  organization: true,
                },
              },
            },
          });

          return {
            posicion: 0,
            player: {
              id: player?.id,
              name: player?.name,
              dorsal: player?.dorsal,
              posicion: player?.posicion,
              photoUrl: player?.photoUrl,
            },
            team: {
              name: player?.team.organization.name,
              logo: player?.team.organization.logo,
            },
            goals: scorer._sum.goalsScored || 0,
            assists: scorer._sum.assists || 0,
            yellowCards: scorer._sum.yellowCards || 0,
            redCards: scorer._sum.redCards || 0,
          };
        })
      );

      // Asignar posiciones
      const finalScorers = scorersWithDetails.map((scorer, index) => ({
        ...scorer,
        posicion: index + 1,
      }));

      return finalScorers;
    } catch (error) {
      console.error('Error en getCategoryScorerss:', error);
      throw error;
    }
  }
}

export default new StandingsService();
