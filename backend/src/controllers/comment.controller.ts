import { Request, Response } from "express";
import commentService from "../services/comment.service";

export class CommentController {
  /**
   * Crear nuevo comentario
   * POST /api/comments
   */
  async createComment(req: Request, res: Response) {
    try {
      const { categoryId, matchId, content } = req.body;

      // Validaciones básicas
      if (!categoryId) {
        return res.status(400).json({
          error: "categoryId es requerido",
        });
      }

      if (!content || typeof content !== "string") {
        return res.status(400).json({
          error: "content es requerido y debe ser string",
        });
      }

      if (content.trim().length < 3) {
        return res.status(400).json({
          error: "El comentario debe tener al menos 3 caracteres",
        });
      }

      const comment = await commentService.createComment({
        categoryId,
        matchId: matchId || undefined,
        content,
      });

      return res.status(201).json({
        success: true,
        message: "Comentario creado exitosamente",
        data: comment,
      });
    } catch (error: any) {
      console.error("Error al crear comentario:", error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Error interno del servidor",
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }

  /**
   * Obtener comentarios por categoría
   * GET /api/categories/:categoryId/comments?page=1&limit=20
   */
  async getCommentsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!categoryId) {
        return res.status(400).json({
          error: "categoryId es requerido",
        });
      }

      const result = await commentService.getCommentsByCategory(
        categoryId,
        page,
        Math.min(limit, 50) // Máximo 50 por página
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error al obtener comentarios:", error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Error interno del servidor",
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }

  /**
   * Obtener comentarios por partido
   * GET /api/matches/:matchId/comments?page=1&limit=20
   */
  async getCommentsByMatch(req: Request, res: Response) {
    try {
      const { matchId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!matchId) {
        return res.status(400).json({
          error: "matchId es requerido",
        });
      }

      const result = await commentService.getCommentsByMatch(
        matchId,
        page,
        Math.min(limit, 50)
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error al obtener comentarios:", error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Error interno del servidor",
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }

  /**
   * Eliminar comentario
   * DELETE /api/comments/:commentId
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;

      if (!commentId) {
        return res.status(400).json({
          error: "commentId es requerido",
        });
      }

      const result = await commentService.deleteComment(commentId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Error al eliminar comentario:", error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Error interno del servidor",
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }

  /**
   * Obtener estadísticas (admin)
   * GET /api/comments/stats?categoryId=...
   */
  async getStats(req: Request, res: Response) {
    try {
      const { categoryId } = req.query;

      const stats = await commentService.getCommentStats(
        categoryId as string | undefined
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error("Error al obtener estadísticas:", error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Error interno del servidor",
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }
}

export default new CommentController();
