/**
 * Standings Controller - Endpoints para tabla de liga y goleadores
 */

import { Request, Response } from 'express';
import standingsService from '@/services/standings.service';

export class StandingsController {
  /**
   * GET /api/standings/:categoryId
   * Obtener tabla de liga para una categoría
   */
  async getStandings(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;

      const standings = await standingsService.getCategoryStandings(categoryId);

      res.json({
        success: true,
        data: standings,
      });
    } catch (error) {
      console.error('Error en getStandings:', error);
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }

  /**
   * GET /api/standings/:categoryId/scorers
   * Obtener máximo goleador por categoría
   */
  async getScorers(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;

      const scorers = await standingsService.getCategoryScorerss(categoryId);

      res.json({
        success: true,
        data: scorers,
      });
    } catch (error) {
      console.error('Error en getScorers:', error);
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }
}

export default new StandingsController();
