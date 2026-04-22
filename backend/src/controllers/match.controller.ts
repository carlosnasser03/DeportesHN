/**
 * Match Controller - Maneja requests HTTP para partidos
 */

import { Request, Response } from 'express';
import matchService from '@/services/match.service';

export class MatchController {
  /**
   * GET /api/matches
   */
  async getAll(req: Request, res: Response) {
    try {
      const { teamId, categoryId, upcoming } = req.query;

      let matches;
      if (teamId) {
        matches = await matchService.getMatchesByTeam(teamId as string);
      } else if (categoryId) {
        matches = await matchService.getMatchesByCategory(categoryId as string);
      } else if (upcoming) {
        matches = await matchService.getUpcomingMatches(50);
      } else {
        matches = await matchService.getAllMatches();
      }

      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener partidos',
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /api/matches/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await matchService.getMatchById(id);
      res.json({
        success: true,
        data: match,
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(404).json({
        success: false,
        error: 'Partido no encontrado',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/matches
   */
  async create(req: Request, res: Response) {
    try {
      const { categoryId, homeTeamId, awayTeamId, date, location } = req.body;

      if (!categoryId || !homeTeamId || !awayTeamId || !date || !location) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos',
        });
      }

      const match = await matchService.createMatch({
        categoryId,
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        location,
      });

      res.status(201).json({
        success: true,
        data: match,
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear partido',
        message: (error as Error).message,
      });
    }
  }

  /**
   * PUT /api/matches/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date, location, status, homeScore, awayScore } = req.body;

      const match = await matchService.updateMatch(id, {
        date: date ? new Date(date) : undefined,
        location,
        status,
        homeScore,
        awayScore,
      });

      res.json({
        success: true,
        data: match,
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar partido',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/matches/:id/finish
   * Finalizar partido con resultado
   */
  async finish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { homeScore, awayScore } = req.body;

      if (typeof homeScore !== 'number' || typeof awayScore !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Se requieren scores válidos',
        });
      }

      const match = await matchService.finishMatch(id, homeScore, awayScore);
      res.json({
        success: true,
        data: match,
      });
    } catch (error) {
      console.error('Error en finish:', error);
      res.status(500).json({
        success: false,
        error: 'Error al finalizar partido',
        message: (error as Error).message,
      });
    }
  }

  /**
   * DELETE /api/matches/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await matchService.deleteMatch(id);
      res.json({
        success: true,
        message: 'Partido eliminado',
        data: match,
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar partido',
        message: (error as Error).message,
      });
    }
  }
}

export default new MatchController();
