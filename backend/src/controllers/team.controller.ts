/**
 * Team Controller - Maneja requests HTTP para equipos
 */

import { Request, Response } from 'express';
import teamService from '@/services/team.service';

export class TeamController {
  /**
   * GET /api/teams
   */
  async getAll(req: Request, res: Response) {
    try {
      const { categoryId } = req.query;

      let teams;
      if (categoryId) {
        teams = await teamService.getTeamsByCategory(categoryId as string);
      } else {
        teams = await teamService.getAllTeams();
      }

      res.json({
        success: true,
        data: teams,
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener equipos',
        message: (error as Error).message,
      });
    }
  }

  /**
   * GET /api/teams/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);
      res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(404).json({
        success: false,
        error: 'Equipo no encontrado',
        message: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/teams
   */
  async create(req: Request, res: Response) {
    try {
      const { name, categoryId, town, coach, logo } = req.body;

      if (!name || !categoryId || !town) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos',
        });
      }

      const team = await teamService.createTeam({
        name,
        categoryId,
        town,
        coach,
        logo,
      });

      res.status(201).json({
        success: true,
        data: team,
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear equipo',
        message: (error as Error).message,
      });
    }
  }

  /**
   * PUT /api/teams/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, town, coach, logo } = req.body;

      const team = await teamService.updateTeam(id, {
        name,
        town,
        coach,
        logo,
      });

      res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar equipo',
        message: (error as Error).message,
      });
    }
  }

  /**
   * DELETE /api/teams/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await teamService.deleteTeam(id);
      res.json({
        success: true,
        message: 'Equipo eliminado',
        data: team,
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar equipo',
        message: (error as Error).message,
      });
    }
  }
}

export default new TeamController();
